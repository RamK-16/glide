import { describe, expect, it } from "vitest";
import { stickySpanContentBox } from "../src/internal/data-grid/render/data-grid-render.cells.js";

// Подпись высокого слитого блока с выравниванием по верху держится у верха видимой
// части, когда верх блока ушёл за край, и уезжает вместе с низом блока.

describe("stickySpanContentBox", () => {
    it("верх блока виден: прямоугольник содержимого равен блоку", () => {
        expect(stickySpanContentBox(100, 300, 40, 32)).toEqual({ y: 100, height: 300 });
    });

    it("верх блока за краем: содержимое начинается у верха видимой части", () => {
        expect(stickySpanContentBox(-200, 600, 40, 32)).toEqual({ y: 40, height: 360 });
    });

    it("у низа блока подпись не опускается ниже последней строки", () => {
        // Блок заканчивается на 60, видимая часть начинается с 40: остаётся 20px,
        // но подпись держит высоту последней строки и уезжает вверх вместе с блоком.
        expect(stickySpanContentBox(-300, 360, 40, 32)).toEqual({ y: 28, height: 32 });
    });

    it("блок ниже последней строки по высоте: содержимое не выходит за верх блока", () => {
        expect(stickySpanContentBox(10, 20, 40, 32)).toEqual({ y: 10, height: 20 });
    });
});
