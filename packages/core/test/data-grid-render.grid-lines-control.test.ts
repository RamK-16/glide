import { describe, expect, it } from "vitest";
import { drawGridLines } from "../src/internal/data-grid/render/data-grid-render.lines.js";
import type { MappedGridColumn } from "../src/internal/data-grid/render/data-grid-lib.js";
import { getDataEditorTheme, mergeAndRealizeTheme } from "../src/common/styles.js";
import type { CellBorderResolver } from "../src/internal/data-grid/data-grid-types.js";

// drawGridLines: управление линиями сетки.
// Быстрый путь (getCellBorder не задан): гейт горизонталей по строке, пер-колоночный
// цвет вертикали из themeOverride. Сегментный путь (getCellBorder задан): рамки по
// ячейкам — стороны вкл/выкл и цвет, приоритет ячейка > колонка/строка > тема.

const theme = mergeAndRealizeTheme(getDataEditorTheme());
const vColor = theme.borderColor;
const hColor = theme.horizontalBorderColor ?? theme.borderColor;

function col(partial: Partial<MappedGridColumn>): MappedGridColumn {
    return { title: "", width: 100, sourceIndex: 0, sticky: false, ...partial } as unknown as MappedGridColumn;
}

interface Seg {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: string;
}

interface Options {
    verticalBorder?: (col: number) => boolean;
    horizontalBorder?: (row: number) => boolean;
    getCellBorder?: CellBorderResolver;
    getRowThemeOverride?: (row: number) => Partial<typeof theme> | undefined;
    cols?: MappedGridColumn[];
    verticalOnly?: boolean;
}

function draw(opts: Options = {}): Seg[] {
    const segs: Seg[] = [];
    let strokeStyle = "";
    let move: { x: number; y: number } | undefined;
    const noop = () => undefined;
    const ctx = {
        lineWidth: 1,
        beginPath: noop,
        save: noop,
        restore: noop,
        rect: noop,
        clip: noop,
        moveTo: (x: number, y: number) => {
            move = { x, y };
        },
        lineTo: (x: number, y: number) => {
            if (move !== undefined) segs.push({ x1: move.x, y1: move.y, x2: x, y2: y, color: strokeStyle });
        },
        stroke: noop,
        set strokeStyle(v: string) {
            strokeStyle = v;
        },
        get strokeStyle() {
            return strokeStyle;
        },
    } as unknown as CanvasRenderingContext2D;

    const cols = opts.cols ?? [
        col({ sourceIndex: 0 }),
        col({ sourceIndex: 1 }),
        col({ sourceIndex: 2 }),
    ];

    drawGridLines(
        ctx,
        cols,
        0, // cellYOffset
        0, // translateX
        0, // translateY
        1000, // width
        500, // height
        undefined, // drawRegions
        undefined, // spans
        0, // groupHeaderHeight
        36, // totalHeaderHeight
        () => 32, // getRowHeight
        opts.getRowThemeOverride, // getRowThemeOverride
        opts.verticalBorder ?? (() => true), // verticalBorder
        0, // freezeTrailingRows
        10, // rows
        theme,
        opts.verticalOnly ?? false,
        false, // enableLowDprHairline
        opts.horizontalBorder,
        opts.getCellBorder
    );
    return segs;
}

const verticals = (segs: Seg[]) => segs.filter(s => s.x1 === s.x2);
const horizontals = (segs: Seg[]) => segs.filter(s => s.y1 === s.y2);

const hideRightOf00: CellBorderResolver = (c, r) => (c === 0 && r === 0 ? { right: false } : undefined);
const greenBottomOf12: CellBorderResolver = (c, r) =>
    c === 1 && r === 2 ? { bottom: { color: "#00ff00" } } : undefined;
const noneBorder: CellBorderResolver = () => undefined;
const conflictingEdge00: CellBorderResolver = (c, r) => {
    if (c === 0 && r === 0) return { right: { color: "#111111" } };
    if (c === 1 && r === 0) return { left: { color: "#222222" } };
    return undefined;
};
const hideTopOf21: CellBorderResolver = (c, r) => (c === 2 && r === 1 ? { top: false } : undefined);

