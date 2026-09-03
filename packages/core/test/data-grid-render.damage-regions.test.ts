import { describe, expect, it } from "vitest";
import { CellSet } from "../src/internal/data-grid/cell-set.js";
import { getDamageDrawRegions } from "../src/internal/data-grid/render/data-grid-render.js";
import type { MappedGridColumn } from "../src/internal/data-grid/render/data-grid-lib.js";

function col(partial: Partial<MappedGridColumn>): MappedGridColumn {
    return { title: "", width: 100, sourceIndex: 0, sticky: false, ...partial } as unknown as MappedGridColumn;
}

const cols: MappedGridColumn[] = [
    col({ sourceIndex: 0 }),
    col({ sourceIndex: 1 }),
    col({ sourceIndex: 2 }),
];

const HEADER_H = 36;
const ROW_H = 32;

type SpanInfo = { span?: readonly [number, number]; spanRows?: readonly [number, number] };

function regions(damage: CellSet, cellAt: (cell: readonly [number, number]) => SpanInfo, cellYOffset = 0) {
    return getDamageDrawRegions(
        cols,
        400, // height
        HEADER_H,
        0, // translateX
        0, // translateY
        cellYOffset,
        10, // rows
        () => ROW_H,
        0, // freezeTrailingRows
        false, // hasAppendRow
        damage,
        cellAt
    );
}

describe("getDamageDrawRegions — регионы перерисовки при точечном damage", () => {
    it("обычная ячейка: один регион строго по границам ячейки", () => {
        const r = regions(new CellSet([[0, 1]]), () => ({}));
        expect(r).toEqual([{ x: 0, y: HEADER_H + ROW_H, width: 100, height: ROW_H }]);
    });

    it("ячейка вне damage регионов не создаёт", () => {
        const r = regions(new CellSet([[5, 20]]), () => ({}));
        expect(r).toEqual([]);
    });

    it("colspan: регион расширяется на весь блок по ширине", () => {
        const r = regions(new CellSet([[0, 1]]), () => ({ span: [0, 1] }));
        expect(r).toEqual([{ x: 0, y: HEADER_H + ROW_H, width: 200, height: ROW_H }]);
    });

    it("rowspan: регион расширяется на всю высоту блока, включая строки выше damaged", () => {
        const r = regions(new CellSet([[0, 2]]), c => (c[1] >= 1 && c[1] <= 3 ? { spanRows: [1, 3] } : {}));
        expect(r).toEqual([{ x: 0, y: HEADER_H + ROW_H, width: 100, height: ROW_H * 3 }]);
    });

    it("colspan+rowspan: регион покрывает весь двумерный блок", () => {
        const r = regions(new CellSet([[1, 2]]), () => ({ span: [1, 2], spanRows: [1, 2] }));
        expect(r).toEqual([{ x: 100, y: HEADER_H + ROW_H, width: 200, height: ROW_H * 2 }]);
    });

    it("scroll-safe: верх rowspan-блока выше вьюпорта → y уходит в минус (канва клипует)", () => {
        // Проскроллено на 2 строки; блок начинается со строки 0, damage на видимой строке 2.
        const r = regions(new CellSet([[0, 2]]), () => ({ spanRows: [0, 3] }), 2);
        expect(r).toEqual([{ x: 0, y: HEADER_H - ROW_H * 2, width: 100, height: ROW_H * 4 }]);
    });
});
