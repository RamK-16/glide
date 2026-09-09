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
