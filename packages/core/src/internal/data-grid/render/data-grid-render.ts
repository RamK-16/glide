/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable unicorn/no-for-loop */
import { type Rectangle } from "../data-grid-types.js";
import { CellSet } from "../cell-set.js";
import { getEffectiveColumns, type MappedGridColumn } from "./data-grid-lib.js";
import { blend } from "../color-parser.js";
import { assert } from "../../../common/support.js";
import type { DrawGridArg } from "./draw-grid-arg.js";
import {
    walkColumns,
    walkGroups,
    walkRowsInCol,
    getGroupLevels,
    getSpannedGroupRegions,
    findSpannedGroupRegion,
    getTotalGroupHeaderHeight,
    getSpanBounds,
    getRowSpanBounds,
} from "./data-grid-render.walk.js";
import { drawCells, type GroupDetailsCallback } from "./data-grid-render.cells.js";
import { drawGridHeaders } from "./data-grid-render.header.js";
import { drawGridLines, overdrawStickyBoundaries, drawBlanks, drawExtraRowThemes } from "./data-grid-render.lines.js";
import { blitLastFrame, blitResizedCol, computeCanBlit } from "./data-grid-render.blit.js";
import { drawHighlightRings, drawFillHandle, drawColumnResizeOutline } from "./data-grid.render.rings.js";
import { getHairlineWidth } from "./data-grid-render.hairline.js";

export function getDamageRepairPad(enableLowDprHairline: boolean): number {
    // repairPad привязан к фактической hairline-ширине: damage clip приходит в точных bounds ячейки,
    // а widened stroke при DPR < 1 может выступать за них и резаться на hover redraw. Без low-DPR
    // штрих ровно 1px и за bounds не выходит → pad = 0. ВАЖНО: это ещё и pad для clipHeaderDamage,
    // и ненулевой pad там залезает в соседний групп-ряд (светлая полоса на выделенной группе при
    // hover листа). Body span-border-repair добирает свой pad ЛОКАЛЬНО (см. getBodyDamagePad).
    return enableLowDprHairline ? Math.ceil(getHairlineWidth(enableLowDprHairline) / 2 + 0.5) : 0;
}

// Pad для body-damage span-repair. Границу span-блока на самом краю bbox исключает условие
// ty <= maxY-1 в drawGridLines, поэтому при наличии span в damage нужен pad >= 1 (даже без
// low-DPR). Отдельно от getDamageRepairPad, чтобы НЕ раздувать header-клип.
export function getBodyDamagePad(enableLowDprHairline: boolean, spansInDamage: boolean): number {
    const base = getDamageRepairPad(enableLowDprHairline);
    return spansInDamage ? Math.max(1, base) : base;
}

// Есть ли среди damaged-ячеек (в области данных) хотя бы одна span-ячейка. На hover
// damage крошечный (1-2 ячейки), поэтому проверка дешёвая. Нужна, чтобы включать
// ручной span-repair damage-путь независимо от enableLowDprHairline.
export function damageHasSpanCells(
    damage: CellSet,
    getCellContent: (cell: readonly [number, number]) => {
        readonly span?: readonly [number, number];
        readonly spanRows?: readonly [number, number];
    }
): boolean {
    for (const item of damage.values()) {
        if (item[1] < 0) continue;
        const cell = getCellContent(item);
        if (cell.span !== undefined || cell.spanRows !== undefined) return true;
    }
    return false;
}

// Future optimization opportunities
// - Create a cache of a buffer used to render the full view of a partially displayed column so that when
//   scrolling horizontally you can simply blit the pre-drawn column instead of continually paying the draw
//   cost as it slides into view.
// - The same as above but for partially displayed rows
// - Blit headers on horizontal scroll
// - Use webworker to load images, helpful with lots of large images
// - Retain mode for drawing cells. Instead of drawing cells as we come across them, first build a data
//   structure which contains all operations to perform, then sort them all by "prep" requirement, then do
//   all like operations at once.

