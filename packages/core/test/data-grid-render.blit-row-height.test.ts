import { describe, expect, it } from "vitest";
import type { MappedGridColumn } from "../src/internal/data-grid/render/data-grid-lib.js";
import { blitLastFrame, type BlitData } from "../src/internal/data-grid/render/data-grid-render.blit.js";

const HEADER_H = 36;
const ROW_H = 30;
const columns = [
    { title: "a", width: 300, sourceIndex: 0, sticky: false },
    { title: "b", width: 300, sourceIndex: 1, sticky: false },
] as unknown as MappedGridColumn[];

const last: BlitData = {
    cellXOffset: 0,
    cellYOffset: 10,
    translateX: 0,
    translateY: 0,
    mustDrawFocusOnHeader: false,
    mustDrawHighlightRingsOnHeader: false,
    pinnedColumnsEnd: 0,
    pinnedRowsCount: 0,
    lastBuffer: undefined,
    aBufferScroll: undefined,
    bBufferScroll: undefined,
};

function blit(cellYOffset: number, rowHeight: number | ((r: number) => number), cellXOffset = 0) {
    const ctx = document.createElement("canvas").getContext("2d") as CanvasRenderingContext2D;
    return blitLastFrame(
        ctx,
        ctx.canvas,
        undefined,
        undefined,
        last,
        cellXOffset,
        cellYOffset,
        0,
        0,
        0,
        600,
        600,
        1_000_000,
        HEADER_H,
        1,
        columns,
        columns,
        rowHeight,
        false
    ).regions;
}

describe("blitLastFrame with a rowHeight callback", () => {
    it("same regions as a number for short and far jumps", () => {
        for (const offset of [11, 9, 20, 30, 500_000]) {
            expect(blit(offset, () => ROW_H)).toEqual(blit(offset, ROW_H));
            expect(blit(offset, () => ROW_H, 1)).toEqual(blit(offset, ROW_H, 1));
        }
    });

    it("far jump asks heights of about a viewport of rows, not of every skipped row", () => {
        let calls = 0;
        blit(500_000, () => {
            calls++;
            return ROW_H;
        });
        expect(calls).toBeLessThan(600 / ROW_H + 3);
    });
});
