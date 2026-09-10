/**
 * Индикатор скрытых колонок: полосатая линия на границе двух видимых колонок,
 * между которыми есть скрытые. Сколько бы колонок ни было скрыто подряд, полоска
 * одна, а двойной клик по ней раскрывает весь промежуток. Ресайз на этой границе
 * продолжает работать как обычно. Здесь собрана общая геометрия, чтобы отрисовка
 * и хит-тест считали одно и то же.
 */

/** Ширина полоски индикатора. */
export const hiddenIndicatorWidth = 4;

/** Цвет индикатора по умолчанию, если в теме не задан hiddenColumnsIndicatorColor. */
export const hiddenIndicatorDefaultColor = "#0b7ecb";

/**
 * Куда растёт индикатор от границы: обычно по центру границы, но на левом краю таблицы
 * растёт вправо, а у правого края влево, чтобы не резаться о край.
 */
export type HiddenIndicatorAnchor = "center" | "right" | "left";

export function getHiddenIndicatorAnchor(boundary: number, columnCount: number): HiddenIndicatorAnchor {
    if (boundary === 0) return "right";
    if (boundary === columnCount) return "left";
    return "center";
}

/** Горизонтальное положение индикатора на границе. */
export function getHiddenIndicatorXBounds(borderX: number, anchor: HiddenIndicatorAnchor): { x: number; width: number } {
    const x =
        anchor === "right" ? borderX : anchor === "left" ? borderX - hiddenIndicatorWidth : borderX - hiddenIndicatorWidth / 2;
    return { x, width: hiddenIndicatorWidth };
}

/**
 * Полоса на границе. Кроме числа скрытых колонок потребитель может задать groupDepth:
 * сколько верхних уровней групп-шапки пропустить сверху (не рисовать на них полосу).
 * Высоту потребитель считает сам. Скрыт лист внутри группы, значит пропускаем все
 * групп-ряды и полоса остаётся только в листовом ряду. Скрыта большая колонка,
 * разрывающая группы, значит пропускаем ноль и полоса идёт на всю высоту. Старый
 * контракт сохраняется: колбэк может вернуть просто число, тогда groupDepth равен нулю
 * и полоса на всю высоту.
 */
export interface HiddenColumnsIndicatorInfo {
    /** Сколько столбцов скрыто на границе. Ноль значит индикатора нет. */
    count: number;
    /** Сколько верхних уровней групп-шапки пропустить сверху. Ноль значит на всю высоту. */
    groupDepth?: number;
}

/** Приводит возврат колбэка (число или объект) к единому виду. */
export function normalizeHiddenIndicator(value: number | HiddenColumnsIndicatorInfo): {
    count: number;
    groupDepth: number;
} {
    return typeof value === "number"
        ? { count: value, groupDepth: 0 }
        : { count: value.count, groupDepth: value.groupDepth ?? 0 };
}

/**
 * Верхний край полосы: пропускаем groupDepth верхних уровней групп-шапки и суммируем
 * их высоты. Полоса идёт от этого края до низа шапки. Если groupDepth равен числу
 * уровней, полоса только в листовом ряду, если ноль, то на всю высоту.
 */
export function getHiddenIndicatorTopY(
    groupDepth: number,
    groupHeaderHeight: number | readonly number[],
    groupLevels: number
): number {
    if (groupDepth <= 0 || groupLevels <= 0) return 0;
    const k = Math.min(groupDepth, groupLevels);
    if (Array.isArray(groupHeaderHeight)) {
        let y = 0;
        for (let i = 0; i < k; i++) y += groupHeaderHeight[i] ?? 0;
        return y;
    }
    return (groupHeaderHeight as number) * k;
}
