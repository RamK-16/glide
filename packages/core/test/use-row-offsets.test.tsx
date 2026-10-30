import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test } from "vitest";
import { useRowOffsets } from "../src/internal/scrolling-data-grid/use-row-offsets.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const ROWS = 100;
const height30 = () => 30;
const height60 = () => 60;
const never = new Promise<never>(() => undefined);

const shown: { offsets?: Float64Array } = {};

const Probe: React.FC<{ rowHeight: (row: number) => number }> = ({ rowHeight }) => {
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

const App: React.FC<{ rowHeight: (row: number) => number; suspend: boolean }> = ({ rowHeight, suspend }) => (
    <React.Suspense fallback={null}>
        <Probe rowHeight={rowHeight} />
        <Suspender suspend={suspend} />
    </React.Suspense>
);

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
});
