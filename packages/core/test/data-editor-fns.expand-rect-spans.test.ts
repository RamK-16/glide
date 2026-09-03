/* eslint-disable unicorn/consistent-function-scoping */
import { describe, expect, it } from "vitest";
import { expandRectToSpans } from "../src/data-editor/data-editor-fns.js";
import type { Rectangle } from "../src/internal/data-grid/data-grid-types.js";

type SpanInfo = { span?: readonly [number, number]; spanRows?: readonly [number, number] };

// Модель листа: (col, row) в координатах данных → span-атрибуты ячейки.
// getCellsForSelection получает rect в display-координатах (с rowMarkerOffset).
function makeGetCells(rowMarkerOffset: number, cellAt: (col: number, row: number) => SpanInfo) {
    return (rc: Rectangle) => {
        const out: SpanInfo[][] = [];
        for (let y = rc.y; y < rc.y + rc.height; y++) {
            const rowCells: SpanInfo[] = [];
            for (let x = rc.x; x < rc.x + rc.width; x++) {
                rowCells.push(cellAt(x - rowMarkerOffset, y));
            }
            out.push(rowCells);
        }
        return out;
    };
}

const ac = () => new AbortController();

describe("expandRectToSpans — расширение прямоугольника до границ слитых блоков", () => {
    it("без getCellsForSelection возвращает исходный rect", () => {
        const rect: Rectangle = { x: 1, y: 1, width: 2, height: 2 };
        expect(expandRectToSpans(rect, undefined, 0, ac())).toBe(rect);
    });

    it("ячейки недоступны (thunk) — возвращает исходный rect", () => {
        const rect: Rectangle = { x: 0, y: 0, width: 1, height: 1 };
        const thunk = () => () => Promise.resolve([]);
        expect(expandRectToSpans(rect, thunk as any, 0, ac())).toBe(rect);
    });

    it("без спанов rect не меняется", () => {
        const rect: Rectangle = { x: 1, y: 2, width: 3, height: 3 };
        const result = expandRectToSpans(rect, makeGetCells(0, () => ({})) as any, 0, ac());
        expect(result).toEqual(rect);
    });

    it("colspan: узкий rect расширяется до всего блока", () => {
        const cellAt = (col: number, row: number): SpanInfo =>
            row === 0 && col >= 1 && col <= 3 ? { span: [1, 3] } : {};
        const result = expandRectToSpans(
            { x: 1, y: 0, width: 1, height: 1 },
            makeGetCells(0, cellAt) as any,
            0,
            ac()
        );
        expect(result).toEqual({ x: 1, y: 0, width: 3, height: 1 });
    });

    it("rowspan: rect расширяется по вертикали до всего блока", () => {
        const cellAt = (col: number, row: number): SpanInfo =>
            col === 0 && row >= 1 && row <= 4 ? { spanRows: [1, 4] } : {};
        const result = expandRectToSpans(
            { x: 0, y: 2, width: 1, height: 1 },
            makeGetCells(0, cellAt) as any,
            0,
            ac()
        );
        expect(result).toEqual({ x: 0, y: 1, width: 1, height: 4 });
    });

    it("цепочка блоков доводится до неподвижной точки (colspan → rowspan → colspan)", () => {
        const cellAt = (col: number, row: number): SpanInfo => {
            if (row === 0 && (col === 1 || col === 2)) {
                // Колонка 2 дополнительно слита вниз на строки 0-1.
                return col === 2 ? { span: [1, 2], spanRows: [0, 1] } : { span: [1, 2] };
            }
            if (row === 1 && col === 2) return { spanRows: [0, 1] };
            if (row === 1 && col === 3) return { span: [3, 4] };
            return {};
        };
        const result = expandRectToSpans(
            { x: 1, y: 0, width: 1, height: 1 },
            makeGetCells(0, cellAt) as any,
            0,
            ac()
        );
        // 1) span[1,2] → колонки 1-2; 2) spanRows[0,1] у колонки 2 → строки 0-1;
        // 3) на строке 1 появилась колонка 3? нет: диапазон колонок 1-2 её не включает.
        expect(result).toEqual({ x: 1, y: 0, width: 2, height: 2 });
    });

    it("rowMarkerOffset учитывается при пересчёте display ↔ data координат", () => {
        // Блок в данных: колонки 0-1, display-колонки 1-2 (offset 1).
        const cellAt = (col: number, row: number): SpanInfo =>
            row === 0 && (col === 0 || col === 1) ? { span: [0, 1] } : {};
        const result = expandRectToSpans(
            { x: 1, y: 0, width: 1, height: 1 },
            makeGetCells(1, cellAt) as any,
            1,
            ac()
        );
        expect(result).toEqual({ x: 1, y: 0, width: 2, height: 1 });
    });

    it("широкий и высокий rect: rowspan через верхнюю границу ловится строчной полосой", () => {
        // Rowspan в середине по X (колонка 1) выступает выше rect — боковые полосы его не видят.
        const cellAt = (col: number, row: number): SpanInfo =>
            col === 1 && row >= 0 && row <= 2 ? { spanRows: [0, 2] } : {};
        const result = expandRectToSpans(
            { x: 0, y: 1, width: 3, height: 3 },
            makeGetCells(0, cellAt) as any,
            0,
            ac()
        );
        expect(result).toEqual({ x: 0, y: 0, width: 3, height: 4 });
    });

    it("широкий rect: colspan через боковую границу ловится боковой полосой", () => {
        const cellAt = (col: number, row: number): SpanInfo =>
            row === 1 && col >= 2 && col <= 4 ? { span: [2, 4] } : {};
        const result = expandRectToSpans(
            { x: 0, y: 0, width: 3, height: 2 },
            makeGetCells(0, cellAt) as any,
            0,
            ac()
        );
        expect(result).toEqual({ x: 0, y: 0, width: 5, height: 2 });
    });
});
