import { intersectRect, pointInRect } from "../../../common/math.js";
import { mergeAndRealizeTheme, type FullTheme } from "../../../common/styles.js";
import { direction } from "../../../common/utils.js";
import type { HoverValues } from "../animation-manager.js";
import type { CellSet } from "../cell-set.js";
import { withAlpha } from "../color-parser.js";
import type { SpriteManager, SpriteVariant } from "../data-grid-sprites.js";
import {
    GridColumnMenuIcon,
    type DrawHeaderCallback,
    type DrawGroupHeaderCallback,
    type GridSelection,
    type Rectangle,
} from "../data-grid-types.js";
import {
    drawMenuDots,
    drawSpanAlignedText,
    getMeasuredTextCache,
    getMiddleCenterBias,
    measureTextCached,
    resolveSpanAlignment,
    roundedPoly,
    type MappedGridColumn,
    type ResolvedSpanAlignment,
} from "./data-grid-lib.js";
import { getHairlineWidth } from "./data-grid-render.hairline.js";
import type { GroupDetails, GroupDetailsCallback } from "./data-grid-render.cells.js";
import {
    walkColumns,
    walkGroups,
    getGroupLevels,
    getSpannedGroupRegions,
    getTotalGroupHeaderHeight,
} from "./data-grid-render.walk.js";
import { drawCheckbox } from "./draw-checkbox.js";
import type { DragAndDropState, HoverInfo } from "./draw-grid-arg.js";

