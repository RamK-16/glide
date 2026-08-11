import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react-hooks";
import {
    computeBounds,
    useMappedColumns,
    type MappedGridColumn,
} from "../src/internal/data-grid/render/data-grid-lib.js";
import type { InnerGridColumn } from "../src/internal/data-grid/data-grid-types.js";

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

// Grid-дефолт spanGroupHeader (проп DataEditor) — нормализация в useMappedColumns.
const inCol = (extra: Partial<InnerGridColumn>): InnerGridColumn =>
    ({ title: "A", width: 100, ...extra }) as InnerGridColumn;

describe("useMappedColumns — grid-дефолт spanGroupHeader", () => {
    it("grid-дефолт true включает слияние у листовой колонки без группы", () => {
        const { result } = renderHook(() => useMappedColumns([inCol({})], 0, undefined, true));
        expect(result.current[0].spanGroupHeader).toBe(true);
    });

    it("spanGroupHeader: false на колонке отключает, несмотря на grid-дефолт true (точечный опт-аут)", () => {
        const { result } = renderHook(() => useMappedColumns([inCol({ spanGroupHeader: false })], 0, undefined, true));
        expect(result.current[0].spanGroupHeader).toBe(false);
    });

    it("колонка с группой не сливается даже при grid-дефолте true (проп не трогает группы)", () => {
        const { result } = renderHook(() => useMappedColumns([inCol({ group: "G" })], 0, undefined, true));
        expect(result.current[0].spanGroupHeader).toBe(false);
    });
});
