/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable unicorn/no-for-loop */
import {
    type Rectangle,
    CompactSelection,
    type CellBorderResolver,
    type BorderSideSpec,
} from "../data-grid-types.js";
import { CellSet } from "../cell-set.js";
import groupBy from "lodash/groupBy.js";
import { getStickyWidth, type MappedGridColumn, getFreezeTrailingHeight } from "./data-grid-lib.js";
import { mergeAndRealizeTheme, type FullTheme } from "../../../common/styles.js";
import { blendCache } from "../color-parser.js";
import { intersectRect } from "../../../common/math.js";
import { getSkipPoint, walkColumns, walkRowsInCol, getTotalGroupHeaderHeight } from "./data-grid-render.walk.js";
import { type GetRowThemeCallback } from "./data-grid-render.cells.js";
import { getHairlineWidth } from "./data-grid-render.hairline.js";

export function drawBlanks(
    ctx: CanvasRenderingContext2D,
    effectiveColumns: readonly MappedGridColumn[],
    allColumns: readonly MappedGridColumn[],
    width: number,
    height: number,
    totalHeaderHeight: number,
    translateX: number,
    translateY: number,
    cellYOffset: number,
    rows: number,
    getRowHeight: (row: number) => number,
    getRowTheme: GetRowThemeCallback | undefined,
    selectedRows: CompactSelection,
    disabledRows: CompactSelection,
    freezeTrailingRows: number,
    hasAppendRow: boolean,
    drawRegions: readonly Rectangle[],
    damage: CellSet | undefined,
    theme: FullTheme
): void {
    if (
        damage !== undefined ||
        effectiveColumns[effectiveColumns.length - 1] !== allColumns[effectiveColumns.length - 1]
    )
        return;

    const skipPoint = getSkipPoint(drawRegions);

    walkColumns(
        effectiveColumns,
        cellYOffset,
        translateX,
        translateY,
        totalHeaderHeight,
        (c, drawX, colDrawY, clipX, startRow) => {
            if (c !== effectiveColumns[effectiveColumns.length - 1]) return;
            drawX += c.width;
            const x = Math.max(drawX, clipX);
            if (x > width) return;
            ctx.save();
            ctx.beginPath();
            ctx.rect(x, totalHeaderHeight + 1, 10_000, height - totalHeaderHeight - 1);
            ctx.clip();

            walkRowsInCol(
                startRow,
                colDrawY,
                height,
                rows,
                getRowHeight,
                freezeTrailingRows,
                hasAppendRow,
                skipPoint,
                (drawY, row, rh, isSticky) => {
                    if (
                        !isSticky &&
                        drawRegions.length > 0 &&
                        !drawRegions.some(dr =>
                            intersectRect(drawX, drawY, 10_000, rh, dr.x, dr.y, dr.width, dr.height)
                        )
                    ) {
                        return;
                    }

                    const rowSelected = selectedRows.hasIndex(row);
                    const rowDisabled = disabledRows.hasIndex(row);

                    ctx.beginPath();

                    const rowTheme = getRowTheme?.(row);

                    const blankTheme = rowTheme === undefined ? theme : mergeAndRealizeTheme(theme, rowTheme);

                    if (blankTheme.bgCell !== theme.bgCell) {
                        ctx.fillStyle = blankTheme.bgCell;
                        ctx.fillRect(drawX, drawY, 10_000, rh);
                    }
                    if (rowDisabled) {
                        ctx.fillStyle = blankTheme.bgHeader;
                        ctx.fillRect(drawX, drawY, 10_000, rh);
                    }
                    if (rowSelected) {
                        ctx.fillStyle = blankTheme.accentLight;
                        ctx.fillRect(drawX, drawY, 10_000, rh);
                    }
                }
            );

            ctx.restore();
        }
    );
}