export function drawGridHeaders(
    ctx: CanvasRenderingContext2D,
    effectiveCols: readonly MappedGridColumn[],
    enableGroups: boolean,
    hovered: HoverInfo | undefined,
    width: number,
    translateX: number,
    headerHeight: number,
    groupHeaderHeight: number | number[],
    dragAndDropState: DragAndDropState | undefined,
    isResizing: boolean,
    selection: GridSelection,
    outerTheme: FullTheme,
    spriteManager: SpriteManager,
    hoverValues: HoverValues,
    verticalBorder: (col: number) => boolean,
    getGroupDetails: GroupDetailsCallback,
    damage: CellSet | undefined,
    drawHeaderCallback: DrawHeaderCallback | undefined,
    drawGroupHeaderCallback: DrawGroupHeaderCallback | undefined,
    touchMode: boolean,
    enableLowDprHairline: boolean
) {
    const totalGroupHeaderHeight = getTotalGroupHeaderHeight(groupHeaderHeight, effectiveCols);
    const totalHeaderHeight = headerHeight + totalGroupHeaderHeight;
    if (totalHeaderHeight <= 0) return;
    const levels = getGroupLevels(effectiveCols);

    ctx.fillStyle = outerTheme.bgHeader;
    ctx.fillRect(0, 0, width, totalHeaderHeight);

    const hCol = hovered?.[0]?.[0];
    const hRow = hovered?.[0]?.[1];
    const hPosX = hovered?.[1]?.[0];
    const hPosY = hovered?.[1]?.[1];

    const font = outerTheme.headerFontFull;
    // Assinging the context font too much can be expensive, it can be worth it to minimze this
    ctx.font = font;
    walkColumns(effectiveCols, 0, translateX, 0, totalHeaderHeight, (c, x, _y, clipX) => {
        // Слитая колонка занимает и строку колонки (-1), и групп-ряды (-2…). Считаем её
        // задетой, если задет ЛЮБОЙ её ряд, — иначе групп-полоса не перерисуется при hover.
        if (damage !== undefined) {
            const spannedCol = enableGroups && c.spanGroupHeader === true;
            const touched = spannedCol
                ? damage.hasItemInRectangle({ x: c.sourceIndex, y: -1 - levels, width: 1, height: levels + 1 })
                : damage.has([c.sourceIndex, -1]);
            if (!touched) return;
        }
        const diff = Math.max(0, clipX - x);
        // spanGroupHeader: колонка рисуется как одна слитная ячейка на всю высоту
        // шапки (групповые строки + строка колонки), контент центрируется по ней.
        const spanFull = enableGroups && c.spanGroupHeader === true;
        const clipY = spanFull ? 0 : totalGroupHeaderHeight;
        const drawH = spanFull ? totalHeaderHeight : headerHeight;
        ctx.save();
        ctx.beginPath();
        ctx.rect(x + diff, clipY, c.width - diff, drawH);
        ctx.clip();

        const groupName = Array.isArray(c.group) ? (c.group[0] ?? "") : (c.group ?? "");
        const groupTheme = getGroupDetails(groupName).overrideTheme;
        const theme =
            c.themeOverride === undefined && groupTheme === undefined
                ? outerTheme
                : mergeAndRealizeTheme(outerTheme, groupTheme, c.themeOverride);

        if (theme.bgHeader !== outerTheme.bgHeader) {
            ctx.fillStyle = theme.bgHeader;
            ctx.fill();
        }

        if (theme !== outerTheme) {
            ctx.font = theme.headerFontFull;
        }
        const selected = selection.columns.hasIndex(c.sourceIndex);
        const noHover = dragAndDropState !== undefined || isResizing || c.headerRowMarkerDisabled === true;
        const hoveredBoolean = !noHover && hRow === -1 && hCol === c.sourceIndex;
        const hover = noHover
            ? 0
            : (hoverValues.find(s => s.item[0] === c.sourceIndex && s.item[1] === -1)?.hoverAmount ?? 0);

        const hasSelectedCell = selection?.current !== undefined && selection.current.cell[0] === c.sourceIndex;

        const bgFillStyle = selected ? theme.accentColor : hasSelectedCell ? theme.bgHeaderHasFocus : theme.bgHeader;

        const y = spanFull ? 0 : enableGroups ? totalGroupHeaderHeight : 0;
        const isFirstSelected = selected && selection.columns.first() === c.sourceIndex;
        const xOffset = c.sourceIndex === 0 ? 0 : 1;

        if (selected) {
            ctx.fillStyle = bgFillStyle;
            ctx.fillRect(x + xOffset, y, c.width - xOffset, drawH);
            if (isFirstSelected) {
                ctx.fillRect(x, y, 1, drawH);
            }
        } else if (hasSelectedCell || hover > 0) {
            ctx.beginPath();
            ctx.rect(x + xOffset, y, c.width - xOffset, drawH);
            if (hasSelectedCell) {
                ctx.fillStyle = theme.bgHeaderHasFocus;
                ctx.fill();
            }
            if (hover > 0) {
                ctx.globalAlpha = hover;
                ctx.fillStyle = theme.bgHeaderHovered;
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }

        drawHeader(
            ctx,
            x,
            y,
            c.width,
            drawH,
            c,
            selected,
            theme,
            hoveredBoolean,
            hoveredBoolean ? hPosX : undefined,
            hoveredBoolean ? hPosY : undefined,
            hasSelectedCell,
            hover,
            spriteManager,
            drawHeaderCallback,
            touchMode,
            // Выравнивание считаем только для объединённой колонки (по умолчанию — слева).
            spanFull ? resolveSpanAlignment(c.spanGroupHeaderAlign, "left") : undefined
        );
        ctx.restore();

        // Слитая колонка: вертикальная граница слева ТОЛЬКО по групп-полосе (0 →
        // totalGroupHeaderHeight). Штатный lines-рендерер (drawGridLines) вертикали в
        // групп-полосе не рисует (он стартует с y1 = totalGroupHeaderHeight), поэтому
        // без этой линии две соседние слитые колонки «слиплись» бы сверху. А вот header-
        // полосу drawGridLines уже закрывает сам — если тянуть эту линию на всю высоту,
        // в нижней полосе граница красится ДВАЖДЫ, и т.к. borderColor полупрозрачный
        // (alpha 0.16), нижняя половина разделителя выходит заметно жирнее верхней.
        // Обе линии гейтятся одним verticalBorder(sourceIndex) — поведение консистентно.
        if (spanFull && x !== 0 && verticalBorder(c.sourceIndex)) {
            ctx.beginPath();
            ctx.moveTo(x + 0.5, 0);
            ctx.lineTo(x + 0.5, totalGroupHeaderHeight);
            ctx.strokeStyle = outerTheme.borderColor;
            const previousLineWidth = ctx.lineWidth;
            ctx.lineWidth = getHairlineWidth(enableLowDprHairline);
            ctx.stroke();
            ctx.lineWidth = previousLineWidth;
        }
    });

    if (enableGroups) {
        drawGroups(
            ctx,
            effectiveCols,
            width,
            translateX,
            groupHeaderHeight,
            hovered,
            outerTheme,
            spriteManager,
            hoverValues,
            verticalBorder,
            getGroupDetails,
            damage,
            selection,
            drawGroupHeaderCallback,
            enableLowDprHairline
        );
    }
}

/**
 * Разбивает горизонтальную линию [0, width] на отрезки, ВЫРЕЗАЯ переданные
 * интервалы `gaps` (x-диапазоны слитых spanGroupHeader-колонок). Возвращает
 * отрезки [x1, x2] для отрисовки — над слитыми колонками межуровневой линии нет,
 * чтобы шапка читалась как единая ячейка (без шва).
 *
 * Чистая функция (без canvas) — вынесена для юнит-тестов: сегментация самая
 * рискованная часть (скролл/sticky дают несортированные и наезжающие интервалы,
 * а также интервалы вне [0, width]).
 */
export function segmentSpanGroupHeaderLine(
    width: number,
    gaps: readonly (readonly [number, number])[]
): [number, number][] {
    const sorted = [...gaps].sort((a, b) => a[0] - b[0]);
    const segments: [number, number][] = [];
    let cursor = 0;
    for (const [start, end] of sorted) {
        if (start > cursor) {
            segments.push([cursor, Math.min(start, width)]);
        }
        cursor = Math.max(cursor, end);
    }
    if (cursor < width) {
        segments.push([cursor, width]);
    }
    return segments;
}

/**
 * Слитая (rowspan) групп-ячейка: помеченная `span` группа, «терминальная» на своём
 * уровне (ни у одной её колонки нет более глубокой подгруппы), занимает свои пустые
 * нижние групп-уровни как ОДНА ячейка высотой `mergedHeight` — от уровня `level` до
 * последнего групп-уровня. Строку колонок НЕ покрывает.
 */
interface SpannedGroupRegion {
    readonly level: number;
    readonly startCol: number;
    readonly endCol: number;
    readonly x: number;
    readonly w: number;
    readonly mergedHeight: number;
}

export function drawGroups(
    ctx: CanvasRenderingContext2D,
    effectiveCols: readonly MappedGridColumn[],
    width: number,
    translateX: number,
    groupHeaderHeight: number | number[],
    hovered: HoverInfo | undefined,
    theme: FullTheme,
    spriteManager: SpriteManager,
    _hoverValues: HoverValues,
    verticalBorder: (col: number) => boolean,
    getGroupDetails: GroupDetailsCallback,
    damage: CellSet | undefined,
    selection: GridSelection | undefined,
    drawGroupHeaderCallback: DrawGroupHeaderCallback | undefined,
    enableLowDprHairline: boolean
) {
    const levels = getGroupLevels(effectiveCols);
    if (levels === 0) return;

    const heights = Array.isArray(groupHeaderHeight)
        ? groupHeaderHeight
        : Array.from({ length: levels }, () => groupHeaderHeight);

    let currentY = 0;

    // x-диапазоны колонок со spanGroupHeader — над ними межуровневые горизонтальные
    // линии не рисуем, чтобы слитая ячейка читалась как единая (без шва).
    const spannedRanges: [number, number][] = [];
    walkColumns(effectiveCols, 0, translateX, 0, 0, (c, x, _y, clipX) => {
        if (c.spanGroupHeader === true) {
            spannedRanges.push([Math.max(x, clipX), x + c.width]);
        }
    });

    // Слитые ГРУППЫ (rowspan): логические регионы берём из общего хелпера (единый
    // источник с hit-test/bounds/clip), затем дополняем геометрией (x/w) и mergedHeight.
    const logicalRegions = getSpannedGroupRegions(
        effectiveCols,
        levels,
        groupName => getGroupDetails(groupName).span === true
    );
    const spannedGroupRegions: SpannedGroupRegion[] = [];
    if (logicalRegions.length > 0) {
        for (let level = 0; level < levels - 1; level++) {
            walkGroups(effectiveCols, width, translateX, groupHeaderHeight, level, (span, _groupName, x, _y, w) => {
                if (!logicalRegions.some(r => r.level === level && r.startCol === span[0])) return;
                let mergedHeight = 0;
                for (let k = level; k < levels; k++) mergedHeight += heights[k] ?? heights[0] ?? 0;
                spannedGroupRegions.push({ level, startCol: span[0], endCol: span[1], x, w, mergedHeight });
            });
        }
    }

    // Межуровневую линию режем над слитыми листьями (полная высота) и над слитыми
    // группами — но у групп ТОЛЬКО внутренние линии (между групп-рядами). Нижнюю
    // границу групп-шапки и строки колонок (последний уровень, level === levels-1)
    // НЕ режем: у слитой группы должно быть дно.
    const strokeHBorderSegmented = (lineY: number, level: number) => {
        const gaps: [number, number][] = [...spannedRanges];
        if (level < levels - 1) {
            for (const r of spannedGroupRegions) {
                if (r.level <= level) gaps.push([r.x, r.x + r.w]);
            }
        }
        ctx.strokeStyle = theme.borderColor;
        const previousLineWidth = ctx.lineWidth;
        ctx.lineWidth = getHairlineWidth(enableLowDprHairline);
        ctx.beginPath();
        for (const [x1, x2] of segmentSpanGroupHeaderLine(width, gaps)) {
            ctx.moveTo(x1, lineY);
            ctx.lineTo(x2, lineY);
        }
        ctx.stroke();
        ctx.lineWidth = previousLineWidth;
    };

    for (let level = 0; level < levels; level++) {
        const levelHeight = heights[level] ?? heights[0] ?? 0;
        if (levelHeight <= 0) continue;
        drawGroupLevel(
            ctx,
            effectiveCols,
            width,
            translateX,
            levelHeight,
            currentY,
            level,
            hovered,
            theme,
            spriteManager,
            _hoverValues,
            verticalBorder,
            getGroupDetails,
            damage,
            levels,
            spannedGroupRegions,
            selection,
            drawGroupHeaderCallback,
            enableLowDprHairline
        );
        currentY += levelHeight;

        // Draw horizontal border between levels — сегментами, минуя слитые колонки и группы
        strokeHBorderSegmented(currentY + 0.5, level);
    }
}

/**
 * Цвет фона групп-ячейки по её состоянию: выделение → accent, ховер → bgGroupHeaderHovered,
 * иначе → bgGroupHeader. Единый источник для заливки фона (drawGroupLevel) и градиента
 * action-иконок (drawGroupHeaderInner).
 */
function resolveGroupHeaderFillColor(
    isSelected: boolean,
    isHovered: boolean,
    groupTheme: FullTheme,
    theme: FullTheme
): string {
    if (isSelected) return groupTheme.accentColor ?? theme.accentColor;
    if (isHovered) return groupTheme.bgGroupHeaderHovered ?? groupTheme.bgHeaderHovered;
    return groupTheme.bgGroupHeader ?? groupTheme.bgHeader;
}

function drawGroupHeaderInner(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    groupName: string,
    level: number,
    span: readonly [number, number],
    isSelected: boolean,
    isHovered: boolean,
    // Фон (и его hover-fade) теперь заливает drawGroupLevel до контент-колбэка —
    // здесь hoverAmount больше не нужен, но параметр сохраняем для совместимости вызовов.
    _hoverAmount: number,
    theme: FullTheme,
    groupTheme: FullTheme,
    group: GroupDetails,
    spriteManager: SpriteManager,
    hovered: HoverInfo | undefined,
    verticalBorder: (col: number) => boolean,
    enableLowDprHairline: boolean,
    // Есть только у объединённой группы — иначе рисуем как раньше.
    spanAlign?: ResolvedSpanAlignment
) {
    // Горизонтальный отступ группового заголовка берём из темы — как у заголовков
    // колонок (computeHeaderLayout) и как у слитой группы в ветке ниже. Иначе на
    // размерах, где cellHorizontalPadding !== 8 (small=4 / big=16), группа
    // рассинхронивается с колонками по левому отступу.
    const xPad = theme.cellHorizontalPadding;
    // Фон групп-ячейки заливает drawGroupLevel ДО контент-колбэка — единым путём для
    // дефолтной и кастомной отрисовки (кастомный drawGroupHeader идёт мимо этой функции).
    // Здесь fillColor нужен только для градиента action-иконок ниже.
    const fillColor = resolveGroupHeaderFillColor(isSelected, isHovered, groupTheme, theme);

    ctx.fillStyle = groupTheme.textGroupHeader ?? groupTheme.textHeader;
    if (groupName !== "") {
        let drawX = x;
        if (group?.icon !== undefined) {
            // Размер иконки группы и сдвиг под текст берём из темы — как у заголовков
            // колонок (computeHeaderLayout): иконка headerIconSize, сдвиг ceil(×1.3).
            // Раньше были хардкоды 20 и 26 (= ceil(20 × 1.3)).
            const headerIconSize = theme.headerIconSize;
            spriteManager.drawSprite(
                group.icon,
                "normal",
                ctx,
                drawX + xPad,
                y + (height - headerIconSize) / 2,
                headerIconSize,
                groupTheme
            );
            drawX += Math.ceil(headerIconSize * 1.3);
        }
        if (group?.name !== undefined && group.name !== "") {
            const latestGroupName = groupName ?? group.name;
            const bias = getMiddleCenterBias(ctx, theme.headerFontFull);
            // Для RTL-заголовка выравнивание пока не поддержано — рисуем как раньше.
            const effAlign =
                spanAlign !== undefined && direction(latestGroupName) !== "rtl" ? spanAlign : undefined;
            if (effAlign === undefined) {
                // Обычная группа (или RTL): как раньше — слева, по центру по высоте.
                ctx.fillText(latestGroupName, drawX + xPad, y + height / 2 + bias);
            } else {
                // Объединённая группа: выравниваем текст в пределах ячейки (после иконки). Меню у групп нет.
                const padX = theme.cellHorizontalPadding;
                drawSpanAlignedText(
                    ctx,
                    latestGroupName,
                    drawX + padX,
                    x + width - padX,
                    y,
                    height,
                    effAlign,
                    bias,
                    theme.cellVerticalPadding
                );
            }
        }

        if (group?.actions !== undefined && isHovered) {
            const actionBoxes = getActionBoundsForGroup({ x, y, width, height }, group.actions);

            ctx.beginPath();
            const fadeStartX = actionBoxes[0].x - 10;
            const fadeWidth = x + width - fadeStartX;
            ctx.rect(fadeStartX, y, fadeWidth, height);
            const grad = ctx.createLinearGradient(fadeStartX, 0, fadeStartX + fadeWidth, 0);
            const trans = withAlpha(fillColor, 0);
            grad.addColorStop(0, trans);
            grad.addColorStop(10 / fadeWidth, fillColor);
            grad.addColorStop(1, fillColor);
            ctx.fillStyle = grad;

            ctx.fill();

            ctx.globalAlpha = 0.6;

            // eslint-disable-next-line prefer-const
            const [mouseX, mouseY] = hovered?.[1] ?? [-1, -1];
            for (let i = 0; i < group.actions.length; i++) {
                const action = group.actions[i];
                const box = actionBoxes[i];
                const actionHovered = pointInRect(box, mouseX + x, mouseY + y);
                if (actionHovered) {
                    ctx.globalAlpha = 1;
                }
                spriteManager.drawSprite(
                    action.icon,
                    "normal",
                    ctx,
                    box.x + box.width / 2 - 10,
                    box.y + box.height / 2 - 10,
                    20,
                    groupTheme
                );
                if (actionHovered) {
                    ctx.globalAlpha = 0.6;
                }
            }

            ctx.globalAlpha = 1;
        }
    }

    if (x !== 0 && verticalBorder(span[0])) {
        const preventOverlaysOffset = level === 0 ? 0 : 1; // prevent overlays of vert and horiz borders
        ctx.beginPath();
        ctx.moveTo(x + 0.5, y + preventOverlaysOffset);
        ctx.lineTo(x + 0.5, y + height);
        ctx.strokeStyle = theme.borderColor;
        const previousLineWidth = ctx.lineWidth;
        ctx.lineWidth = getHairlineWidth(enableLowDprHairline);
        ctx.stroke();
        ctx.lineWidth = previousLineWidth;
    }
}

function drawGroupLevel(
    ctx: CanvasRenderingContext2D,
    effectiveCols: readonly MappedGridColumn[],
    width: number,
    translateX: number,
    groupHeaderHeight: number,
    yOffset: number,
    level: number,
    hovered: HoverInfo | undefined,
    theme: FullTheme,
    spriteManager: SpriteManager,
    _hoverValues: HoverValues,
    verticalBorder: (col: number) => boolean,
    getGroupDetails: GroupDetailsCallback,
    damage: CellSet | undefined,
    levels: number,
    spannedGroupRegions: readonly SpannedGroupRegion[],
    selection?: GridSelection,
    drawGroupHeaderCallback?: DrawGroupHeaderCallback,
    enableLowDprHairline: boolean = false
) {
    const [hCol, hRow] = hovered?.[0] ?? [];
    const hPosX = hovered?.[1]?.[0];
    const hPosY = hovered?.[1]?.[1];
    // hRow: -2 is group header, we use -2 - level for multi-level
    const targetRow = -2 - level;
    const selectionRow = selection?.current?.cell[1];
    const selectionLevel = selectionRow !== undefined && selectionRow <= -2 ? -2 - selectionRow : undefined;
    const selectionSpan =
        selection?.current === undefined || selectionLevel === undefined
            ? undefined
            : ([selection.current.range.x, selection.current.range.x + selection.current.range.width - 1] as const);
    let finalX = 0;
    walkGroups(effectiveCols, width, translateX, groupHeaderHeight, level, (span, groupName, x, y, w, h, _level, spanMinCol, spanMaxCol, spanAllSpanned) => {
        if (
            damage !== undefined &&
            // Границы берём из min/max по членам спана, а не из концов colSpan:
            // при DnD-реордере span[0] может быть > span[1] и ширина схлопнется в 0.
            !damage.hasItemInRectangle({
                x: spanMinCol,
                y: targetRow,
                width: spanMaxCol - spanMinCol + 1,
                height: 1,
            })
        )
            return;
        // Слитые колонки (spanGroupHeader) свою групп-ячейку не рисуют — над ними уже
        // нарисован header на всю высоту (drawGridHeaders). Пропускаем span целиком,
        // если он состоит только из таких колонок (finalX двигаем для правой границы).
        // ВАЖНО: ровно этот же allSpanned-скип обязан быть в clipHeaderDamage (групп-цикл),
        // иначе клип затрёт групп-ряд слитой колонки, а перерисовать его будет некому.
        if (spanAllSpanned) {
            finalX = x + w;
            return;
        }
        // Колонки, покрытые слитой группой сверху (её merged-ячейка уже отрисована на
        // верхнем уровне), свою пустую ячейку не рисуют — иначе перекрыли бы merged.
        if (spannedGroupRegions.some(r => r.level < level && r.startCol <= span[0] && r.endCol >= span[1])) {
            finalX = x + w;
            return;
        }
        // Если группа стартует слитый регион на этом уровне — рисуем на всю его высоту.
        const spanRegion = spannedGroupRegions.find(r => r.level === level && r.startCol === span[0]);
        const cellH = spanRegion?.mergedHeight ?? h;
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y + yOffset, w, cellH);
        ctx.clip();

        const group = getGroupDetails(groupName);
        const groupTheme =
            group?.overrideTheme === undefined ? theme : mergeAndRealizeTheme(theme, group.overrideTheme);
        // Выравнивание считаем только для объединённой группы (по умолчанию — по центру).
        const groupSpanAlign =
            spanRegion !== undefined ? resolveSpanAlignment(group.spanAlign, "center") : undefined;
        // Check if all columns in this group span are selected
        let isSelected = false;
        if (selection !== undefined) {
            const selectionMatchesLevel = selectionRow !== undefined && targetRow <= selectionRow;
            const spanInSelection =
                selectionSpan !== undefined && span[0] >= selectionSpan[0] && span[1] <= selectionSpan[1];
            isSelected = selectionMatchesLevel && spanInSelection && selection.columns.hasAll([span[0], span[1] + 1]);
        }
        const isHovered = hRow === targetRow && hCol !== undefined && hCol >= span[0] && hCol <= span[1];
        // Hover-amount — СУММА по колонкам спана (клампим в 1), а не значение одной hCol.
        // При пересечении границы подколонок внутри группы старая колонка гаснет, а новая
        // разгоняется синхронно (их суммы ≈ 1 в любой момент), поэтому заливка держится
        // без провала — нет мигания. При входе/выходе анимируется одна колонка → сумма =
        // штатный 0↔1 (обычная hover-анимация сохраняется).
        const hoverAmount =
            isSelected || !isHovered
                ? 0
                : Math.min(
                      1,
                      _hoverValues.reduce(
                          (sum, s) =>
                              s.item[1] === targetRow && s.item[0] >= spanMinCol && s.item[0] <= spanMaxCol
                                  ? sum + s.hoverAmount
                                  : sum,
                          0
                      )
                  );

        // Фон групп-ячейки рисуем ЗДЕСЬ — ДО контент-колбэка, единым путём для дефолтной
        // и кастомной отрисовки (кастомный drawGroupHeader идёт мимо drawGroupHeaderInner
        // и иначе остался бы без фона/подсветки). topInset: у верхнего уровня (level 0)
        // разделителя над ним нет — заливаем от края; у под-групп 1px сверху сохраняет
        // разграничительную линию между уровнями.
        // БАЗОВЫЙ (не-hover) цвет группы красим ВСЕГДА непрозрачно, а hover-цвет
        // накладываем сверху с alpha = hoverAmount. Причина: на hover-damage групп-ячейка
        // сперва очищается в bgHeader (самый светлый), и если на кадре ha=0 (hover начался,
        // анимация ещё не стартовала) ничего не красить — проступает яркий bgHeader (вспышка).
        // А красить hover-цвет непрозрачно на ha=0 — это старый «проблеск». Base + overlay
        // убирает оба: при ha=0 виден базовый фон, при ha=1 — полный hover.
        const baseFillColor = resolveGroupHeaderFillColor(isSelected, false, groupTheme, theme);
        const topInset = level === 0 ? 0 : 1;
        if (baseFillColor !== theme.bgHeader) {
            ctx.fillStyle = baseFillColor;
            ctx.fillRect(x, y + yOffset + topInset, w, cellH - topInset);
        }
        if (isHovered && !isSelected && hoverAmount > 0) {
            const hoverFillColor = groupTheme.bgGroupHeaderHovered ?? groupTheme.bgHeaderHovered;
            ctx.globalAlpha = hoverAmount;
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(x, y + yOffset + topInset, w, cellH - topInset);
            ctx.globalAlpha = 1;
        }

        if (drawGroupHeaderCallback !== undefined) {
            const isFirstColumn = x === 0;
            const offsetForVisibleBorderX = isFirstColumn ? 0 : 1;

            // Слитая группа достаёт до нижнего групп-уровня → трактуем как последний ряд.
            const isLastLevelGroupRow = level === levels - 1 || spanRegion !== undefined;
            const offsetForVisibleBorderY = isLastLevelGroupRow ? 0 : 1;

            const headerInnerMapper = {
                y: y + yOffset,
            };

            let wasUsedDefDraw = false;
            drawGroupHeaderCallback(
                {
                    ctx,
                    groupName,
                    level,
                    span,
                    theme: groupTheme,
                    // rect: { x: x + 0.5, y: y + yOffset, width: w, height: h },
                    rect: {
                        x: x + offsetForVisibleBorderX,
                        y: y + yOffset,
                        width: w - offsetForVisibleBorderX,
                        height: cellH - offsetForVisibleBorderY,
                    },
                    isSelected,
                    isHovered,
                    spriteManager,
                    hoverX: isHovered ? hPosX : undefined,
                    hoverY: isHovered ? hPosY : undefined,
                },
                groupNameOverride => {
                    drawGroupHeaderInner(
                        ctx,
                        x,
                        headerInnerMapper.y,
                        w,
                        cellH,
                        groupNameOverride ?? groupName,
                        level,
                        span,
                        isSelected,
                        isHovered,
                        hoverAmount,
                        theme,
                        groupTheme,
                        group,
                        spriteManager,
                        hovered,
                        verticalBorder,
                        enableLowDprHairline,
                        groupSpanAlign
                    );
                    wasUsedDefDraw = true;
                }
            );
            // vertical border between custom groupHeaders (required)
            if (!wasUsedDefDraw && x !== 0 && verticalBorder(span[0])) {
                const preventOverlaysOffset = level === 0 ? 0 : 1; // prevent overlays of vert and horiz borders
                ctx.beginPath();
                ctx.moveTo(x + 0.5, headerInnerMapper.y + preventOverlaysOffset);
                ctx.lineTo(x + 0.5, headerInnerMapper.y + cellH);
                ctx.strokeStyle = theme.borderColor;
                const previousLineWidth = ctx.lineWidth;
                ctx.lineWidth = getHairlineWidth(enableLowDprHairline);
                ctx.stroke();
                ctx.lineWidth = previousLineWidth;
            }
        } else {
            drawGroupHeaderInner(
                ctx,
                x,
                y + yOffset,
                w,
                cellH,
                groupName,
                level,
                span,
                isSelected,
                isHovered,
                hoverAmount,
                theme,
                groupTheme,
                group,
                spriteManager,
                hovered,
                verticalBorder,
                enableLowDprHairline,
                groupSpanAlign
            );
        }

        ctx.restore();

        finalX = x + w;
    });

    // Закрывающую вертикаль уровня рисуем ТОЛЬКО если на нём реально отрисована хотя бы
    // одна группа (finalX двигается лишь при обработанной группе). При частичной (hover)
    // перерисовке все группы уровня могут отфильтроваться damage-проверкой — тогда finalX
    // остаётся 0, и штрих на finalX+0.5 = 0.5 рисует ложную вертикаль на левом краю шапки
    // (видно как «мигающая» линия слева у слитой ячейки на первой позиции).
    if (finalX > 0) {
        ctx.beginPath();
        ctx.moveTo(finalX + 0.5, yOffset);
        ctx.lineTo(finalX + 0.5, yOffset + groupHeaderHeight);
        ctx.strokeStyle = theme.borderColor;
        const previousLineWidth = ctx.lineWidth;
        ctx.lineWidth = getHairlineWidth(enableLowDprHairline);
        ctx.stroke();
        ctx.lineWidth = previousLineWidth;
    }

    // Horizontal border at the bottom of the last level (level 0 is the bottommost)
    // This will be drawn in drawGroups function between levels
}

