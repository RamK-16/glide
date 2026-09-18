import { expect, describe, test } from "vitest";
import { mouseEventArgsAreEqual, type GridMouseEventArgs } from "../src/internal/data-grid/event-args.js";

// rawLocation в cell-событиях: физическая ячейка под курсором до нормализации
// к origin слитого блока. Сравнение аргументов должно различать строки внутри
// блока, иначе движение мыши по блоку не считается сменой ховера.

function cellArgs(location: [number, number], rawLocation?: [number, number]): GridMouseEventArgs {
    return {
        kind: "cell",
        location,
        rawLocation,
        bounds: { x: 0, y: 0, width: 100, height: 30 },
        isFillHandle: false,
        isEdge: false,
        shiftKey: false,
        ctrlKey: false,
        metaKey: false,
        isTouch: false,
        button: 0,
        buttons: 0,
        scrollEdge: [0, 0],
        localEventX: 5,
        localEventY: 5,
    } as GridMouseEventArgs;
}

describe("mouseEventArgsAreEqual и rawLocation", () => {
    test("одинаковый origin, разные физические строки блока: НЕ равны", () => {
        const a = cellArgs([1, 4], [1, 5]);
        const b = cellArgs([1, 4], [1, 7]);
        expect(mouseEventArgsAreEqual(a, b)).toBe(false);
    });

    test("одинаковый origin и одна физическая строка: равны", () => {
        const a = cellArgs([1, 4], [1, 6]);
        const b = cellArgs([1, 4], [1, 6]);
        expect(mouseEventArgsAreEqual(a, b)).toBe(true);
    });

    test("обычные ячейки без rawLocation сравниваются как раньше", () => {
        expect(mouseEventArgsAreEqual(cellArgs([2, 3]), cellArgs([2, 3]))).toBe(true);
        expect(mouseEventArgsAreEqual(cellArgs([2, 3]), cellArgs([2, 4]))).toBe(false);
    });

    test("rawLocation против его отсутствия: НЕ равны", () => {
        expect(mouseEventArgsAreEqual(cellArgs([1, 4], [1, 4]), cellArgs([1, 4]))).toBe(false);
    });
});