// Экспортируется для регресс-теста инварианта allSpanned-скипа (см. комментарий в групп-цикле).
export function clipHeaderDamage(
    ctx: CanvasRenderingContext2D,
    effectiveColumns: readonly MappedGridColumn[],
    width: number,
    groupHeaderHeight: number | number[],
    totalHeaderHeight: number,
    translateX: number,
    translateY: number,
    cellYOffset: number,
    damage: CellSet | undefined,
    enableLowDprHairline: boolean,
    getGroupDetails: GroupDetailsCallback | undefined
): void {
    if (damage === undefined || damage.size === 0) return;

    ctx.beginPath();
    const repairPad = getDamageRepairPad(enableLowDprHairline);

    const levels = getGroupLevels(effectiveColumns);
    const heights = Array.isArray(groupHeaderHeight)
        ? groupHeaderHeight
        : Array.from({ length: levels }, () => groupHeaderHeight);

    // Слитые группы (rowspan) — тот же расчёт регионов, что в рендере/hit-test/bounds.
    const spannedRegions =
        getGroupDetails !== undefined
            ? getSpannedGroupRegions(effectiveColumns, levels, name => getGroupDetails(name).span === true)
            : [];

    let currentY = 0;
    for (let level = 0; level < levels; level++) {
        const levelHeight = heights[level] ?? heights[0] ?? 0;
        if (levelHeight <= 0) continue;
        const targetRow = -2 - level;
        walkGroups(effectiveColumns, width, translateX, levelHeight, level, (span, _group, x, y, w, h, _level, spanMinCol, spanMaxCol, spanAllSpanned) => {
            // ИНВАРИАНТ (держать в синхроне с drawGroupLevel): групп-спан из ОДНИХ слитых
            // колонок (все spanGroupHeader) групп-ячейку НЕ рисует — drawGroupLevel пропускает
            // его как `allSpanned`, а групп-ряд каждой такой колонки восстанавливает её
            // собственная перерисовка на всю высоту (drawGridHeaders, spanFull). Значит клип
            // здесь НЕЛЬЗЯ ставить: очистка фона шапки внутри клипа затёрла бы верхнюю полосу
            // слитой ячейки, а перерисовать её будет некому (сосед задел лишь свой групп-ряд
            // [n,-2] → damage слитой колонки нет → её пропускают → серое поверх текста, линия
            // исчезает). Поэтому здесь ТОТ ЖЕ allSpanned-скип, что и в рендере.
            if (spanAllSpanned) return;
            // Границы по членам спана (min/max sourceIndex): при DnD-реордере концы
            // colSpan немонотонны (span[0] > span[1]) и прямоугольник схлопнулся бы.
            const hasItemInSpan = damage.hasItemInRectangle({
                x: spanMinCol,
                y: targetRow,
                width: spanMaxCol - spanMinCol + 1,
                height: 1,
            });
            if (hasItemInSpan) {
                // Слитая группа: клипуем на всю слитую высоту, иначе hover-перерисовка
                // режется по одному групп-ряду (тот же баг, что был у листовой шапки).
                const region = findSpannedGroupRegion(spannedRegions, span[0], level);
                let clipH = h;
                if (region !== undefined && region.level === level) {
                    clipH = 0;
                    for (let k = level; k < levels; k++) clipH += heights[k] ?? heights[0] ?? 0;
                }
                ctx.rect(x - repairPad, y + currentY - repairPad, w + repairPad * 2, clipH + repairPad * 2);
            }
        });
        currentY += levelHeight;
    }

    walkColumns(
        effectiveColumns,
        cellYOffset,
        translateX,
        translateY,
        totalHeaderHeight,
        (c, drawX, _colDrawY, clipX) => {
            const diff = Math.max(0, clipX - drawX);

            const finalX = drawX + diff + 1;
            const finalWidth = c.width - diff - 1;
            // Слитая колонка занимает и строку колонки (-1), и групп-ряды (-2…). Клипуем её на
            // всю высоту, если задет ЛЮБОЙ её ряд, — иначе групп-полоса не перерисуется при hover.
            const spannedCol = c.spanGroupHeader === true;
            const touched = spannedCol
                ? damage.hasItemInRectangle({ x: c.sourceIndex, y: -1 - levels, width: 1, height: levels + 1 })
                : damage.has([c.sourceIndex, -1]);
            if (touched) {
                if (spannedCol) {
                    // Слитая шапка — одна ячейка на всю высоту: клипуем весь столбец шапки,
                    // иначе hover/перерисовка режется по нижней полосе (headerHeight).
                    ctx.rect(
                        finalX - repairPad,
                        0 - repairPad,
                        finalWidth + repairPad * 2,
                        totalHeaderHeight + repairPad * 2
                    );
                } else {
                    const groupHeight = Array.isArray(groupHeaderHeight)
                        ? groupHeaderHeight.reduce((sum, h) => sum + h, 0)
                        : groupHeaderHeight;
                    ctx.rect(
                        finalX - repairPad,
                        groupHeight - repairPad,
                        finalWidth + repairPad * 2,
                        totalHeaderHeight - groupHeight + repairPad * 2
                    );
                }
            }
        }
    );
    ctx.clip();
}

