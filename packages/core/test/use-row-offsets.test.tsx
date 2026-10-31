import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test } from "vitest";
import type { RowHeightCallback } from "../src/internal/scrolling-data-grid/row-offsets.js";
import { useRowOffsets } from "../src/internal/scrolling-data-grid/use-row-offsets.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const ROWS = 100;
const height30 = () => 30;
const height60 = () => 60;
const never = new Promise<never>(() => undefined);

const shown: { offsets?: Float64Array } = {};

const Probe: React.FC<{ rowHeight: RowHeightCallback }> = ({ rowHeight }) => {
    const offsets = useRowOffsets(ROWS, rowHeight);
    React.useLayoutEffect(() => {
        shown.offsets = offsets;
    });
    return null;
};

const Suspender: React.FC<{ suspend: boolean }> = ({ suspend }) => {
    if (suspend) throw never;
    return null;
};

const App: React.FC<{ rowHeight: RowHeightCallback; suspend: boolean }> = ({ rowHeight, suspend }) => (
    <React.Suspense fallback={null}>
        <Probe rowHeight={rowHeight} />
        <Suspender suspend={suspend} />
    </React.Suspense>
);

let nextVersion = 0;

const counted = (height: (row: number) => number) => {
    const asked: number[] = [];
    const fn: RowHeightCallback & { version: number } = Object.assign(
        (row: number) => {
            asked.push(row);
            return height(row);
        },
        { version: ++nextVersion }
    );
    return { fn, asked };
};

const withChanges = (
    fn: RowHeightCallback & { version: number },
    previous: RowHeightCallback & { version: number },
    from: number,
    to: number
): RowHeightCallback => Object.assign(fn, { changes: { previousVersion: previous.version, from, to } });

let root: Root | undefined;

afterEach(() => {
    React.act(() => root?.unmount());
    root = undefined;
});

describe("useRowOffsets", () => {
    test("число вместо колбэка — offsets нет", () => {
        let offsets: Float64Array | undefined = new Float64Array(1);
        const NumberProbe = () => {
            offsets = useRowOffsets(ROWS, 30);
            return null;
        };
        root = createRoot(document.createElement("div"));
        React.act(() => root?.render(<NumberProbe />));
        expect(offsets).toBeUndefined();
    });

    test("выброшенный рендер с новыми высотами не портит offsets показанной таблицы", () => {
        root = createRoot(document.createElement("div"));
        React.act(() => root?.render(<App rowHeight={height30} suspend={false} />));
        expect(shown.offsets?.[ROWS]).toBe(3000);

        React.act(() => React.startTransition(() => root?.render(<App rowHeight={height60} suspend={true} />)));
        expect(shown.offsets?.[ROWS]).toBe(3000);

        React.act(() => root?.render(<App rowHeight={height30} suspend={false} />));
        expect(shown.offsets?.[ROWS]).toBe(3000);
        expect(shown.offsets?.[50]).toBe(1500);
    });

    test("новые высоты после коммита попадают в offsets, буферы чередуются", () => {
        root = createRoot(document.createElement("div"));
        React.act(() => root?.render(<App rowHeight={height30} suspend={false} />));
        const first = shown.offsets;

        React.act(() => root?.render(<App rowHeight={height60} suspend={false} />));
        expect(shown.offsets?.[ROWS]).toBe(6000);
        expect(shown.offsets).not.toBe(first);
        expect(first?.[ROWS]).toBe(3000);

        React.act(() => root?.render(<App rowHeight={() => 40} suspend={false} />));
        expect(shown.offsets?.[ROWS]).toBe(4000);
        expect(shown.offsets).toBe(first);
    });

    describe("подсказка changes", () => {
        test("после прежнего колбэка спрашиваются только изменившиеся строки", () => {
            root = createRoot(document.createElement("div"));
            const first = counted(height30);
            React.act(() => root?.render(<App rowHeight={first.fn} suspend={false} />));
            expect(first.asked).toHaveLength(ROWS);

            const second = counted(row => (row === 10 ? 50 : 30));
            React.act(() => root?.render(<App rowHeight={withChanges(second.fn, first.fn, 10, 10)} suspend={false} />));
            expect(second.asked).toEqual([10]);
            expect(shown.offsets?.[11]).toBe(350);
            expect(shown.offsets?.[ROWS]).toBe(3020);

            const third = counted(row => (row === 10 || row === 20 ? 50 : 30));
            React.act(() => root?.render(<App rowHeight={withChanges(third.fn, second.fn, 20, 20)} suspend={false} />));
            expect(third.asked).toEqual([20]);
            expect(shown.offsets?.[21]).toBe(670);
            expect(shown.offsets?.[ROWS]).toBe(3040);
        });

        test("подсказка от другой версии: полный пересчёт", () => {
            root = createRoot(document.createElement("div"));
            React.act(() => root?.render(<App rowHeight={height30} suspend={false} />));

            const other = counted(height60);
            const next = counted(height60);
            React.act(() => root?.render(<App rowHeight={withChanges(next.fn, other.fn, 0, 0)} suspend={false} />));
            expect(next.asked).toHaveLength(ROWS);
            expect(shown.offsets?.[ROWS]).toBe(6000);
        });

        test("подсказка к выброшенному рендеру не портит показанную таблицу", () => {
            root = createRoot(document.createElement("div"));
            const first = counted(height30);
            React.act(() => root?.render(<App rowHeight={first.fn} suspend={false} />));

            const droppedCounted = counted(row => (row < 50 ? 60 : 30));
            const dropped = withChanges(droppedCounted.fn, first.fn, 0, 49);
            React.act(() => React.startTransition(() => root?.render(<App rowHeight={dropped} suspend={true} />)));
            expect(shown.offsets?.[ROWS]).toBe(3000);

            const next = counted(row => (row < 50 ? 60 : row === 70 ? 40 : 30));
            React.act(() =>
                root?.render(<App rowHeight={withChanges(next.fn, droppedCounted.fn, 70, 70)} suspend={false} />)
            );
            expect(next.asked).toEqual([70]);
            expect(shown.offsets?.[ROWS]).toBe(4510);
            expect(shown.offsets?.[50]).toBe(3000);
        });
    });
});