const menuButtonSize = 30;
function getHeaderMenuBounds(x: number, y: number, width: number, height: number, isRtl: boolean): Rectangle {
    if (isRtl) return { x, y, width: menuButtonSize, height: Math.min(menuButtonSize, height) };
    return {
        x: x + width - menuButtonSize, // right align
        y: Math.max(y, y + height / 2 - menuButtonSize / 2), // center vertically
        width: menuButtonSize,
        height: Math.min(menuButtonSize, height),
    };
}

export function getActionBoundsForGroup(
    box: Rectangle,
    actions: NonNullable<GroupDetails["actions"]>
): readonly Rectangle[] {
    const result: Rectangle[] = [];
    let x = box.x + box.width - 26 * actions.length;
    const y = box.y + box.height / 2 - 13;
    const height = 26;
    const width = 26;
    for (let i = 0; i < actions.length; i++) {
        result.push({
            x,
            y,
            width,
            height,
        });
        x += 26;
    }
    return result;
}

type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};

interface HeaderLayout {
    readonly textBounds: Rectangle | undefined;
    readonly iconBounds: Rectangle | undefined;
    readonly iconOverlayBounds: Rectangle | undefined;
    readonly indicatorIconBounds: Rectangle | undefined;
    readonly menuBounds: Rectangle | undefined;
}

