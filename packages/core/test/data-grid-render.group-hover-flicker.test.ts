import { describe, expect, it } from "vitest";
import { type MappedGridColumn } from "../src/internal/data-grid/render/data-grid-lib.js";
import { drawGroups } from "../src/internal/data-grid/render/data-grid-render.header.js";
import { getDataEditorTheme, mergeAndRealizeTheme } from "../src/common/styles.js";

// Регресс: hover-мигание на границе подколонок внутри группы. Раньше hover-amount брался
// по конкретной hCol — при пересечении границы hCol менялась, анимация новой колонки
// стартовала с 0 → заливка мигала. Теперь берём СУММУ по колонкам спана (клампим в 1):
// старая колонка гаснет и новая разгоняется синхронно (сумма ≈ 1) → без провала.

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
type FillRect = { x: number; y: number; w: number; h: number; fill: string; alpha: number };

// Уровень "C" (подгруппа) → targetRow = -2 - level = -3.
const GROUP_ROW = -3;
const HOVER_FILL = "#ABCDEF";
// Базовый фон группы отличается от bgHeader — иначе вспышки нет (база == очищенный фон).
const BASE_FILL = "#123456";

function captureHoverFills(
    hoverCol: number,
    hoverValues: { item: [number, number]; hoverAmount: number }[]
): FillRect[] {
    const rects: FillRect[] = [];
    let fillStyle = "";
    let globalAlpha = 1;
    const noop = () => undefined;
    const ctx = {
        get fillStyle() {
            return fillStyle;
        },
        set fillStyle(v: string) {
            fillStyle = v;
        },
        get globalAlpha() {
            return globalAlpha;
        },
        set globalAlpha(v: number) {
            globalAlpha = v;
        },
        fillRect: (x: number, y: number, w: number, h: number) => {
            rects.push({ x, y, w, h, fill: fillStyle, alpha: globalAlpha });
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
    } as unknown as CanvasRenderingContext2D;

    const cols: MappedGridColumn[] = [
        col({ sourceIndex: 0, width: 150, group: ["P", "C"] }),
        col({ sourceIndex: 1, width: 160, group: ["P", "C"] }),
    ];
    const theme = mergeAndRealizeTheme(getDataEditorTheme());
    const spriteManager = { drawSprite: noop } as unknown as DrawGroupsParams[7];
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const getGroupDetails: DrawGroupsParams[10] = name =>
        name === "C"
            ? { name, overrideTheme: { bgGroupHeader: BASE_FILL, bgGroupHeaderHovered: HOVER_FILL } }
            : { name };

    drawGroups(
        ctx,
        cols,
        1000,
        0,
        [30, 28], // groupHeaderHeight
        [
            [hoverCol, GROUP_ROW],
            [10, 10],
        ] as unknown as DrawGroupsParams[5], // hovered: наводимся на групп-ряд "C"
        theme,
        spriteManager,
        hoverValues as unknown as DrawGroupsParams[8],
        () => true, // verticalBorder
        getGroupDetails,
        undefined, // damage
        undefined, // selection
        undefined, // drawGroupHeaderCallback
        false // enableLowDprHairline
    );
    return rects;
}

describe("drawGroupHeaderInner — hover-amount группы = сумма по колонкам спана (регресс мигания)", () => {
    it("складывает вклад колонок спана (гаснущая + разгоняющаяся), а не берёт одну hCol", () => {
        // Курсор перешёл на колонку 0 (0.3, разгоняется), соседняя 1 ещё гаснет (0.4).
        const fills = captureHoverFills(0, [
            { item: [0, GROUP_ROW], hoverAmount: 0.3 },
            { item: [1, GROUP_ROW], hoverAmount: 0.4 },
        ]).filter(r => r.fill === HOVER_FILL);
        expect(fills.length).toBeGreaterThan(0);
        // Старый код взял бы 0.3 (hCol=0) → провал/мигание. Сумма по спану: 0.3 + 0.4 = 0.7.
        expect(fills[0].alpha).toBeCloseTo(0.7, 5);
    });

    it("на переходе сумма комплементарных значений держится в 1 (клампится) — нет провала", () => {
        const fills = captureHoverFills(1, [
            { item: [0, GROUP_ROW], hoverAmount: 0.8 },
            { item: [1, GROUP_ROW], hoverAmount: 0.75 },
        ]).filter(r => r.fill === HOVER_FILL);
        expect(fills.length).toBeGreaterThan(0);
        expect(fills[0].alpha).toBeCloseTo(1, 5);
    });

    it("значения вне спана/строки не учитываются (сумма только по колонкам групп-ряда)", () => {
        const fills = captureHoverFills(0, [
            { item: [0, GROUP_ROW], hoverAmount: 0.5 },
            { item: [5, GROUP_ROW], hoverAmount: 0.9 }, // колонка 5 вне спана [0,1]
            { item: [1, -1], hoverAmount: 0.9 }, // ряд колонок, не групп-ряд
        ]).filter(r => r.fill === HOVER_FILL);
        expect(fills.length).toBeGreaterThan(0);
        expect(fills[0].alpha).toBeCloseTo(0.5, 5);
    });

    // Регресс на вспышку: при hover уже начавшемся, но ha=0 (анимация не стартовала) группа
    // должна показывать БАЗОВЫЙ фон (перекрывает очищенный яркий bgHeader), а hover-цвет на
    // полной насыщенности НЕ красится (иначе старый «проблеск»).
    it("на кадре ha=0 красится базовый фон группы, без вспышки bgHeader и без проблеска hover", () => {
        const rects = captureHoverFills(0, [
            { item: [0, GROUP_ROW], hoverAmount: 0 },
            { item: [1, GROUP_ROW], hoverAmount: 0 },
        ]);
        // Проблеска нет: hover-цвет на ha=0 не рисуется.
        expect(rects.some(r => r.fill === HOVER_FILL)).toBe(false);
        // Вспышки нет: базовый фон группы отрисован непрозрачно (перекрывает очищенный bgHeader).
        expect(rects.some(r => r.fill === BASE_FILL && r.alpha === 1)).toBe(true);
    });
});
