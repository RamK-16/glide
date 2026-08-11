import { describe, expect, it } from "vitest";
import { getRowSpanBounds } from "../src/internal/data-grid/render/data-grid-render.walk.js";
import { cellIsSelected } from "../src/internal/data-grid/render/data-grid-lib.js";
import {
    CompactSelection,
    GridCellKind,
    type GridSelection,
    type InnerGridCell,
} from "../src/internal/data-grid/data-grid-types.js";

// ── getRowSpanBounds: вертикальная геометрия объединённого по строкам блока ──────────

const rh = () => 32; // равномерная высота строк
const vrh = (r: number) => (r % 2 === 0 ? 40 : 20); // переменная высота строк

describe("getRowSpanBounds — вертикальная геометрия rowspan", () => {
    it("origin == текущая строка: y = currentDrawY, height = сумма высот блока", () => {
        const b = getRowSpanBounds([2, 5], 2, 100, rh);
        expect(b.y).toBe(100);
        expect(b.height).toBe(4 * 32); // строки 2..5 = 4 строки
    });

    it("текущая строка ниже origin: y отсчитывается вверх к origin", () => {
        // origin=2, текущая=4 (её верх=200) → y = 200 - rh(3) - rh(2) = 136
        const b = getRowSpanBounds([2, 5], 4, 200, rh);
        expect(b.y).toBe(200 - 32 - 32);
        expect(b.height).toBe(4 * 32);
    });

    it("scroll-safe: origin выше вьюпорта → y уходит в минус, высота полная", () => {
        // origin=0, первая видимая строка=2 (её верх=0) → y = 0 - rh(1) - rh(0) = -64
        const b = getRowSpanBounds([0, 5], 2, 0, rh);
        expect(b.y).toBe(-64);
        expect(b.height).toBe(6 * 32);
    });

    it("переменная высота строк: суммируется корректно", () => {
        // строки 0..2: 40 + 20 + 40 = 100
        const b = getRowSpanBounds([0, 2], 0, 0, vrh);
        expect(b.y).toBe(0);
        expect(b.height).toBe(100);
    });

    it("одиночная строка ([r,r]): высота = высота одной строки", () => {
        const b = getRowSpanBounds([3, 3], 3, 50, rh);
        expect(b.y).toBe(50);
        expect(b.height).toBe(32);
    });
});

// ── cellIsSelected: осведомлённость о диапазоне строк (rowspan) ──────────────────────

function sel(col: number, row: number): GridSelection {
    return {
        current: {
            cell: [col, row],
            range: { x: col, y: row, width: 1, height: 1 },
            rangeStack: [],
        },
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty(),
    };
}

function textCell(extra: Record<string, unknown>): InnerGridCell {
    return {
        kind: GridCellKind.Text,
        data: "x",
        displayData: "x",
        allowOverlay: false,
        ...extra,
    } as InnerGridCell;
}

describe("cellIsSelected — rowspan (диапазон строк)", () => {
    it("rowspan: выбранная строка внутри spanRows → блок выделен", () => {
        const cell = textCell({ spanRows: [1, 3] });
        expect(cellIsSelected([1, 1], cell, sel(1, 2))).toBe(true); // selRow=2 ∈ [1,3]
        expect(cellIsSelected([1, 1], cell, sel(1, 3))).toBe(true);
        expect(cellIsSelected([1, 1], cell, sel(1, 1))).toBe(true);
    });

    it("rowspan: выбранная строка вне spanRows → не выделен", () => {
        const cell = textCell({ spanRows: [1, 3] });
        expect(cellIsSelected([1, 1], cell, sel(1, 4))).toBe(false);
        expect(cellIsSelected([1, 1], cell, sel(1, 0))).toBe(false);
    });

    it("rowspan: другая колонка → не выделен", () => {
        const cell = textCell({ spanRows: [1, 3] });
        expect(cellIsSelected([1, 1], cell, sel(2, 2))).toBe(false);
    });

    it("прямоугольник (span + spanRows): выделен только если и колонка, и строка попадают", () => {
        const cell = textCell({ span: [1, 3], spanRows: [1, 2] });
        expect(cellIsSelected([1, 1], cell, sel(2, 2))).toBe(true); // col 2 ∈ [1,3], row 2 ∈ [1,2]
        expect(cellIsSelected([1, 1], cell, sel(2, 3))).toBe(false); // row 3 ∉ [1,2]
        expect(cellIsSelected([1, 1], cell, sel(4, 2))).toBe(false); // col 4 ∉ [1,3]
    });

    it("без span/spanRows: прежнее поведение (точное совпадение строки и колонки)", () => {
        const cell = textCell({});
        expect(cellIsSelected([1, 2], cell, sel(1, 2))).toBe(true);
        expect(cellIsSelected([1, 2], cell, sel(1, 3))).toBe(false);
        expect(cellIsSelected([1, 2], cell, sel(2, 2))).toBe(false);
    });

    it("чистый colspan (span без spanRows): строка проверяется точно (без изменений)", () => {
        const cell = textCell({ span: [1, 3] });
        expect(cellIsSelected([1, 5], cell, sel(2, 5))).toBe(true); // та же строка, col в span
        expect(cellIsSelected([1, 5], cell, sel(2, 6))).toBe(false); // другая строка
    });
});
