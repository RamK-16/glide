export function getHairlineWidth(enableLowDprHairlineFix: boolean): number {
    if (!enableLowDprHairlineFix) {
        return 1;
    }

    const devicePixelRatio = typeof window === "undefined" ? 1 : window.devicePixelRatio;

    if (!Number.isFinite(devicePixelRatio) || devicePixelRatio <= 0) {
        return 1;
    }

    return devicePixelRatio < 1 ? 1 / devicePixelRatio : 1;
}
