import { type Item, type Rectangle } from "../data-grid-types.js";
import { type MappedGridColumn, isGroupEqual } from "./data-grid-lib.js";
import { type ColumnLayout, type StickyAxis, columnLayoutOf } from "./data-grid-freeze.js";

export function getSkipPoint(drawRegions: readonly Rectangle[]): number | undefined {
    if (drawRegions.length === 0) return undefined;
    let drawRegionsLowestY: number | undefined;
    for (const dr of drawRegions) {
        drawRegionsLowestY = Math.min(drawRegionsLowestY ?? dr.y, dr.y);
    }
    return drawRegionsLowestY;
}

export type WalkRowsCallback = (
    drawY: number,
    row: number,
    rowHeight: number,
    isSticky: boolean,
    isTrailingRow: boolean
) => boolean | void;

/**
 * Обход строк колонки тремя секциями: прокручиваемые строки, закреплённые сверху липкие строки
 * (`rowAxis`) и закреплённые снизу. Липкие строки рисуются после прокручиваемых и с `isSticky`,
 * то есть с непрозрачным фоном поверх того, что прокрутилось под зону. Строки, целиком
 * ушедшие под зону, не обходятся.
 */
export function walkRowsInCol(
    startRow: number,
    drawY: number,
    height: number,
    rows: number,
    getRowHeight: (row: number) => number,
    freezeTrailingRows: number,
    hasAppendRow: boolean,
    skipToY: number | undefined,
    cb: WalkRowsCallback,
    rowAxis?: StickyAxis
): void {
    const pinnedCount = rowAxis?.pinnedCount ?? 0;
    const pinnedRows: readonly number[] = rowAxis?.items ?? [];
    skipToY = skipToY ?? drawY;
    if (rowAxis !== undefined && pinnedCount > 0) {
        skipToY = Math.max(skipToY, rowAxis.pinnedEnd);
    }
    let y = drawY;
    let row = startRow;
    const rowEnd = rows - freezeTrailingRows;
    let didBreak = false;
    let nextPinnedPosition = 0;
    while (y < height && row < rowEnd) {
        const rh = getRowHeight(row);
        while (nextPinnedPosition < pinnedCount && pinnedRows[nextPinnedPosition] < row) nextPinnedPosition++;
        const isPinned = nextPinnedPosition < pinnedCount && pinnedRows[nextPinnedPosition] === row;
        if (!isPinned && y + rh > skipToY && cb(y, row, rh, false, hasAppendRow && row === rows - 1) === true) {
            didBreak = true;
            break;
        }
        y += rh;
        row++;
    }

    if (didBreak) return;

    if (rowAxis !== undefined) {
        for (let pinnedPosition = 0; pinnedPosition < pinnedCount; pinnedPosition++) {
            const pinnedRow = pinnedRows[pinnedPosition];
            const pinnedY = rowAxis.positions[pinnedPosition];
            const pinnedHeight = rowAxis.sizes[pinnedPosition];
            const isTrailingRow = hasAppendRow && pinnedRow === rows - 1;
            if (cb(pinnedY, pinnedRow, pinnedHeight, true, isTrailingRow) === true) return;
        }
    }

    y = height;
    for (let fr = 0; fr < freezeTrailingRows; fr++) {
        row = rows - 1 - fr;
        const rh = getRowHeight(row);
        y -= rh;
        cb(y, row, rh, true, hasAppendRow && row === rows - 1);
    }
}

export type WalkColsCallback = (
    col: MappedGridColumn,
    drawX: number,
    drawY: number,
    clipX: number,
    startRow: number
) => boolean | void;

/**
 * Обход колонок кадра. С `layout` позиции берутся из раскладки липких колонок (computeColumnLayout),
 * без него — апстримное накопление ширин (только префикс freezeColumns).
 */
