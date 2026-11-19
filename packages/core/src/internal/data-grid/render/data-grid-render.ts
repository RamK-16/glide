/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable unicorn/no-for-loop */
import { type DrawnFrame, type Rectangle } from "../data-grid-types.js";
import { CellSet } from "../cell-set.js";
import { type MappedGridColumn, rectBottomRight, remapForDnDState } from "./data-grid-lib.js";
import { type StickyAxis, attachRowAxis, computeColumnLayout, computeRowAxis, rowAxisOf } from "./data-grid-freeze.js";
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
import { drawCells, overlapsRanges, type DrawCellsStats, type GroupDetailsCallback } from "./data-grid-render.cells.js";
import { drawGridHeaders, drawHiddenColumnsIndicators } from "./data-grid-render.header.js";
import { drawGridLines, overdrawStickyBoundaries, drawBlanks, drawExtraRowThemes } from "./data-grid-render.lines.js";
import {
    blitLastFrame,
    blitResizedCol,
    computeCanBlit,
    getChangedRowsRegion,
    nextStickySpanInView,
} from "./data-grid-render.blit.js";
import { drawHighlightRings, drawFillHandle, drawColumnResizeOutline } from "./data-grid.render.rings.js";
import {
    getSelectionChangeRegions,
    isSelectionOnlyChange,
    selectionHeaderChanged,
} from "./data-grid-render.selection-regions.js";
import { getHairlineWidth } from "./data-grid-render.hairline.js";
import { rowHeightChangesSince } from "../../scrolling-data-grid/row-offsets.js";
import { normalizeHiddenIndicator } from "../hidden-columns-indicator.js";

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
        walkGroups(
            effectiveColumns,
            width,
            translateX,
            levelHeight,
            level,
            (span, _group, x, y, w, h, _level, spanMinCol, spanMaxCol, spanAllSpanned) => {
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

            // Левый пиксель ячейки шапки принадлежит линии предыдущей колонки, у первой
            // колонки холста линии слева нет: красим её от самого края, как полный кадр.
            const inset = drawX + diff === 0 ? 0 : 1;
            const finalX = drawX + diff + inset;
            const finalWidth = c.width - diff - inset;
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

// Часть линии ресайза, что идёт по шапке (канва шапки). Вынесена, чтобы рисовать её и в
// полном проходе, и при частичной перерисовке шапки: там ранний выход не доходит до
// блока ресайза, поэтому перерисованный фон шапки затирает левую половину линии и она
// худеет.
function drawResizeHeaderOutline(
    overlayCtx: CanvasRenderingContext2D,
    effectiveCols: readonly MappedGridColumn[],
    translateX: number,
    outlineHeight: number,
    resizeCol: number | undefined,
    hiddenColumnsIndicator: DrawGridArg["hiddenColumnsIndicator"],
    theme: DrawGridArg["theme"]
) {
    walkColumns(effectiveCols, 0, translateX, 0, outlineHeight, (c, x) => {
        if (c.sourceIndex === resizeCol) {
            // Если на правой границе тянущейся колонки стоит индикатор скрытых колонок,
            // линию ресайза в ШАПКЕ не рисуем, она перекрывала бы полосу.
            const boundaryHasIndicator =
                hiddenColumnsIndicator !== undefined &&
                normalizeHiddenIndicator(hiddenColumnsIndicator(c.sourceIndex + 1)).count > 0;
            if (!boundaryHasIndicator) {
                drawColumnResizeOutline(
                    overlayCtx,
                    x + c.width,
                    0,
                    outlineHeight,
                    blend(theme.resizeIndicatorColor ?? theme.accentLight, theme.bgHeader)
                );
            }
            return true;
        }
        return false;
    });
}

function drawResizeBodyOutline(
    ctx: CanvasRenderingContext2D,
    effectiveCols: readonly MappedGridColumn[],
    translateX: number,
    totalHeaderHeight: number,
    height: number,
    resizeCol: number,
    theme: DrawGridArg["theme"]
) {
    walkColumns(effectiveCols, 0, translateX, 0, totalHeaderHeight, (c, x) => {
        if (c.sourceIndex !== resizeCol) return false;
        drawColumnResizeOutline(
            ctx,
            x + c.width,
            totalHeaderHeight,
            height,
            blend(theme.resizeIndicatorColor ?? theme.accentLight, theme.bgCell)
        );
        return true;
    });
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
    },
    /** Отмечает, что в регионы попала прилипшая ячейка над повреждённой ячейкой тела. */
    stats?: { stickyOverlap: boolean }
): Rectangle[] {
    const result: Rectangle[] = [];
    const cellIndex: [number, number] = [0, 0];
    const rowAxis = rowAxisOf(effectiveColumns);

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
            // Прилипшие строки над повреждённой ячейкой тела рисуются заново (см. drawCells),
            // их прямоугольники тоже попадают в регионы.
            let underSticky: number[] | undefined;
            walkRowsInCol(
                startRow,
                colDrawStartY,
                height,
                rows,
                getRowHeight,
                freezeTrailingRows,
                hasAppendRow,
                undefined,
                (drawY, row, rh, isSticky) => {
                    if (row < 0) return;

                    cellIndex[1] = row;
                    if (!damage.has(cellIndex)) {
                        if (isSticky && underSticky !== undefined && overlapsRanges(underSticky, drawY, drawY + rh)) {
                            result.push({ x: colDrawX, y: drawY, width: colWidth, height: rh });
                            if (stats !== undefined) stats.stickyOverlap = true;
                        }
                        return;
                    }
                    if (!isSticky) {
                        if (underSticky === undefined) underSticky = [];
                        underSticky.push(drawY, drawY + rh);
                    }
                    {
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
                },
                rowAxis
            );
        }
    );

    return result;
}

