/* eslint-disable unicorn/no-for-loop */
import type { MappedGridColumn } from "./data-grid-lib.js";

/**
 * Ось липких элементов (строк или колонок), как `position: sticky`.
 *
 * Прилипшие элементы всегда образуют префикс `items`, поэтому закреплённая зона сплошная:
 * `[base, pinnedEnd)`. Всё остальное прокручивается и клипуется по `pinnedEnd`.
 */
export class StickyAxis {
    public readonly positions: readonly number[];
    public readonly pinnedCount: number;
    public readonly pinnedEnd: number;
    /** Край зоны, когда прилипли все элементы. */
    public readonly maxEnd: number;

    /**
     * @param items липкие индексы по возрастанию
     * @param naturalPositions экранные позиции без прилипания; `-Infinity` — элемент уже прокручен
     */
    constructor(
        public readonly items: readonly number[],
        public readonly sizes: readonly number[],
        naturalPositions: readonly number[],
        public readonly base: number
    ) {
        const positions: number[] = [];
        let slot = base;
        let pinnedCount = 0;
        for (let itemPosition = 0; itemPosition < items.length; itemPosition++) {
            const isPinned = pinnedCount === itemPosition && naturalPositions[itemPosition] <= slot;
            if (isPinned) pinnedCount++;
            positions.push(isPinned ? slot : naturalPositions[itemPosition]);
            slot += sizes[itemPosition];
        }
        this.positions = positions;
        this.pinnedCount = pinnedCount;
        this.pinnedEnd = pinnedCount === 0 ? base : positions[pinnedCount - 1] + sizes[pinnedCount - 1];
        this.maxEnd = slot;
    }

    public get hasItems(): boolean {
        return this.items.length > 0;
    }

    /** Позиция индекса в `items` или -1. */
    public positionOf(index: number): number {
        let low = 0;
        let high = this.items.length - 1;
        while (low <= high) {
            const middle = (low + high) >> 1;
            const middleIndex = this.items[middle];
            if (middleIndex === index) return middle;
            if (middleIndex < index) low = middle + 1;
            else high = middle - 1;
        }
        return -1;
    }

    public isPinned(index: number): boolean {
        const itemPosition = this.positionOf(index);
        return itemPosition !== -1 && itemPosition < this.pinnedCount;
    }

    /** Есть ли прилипший элемент в `[from, to]`. */
    public hasPinnedIn(from: number, to: number): boolean {
        for (let itemPosition = 0; itemPosition < this.pinnedCount; itemPosition++) {
            const index = this.items[itemPosition];
            if (index > to) return false;
            if (index >= from) return true;
        }
        return false;
    }

    public stickyPosition(index: number): number | undefined {
        const itemPosition = this.positionOf(index);
        return itemPosition === -1 ? undefined : this.positions[itemPosition];
    }

    public stickySize(index: number): number | undefined {
        const itemPosition = this.positionOf(index);
        return itemPosition === -1 ? undefined : this.sizes[itemPosition];
    }

    /** Прилипший элемент под экранной координатой. */
    public pinnedAt(screenPosition: number): number | undefined {
        let low = 0;
        let high = this.pinnedCount - 1;
        while (low <= high) {
            const middle = (low + high) >> 1;
            const start = this.positions[middle];
            if (screenPosition < start) high = middle - 1;
            else if (screenPosition >= start + this.sizes[middle]) low = middle + 1;
            else return this.items[middle];
        }
        return undefined;
    }

    /** Подряд идущие прилипшие элементы внутри `[from, to]`, включая `index`: закреплённая часть слитого блока. */
    public pinnedRun(index: number, from: number, to: number): { position: number; size: number } | undefined {
        const itemPosition = this.positionOf(index);
        if (itemPosition === -1 || itemPosition >= this.pinnedCount) return undefined;
        let first = itemPosition;
        while (first > 0 && this.items[first - 1] >= from) first--;
        let last = itemPosition;
        while (last + 1 < this.pinnedCount && this.items[last + 1] <= to) last++;
        const position = this.positions[first];
        return { position, size: this.positions[last] + this.sizes[last] - position };
    }

    public forEachPinned(callback: (index: number, position: number, size: number) => void): void {
        for (let itemPosition = 0; itemPosition < this.pinnedCount; itemPosition++) {
            callback(this.items[itemPosition], this.positions[itemPosition], this.sizes[itemPosition]);
        }
    }
}

/**
 * Фрагмент слитого по строкам блока `[from, to]`, который рисуется для строки `row`.
 * - `pinned` — строка прилипла: блок рисуется в полосе прилипших строк, на высоту подряд прилипших строк блока;
 * - `scroll` — прокручиваемая часть; `hidesContent` — часть блока прилипла и контент показывает она.
 */
export type SpanRowsFragment =
    | { readonly kind: "pinned"; readonly position: number; readonly size: number }
    | { readonly kind: "scroll"; readonly hidesContent: boolean };

export function spanRowsFragment(
    rowAxis: StickyAxis | undefined,
    row: number,
    isPinnedRow: boolean,
    from: number,
    to: number
): SpanRowsFragment {
    const pinned = isPinnedRow ? rowAxis?.pinnedRun(row, from, to) : undefined;
    if (pinned !== undefined) return { kind: "pinned", ...pinned };
    return { kind: "scroll", hidesContent: rowAxis?.hasPinnedIn(from, to) === true };
}

export function emptyStickyAxis(base: number): StickyAxis {
    return new StickyAxis([], [], [], base);
}