export function overdrawStickyBoundaries(
    ctx: CanvasRenderingContext2D,
    effectiveCols: readonly MappedGridColumn[],
    width: number,
    height: number,
    freezeTrailingRows: number,
    rows: number,
    verticalBorder: (col: number) => boolean,
    getRowHeight: (row: number) => number,
    theme: FullTheme,
    enableLowDprHairline: boolean = false
) {
    let drawFreezeBorder = false;
    for (const c of effectiveCols) {
        if (c.sticky) continue;
        drawFreezeBorder = verticalBorder(c.sourceIndex);
        break;
    }
    const hColor = theme.horizontalBorderColor ?? theme.borderColor;
    const vColor = theme.borderColor;
    const drawX = drawFreezeBorder ? getStickyWidth(effectiveCols) : 0;
    const previousLineWidth = ctx.lineWidth;

    // Sticky/frozen boundaries дорисовываются отдельным overlay-проходом поверх ячеек.
    // На DPR < 1 используем hairline width, чтобы эти границы не становились тоньше физического пикселя.
    ctx.lineWidth = getHairlineWidth(enableLowDprHairline);

    let vStroke: string | undefined;
    if (drawX !== 0) {
        vStroke = blendCache(vColor, theme.bgCell);
        ctx.beginPath();
        ctx.moveTo(drawX + 0.5, 0);
        ctx.lineTo(drawX + 0.5, height);
        ctx.strokeStyle = vStroke;
        ctx.stroke();
    }

    if (freezeTrailingRows > 0) {
        const hStroke = vColor === hColor && vStroke !== undefined ? vStroke : blendCache(hColor, theme.bgCell);
        const h = getFreezeTrailingHeight(rows, freezeTrailingRows, getRowHeight);
        ctx.beginPath();
        ctx.moveTo(0, height - h + 0.5);
        ctx.lineTo(width, height - h + 0.5);
        ctx.strokeStyle = hStroke;
        ctx.stroke();
    }

    ctx.lineWidth = previousLineWidth;
}

const getMinMaxXY = (drawRegions: Rectangle[] | undefined, width: number, height: number) => {
    let minX = 0;
    let maxX = width;
    let minY = 0;
    let maxY = height;

    if (drawRegions !== undefined && drawRegions.length > 0) {
        minX = Number.MAX_SAFE_INTEGER;
        minY = Number.MAX_SAFE_INTEGER;
        maxX = Number.MIN_SAFE_INTEGER;
        maxY = Number.MIN_SAFE_INTEGER;
        for (const r of drawRegions) {
            minX = Math.min(minX, r.x - 1);
            maxX = Math.max(maxX, r.x + r.width + 1);
            minY = Math.min(minY, r.y - 1);
            maxY = Math.max(maxY, r.y + r.height + 1);
        }
    }

    return { minX, maxX, minY, maxY };
};

export function drawExtraRowThemes(
    ctx: CanvasRenderingContext2D,
    effectiveCols: readonly MappedGridColumn[],
    cellYOffset: number,
    translateX: number,
    translateY: number,
    width: number,
    height: number,
    drawRegions: Rectangle[] | undefined,
    totalHeaderHeight: number,
    getRowHeight: (row: number) => number,
    getRowThemeOverride: GetRowThemeCallback | undefined,
    verticalBorder: (col: number) => boolean,
    freezeTrailingRows: number,
    rows: number,
    theme: FullTheme
) {
    const bgCell = theme.bgCell;

    const { minX, maxX, minY, maxY } = getMinMaxXY(drawRegions, width, height);

    const toDraw: { x: number; y: number; w: number; h: number; color: string }[] = [];

    const freezeY = height - getFreezeTrailingHeight(rows, freezeTrailingRows, getRowHeight);

    // row overflow
    let y = totalHeaderHeight;
    let row = cellYOffset;
    let extraRowsStartY = 0;
    while (y + translateY < freezeY) {
        const ty = y + translateY;
        const rh = getRowHeight(row);
        if (ty >= minY && ty <= maxY - 1) {
            const rowTheme = getRowThemeOverride?.(row);
            const rowThemeBgCell = rowTheme?.bgCell;
            const needDraw =
                rowThemeBgCell !== undefined && rowThemeBgCell !== bgCell && row >= rows - freezeTrailingRows;
            if (needDraw) {
                toDraw.push({
                    x: minX,
                    y: ty,
                    w: maxX - minX,
                    h: rh,
                    color: rowThemeBgCell,
                });
            }
        }

        y += rh;
        if (row < rows - freezeTrailingRows) extraRowsStartY = y;
        row++;
    }

    // column overflow
    let x = 0;
    const h = Math.min(freezeY, maxY) - extraRowsStartY;
    if (h > 0) {
        for (let index = 0; index < effectiveCols.length; index++) {
            const c = effectiveCols[index];
            if (c.width === 0) continue;
            const tx = c.sticky ? x : x + translateX;
            const colThemeBgCell = c.themeOverride?.bgCell;
            if (
                colThemeBgCell !== undefined &&
                colThemeBgCell !== bgCell &&
                tx >= minX &&
                tx <= maxX &&
                verticalBorder(index + 1)
            ) {
                toDraw.push({
                    x: tx,
                    y: extraRowsStartY,
                    w: c.width,
                    h,
                    color: colThemeBgCell,
                });
            }

            x += c.width;
        }
    }

    if (toDraw.length === 0) return;

    let color: string | undefined;
    ctx.beginPath();
    // render in reverse order because we computed and added the columns last, but they should actually be lower
    // priority than the rows.
    for (let i = toDraw.length - 1; i >= 0; i--) {
        const r = toDraw[i];
        if (color === undefined) {
            color = r.color;
        } else if (r.color !== color) {
            ctx.fillStyle = color;
            ctx.fill();
            ctx.beginPath();
            color = r.color;
        }
        ctx.rect(r.x, r.y, r.w, r.h);
    }
    if (color !== undefined) {
        ctx.fillStyle = color;
        ctx.fill();
    }
    ctx.beginPath();
}

