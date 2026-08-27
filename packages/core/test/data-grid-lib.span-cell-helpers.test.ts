import { describe, expect, test } from "vitest";
import { getSpanOrigin, isCoveredSpanCell } from "../src/internal/data-grid/render/data-grid-lib.js";

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
