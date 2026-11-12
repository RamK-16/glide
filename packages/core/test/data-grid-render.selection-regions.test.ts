import { describe, expect, it } from "vitest";
import {
    CompactSelection,
    GridCellKind,
    type GridSelection,
    type InnerGridCell,
    type Item,
    type Rectangle,
} from "../src/internal/data-grid/data-grid-types.js";
import type { MappedGridColumn } from "../src/internal/data-grid/render/data-grid-lib.js";
import { computeColumnLayout } from "../src/internal/data-grid/render/data-grid-freeze.js";
import type { Highlight } from "../src/internal/data-grid/render/data-grid-render.cells.js";
import {
    getSelectionChangeRegions,
    isSelectionOnlyChange,
    SELECTION_REGION_PAD as PAD,
    selectionHeaderChanged,
    selectionRegionPad,
    type SelectionChangeRegionsArgs,
} from "../src/internal/data-grid/render/data-grid-render.selection-regions.js";
import type { DrawGridArg } from "../src/internal/data-grid/render/draw-grid-arg.js";

const HEADER = 36;
const ROW = 30;
const COL = 100;
const OFFSET = 10;
const WIDTH = 600;
const HEIGHT = 600;

const makeColumns = (sticky: readonly boolean[]) =>
    sticky.map((s, i) => ({ title: `${i}`, width: COL, sourceIndex: i, sticky: s })) as unknown as MappedGridColumn[];
const plainColumns = makeColumns([false, false, false, false, false]);
const layout = computeColumnLayout(plainColumns, 0, 0, WIDTH, 0);

const textCell = (cell: Item): InnerGridCell => ({
    kind: GridCellKind.Text,
    allowOverlay: false,
    data: "",
    displayData: `${cell[0]},${cell[1]}`,
});

const none: GridSelection = { current: undefined, columns: CompactSelection.empty(), rows: CompactSelection.empty() };
const sel = (col: number, row: number, range?: Rectangle, rangeStack: Rectangle[] = []): GridSelection => ({
    ...none,
    current: { cell: [col, row], range: range ?? { x: col, y: row, width: 1, height: 1 }, rangeStack },
});
const highlight = (col: number, row: number, color = "red"): Highlight => ({
    color,
    range: { x: col, y: row, width: 1, height: 1 },
    style: "no-outline",
});

/** Экранная область ячеек с запасом: колонки и строки от `col`,`row`, строки считаются от `OFFSET` */
const cellRect = (col: number, row: number, cols = 1, rows = 1): Rectangle => ({
    x: col * COL - PAD,
    y: HEADER + (row - OFFSET) * ROW - PAD,
    width: cols * COL + PAD * 2,
    height: rows * ROW + PAD * 2,
});

/** Область, обрезанная по левому краю экрана */
const onScreen = (r: Rectangle): Rectangle => ({ ...r, x: Math.max(0, r.x), width: r.width + Math.min(0, r.x) });

const base: SelectionChangeRegionsArgs = {
    selection: none,
    lastSelection: none,
    highlightRegions: undefined,
    lastHighlightRegions: undefined,
    focusChanged: false,
    columnLayout: layout,
    cellYOffset: OFFSET,
    translateY: 0,
    totalHeaderHeight: HEADER,
    width: WIDTH,
    height: HEIGHT,
    rows: 1000,
    freezeTrailingRows: 0,
    pinnedRowsCount: 0,
    stickySpanInView: false,
    getRowHeight: () => ROW,
    getCellContent: textCell,
};
const regions = (over: Partial<SelectionChangeRegionsArgs>) => getSelectionChangeRegions({ ...base, ...over });

