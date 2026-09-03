import { describe, expect, it } from "vitest";
import { spanPartialFillRect, type SpanBlockGeometry } from "../src/internal/data-grid/render/data-grid-render.cells.js";
import type { MappedGridColumn } from "../src/internal/data-grid/render/data-grid-lib.js";

function col(partial: Partial<MappedGridColumn>): MappedGridColumn {
    return { title: "", width: 100, sourceIndex: 0, sticky: false, ...partial } as unknown as MappedGridColumn;
}

const cols: MappedGridColumn[] = [
    col({ sourceIndex: 0 }),
    col({ sourceIndex: 1 }),
    col({ sourceIndex: 2 }),
    col({ sourceIndex: 3 }),
];

// Блок: колонки 1-2 (x=100, ширина 200), строки 0-1 (y=0, высота 64).
function geom(overrides: Partial<SpanBlockGeometry> = {}): SpanBlockGeometry {
    return {
        cols: [1, 2],
        rows: [0, 1],
        x: 100,
        y: 0,
        width: 200,
        height: 64,
        allColumns: cols,
        getRowHeight: () => 32,
        ...overrides,
    };
}

describe("spanPartialFillRect — пиксельная полоса пересечения внутри блока", () => {
    it("пересечение на весь блок = весь прямоугольник блока", () => {
        const r = spanPartialFillRect({ c0: 1, c1: 2, r0: 0, r1: 1, full: true }, geom(), "red");
        expect(r).toEqual({ x: 100, y: 0, w: 200, h: 64, color: "red" });
    });

    it("частичное пересечение: смещение по ширинам колонок и высотам строк", () => {
        const r = spanPartialFillRect({ c0: 2, c1: 2, r0: 1, r1: 1, full: false }, geom(), "blue");
        expect(r).toEqual({ x: 200, y: 32, w: 100, h: 32, color: "blue" });
    });

    it("клэмп в видимую часть блока (frozen-сплит: width меньше блока)", () => {
        const r = spanPartialFillRect(
            { c0: 1, c1: 2, r0: 0, r1: 1, full: false },
            geom({ width: 150 }), // видно только 150px из 200
            "green"
        );
        expect(r).toEqual({ x: 100, y: 0, w: 150, h: 64, color: "green" });
    });

    it("полоса целиком вне видимой части → null", () => {
        const r = spanPartialFillRect(
            { c0: 2, c1: 2, r0: 0, r1: 1, full: false },
            geom({ width: 90 }), // видима только часть колонки 1, полоса начинается с колонки 2
            "red"
        );
        expect(r).toBeNull();
    });

    it("нулевая высота пересечения → null", () => {
        const r = spanPartialFillRect(
            { c0: 1, c1: 2, r0: 1, r1: 1, full: false },
            geom({ height: 30 }), // видимая высота меньше первой строки, вторая строка не видна
            "red"
        );
        expect(r).toBeNull();
    });

    it("блок через границу закрепления: x считается от первой незакреплённой колонки", () => {
        // Блок на колонки 0-2, колонка 0 закреплена. Прокручиваемая часть блока
        // начинается с колонки 1: её пиксель x соответствует колонке 1, а не 0.
        // Полоса по колонке 1 должна лечь ровно на начало части, без сдвига
        // на ширину закреплённой колонки.
        const r = spanPartialFillRect(
            { c0: 1, c1: 1, r0: 0, r1: 1, full: false },
            geom({ cols: [0, 2], x: 100, width: 200, xStartCol: 1 }),
            "red"
        );
        expect(r).toEqual({ x: 100, y: 0, w: 100, h: 64, color: "red" });
    });
});
