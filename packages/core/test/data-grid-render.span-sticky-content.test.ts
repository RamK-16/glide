import { describe, expect, it } from "vitest";
import { stickySpanContentBox } from "../src/internal/data-grid/render/data-grid-render.cells.js";

// Видимая часть слитого блока для содержимого с прилипанием (spanAlign.sticky).
// Область данных в примерах: от 40 (под шапкой) до 468 (над итоговой строкой).
const TOP = 40;
const BOTTOM = 468;

describe("stickySpanContentBox", () => {
    it("блок целиком в области данных: прямоугольник равен блоку", () => {
        expect(stickySpanContentBox(100, 300, TOP, BOTTOM, 32, 32)).toEqual({ y: 100, height: 300 });
    });

    it("верх блока под шапкой: прямоугольник начинается у верха области данных", () => {
        expect(stickySpanContentBox(-200, 600, TOP, BOTTOM, 32, 32)).toEqual({ y: 40, height: 360 });
    });

    it("низ блока под итоговой строкой: прямоугольник заканчивается над ней", () => {
        expect(stickySpanContentBox(300, 600, TOP, BOTTOM, 32, 32)).toEqual({ y: 300, height: 168 });
    });

    it("блок выше области данных с обеих сторон: прямоугольник равен области данных", () => {
        expect(stickySpanContentBox(-500, 2000, TOP, BOTTOM, 32, 32)).toEqual({ y: 40, height: 428 });
    });

    it("от блока сверху осталось меньше строки: держит высоту последней строки и уезжает с блоком", () => {
        // Блок заканчивается на 60, под шапкой видно 20px.
        expect(stickySpanContentBox(-300, 360, TOP, BOTTOM, 32, 32)).toEqual({ y: 28, height: 32 });
    });

    it("от блока снизу осталось меньше строки: держит высоту первой строки", () => {
        // Блок начинается на 450, над итоговой строкой видно 18px.
        expect(stickySpanContentBox(450, 300, TOP, BOTTOM, 32, 32)).toEqual({ y: 450, height: 32 });
    });

    it("блок ниже одной строки по высоте: прямоугольник не выходит за блок", () => {
        expect(stickySpanContentBox(10, 20, TOP, BOTTOM, 32, 32)).toEqual({ y: 10, height: 20 });
    });
});
