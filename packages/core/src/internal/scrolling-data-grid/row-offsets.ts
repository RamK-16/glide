/**
 * Верхняя граница каждой строки: `offsets[i]` — сумма высот строк `0..i-1`, `offsets[rows]` — высота всех строк.
 * Считается один раз на колбэк `rowHeight`, чтобы скролл не обходил все строки. `buffer` той же длины
 * перезаписывается, а не выделяется заново при каждой смене высот. С подсказкой `changes` см. `updateRowOffsets`.
 */
export function getRowOffsets(rows: number, rowHeight: (row: number) => number, buffer?: Float64Array): Float64Array {
    const offsets = buffer?.length === rows + 1 ? buffer : new Float64Array(rows + 1);
    let y = 0;
    for (let r = 0; r < rows; r++) {
        y += rowHeight(r);
        offsets[r + 1] = y;
    }
    return offsets;
}

/**
 * Чем новый колбэк `rowHeight` отличается от прежнего. Glide, который считал позиции строк для `previous`,
 * спросит высоты только у строк `from..to`, а не у всех.
 */
export interface RowHeightChanges {
    /** Колбэк, который заменяет новый */
    readonly previous: (row: number) => number;
    /** Первая строка, у которой высота могла измениться */
    readonly from: number;
    /** Последняя такая строка: у строк вне `from..to` высоты те же, что у `previous` */
    readonly to: number;
}

/** Колбэк высоты строки, при желании с подсказкой, у каких строк высоты изменились */
export type RowHeightCallback = ((row: number) => number) & { readonly changes?: RowHeightChanges };

/**
 * `getRowOffsets` из готовых позиций `base` прежнего колбэка: высоты спрашиваются только у строк `from..to`,
 * строки ниже сдвигаются на разницу. `buffer` той же длины перезаписывается, им может быть и сам `base`.
 */
export function updateRowOffsets(
    base: Float64Array,
    rowHeight: (row: number) => number,
    from: number,
    to: number,
    buffer?: Float64Array
): Float64Array {
    const rows = base.length - 1;
    const offsets = buffer?.length === base.length ? buffer : new Float64Array(base.length);
    const first = Math.min(Math.max(from, 0), rows);
    const last = Math.min(to, rows - 1);

    if (offsets !== base) offsets.set(base.subarray(0, first + 1));
    if (last < first) {
        if (offsets !== base) offsets.set(base.subarray(first + 1), first + 1);
        return offsets;
    }

    const oldBottom = base[last + 1];
    let y = offsets[first];
    for (let r = first; r <= last; r++) {
        y += rowHeight(r);
        offsets[r + 1] = y;
    }

    const delta = y - oldBottom;
    if (delta === 0) {
        if (offsets !== base) offsets.set(base.subarray(last + 2), last + 2);
    } else {
        for (let r = last + 2; r <= rows; r++) offsets[r] = base[r] + delta;
    }
    return offsets;
}

export interface VisibleRows {
    readonly cellY: number;
    readonly cellBottom: number;
    readonly ty: number;
}

/**
 * Строки, видимые в окне `[y, y + height)`, для колбэка `rowHeight`. Частично прокрученная строка со
 * `smoothScrollY` остаётся видимой и сдвигает таблицу на `ty`, без него пропускается, когда прокручена её середина.
 * Последняя строка видна, когда её середина попала в окно.
 */
export function getVisibleRows(
    y: number,
    height: number,
    rowHeight: (row: number) => number,
    offsets: Float64Array,
    smoothScrollY: boolean
): VisibleRows {
    const rows = offsets.length - 1;

    let lo = 0;
    let hi = rows;
    while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        if (y >= offsets[mid + 1]) lo = mid + 1;
        else hi = mid;
    }

    let cellY = lo;
    let cellBottom = lo;
    let ty = 0;
    if (cellY < rows && y > offsets[cellY] + (smoothScrollY ? 0 : rowHeight(cellY) / 2)) {
        if (smoothScrollY) ty = offsets[cellY] - y;
        else cellY++;
        cellBottom++;
    }

    while (cellBottom < rows && y + height > rowHeight(cellBottom) / 2 + offsets[cellBottom]) {
        cellBottom++;
    }

    return { cellY, cellBottom, ty };
}
