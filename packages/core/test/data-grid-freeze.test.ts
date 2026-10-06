import { describe, expect, test } from "vitest";
import {
    StickyAxis,
    computeColumnLayout,
    computeRowAxis,
    normalizeStickyIndexes,
    spanRowsFragment,
} from "../src/internal/data-grid/render/data-grid-freeze.js";
import type { MappedGridColumn } from "../src/internal/data-grid/render/data-grid-lib.js";

function makeColumn(sourceIndex: number, width: number, sticky = false): MappedGridColumn {
    return { sourceIndex, width, sticky, title: `c${sourceIndex}` } as MappedGridColumn;
}

function makeColumns(widths: number[], sticky: number[] = []): MappedGridColumn[] {
    return widths.map((width, index) => makeColumn(index, width, sticky.includes(index)));
}

describe("StickyAxis", () => {
    test("элемент на своём месте, пока не дошёл до слота", () => {
        // липкие 2 и 5 по 10px, естественные позиции 40 и 100
        const axis = new StickyAxis([2, 5], [10, 10], [40, 100], 0);
        expect(axis.pinnedCount).toBe(0);
        expect(axis.pinnedEnd).toBe(0);
        expect(axis.stickyPosition(2)).toBe(40);
        expect(axis.maxEnd).toBe(20);
    });

    test("закреплённые образуют префикс и стоят в слотах", () => {
        const axis = new StickyAxis([2, 5], [10, 10], [-5, 45], 30);
        expect(axis.pinnedCount).toBe(1);
        expect(axis.stickyPosition(2)).toBe(30);
        expect(axis.stickyPosition(5)).toBe(45);
        expect(axis.pinnedEnd).toBe(40);
        expect(axis.isPinned(2)).toBe(true);
        expect(axis.isPinned(5)).toBe(false);
    });

    test("второй закрепляется под первым", () => {
        const axis = new StickyAxis([2, 5], [10, 20], [-50, 5], 0);
        expect(axis.pinnedCount).toBe(2);
        expect(axis.stickyPosition(5)).toBe(10);
        expect(axis.pinnedEnd).toBe(30);
        expect(axis.pinnedAt(0)).toBe(2);
        expect(axis.pinnedAt(9)).toBe(2);
        expect(axis.pinnedAt(10)).toBe(5);
        expect(axis.pinnedAt(29)).toBe(5);
        expect(axis.pinnedAt(30)).toBeUndefined();
        expect(axis.hasPinnedIn(3, 6)).toBe(true);
        expect(axis.hasPinnedIn(3, 4)).toBe(false);
    });

    test("уже прокрученный элемент (-Infinity) закреплён", () => {
        const axis = new StickyAxis([0], [10], [Number.NEGATIVE_INFINITY], 0);
        expect(axis.pinnedCount).toBe(1);
        expect(axis.stickyPosition(0)).toBe(0);
    });
});

describe("normalizeStickyIndexes", () => {
    test("сортирует, убирает дубли и чужие индексы, сдвигает", () => {
        expect(normalizeStickyIndexes([5, 1, 5, -1, 9, 2.5, 3], 6, 1)).toEqual([2, 4, 6]);
        expect(normalizeStickyIndexes([], 3)).toBeUndefined();
        expect(normalizeStickyIndexes([7], 3)).toBeUndefined();
    });
});

describe("computeColumnLayout", () => {
    test("без липких совпадает с апстримом: префикс в слотах, полоса с cellXOffset", () => {
        const columns = makeColumns([50, 100, 100, 100, 100], [0]);
        const layout = computeColumnLayout(columns, 2, -10, 300, 1);
        expect(layout.effectiveCols.map(x => x.sourceIndex)).toEqual([0, 2, 3, 4]);
        expect(layout.drawX(0)).toBe(0);
        expect(layout.drawX(2)).toBe(40);
        expect(layout.drawX(3)).toBe(140);
        expect(layout.axis.pinnedEnd).toBe(50);
    });

    test("внутренняя липкая колонка прилипает после префикса", () => {
        // липкие 0 (префикс) и 3; прокрутили так, что колонка 3 ушла бы левее слота
        const columns = makeColumns([50, 100, 100, 100, 100, 100], [0, 3]);
        const layout = computeColumnLayout(columns, 3, -30, 300, 1);
        expect(layout.isPinned(3)).toBe(true);
        expect(layout.drawX(3)).toBe(50);
        expect(layout.axis.pinnedEnd).toBe(150);
        expect(layout.effectiveCols.map(x => x.sourceIndex)).toEqual([0, 3, 4, 5]);
        expect(layout.drawX(4)).toBe(120);
    });

    test("ещё не прилипшая липкая колонка рисуется как обычная", () => {
        const columns = makeColumns([50, 100, 100, 100, 100], [0, 3]);
        const layout = computeColumnLayout(columns, 1, 0, 400, 1);
        expect(layout.isPinned(3)).toBe(false);
        expect(layout.drawX(3)).toBe(250);
        expect(layout.axis.pinnedEnd).toBe(50);
    });

    test("колонки под закреплённой зоной не попадают в effectiveCols", () => {
        const columns = makeColumns([100, 100, 100, 100], [0, 1]);
        const layout = computeColumnLayout(columns, 0, -150, 300, 0);
        // обе липкие закреплены, зона 200px; колонка 2 с x=50 целиком под зоной? нет, до 150
        expect(layout.axis.pinnedEnd).toBe(200);
        expect(layout.effectiveCols.map(x => x.sourceIndex)).toEqual([0, 1, 3]);
    });
});

