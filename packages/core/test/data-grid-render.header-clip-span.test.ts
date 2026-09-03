/* eslint-disable unicorn/consistent-function-scoping */
import { describe, expect, it } from "vitest";
import { type MappedGridColumn } from "../src/internal/data-grid/render/data-grid-lib.js";
import { clipHeaderDamage, getDamageRepairPad } from "../src/internal/data-grid/render/data-grid-render.js";
import { CellSet } from "../src/internal/data-grid/cell-set.js";

// clipHeaderDamage: клип слитой группы берёт всю слитую высоту (иначе hover-перерисовка
// режется по одному групп-ряду), repairPad при low-DPR раздувает клип на pad во все стороны.

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

type ClipRect = { x: number; y: number; w: number; h: number };

function captureClipRects(
    cols: MappedGridColumn[],
    groupHeaderHeight: number | number[],
    totalHeaderHeight: number,
    damage: CellSet,
    enableLowDprHairline: boolean,
    getGroupDetails?: Parameters<typeof clipHeaderDamage>[10]
): ClipRect[] {
    const rects: ClipRect[] = [];
    const ctx = {
        beginPath: () => undefined,
        rect: (x: number, y: number, w: number, h: number) => {
            rects.push({ x, y, w, h });
        },
        clip: () => undefined,
    } as unknown as CanvasRenderingContext2D;
    clipHeaderDamage(ctx, cols, 1000, groupHeaderHeight, totalHeaderHeight, 0, 0, 0, damage, enableLowDprHairline, getGroupDetails);
    return rects;
}

describe("clipHeaderDamage — слитая группа клипуется на всю слитую высоту", () => {
    // "G" терминальна (без подгрупп) и помечена span → сливается на оба групп-ряда.
    const cols: MappedGridColumn[] = [
        col({ sourceIndex: 0, width: 150, group: "G" }),
        col({ sourceIndex: 1, width: 160, group: ["H", "S"] }),
    ];
    const h0 = 30;
    const h1 = 28;
    const totalH = h0 + h1 + 36;
    const getGroupDetails: Parameters<typeof clipHeaderDamage>[10] = name =>
        name === "G" ? { name, span: true } : { name };

    it("damage верхнего групп-ряда слитой группы → клип высотой в оба групп-ряда", () => {
        const rects = captureClipRects(cols, [h0, h1], totalH, new CellSet([[0, -2]]), false, getGroupDetails);
        const merged = rects.find(r => r.x === 0 && r.w === 150);
        expect(merged).toBeDefined();
        expect(merged?.y).toBe(0);
        expect(merged?.h).toBe(h0 + h1);
    });

    it("глубокая группа (не слитая) клипуется по одному групп-ряду", () => {
        const rects = captureClipRects(cols, [h0, h1], totalH, new CellSet([[1, -2]]), false, getGroupDetails);
        const own = rects.find(r => r.x === 150);
        expect(own).toBeDefined();
        expect(own?.h).toBe(h0);
    });
});

describe("clipHeaderDamage — repairPad при low-DPR", () => {
    const cols: MappedGridColumn[] = [
        col({ sourceIndex: 0, width: 150, group: "G" }),
        col({ sourceIndex: 1, width: 160, group: "G" }),
    ];
    const groupH = 30;
    const totalH = groupH + 36;

    it("без low-DPR клип шапки колонки тугой (pad = 0)", () => {
        const rects = captureClipRects(cols, groupH, totalH, new CellSet([[0, -1]]), false);
        // finalX = drawX + 1, полоса заголовков от groupH до totalH.
        expect(rects).toEqual([{ x: 1, y: groupH, w: 149, h: totalH - groupH }]);
    });

    it("с low-DPR клип раздувается на repairPad во все стороны", () => {
        const pad = getDamageRepairPad(true);
        expect(pad).toBeGreaterThanOrEqual(1);
        const rects = captureClipRects(cols, groupH, totalH, new CellSet([[0, -1]]), true);
        expect(rects).toEqual([
            { x: 1 - pad, y: groupH - pad, w: 149 + pad * 2, h: totalH - groupH + pad * 2 },
        ]);
    });
});