// Экспортируется для юнит-тестов damage-регионов (plain/colspan/rowspan).
export function getDamageDrawRegions(
    effectiveColumns: readonly MappedGridColumn[],
    height: number,
    totalHeaderHeight: number,
    translateX: number,
    translateY: number,
    cellYOffset: number,
    rows: number,
    getRowHeight: (row: number) => number,
    freezeTrailingRows: number,
    hasAppendRow: boolean,
    damage: CellSet,
    getCellContent: (cell: readonly [number, number]) => {
        readonly span?: readonly [number, number];
        readonly spanRows?: readonly [number, number];
    }
): Rectangle[] {
    const result: Rectangle[] = [];
    const cellIndex: [number, number] = [0, 0];

    walkColumns(
        effectiveColumns,
        cellYOffset,
        translateX,
        translateY,
        totalHeaderHeight,
        (c, drawX, colDrawStartY, clipX, startRow) => {
            const diff = Math.max(0, clipX - drawX);
            const colDrawX = drawX + diff;
            const colWidth = c.width - diff;
            if (colWidth <= 0) return;

            cellIndex[0] = c.sourceIndex;
            walkRowsInCol(
                startRow,
                colDrawStartY,
                height,
                rows,
                getRowHeight,
                freezeTrailingRows,
                hasAppendRow,
                undefined,
                (drawY, row, rh) => {
                    if (row < 0) return;

                    cellIndex[1] = row;
                    if (damage.has(cellIndex)) {
                        const cell = getCellContent(cellIndex);
                        if (cell.span !== undefined || cell.spanRows !== undefined) {
                            // Слитый блок рисуется на весь прямоугольник, поэтому и
                            // damage-регион делаем на весь блок — иначе overlay'и
                            // (рамка/подсветка/fill-handle) восстановятся лишь по
                            // одной ячейке и «пропадут» на остальной площади блока.
                            let ry = drawY;
                            let rHeight = rh;
                            if (cell.spanRows !== undefined) {
                                const v = getRowSpanBounds(cell.spanRows, row, drawY, getRowHeight);
                                ry = v.y;
                                rHeight = v.height;
                            }
                            if (cell.span !== undefined) {
                                // getSpanBounds напрямую (не resolveHorizontalSpanArea): damage-регион
                                // должен покрыть ОБЕ области блока — и frozen, и scrollable.
                                const [frozenArea, contentArea] = getSpanBounds(
                                    cell.span,
                                    colDrawX,
                                    drawY,
                                    colWidth,
                                    rh,
                                    c,
                                    effectiveColumns
                                );
                                if (frozenArea !== undefined)
                                    result.push({ x: frozenArea.x, y: ry, width: frozenArea.width, height: rHeight });
                                if (contentArea !== undefined)
                                    result.push({ x: contentArea.x, y: ry, width: contentArea.width, height: rHeight });
                            } else {
                                result.push({ x: colDrawX, y: ry, width: colWidth, height: rHeight });
                            }
                        } else {
                            result.push({ x: colDrawX, y: drawY, width: colWidth, height: rh });
                        }
                    }
                }
            );
        }
    );

    return result;
}

function expandDamageDrawRegions(drawRegions: readonly Rectangle[], repairPad: number): Rectangle[] {
    if (repairPad <= 0) return [...drawRegions];

    return drawRegions.map(r => ({
        x: r.x - repairPad,
        y: r.y - repairPad,
        width: r.width + repairPad * 2,
        height: r.height + repairPad * 2,
    }));
}

function getLastRow(
    effectiveColumns: readonly MappedGridColumn[],
    height: number,
    totalHeaderHeight: number,
    translateX: number,
    translateY: number,
    cellYOffset: number,
    rows: number,
    getRowHeight: (row: number) => number,
    freezeTrailingRows: number,
    hasAppendRow: boolean
): number {
    let result = 0;
    walkColumns(
        effectiveColumns,
        cellYOffset,
        translateX,
        translateY,
        totalHeaderHeight,
        (_c, __drawX, colDrawY, _clipX, startRow) => {
            walkRowsInCol(
                startRow,
                colDrawY,
                height,
                rows,
                getRowHeight,
                freezeTrailingRows,
                hasAppendRow,
                undefined,
                (_drawY, row, _rh, isSticky) => {
                    if (!isSticky) {
                        result = Math.max(row, result);
                    }
                }
            );

            return true;
        }
    );
    return result;
}