describe("getSelectionChangeRegions", () => {
    it("клик с ячейки на ячейку: прежняя и новая ячейки с запасом", () => {
        expect(regions({ lastSelection: sel(1, 12), selection: sel(3, 15) })).toEqual([
            cellRect(1, 12),
            cellRect(3, 15),
        ]);
    });

    it("протяжка диапазона: прежний диапазон лежит в новом и отдельной областью не нужен", () => {
        const last = sel(1, 12, { x: 1, y: 12, width: 2, height: 2 });
        const next = sel(1, 12, { x: 1, y: 12, width: 3, height: 4 });
        expect(regions({ lastSelection: last, selection: next })).toEqual([cellRect(1, 12, 3, 4)]);
        // ячейка вне диапазона (так бывает у внешнего выделения) идёт отдельной областью
        const odd = sel(4, 20, { x: 1, y: 12, width: 2, height: 2 });
        expect(regions({ selection: odd })).toEqual([cellRect(4, 20), cellRect(1, 12, 2, 2)]);
    });

    it("площадь считается без вложенных областей: протяжка на треть экрана остаётся частичной", () => {
        const last = sel(0, OFFSET, { x: 0, y: OFFSET, width: 3, height: 7 });
        const next = sel(0, OFFSET, { x: 0, y: OFFSET, width: 3, height: 8 });
        expect(regions({ lastSelection: last, selection: next })).toHaveLength(1);
    });

    it("стек диапазонов тоже перерисовывается", () => {
        const next = sel(1, 12, undefined, [{ x: 3, y: 14, width: 1, height: 2 }]);
        expect(regions({ selection: next })).toEqual([cellRect(1, 12), cellRect(3, 14, 1, 2)]);
    });

    it("смена фокуса без смены выделения: область текущего выделения", () => {
        const current = sel(1, 12);
        expect(regions({ lastSelection: current, selection: current, focusChanged: true })).toEqual([cellRect(1, 12)]);
    });

    it("выбраны строки или колонки: кадр целиком", () => {
        const rows = { ...none, rows: CompactSelection.fromSingleSelection(12) };
        const columns = { ...none, columns: CompactSelection.fromSingleSelection(2) };
        expect(regions({ selection: rows })).toBeUndefined();
        expect(regions({ selection: columns })).toBeUndefined();
        expect(regions({ lastSelection: rows, selection: rows, focusChanged: true })).toBeUndefined();
        expect(regions({ lastSelection: rows, selection: { ...rows } })).toEqual([]);
    });

    it("выделение в итоговой строке снизу: кадр целиком", () => {
        expect(regions({ selection: sel(1, 999), freezeTrailingRows: 1 })).toBeUndefined();
        expect(regions({ selection: sel(1, 12), freezeTrailingRows: 1 })).toEqual([cellRect(1, 12)]);
    });

    it("прилипшие строки или липкий блок на экране: кадр целиком", () => {
        expect(regions({ selection: sel(1, 12), pinnedRowsCount: 1 })).toBeUndefined();
        expect(regions({ selection: sel(1, 12), stickySpanInView: true })).toBeUndefined();
    });

    it("регионы подсветки: перерисовываются только изменившиеся", () => {
        const a = highlight(0, 11);
        expect(
            regions({
                lastHighlightRegions: [a, highlight(2, 13)],
                highlightRegions: [{ ...a }, highlight(2, 14)],
            })
        ).toEqual([cellRect(2, 13), cellRect(2, 14)]);
    });

    it("регион на той же позиции с другим цветом или стилем: перерисовывается", () => {
        expect(
            regions({ lastHighlightRegions: [highlight(2, 13)], highlightRegions: [highlight(2, 13, "blue")] })
        ).toEqual([cellRect(2, 13)]);
    });

    it("новый массив регионов с тем же содержимым: в теле ничего не меняется", () => {
        const last = [highlight(0, 11), highlight(2, 13)];
        expect(regions({ lastHighlightRegions: last, highlightRegions: last.map(h => ({ ...h })) })).toEqual([]);
    });

    it("ячейка в слитом блоке: область на весь блок", () => {
        const spanned = (cell: Item): InnerGridCell =>
            cell[0] >= 1 && cell[0] <= 2 && cell[1] >= 12 && cell[1] <= 15
                ? { ...textCell(cell), span: [1, 2], spanRows: [12, 15] }
                : textCell(cell);
        expect(regions({ selection: sel(1, 13), getCellContent: spanned })).toEqual([cellRect(1, 12, 2, 4)]);
        // диапазон задел блок краем: растягивается до блока
        expect(
            regions({ selection: sel(0, 13, { x: 0, y: 13, width: 2, height: 1 }), getCellContent: spanned })
        ).toEqual([onScreen(cellRect(0, 12, 3, 4))]);
    });

    it("выделение за кадром: областей нет", () => {
        expect(regions({ selection: sel(1, 500) })).toEqual([]);
        expect(regions({ selection: sel(1, 3) })).toEqual([]);
        expect(regions({ lastSelection: sel(1, 500), selection: sel(2, 12) })).toEqual([cellRect(2, 12)]);
    });

    it("блок задет ячейкой за кадром: его видимая часть попадает в область", () => {
        // блок строк 3..12 в колонке 1, выбрана строка 5 над экраном (экран с 10-й)
        const tall = (cell: Item): InnerGridCell =>
            cell[0] === 1 && cell[1] >= 3 && cell[1] <= 12 ? { ...textCell(cell), spanRows: [3, 12] } : textCell(cell);
        expect(regions({ lastSelection: sel(1, 5), selection: sel(3, 15), getCellContent: tall })).toEqual([
            cellRect(1, OFFSET, 1, 3),
            cellRect(3, 15),
        ]);
        // блок ниже экрана, выбрана строка под ним: видимой части нет
        const below = (cell: Item): InnerGridCell =>
            cell[0] === 1 && cell[1] >= 40 && cell[1] <= 60 ? { ...textCell(cell), spanRows: [40, 60] } : textCell(cell);
        expect(regions({ selection: sel(1, 50), getCellContent: below })).toEqual([]);
        // блок колонок 1..3 в строке 12, выбрана колонка 1, уехавшая под закреплённую нулевую
        const wide = (cell: Item): InnerGridCell =>
            cell[0] >= 1 && cell[0] <= 3 && cell[1] === 12 ? { ...textCell(cell), span: [1, 3] } : textCell(cell);
        const frozen = computeColumnLayout(makeColumns([true, false, false, false, false]), 2, 0, WIDTH, 1);
        expect(regions({ selection: sel(1, 12), columnLayout: frozen, getCellContent: wide })).toEqual([
            { ...cellRect(0, 12), x: frozen.drawX(2) - PAD, width: COL * 2 + PAD * 2 },
        ]);
    });

    it("соседний блок, который диапазон не задевает, область не растягивает", () => {
        const neighbour = (cell: Item): InnerGridCell =>
            cell[0] === 2 && cell[1] >= 12 && cell[1] <= 14 ? { ...textCell(cell), spanRows: [12, 14] } : textCell(cell);
        expect(regions({ selection: sel(1, 13), getCellContent: neighbour })).toEqual([cellRect(1, 13)]);
    });

    it("запас области растёт с маркером растяжения", () => {
        expect(selectionRegionPad(undefined)).toBe(PAD);
        expect(selectionRegionPad(true)).toBe(PAD);
        expect(selectionRegionPad({ size: 12, offsetX: -4, offsetY: -4, outline: 2 })).toBe(13);
        expect(regions({ selection: sel(1, 12), fillHandle: { size: 12, offsetX: -4, offsetY: -4, outline: 2 } })).toEqual([
            { x: COL - 13, y: HEADER + 2 * ROW - 13, width: COL + 26, height: ROW + 26 },
        ]);
    });

    it("частично прокрученная первая строка учитывается", () => {
        expect(regions({ selection: sel(1, 12), translateY: -10 })).toEqual([
            { ...cellRect(1, 12), y: cellRect(1, 12).y - 10 },
        ]);
    });

    it("область обрезается по краям экрана", () => {
        const first = regions({ selection: sel(0, OFFSET) });
        expect(first).toEqual([{ x: 0, y: HEADER - PAD, width: COL + PAD, height: ROW + PAD * 2 }]);
    });

    it("диапазон на весь экран или слишком много регионов: кадр целиком", () => {
        expect(regions({ selection: sel(0, OFFSET, { x: 0, y: OFFSET, width: 5, height: 30 }) })).toBeUndefined();
        const many = Array.from({ length: 70 }, (_, i) => highlight(i % 5, OFFSET + (i % 15)));
        expect(regions({ highlightRegions: many })).toBeUndefined();
    });

    it("прилипшая колонка берётся с её места на экране", () => {
        const frozen = computeColumnLayout(makeColumns([true, false, false, false, false]), 2, 0, WIDTH, 1);
        expect(regions({ lastSelection: sel(0, 12), selection: sel(3, 12), columnLayout: frozen })).toEqual([
            onScreen(cellRect(0, 12)),
            { ...cellRect(0, 12), x: frozen.drawX(3) - PAD },
        ]);
        // колонка, уехавшая под закреплённую, на экране не видна
        expect(regions({ selection: sel(1, 12), columnLayout: frozen })).toEqual([]);
    });
});

