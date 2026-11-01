import type { FillHandle, GridSelection, InnerGridCell, Item, Rectangle } from "../data-grid-types.js";
import { DEFAULT_FILL_HANDLE } from "../data-grid-types.js";
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

/**
 * Зависит ли шапка от разницы двух выделений. Шапка отмечает выбранные колонки, колонку выбранной
 * ячейки и колонки диапазонов (включая стек), а выделение заголовка идёт отрицательной строкой.
 * Смена только строк выделения шапку не трогает.
 */
export function selectionHeaderChanged(a: GridSelection, b: GridSelection): boolean {
    if (a === b) return false;
    if (!a.columns.equals(b.columns)) return true;
    const ca = a.current;
    const cb = b.current;
    if (ca === undefined || cb === undefined) return ca !== cb;
    if (ca.cell[0] !== cb.cell[0] || ca.cell[1] < 0 || cb.cell[1] < 0) return true;
    if (ca.range.x !== cb.range.x || ca.range.width !== cb.range.width) return true;
    if (ca.rangeStack.length !== cb.rangeStack.length) return true;
    for (let i = 0; i < ca.rangeStack.length; i++) {
        const ra = ca.rangeStack[i];
        const rb = cb.rangeStack[i];
        if (ra.x !== rb.x || ra.width !== rb.width || ra.y !== rb.y || ra.height !== rb.height) return true;
    }
    return false;
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
    /** Маркер растяжения выходит за край ячейки, запас области считается от его размера */
    readonly fillHandle?: FillHandle;
    readonly getRowHeight: (row: number) => number;
    readonly getCellContent: (cell: Item) => InnerGridCell;
}

/** Запас вокруг ячеек под обводки регионов и сглаженные края, не меньше этого. */
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

const rangeContains = (r: CellRange, col: number, row: number) =>
    col >= r.x0 && col <= r.x1 && row >= r.y0 && row <= r.y1;

