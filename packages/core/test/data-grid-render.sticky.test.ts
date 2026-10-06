import { describe, expect, it } from "vitest";
import {
    attachRowAxis,
    columnLayoutOf,
    computeColumnLayout,
    computeRowAxis,
} from "../src/internal/data-grid/render/data-grid-freeze.js";
import { walkColumns, walkGroups, walkRowsInCol } from "../src/internal/data-grid/render/data-grid-render.walk.js";
import {
    computeBounds,
    getColumnIndexForX,
    getRowIndexForY,
    type MappedGridColumn,
} from "../src/internal/data-grid/render/data-grid-lib.js";
import { blitLastFrame, type BlitData } from "../src/internal/data-grid/render/data-grid-render.blit.js";
import { getDamageDrawRegions } from "../src/internal/data-grid/render/data-grid-render.js";
import { CellSet } from "../src/internal/data-grid/cell-set.js";

const HEADER_H = 36;
const ROW_H = 30;
const rowHeight = () => ROW_H;

function makeColumns(widths: number[], sticky: number[], group?: (i: number) => string): MappedGridColumn[] {
    return widths.map(
        (width, sourceIndex) =>
            ({
                title: `c${sourceIndex}`,
                width,
                sourceIndex,
                sticky: sticky.includes(sourceIndex),
                group: group?.(sourceIndex),
            }) as unknown as MappedGridColumn
    );
}

// Колонки по 100px, липкие 0 (префикс freezeColumns) и 3. Полоса прокрутки начинается с колонки 3
// сразу за префиксом (100px) со сдвигом -30: колонка 3 стоит в 70 < слот 100, значит прилипла.
const columns = makeColumns([100, 100, 100, 100, 100, 100, 100, 100], [0, 3], i => (i < 5 ? "A" : "B"));
const layout = computeColumnLayout(columns, 3, -30, 500, 1);

function columnBounds(column: number) {
    return computeBounds(column, 0, 500, 400, 0, HEADER_H, 3, 0, -30, 0, 100, 1, 0, columns, ROW_H, undefined, layout);
}

// Строки по 30px, липкие 2 и 6; прокрутка до строки 4 — строка 2 прилипла, строка 6 ещё на месте.
const rowAxis = computeRowAxis([2, 6], 100, 4, 0, HEADER_H, 400, rowHeight);

function hit(y: number) {
    return getRowIndexForY(y, 400, false, HEADER_H, 0, 100, ROW_H, 4, 0, 0, 0, rowAxis);
}

describe("раскладка колонок в обходчиках", () => {
    it("walkColumns берёт позиции и клип из раскладки, внутри кадра sticky = прилипла", () => {
        const seen: [number, number, number, boolean][] = [];
        walkColumns(layout.effectiveCols, 0, -30, 0, HEADER_H, (column, x, _y, clipX) => {
            seen.push([column.sourceIndex, x, clipX, column.sticky]);
        });
        expect(columnLayoutOf(layout.effectiveCols)).toBe(layout);
        expect(seen).toEqual([
            [0, 0, 0, true],
            [3, 100, 0, true],
            [4, 170, 200, false],
            [5, 270, 200, false],
            [6, 370, 200, false],
            [7, 470, 200, false],
        ]);
    });

    it("walkGroups: прилипшие склеиваются по слотам, граница зоны разрывает группу", () => {
        const boxes: [number, number, number, number][] = [];
        walkGroups(layout.effectiveCols, 500, -30, 20, 0, (span, _name, x, _y, boxWidth) => {
            boxes.push([span[0], span[1], x, boxWidth]);
        });
        // [0,3] — прилипшие и соседние на экране; 4 той же группы, но уже в прокрутке.
        expect(boxes.map(box => [box[0], box[1]])).toEqual([
            [0, 3],
            [4, 4],
            [5, 7],
        ]);
        // Прокручиваемая группа обрезана по краю зоны.
        expect(boxes[1][2]).toBe(200);
    });

    it("getColumnIndexForX: зона выигрывает, дальше — естественные позиции", () => {
        expect(getColumnIndexForX(50, layout.effectiveCols)).toBe(0);
        expect(getColumnIndexForX(150, layout.effectiveCols)).toBe(3);
        expect(getColumnIndexForX(260, layout.effectiveCols)).toBe(4);
        expect(getColumnIndexForX(280, layout.effectiveCols)).toBe(5);
    });

    it("computeBounds: прилипшая колонка в слоте, остальные на месте", () => {
        expect(columnBounds(3).x).toBe(100);
        expect(columnBounds(4).x).toBe(170);
        // Колонка 2 ушла под зону: её естественная позиция левее края.
        expect(columnBounds(2).x).toBe(-30);
    });
});