/** Прилипшие колонки и строки видны вне окна прокрутки: их damage тоже в кадре. */
function getPinnedDamageRegions(
    effectiveCols: readonly MappedGridColumn[],
    rowAxis: StickyAxis,
    cellYOffset: number,
    columnCount: number
): Rectangle[] {
    // Та же высота окна строк, что у остальных регионов damageInView.
    const visibleRowsWindow = 300;
    const regions: Rectangle[] = [];
    for (const column of effectiveCols) {
        if (!column.sticky) break;
        regions.push({ x: column.sourceIndex, y: cellYOffset, width: 1, height: visibleRowsWindow });
    }
    rowAxis.forEachPinned(pinnedRow => {
        regions.push({ x: 0, y: pinnedRow, width: columnCount, height: 1 });
    });
    return regions;
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
                },
                rowAxisOf(effectiveColumns)
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
        stickyRows,
        dragAndDropState,
        theme,
        drawFocus,
        editorOpen = false,
        headerHeight,
        groupHeaderHeight,
        disabledRows,
        rowHeight,
        verticalBorder,
        horizontalBorder,
        getCellBorder,
        hiddenColumnsIndicator,
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
        hoveredResizeCol,
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
        onFrameDrawn,
    } = arg;
    const indicatorCol = isResizing ? resizeCol : hoveredResizeCol;
    const showResizeIndicator = indicatorCol !== undefined && resizeIndicator !== "none";
    // При наведении линия ограничена шапкой. В теле она видна только во время ресайза.
    const showResizeBodyIndicator = showResizeIndicator && isResizing && resizeIndicator === "full";
    if (width === 0 || height === 0) return;
    const doubleBuffer = renderStrategy === "double-buffer";
    const dpr = Math.min(maxScaleFactor, Math.ceil(window.devicePixelRatio ?? 1));

    // if we are double buffering we need to make sure we can blit. If we can't we need to redraw the whole thing
    let canBlit = renderStrategy !== "direct" && computeCanBlit(arg, lastArg);

    // Сменились только выделение, регионы подсветки или фокус: прошлый кадр годится, поверх него
    // перерисуем прежние и новые области выделения, см. `getSelectionChangeRegions`.
    const selectionChange =
        canBlit === false &&
        renderStrategy !== "direct" &&
        lastArg !== undefined &&
        lastBlitData.current !== undefined &&
        isSelectionOnlyChange(arg, lastArg);
    if (selectionChange) canBlit = true;

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
    // Присвоение canvas.width выше очистило холст: прошлого кадра на нём больше нет.
    if (last?.dpr !== undefined && last.dpr !== dpr) canBlit = false;
    const resizeHoverChanged =
        !isResizing && resizeIndicator !== "none" && hoveredResizeCol !== lastArg?.hoveredResizeCol;
    if (
        canBlit === true &&
        !resizeHoverChanged &&
        !selectionChange &&
        rowHeight === lastArg?.rowHeight &&
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

    const columnLayout = computeColumnLayout(
        remapForDnDState(mappedColumns, dragAndDropState),
        cellXOffset,
        translateX,
        width,
        freezeColumns
    );
    const effectiveCols = columnLayout.effectiveCols;
    const rowAxis = computeRowAxis(
        stickyRows,
        rows - freezeTrailingRows,
        cellYOffset,
        translateY,
        totalHeaderHeight,
        height,
        getRowHeight
    );
    attachRowAxis(effectiveCols, rowAxis);
    const pinnedColumnsEnd = columnLayout.axis.pinnedEnd;
    const pinnedRowsCount = rowAxis.pinnedCount;
    // Элемент прилип или отлип: меняется зона и то, какой фрагмент слитого блока рисует текст,
    // поэтому сдвигать прошлый кадр нельзя.
    if (
        last !== undefined &&
        (last.pinnedColumnsEnd !== pinnedColumnsEnd || last.pinnedRowsCount !== pinnedRowsCount)
    ) {
        canBlit = false;
    }
    // Содержимое слитого блока с прилипанием (spanAlign.sticky) выравнивается по видимой
    // части блока: при вертикальной прокрутке сдвинутый прошлый кадр унёс бы его вместе с
    // блоком, поэтому перерисовываем целиком.
    if (last?.stickySpanInView === true && (cellYOffset !== last.cellYOffset || translateY !== last.translateY)) {
        canBlit = false;
    }

    let selectionRegions: Rectangle[] | undefined;
    if (selectionChange && canBlit === true && lastArg !== undefined) {
        selectionRegions = getSelectionChangeRegions({
            selection,
            lastSelection: lastArg.selection,
            highlightRegions,
            lastHighlightRegions: lastArg.highlightRegions,
            focusChanged: isFocused !== lastArg.isFocused,
            columnLayout,
            cellYOffset,
            translateY,
            totalHeaderHeight,
            width,
            height,
            rows,
            freezeTrailingRows,
            pinnedRows: rowAxis.items
                .slice(0, rowAxis.pinnedCount)
                .map((row, i) => ({ row, top: rowAxis.positions[i], height: rowAxis.sizes[i] })),
            fillHandle,
            getRowHeight,
            getCellContent,
        });
        if (selectionRegions === undefined) canBlit = false;
    }

    // Сменились только высоты строк from..to (`RowHeightChanges`): прошлый кадр сдвигаем как обычно
    // и перерисовываем экран от первой изменившейся строки вниз, см. `getChangedRowsRegion`.
    let changedRowsRegion: Rectangle | undefined;
    if (canBlit !== false && lastArg !== undefined && rowHeight !== lastArg.rowHeight) {
        const changes = rowHeightChangesSince(rowHeight, lastArg.rowHeight);
        changedRowsRegion =
            changes === undefined || canBlit !== true
                ? undefined
                : getChangedRowsRegion({
                      changes,
                      lastCellYOffset: last?.cellYOffset ?? cellYOffset,
                      cellYOffset,
                      translateY,
                      totalHeaderHeight,
                      width,
                      height,
                      rows,
                      freezeTrailingRows,
                      pinnedRowsCount,
                      stickySpanInView: last?.stickySpanInView === true,
                      getRowHeight,
                      spanStartOf: row => {
                          let start = row;
                          for (const c of effectiveCols) {
                              const { spanRows } = getCellContent([c.sourceIndex, row]);
                              if (spanRows !== undefined && spanRows[0] < start && spanRows[1] >= row) {
                                  start = spanRows[0];
                              }
                          }
                          return start;
                      },
                  });
        if (changedRowsRegion === undefined) canBlit = false;
    }

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
    // Отладочная отметка о кадре для тестов частичной перерисовки, см. `experimental.onFrameDrawn`.
    // Ранний выход выше (ничего не менялось) кадра не даёт, поэтому отметки там нет.
    let headerDrawn = false;
    const reportFrame = (kind: DrawnFrame["kind"], regions: readonly Rectangle[]) =>
        onFrameDrawn?.({ kind, regions, header: headerDrawn });
    const drawHeaderResizeIndicator = () => {
        if (showResizeIndicator) {
            drawResizeHeaderOutline(
                overlayCtx,
                effectiveCols,
                translateX,
                isResizing ? overlayHeight : totalHeaderHeight,
                indicatorCol,
                hiddenColumnsIndicator,
                theme
            );
        }
    };
    const drawBodyResizeIndicator = (ctx: CanvasRenderingContext2D) => {
        if (showResizeBodyIndicator) {
            drawResizeBodyOutline(ctx, effectiveCols, translateX, totalHeaderHeight, height, indicatorCol, theme);
        }
    };
    const drawHeaderTexture = () => {
        headerDrawn = true;
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

        // Индикатор скрытых колонок рисуем последним, чтобы он перекрыл ячейки шапки,
        // вертикальные линии и нижнюю границу.
        if (hiddenColumnsIndicator !== undefined) {
            drawHiddenColumnsIndicators(
                overlayCtx,
                effectiveCols,
                mappedColumns.length,
                translateX,
                totalHeaderHeight,
                groupHeaderHeight,
                theme,
                hiddenColumnsIndicator
            );
        }

        // Обводки на канве шапки нужны только ради верхней линии первой видимой
        // строки (она лежит в 1px-полосе под шапкой). Регионы строк, ушедших выше
        // вьюпорта, геометрически попадают в шапку, поэтому клипуем по области данных.
        const clipRingsBelowHeader = (draw: () => void) => {
            overlayCtx.save();
            overlayCtx.beginPath();
            overlayCtx.rect(0, totalHeaderHeight, width, overlayHeight - totalHeaderHeight);
            overlayCtx.clip();
            draw();
            overlayCtx.restore();
        };

        if (mustDrawHighlightRingsOnHeader) {
            clipRingsBelowHeader(() => {
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
                    enableLowDprHairline,
                    columnLayout,
                    rowAxis
                );
            });
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

        if (mustDrawHighlightRingsOnHeader) {
            // Фаза "above" и на канве шапки: иначе у регионов с drawAboveSelection
            // пропадает верхняя линия первой видимой строки (перекрыта overlay-канвой).
            clipRingsBelowHeader(() => {
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
                    enableLowDprHairline,
                    columnLayout,
                    rowAxis,
                    "above"
                );
            });
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
            ...getPinnedDamageRegions(columnLayout.effectiveCols, rowAxis, cellYOffset, mappedColumns.length),
        ]);

        // span-repair НЕ зависит от enableLowDprHairline: ручной damage-путь нужен всегда,
        // когда в damage попала span-ячейка (иначе hover затирает границы объединённого блока
        // и не восстанавливает их). Обычные таблицы без флага и без span — быстрый blit-путь.
        const spansInDamage = damageInView && damageHasSpanCells(damage, getCellContent);
        // Прямоугольники повреждённых ячеек нужны и быстрому пути: по ним
        // перерисовываются обводки регионов подсветки (см. ниже)
        const damageStats = { stickyOverlap: false };
        const cellDamageRegions = damageInView
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
                  getCellContent,
                  damageStats
              )
            : undefined;

        // Точечная дорисовка обновляет только ячейки, а фон строки (наведение, зебра, отмеченная
        // строка) в полном кадре красится и в пустой области правее последней колонки (drawBlanks).
        // Иначе после смены строки под курсором точечной дорисовкой справа от колонок оставалась
        // полоса прежнего цвета. Полоса узкая, строк на экране немного: перекрашиваем её целиком.
        // Без тем строк пустая область от точечной дорисовки не зависит.
        const lastCol = effectiveCols[effectiveCols.length - 1];
        const blankLeft = lastCol === undefined ? width : columnLayout.drawX(lastCol.sourceIndex) + lastCol.width;
        const blankArea: Rectangle | undefined =
            damageInView && getRowThemeOverride !== undefined && blankLeft < width
                ? {
                      x: blankLeft,
                      y: totalHeaderHeight + 1,
                      width: width - blankLeft,
                      height: height - totalHeaderHeight - 1,
                  }
                : undefined;
        const repaintBlankArea = (ctx: CanvasRenderingContext2D) => {
            if (blankArea === undefined) return;
            ctx.save();
            ctx.beginPath();
            ctx.rect(blankArea.x, blankArea.y, blankArea.width, blankArea.height);
            ctx.clip();
            ctx.fillStyle = theme.bgCell;
            ctx.fillRect(blankArea.x, blankArea.y, blankArea.width, blankArea.height);
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
                [blankArea],
                undefined,
                theme
            );
            drawGridLines(
                ctx,
                effectiveCols,
                cellYOffset,
                translateX,
                translateY,
                width,
                height,
                [blankArea],
                undefined,
                groupHeaderHeight,
                totalHeaderHeight,
                getRowHeight,
                getRowThemeOverride,
                verticalBorder,
                freezeTrailingRows,
                rows,
                theme,
                false,
                enableLowDprHairline,
                horizontalBorder,
                getCellBorder
            );
            ctx.restore();
        };

        // Свои рамки ячеек: скрытая линия это обычный столбец фона, а быстрый путь левый пиксель
        // ячейки за линию и не красит. Ручной путь красит ячейки целиком и рисует линии по ячейкам.
        // Ячейка тела под прилипшими строками красится целиком и задевает линию на границе
        // прилипшей зоны: её возвращают только линии сетки ручного пути.
        const repairRegions =
            enableLowDprHairline || spansInDamage || getCellBorder !== undefined || damageStats.stickyOverlap
                ? cellDamageRegions
                : undefined;
        const doDamage = (ctx: CanvasRenderingContext2D) => {
            if (repairRegions !== undefined && repairRegions.length > 0) {
                const repairPad = getBodyDamagePad(enableLowDprHairline, spansInDamage);
                // cellDamageRegions остаются точной dirty-геометрией, а visualDamageRegions расширяют только область repair.
                // Так мы дорисовываем соседние grid/highlight штрихи без отдельного hover-хака и без смены normal cell rendering path.
                const visualDamageRegions = expandDamageDrawRegions(repairRegions, repairPad);

                ctx.save();
                ctx.beginPath();
                for (const r of visualDamageRegions) {
                    ctx.rect(r.x, r.y, r.width, r.height);
                }
                ctx.clip();

                ctx.fillStyle = theme.bgCell;
                ctx.fill();
                ctx.beginPath();

                // Разделитель закреплённых колонок здесь не рисуем: в полном кадре линию
                // overdrawStickyBoundaries перекрывает заливка фона, и видимую линию на
                // границе зоны даёт только drawGridLines по правилам verticalBorder и
                // getCellBorder. Здесь она тоже рисуется линиями сетки после ячеек.

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
                    enableLowDprHairline,
                    columnLayout,
                    rowAxis,
                    "below",
                    false
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
                          rows,
                          false
                      )
                    : undefined;

                const highlightAboveRedraw = drawHighlightRings(
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
                    enableLowDprHairline,
                    columnLayout,
                    rowAxis,
                    "above",
                    false
                );

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
                    editorOpen,
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
                    enableLowDprHairline,
                    horizontalBorder,
                    getCellBorder
                );

                highlightRedraw?.();
                focusRedraw?.();
                highlightAboveRedraw?.();
                ctx.restore();
                repaintBlankArea(ctx);
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
                editorOpen,
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
                minimumCellWidth,
                undefined,
                { verticalBorder, horizontalBorder }
            );

            // Обводки регионов подсветки (внешние регионы, диапазоны rangeStack,
            // рамка фокуса, кольца ошибок) лежат на крайних пикселях ячеек. Ячейка,
            // залитая до края, при точечной дорисовке их затирала, пока их не
            // перерисует полный кадр. Перерисовываем обводки в границах повреждённых
            // ячеек в том же порядке, что и полный кадр: обычные, маркер растяжения,
            // регионы с drawAboveSelection.
            const redrawRingsInDamage = (phase: "below" | "above") => {
                if (cellDamageRegions === undefined || cellDamageRegions.length === 0) return;
                ctx.save();
                ctx.beginPath();
                for (const r of cellDamageRegions) {
                    ctx.rect(r.x, r.y, r.width, r.height);
                }
                ctx.clip();
                drawHighlightRings(
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
                    enableLowDprHairline,
                    columnLayout,
                    rowAxis,
                    phase,
                    true
                );
                ctx.restore();
            };

            // Разделитель закреплённых колонок отдельно не возвращаем: в полном кадре его
            // рисует drawGridLines как правую линию последней закреплённой колонки, а
            // точечная дорисовка этот пиксель не трогает (см. drawCells, leftLine).
            redrawRingsInDamage("below");

            const selectionCurrent = selection.current;

            // В эту ветку попадают только кадры без слитых ячеек в damage (они идут
            // клип-путём выше), поэтому здесь достаточно поведения апстрима: ручка
            // заполнения перерисовывается, только когда повреждена её ячейка.
            if (
                fillHandle !== false &&
                fillHandle !== undefined &&
                drawFocus &&
                selectionCurrent !== undefined &&
                damage.has(rectBottomRight(selectionCurrent.range))
            ) {
                // Маркер выходит за край ячейки в соседние; их пиксели в этом кадре не красятся,
                // и маркер лёг бы там поверх обводок, которые ниже дорисовываются только в
                // повреждённых ячейках. Рисуем его в тех же границах: снаружи остаётся прошлый кадр.
                ctx.save();
                ctx.beginPath();
                for (const r of cellDamageRegions ?? []) {
                    ctx.rect(r.x, r.y, r.width, r.height);
                }
                ctx.clip();
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
                ctx.restore();
            }
            redrawRingsInDamage("above");
            repaintBlankArea(ctx);
        };

        if (damageInView) {
            doDamage(targetCtx);
            drawBodyResizeIndicator(targetCtx);
            if (mainCtx !== null) {
                mainCtx.save();
                mainCtx.scale(dpr, dpr);
                mainCtx.textBaseline = "middle";
                doDamage(mainCtx);
                drawBodyResizeIndicator(mainCtx);
                mainCtx.restore();
            }

            const doHeaders = damage.hasHeader();
            if (doHeaders) {
                // Отсечение по области перерисовки оборачиваем в свою пару save/restore:
                // после перерисовки фона шапки снимаем его и дорисовываем линию ресайза уже
                // без отсечения.
                overlayCtx.save();
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
                overlayCtx.restore();

                // Восстанавливаем линию после обновления фона шапки как при drag,
                // так и при hover. Отсечение уже снято, масштаб dpr на месте.
                drawHeaderResizeIndicator();
            }
        }

        reportFrame("damage", cellDamageRegions ?? []);
        targetCtx.restore();
        overlayCtx.restore();

        return;
    }

    // Шапка отмечает выбранные колонки и колонку выбранной ячейки, поэтому рисуется заново, когда
    // у выделения сменились колонки (смена только строк её не трогает). На её холсте лежит и
    // верхняя линия обводок регионов первой видимой строки: при смене регионов, когда такая линия
    // есть или была, шапка тоже рисуется заново. Новые функции рисования шапки и групп тоже
    // перерисовывают её: раньше их подхватывал полный кадр от смены выделения.
    if (
        canBlit !== true ||
        resizeHoverChanged ||
        cellXOffset !== last?.cellXOffset ||
        translateX !== last?.translateX ||
        mustDrawFocusOnHeader !== last?.mustDrawFocusOnHeader ||
        mustDrawHighlightRingsOnHeader !== last?.mustDrawHighlightRingsOnHeader ||
        (selectionChange && lastArg !== undefined && selectionHeaderChanged(selection, lastArg.selection)) ||
        (selectionChange &&
            (drawHeaderCallback !== lastArg?.drawHeaderCallback ||
                drawGroupHeaderCallback !== lastArg?.drawGroupHeaderCallback ||
                getGroupDetails !== lastArg?.getGroupDetails)) ||
        (selectionChange &&
            highlightRegions !== lastArg?.highlightRegions &&
            (mustDrawHighlightRingsOnHeader || last?.mustDrawHighlightRingsOnHeader === true))
    ) {
        drawHeaderTexture();
        drawHeaderResizeIndicator();
    }

    // При смене границы в шапке можно сохранить буфер тела. Для выделения за экраном
    // сохраняем прежнее правило: в теле нет областей, требующих перерисовки.
    if (
        (selectionChange ? selectionRegions?.length === 0 : canBlit === true && resizeHoverChanged) &&
        changedRowsRegion === undefined &&
        last !== undefined &&
        cellXOffset === last.cellXOffset &&
        cellYOffset === last.cellYOffset &&
        translateX === last.translateX &&
        translateY === last.translateY
    ) {
        lastBlitData.current = { ...last, mustDrawFocusOnHeader, mustDrawHighlightRingsOnHeader };
        reportFrame(selectionChange ? "selection" : "damage", []);
        targetCtx.restore();
        overlayCtx.restore();
        return;
    }

    if (canBlit === true) {
        assert(blitSource !== undefined && last !== undefined);
        const extraRegions = selectionRegions ?? [];
        if (changedRowsRegion !== undefined) extraRegions.push(changedRowsRegion);
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
            doubleBuffer,
            rowAxis.hasItems ? Math.min(rowAxis.maxEnd, height) : totalHeaderHeight,
            extraRegions
        );
        drawRegions = regions;
        // Горизонтальный сдвиг переписывает столбец пикселей разделителя закреплённых
        // колонок содержимым соседней колонки. Узкая полоса на границе возвращает его в
        // кадр вместе с тем, что лежит на нём (обводки регионов и рамки ячеек), обычным
        // путём отрисовки под клипом. Пустой список областей значит, что сдвига не было
        // (прыжок больше экрана) и кадр рисуется целиком: полоса там не нужна и вредна,
        // с ней под клип попала бы только она.
        if (
            drawRegions.length > 0 &&
            pinnedColumnsEnd > 0 &&
            (cellXOffset !== last.cellXOffset || translateX !== last.translateX)
        ) {
            drawRegions.push({
                x: pinnedColumnsEnd - 1,
                y: totalHeaderHeight,
                width: 3,
                height: height - totalHeaderHeight,
            });
        }
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

    // При сдвиге прошлого кадра (drawRegions от блита или областей выделения) разделитель
    // закреплённых колонок рисуем только в новых полосах: остальная канва скопирована
    // вместе с разделителем и тем, что лежит на нём (цветные куски рамок ячеек, обводки
    // регионов и выделения), а перерисовка серым на всю высоту это затирала (дальше весь
    // рендер идёт под клипом по drawRegions и восстановить это не может) и с каждым кадром
    // делала полупрозрачную линию темнее.
    const clipStickyToRegions = drawRegions.length > 0;
    if (clipStickyToRegions) {
        targetCtx.save();
        targetCtx.beginPath();
        for (const r of drawRegions) {
            targetCtx.rect(r.x, r.y, r.width, r.height);
        }
        targetCtx.clip();
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
    if (clipStickyToRegions) {
        targetCtx.restore();
    }

    // Обводки рисуются только после ячеек (вызов highlightRedraw): при сдвиге прошлого кадра
    // они уже на холсте, и второй слой делал бы полупрозрачные края темнее.
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
        enableLowDprHairline,
        columnLayout,
        rowAxis,
        "below",
        false
    );

    // Маркер растяжения, как и обводки, рисуется только после ячеек (вызов focusRedraw).
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
              rows,
              false
          )
        : undefined;

    const highlightAboveRedraw = drawHighlightRings(
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
        enableLowDprHairline,
        columnLayout,
        rowAxis,
        "above",
        false
    );

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

    const cellsStats: DrawCellsStats = { stickySpanInView: false };
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
        editorOpen,
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
        minimumCellWidth,
        cellsStats
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
        enableLowDprHairline,
        horizontalBorder,
        getCellBorder
    );

    highlightRedraw?.();
    focusRedraw?.();
    highlightAboveRedraw?.();

    drawBodyResizeIndicator(targetCtx);

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
        [
            ...Array.from({ length: freezeTrailingRows }, (_, i) => rows - 1 - i),
            ...rowAxis.items.slice(0, rowAxis.pinnedCount),
        ],
        effectiveCols
            .filter(column => column.sticky && column.sourceIndex >= freezeColumns)
            .map(column => column.sourceIndex)
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
        pinnedColumnsEnd,
        pinnedRowsCount,
        dpr,
        lastBuffer: doubleBuffer ? (targetBuffer === bufferA ? "a" : "b") : undefined,
        stickySpanInView: nextStickySpanInView(
            cellsStats.stickySpanInView,
            drawRegions.length > 0,
            last?.stickySpanInView
        ),
        aBufferScroll: targetBuffer === bufferA ? [scrollX, scrollY] : last?.aBufferScroll,
        bBufferScroll: targetBuffer === bufferB ? [scrollX, scrollY] : last?.bBufferScroll,
    };

    if (canBlit === false) reportFrame("full", [{ x: 0, y: 0, width, height }]);
    else reportFrame(selectionChange ? "selection" : "blit", drawRegions);
    targetCtx.restore();
    overlayCtx.restore();
}
