/* eslint-disable unicorn/consistent-function-scoping */
import { describe, expect, it } from "vitest";
import { type MappedGridColumn } from "../src/internal/data-grid/render/data-grid-lib.js";
import { drawGroups } from "../src/internal/data-grid/render/data-grid-render.header.js";
import { getDataEditorTheme, mergeAndRealizeTheme } from "../src/common/styles.js";

// Регрессы drawGroupLevel по слитым группам: merged-ячейка рисуется на всю высоту
// региона, покрытые уровни не перекрывают её пустыми ячейками, allSpanned-спаны
// (только spanGroupHeader-колонки) групп-ячейку не рисуют вовсе.

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

type DrawGroupsParams = Parameters<typeof drawGroups>;
type FillRect = { x: number; y: number; w: number; h: number; fill: string };

function captureFills(
    cols: MappedGridColumn[],
    groupHeights: number[],
    getGroupDetails: DrawGroupsParams[10]
): FillRect[] {
    const rects: FillRect[] = [];
    let fillStyle = "";
    const noop = () => undefined;
    const ctx = {
        get fillStyle() {
            return fillStyle;
        },
        set fillStyle(v: string) {
            fillStyle = v;
        },
        fillRect: (x: number, y: number, w: number, h: number) => {
            rects.push({ x, y, w, h, fill: fillStyle });
        },
        fillText: noop,
        measureText: () => ({ width: 0, actualBoundingBoxAscent: 0, actualBoundingBoxDescent: 0 }),
        save: noop,
        restore: noop,
        beginPath: noop,
        moveTo: noop,
        lineTo: noop,
        stroke: noop,
        rect: noop,
        clip: noop,
        createLinearGradient: () => ({ addColorStop: noop }),
        font: "",
        textBaseline: "",
        textAlign: "",
        strokeStyle: "",
        lineWidth: 1,
        globalAlpha: 1,
    } as unknown as CanvasRenderingContext2D;

    const theme = mergeAndRealizeTheme(getDataEditorTheme());
    const spriteManager = { drawSprite: noop } as unknown as DrawGroupsParams[7];

    drawGroups(
        ctx,
        cols,
        1000,
        0,
        groupHeights,
        undefined, // hovered
        theme,
        spriteManager,
        [], // hoverValues
        () => true, // verticalBorder
        getGroupDetails,
        undefined, // damage — полная отрисовка
        undefined, // selection
        undefined, // drawGroupHeaderCallback
        false // enableLowDprHairline
    );
    return rects;
}

describe("drawGroupLevel — слитые группы (rowspan)", () => {
    // "G" терминальна на уровне 0 (нет подгрупп) → сливается вниз на оба групп-ряда.
    const cols: MappedGridColumn[] = [
        col({ sourceIndex: 0, width: 150, group: ["G"] }),
        col({ sourceIndex: 1, width: 160, group: ["H", "S"] }),
    ];
    const h0 = 30;
    const h1 = 28;
    // Фон группы рисуется только при цвете, отличном от bgHeader темы, поэтому
    // всем группам задаём явные override-цвета.
    const getGroupDetails: DrawGroupsParams[10] = name =>
        name === "G"
            ? { name, span: true, overrideTheme: { bgGroupHeader: "#gfill" } }
            : { name, overrideTheme: { bgGroupHeader: "#nfill" } };

    it("merged-ячейка заливается на всю высоту региона (оба групп-ряда)", () => {
        const fills = captureFills(cols, [h0, h1], getGroupDetails);
        const merged = fills.filter(f => f.fill === "#gfill");
        expect(merged.length).toBe(1);
        expect(merged[0].x).toBe(0);
        expect(merged[0].y).toBe(0);
        expect(merged[0].h).toBe(h0 + h1);
    });

    it("покрытый уровень не рисует пустую ячейку поверх merged-области", () => {
        const fills = captureFills(cols, [h0, h1], getGroupDetails);
        // Все заливки в колонке 0 ниже первого групп-ряда — только сама merged-ячейка.
        const lowerBand = fills.filter(f => f.x < 150 && f.y >= h0);
        expect(lowerBand).toEqual([]);
    });

    it("соседняя колонка рисует свои уровни как обычно", () => {
        const fills = captureFills(cols, [h0, h1], getGroupDetails);
        const neighbor = fills.filter(f => f.x >= 150);
        // Уровень 0 ("H") от края, уровень 1 ("S") с инсетом 1px под линию H/S.
        expect(neighbor.some(f => f.y === 0 && f.h === h0)).toBe(true);
        expect(neighbor.some(f => f.y === h0 + 1 && f.h === h1 - 1)).toBe(true);
    });
});

describe("drawGroupLevel — allSpanned-скип (спан из одних spanGroupHeader-колонок)", () => {
    it("групп-ячейка над слитой колонкой не рисуется (её место занимает header на всю высоту)", () => {
        const cols: MappedGridColumn[] = [
            col({ sourceIndex: 0, width: 150, spanGroupHeader: true }),
            col({ sourceIndex: 1, width: 160, group: ["P"] }),
        ];
        const fills = captureFills(cols, [30], name => ({
            name,
            overrideTheme: { bgGroupHeader: "#pfill" },
        }));
        // Ни одной заливки в x-диапазоне слитой колонки.
        expect(fills.filter(f => f.x < 150)).toEqual([]);
        // Сосед "P" при этом залит.
        expect(fills.some(f => f.x >= 150)).toBe(true);
    });
});
