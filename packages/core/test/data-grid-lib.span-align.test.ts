import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react-hooks";
import {
    resolveSpanAlignment,
    getSpanTextY,
    drawSpanAlignedText,
    useMappedColumns,
    type ResolvedSpanAlignment,
} from "../src/internal/data-grid/render/data-grid-lib.js";
import type { InnerGridColumn } from "../src/internal/data-grid/data-grid-types.js";

// Минимальная заглушка canvas: запоминает вызовы fillText вместе с textAlign/textBaseline
// на момент отрисовки, и текущее состояние после вызова (чтобы проверить восстановление).
function makeStubCtx() {
    const calls: { text: string; x: number; y: number; align: CanvasTextAlign; baseline: CanvasTextBaseline }[] = [];
    const ctx = {
        textAlign: "start" as CanvasTextAlign,
        textBaseline: "alphabetic" as CanvasTextBaseline,
        fillText(text: string, x: number, y: number) {
            calls.push({ text, x, y, align: this.textAlign, baseline: this.textBaseline });
        },
    };
    return { ctx: ctx as unknown as CanvasRenderingContext2D, calls, state: ctx };
}

const draw = (align: ResolvedSpanAlignment, boxLeft = 100, boxRight = 300, y = 0, height = 40) => {
    const { ctx, calls, state } = makeStubCtx();
    drawSpanAlignedText(ctx, "Заголовок", boxLeft, boxRight, y, height, align, 3, 8);
    return { call: calls[0], state };
};

describe("resolveSpanAlignment — дефолты и перекрытие выравнивания слитой ячейки", () => {
    it("undefined → дефолт (left/center), обратная совместимость", () => {
        expect(resolveSpanAlignment(undefined)).toEqual({ horizontal: "left", vertical: "center" });
    });

    it("defaultHorizontal=center (слитые группы) применяется, когда горизонталь не задана", () => {
        expect(resolveSpanAlignment(undefined, "center")).toEqual({ horizontal: "center", vertical: "center" });
    });

    it("точечное значение перекрывает дефолт по горизонтали", () => {
        expect(resolveSpanAlignment({ horizontal: "right" }, "center")).toEqual({
            horizontal: "right",
            vertical: "center",
        });
    });

    it("частичное задание: только вертикаль → горизонталь из дефолта", () => {
        expect(resolveSpanAlignment({ vertical: "bottom" }, "center")).toEqual({
            horizontal: "center",
            vertical: "bottom",
        });
    });

    it("полное задание обеих осей", () => {
        expect(resolveSpanAlignment({ horizontal: "left", vertical: "top" })).toEqual({
            horizontal: "left",
            vertical: "top",
        });
    });
});

describe("getSpanTextY — Y базовой линии и textBaseline по вертикальному выравниванию", () => {
    const y = 100;
    const height = 60;
    const bias = 3; // условный getMiddleCenterBias
    const pad = 8;

    it("top → верх ячейки + паддинг, baseline top", () => {
        expect(getSpanTextY(y, height, "top", bias, pad)).toEqual({ y: y + pad, baseline: "top" });
    });

    it("center → прежняя формула (центр + bias), baseline alphabetic", () => {
        expect(getSpanTextY(y, height, "center", bias, pad)).toEqual({
            y: y + height / 2 + bias,
            baseline: "alphabetic",
        });
    });

    it("bottom → низ ячейки − паддинг, baseline bottom", () => {
        expect(getSpanTextY(y, height, "bottom", bias, pad)).toEqual({ y: y + height - pad, baseline: "bottom" });
    });

    it("масштабируется с высотой слитой ячейки (bottom при большей высоте)", () => {
        expect(getSpanTextY(0, 200, "bottom", 0, 10)).toEqual({ y: 190, baseline: "bottom" });
    });

    it("отрицательный bias для center учитывается", () => {
        expect(getSpanTextY(0, 40, "center", -5, 8)).toEqual({ y: 15, baseline: "alphabetic" });
    });

    it("padY больше высоты: формула не переворачивается, просто уходит за границу (фиксируем поведение)", () => {
        expect(getSpanTextY(0, 10, "bottom", 0, 20)).toEqual({ y: -10, baseline: "bottom" });
    });
});

describe("drawSpanAlignedText — позиция текста и восстановление состояния canvas", () => {
    it("left: x у левого края, baseline alphabetic (center по вертикали)", () => {
        const { call } = draw({ horizontal: "left", vertical: "center" });
        expect(call).toMatchObject({ x: 100, align: "left", baseline: "alphabetic", y: 23 }); // 40/2 + bias(3)
    });

    it("center: x в середине бокса, textAlign center", () => {
        const { call } = draw({ horizontal: "center", vertical: "center" });
        expect(call).toMatchObject({ x: 200, align: "center" });
    });

    it("right: x у правого края, textAlign right", () => {
        const { call } = draw({ horizontal: "right", vertical: "center" });
        expect(call).toMatchObject({ x: 300, align: "right" });
    });

    it("top: baseline top, y у верхнего края + padY", () => {
        const { call } = draw({ horizontal: "left", vertical: "top" });
        expect(call).toMatchObject({ baseline: "top", y: 8 });
    });

    it("bottom: baseline bottom, y у нижнего края − padY", () => {
        const { call } = draw({ horizontal: "left", vertical: "bottom" });
        expect(call).toMatchObject({ baseline: "bottom", y: 32 }); // 40 - 8
    });

    it("вырожденный бокс (boxRight < boxLeft) не инвертируется: center не уезжает влево", () => {
        // boxLeft=300, boxRight=100 → right клампится до 300, center = 300
        const { call } = draw({ horizontal: "center", vertical: "center" }, 300, 100);
        expect(call.x).toBe(300);
    });

    it("восстанавливает textAlign/textBaseline после отрисовки", () => {
        const { state } = draw({ horizontal: "right", vertical: "bottom" });
        expect(state.textAlign).toBe("start");
        expect(state.textBaseline).toBe("alphabetic");
    });
});

const col = (extra: Partial<InnerGridColumn>): InnerGridColumn =>
    ({ title: "A", width: 100, ...extra }) as InnerGridColumn;

describe("useMappedColumns — выравнивание колонки vs общий spanAlign", () => {
    it("значение колонки перекрывает общий spanAlign", () => {
        const { result } = renderHook(() =>
            useMappedColumns([col({ spanGroupHeaderAlign: { horizontal: "right" } })], 0, { horizontal: "center" })
        );
        expect(result.current[0].spanGroupHeaderAlign).toEqual({ horizontal: "right" });
    });

    it("нет значения колонки → берётся общий spanAlign", () => {
        const { result } = renderHook(() => useMappedColumns([col({})], 0, { horizontal: "center" }));
        expect(result.current[0].spanGroupHeaderAlign).toEqual({ horizontal: "center" });
    });

    it("ничего не задано → undefined", () => {
        const { result } = renderHook(() => useMappedColumns([col({})], 0));
        expect(result.current[0].spanGroupHeaderAlign).toBeUndefined();
    });
});
