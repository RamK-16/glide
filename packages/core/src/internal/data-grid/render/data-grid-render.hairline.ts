/**
 * Компенсация тонких линий (hairline) при дробном devicePixelRatio.
 *
 * Канвас рисует в физических пикселях, а координаты приходят в CSS-пикселях.
 * При дробном DPR (browser zoom < 100% или масштаб ОС 125/150%) штрих шириной
 * 1 CSS px покрывает дробное число физических пикселей, и округление у каждой
 * линии своё: линии выходят разной толщины/светлости, а заливки соседних
 * ячеек «подлезают» под линию на физический пиксель.
 *
 * Два инструмента (оба no-op при целом DPR и при enable=false):
 *  - getHairlineWidth — ширина штриха, покрывающая ЦЕЛОЕ число физических
 *    пикселей: DPR < 1 → один физический пиксель (линии не исчезают на малом
 *    зуме); дробный DPR > 1 → round(dpr) физических пикселей;
 *  - getHairlineSnapper — выравнивание линии: край штриха кладётся на границу
 *    физического пикселя (снэп центра с учётом ширины штриха).
 */

function getDevicePixelRatio(): number {
    const dpr = typeof window === "undefined" ? 1 : window.devicePixelRatio;
    if (!Number.isFinite(dpr) || dpr <= 0) {
        return 1;
    }
    return dpr;
}

/** Ширина hairline-штриха в CSS px (= целое число физических пикселей). */
export function getHairlineWidth(enableLowDprHairline: boolean): number {
    if (!enableLowDprHairline) {
        return 1;
    }

    const dpr = getDevicePixelRatio();

    if (dpr < 1) {
        return 1 / dpr;
    }
    if (!Number.isInteger(dpr)) {
        return Math.max(1, Math.round(dpr)) / dpr;
    }
    return 1;
}

/**
 * Снэппер координаты линии (центра штриха) к сетке физических пикселей —
 * или undefined, когда выравнивание не требуется (целый DPR / выключено).
 * Вызывать с той же шириной штриха, что ушла в ctx.lineWidth.
 */
export function getHairlineSnapper(
    enableLowDprHairline: boolean,
    lineWidth: number
): ((v: number) => number) | undefined {
    if (!enableLowDprHairline) {
        return undefined;
    }

    const dpr = getDevicePixelRatio();
    if (Number.isInteger(dpr)) {
        return undefined;
    }

    const half = lineWidth / 2;
    return (v: number) => Math.round((v - half) * dpr) / dpr + half;
}