/** Ячейка отдельно от диапазона нужна, только если диапазон её не содержит. */
function addSelectionRanges(target: CellRange[], selection: GridSelection): void {
    const current = selection.current;
    if (current === undefined) return;
    const range = rangeOf(current.range);
    const [col, row] = current.cell;
    if (!rangeContains(range, col, row)) target.push({ x0: col, y0: row, x1: col, y1: row });
    target.push(range, ...current.rangeStack.map(rangeOf));
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

/** Запас области под маркер растяжения: половина размера, смещение, обводка и пиксель на сглаживание. */
export function selectionRegionPad(fillHandle: FillHandle | undefined): number {
    if (fillHandle === undefined || fillHandle === false) return SELECTION_REGION_PAD;
    const fill = typeof fillHandle === "object" ? { ...DEFAULT_FILL_HANDLE, ...fillHandle } : DEFAULT_FILL_HANDLE;
    const reach = fill.size / 2 + Math.max(Math.abs(fill.offsetX), Math.abs(fill.offsetY)) + fill.outline + 1;
    return Math.max(SELECTION_REGION_PAD, Math.ceil(reach));
}

interface VisibleColumn {
    readonly sourceIndex: number;
    readonly left: number;
    readonly right: number;
}

/**
 * Что перерисовать поверх прошлого кадра, когда сменились только выделение, регионы подсветки
 * или фокус; undefined, если кадр надо перерисовать целиком. Пустой список значит, что на
 * экране от смены ничего не зависит.
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
    const visibleCols = columns.map(c => c.sourceIndex).sort((a, b) => a - b);
    const pad = selectionRegionPad(args.fillHandle);

    const regions: Rectangle[] = [];
    for (const range of ranges) {
        const expanded = expandToSpans(range, visibleCols, cellYOffset, lastVisibleRow, getCellContent);
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
            { x: left - pad, y: top - pad, width: right - left + pad * 2, height: bottom - top + pad * 2 },
            width,
            height
        );
        if (region !== undefined) regions.push(region);
    }

    // Область внутри другой ничего не добавляет: при протяжке прежний диапазон лежит в новом
    const kept = regions.filter((r, i) => !regions.some((o, j) => j !== i && containsRect(o, r) && (j < i || !sameRect(o, r))));
    let area = 0;
    for (const r of kept) area += r.width * r.height;
    const bodyArea = width * Math.max(0, height - args.totalHeaderHeight);
    if (area > bodyArea * MAX_AREA_SHARE) return undefined;
    return kept;
}

/**
 * Диапазон, растянутый до слитых блоков, которые он задевает и которые видны на экране. Блок
 * красится целиком, поэтому его видимая часть должна попасть в область, даже когда диапазон
 * задевает блок ячейкой за экраном: прокрученной вверх, ушедшей под закреплённую зону или за край.
 *
 * Спрашиваем только видимые ячейки: видимые колонки диапазона и ближайшую видимую колонку слева
 * и справа от него, видимые строки диапазона и ближайшую видимую строку выше и ниже. Блок, который
 * пересекает и диапазон, и экран, но выходит за диапазон, обязательно содержит ячейку на границе
 * этого набора: в крайних колонках на любой его строке или в крайних строках на любой его колонке.
 * Блоки, не задевающие диапазон, не учитываются. Повторяем, пока границы растут; undefined, если
 * за MAX_SPAN_PASSES границы не сошлись.
 */
function expandToSpans(
    range: CellRange,
    visibleCols: readonly number[],
    firstRow: number,
    lastRow: number,
    getCellContent: (cell: Item) => InnerGridCell
): CellRange | undefined {
    const r = { ...range };
    if (visibleCols.length === 0 || firstRow > lastRow) return r;
    for (let pass = 0; pass < MAX_SPAN_PASSES; pass++) {
        const cols = probeColumns(visibleCols, r.x0, r.x1);
        const probeRowList = probeRows(firstRow, lastRow, r.y0, r.y1);
        const edgeCols = new Set([cols[0], cols[cols.length - 1]]);
        const edgeRows = [probeRowList[0], probeRowList[probeRowList.length - 1]];
        let grown = false;
        for (const col of cols) {
            const rowsToProbe = edgeCols.has(col) ? probeRowList : edgeRows;
            for (const row of rowsToProbe) {
                grown = growToSpan(r, col, row, getCellContent([col, row])) || grown;
            }
        }
        if (!grown) return r;
    }
    return undefined;
}

/** Видимые колонки диапазона и ближайшие видимые слева и справа от него; `visible` по возрастанию */
function probeColumns(visible: readonly number[], x0: number, x1: number): number[] {
    const out: number[] = [];
    let left: number | undefined;
    let right: number | undefined;
    for (const c of visible) {
        if (c < x0) left = c;
        else if (c > x1) right ??= c;
        else out.push(c);
    }
    if (left !== undefined) out.unshift(left);
    if (right !== undefined) out.push(right);
    return out;
}

/** Видимые строки диапазона и ближайшие видимые выше и ниже него */
function probeRows(firstRow: number, lastRow: number, y0: number, y1: number): number[] {
    const out: number[] = [];
    if (y0 > firstRow) out.push(Math.min(y0 - 1, lastRow));
    for (let row = Math.max(y0, firstRow); row <= Math.min(y1, lastRow); row++) out.push(row);
    if (y1 < lastRow) out.push(Math.max(y1 + 1, firstRow));
    return out;
}

/** Растягивает диапазон до слитого блока ячейки, если блок задевает диапазон; true, если границы сдвинулись. */
function growToSpan(r: CellRange, col: number, row: number, cell: InnerGridCell): boolean {
    if (cell.span === undefined && cell.spanRows === undefined) return false;
    const [c0, c1] = cell.span ?? [col, col];
    const [r0, r1] = cell.spanRows ?? [row, row];
    if (c0 > r.x1 || c1 < r.x0 || r0 > r.y1 || r1 < r.y0) return false;
    const x0 = Math.min(r.x0, c0);
    const x1 = Math.max(r.x1, c1);
    const y0 = Math.min(r.y0, r0);
    const y1 = Math.max(r.y1, r1);
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

const containsRect = (outer: Rectangle, inner: Rectangle) =>
    inner.x >= outer.x &&
    inner.y >= outer.y &&
    inner.x + inner.width <= outer.x + outer.width &&
    inner.y + inner.height <= outer.y + outer.height;