describe("selectionHeaderChanged", () => {
    it("смена только строк шапку не трогает, смена колонки, диапазона по колонкам и стека трогает", () => {
        expect(selectionHeaderChanged(sel(1, 5), sel(1, 9))).toBe(false);
        expect(selectionHeaderChanged(sel(1, 5, { x: 1, y: 5, width: 1, height: 3 }), sel(1, 5))).toBe(false);
        expect(selectionHeaderChanged(sel(1, 5), sel(2, 5))).toBe(true);
        expect(selectionHeaderChanged(sel(1, 5, { x: 1, y: 5, width: 2, height: 1 }), sel(1, 5))).toBe(true);
        expect(selectionHeaderChanged(sel(1, 5), sel(1, 5, undefined, [{ x: 3, y: 1, width: 1, height: 1 }]))).toBe(true);
    });

    it("появление и сброс выделения, выбранные колонки и заголовок трогают шапку", () => {
        expect(selectionHeaderChanged(none, sel(1, 5))).toBe(true);
        expect(selectionHeaderChanged(sel(1, 5), none)).toBe(true);
        expect(selectionHeaderChanged(none, { ...none, columns: CompactSelection.fromSingleSelection(2) })).toBe(true);
        expect(selectionHeaderChanged(sel(1, -1), sel(1, 5))).toBe(true);
        expect(selectionHeaderChanged(none, none)).toBe(false);
    });
});

