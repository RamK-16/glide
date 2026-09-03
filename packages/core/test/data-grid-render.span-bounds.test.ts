import { describe, expect, it } from "vitest";
import {
    getSpanBounds,
    resolveHorizontalSpanArea,
} from "../src/internal/data-grid/render/data-grid-render.walk.js";
import type { MappedGridColumn } from "../src/internal/data-grid/render/data-grid-lib.js";

function col(partial: Partial<MappedGridColumn>): MappedGridColumn {
    return { title: "", width: 100, sourceIndex: 0, sticky: false, ...partial } as unknown as MappedGridColumn;
}

// Сетка без freeze: 4 колонки по 100px.
const plainCols: MappedGridColumn[] = [
    col({ sourceIndex: 0 }),
    col({ sourceIndex: 1 }),
    col({ sourceIndex: 2 }),
    col({ sourceIndex: 3 }),
];

// Сетка с freeze: первые две колонки sticky.
const frozenCols: MappedGridColumn[] = [
    col({ sourceIndex: 0, sticky: true }),
    col({ sourceIndex: 1, sticky: true }),
    col({ sourceIndex: 2 }),
    col({ sourceIndex: 3 }),
];

describe("getSpanBounds — геометрия colspan-блока с учётом freeze-областей", () => {
    it("без sticky-колонок: только contentRect на суммарную ширину спана", () => {
        const [frozen, content] = getSpanBounds([1, 2], 100, 50, 100, 32, plainCols[1], plainCols);
        expect(frozen).toBeUndefined();
        expect(content).toEqual({ x: 100, y: 50, width: 200, height: 32 });
    });

    it("вызов из средней колонки спана даёт тот же прямоугольник (x сдвигается влево)", () => {
        const fromFirst = getSpanBounds([1, 2], 100, 50, 100, 32, plainCols[1], plainCols)[1];
        const fromSecond = getSpanBounds([1, 2], 200, 50, 100, 32, plainCols[2], plainCols)[1];
        expect(fromSecond).toEqual(fromFirst);
    });

    it("спан целиком во frozen-области: только frozenRect", () => {
        const [frozen, content] = getSpanBounds([0, 1], 0, 0, 100, 32, frozenCols[0], frozenCols);
        expect(content).toBeUndefined();
        expect(frozen).toEqual({ x: 0, y: 0, width: 200, height: 32 });
    });

    it("спан через границу freeze: обе области определены", () => {
        const [frozen, content] = getSpanBounds([1, 3], 100, 0, 100, 32, frozenCols[1], frozenCols);
        expect(frozen).toBeDefined();
        expect(content).toBeDefined();
        // Frozen-часть покрывает только колонку 1 (renderToCol клэмпится к границе freeze).
        expect(frozen).toEqual({ x: 100, y: 0, width: 100, height: 32 });
    });

    it("спан из одной колонки: contentRect совпадает с исходной ячейкой", () => {
        const [frozen, content] = getSpanBounds([2, 2], 200, 10, 100, 32, plainCols[2], plainCols);
        expect(frozen).toBeUndefined();
        expect(content).toEqual({ x: 200, y: 10, width: 100, height: 32 });
    });
});

describe("resolveHorizontalSpanArea — видимая горизонтальная часть блока", () => {
    it("без спана возвращает исходные drawX/colWidth как есть", () => {
        const r = resolveHorizontalSpanArea(undefined, 300, 100, plainCols[3], plainCols);
        expect(r).toEqual({ hx: 300, hw: 100, horizontalOk: true, skipContents: false });
    });

    it("colspan без freeze: ширина всего блока, skipContents=false", () => {
        const r = resolveHorizontalSpanArea([1, 2], 100, 100, plainCols[1], plainCols);
        expect(r.hx).toBe(100);
        expect(r.hw).toBe(200);
        expect(r.horizontalOk).toBe(true);
        expect(r.skipContents).toBe(false);
    });

    it("не-sticky колонка при спане с frozen-частью: skipContents=true (контент уже нарисован во frozen)", () => {
        const r = resolveHorizontalSpanArea([1, 3], 200, 100, frozenCols[2], frozenCols);
        expect(r.skipContents).toBe(true);
        expect(r.horizontalOk).toBe(true);
    });

    it("sticky-колонка берёт frozen-область блока", () => {
        const r = resolveHorizontalSpanArea([0, 1], 0, 100, frozenCols[0], frozenCols);
        expect(r.hx).toBe(0);
        expect(r.hw).toBe(200);
        expect(r.horizontalOk).toBe(true);
    });

    it("защитная ветка: спан не даёт области для колонки → horizontalOk=false", () => {
        // Некорректные данные: спан целиком во frozen-зоне, а колонка scrollable.
        const r = resolveHorizontalSpanArea([0, 1], 300, 100, frozenCols[3], frozenCols);
        expect(r.horizontalOk).toBe(false);
    });
});
