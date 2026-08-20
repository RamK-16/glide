/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable unicorn/no-for-loop */
import {
    type GridSelection,
    type InnerGridCell,
    type Rectangle,
    CompactSelection,
    GridColumnIcon,
    type Item,
    type CellList,
    GridCellKind,
    type DrawCellCallback,
    isInnerOnlyCell,
    type GridCell,
    type SpanAlignment,
} from "../data-grid-types.js";
import { CellSet } from "../cell-set.js";
import type { HoverValues } from "../animation-manager.js";
import {
    type MappedGridColumn,
    cellIsSelected,
    cellIsInRange,
    getFreezeTrailingHeight,
    drawLastUpdateUnderlay,
} from "./data-grid-lib.js";
import type { SpriteManager } from "../data-grid-sprites.js";
import { mergeAndRealizeTheme, type FullTheme, type Theme } from "../../../common/styles.js";
import { blend } from "../color-parser.js";
import type { DrawArgs, DrawStateTuple, GetCellRendererCallback, PrepResult } from "../../../cells/cell-types.js";
import type { HoverInfo } from "./draw-grid-arg.js";
import type { EnqueueCallback } from "../use-animation-queue.js";
import type { RenderStateProvider } from "../../../common/render-state-provider.js";
import type { ImageWindowLoader } from "../image-window-loader-interface.js";
import { intersectRect } from "../../../common/math.js";
import type { GridMouseGroupHeaderEventArgs } from "../event-args.js";
import {
    getRowSpanBounds,
    getSkipPoint,
    resolveHorizontalSpanArea,
    walkColumns,
    walkRowsInCol,
} from "./data-grid-render.walk.js";

const loadingCell: InnerGridCell = {
    kind: GridCellKind.Loading,
    allowOverlay: false,
};

export interface GroupDetails {
    readonly name: string;
    readonly icon?: string;
    readonly overrideTheme?: Partial<Theme>;
    /**
     * Объединяет (rowspan) пустые нижние ряды «мелкой» группы в одну ячейку вместо
     * пустой полосы под заголовком; объединение доходит до ряда колонок, но его не включает.
     * Работает, только если ни у одной колонки этой группы нет более глубокой подгруппы.
     * Перекрывает общий проп `spanShallowGroups` для этой группы. Не задано → как раньше.
     */
    readonly span?: boolean;
    /** Выравнивание заголовка группы в объединённой ячейке. Работает только для объединённых групп (`span`). */
    readonly spanAlign?: SpanAlignment;
    readonly actions?: readonly {
        readonly title: string;
        readonly onClick: (e: GridMouseGroupHeaderEventArgs) => void;
        readonly icon: GridColumnIcon | string;
    }[];
}

export type GroupDetailsCallback = (groupName: string) => GroupDetails;
export type GetRowThemeCallback = (row: number) => Partial<Theme> | undefined;

export interface Highlight {
    readonly color: string;
    readonly range: Rectangle;
    readonly style?: "dashed" | "solid" | "no-outline" | "solid-outline";
}

interface SpanIntersection {
    c0: number;
    c1: number;
    r0: number;
    r1: number;
    /** Прямоугольник покрывает блок целиком. */
    full: boolean;
}

/** Пересечение прямоугольника выделения с диапазоном слитого блока (логические координаты). */
function intersectRangeWithSpan(
    r: Rectangle,
    blockCols: readonly [number, number],
    blockRows: readonly [number, number]
): SpanIntersection | null {
    const c0 = Math.max(r.x, blockCols[0]);
    const c1 = Math.min(r.x + r.width - 1, blockCols[1]);
    const r0 = Math.max(r.y, blockRows[0]);
    const r1 = Math.min(r.y + r.height - 1, blockRows[1]);
    if (c0 > c1 || r0 > r1) return null;
    const full = c0 === blockCols[0] && c1 === blockCols[1] && r0 === blockRows[0] && r1 === blockRows[1];
    return { c0, c1, r0, r1, full };
}

interface SpanPartialFill {
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
}

/**
 * Пиксельная полоса пересечения внутри блока: смещение от левого верхнего угла по
 * ширинам колонок и высотам строк, с клэмпом в видимую часть блока (frozen-сплит).
 */
