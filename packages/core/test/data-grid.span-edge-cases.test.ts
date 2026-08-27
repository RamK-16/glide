/* eslint-disable unicorn/consistent-function-scoping */
import { describe, expect, it } from "vitest";
import { cellIsSelected, computeBounds, type MappedGridColumn } from "../src/internal/data-grid/render/data-grid-lib.js";
import {
    findSpannedGroupRegion,
    getGroupLevels,
    getSpannedGroupRegions,
    type SpannedGroupRegionCols,
} from "../src/internal/data-grid/render/data-grid-render.walk.js";
import {
    pushSpanSelectionStrips,
    type SpanPartialFill,
} from "../src/internal/data-grid/render/data-grid-render.cells.js";
import { expandSelection } from "../src/data-editor/data-editor-fns.js";
import {
    CompactSelection,
    GridCellKind,
    type GridCell,
    type GridSelection,
    type InnerGridCell,
    type Rectangle,
} from "../src/internal/data-grid/data-grid-types.js";

// Добивка граничных кейсов span-хелперов: несмежные полосы выделения, полосы по строкам
// и колонкам одновременно, guard cellIsSelected, colspan-ветка expandSelection,
// уровни findSpannedGroupRegion.

const cols3 = [{ width: 100 }, { width: 100 }, { width: 100 }] as unknown as Parameters<
    typeof pushSpanSelectionStrips
>[8];
const rh = () => 20;

function strips(rows: CompactSelection, columns: CompactSelection): SpanPartialFill[] {
    const out: SpanPartialFill[] = [];
    // Блок: колонки [0,2], строки [0,3]. cellWidth 300, cellHeight 80.
    pushSpanSelectionStrips(rows, columns, [0, 2], [0, 3], 0, 0, 300, 80, cols3, rh, "#s", out);
    return out;
}

describe("pushSpanSelectionStrips — несмежные и комбинированные полосы", () => {
    it("несмежные выделенные строки дают отдельные полосы", () => {
        const out = strips(CompactSelection.empty().add(0).add(2), CompactSelection.empty());
        expect(out).toHaveLength(2);
        expect(out[0]).toMatchObject({ y: 0, h: 20 });
        expect(out[1]).toMatchObject({ y: 40, h: 20 });
    });

    it("несмежные выделенные колонки дают отдельные вертикальные полосы", () => {
        const out = strips(CompactSelection.empty(), CompactSelection.empty().add(0).add(2));
        expect(out).toHaveLength(2);
        expect(out[0]).toMatchObject({ x: 0, w: 100, y: 0, h: 80 });
        expect(out[1]).toMatchObject({ x: 200, w: 100, y: 0, h: 80 });
    });

    it("строка и колонка одновременно: полосы обоих направлений", () => {
        const out = strips(CompactSelection.fromSingleSelection(1), CompactSelection.fromSingleSelection(1));
        expect(out).toHaveLength(2);
        // Горизонтальная полоса строки 1 и вертикальная полоса колонки 1.
        expect(out[0]).toMatchObject({ x: 0, w: 300, y: 20, h: 20 });
        expect(out[1]).toMatchObject({ x: 100, w: 100, y: 0, h: 80 });
    });

    it("пустое выделение — полос нет", () => {
        expect(strips(CompactSelection.empty(), CompactSelection.empty())).toEqual([]);
    });

    it("выделение вне диапазона блока — полос нет", () => {
        const out = strips(CompactSelection.fromSingleSelection(7), CompactSelection.fromSingleSelection(9));
        expect(out).toEqual([]);
    });
});

describe("cellIsSelected — guard", () => {
    const noSel: GridSelection = {
        current: undefined,
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty(),
    };

    it("selection.current undefined → false, включая слитые ячейки", () => {
        const plain = { kind: GridCellKind.Text } as unknown as InnerGridCell;
        const merged = { kind: GridCellKind.Text, span: [0, 2], spanRows: [0, 2] } as unknown as InnerGridCell;
        expect(cellIsSelected([0, 0], plain, noSel)).toBe(false);
        expect(cellIsSelected([0, 0], merged, noSel)).toBe(false);
    });
});

