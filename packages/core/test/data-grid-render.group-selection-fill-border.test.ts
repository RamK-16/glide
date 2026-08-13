import { describe, expect, it } from "vitest";
import { type MappedGridColumn } from "../src/internal/data-grid/render/data-grid-lib.js";
import { drawGroups } from "../src/internal/data-grid/render/data-grid-render.header.js";
import { getDataEditorTheme, mergeAndRealizeTheme } from "../src/common/styles.js";

// Регресс: видимая групп-заливка (bgGroupHeader, напр. при выделении группы) не должна
// перекрывать верхнюю разграничительную линию между уровнями групп. drawGroupHeaderInner
// заливает с y+1 / height-1 — верхний 1px остаётся под бордер (как уже делала ховер-ветка).

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

function captureGroupFills(
    cols: MappedGridColumn[],
    groupHeights: number[],
    fillColor: string,
    targetGroup = "C"
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
    const getGroupDetails: DrawGroupsParams[10] = name =>
        name === targetGroup ? { name, overrideTheme: { bgGroupHeader: fillColor } } : { name };

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
        undefined, // drawGroupHeaderCallback — дефолтный путь (drawGroupHeaderInner)
        false // enableLowDprHairline
    );
    return rects.filter(r => r.fill === fillColor);
}

describe("drawGroupHeaderInner — заливка группы не перекрывает верхний бордер уровня", () => {
    it("групп-заливка идёт с y+1 / height-1 (верхний 1px остаётся под разделитель)", () => {
        // Два уровня: "P" (верхний) над "C". Групп-ячейка "C" имеет верхний бордер (P/C).
        const cols: MappedGridColumn[] = [
            col({ sourceIndex: 0, width: 150, group: ["P", "C"] }),
            col({ sourceIndex: 1, width: 160, group: ["P", "C"] }),
        ];
        const h0 = 30;
        const h1 = 28;
        const fills = captureGroupFills(cols, [h0, h1], "#123456");
        expect(fills.length).toBeGreaterThan(0);
        const groupFill = fills[0];
        // Уровень "C" начинается на yOffset = h0; заливка инсетится на 1px сверху,
        // высота уменьшается на 1 — верхняя линия P/C остаётся видимой.
        expect(groupFill.y).toBe(h0 + 1);
        expect(groupFill.h).toBe(h1 - 1);
    });

    it("верхний уровень (level 0) заливается от края (y=0) — без лишней полосы сверху", () => {
        // "P" — самый верхний уровень: разделителя над ним нет, поэтому заливка идёт от
        // y=0 на всю высоту. Иначе верхний 1px светил бы фоном шапки светлой полоской.
        const cols: MappedGridColumn[] = [
            col({ sourceIndex: 0, width: 150, group: ["P", "C"] }),
            col({ sourceIndex: 1, width: 160, group: ["P", "C"] }),
        ];
        const h0 = 30;
        const h1 = 28;
        const fills = captureGroupFills(cols, [h0, h1], "#654321", "P");
        expect(fills.length).toBeGreaterThan(0);
        const groupFill = fills[0];
        expect(groupFill.y).toBe(0);
        expect(groupFill.h).toBe(h0);
    });
});