function spanPartialFillRect(
    hit: SpanIntersection,
    blockCols: readonly [number, number],
    blockRows: readonly [number, number],
    cellX: number,
    cellY: number,
    cellWidth: number,
    cellHeight: number,
    allColumns: readonly MappedGridColumn[],
    getRowHeight: (row: number) => number,
    color: string
): SpanPartialFill | null {
    let px = cellX;
    let pw = 0;
    for (let cc = blockCols[0]; cc <= blockCols[1]; cc++) {
        const w = allColumns[cc]?.width ?? 0;
        if (cc < hit.c0) px += w;
        else if (cc <= hit.c1) pw += w;
    }
    let py = cellY;
    let ph = 0;
    for (let rr = blockRows[0]; rr <= blockRows[1]; rr++) {
        const h = getRowHeight(rr);
        if (rr < hit.r0) py += h;
        else if (rr <= hit.r1) ph += h;
    }
    const x0 = Math.max(px, cellX);
    const x1 = Math.min(px + pw, cellX + cellWidth);
    const y0 = Math.max(py, cellY);
    const y1 = Math.min(py + ph, cellY + cellHeight);
    if (x1 <= x0 || y1 <= y0) return null;
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0, color };
}

// preppable items:
// - font
// - fillStyle

// Column draw loop prep cycle
// - Prep item
// - Prep sets props
// - Prep returns list of cared about props
// - Draw item
// - Loop may set some items, if present in args list, set undefined
// - Prep next item, giving previous result
// - If next item type is different, de-prep
// - Result per column
export function drawCells(
    ctx: CanvasRenderingContext2D,
    effectiveColumns: readonly MappedGridColumn[],
    allColumns: readonly MappedGridColumn[],
    height: number,
    totalHeaderHeight: number,
    translateX: number,
    translateY: number,
    cellYOffset: number,
    rows: number,
    getRowHeight: (row: number) => number,
    getCellContent: (cell: Item) => InnerGridCell,
    getGroupDetails: GroupDetailsCallback,
    getRowThemeOverride: GetRowThemeCallback | undefined,
    disabledRows: CompactSelection,
    isFocused: boolean,
    drawFocus: boolean,
    freezeTrailingRows: number,
    hasAppendRow: boolean,
    drawRegions: readonly Rectangle[],
    damage: CellSet | undefined,
    selection: GridSelection,
    prelightCells: CellList | undefined,
    highlightRegions: readonly Highlight[] | undefined,
    imageLoader: ImageWindowLoader,
    spriteManager: SpriteManager,
    hoverValues: HoverValues,
    hoverInfo: HoverInfo | undefined,
    drawCellCallback: DrawCellCallback | undefined,
    hyperWrapping: boolean,
    outerTheme: FullTheme,
    enqueue: EnqueueCallback,
    renderStateProvider: RenderStateProvider,
    getCellRenderer: GetCellRendererCallback,
    overrideCursor: (cursor: React.CSSProperties["cursor"]) => void,
    minimumCellWidth: number
): Rectangle[] | undefined {
    let toDraw = damage?.size ?? Number.MAX_SAFE_INTEGER;
    const frameTime = performance.now();
    let font = outerTheme.baseFontFull;
    ctx.font = font;
    const deprepArg = { ctx };
    const cellIndex: [number, number] = [0, 0];
    const freezeTrailingRowsHeight =
        freezeTrailingRows > 0 ? getFreezeTrailingHeight(rows, freezeTrailingRows, getRowHeight) : 0;
    let result: Rectangle[] | undefined;
    let handledSpans: Set<string> | undefined = undefined;

    const skipPoint = getSkipPoint(drawRegions);

    walkColumns(
        effectiveColumns,
        cellYOffset,
        translateX,
        translateY,
        totalHeaderHeight,
        (c, drawX, colDrawStartY, clipX, startRow) => {
            const diff = Math.max(0, clipX - drawX);

            const colDrawX = drawX + diff;
            const colDrawY = totalHeaderHeight + 1;
            const colWidth = c.width - diff;
            const colHeight = height - totalHeaderHeight - 1;
            if (drawRegions.length > 0) {
                let found = false;
                for (let i = 0; i < drawRegions.length; i++) {
                    const dr = drawRegions[i];
                    if (intersectRect(colDrawX, colDrawY, colWidth, colHeight, dr.x, dr.y, dr.width, dr.height)) {
                        found = true;
                        break;
                    }
                }
                if (!found) return;
            }

            const reclip = () => {
                ctx.save();
                ctx.beginPath();
                ctx.rect(colDrawX, colDrawY, colWidth, colHeight);
                ctx.clip();
            };

            const colSelected = selection.columns.hasIndex(c.sourceIndex);

            const groupName = Array.isArray(c.group) ? (c.group[0] ?? "") : (c.group ?? "");
            const groupTheme = getGroupDetails(groupName).overrideTheme;
            const colTheme =
                c.themeOverride === undefined && groupTheme === undefined
                    ? outerTheme
                    : mergeAndRealizeTheme(outerTheme, groupTheme, c.themeOverride);
            const colFont = colTheme.baseFontFull;
            if (colFont !== font) {
                font = colFont;
                ctx.font = colFont;
            }
            reclip();
            let prepResult: PrepResult | undefined = undefined;

            walkRowsInCol(
                startRow,
                colDrawStartY,
                height,
                rows,
                getRowHeight,
                freezeTrailingRows,
                hasAppendRow,
                skipPoint,
                (drawY, row, rh, isSticky, isTrailingRow) => {
                    if (row < 0) return;

                    cellIndex[0] = c.sourceIndex;
                    cellIndex[1] = row;
                    // if (damage !== undefined && !damage.some(d => d[0] === c.sourceIndex && d[1] === row)) {
                    //     return;
                    // }
                    // if (
                    //     drawRegions.length > 0 &&
                    //     !drawRegions.some(dr => intersectRect(drawX, drawY, c.width, rh, dr.x, dr.y, dr.width, dr.height))
                    // ) {
                    //     return;
                    // }

                    // These are dumb versions of the above. I cannot for the life of believe that this matters but this is
                    // the tightest part of the draw loop and the allocations above actually has a very measurable impact
                    // on performance. For the love of all that is unholy please keep checking this again in the future.
                    // As soon as this doesn't have any impact of note go back to the saner looking code. The smoke test
                    // here is to scroll to the bottom of a test case first, then scroll back up while profiling and see
                    // how many major GC collections you get. These allocate a lot of objects.
                    if (damage !== undefined && !damage.has(cellIndex)) {
                        return;
                    }
                    if (drawRegions.length > 0) {
                        let found = false;
                        for (let i = 0; i < drawRegions.length; i++) {
                            const dr = drawRegions[i];
                            if (intersectRect(drawX, drawY, c.width, rh, dr.x, dr.y, dr.width, dr.height)) {
                                found = true;
                                break;
                            }
                        }
                        if (!found) return;
                    }

                    const rowSelected = selection.rows.hasIndex(row);
                    const rowDisabled = disabledRows.hasIndex(row);

                    const cell: InnerGridCell = row < rows ? getCellContent(cellIndex) : loadingCell;

                    let cellX = drawX;
                    let cellWidth = c.width;
                    let cellY = drawY;
                    let cellHeight = rh;
                    let drawingSpan = false;
                    let skipContents = false;
                    if (cell.span !== undefined || cell.spanRows !== undefined) {
                        // Прямоугольный блок: колонки из `span`, строки из `spanRows`. Ключ дедупа —
                        // логический прямоугольник (не текущая ячейка), поэтому любая из покрытых ячеек
                        // даёт один ключ: первая встреченная рисует блок, остальные скипаются.
                        const [startCol, endCol] = cell.span ?? [c.sourceIndex, c.sourceIndex];
                        const [spanStartRow, spanEndRow] = cell.spanRows ?? [row, row];
                        const spanKey = `${spanStartRow},${spanEndRow},${startCol},${endCol},${c.sticky}`; //alloc
                        if (handledSpans === undefined) handledSpans = new Set();
                        if (!handledSpans.has(spanKey)) {
                            // Горизонталь: colspan — через resolveHorizontalSpanArea (frozen/scrollable
                            // сплит), иначе одиночная колонка. horizontalOk === false → видимая часть
                            // colspan этой колонки в другой freeze-области: блок тут не рисуем.
                            const { hx, hw, horizontalOk, skipContents: horizontalSkip } =
                                resolveHorizontalSpanArea(cell.span, drawX, c.width, c, allColumns);
                            skipContents = horizontalSkip;
                            if (horizontalOk) {
                                // Вертикаль: rowspan — накопление высот строк блока; origin-строка может
                                // быть выше вьюпорта → cellY уходит в минус (scroll-safe, канва клипует).
                                if (cell.spanRows !== undefined) {
                                    const v = getRowSpanBounds(cell.spanRows, row, drawY, getRowHeight);
                                    cellY = v.y;
                                    cellHeight = v.height;
                                }
                                cellX = hx;
                                cellWidth = hw;
                                handledSpans.add(spanKey);
                                ctx.restore();
                                prepResult = undefined;
                                ctx.save();
                                ctx.beginPath();
                                const d = Math.max(0, clipX - cellX);
                                ctx.rect(cellX + d, cellY, cellWidth - d, cellHeight);
                                if (result === undefined) {
                                    result = [];
                                }
                                result.push({
                                    x: cellX + d,
                                    y: cellY,
                                    width: cellWidth - d,
                                    height: cellHeight,
                                });
                                ctx.clip();
                                drawingSpan = true;
                            }
                        } else {
                            toDraw--;
                            return;
                        }
                    }

                    const rowTheme = getRowThemeOverride?.(row);
                    const trailingTheme =
                        isTrailingRow && c.trailingRowOptions?.themeOverride !== undefined
                            ? c.trailingRowOptions?.themeOverride
                            : undefined;
                    const theme =
                        cell.themeOverride === undefined && rowTheme === undefined && trailingTheme === undefined
                            ? colTheme
                            : mergeAndRealizeTheme(colTheme, rowTheme, trailingTheme, cell.themeOverride); //alloc

                    ctx.beginPath();

                    // Слитый блок: выделение, пересекающее блок частично, красится полосой
                    // по пересечению, а не всем прямоугольником блока. Синтетический range
                    // строки/колонки не расширяется до блока, поэтому при частичном
                    // пересечении гасим accent-путь; гейт без drawFocus, как cellIsInRange.
                    let spanPartialFills: SpanPartialFill[] | undefined;
                    const spanBlockCols: readonly [number, number] = cell.span ?? [c.sourceIndex, c.sourceIndex];
                    const spanBlockRows: readonly [number, number] = cell.spanRows ?? [row, row];
                    let rangeIsPartial = false;
                    if (drawingSpan && selection.current !== undefined) {
                        const hit = intersectRangeWithSpan(selection.current.range, spanBlockCols, spanBlockRows);
                        if (hit !== null && !hit.full) {
                            rangeIsPartial = true;
                            const strip = spanPartialFillRect(
                                hit,
                                spanBlockCols,
                                spanBlockRows,
                                cellX,
                                cellY,
                                cellWidth,
                                cellHeight,
                                allColumns,
                                getRowHeight,
                                theme.accentLight
                            );
                            if (strip !== null) {
                                spanPartialFills = [strip];
                            }
                        }
                    }

                    const isSelected = !rangeIsPartial && cellIsSelected(cellIndex, cell, selection);
                    let accentCount = rangeIsPartial ? 0 : cellIsInRange(cellIndex, cell, selection, drawFocus);
                    const spanIsHighlighted =
                        cell.span !== undefined &&
                        selection.columns.some(
                            index => cell.span !== undefined && index >= cell.span[0] && index <= cell.span[1] //alloc
                        );
                    if (isSelected && !isFocused && drawFocus) {
                        accentCount = 0;
                    } else if (isSelected && drawFocus) {
                        accentCount = Math.max(accentCount, 1);
                    }
                    if (spanIsHighlighted) {
                        accentCount++;
                    }
                    if (!isSelected) {
                        if (rowSelected) accentCount++;
                        if (colSelected && !isTrailingRow) accentCount++;
                    }

                    const bgCell = cell.kind === GridCellKind.Protected ? theme.bgCellMedium : theme.bgCell;
                    let fill: string | undefined;
                    if (isSticky || bgCell !== outerTheme.bgCell) {
                        fill = blend(bgCell, fill);
                    }

                    if (accentCount > 0 || rowDisabled) {
                        if (rowDisabled) {
                            fill = blend(theme.bgHeader, fill);
                        }
                        for (let i = 0; i < accentCount; i++) {
                            fill = blend(theme.accentLight, fill);
                        }
                    } else if (prelightCells !== undefined) {
                        for (const pre of prelightCells) {
                            if (pre[0] === c.sourceIndex && pre[1] === row) {
                                fill = blend(theme.bgSearchResult, fill);
                                break;
                            }
                        }
                    }

                    if (highlightRegions !== undefined && !drawingSpan) {
                        for (let i = 0; i < highlightRegions.length; i++) {
                            const region = highlightRegions[i];
                            const r = region.range;
                            if (
                                region.style !== "solid-outline" &&
                                r.x <= c.sourceIndex &&
                                c.sourceIndex < r.x + r.width &&
                                r.y <= row &&
                                row < r.y + r.height
                            ) {
                                fill = blend(region.color, fill);
                            }
                        }
                    }

                    // Слитый блок: fill-регион красит только своё пересечение с блоком;
                    // полный охват идёт обычным blend всей заливки.
                    if (highlightRegions !== undefined && drawingSpan) {
                        for (let i = 0; i < highlightRegions.length; i++) {
                            const region = highlightRegions[i];
                            if (region.style === "solid-outline") continue;
                            const hit = intersectRangeWithSpan(region.range, spanBlockCols, spanBlockRows);
                            if (hit === null) continue;
                            if (hit.full) {
                                fill = blend(region.color, fill);
                                continue;
                            }
                            const strip = spanPartialFillRect(
                                hit,
                                spanBlockCols,
                                spanBlockRows,
                                cellX,
                                cellY,
                                cellWidth,
                                cellHeight,
                                allColumns,
                                getRowHeight,
                                region.color
                            );
                            if (strip !== null) {
                                if (spanPartialFills === undefined) spanPartialFills = [];
                                spanPartialFills.push(strip);
                            }
                        }
                    }

                    let didDamageClip = false;
                    if (damage !== undefined) {
                        // we want to clip each cell individually rather than form a super clip region. The reason for
                        // this is passing too many clip regions to the GPU at once can cause a performance hit. This
                        // allows us to damage a large number of cells at once without issue.
                        // Для слитой ячейки cellY/cellHeight = весь блок (иначе drawY/rh = одна строка),
                        // чтобы damage-перерисовка покрывала блок целиком, а не одну строку.
                        const top = cellY + 1;
                        const bottom = isSticky
                            ? top + cellHeight - 1
                            : Math.min(top + cellHeight - 1, height - freezeTrailingRowsHeight);
                        const h = bottom - top;

                        // however, not clipping at all is even better. We want to clip if we are the left most col
                        // or overlapping the bottom clip area.
                        if (h !== cellHeight - 1 || cellX + 1 <= clipX) {
                            didDamageClip = true;
                            ctx.save();
                            ctx.beginPath();
                            ctx.rect(cellX + 1, top, cellWidth - 1, h);
                            ctx.clip();
                        }

                        // we also need to make sure to wipe the contents. Since the fill can do that lets repurpose
                        // that call to avoid an extra draw call.
                        fill = fill === undefined ? theme.bgCell : blend(fill, theme.bgCell);
                    }

                    const isLastColumn = c.sourceIndex === allColumns.length - 1;
                    const isLastRow = row === rows - 1;
                    if (fill !== undefined) {
                        ctx.fillStyle = fill;
                        if (prepResult !== undefined) {
                            prepResult.fillStyle = fill;
                        }
                        if (damage !== undefined) {
                            // this accounts for the fill handle outline being drawn inset on these cells. We do this
                            // because technically the bottom right corner of the outline are on other cells.
                            ctx.fillRect(
                                cellX + 1,
                                cellY + 1,
                                cellWidth - (isLastColumn ? 2 : 1),
                                cellHeight - (isLastRow ? 2 : 1)
                            );
                        } else {
                            ctx.fillRect(cellX, cellY, cellWidth, cellHeight);
                        }
                    }

                    if (spanPartialFills !== undefined) {
                        // Полосы частичного выделения внутри блока: rgba-цвет ложится поверх
                        // базовой заливки, что эквивалентно blend при полном охвате.
                        for (const f of spanPartialFills) {
                            ctx.fillStyle = f.color;
                            ctx.fillRect(f.x, f.y, f.w, f.h);
                        }
                    }

                    if (cell.style === "faded") {
                        ctx.globalAlpha = 0.6;
                    }

                    let hoverValue: HoverValues[number] | undefined;
                    for (let i = 0; i < hoverValues.length; i++) {
                        const hv = hoverValues[i];
                        if (hv.item[0] === c.sourceIndex && hv.item[1] === row) {
                            hoverValue = hv;
                            break;
                        }
                    }

                    if (cellWidth > minimumCellWidth && !skipContents) {
                        const cellFont = theme.baseFontFull;
                        if (cellFont !== font) {
                            ctx.font = cellFont;
                            font = cellFont;
                        }
                        prepResult = drawCell(
                            ctx,
                            cell,
                            c.sourceIndex,
                            row,
                            isLastColumn,
                            isLastRow,
                            cellX,
                            cellY,
                            cellWidth,
                            cellHeight,
                            accentCount > 0,
                            theme,
                            fill ?? theme.bgCell,
                            imageLoader,
                            spriteManager,
                            hoverValue?.hoverAmount ?? 0,
                            hoverInfo,
                            hyperWrapping,
                            frameTime,
                            drawCellCallback,
                            prepResult,
                            enqueue,
                            renderStateProvider,
                            getCellRenderer,
                            overrideCursor
                        );
                    }

                    if (didDamageClip) {
                        ctx.restore();
                    }

                    if (cell.style === "faded") {
                        ctx.globalAlpha = 1;
                    }

                    toDraw--;
                    if (drawingSpan) {
                        ctx.restore();
                        prepResult?.deprep?.(deprepArg);
                        prepResult = undefined;
                        reclip();
                        font = colFont;
                        ctx.font = colFont;
                    }

                    return toDraw <= 0;
                }
            );

            ctx.restore();
            return toDraw <= 0;
        }
    );
    return result;
}

