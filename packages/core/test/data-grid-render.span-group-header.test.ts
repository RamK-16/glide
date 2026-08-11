import { describe, expect, it } from "vitest";
import { segmentSpanGroupHeaderLine } from "../src/internal/data-grid/render/data-grid-render.header.js";
import { clipHeaderDamage } from "../src/internal/data-grid/render/data-grid-render.js";
import { type MappedGridColumn } from "../src/internal/data-grid/render/data-grid-lib.js";
import { CellSet } from "../src/internal/data-grid/cell-set.js";

describe("segmentSpanGroupHeaderLine — разрез межуровневой линии вокруг слитых колонок", () => {
    it("нет слитых колонок → одна сплошная линия во всю ширину", () => {
        expect(segmentSpanGroupHeaderLine(1000, [])).toEqual([[0, 1000]]);
    });

    it("один разрыв в середине → два отрезка по краям", () => {
        expect(segmentSpanGroupHeaderLine(1000, [[300, 450]])).toEqual([
            [0, 300],
            [450, 1000],
        ]);
    });

    it("разрыв у левого края (с 0) → только правый отрезок", () => {
        expect(segmentSpanGroupHeaderLine(1000, [[0, 200]])).toEqual([[200, 1000]]);
    });

    it("разрыв у правого края (до width) → только левый отрезок", () => {
        expect(segmentSpanGroupHeaderLine(1000, [[800, 1000]])).toEqual([[0, 800]]);
    });

    it("несколько разрывов (края + середина) → отрезки между ними", () => {
        expect(
            segmentSpanGroupHeaderLine(1000, [
                [0, 150],
                [400, 550],
                [900, 1000],
            ])
        ).toEqual([
            [150, 400],
            [550, 900],
        ]);
    });

    it("две соседние слитые колонки (стыкующиеся интервалы) → один общий вырез", () => {
        // [100,250] и [250,400] стыкуются в [100,400]
        expect(
            segmentSpanGroupHeaderLine(1000, [
                [100, 250],
                [250, 400],
            ])
        ).toEqual([
            [0, 100],
            [400, 1000],
        ]);
    });

    it("несортированные интервалы (порядок walkColumns не гарантирован) → сортируются внутри", () => {
        expect(
            segmentSpanGroupHeaderLine(1000, [
                [700, 800],
                [100, 200],
            ])
        ).toEqual([
            [0, 100],
            [200, 700],
            [800, 1000],
        ]);
    });

    it("наезжающие интервалы → корректно схлопываются", () => {
        expect(
            segmentSpanGroupHeaderLine(1000, [
                [100, 400],
                [300, 500],
            ])
        ).toEqual([
            [0, 100],
            [500, 1000],
        ]);
    });

    it("интервал уходит за правый край (скролл) → правого отрезка нет, левый обрезан", () => {
        expect(segmentSpanGroupHeaderLine(1000, [[900, 1200]])).toEqual([[0, 900]]);
    });

    it("интервал с отрицательным началом (колонка уехала влево при скролле) → игнорируется слева", () => {
        // gap [-100, 200] покрывает левый край, дальше линия с 200
        expect(segmentSpanGroupHeaderLine(1000, [[-100, 200]])).toEqual([[200, 1000]]);
    });

    it("слитые колонки покрывают всю ширину → линии нет вообще", () => {
        expect(
            segmentSpanGroupHeaderLine(1000, [
                [0, 500],
                [500, 1000],
            ])
        ).toEqual([]);
    });

    it("нулевая ширина → пустой список отрезков", () => {
        expect(segmentSpanGroupHeaderLine(0, [])).toEqual([]);
    });
});

// Регресс на инвариант allSpanned-скипа в clipHeaderDamage (см. комментарий в групп-цикле
// data-grid-render.ts). Баг: сосед задевает свой групп-ряд → клип пустого групп-спана из
// слитых колонок затирал верхнюю полосу слитой шапки, а перерисовать её было некому →
// серое поверх текста + пропавшая линия. Ловим самое дно проблемы — геометрию клипа.

function sghCol(partial: Partial<MappedGridColumn>): MappedGridColumn {
    return {
        title: "",
        width: 150,
        sourceIndex: 0,
        sticky: false,
        group: undefined,
        ...partial,
    } as unknown as MappedGridColumn;
}

const SGH_GROUP_H = 30;
const SGH_TOTAL_H = SGH_GROUP_H + 36;

// col0, col1 — слитые (spanGroupHeader) без группы → один пустой групп-спан [0,1].
// col2 — обычная колонка в группе "G". x: col0 0..150, col1 150..310, col2 310..480.
const sghCols: MappedGridColumn[] = [
    sghCol({ sourceIndex: 0, width: 150, spanGroupHeader: true }),
    sghCol({ sourceIndex: 1, width: 160, spanGroupHeader: true }),
    sghCol({ sourceIndex: 2, width: 170, group: "G" }),
];

// Мок ctx: собираем все прямоугольники, из которых складывается путь клипа.
function captureClipRects(damage: CellSet): { x: number; y: number; w: number; h: number }[] {
    const rects: { x: number; y: number; w: number; h: number }[] = [];
    const ctx = {
        beginPath: () => undefined,
        rect: (x: number, y: number, w: number, h: number) => {
            rects.push({ x, y, w, h });
        },
        clip: () => undefined,
    } as unknown as CanvasRenderingContext2D;
    clipHeaderDamage(ctx, sghCols, 1000, SGH_GROUP_H, SGH_TOTAL_H, 0, 0, 0, damage, false, undefined);
    return rects;
}

function clipCovers(
    rects: { x: number; y: number; w: number; h: number }[],
    px: number,
    py: number
): boolean {
    return rects.some(r => px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h);
}

describe("clipHeaderDamage — allSpanned-скип групп-ряда слитой шапки (регресс)", () => {
    it("damage групп-ряда соседа-слитой [1,-2] НЕ клипует групп-ряд слитой col0", () => {
        const rects = captureClipRects(new CellSet([[1, -2]]));
        // Точка в групп-ряду col0 (x внутри col0, y в групп-полосе). Если её клипуют —
        // очистка фона затрёт верх слитой шапки и никто не восстановит → тот самый баг.
        expect(clipCovers(rects, 75, 15)).toBe(false);
    });

    it("саму задетую слитую col1 клипует на ВСЮ высоту (её групп-ряд восстановит перерисовка)", () => {
        const rects = captureClipRects(new CellSet([[1, -2]]));
        // Низ строки колонки col1 (x ≈ 150..310) должен попасть в клип.
        expect(clipCovers(rects, 230, SGH_TOTAL_H - 5)).toBe(true);
    });

    it("обычная группа (НЕ allSpanned) при damage её групп-ряда [2,-2] КЛИПуется — фикс не переусердствовал", () => {
        const rects = captureClipRects(new CellSet([[2, -2]]));
        // Групп-ряд col2 (x ≈ 310..480, y в групп-полосе) должен клипаться, чтобы drawGroups его перерисовал.
        expect(clipCovers(rects, 390, 15)).toBe(true);
    });
});
