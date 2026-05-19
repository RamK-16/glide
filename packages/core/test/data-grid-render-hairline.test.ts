import { afterEach, describe, expect, it } from "vitest";
import { getHairlineWidth } from "../src/internal/data-grid/render/data-grid-render.hairline.js";

function setDevicePixelRatio(devicePixelRatio: number) {
    Object.defineProperty(window, "devicePixelRatio", {
        configurable: true,
        value: devicePixelRatio,
    });
}

describe("getHairlineWidth", () => {
    afterEach(() => {
        setDevicePixelRatio(1);
    });

    // Фиксируем математику: при low DPR линия утолщается, при обычном/ретина DPR остается 1px.
    it.each([
        [0.5, 2],
        [0.75, 4 / 3],
        [1, 1],
        [2, 1],
    ])("scales hairlines at devicePixelRatio %s", (devicePixelRatio, expected) => {
        setDevicePixelRatio(devicePixelRatio);

        expect(getHairlineWidth()).toBeCloseTo(expected);
    });
});
