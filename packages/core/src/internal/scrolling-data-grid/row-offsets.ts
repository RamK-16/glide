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
 * Чем новый колбэк `rowHeight` отличается от прежнего колбэка с версией `previousVersion`: у строк вне
 * `from..to` (границы включительно) он возвращает те же числа, что и прежний. Glide, который считал позиции
 * и рисовал кадр для прежней версии, спросит высоты только у строк `from..to` и перерисует экран только от
 * первой из них. Пустой диапазон задаётся `from > to`: высоты не менялись. Если число строк другое или glide
 * не видел прежнюю версию, подсказка не используется и всё пересчитывается целиком.
 */
export interface RowHeightChanges {
    /** `version` прежнего колбэка, которого заменяет новый */
    readonly previousVersion: number;
    /** Первая строка, у которой высота могла измениться (включительно) */
    readonly from: number;
    /** Последняя такая строка (включительно) */
    readonly to: number;
}

/**
 * Колбэк высоты строки. `version` и `changes` необязательны: без них glide при каждом новом колбэке
 * пересчитывает позиции всех строк и перерисовывает экран целиком.
 */
export type RowHeightCallback = ((row: number) => number) & {
    /**
     * Номер колбэка, на который ссылается `changes.previousVersion` следующего. Должен быть свой у каждого
     * колбэка одного грида: по совпавшему номеру glide считает, что видел именно этот колбэк.
     */
    readonly version?: number;
    readonly changes?: RowHeightChanges;
};

/** Подсказка `current`, если она описывает переход именно от `previous`; иначе undefined */
export function rowHeightChangesSince(
    current: number | RowHeightCallback,
    previous: number | RowHeightCallback | undefined
): RowHeightChanges | undefined {
    if (typeof current === "number" || typeof previous !== "function") return undefined;
    const changes = current.changes;
    if (changes === undefined || previous.version === undefined) return undefined;
    return changes.previousVersion === previous.version ? changes : undefined;
}

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
