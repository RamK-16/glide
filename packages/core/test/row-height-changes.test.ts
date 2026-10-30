import { describe, expect, it } from "vitest";
import type { MappedGridColumn } from "../src/internal/data-grid/render/data-grid-lib.js";
import {
    blitLastFrame,
    computeCanBlit,
    type BlitData,
} from "../src/internal/data-grid/render/data-grid-render.blit.js";
import type { DrawGridArg } from "../src/internal/data-grid/render/draw-grid-arg.js";
import { rowHeightChangesSince, type RowHeightCallback } from "../src/internal/scrolling-data-grid/row-offsets.js";

const withVersion = (version: number, changes?: RowHeightCallback["changes"]): RowHeightCallback =>
    Object.assign(() => 30, { version, changes });

describe("rowHeightChangesSince", () => {
    it("подсказка от той же версии", () => {
        const previous = withVersion(1);
        const current = withVersion(2, { previousVersion: 1, from: 3, to: 5 });
        expect(rowHeightChangesSince(current, previous)).toEqual({ previousVersion: 1, from: 3, to: 5 });
    });

    it("без подсказки, от другой версии, без версии у прежней или с числом: undefined", () => {
        const current = withVersion(2, { previousVersion: 1, from: 3, to: 5 });
        expect(rowHeightChangesSince(withVersion(2), withVersion(1))).toBeUndefined();
        expect(rowHeightChangesSince(current, withVersion(7))).toBeUndefined();
        expect(rowHeightChangesSince(current, () => 30)).toBeUndefined();
        expect(rowHeightChangesSince(current, 30)).toBeUndefined();
        expect(rowHeightChangesSince(30, withVersion(1))).toBeUndefined();
        expect(rowHeightChangesSince(current, undefined)).toBeUndefined();
    });
});

const arg = (rowHeight: number | RowHeightCallback) => ({ rowHeight, mappedColumns: [] }) as unknown as DrawGridArg;

describe("computeCanBlit при смене rowHeight", () => {
    it("новая функция с подсказкой от прежней версии не запрещает сдвиг кадра", () => {
        const previous = withVersion(1);
        expect(computeCanBlit(arg(withVersion(2, { previousVersion: 1, from: 0, to: 0 })), arg(previous))).toBe(true);
    });

    it("новая функция без подсказки или с подсказкой от другой версии запрещает", () => {
        expect(computeCanBlit(arg(withVersion(2)), arg(withVersion(1)))).toBe(false);
        expect(computeCanBlit(arg(withVersion(2, { previousVersion: 5, from: 0, to: 0 })), arg(withVersion(1)))).toBe(
            false
        );
    });
});

describe("blitLastFrame с дополнительной областью", () => {
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
    const blit = (
        cellYOffset: number,
        height: number,
        extra?: { x: number; y: number; width: number; height: number }
    ) => {
        const ctx = document.createElement("canvas").getContext("2d") as CanvasRenderingContext2D;
        return blitLastFrame(
            ctx,
            ctx.canvas,
            undefined,
            undefined,
            last,
            0,
            cellYOffset,
            0,
            0,
            0,
            600,
            height,
            1000,
            36,
            1,
            columns,
            columns,
            30,
            false,
            36,
            extra
        ).regions;
    };
    const extra = { x: 0, y: 200, width: 600, height: 400 };

    it("без прокрутки перерисовывается только дополнительная область", () => {
        expect(blit(10, 600, extra)).toEqual([extra]);
    });

    it("при прокрутке к новой полосе добавляется дополнительная область", () => {
        expect(blit(11, 600, extra)).toContainEqual(extra);
        expect(blit(11, 600, extra)).toHaveLength(2);
    });

    it("если кадр не сдвигается, области нет: экран перерисуется целиком", () => {
        expect(blit(10, 150, extra)).toEqual([]);
    });
});
