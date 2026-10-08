/**
 * Возвращает ширину hairline-штриха для canvas renderer-а.
 * При DPR < 1 увеличивает lineWidth до одного физического пикселя, чтобы линии сетки не исчезали на малом browser zoom.
 */
export function getHairlineWidth(enableLowDprHairline: boolean): number {
    if (!enableLowDprHairline) {
        return 1;
    }

    const devicePixelRatio = typeof window === "undefined" ? 1 : window.devicePixelRatio;

    if (!Number.isFinite(devicePixelRatio) || devicePixelRatio <= 0) {
        return 1;
    }

    return devicePixelRatio < 1 ? 1 / devicePixelRatio : 1;
}