describe("липкие строки", () => {
    it("ось: прилипшая в слоте, неприлипшая на своём месте", () => {
        expect(rowAxis.pinnedCount).toBe(1);
        expect(rowAxis.stickyPosition(2)).toBe(HEADER_H);
        expect(rowAxis.pinnedEnd).toBe(HEADER_H + ROW_H);
        expect(rowAxis.stickyPosition(6)).toBe(HEADER_H + 2 * ROW_H);
    });

    it("walkRowsInCol: прилипшие идут отдельной секцией после прокручиваемых, с isSticky", () => {
        const seen: [number, number, boolean][] = [];
        walkRowsInCol(
            4,
            HEADER_H,
            200,
            100,
            rowHeight,
            0,
            false,
            undefined,
            (y, row, _rh, isSticky) => {
                seen.push([row, y, isSticky]);
            },
            rowAxis
        );
        // Строка 4 целиком под полосой (36..66) — не обходится; 6 ещё не прилипла — обычная строка.
        expect(seen).toEqual([
            [5, 66, false],
            [6, 96, false],
            [7, 126, false],
            [8, 156, false],
            [9, 186, false],
            [2, HEADER_H, true],
        ]);
    });

    it("прилипшая строка не обходится в прокручиваемой секции", () => {
        const axis = computeRowAxis([5], 100, 4, -10, HEADER_H, 400, rowHeight);
        expect(axis.isPinned(5)).toBe(false);
        const scrolled = computeRowAxis([5], 100, 6, 0, HEADER_H, 400, rowHeight);
        const rows: number[] = [];
        walkRowsInCol(
            5,
            HEADER_H,
            160,
            100,
            rowHeight,
            0,
            false,
            undefined,
            (_y, row) => {
                rows.push(row);
            },
            scrolled
        );
        expect(rows.filter(row => row === 5)).toHaveLength(1);
    });

    it("getRowIndexForY: полоса перекрывает прокрученные под неё строки", () => {
        expect(hit(40)).toBe(2);
        expect(hit(70)).toBe(5);
        expect(hit(20)).toBe(-1);
    });

    it("computeBounds: прилипшая строка в слоте", () => {
        const bounds = computeBounds(
            1,
            2,
            500,
            400,
            0,
            HEADER_H,
            0,
            4,
            0,
            0,
            100,
            0,
            0,
            columns,
            ROW_H,
            undefined,
            undefined,
            rowAxis
        );
        expect(bounds.y).toBe(HEADER_H);
        expect(bounds.height).toBe(ROW_H + 1);
    });

    it("damage прилипшей строки даёт регион в полосе", () => {
        const plain = computeColumnLayout(makeColumns([100, 100], []), 0, 0, 300, 0);
        attachRowAxis(plain.effectiveCols, rowAxis);
        const regions = getDamageDrawRegions(
            plain.effectiveCols,
            400,
            HEADER_H,
            0,
            0,
            4,
            100,
            rowHeight,
            0,
            false,
            new CellSet([[1, 2]]),
            () => ({})
        );
        expect(regions).toEqual([{ x: 100, y: HEADER_H, width: 100, height: ROW_H }]);
    });
});

describe("blit с полосой липких строк", () => {
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

    function blit(stickyRowsBottom: number) {
        const ctx = document.createElement("canvas").getContext("2d") as CanvasRenderingContext2D;
        const plain = makeColumns([300, 300], []);
        return blitLastFrame(
            ctx,
            ctx.canvas,
            undefined,
            undefined,
            last,
            0,
            11,
            0,
            0,
            0,
            600,
            600,
            1000,
            HEADER_H,
            1,
            plain,
            plain,
            ROW_H,
            false,
            stickyRowsBottom
        ).regions;
    }

    it("без липких строк — апстримные регионы", () => {
        expect(blit(HEADER_H)).toEqual([{ x: 0, y: 600 - ROW_H, width: 600, height: ROW_H }]);
    });

    it("полоса не копируется, а перерисовывается целиком", () => {
        const bandBottom = HEADER_H + 2 * ROW_H;
        expect(blit(bandBottom)).toEqual([
            { x: 0, y: HEADER_H, width: 600, height: bandBottom - HEADER_H + 1 },
            { x: 0, y: 600 - ROW_H, width: 600, height: ROW_H },
        ]);
    });
});
