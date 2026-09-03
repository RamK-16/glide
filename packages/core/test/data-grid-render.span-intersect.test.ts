import { describe, expect, test } from "vitest";
import type { Rectangle } from "../src/internal/data-grid/data-grid-types.js";
import { intersectRangeWithSpan } from "../src/internal/data-grid/render/data-grid-render.cells.js";

// Пересечение прямоугольника выделения с диапазоном слитого блока (логические координаты).
// Используется для пополосного тинта: c0..c1 / r0..r1 — покрытая часть блока, full — весь блок.
const rect = (x: number, y: number, width: number, height: number): Rectangle => ({ x, y, width, height });

describe("intersectRangeWithSpan", () => {
    const cols: readonly [number, number] = [2, 4];
    const rows: readonly [number, number] = [5, 7];

    test("выделение полностью покрывает блок → full=true, координаты = границы блока", () => {
        expect(intersectRangeWithSpan(rect(2, 5, 3, 3), cols, rows)).toEqual({
            c0: 2,
            c1: 4,
            r0: 5,
            r1: 7,
            full: true,
        });
    });

    test("выделение шире блока со всех сторон → клэмп к блоку, full=true", () => {
        expect(intersectRangeWithSpan(rect(0, 0, 100, 100), cols, rows)).toEqual({
            c0: 2,
            c1: 4,
            r0: 5,
            r1: 7,
            full: true,
        });
    });

    test("частичное перекрытие слева (c0 > blockCols[0]) → full=false", () => {
        const hit = intersectRangeWithSpan(rect(3, 5, 5, 3), cols, rows);
        expect(hit).toEqual({ c0: 3, c1: 4, r0: 5, r1: 7, full: false });
    });

    test("частичное перекрытие сверху (r0 > blockRows[0]) → full=false", () => {
        const hit = intersectRangeWithSpan(rect(2, 6, 3, 5), cols, rows);
        expect(hit).toEqual({ c0: 2, c1: 4, r0: 6, r1: 7, full: false });
    });

    test("блок выходит за выделение справа (c1 < blockCols[1]) → full=false", () => {
        const hit = intersectRangeWithSpan(rect(2, 5, 2, 3), cols, rows);
        expect(hit).toEqual({ c0: 2, c1: 3, r0: 5, r1: 7, full: false });
    });

    test("нет перекрытия по колонкам (выделение левее блока) → null", () => {
        expect(intersectRangeWithSpan(rect(0, 5, 2, 3), cols, rows)).toBeNull();
    });

    test("нет перекрытия по строкам (выделение выше блока) → null", () => {
        expect(intersectRangeWithSpan(rect(2, 0, 3, 3), cols, rows)).toBeNull();
    });

    test("одиночная ячейка-блок, полностью выделена → full=true", () => {
        expect(intersectRangeWithSpan(rect(2, 5, 1, 1), [2, 2], [5, 5])).toEqual({
            c0: 2,
            c1: 2,
            r0: 5,
            r1: 5,
            full: true,
        });
    });

    test("перекрытие ровно в один угол блока → 1x1 hit, full=false", () => {
        const hit = intersectRangeWithSpan(rect(4, 7, 3, 3), cols, rows);
        expect(hit).toEqual({ c0: 4, c1: 4, r0: 7, r1: 7, full: false });
    });
});