describe("expandSelection — colspan (расширение диапазона по колонкам)", () => {
    // На строке 0 колонки 1-2 слиты по горизонтали.
    const getCells = ((rect: Rectangle) => {
        const out: GridCell[][] = [];
        for (let y = rect.y; y < rect.y + rect.height; y++) {
            const rowArr: GridCell[] = [];
            for (let x = rect.x; x < rect.x + rect.width; x++) {
                rowArr.push({
                    kind: GridCellKind.Text,
                    data: "",
                    displayData: "",
                    allowOverlay: false,
                    ...(y === 0 && x >= 1 && x <= 2 ? { span: [1, 2] } : {}),
                } as GridCell);
            }
            out.push(rowArr);
        }
        return out;
    }) as Parameters<typeof expandSelection>[1];

    function rangeSel(x: number, y: number, w: number, h: number): GridSelection {
        return {
            current: { cell: [x, y], range: { x, y, width: w, height: h }, rangeStack: [] },
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty(),
        };
    }

    it("диапазон на части colspan-блока растёт до всего span", () => {
        const res = expandSelection(rangeSel(2, 0, 1, 1), getCells, 0, "default", new AbortController());
        expect(res.current?.range).toEqual({ x: 1, y: 0, width: 2, height: 1 });
    });

    it("cell и rangeStack сохраняются при расширении", () => {
        const res = expandSelection(rangeSel(2, 0, 1, 1), getCells, 0, "default", new AbortController());
        expect(res.current?.cell).toEqual([2, 0]);
        expect(res.current?.rangeStack).toEqual([]);
    });
});

describe("computeBounds — запрос с нижнего (пустого) уровня слитой группы", () => {
    function mcol(partial: Partial<MappedGridColumn>): MappedGridColumn {
        return { title: "", width: 100, sourceIndex: 0, sticky: false, ...partial } as unknown as MappedGridColumn;
    }
    // "G" терминальна и слита вниз, "H"→"S" глубокая. Групп-ряды 30+28, шапка 36.
    const cols: MappedGridColumn[] = [
        mcol({ sourceIndex: 0, group: "G" }),
        mcol({ sourceIndex: 1, group: ["H", "S"] }),
    ];
    const regions = getSpannedGroupRegions(cols, getGroupLevels(cols), () => true);

    it("row=-3 (нижний ряд) по слитой колонке → те же bounds, что и с верхнего ряда", () => {
        const fromTop = computeBounds(0, -2, 1000, 1000, [30, 28], 94, 0, 0, 0, 0, 100, 0, 0, cols, 32, regions);
        const fromBottom = computeBounds(0, -3, 1000, 1000, [30, 28], 94, 0, 0, 0, 0, 100, 0, 0, cols, 32, regions);
        expect(fromBottom).toEqual(fromTop);
        expect(fromBottom.y).toBe(0);
        expect(fromBottom.height).toBe(58);
    });
});

describe("findSpannedGroupRegion — уровни", () => {
    const regions: readonly SpannedGroupRegionCols[] = [{ level: 1, startCol: 2, endCol: 4 }];

    it("запрос на уровне региона и глубже → регион найден", () => {
        expect(findSpannedGroupRegion(regions, 3, 1)).toEqual(regions[0]);
        expect(findSpannedGroupRegion(regions, 3, 2)).toEqual(regions[0]);
    });

    it("запрос ВЫШЕ уровня региона → undefined (регион не тянется вверх)", () => {
        expect(findSpannedGroupRegion(regions, 3, 0)).toBeUndefined();
    });

    it("колонка на границах региона включительно", () => {
        expect(findSpannedGroupRegion(regions, 2, 1)).toEqual(regions[0]);
        expect(findSpannedGroupRegion(regions, 4, 1)).toEqual(regions[0]);
        expect(findSpannedGroupRegion(regions, 5, 1)).toBeUndefined();
    });
});
