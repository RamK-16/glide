import type { GridSelection, InnerGridCell, Item, Rectangle } from "../data-grid-types.js";
import type { ColumnLayout } from "./data-grid-freeze.js";
import { computeCanBlit } from "./data-grid-render.blit.js";
import type { Highlight } from "./data-grid-render.cells.js";
import type { DrawGridArg } from "./draw-grid-arg.js";

/**
 * Между кадрами сменились только выделение, регионы подсветки или фокус, а данные, темы,
 * размеры и колонки прежние. Тогда прошлый кадр годится, перерисовать нужно лишь прежние и
 * новые области выделения, см. `getSelectionChangeRegions`.
 */
export function isSelectionOnlyChange(current: DrawGridArg, last: DrawGridArg): boolean {
    if (
        current.selection === last.selection &&
        current.highlightRegions === last.highlightRegions &&
        current.isFocused === last.isFocused
    ) {
        return false;
    }
    return (
        computeCanBlit(current, {
            ...last,
            selection: current.selection,
            highlightRegions: current.highlightRegions,
            isFocused: current.isFocused,
        }) === true
    );
}

export interface SelectionChangeRegionsArgs {
    readonly selection: GridSelection;
    readonly lastSelection: GridSelection;
    readonly highlightRegions: readonly Highlight[] | undefined;
    readonly lastHighlightRegions: readonly Highlight[] | undefined;
    readonly focusChanged: boolean;
    readonly columnLayout: ColumnLayout;
    readonly cellYOffset: number;
    readonly translateY: number;
    readonly totalHeaderHeight: number;
    readonly width: number;
    readonly height: number;
    /** Все строки вместе с итоговыми */
    readonly rows: number;
    readonly freezeTrailingRows: number;
    readonly pinnedRowsCount: number;
    readonly stickySpanInView: boolean;
    readonly getRowHeight: (row: number) => number;
    readonly getCellContent: (cell: Item) => InnerGridCell;
}

/** Запас вокруг ячеек: маркер растяжения и обводки регионов выходят за край ячейки. */
export const SELECTION_REGION_PAD = 8;
/** Если области занимают больше этой доли тела таблицы, кадр целиком дешевле. */
const MAX_AREA_SHARE = 0.6;
/** Больше этого числа областей клип и проверка каждой ячейки по ним дороже кадра целиком. */
const MAX_REGIONS = 64;
/** Сколько раз расширяем область до границ слитых блоков, прежде чем сдаться. */
const MAX_SPAN_PASSES = 8;

/** Диапазон ячеек, границы включительно. */
interface CellRange {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
}

const rangeOf = (r: Rectangle): CellRange => ({ x0: r.x, y0: r.y, x1: r.x + r.width - 1, y1: r.y + r.height - 1 });

function addSelectionRanges(target: CellRange[], selection: GridSelection): void {
    const current = selection.current;
    if (current === undefined) return;
    target.push(
        { x0: current.cell[0], y0: current.cell[1], x1: current.cell[0], y1: current.cell[1] },
        rangeOf(current.range),
        ...current.rangeStack.map(rangeOf)
    );
}

const highlightKey = (h: Highlight) =>
    `${h.range.x},${h.range.y},${h.range.width},${h.range.height},${h.color},${h.style ?? ""},${
        h.drawAboveSelection === true
    }`;

/**
 * Регион на той же позиции с тем же содержимым рисуется так же, его не трогаем. Остальные,
 * прежние и новые, перерисовываем. Позиция важна: регионы ложатся друг на друга по порядку.
 */
function addHighlightChanges(
    target: CellRange[],
    last: readonly Highlight[] | undefined,
    current: readonly Highlight[] | undefined
): void {
    const a = last ?? [];
    const b = current ?? [];
    const n = Math.max(a.length, b.length);
    for (let i = 0; i < n; i++) {
        const ha = a[i];
        const hb = b[i];
        if (ha !== undefined && hb !== undefined && highlightKey(ha) === highlightKey(hb)) continue;
        if (ha !== undefined) target.push(rangeOf(ha.range));
        if (hb !== undefined) target.push(rangeOf(hb.range));
    }
}

interface VisibleColumn {
    readonly sourceIndex: number;
    readonly left: number;
    readonly right: number;
}

/**
 * Что перерисовать поверх прошлого кадра, когда сменились только выделение, регионы подсветки
 * или фокус; undefined, если кадр надо перерисовать целиком.
 *
 * Области: ячейки прежнего и нового выделения (с диапазонами и стеком диапазонов), изменившиеся
 * регионы подсветки, при смене фокуса текущее выделение. Слитый блок красится целиком, поэтому
 * область, задевшая блок, растягивается до его границ. Выбранные строки и колонки красят всю
 * строку или колонку вместе с пустой областью, для них кадр целиком.
 */
