import { describe, expect, it } from "vitest";
import { resolveGroupHeaderFillColor } from "../src/internal/data-grid/render/data-grid-render.header.js";
import { getDataEditorTheme, mergeAndRealizeTheme, type FullTheme } from "../src/common/styles.js";

const theme = mergeAndRealizeTheme(getDataEditorTheme());

function groupTheme(overrides: Partial<FullTheme>): FullTheme {
    return { ...theme, ...overrides } as FullTheme;
}

describe("resolveGroupHeaderFillColor — приоритет выделение > ховер > обычный фон", () => {
    it("выделение: accentColor групп-темы", () => {
        const gt = groupTheme({ accentColor: "#acc" });
        expect(resolveGroupHeaderFillColor(true, false, gt, theme)).toBe("#acc");
    });

    it("выделение без accentColor в групп-теме: fallback на accentColor общей темы", () => {
        const gt = groupTheme({ accentColor: undefined });
        expect(resolveGroupHeaderFillColor(true, false, gt, theme)).toBe(theme.accentColor);
    });

    it("выделение важнее ховера", () => {
        const gt = groupTheme({ accentColor: "#acc", bgGroupHeaderHovered: "#hov" });
        expect(resolveGroupHeaderFillColor(true, true, gt, theme)).toBe("#acc");
    });

    it("ховер: bgGroupHeaderHovered", () => {
        const gt = groupTheme({ bgGroupHeaderHovered: "#hov" });
        expect(resolveGroupHeaderFillColor(false, true, gt, theme)).toBe("#hov");
    });

    it("ховер без bgGroupHeaderHovered: fallback на bgHeaderHovered", () => {
        const gt = groupTheme({ bgGroupHeaderHovered: undefined, bgHeaderHovered: "#hh" });
        expect(resolveGroupHeaderFillColor(false, true, gt, theme)).toBe("#hh");
    });

    it("обычное состояние: bgGroupHeader", () => {
        const gt = groupTheme({ bgGroupHeader: "#bg" });
        expect(resolveGroupHeaderFillColor(false, false, gt, theme)).toBe("#bg");
    });

    it("обычное состояние без bgGroupHeader: fallback на bgHeader", () => {
        const gt = groupTheme({ bgGroupHeader: undefined, bgHeader: "#bh" });
        expect(resolveGroupHeaderFillColor(false, false, gt, theme)).toBe("#bh");
    });
});
