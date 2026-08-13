import { describe, expect, it } from "vitest";
import { type MappedGridColumn } from "../src/internal/data-grid/render/data-grid-lib.js";
import { walkGroups } from "../src/internal/data-grid/render/data-grid-render.walk.js";
import { clipHeaderDamage } from "../src/internal/data-grid/render/data-grid-render.js";
import { CellSet } from "../src/internal/data-grid/cell-set.js";

// Регресс: при DnD-реордере колонок внутри группы визуальный порядок делает границы
// colSpan немонотонными (последняя колонка группы становится первой → span = [2,1]).
// Старый damage-репэйнт считал ширину как span[1] - span[0] + 1 = 0 и allSpanned-цикл
// for(i=span[0]..span[1]) не выполнялся → групп-ряд не перерисовывался (мигал пустым).
// Ловим корень: walkGroups отдаёт истинные min/max sourceIndex и корректный allSpanned;
// clipHeaderDamage всё равно клипует (репэйрит) групп-ряд переставленной группы.

function col(partial: Partial<MappedGridColumn>): MappedGridColumn {
    return {
        title: "",
        width: 150,
        sourceIndex: 0,
        sticky: false,
        group: undefined,
        ...partial,
    } as unknown as MappedGridColumn;
}

const GROUP_H = 30;
const TOTAL_H = GROUP_H + 36;

// Группа "G" из трёх колонок, переставленных реордером «последняя → первая»:
// визуальный порядок sourceIndex = [2, 0, 1]. x: 0..150, 150..310, 310..480.
const reorderedCols: MappedGridColumn[] = [
    col({ sourceIndex: 2, width: 150, group: "G" }),
    col({ sourceIndex: 0, width: 160, group: "G" }),
    col({ sourceIndex: 1, width: 170, group: "G" }),
];

describe("walkGroups — границы спана при DnD-реордере (немонотонный sourceIndex)", () => {
    it("отдаёт истинные min/max и allSpanned=false, хотя концы colSpan = [2,1]", () => {
        let seen: { span: [number, number]; min: number; max: number; allSpanned: boolean } | undefined;
        walkGroups(
            reorderedCols,
            1000,
            0,
            GROUP_H,
            0,
            (span, _g, _x, _y, _w, _h, _lvl, spanMinCol, spanMaxCol, spanAllSpanned) => {
                seen = {
                    span: [span[0], span[1]],
                    min: spanMinCol,
                    max: spanMaxCol,
                    allSpanned: spanAllSpanned,
                };
            }
        );
        expect(seen).toBeDefined();
        // Концы colSpan немонотонны — именно на них ломался старый расчёт ширины.
        expect(seen?.span).toEqual([2, 1]);
        // Истинные границы по всем членам покрывают весь диапазон [0..2].
        expect(seen?.min).toBe(0);
        expect(seen?.max).toBe(2);
        // Обычная группа (без spanGroupHeader) не «полностью слитая».
        expect(seen?.allSpanned).toBe(false);
    });
});

function captureClipRects(cols: MappedGridColumn[], damage: CellSet): { x: number; y: number; w: number; h: number }[] {
    const rects: { x: number; y: number; w: number; h: number }[] = [];
    const ctx = {
        beginPath: () => undefined,
        rect: (x: number, y: number, w: number, h: number) => {
            rects.push({ x, y, w, h });
        },
        clip: () => undefined,
    } as unknown as CanvasRenderingContext2D;
    clipHeaderDamage(ctx, cols, 1000, GROUP_H, TOTAL_H, 0, 0, 0, damage, false, undefined);
    return rects;
}

function clipCovers(rects: { x: number; y: number; w: number; h: number }[], px: number, py: number): boolean {
    return rects.some(r => px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h);
}

describe("clipHeaderDamage — групп-ряд переставленной группы репэйрится (регресс DnD-мигания)", () => {
    it("damage групп-ряда [2,-2] клипует групп-полосу (иначе фон затёрт, а имя не восстановлено)", () => {
        const rects = captureClipRects(reorderedCols, new CellSet([[2, -2]]));
        // Точка в групп-полосе внутри группы должна попасть в клип → drawGroups перерисует.
        // На старом коде allSpanned ложно = true и rect не добавлялся → было бы false.
        expect(clipCovers(rects, 75, 15)).toBe(true);
    });
});