export function getSelectionChangeRegions(args: SelectionChangeRegionsArgs): Rectangle[] | undefined {
    const { selection, lastSelection, columnLayout, cellYOffset, width, height, rows, getRowHeight, getCellContent } =
        args;
    if (args.pinnedRowsCount > 0 || args.stickySpanInView) return undefined;
    if (
        selection !== lastSelection &&
        (!selection.columns.equals(lastSelection.columns) || !selection.rows.equals(lastSelection.rows))
    ) {
        return undefined;
    }
    if (args.focusChanged && (selection.columns.length > 0 || selection.rows.length > 0)) return undefined;

    const ranges: CellRange[] = [];
    addSelectionRanges(ranges, lastSelection);
    if (selection !== lastSelection) addSelectionRanges(ranges, selection);
    if (args.highlightRegions !== args.lastHighlightRegions) {
        addHighlightChanges(ranges, args.lastHighlightRegions, args.highlightRegions);
    }
    if (ranges.length > MAX_REGIONS) return undefined;

    // Итоговые строки прижаты к низу экрана, отдельно от строк тела
    const bodyRows = rows - args.freezeTrailingRows;
    if (args.freezeTrailingRows > 0 && ranges.some(r => r.y1 >= bodyRows && r.y0 <= r.y1)) return undefined;

    // Видимые строки тела: верх каждой и низ последней
    const rowTops: number[] = [];
    let y = args.totalHeaderHeight + args.translateY;
    for (let row = cellYOffset; row < bodyRows && y < height; row++) {
        rowTops.push(y);
        y += getRowHeight(row);
    }
    const rowsBottom = y;
    const lastVisibleRow = cellYOffset + rowTops.length - 1;

    // Видимые колонки: прилипшие на своих местах, прокручиваемые обрезаны по краю закреплённой зоны
    const pinnedEnd = columnLayout.axis.pinnedEnd;
    const columns: VisibleColumn[] = [];
    for (const c of columnLayout.effectiveCols) {
        const x = columnLayout.drawX(c.sourceIndex);
        const left = c.sticky ? x : Math.max(x, pinnedEnd);
        const right = Math.min(x + c.width, width);
        if (right > left) columns.push({ sourceIndex: c.sourceIndex, left, right });
    }

    const regions: Rectangle[] = [];
    let area = 0;
    for (const range of ranges) {
        const expanded = expandToSpans(range, columns, cellYOffset, lastVisibleRow, getCellContent);
        if (expanded === undefined) return undefined;
        const vy0 = Math.max(expanded.y0, cellYOffset);
        const vy1 = Math.min(expanded.y1, lastVisibleRow);
        if (vy0 > vy1) continue;
        let left = Number.POSITIVE_INFINITY;
        let right = Number.NEGATIVE_INFINITY;
        for (const c of columns) {
            if (c.sourceIndex < expanded.x0 || c.sourceIndex > expanded.x1) continue;
            left = Math.min(left, c.left);
            right = Math.max(right, c.right);
        }
        if (left >= right) continue;
        const top = rowTops[vy0 - cellYOffset];
        const bottom = vy1 === lastVisibleRow ? rowsBottom : rowTops[vy1 - cellYOffset + 1];
        const region = clampRect(
            {
                x: left - SELECTION_REGION_PAD,
                y: top - SELECTION_REGION_PAD,
                width: right - left + SELECTION_REGION_PAD * 2,
                height: bottom - top + SELECTION_REGION_PAD * 2,
            },
            width,
            height
        );
        if (region === undefined || regions.some(r => sameRect(r, region))) continue;
        regions.push(region);
        area += region.width * region.height;
    }

    const bodyArea = width * Math.max(0, height - args.totalHeaderHeight);
    if (area > bodyArea * MAX_AREA_SHARE) return undefined;
    return regions;
}

/**
 * Диапазон, растянутый до границ слитых блоков, которые он задевает. Блок, пересекающий границу
 * диапазона, обязательно содержит ячейку на этой границе, поэтому спрашиваем только ячейки по
 * периметру видимой части и повторяем, пока границы растут. undefined, если границы не сошлись.
 */
function expandToSpans(
    range: CellRange,
    columns: readonly VisibleColumn[],
    firstRow: number,
    lastRow: number,
    getCellContent: (cell: Item) => InnerGridCell
): CellRange | undefined {
    const r = { ...range };
    for (let pass = 0; pass < MAX_SPAN_PASSES; pass++) {
        const vy0 = Math.max(r.y0, firstRow);
        const vy1 = Math.min(r.y1, lastRow);
        if (vy0 > vy1) return r;
        const visible = columns.filter(c => c.sourceIndex >= r.x0 && c.sourceIndex <= r.x1);
        if (visible.length === 0) return r;
        const edgeCols = new Set([visible[0].sourceIndex, visible[visible.length - 1].sourceIndex]);
        let grown = false;
        for (const c of visible) {
            if (edgeCols.has(c.sourceIndex)) {
                for (let row = vy0; row <= vy1; row++) {
                    grown = growToSpan(r, getCellContent([c.sourceIndex, row])) || grown;
                }
            } else {
                grown = growToSpan(r, getCellContent([c.sourceIndex, vy0])) || grown;
                if (vy1 !== vy0) grown = growToSpan(r, getCellContent([c.sourceIndex, vy1])) || grown;
            }
        }
        if (!grown) return r;
    }
    return undefined;
}

/** Растягивает диапазон до слитого блока ячейки; true, если границы сдвинулись. */
function growToSpan(r: CellRange, cell: InnerGridCell): boolean {
    const x0 = cell.span === undefined ? r.x0 : Math.min(r.x0, cell.span[0]);
    const x1 = cell.span === undefined ? r.x1 : Math.max(r.x1, cell.span[1]);
    const y0 = cell.spanRows === undefined ? r.y0 : Math.min(r.y0, cell.spanRows[0]);
    const y1 = cell.spanRows === undefined ? r.y1 : Math.max(r.y1, cell.spanRows[1]);
    if (x0 === r.x0 && x1 === r.x1 && y0 === r.y0 && y1 === r.y1) return false;
    r.x0 = x0;
    r.x1 = x1;
    r.y0 = y0;
    r.y1 = y1;
    return true;
}

function clampRect(r: Rectangle, width: number, height: number): Rectangle | undefined {
    const x = Math.max(0, r.x);
    const y = Math.max(0, r.y);
    const right = Math.min(width, r.x + r.width);
    const bottom = Math.min(height, r.y + r.height);
    if (right <= x || bottom <= y) return undefined;
    return { x, y, width: right - x, height: bottom - y };
}

const sameRect = (a: Rectangle, b: Rectangle) =>
    a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