export function walkColumns(
    effectiveCols: readonly MappedGridColumn[],
    cellYOffset: number,
    translateX: number,
    translateY: number,
    totalHeaderHeight: number,
    cb: WalkColsCallback,
    layout: ColumnLayout | undefined = columnLayoutOf(effectiveCols)
): void {
    const drawY = totalHeaderHeight + translateY;
    if (layout !== undefined) {
        const zoneEnd = layout.axis.pinnedEnd;
        for (const column of effectiveCols) {
            const clipX = column.sticky ? 0 : zoneEnd;
            if (cb(column, layout.drawX(column.sourceIndex), drawY, clipX, cellYOffset) === true) {
                break;
            }
        }
        return;
    }

    let x = 0;
    let clipX = 0; // this tracks the total width of sticky cols
    for (const c of effectiveCols) {
        const drawX = c.sticky ? clipX : x + translateX;
        if (cb(c, drawX, drawY, c.sticky ? 0 : clipX, cellYOffset) === true) {
            break;
        }

        x += c.width;
        clipX += c.sticky ? c.width : 0;
    }
}

// this should not be item, it is [startInclusive, endInclusive]
export type WalkGroupsCallback = (
    colSpan: Item,
    group: string,
    x: number,
    y: number,
    width: number,
    height: number,
    level: number,
    // Истинные min/max sourceIndex по ВСЕМ колонкам спана. При DnD-реордере
    // визуальный порядок ломает монотонность colSpan (напр. [2,1]), поэтому
    // damage-проверки должны считать прямоугольник по этим границам, а не по концам.
    spanMinCol: number,
    spanMaxCol: number,
    // Спан целиком из spanGroupHeader-колонок (их групп-ячейку рисуют отдельно) —
    // считаем по фактическим членам, а не циклом по source-диапазону (тот ломается
    // при span[0] > span[1] и при позиция ≠ sourceIndex).
    spanAllSpanned: boolean,
    // У какой-либо колонки спана есть более глубокая подгруппа (level+1). Считаем по
    // фактическим членам (по позиции) по той же причине, что и spanAllSpanned. Нужно
    // getSpannedGroupRegions, чтобы отличить «терминальную» слитую группу под DnD.
    spanHasDeeperGroup: boolean
) => void;

export function getGroupLevels(effectiveCols: readonly MappedGridColumn[]): number {
    let maxLevels = 0;
    for (const col of effectiveCols) {
        if (col.group !== undefined) {
            const levels = Array.isArray(col.group) ? col.group.length : 1;
            maxLevels = Math.max(maxLevels, levels);
        }
    }
    return maxLevels;
}

export function getTotalGroupHeaderHeight(
    groupHeaderHeight: number | number[],
    effectiveCols?: readonly MappedGridColumn[]
): number {
    if (Array.isArray(groupHeaderHeight)) {
        if (groupHeaderHeight.length === 0) return 0;
        return groupHeaderHeight.reduce((sum, h) => sum + h, 0);
    }
    if (effectiveCols !== undefined) {
        const levels = getGroupLevels(effectiveCols);
        if (levels === 0) return 0;
        return groupHeaderHeight * levels;
    }
    return groupHeaderHeight;
}

export function getGroupAtLevel(group: string | string[] | undefined, level: number): string {
    if (group === undefined) return "";
    if (Array.isArray(group)) {
        return group[level] ?? "";
    }
    return level === 0 ? group : "";
}

