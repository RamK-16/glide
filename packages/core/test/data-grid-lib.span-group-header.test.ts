import { describe, expect, it } from "vitest";
import { computeBounds, type MappedGridColumn } from "../src/internal/data-grid/render/data-grid-lib.js";

// Минимальный конструктор MappedGridColumn для теста геометрии bounds.
function col(partial: Partial<MappedGridColumn>): MappedGridColumn {
    return { title: "", width: 100, sourceIndex: 0, sticky: false, ...partial } as unknown as MappedGridColumn;
}

// groupHeaderHeight = 30, headerHeight = 36 → totalHeaderHeight = 66
const GROUP_H = 30;
const HEADER_H = 36;
const TOTAL_H = GROUP_H + HEADER_H;

const cols: MappedGridColumn[] = [
    col({ width: 150, sourceIndex: 0, spanGroupHeader: true }), // слитая, без группы
    col({ width: 160, sourceIndex: 1, group: "G" }), // обычная в группе
];

function bounds(colIndex: number, row: number) {
    return computeBounds(
        colIndex,
        row,
        1000, // width
        1000, // height
        GROUP_H, // groupHeaderHeight
        TOTAL_H, // totalHeaderHeight
        0, // cellXOffset
        0, // cellYOffset
        0, // translateX
        0, // translateY
        100, // rows
        0, // freezeColumns
        0, // freezeTrailingRows
        cols,
        32 // rowHeight
    );
}

describe("computeBounds — spanGroupHeader (bounds шапки на всю высоту)", () => {
    it("слитая колонка при row=-1 → bounds на ВСЮ высоту шапки (y=0, height=totalHeaderHeight)", () => {
        const b = bounds(0, -1);
        expect(b.y).toBe(0);
        expect(b.height).toBe(TOTAL_H);
    });

    it("обычная колонка при row=-1 → только нижняя полоса (y=groupHeaderHeight, height=headerHeight)", () => {
        const b = bounds(1, -1);
        expect(b.y).toBe(GROUP_H);
        expect(b.height).toBe(HEADER_H);
    });

    it("x/width слитой колонки не меняются (только вертикальная геометрия)", () => {
        const b = bounds(0, -1);
        expect(b.x).toBe(0);
        expect(b.width).toBe(150 + 1);
    });
});
