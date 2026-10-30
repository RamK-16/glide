/**
 * Верхняя граница каждой строки: `offsets[i]` — сумма высот строк `0..i-1`, `offsets[rows]` — высота всех строк.
 * Считается один раз на колбэк `rowHeight`, чтобы скролл не обходил все строки. `buffer` той же длины
 * перезаписывается, а не выделяется заново при каждой смене высот.
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
