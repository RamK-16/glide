import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { CompactSelection, DataEditor, type DataEditorProps, type GridCell, type Item } from "../src/index.js";
import { drawGrid } from "../src/internal/data-grid/render/data-grid-render.js";
import type { DrawGridArg } from "../src/internal/data-grid/render/draw-grid-arg.js";
import { basicProps, Context, prep, standardAfterEach, standardBeforeEach } from "./test-utils.js";

// Признак открытого редактора доходит от DataEditor до отрисовки: без него
// блок под редактором снова зальётся цветом выделения. Обводку диапазона под
// редактором DataEditor тоже снимает, чтобы блок выглядел как одиночная ячейка.

vi.mock("../src/internal/data-grid/render/data-grid-render.js", async importOriginal => {
    const actual = await importOriginal<typeof import("../src/internal/data-grid/render/data-grid-render.js")>();
    return { ...actual, drawGrid: vi.fn(actual.drawGrid) };
});

const drawGridMock = vi.mocked(drawGrid);

const lastDrawArg = (): DrawGridArg => {
    const call = drawGridMock.mock.lastCall;
    expect(call).toBeDefined();
    return (call as Parameters<typeof drawGrid>)[0];
};

// Столбец 1, строки 1–3 один блок; выделение растянуто ровно по нему.
const BLOCK = { x: 1, y: 1, width: 1, height: 3 };

const getBlockCellContent = (cell: Item): GridCell => {
    const content = basicProps.getCellContent(cell);
    return cell[0] === 1 && cell[1] >= 1 && cell[1] <= 3 ? { ...content, spanRows: [1, 3] } : content;
};

const outlinesBlock = (arg: DrawGridArg) =>
    arg.highlightRegions?.some(
        r =>
            r.style === "solid-outline" &&
            r.range.x === BLOCK.x &&
            r.range.y === BLOCK.y &&
            r.range.width === BLOCK.width &&
            r.range.height === BLOCK.height
    ) === true;

describe("признак открытого редактора в отрисовке", () => {
    vi.mock("../src/common/resize-detector", () => {
        return {
            useResizeDetector: () => ({ ref: undefined, width: 1000, height: 1000 }),
        };
    });

    beforeEach(() => {
        standardBeforeEach();
        drawGridMock.mockClear();
    });

    afterEach(() => {
        standardAfterEach();
        vi.useRealTimers();
    });

    const renderAndOpen = async (drawFocusRing: DataEditorProps["drawFocusRing"], inBlock = false) => {
        vi.useFakeTimers();
        render(
            <DataEditor
                {...basicProps}
                drawFocusRing={drawFocusRing}
                getCellContent={inBlock ? getBlockCellContent : basicProps.getCellContent}
                gridSelection={{
                    current: {
                        cell: [1, 1],
                        range: inBlock ? BLOCK : { x: 1, y: 1, width: 1, height: 1 },
                        rangeStack: [],
                    },
                    columns: CompactSelection.empty(),
                    rows: CompactSelection.empty(),
                }}
            />,
            { wrapper: Context }
        );
        prep();
        const before = lastDrawArg();
        const canvas = screen.getByTestId("data-grid-canvas");
        fireEvent.keyDown(canvas, { keyCode: 74, key: "j" });
        await act(() => new Promise(r => window.setTimeout(r, 500)));
        expect(screen.getByDisplayValue("j")).toBeDefined();
        return { before, after: lastDrawArg() };
    };

    test('режим "no-editor": до открытия редактора признака нет, после открытия есть, рамка гаснет', async () => {
        const { before, after } = await renderAndOpen("no-editor");
        expect(before.editorOpen).toBe(false);
        expect(before.drawFocus).toBe(true);
        expect(after.editorOpen).toBe(true);
        expect(after.drawFocus).toBe(false);
    });

    test("рамка выключена: признак открытого редактора всё равно доходит", async () => {
        const { before, after } = await renderAndOpen(false);
        expect(before.editorOpen).toBe(false);
        expect(after.editorOpen).toBe(true);
        expect(after.drawFocus).toBe(false);
    });

    test.each(["no-editor", false] as const)(
        "drawFocusRing=%s: обводка блока, растянутого выделением, есть до открытия редактора и снята под ним",
        async drawFocusRing => {
            const { before, after } = await renderAndOpen(drawFocusRing, true);
            expect(outlinesBlock(before)).toBe(true);
            expect(outlinesBlock(after)).toBe(false);
        }
    );

    test("с рамкой фокуса обводка блока остаётся и под редактором", async () => {
        const { after } = await renderAndOpen(true, true);
        expect(after.editorOpen).toBe(true);
        expect(outlinesBlock(after)).toBe(true);
    });
});