/** Сортирует, убирает дубли и индексы вне `[0, count)`, сдвигает на `offset`. */
export function normalizeStickyIndexes(
    indexes: readonly number[] | undefined,
    count: number,
    offset = 0
): readonly number[] | undefined {
    const valid = indexes?.filter(index => Number.isInteger(index) && index >= 0 && index < count) ?? [];
    if (valid.length === 0) return undefined;
    return [...new Set(valid)].sort((left, right) => left - right).map(index => index + offset);
}

export interface ColumnLayout {
    readonly axis: StickyAxis;
    /** Сначала прилипшие колонки, затем видимые прокручиваемые; `sticky` значит «прилипла в этом кадре». */
    readonly effectiveCols: readonly MappedGridColumn[];
    drawX(sourceIndex: number): number;
    isPinned(sourceIndex: number): boolean;
}

/** Позиции колонок без прилипания: прокручиваемая часть начинается с `cellXOffset` сразу за префиксом `freezeColumns`. */
function computeNaturalX(
    columns: readonly MappedGridColumn[],
    cellXOffset: number,
    translateX: number,
    freezeColumns: number
): Float64Array {
    let start = translateX;
    for (let position = 0; position < freezeColumns && position < columns.length; position++) {
        start += columns[position].width;
    }
    const naturalX = new Float64Array(columns.length);
    let x = start;
    for (let position = cellXOffset; position < columns.length; position++) {
        naturalX[position] = x;
        x += columns[position].width;
    }
    x = start;
    for (let position = cellXOffset - 1; position >= 0; position--) {
        x -= columns[position].width;
        naturalX[position] = x;
    }
    return naturalX;
}

function computeColumnAxis(
    columns: readonly MappedGridColumn[],
    naturalX: Float64Array,
    cellXOffset: number
): StickyAxis {
    const items: number[] = [];
    const widths: number[] = [];
    const itemsX: number[] = [];
    for (let position = 0; position < columns.length; position++) {
        if (!columns[position].sticky) continue;
        items.push(position);
        widths.push(columns[position].width);
        itemsX.push(position < cellXOffset ? Number.NEGATIVE_INFINITY : naturalX[position]);
    }
    return new StickyAxis(items, widths, itemsX, 0);
}

/** @param columns колонки в порядке отрисовки (после `remapForDnDState`) */
export function computeColumnLayout(
    columns: readonly MappedGridColumn[],
    cellXOffset: number,
    translateX: number,
    width: number,
    freezeColumns: number
): ColumnLayout {
    const naturalX = computeNaturalX(columns, cellXOffset, translateX, freezeColumns);
    const axis = computeColumnAxis(columns, naturalX, cellXOffset);

    const drawXBySource = new Float64Array(columns.length);
    const pinnedBySource = new Uint8Array(columns.length);
    for (let position = 0; position < columns.length; position++) {
        drawXBySource[columns[position].sourceIndex] = naturalX[position];
    }

    const effectiveCols: MappedGridColumn[] = [];
    axis.forEachPinned((position, x) => {
        const column = columns[position];
        effectiveCols.push(column);
        pinnedBySource[column.sourceIndex] = 1;
        drawXBySource[column.sourceIndex] = x;
    });
    for (let position = cellXOffset; position < columns.length && naturalX[position] <= width; position++) {
        const column = columns[position];
        const hiddenUnderPinned = naturalX[position] + column.width < axis.pinnedEnd;
        if (pinnedBySource[column.sourceIndex] === 1 || hiddenUnderPinned) continue;
        effectiveCols.push(column.sticky ? { ...column, sticky: false } : column);
    }

    const layout: ColumnLayout = {
        axis,
        effectiveCols,
        drawX: sourceIndex => drawXBySource[sourceIndex] ?? 0,
        isPinned: sourceIndex => pinnedBySource[sourceIndex] === 1,
    };
    Object.defineProperty(effectiveCols, columnLayoutKey, { value: layout });
    return layout;
}

// Раскладка и ось строк кадра едут вместе с массивом `effectiveCols`, чтобы обходчики брали их без
// нового параметра. Для массивов, собранных вручную, их нет — работает апстримное накопление ширин.
const columnLayoutKey = Symbol("columnLayout");
const rowAxisKey = Symbol("rowAxis");

export function columnLayoutOf(effectiveCols: readonly MappedGridColumn[]): ColumnLayout | undefined {
    return (effectiveCols as { [columnLayoutKey]?: ColumnLayout })[columnLayoutKey];
}

export function attachRowAxis(effectiveCols: readonly MappedGridColumn[], rowAxis: StickyAxis): void {
    Object.defineProperty(effectiveCols, rowAxisKey, { value: rowAxis });
}

export function rowAxisOf(effectiveCols: readonly MappedGridColumn[]): StickyAxis | undefined {
    return (effectiveCols as { [rowAxisKey]?: StickyAxis })[rowAxisKey];
}

/**
 * Ось липких строк. Строки выше `cellYOffset` уже прокручены; позиции остальных считаются проходом
 * по видимым строкам до `height`. Липкие строки с индексом от `rowsEnd` (закреплённые снизу) отбрасываются.
 */
export function computeRowAxis(
    stickyRows: readonly number[] | undefined,
    rowsEnd: number,
    cellYOffset: number,
    translateY: number,
    base: number,
    height: number,
    getRowHeight: (row: number) => number
): StickyAxis {
    const rows = stickyRows?.filter(row => row >= 0 && row < rowsEnd) ?? [];
    let walkY = base + translateY;
    let walkRow = cellYOffset;
    const naturalY = rows.map(row => {
        if (row < cellYOffset) return Number.NEGATIVE_INFINITY;
        while (walkRow < row && walkY <= height) walkY += getRowHeight(walkRow++);
        return walkRow === row ? walkY : Number.POSITIVE_INFINITY;
    });
    return new StickyAxis(
        rows,
        rows.map(row => getRowHeight(row)),
        naturalY,
        base
    );
}
