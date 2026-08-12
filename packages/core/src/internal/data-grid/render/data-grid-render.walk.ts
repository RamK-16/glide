import { type Item, type Rectangle } from "../data-grid-types.js";
import { type MappedGridColumn, isGroupEqual } from "./data-grid-lib.js";

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

export function walkRowsInCol(
    startRow: number,
    drawY: number,
    height: number,
    rows: number,
    getRowHeight: (row: number) => number,
    freezeTrailingRows: number,
    hasAppendRow: boolean,
    skipToY: number | undefined,
    cb: WalkRowsCallback
): void {
    skipToY = skipToY ?? drawY;
    let y = drawY;
    let row = startRow;
    const rowEnd = rows - freezeTrailingRows;
    let didBreak = false;
    while (y < height && row < rowEnd) {
        const rh = getRowHeight(row);
        if (y + rh > skipToY && cb(y, row, rh, false, hasAppendRow && row === rows - 1) === true) {
            didBreak = true;
            break;
        }
        y += rh;
        row++;
    }

    if (didBreak) return;

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

export function walkColumns(
    effectiveCols: readonly MappedGridColumn[],
    cellYOffset: number,
    translateX: number,
    translateY: number,
    totalHeaderHeight: number,
    cb: WalkColsCallback
): void {
    let x = 0;
    let clipX = 0; // this tracks the total width of sticky cols
    const drawY = totalHeaderHeight + translateY;
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
    level: number
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
    cb: WalkGroupsCallback
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
            effectiveCols[end].sticky === effectiveCols[index].sticky
        ) {
            const endCol = effectiveCols[end];
            boxWidth += endCol.width;
            end++;
            index++;
            if (endCol.sticky) {
                clipX += endCol.width;
            }
        }

        const t = startCol.sticky ? 0 : translateX;
        const localX = x + t;
        const delta = startCol.sticky ? 0 : Math.max(0, clipX - localX);
        const w = Math.min(boxWidth - delta, width - (localX + delta));
        const groupName = getGroupAtLevel(startCol.group, level);
        cb(
            [startCol.sourceIndex, effectiveCols[end - 1].sourceIndex],
            groupName,
            localX + delta,
            0,
            w,
            groupHeaderHeight,
            level
        );

        x += boxWidth;
    }
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
        walkGroups(effectiveCols, 0, 0, 0, level, (span, groupName) => {
            if (groupName === "" || !isGroupSpanned(groupName)) return;
            for (let i = span[0]; i <= span[1]; i++) {
                if (getGroupAtLevel(effectiveCols[i]?.group, level + 1) !== "") return;
            }
            regions.push({ level, startCol: span[0], endCol: span[1] });
        });
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