function flipHorizontal(
    toFlip: Mutable<Rectangle> | undefined,
    mirrorX: number,
    isRTL: boolean
): Mutable<Rectangle> | undefined {
    if (!isRTL || toFlip === undefined) return toFlip;
    toFlip.x = mirrorX - (toFlip.x - mirrorX) - toFlip.width;
    return toFlip;
}

export function computeHeaderLayout(
    ctx: CanvasRenderingContext2D | undefined,
    c: MappedGridColumn,
    x: number,
    y: number,
    width: number,
    height: number,
    theme: FullTheme,
    isRTL: boolean
): HeaderLayout {
    const xPad = theme.cellHorizontalPadding;
    const headerIconSize = theme.headerIconSize;
    const menuBounds = getHeaderMenuBounds(x, y, width, height, false);

    let drawX = x + xPad;
    const iconBounds =
        c.icon === undefined
            ? undefined
            : {
                  x: drawX,
                  y: y + (height - headerIconSize) / 2,
                  width: headerIconSize,
                  height: headerIconSize,
              };

    const iconOverlayBounds =
        iconBounds === undefined || c.overlayIcon === undefined
            ? undefined
            : {
                  x: iconBounds.x + 9,
                  y: iconBounds.y + 6,
                  width: 18,
                  height: 18,
              };

    if (iconBounds !== undefined) {
        drawX += Math.ceil(headerIconSize * 1.3);
    }

    const textBounds = {
        x: drawX,
        y: y,
        width: width - drawX,
        height: height,
    };

    let indicatorIconBounds: Rectangle | undefined = undefined;
    if (c.indicatorIcon !== undefined) {
        const textWidth =
            ctx === undefined
                ? (getMeasuredTextCache(c.title, theme.headerFontFull)?.width ?? 0)
                : measureTextCached(c.title, ctx, theme.headerFontFull).width;
        textBounds.width = textWidth;
        drawX += textWidth + xPad;
        indicatorIconBounds = {
            x: drawX,
            y: y + (height - headerIconSize) / 2,
            width: headerIconSize,
            height: headerIconSize,
        };
    }

    const mirrorPoint = x + width / 2;

    return {
        menuBounds: flipHorizontal(menuBounds, mirrorPoint, isRTL),
        iconBounds: flipHorizontal(iconBounds, mirrorPoint, isRTL),
        iconOverlayBounds: flipHorizontal(iconOverlayBounds, mirrorPoint, isRTL),
        textBounds: flipHorizontal(textBounds, mirrorPoint, isRTL),
        indicatorIconBounds: flipHorizontal(indicatorIconBounds, mirrorPoint, isRTL),
    };
}

