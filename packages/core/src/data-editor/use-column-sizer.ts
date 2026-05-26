import * as React from "react";
import type { FullTheme } from "../common/styles.js";
import type { DataGridSearchProps } from "../internal/data-grid-search/data-grid-search.js";
import type { GetCellRendererCallback } from "../cells/cell-types.js";

import {
    type CellArray,
    type GridCell,
    type GridColumn,
    type InnerGridColumn,
    isSizedGridColumn,
    resolveCellsThunk,
    type SizedGridColumn,
} from "../internal/data-grid/data-grid-types.js";
const defaultSize = 150;

function clampSizedColumn(c: SizedGridColumn): SizedGridColumn {
    let w = c.width;
    if (c.minWidth !== undefined && w < c.minWidth) w = c.minWidth;
    if (c.maxWidth !== undefined && w > c.maxWidth) w = c.maxWidth;
    return w === c.width ? c : { ...c, width: w };
}

function measureCell(
    ctx: CanvasRenderingContext2D,
    cell: GridCell,
    theme: FullTheme,
    getCellRenderer: GetCellRendererCallback
): number {
    const r = getCellRenderer(cell);
    return r?.measure?.(ctx, cell, theme) ?? defaultSize;
}

export function measureColumn(
    ctx: CanvasRenderingContext2D,
    theme: FullTheme,
    c: GridColumn,
    colIndex: number,
    selectedData: CellArray,
    minColumnWidth: number,
    maxColumnWidth: number,
    removeOutliers: boolean,
    getCellRenderer: GetCellRendererCallback
): SizedGridColumn {
    let max = 0;
    const sizes: number[] =
        selectedData === undefined
            ? []
            : selectedData.map(row => {
                  const r = measureCell(ctx, row[colIndex], theme, getCellRenderer);
                  max = Math.max(max, r);
                  return r;
              });

    if (sizes.length > 5 && removeOutliers) {
        max = 0;
        // Filter out outliers
        let sum = 0;
        for (const size of sizes) {
            sum += size;
        }
        const average = sum / sizes.length;
        // Set sizes that are considered outliers to zero
        for (let i = 0; i < sizes.length; i++) {
            if (sizes[i] >= average * 2) {
                sizes[i] = 0;
            } else {
                max = Math.max(max, sizes[i]);
            }
        }
    }
    const currentFont = ctx.font;
    ctx.font = theme.headerFontFull;
    max = Math.max(max, ctx.measureText(c.title).width + theme.cellHorizontalPadding * 2 + (c.icon === undefined ? 0 : 28));
    ctx.font = currentFont;
    const effectiveMin = c.minWidth ?? minColumnWidth;
    const rawAutoMax = c.maxAutoWidth ?? maxColumnWidth;
    const effectiveMax = c.maxWidth !== undefined ? Math.min(rawAutoMax, c.maxWidth) : rawAutoMax;
    const final = Math.max(Math.ceil(effectiveMin), Math.min(Math.floor(effectiveMax), Math.ceil(max)));

    return {
        ...c,
        width: final,
    };
}

