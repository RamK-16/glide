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

    it.each([
        [0.5, 2],
        [0.75, 4 / 3],
        [1, 1],
        [2, 1],
    ])("scales hairlines at devicePixelRatio %s", (devicePixelRatio, expected) => {
        setDevicePixelRatio(devicePixelRatio);

        expect(getHairlineWidth(true)).toBeCloseTo(expected);
    });

    it("keeps default width unless the low-DPR fix is enabled", () => {
        setDevicePixelRatio(0.5);

        expect(getHairlineWidth(false)).toBe(1);
    });

    it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
        "keeps default width for invalid devicePixelRatio %s",
        devicePixelRatio => {
            setDevicePixelRatio(devicePixelRatio);

            expect(getHairlineWidth(true)).toBe(1);
        }
    );
});
