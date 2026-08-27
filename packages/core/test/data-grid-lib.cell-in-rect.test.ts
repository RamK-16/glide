import { describe, expect, it } from "vitest";
import { cellIsInRect } from "../src/internal/data-grid/render/data-grid-lib.js";
import type { InnerGridCell, Rectangle } from "../src/internal/data-grid/data-grid-types.js";

type SpanInfo = { span?: readonly [number, number]; spanRows?: readonly [number, number] };

function cell(info: SpanInfo = {}): InnerGridCell {
    return info as unknown as InnerGridCell;
}

// Прямоугольник выделения: колонки 2-4, строки 1-3.
const rect: Rectangle = { x: 2, y: 1, width: 3, height: 3 };

describe("cellIsInRect — обычные ячейки", () => {
    it("ячейка внутри прямоугольника", () => {
        expect(cellIsInRect([3, 2], cell(), rect)).toBe(true);
    });

    it("ячейка вне по колонке и вне по строке", () => {
        expect(cellIsInRect([5, 2], cell(), rect)).toBe(false);
        expect(cellIsInRect([3, 4], cell(), rect)).toBe(false);
    });

    it("граничные ячейки включительно", () => {
        expect(cellIsInRect([2, 1], cell(), rect)).toBe(true);
        expect(cellIsInRect([4, 3], cell(), rect)).toBe(true);
    });
});

describe("cellIsInRect — colspan перекрытие", () => {
    it("спан пересекает левую границу прямоугольника", () => {
        expect(cellIsInRect([0, 2], cell({ span: [0, 2] }), rect)).toBe(true);
    });

    it("спан пересекает правую границу прямоугольника", () => {
        expect(cellIsInRect([4, 2], cell({ span: [4, 6] }), rect)).toBe(true);
    });

    it("спан целиком левее — не попадает", () => {
        expect(cellIsInRect([0, 2], cell({ span: [0, 1] }), rect)).toBe(false);
    });

    it("спан охватывает прямоугольник целиком", () => {
        expect(cellIsInRect([1, 2], cell({ span: [1, 6] }), rect)).toBe(true);
    });
});

describe("cellIsInRect — rowspan перекрытие", () => {
    it("начало блока внутри диапазона строк", () => {
        expect(cellIsInRect([3, 3], cell({ spanRows: [3, 6] }), rect)).toBe(true);
    });

    it("конец блока внутри диапазона строк", () => {
        expect(cellIsInRect([3, 0], cell({ spanRows: [0, 2] }), rect)).toBe(true);
    });

    it("блок охватывает диапазон строк целиком", () => {
        expect(cellIsInRect([3, 0], cell({ spanRows: [0, 6] }), rect)).toBe(true);
    });

    it("блок целиком ниже — не попадает", () => {
        expect(cellIsInRect([3, 4], cell({ spanRows: [4, 6] }), rect)).toBe(false);
    });

    it("блок целиком выше — не попадает", () => {
        expect(cellIsInRect([3, 0], cell({ spanRows: [0, 0] }), rect)).toBe(false);
    });

    it("rowspan-перекрытие есть, но колонка вне диапазона — не попадает", () => {
        expect(cellIsInRect([0, 2], cell({ spanRows: [1, 3] }), rect)).toBe(false);
    });
});

describe("cellIsInRect — двумерный блок (span + spanRows)", () => {
    it("угловое перекрытие блока и прямоугольника", () => {
        expect(cellIsInRect([0, 0], cell({ span: [0, 2], spanRows: [0, 1] }), rect)).toBe(true);
    });

    it("блок мимо по строкам, хоть колонки и пересекаются", () => {
        expect(cellIsInRect([0, 5], cell({ span: [0, 2], spanRows: [5, 6] }), rect)).toBe(false);
    });
});
