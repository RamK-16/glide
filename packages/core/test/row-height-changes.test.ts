import { describe, expect, it } from "vitest";
import type { MappedGridColumn } from "../src/internal/data-grid/render/data-grid-lib.js";
import {
    blitLastFrame,
    computeCanBlit,
    getChangedRowsRegion,
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

const regionFrom = (y: number) => ({ x: 0, y, width: 600, height: 600 - y });

describe("getChangedRowsRegion", () => {
    const base = {
        changes: { previousVersion: 1, from: 5, to: 5 },
        lastCellYOffset: 0,
        cellYOffset: 0,
        translateY: 0,
        totalHeaderHeight: 36,
        width: 600,
        height: 600,
        rows: 1000,
        freezeTrailingRows: 0,
        pinnedRowsCount: 0,
        stickySpanInView: false,
        getRowHeight: () => 30,
        spanStartOf: (row: number) => row,
    };

    it("от верха первой изменившейся строки до низа экрана", () => {
        expect(getChangedRowsRegion(base)).toEqual(regionFrom(36 + 5 * 30));
    });

    it("учитывает частично прокрученную первую строку", () => {
        expect(getChangedRowsRegion({ ...base, cellYOffset: 2, lastCellYOffset: 2, translateY: -10 })).toEqual(
            regionFrom(36 - 10 + 3 * 30)
        );
    });

    it("изменилась строка выше экрана: перерисовывается всё тело", () => {
        expect(
            getChangedRowsRegion({
                ...base,
                cellYOffset: 10,
                lastCellYOffset: 10,
                changes: { ...base.changes, from: 3, to: 3 },
            })
        ).toEqual(regionFrom(36));
    });

    it("изменилась строка ниже экрана: область нулевой высоты", () => {
        expect(getChangedRowsRegion({ ...base, changes: { ...base.changes, from: 500, to: 500 } })).toEqual(
            regionFrom(600)
        );
    });

    it("пустой диапазон: область нулевой высоты, высоты за краем не спрашиваются", () => {
        const asked: number[] = [];
        const region = getChangedRowsRegion({
            ...base,
            rows: 10,
            changes: { previousVersion: 1, from: Number.POSITIVE_INFINITY, to: -1 },
            getRowHeight: row => {
                asked.push(row);
                return 30;
            },
        });
        expect(region?.height).toBe(600 - 336);
        expect(Math.max(...asked)).toBe(9);
    });

    it("прокрутка через изменившиеся строки: кадр целиком", () => {
        expect(getChangedRowsRegion({ ...base, lastCellYOffset: 3, cellYOffset: 8 })).toBeUndefined();
        expect(getChangedRowsRegion({ ...base, lastCellYOffset: 8, cellYOffset: 3 })).toBeUndefined();
        expect(getChangedRowsRegion({ ...base, lastCellYOffset: 0, cellYOffset: 2 })).toEqual(regionFrom(36 + 3 * 30));
    });

    it("закреплённые строки, прилипшее содержимое блока, итоговые строки: кадр целиком", () => {
        expect(getChangedRowsRegion({ ...base, pinnedRowsCount: 1 })).toBeUndefined();
        expect(getChangedRowsRegion({ ...base, stickySpanInView: true })).toBeUndefined();
        expect(
            getChangedRowsRegion({ ...base, freezeTrailingRows: 1, changes: { ...base.changes, from: 999, to: 999 } })
        ).toBeUndefined();
        expect(getChangedRowsRegion({ ...base, freezeTrailingRows: 1 })).toEqual(regionFrom(36 + 5 * 30));
    });

    describe("слитые блоки", () => {
        // Блоки 2..8 и 0..3: граница поднимается к началу блока, пока не станет чистой
        const blocks: Array<[number, number]> = [
            [2, 8],
            [0, 3],
        ];
        const spanStartOf = (row: number) => blocks.reduce((start, [a, b]) => (a < start && b >= row ? a : start), row);

        it("строка внутри блока: верх области в начале блока", () => {
            expect(
                getChangedRowsRegion({
                    ...base,
                    changes: { ...base.changes, from: 7, to: 7 },
                    spanStartOf: row => (row === 7 ? 2 : row),
                })
            ).toEqual(regionFrom(36 + 2 * 30));
        });

        it("блоки цепочкой: поднимается до начала верхнего", () => {
            expect(
                getChangedRowsRegion({ ...base, changes: { ...base.changes, from: 7, to: 7 }, spanStartOf })
            ).toEqual(regionFrom(36));
        });

        it("блок начинается выше экрана: всё тело", () => {
            expect(
                getChangedRowsRegion({
                    ...base,
                    cellYOffset: 4,
                    lastCellYOffset: 4,
                    changes: { ...base.changes, from: 7, to: 7 },
                    spanStartOf: row => (row >= 2 && row <= 8 ? 2 : row),
                })
            ).toEqual(regionFrom(36));
        });

        it("изменилась строка блока ниже экрана: блок виден, верх области в его начале", () => {
            expect(
                getChangedRowsRegion({
                    ...base,
                    changes: { ...base.changes, from: 40, to: 40 },
                    spanStartOf: row => (row >= 10 && row <= 50 ? 10 : row),
                })
            ).toEqual(regionFrom(36 + 10 * 30));
        });
    });
});