export function walkGroups(
    effectiveCols: readonly MappedGridColumn[],
    width: number,
    translateX: number,
    groupHeaderHeights: number | number[],
    level: number,
    cb: WalkGroupsCallback,
    layout: ColumnLayout | undefined = columnLayoutOf(effectiveCols)
): void {
    const groupHeaderHeight = Array.isArray(groupHeaderHeights)
        ? groupHeaderHeights[level] ?? groupHeaderHeights[0] ?? 0
        : groupHeaderHeights;

    let x = 0;
    let clipX = 0;
    for (let index = 0; index < effectiveCols.length; index++) {
        const startCol = effectiveCols[index];

        let end = index + 1;
        let boxWidth = startCol.width;
        let spanMinCol = startCol.sourceIndex;
        let spanMaxCol = startCol.sourceIndex;
        let spanAllSpanned = startCol.spanGroupHeader === true;
        let spanHasDeeperGroup = getGroupAtLevel(startCol.group, level + 1) !== "";
        if (startCol.sticky) {
            clipX += boxWidth;
        }
        while (
            end < effectiveCols.length &&
            // spanGroupHeader-колонка НЕ входит ни в какую группу: она рисуется как одна
            // высокая ячейка (drawGridHeaders) и не должна сливаться в общий групп-спан с
            // соседями. Иначе в смешанном «»-спане (слитая рядом с неслитой) пустая
            // групп-ячейка/ховер/клип легли бы поверх слитой колонки. Разрываем спан на
            // ней с обеих сторон.
            startCol.spanGroupHeader !== true &&
            effectiveCols[end].spanGroupHeader !== true &&
            isGroupEqual(effectiveCols[end].group, startCol.group, level) &&
            effectiveCols[end].sticky === effectiveCols[index].sticky &&
            // Закреплённые колонки идут первыми: соседи по списку могут быть не соседями на экране.
            (layout === undefined || isScreenAdjacent(layout, effectiveCols[end - 1], effectiveCols[end]))
        ) {
            const endCol = effectiveCols[end];
            boxWidth += endCol.width;
            spanMinCol = Math.min(spanMinCol, endCol.sourceIndex);
            spanMaxCol = Math.max(spanMaxCol, endCol.sourceIndex);
            spanAllSpanned = spanAllSpanned && endCol.spanGroupHeader === true;
            spanHasDeeperGroup = spanHasDeeperGroup || getGroupAtLevel(endCol.group, level + 1) !== "";
            end++;
            index++;
            if (endCol.sticky) {
                clipX += endCol.width;
            }
        }

        const t = startCol.sticky ? 0 : translateX;
        const localX = layout === undefined ? x + t : layout.drawX(startCol.sourceIndex);
        const zoneEnd = layout === undefined ? clipX : layout.axis.pinnedEnd;
        const delta = startCol.sticky ? 0 : Math.max(0, zoneEnd - localX);
        const w = Math.min(boxWidth - delta, width - (localX + delta));
        const groupName = getGroupAtLevel(startCol.group, level);
        cb(
            [startCol.sourceIndex, effectiveCols[end - 1].sourceIndex],
            groupName,
            localX + delta,
            0,
            w,
            groupHeaderHeight,
            level,
            spanMinCol,
            spanMaxCol,
            spanAllSpanned,
            spanHasDeeperGroup
        );

        x += boxWidth;
    }
}

function isScreenAdjacent(layout: ColumnLayout, left: MappedGridColumn, right: MappedGridColumn): boolean {
    return Math.abs(layout.drawX(left.sourceIndex) + left.width - layout.drawX(right.sourceIndex)) < 0.5;
}

export interface SpannedGroupRegionCols {
    readonly level: number;
    readonly startCol: number;
    readonly endCol: number;
}

/**
 * Логические (без геометрии) регионы слитых групп: помеченная `isGroupSpanned` группа,
 * терминальная на своём уровне (ни у одной колонки нет группы глубже), сливает свои
 * пустые нижние групп-уровни в одну ячейку (rowspan). Единый источник для
 * render / hit-test / bounds / clip — чтобы они не рассинхронились (ragged-случаи не
 * сливаем). Геометрию (x/w/height) каждый потребитель добавляет сам.
 */
export function getSpannedGroupRegions(
    effectiveCols: readonly MappedGridColumn[],
    levels: number,
    isGroupSpanned: (groupName: string) => boolean
): SpannedGroupRegionCols[] {
    const regions: SpannedGroupRegionCols[] = [];
    for (let level = 0; level < levels - 1; level++) {
        walkGroups(
            effectiveCols,
            0,
            0,
            0,
            level,
            (span, groupName, _x, _y, _w, _h, _lvl, _min, _max, _allSpanned, spanHasDeeperGroup) => {
                if (groupName === "" || !isGroupSpanned(groupName)) return;
                // Терминальность (нет более глубокой подгруппы) берём из флага walkGroups —
                // он считается по фактическим членам-позициям. Прежний цикл
                // effectiveCols[span[0]..span[1]] индексировал по sourceIndex как по позиции
                // и ломался под DnD-реордером (позиция ≠ sourceIndex → сквош рвался).
                if (spanHasDeeperGroup) return;
                regions.push({ level, startCol: span[0], endCol: span[1] });
            }
        );
    }
    return regions;
}