function drawHeaderInner(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    c: MappedGridColumn,
    selected: boolean,
    theme: FullTheme,
    isHovered: boolean,
    posX: number | undefined,
    posY: number | undefined,
    hoverAmount: number,
    spriteManager: SpriteManager,
    touchMode: boolean,
    isRtl: boolean,
    headerLayout: HeaderLayout,
    headerNameOverride: string | undefined,
    // Есть только у объединённой колонки — иначе рисуем как раньше.
    spanAlign?: ResolvedSpanAlignment
) {
    if (c.rowMarker !== undefined && c.headerRowMarkerDisabled !== true) {
        const checked = c.rowMarkerChecked;
        if (checked !== true && c.headerRowMarkerAlwaysVisible !== true) {
            ctx.globalAlpha = hoverAmount;
        }
        const markerTheme =
            c.headerRowMarkerTheme !== undefined ? mergeAndRealizeTheme(theme, c.headerRowMarkerTheme) : theme;
        drawCheckbox(
            ctx,
            markerTheme,
            checked,
            x,
            y,
            width,
            height,
            false,
            undefined,
            undefined,
            theme.checkboxMaxSize,
            "center",
            c.rowMarker
        );
        if (checked !== true && c.headerRowMarkerAlwaysVisible !== true) {
            ctx.globalAlpha = 1;
        }
        return;
    }

    const fillStyle = selected ? theme.textHeaderSelected : theme.textHeader;

    const shouldDrawMenu =
        c.hasMenu === true && (isHovered || (touchMode && selected)) && headerLayout.menuBounds !== undefined;

    if (c.icon !== undefined && headerLayout.iconBounds !== undefined) {
        let variant: SpriteVariant = selected ? "selected" : "normal";
        if (c.style === "highlight") {
            variant = selected ? "selected" : "special";
        }
        spriteManager.drawSprite(
            c.icon,
            variant,
            ctx,
            headerLayout.iconBounds.x,
            headerLayout.iconBounds.y,
            headerLayout.iconBounds.width,
            theme
        );

        if (c.overlayIcon !== undefined && headerLayout.iconOverlayBounds !== undefined) {
            spriteManager.drawSprite(
                c.overlayIcon,
                selected ? "selected" : "special",
                ctx,
                headerLayout.iconOverlayBounds.x,
                headerLayout.iconOverlayBounds.y,
                headerLayout.iconOverlayBounds.width,
                theme
            );
        }
    }

    if (shouldDrawMenu && width > 35) {
        const fadeWidth = 35;
        const fadeStart = isRtl ? fadeWidth : width - fadeWidth;
        const fadeEnd = isRtl ? fadeWidth * 0.7 : width - fadeWidth * 0.7;

        const fadeStartPercent = fadeStart / width;
        const fadeEndPercent = fadeEnd / width;

        const grad = ctx.createLinearGradient(x, 0, x + width, 0);
        const trans = withAlpha(fillStyle, 0);

        grad.addColorStop(isRtl ? 1 : 0, fillStyle);
        grad.addColorStop(fadeStartPercent, fillStyle);
        grad.addColorStop(fadeEndPercent, trans);
        grad.addColorStop(isRtl ? 0 : 1, trans);
        ctx.fillStyle = grad;
    } else {
        ctx.fillStyle = fillStyle;
    }

    if (spanAlign !== undefined && !isRtl && headerLayout.textBounds !== undefined) {
        // Объединённая колонка: выравниваем заголовок. Слева — после иконки (textBounds.x),
        // справа оставляем место под кнопку меню и иконку-индикатор. Для RTL — старый путь.
        const padX = theme.cellHorizontalPadding;
        const bias = getMiddleCenterBias(ctx, theme.headerFontFull);
        const boxLeft = headerLayout.textBounds.x;
        let boxRight = x + width - (c.hasMenu === true ? menuButtonSize : padX);
        if (headerLayout.indicatorIconBounds !== undefined) {
            boxRight = Math.min(boxRight, headerLayout.indicatorIconBounds.x - padX);
        }
        drawSpanAlignedText(
            ctx,
            headerNameOverride ?? c.title,
            boxLeft,
            boxRight,
            y,
            height,
            spanAlign,
            bias,
            theme.cellVerticalPadding
        );
    } else {
        if (isRtl) {
            ctx.textAlign = "right";
        }
        if (headerLayout.textBounds !== undefined) {
            ctx.fillText(
                headerNameOverride ?? c.title,
                isRtl ? headerLayout.textBounds.x + headerLayout.textBounds.width : headerLayout.textBounds.x,
                y + height / 2 + getMiddleCenterBias(ctx, theme.headerFontFull)
            );
        }
        if (isRtl) {
            ctx.textAlign = "left";
        }
    }

    if (
        c.indicatorIcon !== undefined &&
        headerLayout.indicatorIconBounds !== undefined &&
        (!shouldDrawMenu ||
            !intersectRect(
                headerLayout.menuBounds.x,
                headerLayout.menuBounds.y,
                headerLayout.menuBounds.width,
                headerLayout.menuBounds.height,
                headerLayout.indicatorIconBounds.x,
                headerLayout.indicatorIconBounds.y,
                headerLayout.indicatorIconBounds.width,
                headerLayout.indicatorIconBounds.height
            ))
    ) {
        let variant: SpriteVariant = selected ? "selected" : "normal";
        if (c.style === "highlight") {
            variant = selected ? "selected" : "special";
        }
        spriteManager.drawSprite(
            c.indicatorIcon,
            variant,
            ctx,
            headerLayout.indicatorIconBounds.x,
            headerLayout.indicatorIconBounds.y,
            headerLayout.indicatorIconBounds.width,
            theme
        );
    }

    if (shouldDrawMenu && headerLayout.menuBounds !== undefined) {
        const menuBounds = headerLayout.menuBounds;

        const hovered = posX !== undefined && posY !== undefined && pointInRect(menuBounds, posX + x, posY + y);

        if (!hovered) {
            ctx.globalAlpha = 0.7;
        }

        if (c.menuIcon === undefined || c.menuIcon === GridColumnMenuIcon.Triangle) {
            // Draw the default triangle menu icon:
            ctx.beginPath();
            const triangleX = menuBounds.x + menuBounds.width / 2 - 5.5;
            const triangleY = menuBounds.y + menuBounds.height / 2 - 3;
            roundedPoly(
                ctx,
                [
                    {
                        x: triangleX,
                        y: triangleY,
                    },
                    {
                        x: triangleX + 11,
                        y: triangleY,
                    },
                    {
                        x: triangleX + 5.5,
                        y: triangleY + 6,
                    },
                ],
                1
            );
            ctx.fillStyle = fillStyle;
            ctx.fill();
        } else if (c.menuIcon === GridColumnMenuIcon.Dots) {
            // Draw the three dots menu icon:
            ctx.beginPath();
            const dotsX = menuBounds.x + menuBounds.width / 2;
            const dotsY = menuBounds.y + menuBounds.height / 2;
            drawMenuDots(ctx, dotsX, dotsY);
            ctx.fillStyle = fillStyle;
            ctx.fill();
        } else {
            // Assume that the user has specified a valid sprite image as header icon:
            const iconX = menuBounds.x + (menuBounds.width - theme.headerIconSize) / 2;
            const iconY = menuBounds.y + (menuBounds.height - theme.headerIconSize) / 2;
            spriteManager.drawSprite(c.menuIcon, "normal", ctx, iconX, iconY, theme.headerIconSize, theme);
        }

        if (!hovered) {
            ctx.globalAlpha = 1;
        }
    }
}

