import { describe, expect, test } from "vitest";
import {
    CompactSelection,
    GridCellKind,
    type GridSelection,
    type InnerGridCell,
    type Item,
    type Rectangle,
} from "../src/internal/data-grid/data-grid-types.js";
import {
    getFillSelection,
    rangeTouchesSpan,
    selectionRangeTouchesSpan,
    spanTouchesSelection,
} from "../src/internal/data-grid/render/data-grid-render.cells.js";

// Задевает ли выделение слитый блок: блок красится целиком при любом касании.
const rect = (x: number, y: number, width: number, height: number): Rectangle => ({ x, y, width, height });
const cols: readonly [number, number] = [2, 4];
const rows: readonly [number, number] = [5, 7];

describe("rangeTouchesSpan", () => {
    test("прямоугольник внутри блока, вокруг блока и на его краю", () => {
        expect(rangeTouchesSpan(rect(3, 6, 1, 1), cols, rows)).toBe(true);
        expect(rangeTouchesSpan(rect(0, 0, 100, 100), cols, rows)).toBe(true);
        expect(rangeTouchesSpan(rect(4, 7, 3, 3), cols, rows)).toBe(true);
    });

    test("прямоугольник рядом с блоком не задевает его", () => {
        expect(rangeTouchesSpan(rect(0, 5, 2, 3), cols, rows)).toBe(false);
        expect(rangeTouchesSpan(rect(2, 0, 3, 5), cols, rows)).toBe(false);
        expect(rangeTouchesSpan(rect(5, 5, 1, 3), cols, rows)).toBe(false);
        expect(rangeTouchesSpan(rect(2, 8, 3, 1), cols, rows)).toBe(false);
    });
});

function sel(range: Rectangle, rangeStack: Rectangle[] = []): GridSelection {
    return {
        current: { cell: [range.x, range.y], range, rangeStack },
        rows: CompactSelection.empty(),
        columns: CompactSelection.empty(),
    };
}

describe("selectionRangeTouchesSpan", () => {
    test("одна ячейка в блоке красит его только при рамке фокуса", () => {
        expect(selectionRangeTouchesSpan(sel(rect(3, 7, 1, 1)), cols, rows, true)).toBe(true);
        expect(selectionRangeTouchesSpan(sel(rect(3, 7, 1, 1)), cols, rows, false)).toBe(false);
    });

    test("диапазон из нескольких ячеек красит блок и без рамки фокуса", () => {
        expect(selectionRangeTouchesSpan(sel(rect(3, 7, 2, 2)), cols, rows, false)).toBe(true);
    });

    test("диапазон из стека (выбор с Ctrl) тоже красит блок", () => {
        expect(selectionRangeTouchesSpan(sel(rect(0, 0, 1, 1), [rect(4, 5, 1, 1)]), cols, rows, true)).toBe(true);
    });

    test("без выделения и мимо блока: не красит", () => {
        const empty: GridSelection = {
            current: undefined,
            rows: CompactSelection.empty(),
            columns: CompactSelection.empty(),
        };
        expect(selectionRangeTouchesSpan(empty, cols, rows, true)).toBe(false);
        expect(selectionRangeTouchesSpan(sel(rect(0, 0, 2, 2)), cols, rows, true)).toBe(false);
    });
});

describe("spanTouchesSelection", () => {
    test("выбранная строка или колонка внутри блока", () => {
        const none = CompactSelection.empty();
        expect(spanTouchesSelection(CompactSelection.fromSingleSelection(7), none, cols, rows)).toBe(true);
        expect(spanTouchesSelection(none, CompactSelection.fromSingleSelection(2), cols, rows)).toBe(true);
    });

    test("диапазон выбранных строк, перекрывающий блок с краю", () => {
        const none = CompactSelection.empty();
        expect(spanTouchesSelection(CompactSelection.fromSingleSelection([0, 6]), none, cols, rows)).toBe(true);
        expect(spanTouchesSelection(CompactSelection.fromSingleSelection([8, 20]), none, cols, rows)).toBe(false);
        expect(spanTouchesSelection(CompactSelection.fromSingleSelection([0, 5]), none, cols, rows)).toBe(false);
    });

    test("выбранные строки и колонки мимо блока", () => {
        expect(
            spanTouchesSelection(
                CompactSelection.fromSingleSelection(4),
                CompactSelection.fromSingleSelection(5),
                cols,
                rows
            )
        ).toBe(false);
    });
});

