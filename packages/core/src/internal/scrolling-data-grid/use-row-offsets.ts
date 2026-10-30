import React from "react";
import { getRowOffsets } from "./row-offsets.js";

/**
 * Верхние границы строк для колбэка `rowHeight`, см. `getRowOffsets`. Буферов два: новый рендер пишет в тот,
 * что не показан. React может выбросить рендер (прерванный transition, Suspense), и показанная таблица
 * продолжит читать свой буфер — его никто не перезаписал.
 */
export function useRowOffsets(rows: number, rowHeight: number | ((row: number) => number)): Float64Array | undefined {
    const buffers = React.useRef<[Float64Array | undefined, Float64Array | undefined]>([undefined, undefined]);
    const committed = React.useRef<Float64Array | undefined>(undefined);

    const offsets = React.useMemo(() => {
        if (typeof rowHeight === "number") return undefined;
        const spare = buffers.current[0] !== undefined && buffers.current[0] === committed.current ? 1 : 0;
        buffers.current[spare] = getRowOffsets(rows, rowHeight, buffers.current[spare]);
        return buffers.current[spare];
    }, [rows, rowHeight]);

    React.useLayoutEffect(() => {
        committed.current = offsets;
    }, [offsets]);

    return offsets;
}