const allocatedItem: [number, number] = [0, 0];
const reusableRect = { x: 0, y: 0, width: 0, height: 0 };
const drawState: DrawStateTuple = [undefined, () => undefined];

let animationFrameRequested = false;
function animRequest(): void {
    animationFrameRequested = true;
}

export function drawCell(
    ctx: CanvasRenderingContext2D,
    cell: InnerGridCell,
    col: number,
    row: number,
    isLastCol: boolean,
    isLastRow: boolean,
    x: number,
    y: number,
    w: number,
    h: number,
    highlighted: boolean,
    theme: FullTheme,
    finalCellFillColor: string,
    imageLoader: ImageWindowLoader,
    spriteManager: SpriteManager,
    hoverAmount: number,
    hoverInfo: HoverInfo | undefined,
    hyperWrapping: boolean,
    frameTime: number,
    drawCellCallback: DrawCellCallback | undefined,
    lastPrep: PrepResult | undefined,
    enqueue: EnqueueCallback | undefined,
    renderStateProvider: RenderStateProvider,
    getCellRenderer: GetCellRendererCallback,
    overrideCursor: (cursor: React.CSSProperties["cursor"]) => void
): PrepResult | undefined {
    let hoverX: number | undefined;
    let hoverY: number | undefined;
    if (hoverInfo !== undefined && hoverInfo[0][0] === col && hoverInfo[0][1] === row) {
        hoverX = hoverInfo[1][0];
        hoverY = hoverInfo[1][1];
    }
    let result: PrepResult | undefined = undefined;

    allocatedItem[0] = col;
    allocatedItem[1] = row;

    reusableRect.x = x;
    reusableRect.y = y;
    reusableRect.width = w;
    reusableRect.height = h;

    drawState[0] = renderStateProvider.getValue(allocatedItem);
    drawState[1] = (val: any) => renderStateProvider.setValue(allocatedItem, val); //alloc

    animationFrameRequested = false;

    const args: DrawArgs<typeof cell> = {
        //alloc
        ctx,
        theme,
        col,
        row,
        cell,
        rect: reusableRect,
        highlighted,
        cellFillColor: finalCellFillColor,
        hoverAmount,
        frameTime,
        hoverX,
        drawState,
        hoverY,
        imageLoader,
        spriteManager,
        hyperWrapping,
        overrideCursor: hoverX !== undefined ? overrideCursor : undefined,
        requestAnimationFrame: animRequest,
    };
    const needsAnim = drawLastUpdateUnderlay(args, cell.lastUpdated, frameTime, lastPrep, isLastCol, isLastRow);

    const r = getCellRenderer(cell);
    if (r !== undefined) {
        if (lastPrep?.renderer !== r) {
            lastPrep?.deprep?.(args);
            lastPrep = undefined;
        }
        const partialPrepResult = r.drawPrep?.(args, lastPrep);
        if (drawCellCallback !== undefined && !isInnerOnlyCell(args.cell)) {
            drawCellCallback(args as DrawArgs<GridCell>, () => r.draw(args, cell));
        } else {
            r.draw(args, cell);
        }
        result =
            partialPrepResult === undefined
                ? undefined
                : {
                      deprep: partialPrepResult?.deprep,
                      fillStyle: partialPrepResult?.fillStyle,
                      font: partialPrepResult?.font,
                      renderer: r,
                  };
    }

    if (needsAnim || animationFrameRequested) enqueue?.(allocatedItem);
    return result;
}
