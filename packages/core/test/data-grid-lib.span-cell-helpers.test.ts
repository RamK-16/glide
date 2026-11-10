import { describe, expect, test } from "vitest";
import { getSpanOrigin, isCoveredSpanCell, rangeIsFocusBlock } from "../src/internal/data-grid/render/data-grid-lib.js";

// Хелперы нормализации слитых ячеек тела: покрытая-vs-origin и приведение к origin.
// Используются в fill/paste/delete/навигации, поэтому важны для корректности записи в блок.

describe("isCoveredSpanCell — покрытая ячейка блока (не origin)", () => {
    test("colspan: покрытая колонка (col != span[0]) → true", () => {
        expect(isCoveredSpanCell({ span: [2, 4] }, 3, 9)).toBe(true);
        expect(isCoveredSpanCell({ span: [2, 4] }, 4, 9)).toBe(true);
    });

    test("colspan: origin-колонка (col === span[0]) → false", () => {
        expect(isCoveredSpanCell({ span: [2, 4] }, 2, 9)).toBe(false);
    });

    test("rowspan: покрытая строка (row != spanRows[0]) → true", () => {
        expect(isCoveredSpanCell({ spanRows: [5, 7] }, 1, 6)).toBe(true);
        expect(isCoveredSpanCell({ spanRows: [5, 7] }, 1, 7)).toBe(true);
    });

    test("rowspan: origin-строка (row === spanRows[0]) → false", () => {
        expect(isCoveredSpanCell({ spanRows: [5, 7] }, 1, 5)).toBe(false);
    });

    test("прямоугольный блок: покрыт по колонке ИЛИ по строке → true", () => {
        const cell = { span: [2, 4] as const, spanRows: [5, 7] as const };
        // origin-строка, но покрытая колонка
        expect(isCoveredSpanCell(cell, 3, 5)).toBe(true);
        // origin-колонка, но покрытая строка
        expect(isCoveredSpanCell(cell, 2, 6)).toBe(true);
        // покрыт по обеим осям
        expect(isCoveredSpanCell(cell, 3, 6)).toBe(true);
    });

    test("прямоугольный блок: origin по обеим осям → false", () => {
        expect(isCoveredSpanCell({ span: [2, 4], spanRows: [5, 7] }, 2, 5)).toBe(false);
    });

    test("нет span/spanRows → всегда false (одиночная ячейка)", () => {
        expect(isCoveredSpanCell({}, 3, 6)).toBe(false);
    });
});

describe("getSpanOrigin — приведение любой ячейки блока к origin", () => {
    test("только colspan → [span[0], row]", () => {
        expect(getSpanOrigin({ span: [2, 4] }, 3, 9)).toEqual([2, 9]);
    });

    test("только rowspan → [col, spanRows[0]]", () => {
        expect(getSpanOrigin({ spanRows: [5, 7] }, 1, 6)).toEqual([1, 5]);
    });

    test("прямоугольный блок → [span[0], spanRows[0]]", () => {
        expect(getSpanOrigin({ span: [2, 4], spanRows: [5, 7] }, 3, 6)).toEqual([2, 5]);
    });

    test("нет span/spanRows → координаты без изменений", () => {
        expect(getSpanOrigin({}, 8, 8)).toEqual([8, 8]);
    });

    test("ячейка в самом origin остаётся собой (идемпотентность)", () => {
        expect(getSpanOrigin({ span: [2, 4], spanRows: [5, 7] }, 2, 5)).toEqual([2, 5]);
    });
});

// Блок: колонки данных 2–3, строки 5–7.
const blockContent = ([col, row]: readonly [number, number]) =>
    col >= 2 && col <= 3 && row >= 5 && row <= 7 ? { span: [2, 3] as const, spanRows: [5, 7] as const } : {};
const block = { x: 2, y: 5, width: 2, height: 3 };

describe("rangeIsFocusBlock: диапазон ровно равен блоку ячейки фокуса", () => {
    test("диапазон по блоку, фокус в любой его ячейке", () => {
        expect(rangeIsFocusBlock({ cell: [2, 5], range: block }, 100, blockContent)).toBe(true);
        expect(rangeIsFocusBlock({ cell: [3, 6], range: block }, 100, blockContent)).toBe(true);
    });

    test("со служебными колонками слева координаты диапазона сдвинуты, ячейка берётся без сдвига", () => {
        const shifted = { ...block, x: block.x + 1 };
        expect(rangeIsFocusBlock({ cell: [3, 5], range: shifted }, 100, blockContent, 1)).toBe(true);
        expect(rangeIsFocusBlock({ cell: [3, 5], range: block }, 100, blockContent, 1)).toBe(false);
        expect(rangeIsFocusBlock({ cell: [0, 5], range: shifted }, 100, blockContent, 1)).toBe(false);
    });

    test("диапазон больше блока, одна ячейка, обычная ячейка, строка за данными: нет", () => {
        expect(rangeIsFocusBlock({ cell: [2, 5], range: { ...block, height: 4 } }, 100, blockContent)).toBe(false);
        expect(rangeIsFocusBlock({ cell: [2, 5], range: { x: 2, y: 5, width: 1, height: 1 } }, 100, blockContent)).toBe(
            false
        );
        expect(rangeIsFocusBlock({ cell: [0, 0], range: { x: 0, y: 0, width: 2, height: 2 } }, 100, blockContent)).toBe(
            false
        );
        expect(rangeIsFocusBlock({ cell: [2, 5], range: block }, 5, blockContent)).toBe(false);
    });
});