interface ResolvedBorder {
    visible: boolean;
    color: string;
}

// Решает, рисовать ли одну сторону рамки и каким цветом. Если сторона не задана
// (undefined), берётся значение по умолчанию (от колонки, строки или темы).
function resolveBorderSide(
    spec: BorderSideSpec | undefined,
    defaultVisible: boolean,
    defaultColor: string
): ResolvedBorder {
    if (spec === undefined) return { visible: defaultVisible, color: defaultColor };
    if (spec === false) return { visible: false, color: defaultColor };
    if (spec === true) return { visible: true, color: defaultColor };
    return { visible: true, color: spec.color ?? defaultColor };
}

// Одну и ту же линию делят две соседние ячейки. Побеждает настройка «ранней»
// ячейки: для вертикальной линии это правая сторона левой ячейки, для
// горизонтальной нижняя сторона верхней ячейки.
function pickBorderSide(early: BorderSideSpec | undefined, late: BorderSideSpec | undefined) {
    return early !== undefined ? early : late;
}

// Рисует линии сетки. Считает только видимую область (сколько колонок и строк
// сейчас на экране), поэтому от общего размера таблицы скорость не зависит.
// Работает в двух режимах:
//   быстрый, когда getCellBorder не задан: сплошные линии, как в обычном glide;
//   поклеточный, когда getCellBorder задан: линия дробится по ячейкам, у каждой
//   можно включить или выключить свою сторону.
// lines are effectively drawn on the top left edge of a cell.
export function drawGridLines(
    ctx: CanvasRenderingContext2D,
    effectiveCols: readonly MappedGridColumn[],
    cellYOffset: number,
    translateX: number,
    translateY: number,
    width: number,
    height: number,
    drawRegions: Rectangle[] | undefined,
    spans: Rectangle[] | undefined,
    groupHeaderHeight: number | number[],
    totalHeaderHeight: number,
    getRowHeight: (row: number) => number,
    getRowThemeOverride: GetRowThemeCallback | undefined,
    verticalBorder: (col: number) => boolean,
    freezeTrailingRows: number,
    rows: number,
    theme: FullTheme,
    verticalOnly: boolean = false,
    enableLowDprHairline: boolean = false,
    horizontalBorder?: (row: number) => boolean,
    getCellBorder?: CellBorderResolver
) {
    const previousLineWidth = ctx.lineWidth;

    // drawGridLines рисует основные вертикальные и горизонтальные линии сетки.
    // Low-DPR hairline делает их стабильными при zoom ниже 100%, не меняя геометрию самих ячеек.
    ctx.lineWidth = getHairlineWidth(enableLowDprHairline);

    // Объединённые ячейки (spans): вырезаем их нутро из области рисования, чтобы
    // линии не попадали внутрь слитого блока. Остаётся только его внешний контур.
    if (spans !== undefined) {
        ctx.beginPath();
        ctx.save();
        ctx.rect(0, 0, width, height);
        for (const span of spans) {
            ctx.rect(span.x + 1, span.y + 1, span.width - 1, span.height - 1);
        }
        ctx.clip("evenodd");
    }
    const hColor = theme.horizontalBorderColor ?? theme.borderColor;
    const vColor = theme.borderColor;

    const { minX, maxX, minY, maxY } = getMinMaxXY(drawRegions, width, height);

    // Сюда складываем все отрезки линий, которые надо нарисовать в этом кадре.
    // Рисуем их не по одному, а в самом конце: группируем по цвету и на каждый
    // цвет делаем один общий проход кистью (см. groupBy внизу) - так быстрее и
    // стыки не двоятся.
    const toDraw: { x1: number; y1: number; x2: number; y2: number; color: string }[] = [];

    ctx.beginPath();

    const bodyTop = Math.max(getTotalGroupHeaderHeight(groupHeaderHeight), minY);
    const bodyBottom = Math.min(height, maxY);

    // Закреплённые снизу строки (freeze): их верхние линии рисуем всегда.
    let freezeY = height + 0.5;
    for (let i = rows - freezeTrailingRows; i < rows; i++) {
        const rh = getRowHeight(i);
        freezeY -= rh;
        toDraw.push({ x1: minX, y1: freezeY, x2: maxX, y2: freezeY, color: hColor });
    }

    if (getCellBorder === undefined) {
        // Быстрый путь: сплошные линии, как в обычном glide. Добавлены только две
        // возможности: выключить горизонтали по строке (horizontalBorder) и задать
        // цвет вертикали у колонки (через её тему).
        let x = 0.5;
        for (let index = 0; index < effectiveCols.length; index++) {
            const c = effectiveCols[index];
            if (c.width === 0) continue;
            x += c.width;
            const tx = c.sticky ? x : x + translateX;
            if (tx >= minX && tx <= maxX && verticalBorder(index + 1)) {
                toDraw.push({
                    x1: tx,
                    y1: bodyTop,
                    x2: tx,
                    y2: bodyBottom,
                    color: c.themeOverride?.borderColor ?? vColor,
                });
            }
        }

        if (verticalOnly !== true) {
            let y = totalHeaderHeight + 0.5;
            let row = cellYOffset;
            const target = freezeY;
            while (y + translateY < target) {
                const ty = y + translateY;
                if (ty >= minY && ty <= maxY - 1 && (horizontalBorder?.(row) ?? true)) {
                    const rowTheme = getRowThemeOverride?.(row);
                    toDraw.push({
                        x1: minX,
                        y1: ty,
                        x2: maxX,
                        y2: ty,
                        color: rowTheme?.horizontalBorderColor ?? rowTheme?.borderColor ?? hColor,
                    });
                }

                y += getRowHeight(row);
                row++;
            }
        }
    } else {
        // Поклеточный путь: линия делится на кусочки по ячейкам, и для каждого
        // кусочка отдельно решается, рисовать ли его и каким цветом. Приоритет:
        // настройка ячейки сильнее колонки и строки, те сильнее темы. Включается
        // только когда задан getCellBorder.

        // Заранее считаем положение видимых колонок: левый и правый край по x и
        // два индекса (source - в данных, effIndex - среди видимых на экране).
        const cols: { effIndex: number; source: number; xLeft: number; xRight: number }[] = [];
        {
            let x = 0.5;
            for (let index = 0; index < effectiveCols.length; index++) {
                const c = effectiveCols[index];
                if (c.width === 0) continue;
                x += c.width;
                const xRight = c.sticky ? x : x + translateX;
                cols.push({ effIndex: index, source: c.sourceIndex, xLeft: xRight - c.width, xRight });
            }
        }

        // Заранее считаем видимые строки прокручиваемой области (без закреплённого
        // снизу хвоста): номер строки, её верх по y и высоту.
        const rowsGeom: { row: number; ty: number; rh: number }[] = [];
        {
            let y = totalHeaderHeight + 0.5;
            let row = cellYOffset;
            while (y + translateY < freezeY) {
                const rh = getRowHeight(row);
                rowsGeom.push({ row, ty: y + translateY, rh });
                y += rh;
                row++;
            }
        }

        // Вертикальные линии. Внешний цикл по видимым колонкам, внутренний по
        // видимым строкам, то есть проходов примерно «колонок на экране умножить
        // на строк на экране» (обычно пара тысяч), а не по всей таблице. На правой
        // границе каждой колонки рисуем отрезок для каждой строки.
        for (let k = 0; k < cols.length; k++) {
            const left = cols[k];
            const tx = left.xRight;
            if (tx < minX || tx > maxX) continue;
            const rightSource = cols[k + 1]?.source;
            const columnDefaultVisible = verticalBorder(left.effIndex + 1);
            const columnDefaultColor = effectiveCols[left.effIndex].themeOverride?.borderColor ?? vColor;

            for (const rg of rowsGeom) {
                const spec = pickBorderSide(
                    getCellBorder(left.source, rg.row)?.right,
                    rightSource !== undefined ? getCellBorder(rightSource, rg.row)?.left : undefined
                );
                const resolved = resolveBorderSide(spec, columnDefaultVisible, columnDefaultColor);
                if (!resolved.visible) continue;
                const y1 = Math.max(bodyTop, rg.ty);
                const y2 = Math.min(freezeY, rg.ty + rg.rh);
                if (y2 <= y1) continue;
                toDraw.push({ x1: tx, y1, x2: tx, y2, color: resolved.color });
            }

            // У закреплённого снизу хвоста рисуем линию по настройке колонки
            // (поклеточная настройка там не поддержана).
            if (columnDefaultVisible && freezeY < bodyBottom) {
                toDraw.push({
                    x1: tx,
                    y1: Math.max(bodyTop, freezeY),
                    x2: tx,
                    y2: bodyBottom,
                    color: columnDefaultColor,
                });
            }
        }

        // Горизонтальные линии. Здесь наоборот: внешний цикл по видимым строкам,
        // внутренний по видимым колонкам (тот же порядок величины проходов). На
        // верхней границе каждой строки рисуем отрезок для каждой колонки.
        if (verticalOnly !== true) {
            for (const rg of rowsGeom) {
                const ty = rg.ty;
                if (ty < minY || ty > maxY - 1) continue;
                const rowTheme = getRowThemeOverride?.(rg.row);
                const rowDefaultVisible = horizontalBorder?.(rg.row) ?? true;
                const rowDefaultColor =
                    rowTheme?.horizontalBorderColor ?? rowTheme?.borderColor ?? hColor;

                for (const col of cols) {
                    const spec = pickBorderSide(
                        getCellBorder(col.source, rg.row - 1)?.bottom,
                        getCellBorder(col.source, rg.row)?.top
                    );
                    const resolved = resolveBorderSide(spec, rowDefaultVisible, rowDefaultColor);
                    if (!resolved.visible) continue;
                    const x1 = Math.max(minX, col.xLeft);
                    const x2 = Math.min(maxX, col.xRight);
                    if (x2 <= x1) continue;
                    toDraw.push({ x1, y1: ty, x2, y2: ty, color: resolved.color });
                }
            }
        }
    }

    // Все накопленные отрезки группируем по цвету и на каждый цвет делаем один
    // проход кистью: задаём цвет, прокладываем все линии этого цвета и рисуем их
    // разом. Так вместо сотен отдельных штрихов получается несколько (по числу
    // цветов), и стыки не двоятся.
    const groups = groupBy(toDraw, line => line.color);
    for (const g of Object.keys(groups)) {
        ctx.strokeStyle = g;
        for (const line of groups[g]) {
            ctx.moveTo(line.x1, line.y1);
            ctx.lineTo(line.x2, line.y2);
        }
        ctx.stroke();
        ctx.beginPath();
    }

    // Снимаем вырез по объединённым ячейкам, который поставили в начале.
    if (spans !== undefined) {
        ctx.restore();
    }

    ctx.lineWidth = previousLineWidth;
}