// Блок по столбцам 2–4 и строкам 5–7; остальные ячейки обычные.
const getCell = ([col, row]: Item): InnerGridCell =>
    ({
        kind: GridCellKind.Text,
        data: "",
        displayData: "",
        allowOverlay: false,
        ...(col >= 2 && col <= 4 && row >= 5 && row <= 7 ? { span: [2, 4], spanRows: [5, 7] } : {}),
    }) as InnerGridCell;

// Блок только по строкам: колонка 1, строки 2–4.
const getTallCell = ([col, row]: Item): InnerGridCell =>
    ({
        kind: GridCellKind.Text,
        data: "",
        displayData: "",
        allowOverlay: false,
        ...(col === 1 && row >= 2 && row <= 4 ? { spanRows: [2, 4] } : {}),
    }) as InnerGridCell;

const withCell = (cell: Item, range: Rectangle, rangeStack: Rectangle[] = []): GridSelection => ({
    current: { cell, range, rangeStack },
    rows: CompactSelection.empty(),
    columns: CompactSelection.empty(),
});

describe("getFillSelection", () => {
    test("пока рамку прячет редактор, диапазон, растянутый до блока ячейки фокуса, становится одной ячейкой", () => {
        const stack = [rect(0, 0, 1, 1)];
        const res = getFillSelection(withCell([3, 6], rect(2, 5, 3, 3), stack), true, 100, getCell);
        expect(res.current?.range).toEqual(rect(3, 6, 1, 1));
        expect(res.current?.cell).toEqual([3, 6]);
        expect(res.current?.rangeStack).toBe(stack);
        expect(selectionRangeTouchesSpan(res, cols, rows, false)).toBe(false);
    });

    test("без редактора выделение не меняется, даже если рамки нет", () => {
        const s = withCell([3, 6], rect(2, 5, 3, 3));
        expect(getFillSelection(s, false, 100, getCell)).toBe(s);
    });

    test("выделенный по шапке столбец, который целиком один блок, без редактора остаётся заливкой", () => {
        // Столбец 1, строки 2–4 это все строки данных, и весь столбец один блок.
        const column = withCell([1, 2], rect(1, 2, 1, 3));
        const res = getFillSelection(column, false, 5, getTallCell);
        expect(res).toBe(column);
        expect(selectionRangeTouchesSpan(res, [1, 1], [2, 4], false)).toBe(true);
    });

    test("диапазон больше блока или внутри него остаётся диапазоном", () => {
        const wider = withCell([3, 6], rect(1, 5, 4, 3));
        expect(getFillSelection(wider, true, 100, getCell)).toBe(wider);
        const inner = withCell([3, 6], rect(2, 5, 2, 2));
        expect(getFillSelection(inner, true, 100, getCell)).toBe(inner);
    });

    test("обычная ячейка, одна ячейка и фокус вне строк данных: без изменений", () => {
        const plain = withCell([0, 0], rect(0, 0, 2, 2));
        expect(getFillSelection(plain, true, 100, getCell)).toBe(plain);
        const single = withCell([3, 6], rect(3, 6, 1, 1));
        expect(getFillSelection(single, true, 100, getCell)).toBe(single);
        const trailing = withCell([3, 6], rect(2, 5, 3, 3));
        expect(getFillSelection(trailing, true, 6, getCell)).toBe(trailing);
    });

    test("блок только по строкам", () => {
        const res = getFillSelection(withCell([1, 3], rect(1, 2, 1, 3)), true, 100, getTallCell);
        expect(res.current?.range).toEqual(rect(1, 3, 1, 1));
    });
});