export function drawGrid(arg: DrawGridArg, lastArg: DrawGridArg | undefined) {
    const {
        canvasCtx,
        headerCanvasCtx,
        width,
        height,
        cellXOffset,
        cellYOffset,
        translateX,
        translateY,
        mappedColumns,
        enableGroups,
        freezeColumns,
        dragAndDropState,
        theme,
        drawFocus,
        headerHeight,
        groupHeaderHeight,
        disabledRows,
        rowHeight,
        verticalBorder,
        overrideCursor,
        isResizing,
        selection,
        fillHandle,
        freezeTrailingRows,
        rows,
        getCellContent,
        getGroupDetails,
        getRowThemeOverride,
        isFocused,
        drawHeaderCallback,
        drawGroupHeaderCallback,
        prelightCells,
        drawCellCallback,
        highlightRegions,
        resizeCol,
        imageLoader,
        lastBlitData,
        hoverValues,
        hyperWrapping,
        hoverInfo,
        spriteManager,
        maxScaleFactor,
        enableLowDprHairline,
        hasAppendRow,
        touchMode,
        enqueue,
        renderStateProvider,
        getCellRenderer,
        renderStrategy,
        bufferACtx,
        bufferBCtx,
        damage,
        minimumCellWidth,
        resizeIndicator,
    } = arg;
    if (width === 0 || height === 0) return;
    const doubleBuffer = renderStrategy === "double-buffer";
    const dpr = Math.min(maxScaleFactor, Math.ceil(window.devicePixelRatio ?? 1));

    // if we are double buffering we need to make sure we can blit. If we can't we need to redraw the whole thing
    const canBlit = renderStrategy !== "direct" && computeCanBlit(arg, lastArg);

    const canvas = canvasCtx.canvas;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;

        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
    }

    const overlayCanvas = headerCanvasCtx.canvas;
    const totalGroupHeaderHeight = enableGroups ? getTotalGroupHeaderHeight(groupHeaderHeight, mappedColumns) : 0;
    const totalHeaderHeight = headerHeight + totalGroupHeaderHeight;

    const overlayHeight = totalHeaderHeight + 1; // border
    if (overlayCanvas.width !== width * dpr || overlayCanvas.height !== overlayHeight * dpr) {
        overlayCanvas.width = width * dpr;
        overlayCanvas.height = overlayHeight * dpr;

        overlayCanvas.style.width = width + "px";
        overlayCanvas.style.height = overlayHeight + "px";
    }

    const bufferA = bufferACtx.canvas;
    const bufferB = bufferBCtx.canvas;

    if (doubleBuffer && (bufferA.width !== width * dpr || bufferA.height !== height * dpr)) {
        bufferA.width = width * dpr;
        bufferA.height = height * dpr;
        if (lastBlitData.current !== undefined) lastBlitData.current.aBufferScroll = undefined;
    }

    if (doubleBuffer && (bufferB.width !== width * dpr || bufferB.height !== height * dpr)) {
        bufferB.width = width * dpr;
        bufferB.height = height * dpr;
        if (lastBlitData.current !== undefined) lastBlitData.current.bBufferScroll = undefined;
    }

    const last = lastBlitData.current;
    if (
        canBlit === true &&
        cellXOffset === last?.cellXOffset &&
        cellYOffset === last?.cellYOffset &&
        translateX === last?.translateX &&
        translateY === last?.translateY
    )
        return;

    let mainCtx: CanvasRenderingContext2D | null = null;
    if (doubleBuffer) {
        mainCtx = canvasCtx;
    }
    const overlayCtx = headerCanvasCtx;
    let targetCtx: CanvasRenderingContext2D;
    if (!doubleBuffer) {
        targetCtx = canvasCtx;
    } else if (damage !== undefined) {
        targetCtx = last?.lastBuffer === "b" ? bufferBCtx : bufferACtx;
    } else {
        targetCtx = last?.lastBuffer === "b" ? bufferACtx : bufferBCtx;
    }
    const targetBuffer = targetCtx.canvas;
    const blitSource = doubleBuffer ? (targetBuffer === bufferA ? bufferB : bufferA) : canvas;

    const getRowHeight = typeof rowHeight === "number" ? () => rowHeight : rowHeight;

    overlayCtx.save();
    targetCtx.save();

    overlayCtx.beginPath();
    targetCtx.beginPath();

    overlayCtx.textBaseline = "middle";
    targetCtx.textBaseline = "middle";

    if (dpr !== 1) {
        overlayCtx.scale(dpr, dpr);
        targetCtx.scale(dpr, dpr);
    }

    const effectiveCols = getEffectiveColumns(mappedColumns, cellXOffset, width, dragAndDropState, translateX);

    let drawRegions: Rectangle[] = [];

    const mustDrawFocusOnHeader = drawFocus && selection.current?.cell[1] === cellYOffset && translateY === 0;
    let mustDrawHighlightRingsOnHeader = false;
    if (highlightRegions !== undefined) {
        for (const r of highlightRegions) {
            if (r.style !== "no-outline" && r.range.y === cellYOffset && translateY === 0) {
                mustDrawHighlightRingsOnHeader = true;
                break;
            }
        }
    }
    const drawHeaderTexture = () => {
        drawGridHeaders(
            overlayCtx,
            effectiveCols,
            enableGroups,
            hoverInfo,
            width,
            translateX,
            headerHeight,
            groupHeaderHeight,
            dragAndDropState,
            isResizing,
            selection,
            theme,
            spriteManager,
            hoverValues,
            verticalBorder,
            getGroupDetails,
            damage,
            drawHeaderCallback,
            drawGroupHeaderCallback,
            touchMode,
            enableLowDprHairline
        );

        drawGridLines(
            overlayCtx,
            effectiveCols,
            cellYOffset,
            translateX,
            translateY,
            width,
            height,
            undefined,
            undefined,
            groupHeaderHeight,
            totalHeaderHeight,
            getRowHeight,
            getRowThemeOverride,
            verticalBorder,
            freezeTrailingRows,
            rows,
            theme,
            true,
            enableLowDprHairline
        );

        overlayCtx.beginPath();
        overlayCtx.moveTo(0, overlayHeight - 0.5);
        overlayCtx.lineTo(width, overlayHeight - 0.5);
        overlayCtx.strokeStyle = blend(
            theme.headerBottomBorderColor ?? theme.horizontalBorderColor ?? theme.borderColor,
            theme.bgHeader
        );
        const previousLineWidth = overlayCtx.lineWidth;
        // Header bottom border рисуется вручную отдельно от drawGridLines.
        // Применяем тот же hairline width, чтобы граница шапки не отличалась от остальной сетки при DPR < 1.
        overlayCtx.lineWidth = getHairlineWidth(enableLowDprHairline);
        overlayCtx.stroke();
        overlayCtx.lineWidth = previousLineWidth;

        if (mustDrawHighlightRingsOnHeader) {
            drawHighlightRings(
                overlayCtx,
                width,
                height,
                cellXOffset,
                cellYOffset,
                translateX,
                translateY,
                mappedColumns,
                freezeColumns,
                headerHeight,
                groupHeaderHeight,
                rowHeight,
                freezeTrailingRows,
                rows,
                highlightRegions,
                theme,
                enableLowDprHairline
            );
        }

        if (mustDrawFocusOnHeader) {
            drawFillHandle(
                overlayCtx,
                width,
                height,
                cellYOffset,
                translateX,
                translateY,
                effectiveCols,
                mappedColumns,
                theme,
                totalHeaderHeight,
                selection,
                getRowHeight,
                getCellContent,
                freezeTrailingRows,
                hasAppendRow,
                fillHandle,
                rows
            );
        }
    };

    // handle damage updates by directly drawing to the target to avoid large blits
    if (damage !== undefined) {
        const viewRegionWidth = effectiveCols[effectiveCols.length - 1].sourceIndex + 1;
        const groupHeaderLevels = enableGroups ? getGroupLevels(mappedColumns) : 0;
        const headerRegionRowStart = -1 - groupHeaderLevels;
        const headerRegionHeight = groupHeaderLevels + 1;
        const damageInView = damage.hasItemInRegion([
            {
                x: cellXOffset,
                y: headerRegionRowStart,
                width: viewRegionWidth,
                height: headerRegionHeight,
            },
            {
                x: cellXOffset,
                y: cellYOffset,
                width: viewRegionWidth,
                height: 300,
            },
            {
                x: 0,
                y: cellYOffset,
                width: freezeColumns,
                height: 300,
            },
            {
                x: 0,
                y: headerRegionRowStart,
                width: freezeColumns,
                height: headerRegionHeight,
            },
            {
                x: cellXOffset,
                y: rows - freezeTrailingRows,
                width: viewRegionWidth,
                height: freezeTrailingRows,
                when: freezeTrailingRows > 0,
            },
        ]);

        // span-repair НЕ зависит от enableLowDprHairline: ручной damage-путь нужен всегда,
        // когда в damage попала span-ячейка (иначе hover затирает границы объединённого блока
        // и не восстанавливает их). Обычные таблицы без флага и без span — быстрый blit-путь.
        const spansInDamage = damageInView && damageHasSpanCells(damage, getCellContent);
        const cellDamageRegions =
            (enableLowDprHairline || spansInDamage) && damageInView
                ? getDamageDrawRegions(
                      effectiveCols,
                      height,
                      totalHeaderHeight,
                      translateX,
                      translateY,
                      cellYOffset,
                      rows,
                      getRowHeight,
                      freezeTrailingRows,
                      hasAppendRow,
                      damage,
                      getCellContent
                  )
                : undefined;

        const doDamage = (ctx: CanvasRenderingContext2D) => {
            if (cellDamageRegions !== undefined && cellDamageRegions.length > 0) {
                const repairPad = getBodyDamagePad(enableLowDprHairline, spansInDamage);
                // cellDamageRegions остаются точной dirty-геометрией, а visualDamageRegions расширяют только область repair.
                // Так мы дорисовываем соседние grid/highlight штрихи без отдельного hover-хака и без смены normal cell rendering path.
                const visualDamageRegions = expandDamageDrawRegions(cellDamageRegions, repairPad);

                ctx.save();
                ctx.beginPath();
                for (const r of visualDamageRegions) {
                    ctx.rect(r.x, r.y, r.width, r.height);
                }
                ctx.clip();

                ctx.fillStyle = theme.bgCell;
                ctx.fill();
                ctx.beginPath();

                const highlightRedraw = drawHighlightRings(
                    ctx,
                    width,
                    height,
                    cellXOffset,
                    cellYOffset,
                    translateX,
                    translateY,
                    mappedColumns,
                    freezeColumns,
                    headerHeight,
                    groupHeaderHeight,
                    rowHeight,
                    freezeTrailingRows,
                    rows,
                    highlightRegions,
                    theme,
                    enableLowDprHairline
                );

                const focusRedraw = drawFocus
                    ? drawFillHandle(
                          ctx,
                          width,
                          height,
                          cellYOffset,
                          translateX,
                          translateY,
                          effectiveCols,
                          mappedColumns,
                          theme,
                          totalHeaderHeight,
                          selection,
                          getRowHeight,
                          getCellContent,
                          freezeTrailingRows,
                          hasAppendRow,
                          fillHandle,
                          rows
                      )
                    : undefined;

                const spans = drawCells(
                    ctx,
                    effectiveCols,
                    mappedColumns,
                    height,
                    totalHeaderHeight,
                    translateX,
                    translateY,
                    cellYOffset,
                    rows,
                    getRowHeight,
                    getCellContent,
                    getGroupDetails,
                    getRowThemeOverride,
                    disabledRows,
                    isFocused,
                    drawFocus,
                    freezeTrailingRows,
                    hasAppendRow,
                    visualDamageRegions,
                    undefined,
                    selection,
                    prelightCells,
                    highlightRegions,
                    imageLoader,
                    spriteManager,
                    hoverValues,
                    hoverInfo,
                    drawCellCallback,
                    hyperWrapping,
                    theme,
                    enqueue,
                    renderStateProvider,
                    getCellRenderer,
                    overrideCursor,
                    minimumCellWidth
                );

                drawBlanks(
                    ctx,
                    effectiveCols,
                    mappedColumns,
                    width,
                    height,
                    totalHeaderHeight,
                    translateX,
                    translateY,
                    cellYOffset,
                    rows,
                    getRowHeight,
                    getRowThemeOverride,
                    selection.rows,
                    disabledRows,
                    freezeTrailingRows,
                    hasAppendRow,
                    visualDamageRegions,
                    undefined,
                    theme
                );

                drawExtraRowThemes(
                    ctx,
                    effectiveCols,
                    cellYOffset,
                    translateX,
                    translateY,
                    width,
                    height,
                    visualDamageRegions,
                    totalHeaderHeight,
                    getRowHeight,
                    getRowThemeOverride,
                    verticalBorder,
                    freezeTrailingRows,
                    rows,
                    theme
                );

                const lineRepairRegions =
                    spans === undefined ? visualDamageRegions : [...visualDamageRegions, ...spans];

                drawGridLines(
                    ctx,
                    effectiveCols,
                    cellYOffset,
                    translateX,
                    translateY,
                    width,
                    height,
                    lineRepairRegions,
                    spans,
                    groupHeaderHeight,
                    totalHeaderHeight,
                    getRowHeight,
                    getRowThemeOverride,
                    verticalBorder,
                    freezeTrailingRows,
                    rows,
                    theme,
                    false,
                    enableLowDprHairline
                );

                overdrawStickyBoundaries(
                    ctx,
                    effectiveCols,
                    width,
                    height,
                    freezeTrailingRows,
                    rows,
                    verticalBorder,
                    getRowHeight,
                    theme,
                    enableLowDprHairline
                );

                highlightRedraw?.();
                focusRedraw?.();
                ctx.restore();
                return;
            }

            drawCells(
                ctx,
                effectiveCols,
                mappedColumns,
                height,
                totalHeaderHeight,
                translateX,
                translateY,
                cellYOffset,
                rows,
                getRowHeight,
                getCellContent,
                getGroupDetails,
                getRowThemeOverride,
                disabledRows,
                isFocused,
                drawFocus,
                freezeTrailingRows,
                hasAppendRow,
                drawRegions,
                damage,
                selection,
                prelightCells,
                highlightRegions,
                imageLoader,
                spriteManager,
                hoverValues,
                hoverInfo,
                drawCellCallback,
                hyperWrapping,
                theme,
                enqueue,
                renderStateProvider,
                getCellRenderer,
                overrideCursor,
                minimumCellWidth
            );

            // Слитый блок при damage-перерисовке затирает overlay'и своей заливкой на
            // всю площадь. Рамку/подсветку выделения восстанавливаем поверх (в
            // hairline-пути это делает клип-версия выше; здесь — прямым вызовом).
            const damageHighlightRedraw = drawHighlightRings(
                ctx,
                width,
                height,
                cellXOffset,
                cellYOffset,
                translateX,
                translateY,
                mappedColumns,
                freezeColumns,
                headerHeight,
                groupHeaderHeight,
                rowHeight,
                freezeTrailingRows,
                rows,
                highlightRegions,
                theme,
                enableLowDprHairline
            );
            damageHighlightRedraw?.();

            const selectionCurrent = selection.current;

            // fill-handle тоже затирается блоком — перерисовываем его на любой damage
            // с активным выделением (раньше только когда damaged bottom-right ячейка,
            // из-за чего квадратик пропадал при ховере по любой другой ячейке блока).
            if (
                fillHandle !== false &&
                fillHandle !== undefined &&
                drawFocus &&
                selectionCurrent !== undefined
            ) {
                drawFillHandle(
                    ctx,
                    width,
                    height,
                    cellYOffset,
                    translateX,
                    translateY,
                    effectiveCols,
                    mappedColumns,
                    theme,
                    totalHeaderHeight,
                    selection,
                    getRowHeight,
                    getCellContent,
                    freezeTrailingRows,
                    hasAppendRow,
                    fillHandle,
                    rows
                );
            }
        };

        if (damageInView) {
            doDamage(targetCtx);
            if (mainCtx !== null) {
                mainCtx.save();
                mainCtx.scale(dpr, dpr);
                mainCtx.textBaseline = "middle";
                doDamage(mainCtx);
                mainCtx.restore();
            }

            const doHeaders = damage.hasHeader();
            if (doHeaders) {
                clipHeaderDamage(
                    overlayCtx,
                    effectiveCols,
                    width,
                    groupHeaderHeight,
                    totalHeaderHeight,
                    translateX,
                    translateY,
                    cellYOffset,
                    damage,
                    enableLowDprHairline,
                    getGroupDetails
                );
                drawHeaderTexture();
            }
        }

        targetCtx.restore();
        overlayCtx.restore();

        return;
    }

    if (
        canBlit !== true ||
        cellXOffset !== last?.cellXOffset ||
        translateX !== last?.translateX ||
        mustDrawFocusOnHeader !== last?.mustDrawFocusOnHeader ||
        mustDrawHighlightRingsOnHeader !== last?.mustDrawHighlightRingsOnHeader
    ) {
        drawHeaderTexture();
    }

    if (canBlit === true) {
        assert(blitSource !== undefined && last !== undefined);
        const { regions } = blitLastFrame(
            targetCtx,
            blitSource,
            blitSource === bufferA ? last.aBufferScroll : last.bBufferScroll,
            blitSource === bufferA ? last.bBufferScroll : last.aBufferScroll,
            last,
            cellXOffset,
            cellYOffset,
            translateX,
            translateY,
            freezeTrailingRows,
            width,
            height,
            rows,
            totalHeaderHeight,
            dpr,
            mappedColumns,
            effectiveCols,
            rowHeight,
            doubleBuffer
        );
        drawRegions = regions;
    } else if (canBlit !== false) {
        assert(last !== undefined);
        const resizedCol = canBlit;
        drawRegions = blitResizedCol(
            last,
            cellXOffset,
            cellYOffset,
            translateX,
            translateY,
            width,
            height,
            totalHeaderHeight,
            effectiveCols,
            resizedCol
        );
    }

    overdrawStickyBoundaries(
        targetCtx,
        effectiveCols,
        width,
        height,
        freezeTrailingRows,
        rows,
        verticalBorder,
        getRowHeight,
        theme,
        enableLowDprHairline
    );

    const highlightRedraw = drawHighlightRings(
        targetCtx,
        width,
        height,
        cellXOffset,
        cellYOffset,
        translateX,
        translateY,
        mappedColumns,
        freezeColumns,
        headerHeight,
        groupHeaderHeight,
        rowHeight,
        freezeTrailingRows,
        rows,
        highlightRegions,
        theme,
        enableLowDprHairline
    );

    // the overdraw may have nuked out our focus ring right edge.
    const focusRedraw = drawFocus
        ? drawFillHandle(
              targetCtx,
              width,
              height,
              cellYOffset,
              translateX,
              translateY,
              effectiveCols,
              mappedColumns,
              theme,
              totalHeaderHeight,
              selection,
              getRowHeight,
              getCellContent,
              freezeTrailingRows,
              hasAppendRow,
              fillHandle,
              rows
          )
        : undefined;

    targetCtx.fillStyle = theme.bgCell;
    if (drawRegions.length > 0) {
        targetCtx.beginPath();
        for (const r of drawRegions) {
            targetCtx.rect(r.x, r.y, r.width, r.height);
        }
        targetCtx.clip();
        targetCtx.fill();
        targetCtx.beginPath();
    } else {
        targetCtx.fillRect(0, 0, width, height);
    }

    const spans = drawCells(
        targetCtx,
        effectiveCols,
        mappedColumns,
        height,
        totalHeaderHeight,
        translateX,
        translateY,
        cellYOffset,
        rows,
        getRowHeight,
        getCellContent,
        getGroupDetails,
        getRowThemeOverride,
        disabledRows,
        isFocused,
        drawFocus,
        freezeTrailingRows,
        hasAppendRow,
        drawRegions,
        damage,
        selection,
        prelightCells,
        highlightRegions,
        imageLoader,
        spriteManager,
        hoverValues,
        hoverInfo,
        drawCellCallback,
        hyperWrapping,
        theme,
        enqueue,
        renderStateProvider,
        getCellRenderer,
        overrideCursor,
        minimumCellWidth
    );

    drawBlanks(
        targetCtx,
        effectiveCols,
        mappedColumns,
        width,
        height,
        totalHeaderHeight,
        translateX,
        translateY,
        cellYOffset,
        rows,
        getRowHeight,
        getRowThemeOverride,
        selection.rows,
        disabledRows,
        freezeTrailingRows,
        hasAppendRow,
        drawRegions,
        damage,
        theme
    );

    drawExtraRowThemes(
        targetCtx,
        effectiveCols,
        cellYOffset,
        translateX,
        translateY,
        width,
        height,
        drawRegions,
        totalHeaderHeight,
        getRowHeight,
        getRowThemeOverride,
        verticalBorder,
        freezeTrailingRows,
        rows,
        theme
    );

    drawGridLines(
        targetCtx,
        effectiveCols,
        cellYOffset,
        translateX,
        translateY,
        width,
        height,
        drawRegions,
        spans,
        groupHeaderHeight,
        totalHeaderHeight,
        getRowHeight,
        getRowThemeOverride,
        verticalBorder,
        freezeTrailingRows,
        rows,
        theme,
        false,
        enableLowDprHairline
    );

    highlightRedraw?.();
    focusRedraw?.();

    if (isResizing && resizeIndicator !== "none") {
        walkColumns(effectiveCols, 0, translateX, 0, totalHeaderHeight, (c, x) => {
            if (c.sourceIndex === resizeCol) {
                drawColumnResizeOutline(
                    overlayCtx,
                    x + c.width,
                    0,
                    totalHeaderHeight + 1,
                    blend(theme.resizeIndicatorColor ?? theme.accentLight, theme.bgHeader)
                );
                if (resizeIndicator === "full") {
                    drawColumnResizeOutline(
                        targetCtx,
                        x + c.width,
                        totalHeaderHeight,
                        height,
                        blend(theme.resizeIndicatorColor ?? theme.accentLight, theme.bgCell)
                    );
                }
                return true;
            }
            return false;
        });
    }

    if (mainCtx !== null) {
        mainCtx.fillStyle = theme.bgCell;
        mainCtx.fillRect(0, 0, width, height);
        mainCtx.drawImage(targetCtx.canvas, 0, 0);
    }

    const lastRowDrawn = getLastRow(
        effectiveCols,
        height,
        totalHeaderHeight,
        translateX,
        translateY,
        cellYOffset,
        rows,
        getRowHeight,
        freezeTrailingRows,
        hasAppendRow
    );

    imageLoader?.setWindow(
        {
            x: cellXOffset,
            y: cellYOffset,
            width: effectiveCols.length,
            height: lastRowDrawn - cellYOffset,
        },
        freezeColumns,
        Array.from({ length: freezeTrailingRows }, (_, i) => rows - 1 - i)
    );

    const scrollX = last !== undefined && (cellXOffset !== last.cellXOffset || translateX !== last.translateX);
    const scrollY = last !== undefined && (cellYOffset !== last.cellYOffset || translateY !== last.translateY);

    lastBlitData.current = {
        cellXOffset,
        cellYOffset,
        translateX,
        translateY,
        mustDrawFocusOnHeader,
        mustDrawHighlightRingsOnHeader,
        lastBuffer: doubleBuffer ? (targetBuffer === bufferA ? "a" : "b") : undefined,
        aBufferScroll: targetBuffer === bufferA ? [scrollX, scrollY] : last?.aBufferScroll,
        bBufferScroll: targetBuffer === bufferB ? [scrollX, scrollY] : last?.bBufferScroll,
    };

    targetCtx.restore();
    overlayCtx.restore();
}
