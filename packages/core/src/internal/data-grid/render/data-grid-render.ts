/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable unicorn/no-for-loop */
import { type Rectangle } from "../data-grid-types.js";
import { CellSet } from "../cell-set.js";
import { getEffectiveColumns, type MappedGridColumn, rectBottomRight } from "./data-grid-lib.js";
import { blend } from "../color-parser.js";
import { assert } from "../../../common/support.js";
import type { DrawGridArg } from "./draw-grid-arg.js";
import {
    walkColumns,
    walkGroups,
    walkRowsInCol,
    getGroupLevels,
    getTotalGroupHeaderHeight,
} from "./data-grid-render.walk.js";
import { drawCells } from "./data-grid-render.cells.js";
import { drawGridHeaders } from "./data-grid-render.header.js";
import { drawGridLines, overdrawStickyBoundaries, drawBlanks, drawExtraRowThemes } from "./data-grid-render.lines.js";
import { blitLastFrame, blitResizedCol, computeCanBlit } from "./data-grid-render.blit.js";
import { drawHighlightRings, drawFillHandle, drawColumnResizeOutline } from "./data-grid.render.rings.js";

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

function clipHeaderDamage(
    ctx: CanvasRenderingContext2D,
    effectiveColumns: readonly MappedGridColumn[],
    width: number,
    groupHeaderHeight: number | number[],
    totalHeaderHeight: number,
    translateX: number,
    translateY: number,
    cellYOffset: number,
    damage: CellSet | undefined
): void {
    if (damage === undefined || damage.size === 0) return;

    ctx.beginPath();

    const levels = getGroupLevels(effectiveColumns);
    const heights = Array.isArray(groupHeaderHeight)
        ? groupHeaderHeight
        : Array.from({ length: levels }, () => groupHeaderHeight);

    let currentY = 0;
    for (let level = 0; level < levels; level++) {
        const levelHeight = heights[level] ?? heights[0] ?? 0;
        if (levelHeight <= 0) continue;
        const targetRow = -2 - level;
        walkGroups(
            effectiveColumns,
            width,
            translateX,
            levelHeight,
            level,
            (span, _group, x, y, w, h) => {
                const hasItemInSpan = damage.hasItemInRectangle({
                    x: span[0],
                    y: targetRow,
                    width: span[1] - span[0] + 1,
                    height: 1,
                });
                if (hasItemInSpan) {
                    ctx.rect(x, y + currentY, w, h);
                }
            }
        );
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
            if (damage.has([c.sourceIndex, -1])) {
                const groupHeight = Array.isArray(groupHeaderHeight)
                    ? groupHeaderHeight.reduce((sum, h) => sum + h, 0)
                    : groupHeaderHeight;
                ctx.rect(finalX, groupHeight, finalWidth, totalHeaderHeight - groupHeight);
            }
        }
    );
    ctx.clip();
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
        headerOffset,
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

    // === unstickyHeader: динамическое изменение размера overlay canvas ===
    // Overlay canvas рисует шапку (групповые заголовки + заголовки колонок). Обычно его высота
    // фиксирована: totalHeaderHeight + 1px (граница). Когда unstickyHeader включён,
    // overlay canvas уменьшается по мере прокрутки шапки, потому что он непрозрачный
    // (alpha: false) — если бы он оставался полноразмерным, его нижняя часть перекрывала бы
    // основной canvas белым прямоугольником. Вместо этого мы физически уменьшаем overlay canvas
    // и используем ctx.translate(0, -headerOffset) для сдвига отрисовки, чтобы видимая часть была на месте.
    const visibleHeaderHeight = Math.max(0, totalHeaderHeight - headerOffset);
    const overlayHeight = visibleHeaderHeight + (visibleHeaderHeight > 0 ? 1 : 0); // +1 for bottom border
    const overlayWidthPx = Math.round(width * dpr);
    const overlayHeightPx = Math.round(overlayHeight * dpr);
    if (overlayCanvas.width !== overlayWidthPx || overlayCanvas.height !== overlayHeightPx) {
        overlayCanvas.width = overlayWidthPx;
        overlayCanvas.height = overlayHeightPx;

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

    // unstickyHeader: сдвигаем контекст отрисовки overlay canvas вверх на headerOffset,
    // чтобы содержимое шапки рисовалось в правильной позиции внутри уменьшенного canvas.
    // Например, при headerOffset=50 и totalHeaderHeight=100 overlay canvas имеет высоту 51px,
    // и мы сдвигаем на -50, чтобы были видны только нижние 50px шапки.
    if (headerOffset > 0) {
        overlayCtx.translate(0, -headerOffset);
    }

    const effectiveCols = getEffectiveColumns(mappedColumns, cellXOffset, width, dragAndDropState, translateX);

    let drawRegions: Rectangle[] = [];

    // === unstickyHeader: ключевые производные значения для отрисовки ячеек ===
    // effectiveTotalHeaderHeight: видимая высота шапки с точки зрения canvas.
    // На основном canvas ячейки обычно начинают рисоваться с y = totalHeaderHeight. Когда шапка
    // уходит, ячейки должны сдвинуться вверх, заполняя освободившееся место — поэтому используем
    // effectiveTotalHeaderHeight (уменьшается по мере роста headerOffset) как начальный Y для всех функций отрисовки ячеек.
    // headerFullyScrolled: флаг-предохранитель — когда true, пропускаем всю отрисовку шапки (она за экраном).
    const effectiveTotalHeaderHeight = totalHeaderHeight - headerOffset;
    const headerFullyScrolled = headerOffset >= totalHeaderHeight;
    const mustDrawFocusOnHeader = !headerFullyScrolled && drawFocus && selection.current?.cell[1] === cellYOffset && translateY === 0;
    let mustDrawHighlightRingsOnHeader = false;
    if (!headerFullyScrolled && highlightRegions !== undefined) {
        for (const r of highlightRegions) {
            if (r.style !== "no-outline" && r.range.y === cellYOffset && translateY === 0) {
                mustDrawHighlightRingsOnHeader = true;
                break;
            }
        }
    }
    const drawHeaderTexture = () => {
        if (headerFullyScrolled) return;
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
            touchMode
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
            true
        );

        // Рисуем нижнюю границу шапки. Используем totalHeaderHeight (не overlayHeight), потому что
        // контекст overlay сдвинут на -headerOffset, и totalHeaderHeight соответствует
        // правильной визуальной позиции — нижнему краю видимой области шапки.
        overlayCtx.beginPath();
        overlayCtx.moveTo(0, totalHeaderHeight + 0.5);
        overlayCtx.lineTo(width, totalHeaderHeight + 0.5);
        overlayCtx.strokeStyle = blend(
            theme.headerBottomBorderColor ?? theme.horizontalBorderColor ?? theme.borderColor,
            theme.bgHeader
        );
        overlayCtx.stroke();

        // unstickyHeader: overlay ctx уже имеет translate(0, -headerOffset) для отрисовки шапки.
        // computeBounds тоже вычитает headerOffset из Y-координат. При рисовании rings/fillHandle
        // на overlay получается двойное вычитание → ghost ring в неправильной позиции.
        // Компенсируем: временно отменяем translate перед отрисовкой rings.
        if (mustDrawHighlightRingsOnHeader) {
            if (headerOffset > 0) overlayCtx.save();
            if (headerOffset > 0) overlayCtx.translate(0, headerOffset);
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
                headerOffset
            );
            if (headerOffset > 0) overlayCtx.restore();
        }

        if (mustDrawFocusOnHeader) {
            if (headerOffset > 0) overlayCtx.save();
            if (headerOffset > 0) overlayCtx.translate(0, headerOffset);
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
                rows,
                headerOffset
            );
            if (headerOffset > 0) overlayCtx.restore();
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

        const doDamage = (ctx: CanvasRenderingContext2D) => {
            drawCells(
                ctx,
                effectiveCols,
                mappedColumns,
                height,
                effectiveTotalHeaderHeight,
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

            const selectionCurrent = selection.current;

            if (
                fillHandle !== false &&
                fillHandle !== undefined &&
                drawFocus &&
                selectionCurrent !== undefined &&
                damage.has(rectBottomRight(selectionCurrent.range))
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
                    effectiveTotalHeaderHeight,
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
                    damage
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
            effectiveTotalHeaderHeight,
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
            effectiveTotalHeaderHeight,
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
        theme
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
        headerOffset
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
              effectiveTotalHeaderHeight,
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
        effectiveTotalHeaderHeight,
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
        effectiveTotalHeaderHeight,
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
        effectiveTotalHeaderHeight,
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
        effectiveTotalHeaderHeight,
        getRowHeight,
        getRowThemeOverride,
        verticalBorder,
        freezeTrailingRows,
        rows,
        theme
    );

    highlightRedraw?.();
    focusRedraw?.();

    if (isResizing && resizeIndicator !== "none") {
        walkColumns(effectiveCols, 0, translateX, 0, effectiveTotalHeaderHeight, (c, x) => {
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
                        effectiveTotalHeaderHeight,
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
        effectiveTotalHeaderHeight,
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