export function drawHeader(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    c: MappedGridColumn,
    selected: boolean,
    theme: FullTheme,
    isHovered: boolean,
    posX: number | undefined,
    posY: number | undefined,
    hasSelectedCell: boolean,
    hoverAmount: number,
    spriteManager: SpriteManager,
    drawHeaderCallback: DrawHeaderCallback | undefined,
    touchMode: boolean,
    // Выравнивание объединённой колонки (если она объединена).
    spanAlign?: ResolvedSpanAlignment
) {
    const isRtl = direction(c.title) === "rtl";
    const headerLayout = computeHeaderLayout(ctx, c, x, y, width, height, theme, isRtl);

    if (drawHeaderCallback !== undefined) {
        drawHeaderCallback(
            {
                ctx,
                theme,
                rect: { x, y, width, height },
                column: c,
                columnIndex: c.sourceIndex,
                isSelected: selected,
                hoverAmount,
                isHovered,
                hasSelectedCell,
                spriteManager,
                menuBounds: headerLayout?.menuBounds ?? { x: 0, y: 0, height: 0, width: 0 },
                hoverX: posX,
                hoverY: posY,
            },
            headerNameOverride =>
                drawHeaderInner(
                    ctx,
                    x,
                    y,
                    width,
                    height,
                    c,
                    selected,
                    theme,
                    isHovered,
                    posX,
                    posY,
                    hoverAmount,
                    spriteManager,
                    touchMode,
                    isRtl,
                    headerLayout,
                    headerNameOverride,
                    spanAlign
                )
        );
    } else {
        drawHeaderInner(
            ctx,
            x,
            y,
            width,
            height,
            c,
            selected,
            theme,
            isHovered,
            posX,
            posY,
            hoverAmount,
            spriteManager,
            touchMode,
            isRtl,
            headerLayout,
            undefined, // headerNameOverride
            spanAlign
        );
    }
}
