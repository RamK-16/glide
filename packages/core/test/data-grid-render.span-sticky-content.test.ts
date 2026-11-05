import { describe, expect, it } from "vitest";
import { stickySpanContentBox } from "../src/internal/data-grid/render/data-grid-render.cells.js";
import { nextStickySpanInView } from "../src/internal/data-grid/render/data-grid-render.blit.js";
import { getScrollBodyRange, getSpanEditorPosition } from "../src/internal/data-grid/render/data-grid-lib.js";

// Видимая часть слитого блока для содержимого с прилипанием (spanAlign.sticky).
// Область данных в примерах: от 40 (под шапкой) до 468 (над итоговой строкой).
const TOP = 40;
const BOTTOM = 468;

const atBottom = (blockBottom: number) => stickySpanContentBox(blockBottom - 2000, 2000, TOP, BOTTOM, 40, 40, 600);
const atTop = (blockY: number) => stickySpanContentBox(blockY, 300, TOP, BOTTOM, 32, 32, 100);

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

    it("содержимое выше видимой части, верх блока под шапкой: упирается в низ блока и уезжает с ним", () => {
        // Блок заканчивается на 100, видно 60px, содержимое 100px.
        expect(stickySpanContentBox(-300, 400, TOP, BOTTOM, 32, 32, 100)).toEqual({ y: 0, height: 100 });
    });

    it("содержимое выше видимой части, низ блока под итогом: стоит от верха блока", () => {
        // Блок начинается на 430, над итоговой строкой видно 38px, содержимое 100px.
        expect(stickySpanContentBox(430, 400, TOP, BOTTOM, 32, 32, 100)).toEqual({ y: 430, height: 100 });
    });

    it("содержимое помещается в видимую часть: высота содержимого ни на что не влияет", () => {
        expect(stickySpanContentBox(-200, 600, TOP, BOTTOM, 32, 32, 100)).toEqual({ y: 40, height: 360 });
    });

    it("содержимое выше всего блока: прямоугольник не выходит за блок", () => {
        expect(stickySpanContentBox(-20, 64, TOP, BOTTOM, 32, 32, 100)).toEqual({ y: -20, height: 64 });
    });

    it("блок обрезан с обеих сторон и содержимое выше области данных: верх остаётся на экране", () => {
        expect(stickySpanContentBox(-500, 2000, TOP, BOTTOM, 32, 32, 600)).toEqual({ y: 40, height: 600 });
    });

    it("низ блока проходит через низ области данных: содержимое выше области не прыгает", () => {
        // Содержимое 600px в области 428px, блок длинный, верх давно под шапкой.
        expect(atBottom(469)).toEqual({ y: -131, height: 600 });
        expect(atBottom(468)).toEqual({ y: -132, height: 600 });
        expect(atBottom(467)).toEqual({ y: -133, height: 600 });
    });

    it("содержимое выше области данных: при прокрутке сдвигается ровно на шаг прокрутки или стоит", () => {
        let previous = stickySpanContentBox(-1000, 2000, TOP, BOTTOM, 40, 40, 600);
        for (let blockY = -1001; blockY > -2100; blockY--) {
            const box = stickySpanContentBox(blockY, 2000, TOP, BOTTOM, 40, 40, 600);
            expect(previous.y - box.y).toBeGreaterThanOrEqual(0);
            expect(previous.y - box.y).toBeLessThanOrEqual(1);
            expect(box.height).toBe(600);
            previous = box;
        }
    });

    it("въезд блока снизу: при прохождении низа области данных прямоугольник не прыгает", () => {
        // Видимая часть становится меньше содержимого между 368 и 369.
        expect(atTop(368)).toEqual({ y: 368, height: 100 });
        expect(atTop(369)).toEqual({ y: 369, height: 100 });
    });

    it.each([
        ["первая строка выше области, без содержимого", 468, 500, 32, 0],
        ["обе строки выше обычных, маленькая область", 137, 120, 40, 0],
        ["разные строки и содержимое", 137, 120, 40, 110],
        ["последняя строка выше первой", 137, 40, 120, 110],
    ])("разная высота первой и последней строки: без прыжков при прокрутке, %s", (_name, height, first, last, c) => {
        const top = 40;
        const blockHeight = 3000;
        let previous = stickySpanContentBox(height + 50, blockHeight, top, height, first, last, c);
        for (let blockY = height + 49; blockY > -blockHeight - 50; blockY--) {
            const box = stickySpanContentBox(blockY, blockHeight, top, height, first, last, c);
            expect(previous.y - box.y).toBeGreaterThanOrEqual(0);
            expect(previous.y - box.y).toBeLessThanOrEqual(1);
            expect(box.y).toBeGreaterThanOrEqual(blockY);
            expect(box.y + box.height).toBeLessThanOrEqual(blockY + blockHeight);
            previous = box;
        }
    });

    it("блок ниже одной строки по высоте: прямоугольник не выходит за блок", () => {
        expect(stickySpanContentBox(10, 20, TOP, BOTTOM, 32, 32)).toEqual({ y: 10, height: 20 });
    });
});

describe("getSpanEditorPosition", () => {
    const BODY = { top: 40, bottom: 468 };

    it("содержимое в области данных: редактор по выравниванию", () => {
        const content = { y: 100, height: 200 };
        expect(getSpanEditorPosition(content, 40, "top", BODY)).toBe(100);
        expect(getSpanEditorPosition(content, 40, "center", BODY)).toBe(180);
        expect(getSpanEditorPosition(content, 40, "bottom", BODY)).toBe(260);
    });

    it("верх содержимого уехал за верх области: редактор остаётся у её верха", () => {
        expect(getSpanEditorPosition({ y: -131, height: 600 }, 40, "top", BODY)).toBe(40);
    });

    it("низ содержимого ниже области: редактор остаётся над её низом", () => {
        expect(getSpanEditorPosition({ y: 300, height: 600 }, 40, "bottom", BODY)).toBe(428);
    });

    it("границы области неизвестны: только выравнивание", () => {
        expect(getSpanEditorPosition({ y: -131, height: 600 }, 40, "top", undefined)).toBe(-131);
    });
});

describe("nextStickySpanInView", () => {
    it("полный кадр берёт то, что нарисовал", () => {
        expect(nextStickySpanInView(true, false, false)).toBe(true);
        expect(nextStickySpanInView(false, false, true)).toBe(false);
    });

    it("частичный кадр, не дошедший до блока, сохраняет признак прошлого кадра", () => {
        expect(nextStickySpanInView(false, true, true)).toBe(true);
        expect(nextStickySpanInView(false, true, undefined)).toBe(false);
    });
});

describe("getScrollBodyRange", () => {
    it("без закреплённых строк: от низа шапки до верха итоговой строки", () => {
        expect(getScrollBodyRange(500, 36, undefined, 32)).toEqual({ top: 36, bottom: 468 });
    });

    it("с закреплёнными сверху строками: от их низа", () => {
        expect(getScrollBodyRange(500, 36, 100, 0)).toEqual({ top: 100, bottom: 500 });
    });
});
