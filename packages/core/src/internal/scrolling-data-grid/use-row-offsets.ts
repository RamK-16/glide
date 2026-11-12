import React from "react";
import { getRowOffsets, rowHeightChangesSince, updateRowOffsets, type RowHeightCallback } from "./row-offsets.js";

/**
 * Верхние границы строк для колбэка `rowHeight`, см. `getRowOffsets`. Буферов два: новый рендер пишет в тот,
 * что не показан. React может выбросить рендер (прерванный transition, Suspense), и показанная таблица
 * продолжит читать свой буфер — его никто не перезаписал.
 *
 * Если у колбэка есть `changes` и последними посчитаны позиции как раз для `changes.previousVersion`, высоты
 * спрашиваются только у изменившихся строк (`updateRowOffsets`). Последний расчёт лежит либо в показанном
 * буфере, тогда пишем в другой, либо в непоказанном, тогда он и обновляется на месте.
 */
export function useRowOffsets(rows: number, rowHeight: number | RowHeightCallback): Float64Array | undefined {
    const buffers = React.useRef<[Float64Array | undefined, Float64Array | undefined]>([undefined, undefined]);
    const committed = React.useRef<Float64Array | undefined>(undefined);
    const last = React.useRef<{ rowHeight: RowHeightCallback; offsets: Float64Array } | undefined>(undefined);

    const offsets = React.useMemo(() => {
        if (typeof rowHeight === "number") return undefined;
        const base = last.current;
        if (base?.rowHeight === rowHeight && base.offsets.length === rows + 1) return base.offsets;

        const spare = buffers.current[0] !== undefined && buffers.current[0] === committed.current ? 1 : 0;
        const changes = rowHeightChangesSince(rowHeight, base?.rowHeight);
        buffers.current[spare] =
            changes !== undefined && base !== undefined && base.offsets.length === rows + 1
                ? updateRowOffsets(base.offsets, rowHeight, changes.from, changes.to, buffers.current[spare])
                : getRowOffsets(rows, rowHeight, buffers.current[spare]);
        last.current = { rowHeight, offsets: buffers.current[spare] };
        return buffers.current[spare];
    }, [rows, rowHeight]);

    React.useLayoutEffect(() => {
        committed.current = offsets;
    }, [offsets]);

    return offsets;
}