const rowHeight = (row: number) => (row % 2 === 0 ? 20 : 30);

describe("computeRowAxis", () => {
    test("строка выше cellYOffset закреплена", () => {
        const axis = computeRowAxis([1, 40], 100, 10, 0, 36, 500, rowHeight);
        expect(axis.isPinned(1)).toBe(true);
        expect(axis.stickyPosition(1)).toBe(36);
        expect(axis.pinnedEnd).toBe(66);
    });

    test("видимая строка ниже стоит на месте, дальняя — за экраном", () => {
        const axis = computeRowAxis([12, 1000], 2000, 10, 0, 36, 300, rowHeight);
        // строки 10 (20) и 11 (30) над строкой 12
        expect(axis.stickyPosition(12)).toBe(86);
        expect(axis.isPinned(12)).toBe(false);
        expect(axis.stickyPosition(1000)).toBe(Number.POSITIVE_INFINITY);
        expect(axis.pinnedEnd).toBe(36);
    });

    test("строка на cellYOffset прилипает при отрицательном translateY", () => {
        const axis = computeRowAxis([10], 100, 10, -5, 36, 300, rowHeight);
        expect(axis.isPinned(10)).toBe(true);
        expect(axis.stickyPosition(10)).toBe(36);
    });

    test("индексы вне строк игнорируются", () => {
        const axis = computeRowAxis([5, 200], 100, 0, 0, 0, 300, rowHeight);
        expect(axis.items).toEqual([5]);
    });
});

describe("StickyAxis.pinnedRun", () => {
    // липкие 2, 3 и 7 по 10px, все прилипли: слоты 0, 10, 20
    const axis = new StickyAxis(
        [2, 3, 7],
        [10, 10, 10],
        [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
        0
    );

    test("подряд прилипшие строки блока — одна полоса от первой до последней", () => {
        expect(axis.pinnedRun(2, 0, 5)).toEqual({ position: 0, size: 20 });
        expect(axis.pinnedRun(3, 0, 5)).toEqual({ position: 0, size: 20 });
    });

    test("прилипшие строки вне блока в полосу не входят", () => {
        expect(axis.pinnedRun(3, 3, 6)).toEqual({ position: 10, size: 10 });
        expect(axis.pinnedRun(7, 6, 9)).toEqual({ position: 20, size: 10 });
    });

    test("нелипкая или не прилипшая строка — undefined", () => {
        expect(axis.pinnedRun(5, 0, 9)).toBeUndefined();
        const notPinned = new StickyAxis([2], [10], [40], 0);
        expect(notPinned.pinnedRun(2, 0, 9)).toBeUndefined();
    });
});

describe("spanRowsFragment — слитый блок и липкие строки", () => {
    // блок строк 0..9 (регион), липкая строка 3 — итог внутри блока; шапка 36px
    test("начало блока уехало вверх, липкая строка прилипла: она рисует блок в полосе", () => {
        const axis = computeRowAxis([3], 100, 5, 0, 36, 500, rowHeight);
        expect(spanRowsFragment(axis, 3, true, 0, 9)).toEqual({ kind: "pinned", position: 36, size: 30 });
    });

    test("прокручиваемая часть того же блока — только фон, контент у прилипшей части", () => {
        const axis = computeRowAxis([3], 100, 5, 0, 36, 500, rowHeight);
        expect(spanRowsFragment(axis, 6, false, 0, 9)).toEqual({ kind: "scroll", hidesContent: true });
    });

    test("несколько прилипших строк блока подряд — один фрагмент на их общую высоту", () => {
        const axis = computeRowAxis([3, 4], 100, 10, 0, 36, 500, rowHeight);
        const fragment = { kind: "pinned", position: 36, size: 50 };
        expect(spanRowsFragment(axis, 3, true, 0, 9)).toEqual(fragment);
        expect(spanRowsFragment(axis, 4, true, 0, 9)).toEqual(fragment);
    });

    test("у соседних блоков свои фрагменты в полосе", () => {
        const axis = computeRowAxis([3, 12], 100, 20, 0, 36, 500, rowHeight);
        expect(spanRowsFragment(axis, 3, true, 0, 9)).toEqual({ kind: "pinned", position: 36, size: 30 });
        expect(spanRowsFragment(axis, 12, true, 10, 15)).toEqual({ kind: "pinned", position: 66, size: 20 });
    });

    test("липкая строка блока ещё не дошла до шапки — блок рисуется целиком как обычно", () => {
        const axis = computeRowAxis([3], 100, 0, 0, 36, 500, rowHeight);
        expect(spanRowsFragment(axis, 3, true, 0, 9)).toEqual({ kind: "scroll", hidesContent: false });
        expect(spanRowsFragment(axis, 0, false, 0, 9)).toEqual({ kind: "scroll", hidesContent: false });
    });

    test("без липких строк — обычный блок", () => {
        expect(spanRowsFragment(undefined, 0, false, 0, 9)).toEqual({ kind: "scroll", hidesContent: false });
    });
});