/** Регион слитой группы, покрывающий колонку `col` на групп-уровне `level` (или ниже него). */
export function findSpannedGroupRegion(
    regions: readonly SpannedGroupRegionCols[],
    col: number,
    level: number
): SpannedGroupRegionCols | undefined {
    return regions.find(r => r.level <= level && r.startCol <= col && r.endCol >= col);
}

export function getSpanBounds(
    span: Item,
    cellX: number,
    cellY: number,
    cellW: number,
    cellH: number,
    column: MappedGridColumn,
    allColumns: readonly MappedGridColumn[]
): [Rectangle | undefined, Rectangle | undefined] {
    const [startCol, endCol] = span;

    let frozenRect: Rectangle | undefined;
    let contentRect: Rectangle | undefined;

    const firstNonSticky = allColumns.find(x => !x.sticky)?.sourceIndex ?? 0;
    if (endCol > firstNonSticky) {
        const renderFromCol = Math.max(startCol, firstNonSticky);
        let tempX = cellX;
        let tempW = cellW;
        for (let x = column.sourceIndex - 1; x >= renderFromCol; x--) {
            tempX -= allColumns[x].width;
            tempW += allColumns[x].width;
        }
        for (let x = column.sourceIndex + 1; x <= endCol; x++) {
            tempW += allColumns[x].width;
        }
        contentRect = {
            x: tempX,
            y: cellY,
            width: tempW,
            height: cellH,
        };
    }

    if (firstNonSticky > startCol) {
        const renderToCol = Math.min(endCol, firstNonSticky - 1);
        let tempX = cellX;
        let tempW = cellW;
        for (let x = column.sourceIndex - 1; x >= startCol; x--) {
            tempX -= allColumns[x].width;
            tempW += allColumns[x].width;
        }
        for (let x = column.sourceIndex + 1; x <= renderToCol; x++) {
            tempW += allColumns[x].width;
        }
        frozenRect = {
            x: tempX,
            y: cellY,
            width: tempW,
            height: cellH,
        };
    }

    return [frozenRect, contentRect];
}

/**
 * Горизонтальная геометрия слитого блока для текущей freeze-области. Отдаёт x/width
 * видимой части colspan (frozen для sticky-колонки, scrollable иначе), флаг
 * `horizontalOk` (рисуется ли блок в этой области) и `skipContents` (контент уже
 * отрисован во frozen-области — не дублировать). Для ячейки без colspan
 * (`span === undefined`) возвращает исходные drawX/colWidth.
 */
export function resolveHorizontalSpanArea(
    span: Item | undefined,
    drawX: number,
    colWidth: number,
    column: MappedGridColumn,
    allColumns: readonly MappedGridColumn[]
): { hx: number; hw: number; horizontalOk: boolean; skipContents: boolean } {
    let hx = drawX;
    let hw = colWidth;
    let horizontalOk = true;
    let skipContents = false;
    if (span !== undefined) {
        // y/height от getSpanBounds здесь не используются (нужны только x/width).
        const areas = getSpanBounds(span, drawX, 0, colWidth, 0, column, allColumns);
        const area = column.sticky ? areas[0] : areas[1];
        if (!column.sticky && areas[0] !== undefined) {
            skipContents = true;
        }
        if (area !== undefined) {
            hx = area.x;
            hw = area.width;
        } else {
            horizontalOk = false;
        }
    }
    return { hx, hw, horizontalOk, skipContents };
}

/**
 * Вертикальная геометрия rowspan-блока: верх (`y`) и полная высота диапазона
 * `[startRow, endRow]`, отсчитанные от текущей строки `currentRow` с её экранным
 * верхом `currentDrawY`. `startRow` может быть выше вьюпорта — тогда `y` уходит
 * в минус, канва клипует (scroll-safe).
 */
export function getRowSpanBounds(
    spanRows: readonly [startRow: number, endRow: number],
    currentRow: number,
    currentDrawY: number,
    getRowHeight: (row: number) => number
): { y: number; height: number } {
    const [startRow, endRow] = spanRows;
    let y = currentDrawY;
    for (let r = currentRow - 1; r >= startRow; r--) {
        y -= getRowHeight(r);
    }
    let height = 0;
    for (let r = startRow; r <= endRow; r++) {
        height += getRowHeight(r);
    }
    return { y, height };
}
