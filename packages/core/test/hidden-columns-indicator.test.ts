import { expect, describe, test } from "vitest";
import {
    getHiddenIndicatorAnchor,
    getHiddenIndicatorXBounds,
    hiddenIndicatorWidth,
} from "../src/internal/data-grid/hidden-columns-indicator.js";

// Геометрия индикатора скрытых колонок: одна полоска фиксированной ширины,
// якорь на краях таблицы.

describe("hidden-columns-indicator геометрия", () => {
    test("якорь: левый край, середина, правый край", () => {
        expect(getHiddenIndicatorAnchor(0, 5)).toBe("right");
        expect(getHiddenIndicatorAnchor(2, 5)).toBe("center");
        expect(getHiddenIndicatorAnchor(5, 5)).toBe("left");
    });

    test("обычная граница: полоска по центру", () => {
        expect(getHiddenIndicatorXBounds(100, "center")).toEqual({
            x: 100 - hiddenIndicatorWidth / 2,
            width: hiddenIndicatorWidth,
        });
    });

    test("якорь right: полоска растёт вправо от границы", () => {
        expect(getHiddenIndicatorXBounds(0, "right")).toEqual({ x: 0, width: hiddenIndicatorWidth });
    });

    test("якорь left: полоска растёт влево от границы", () => {
        expect(getHiddenIndicatorXBounds(500, "left")).toEqual({
            x: 500 - hiddenIndicatorWidth,
            width: hiddenIndicatorWidth,
        });
    });
});
