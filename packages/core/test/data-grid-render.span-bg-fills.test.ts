/* eslint-disable unicorn/consistent-function-scoping */
import { describe, expect, it } from "vitest";
import {
    computeSpanRowBgFills,
    isSpanOriginAccented,
} from "../src/internal/data-grid/render/data-grid-render.cells.js";
import type { MappedGridColumn } from "../src/internal/data-grid/render/data-grid-lib.js";
import { CompactSelection, type GridSelection } from "../src/internal/data-grid/data-grid-types.js";

function col(partial: Partial<MappedGridColumn>): MappedGridColumn {
    return { title: "", width: 100, sourceIndex: 0, sticky: false, ...partial } as unknown as MappedGridColumn;
}

const cols: MappedGridColumn[] = [
    col({ sourceIndex: 0 }),
    col({ sourceIndex: 1 }),
    col({ sourceIndex: 2 }),
    col({ sourceIndex: 3 }),
];

const rh = () => 32;

// Блок: колонки 1-2 (x=100, ширина 200), строки 0-2 (y=0, высота 96).
const blockCols: readonly [number, number] = [1, 2];
const blockRows: readonly [number, number] = [0, 2];

function fills(getRowThemeOverride: ((row: number) => { bgCell?: string } | undefined) | undefined, forcesBg = false) {
    return computeSpanRowBgFills(blockCols, blockRows, 100, 0, 200, 96, cols, rh, getRowThemeOverride, forcesBg);
}

describe("computeSpanRowBgFills — пополосный фон строк слитого блока", () => {
    it("без getRowThemeOverride → undefined", () => {
        expect(fills(undefined)).toBeUndefined();
    });

    it("cellForcesBg → undefined даже при row-override (ячейка форсит свой bgCell)", () => {
        expect(fills(() => ({ bgCell: "#row" }), true)).toBeUndefined();
    });

    it("override одной строки → одна полоса на её высоту во всю ширину блока", () => {
        const r = fills(row => (row === 1 ? { bgCell: "#r1" } : undefined));
        expect(r).toEqual([{ x: 100, y: 32, w: 200, h: 32, color: "#r1" }]);
    });

    it("override без bgCell не даёт полосы", () => {
        const r = fills(() => ({}) as { bgCell?: string });
        expect(r).toBeUndefined();
    });

    it("несколько строк с override → полоса на каждую со своим цветом", () => {
        const r = fills(row => (row === 0 ? { bgCell: "#r0" } : row === 2 ? { bgCell: "#r2" } : undefined));
        expect(r).toEqual([
            { x: 100, y: 0, w: 200, h: 32, color: "#r0" },
            { x: 100, y: 64, w: 200, h: 32, color: "#r2" },
        ]);
    });
});

describe("isSpanOriginAccented — выделение origin-строки блока", () => {
    function sel(partial: Partial<GridSelection>): GridSelection {
        return {
            current: undefined,
            rows: CompactSelection.empty(),
            columns: CompactSelection.empty(),
            ...partial,
        };
    }

    it("range-выделение пересекает origin-строку → true", () => {
        const s = sel({
            current: { cell: [2, 0], range: { x: 2, y: 0, width: 1, height: 1 }, rangeStack: [] },
        });
        expect(isSpanOriginAccented(s, blockCols, 0)).toBe(true);
    });

    it("range на других строках → false", () => {
        const s = sel({
            current: { cell: [2, 5], range: { x: 2, y: 5, width: 1, height: 1 }, rangeStack: [] },
        });
        expect(isSpanOriginAccented(s, blockCols, 0)).toBe(false);
    });

    it("origin-строка выбрана целиком (чекбокс) → true", () => {
        expect(isSpanOriginAccented(sel({ rows: CompactSelection.fromSingleSelection(0) }), blockCols, 0)).toBe(true);
    });

    it("выбрана колонка внутри блока → true, вне блока → false", () => {
        expect(isSpanOriginAccented(sel({ columns: CompactSelection.fromSingleSelection(2) }), blockCols, 0)).toBe(
            true
        );
        expect(isSpanOriginAccented(sel({ columns: CompactSelection.fromSingleSelection(3) }), blockCols, 0)).toBe(
            false
        );
    });

    it("пустое выделение → false", () => {
        expect(isSpanOriginAccented(sel({}), blockCols, 0)).toBe(false);
    });
});