describe("drawGridLines — быстрый путь", () => {
    it("по умолчанию рисует вертикали на границах колонок цветом темы", () => {
        const v = verticals(draw());
        // границы после col0/col1/col2: x = 100.5, 200.5, 300.5
        const xs = [...new Set(v.map(s => s.x1))].sort((a, b) => a - b);
        expect(xs).toEqual([100.5, 200.5, 300.5]);
        expect(v.every(s => s.color === vColor)).toBe(true);
    });

    it("horizontalBorder(row)=false убирает горизонтальную линию сверху строки", () => {
        const h = horizontals(draw({ horizontalBorder: row => row !== 1 }));
        // строки: top row0=36.5, row1=68.5, row2=100.5 ...
        const ys = h.map(s => s.y1);
        expect(ys).toContain(36.5);
        expect(ys).not.toContain(68.5); // row1 скрыт
        expect(ys).toContain(100.5);
    });

    it("themeOverride.borderColor колонки красит её правую вертикаль", () => {
        const cols = [
            col({ sourceIndex: 0, themeOverride: { borderColor: "#ff0000" } as never }),
            col({ sourceIndex: 1 }),
            col({ sourceIndex: 2 }),
        ];
        const v = verticals(draw({ cols }));
        const atBoundary0 = v.filter(s => s.x1 === 100.5);
        const atBoundary1 = v.filter(s => s.x1 === 200.5);
        expect(atBoundary0.every(s => s.color === "#ff0000")).toBe(true);
        expect(atBoundary1.every(s => s.color === vColor)).toBe(true);
    });

    it("verticalBorder(col)=false убирает вертикаль на границе", () => {
        // граница после col0 = verticalBorder(1)
        const v = verticals(draw({ verticalBorder: c => c !== 1 }));
        const xs = [...new Set(v.map(s => s.x1))];
        expect(xs).not.toContain(100.5);
        expect(xs).toContain(200.5);
    });
});

describe("drawGridLines — сегментный путь (пер-ячейка)", () => {
    it("right:false у ячейки убирает её сегмент вертикали, соседние строки остаются", () => {
        const v = verticals(draw({ getCellBorder: hideRightOf00 }));
        const atBoundary0 = v.filter(s => s.x1 === 100.5);
        // строка 0 (y 36.5..68.5) отсутствует, строки ниже есть
        expect(atBoundary0.some(s => s.y1 <= 36.5 && s.y2 >= 68.5)).toBe(false);
        expect(atBoundary0.some(s => s.y1 >= 68.5)).toBe(true);
    });

    it("bottom с цветом у ячейки красит её нижний горизонтальный сегмент по ширине колонки", () => {
        const h = horizontals(draw({ getCellBorder: greenBottomOf12 }));
        // низ (1,2) = верх строки 3, y=132.5, колонка 1: x[100.5,200.5]
        const green = h.filter(s => s.color === "#00ff00");
        expect(green).toHaveLength(1);
        expect(green[0]).toMatchObject({ y1: 132.5, x1: 100.5, x2: 200.5 });
        // остальные колонки на этой же линии рисуются дефолтным цветом
        const sameY = h.filter(s => s.y1 === 132.5);
        expect(sameY.length).toBeGreaterThan(1);
    });

    it("сегментный путь без переопределений рисует те же дефолтные линии", () => {
        const seg = draw({ getCellBorder: noneBorder });
        // вертикали на трёх границах есть
        const xs = [...new Set(verticals(seg).map(s => s.x1))].sort((a, b) => a - b);
        expect(xs).toEqual([100.5, 200.5, 300.5]);
        // горизонтали присутствуют
        expect(horizontals(seg).length).toBeGreaterThan(0);
    });

    it("приоритет: right левой ячейки перекрывает left правой на общей линии", () => {
        const v = verticals(draw({ getCellBorder: conflictingEdge00 }));
        const seg = v.find(s => s.x1 === 100.5 && s.y1 <= 36.5 && s.y2 >= 68.5);
        expect(seg?.color).toBe("#111111"); // выигрывает левая ячейка (right)
    });

    it("top:false у ячейки убирает её верхний горизонтальный сегмент", () => {
        const h = horizontals(draw({ getCellBorder: hideTopOf21 }));
        // верх (2,1) = линия y=68.5 на колонке 2 x[200.5,300.5]
        const atCell = h.filter(s => s.y1 === 68.5 && s.x1 === 200.5);
        expect(atCell).toHaveLength(0);
        // другие колонки на y=68.5 есть
        expect(h.some(s => s.y1 === 68.5 && s.x1 === 0.5)).toBe(true);
    });
});