/** @category Hooks */
export function useColumnSizer(
    columns: readonly GridColumn[],
    rows: number,
    getCellsForSelection: DataGridSearchProps["getCellsForSelection"],
    clientWidth: number,
    minColumnWidth: number,
    maxColumnWidth: number,
    theme: FullTheme,
    getCellRenderer: GetCellRendererCallback,
    abortController: AbortController
): {
    readonly sizedColumns: readonly InnerGridColumn[];
    readonly nonGrowWidth: number;
} {
    const rowsRef = React.useRef(rows);
    const getCellsForSelectionRef = React.useRef(getCellsForSelection);
    const themeRef = React.useRef(theme);
    rowsRef.current = rows;
    getCellsForSelectionRef.current = getCellsForSelection;
    themeRef.current = theme;

    const [canvas, ctx] = React.useMemo(() => {
        if (typeof window === "undefined") return [null, null];
        const offscreen = document.createElement("canvas");
        offscreen.style["display"] = "none";
        offscreen.style["opacity"] = "0";
        offscreen.style["position"] = "fixed";
        return [offscreen, offscreen.getContext("2d", { alpha: false })];
    }, []);

    React.useLayoutEffect(() => {
        if (canvas) document.documentElement.append(canvas);
        return () => {
            canvas?.remove();
        };
    }, [canvas]);

    const memoMap = React.useRef<Record<string, number>>({});

    const lastColumns = React.useRef<typeof columns | undefined>(undefined);
    const [selectedData, setSelectionData] = React.useState<CellArray | undefined>();

    React.useLayoutEffect(() => {
        const getCells = getCellsForSelectionRef.current;
        if (getCells === undefined || columns.every(isSizedGridColumn)) return;
        let computeRows = Math.max(1, 10 - Math.floor(columns.length / 10_000));
        let tailRows = 0;
        if (computeRows < rowsRef.current && computeRows > 1) {
            computeRows--;
            tailRows = 1;
        }

        const computeArea = {
            x: 0,
            y: 0,
            width: columns.length,
            height: Math.min(rowsRef.current, computeRows),
        };

        const tailComputeArea = {
            x: 0,
            y: rowsRef.current - 1,
            width: columns.length,
            height: 1,
        };
        const fn = async () => {
            const getResult = getCells(computeArea, abortController.signal);
            const tailGetResult = tailRows > 0 ? getCells(tailComputeArea, abortController.signal) : undefined;
            let toSet: CellArray;
            // eslint-disable-next-line unicorn/prefer-ternary
            if (typeof getResult === "object") {
                toSet = getResult;
            } else {
                toSet = await resolveCellsThunk(getResult);
            }
            if (tailGetResult !== undefined) {
                // eslint-disable-next-line unicorn/prefer-ternary
                if (typeof tailGetResult === "object") {
                    toSet = [...toSet, ...tailGetResult];
                } else {
                    toSet = [...toSet, ...(await resolveCellsThunk(tailGetResult))];
                }
            }
            lastColumns.current = columns;
            setSelectionData(toSet);
        };
        void fn();
    }, [abortController.signal, columns]);

    return React.useMemo(() => {
        const getRaw = () => {
            if (columns.every(isSizedGridColumn)) {
                // Сохраняем ссылочное равенство, если clamp ничего не изменил
                const clamped = columns.map(clampSizedColumn);
                const changed = clamped.some((c, i) => c !== columns[i]);
                return changed ? clamped : columns;
            }

            if (ctx === null) {
                return columns.map(c => {
                    if (isSizedGridColumn(c)) return clampSizedColumn(c);

                    return {
                        ...c,
                        width: defaultSize,
                    };
                });
            }

            ctx.font = themeRef.current.baseFontFull;

            return columns.map((c, colIndex) => {
                if (isSizedGridColumn(c)) return clampSizedColumn(c);

                if (memoMap.current[c.id] !== undefined) {
                    return {
                        ...c,
                        width: memoMap.current[c.id],
                    };
                }

                if (selectedData === undefined || lastColumns.current !== columns || c.id === undefined) {
                    return {
                        ...c,
                        width: defaultSize,
                    };
                }

                const r = measureColumn(
                    ctx,
                    theme,
                    c,
                    colIndex,
                    selectedData,
                    minColumnWidth,
                    maxColumnWidth,
                    true,
                    getCellRenderer
                );
                memoMap.current[c.id] = r.width;
                return r;
            });
        };

        let result: readonly InnerGridColumn[] = getRaw();
        let totalWidth = 0;
        let totalGrow = 0;
        const distribute: number[] = [];
        for (const [i, c] of result.entries()) {
            totalWidth += c.width;
            if (c.grow !== undefined && c.grow > 0) {
                totalGrow += c.grow;
                distribute.push(i);
            }
        }
        if (totalWidth < clientWidth && distribute.length > 0) {
            const writeable = [...result];
            let remaining = clientWidth - totalWidth;
            let activeIndices = [...distribute];
            let activeGrow = totalGrow;

            while (remaining > 0 && activeIndices.length > 0) {
                const nextActive: number[] = [];
                let nextGrow = 0;
                let distributed = 0;

                for (let di = 0; di < activeIndices.length; di++) {
                    const i = activeIndices[di];
                    const col = writeable[i];
                    const weighted = (col.grow ?? 0) / activeGrow;
                    const raw = di === activeIndices.length - 1
                        ? remaining - distributed
                        : Math.min(remaining - distributed, Math.floor(remaining * weighted));

                    const baseWidth = result[i].width;
                    const currentGrowOffset = (col.growOffset ?? 0);
                    const currentWidth = baseWidth + currentGrowOffset;

                    const growCap = col.maxAutoWidth ?? maxColumnWidth;
                    const hardCap = col.maxWidth;
                    let cap = growCap;
                    if (hardCap !== undefined) cap = Math.min(cap, hardCap);

                    const maxGrow = Math.max(0, cap - currentWidth);
                    const toAdd = Math.min(raw, maxGrow);

                    if (toAdd > 0) {
                        writeable[i] = {
                            ...col,
                            growOffset: currentGrowOffset + toAdd,
                            width: currentWidth + toAdd,
                        };
                    }

                    distributed += toAdd;

                    if (toAdd < raw && maxGrow <= 0) {
                        // capped — not participating in next round
                    } else if (toAdd < raw) {
                        // partially capped
                    } else {
                        nextActive.push(i);
                        nextGrow += col.grow ?? 0;
                    }
                }

                remaining -= distributed;
                if (distributed === 0) break;
                activeIndices = nextActive;
                activeGrow = nextGrow;
            }
            result = writeable;
        }
        return {
            sizedColumns: result,
            nonGrowWidth: totalWidth,
        };
    }, [clientWidth, columns, ctx, selectedData, theme, minColumnWidth, maxColumnWidth, getCellRenderer]);
}
