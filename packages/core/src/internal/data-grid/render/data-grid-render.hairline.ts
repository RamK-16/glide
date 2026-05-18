// При zoom меньше 100% браузер может дать DPR ниже 1: обычная lineWidth = 1 становится
// тоньше одного физического пикселя и местами пропадает. Эта ширина держит линию видимой.
export function getHairlineWidth(): number {
    const devicePixelRatio = typeof window === "undefined" ? 1 : window.devicePixelRatio;

    if (!Number.isFinite(devicePixelRatio) || devicePixelRatio <= 0) {
        return 1;
    }

    return devicePixelRatio < 1 ? 1 / devicePixelRatio : 1;
}
