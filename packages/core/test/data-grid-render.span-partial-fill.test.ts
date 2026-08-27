import { describe, expect, it } from "vitest";
import { spanPartialFillRect } from "../src/internal/data-grid/render/data-grid-render.cells.js";
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

const rowHeight = () => 32;

describe("spanPartialFillRect — пиксельная полоса пересечения внутри блока", () => {
    // Блок: колонки 1-2 (x=100, ширина 200), строки 0-1 (y=0, высота 64).
    const blockCols: readonly [number, number] = [1, 2];
    const blockRows: readonly [number, number] = [0, 1];

    it("пересечение на весь блок = весь прямоугольник блока", () => {
        const r = spanPartialFillRect(
            { c0: 1, c1: 2, r0: 0, r1: 1, full: true },
            blockCols,
            blockRows,
            100,
            0,
            200,
            64,
            cols,
            rowHeight,
            "red"
        );
        expect(r).toEqual({ x: 100, y: 0, w: 200, h: 64, color: "red" });
    });

    it("частичное пересечение: смещение по ширинам колонок и высотам строк", () => {
        const r = spanPartialFillRect(
            { c0: 2, c1: 2, r0: 1, r1: 1, full: false },
            blockCols,
            blockRows,
            100,
            0,
            200,
            64,
            cols,
            rowHeight,
            "blue"
        );
        expect(r).toEqual({ x: 200, y: 32, w: 100, h: 32, color: "blue" });
    });

    it("клэмп в видимую часть блока (frozen-сплит: cellWidth меньше блока)", () => {
        const r = spanPartialFillRect(
            { c0: 1, c1: 2, r0: 0, r1: 1, full: false },
            blockCols,
            blockRows,
            100,
            0,
            150, // видно только 150px из 200
            64,
            cols,
            rowHeight,
            "green"
        );
        expect(r).toEqual({ x: 100, y: 0, w: 150, h: 64, color: "green" });
    });

    it("полоса целиком вне видимой части → null", () => {
        const r = spanPartialFillRect(
            { c0: 2, c1: 2, r0: 0, r1: 1, full: false },
            blockCols,
            blockRows,
            100,
            0,
            90, // видима только часть колонки 1, полоса начинается с колонки 2
            64,
            cols,
            rowHeight,
            "red"
        );
        expect(r).toBeNull();
    });

    it("нулевая высота пересечения → null", () => {
        const r = spanPartialFillRect(
            { c0: 1, c1: 2, r0: 1, r1: 1, full: false },
            blockCols,
            blockRows,
            100,
            0,
            200,
            30, // видимая высота меньше первой строки, вторая строка не видна
            cols,
            rowHeight,
            "red"
        );
        expect(r).toBeNull();
    });
});
