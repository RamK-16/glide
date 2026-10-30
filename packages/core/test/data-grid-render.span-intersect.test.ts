import { describe, expect, test } from "vitest";
import { CompactSelection, type GridSelection, type Rectangle } from "../src/internal/data-grid/data-grid-types.js";
import {
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
