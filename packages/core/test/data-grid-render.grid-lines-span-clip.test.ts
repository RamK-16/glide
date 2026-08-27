import { afterEach, describe, expect, it } from "vitest";
import { drawGridLines } from "../src/internal/data-grid/render/data-grid-render.lines.js";
import type { MappedGridColumn } from "../src/internal/data-grid/render/data-grid-lib.js";
import { getDataEditorTheme, mergeAndRealizeTheme } from "../src/common/styles.js";

// drawGridLines: слитые блоки вырезаются из линий сетки evenodd-клипом (внешний rect
// плюс инсет-прямоугольники блоков), lineWidth хайрлайна восстанавливается после отрисовки.

function col(partial: Partial<MappedGridColumn>): MappedGridColumn {
    return { title: "", width: 150, sourceIndex: 0, sticky: false, ...partial } as unknown as MappedGridColumn;
}

const cols: MappedGridColumn[] = [col({ sourceIndex: 0 }), col({ sourceIndex: 1, width: 160 })];
const theme = mergeAndRealizeTheme(getDataEditorTheme());

type Trace = {
    rects: { x: number; y: number; w: number; h: number }[];
    clips: (string | undefined)[];
    saves: number;
    restores: number;
    widthsSet: number[];
};

function draw(spans: { x: number; y: number; width: number; height: number }[] | undefined, lowDpr = false): Trace {
    const trace: Trace = { rects: [], clips: [], saves: 0, restores: 0, widthsSet: [] };
    let lineWidth = 3; // до вызова
    const noop = () => undefined;
    const ctx = {
        get lineWidth() {
            return lineWidth;
        },
        set lineWidth(v: number) {
            lineWidth = v;
            trace.widthsSet.push(v);
        },
        beginPath: noop,
        save: () => trace.saves++,
        restore: () => trace.restores++,
        rect: (x: number, y: number, w: number, h: number) => trace.rects.push({ x, y, w, h }),
        clip: (rule?: string) => trace.clips.push(rule),
        moveTo: noop,
        lineTo: noop,
        stroke: noop,
        strokeStyle: "",
    } as unknown as CanvasRenderingContext2D;

    drawGridLines(
        ctx,
        cols,
        0, // cellYOffset
        0, // translateX
        0, // translateY
        1000, // width
        500, // height
        undefined, // drawRegions
        spans,
        0, // groupHeaderHeight
        36, // totalHeaderHeight
        () => 32, // getRowHeight
        undefined, // getRowThemeOverride
        () => true, // verticalBorder
        0, // freezeTrailingRows
        10, // rows
        theme,
        false, // verticalOnly
        lowDpr // enableLowDprHairline
    );
    return trace;
}

function setDevicePixelRatio(devicePixelRatio: number) {
    Object.defineProperty(window, "devicePixelRatio", {
        configurable: true,
        value: devicePixelRatio,
    });
}

describe("drawGridLines — evenodd-клип слитых блоков", () => {
    afterEach(() => {
        setDevicePixelRatio(1);
    });

    it("спаны вырезаются: внешний rect + инсет-rect блока, клип evenodd, restore в конце", () => {
        const t = draw([{ x: 100, y: 50, width: 200, height: 64 }]);
        expect(t.rects[0]).toEqual({ x: 0, y: 0, w: 1000, h: 500 });
        // Инсет на 1px со всех сторон: границы блока остаются нарисованными.
        expect(t.rects[1]).toEqual({ x: 101, y: 51, w: 199, h: 63 });
        expect(t.clips).toEqual(["evenodd"]);
        expect(t.saves).toBe(1);
        expect(t.restores).toBe(1);
    });

    it("несколько блоков → по инсет-rect на каждый под одним клипом", () => {
        const t = draw([
            { x: 100, y: 50, width: 200, height: 64 },
            { x: 400, y: 100, width: 150, height: 32 },
        ]);
        expect(t.rects).toHaveLength(3);
        expect(t.rects[2]).toEqual({ x: 401, y: 101, w: 149, h: 31 });
        expect(t.clips).toEqual(["evenodd"]);
    });

    it("без спанов клип не ставится и restore не зовётся", () => {
        const t = draw(undefined);
        expect(t.clips).toEqual([]);
        expect(t.saves).toBe(0);
        expect(t.restores).toBe(0);
    });

    it("lineWidth восстанавливается после отрисовки (без low-DPR хайрлайн = 1)", () => {
        const t = draw(undefined);
        expect(t.widthsSet).toEqual([1, 3]);
    });

    it("low-DPR: хайрлайн масштабируется под devicePixelRatio, затем восстанавливается", () => {
        setDevicePixelRatio(0.5);
        const t = draw(undefined, true);
        expect(t.widthsSet[0]).toBeCloseTo(2);
        expect(t.widthsSet.at(-1)).toBe(3);
    });
});