describe("isSelectionOnlyChange", () => {
    const arg = {
        width: WIDTH,
        height: HEIGHT,
        theme: {},
        headerHeight: HEADER,
        rowHeight: ROW,
        rows: 1000,
        freezeColumns: 0,
        stickyRows: undefined,
        getRowThemeOverride: undefined,
        isFocused: true,
        isResizing: false,
        verticalBorder: () => true,
        horizontalBorder: undefined,
        getCellBorder: undefined,
        hiddenColumnsIndicator: undefined,
        getCellContent: textCell,
        highlightRegions: undefined,
        selection: none,
        dragAndDropState: undefined,
        prelightCells: undefined,
        touchMode: false,
        maxScaleFactor: 1,
        mappedColumns: plainColumns,
    } as unknown as DrawGridArg;

    it("сменилось только выделение, регионы или фокус", () => {
        expect(isSelectionOnlyChange({ ...arg, selection: sel(1, 1) }, arg)).toBe(true);
        expect(isSelectionOnlyChange({ ...arg, highlightRegions: [highlight(0, 0)] }, arg)).toBe(true);
        expect(isSelectionOnlyChange({ ...arg, isFocused: false }, arg)).toBe(true);
    });

    it("маркер растяжения и отключённые строки сравниваются по содержимому, а не по ссылке", () => {
        const withHandle = { ...arg, fillHandle: { width: 8 }, disabledRows: CompactSelection.fromSingleSelection(2) };
        const sameContent = {
            ...withHandle,
            selection: sel(1, 1),
            fillHandle: { width: 8 },
            disabledRows: CompactSelection.fromSingleSelection(2),
        };
        expect(isSelectionOnlyChange(sameContent, withHandle)).toBe(true);
        expect(isSelectionOnlyChange({ ...sameContent, fillHandle: { width: 9 } }, withHandle)).toBe(false);
        expect(isSelectionOnlyChange({ ...sameContent, fillHandle: false }, withHandle)).toBe(false);
        expect(
            isSelectionOnlyChange({ ...sameContent, disabledRows: CompactSelection.fromSingleSelection(3) }, withHandle)
        ).toBe(false);
    });

    it("ничего не сменилось или сменилось что-то ещё", () => {
        expect(isSelectionOnlyChange(arg, arg)).toBe(false);
        expect(isSelectionOnlyChange({ ...arg, selection: sel(1, 1), getCellContent: cell => textCell(cell) }, arg)).toBe(
            false
        );
        expect(isSelectionOnlyChange({ ...arg, selection: sel(1, 1), rows: 999 }, arg)).toBe(false);
        expect(isSelectionOnlyChange({ ...arg, selection: sel(1, 1), getRowThemeOverride: () => undefined }, arg)).toBe(
            false
        );
    });
});
