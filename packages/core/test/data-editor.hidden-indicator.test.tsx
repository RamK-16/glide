/* eslint-disable sonarjs/no-duplicate-string */
import * as React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { vi, expect, describe, test, beforeEach, afterEach } from "vitest";
import { EventedDataEditor, basicProps, prep, Context, standardBeforeEach, standardAfterEach } from "./test-utils.js";

// Поведение DataEditor на индикаторе скрытых колонок: ресайз перетаскиванием на
// этой границе работает как обычно, двойной клик раскрывает промежуток вместо
// автосайза, одиночный клик не выделяет колонку и не зовёт onHeaderClicked.

// Граница A|B у basicProps на x=150 (A: 150, B: 160). В пользовательских индексах это col 1.
const indicatorProps = {
    ...basicProps,
    hiddenColumnsIndicator: (col: number) => (col === 1 ? 2 : 0),
};

function clickAt(canvas: Element, clientX: number, clientY = 16) {
    fireEvent.pointerDown(canvas, { clientX, clientY });
    fireEvent.pointerUp(canvas, { clientX, clientY });
    fireEvent.click(canvas, { clientX, clientY });
}

describe("data-editor hidden-indicator", () => {
    vi.mock("../src/common/resize-detector", () => {
        return {
            useResizeDetector: () => ({ ref: undefined, width: 1000, height: 1000 }),
        };
    });

    beforeEach(() => {
        standardBeforeEach();
    });

    afterEach(() => {
        standardAfterEach();
    });

    test("одиночный клик: нет onHeaderClicked и нет выделения колонки", () => {
        const headerSpy = vi.fn();
        const selectionSpy = vi.fn();
        vi.useFakeTimers();
        render(
            <EventedDataEditor
                {...indicatorProps}
                onHeaderClicked={headerSpy}
                onGridSelectionChange={selectionSpy}
            />,
            { wrapper: Context }
        );
        prep(false);
        const canvas = screen.getByTestId("data-grid-canvas");

        clickAt(canvas, 150);

        expect(headerSpy).not.toHaveBeenCalled();
        expect(selectionSpy).not.toHaveBeenCalled();
    });

    test("двойной клик: onHiddenColumnsIndicatorClicked вместо автосайза", () => {
        const spy = vi.fn();
        const headerSpy = vi.fn();
        const resizeSpy = vi.fn();
        vi.useFakeTimers();
        render(
            <EventedDataEditor
                {...indicatorProps}
                onHiddenColumnsIndicatorClicked={spy}
                onHeaderClicked={headerSpy}
                onColumnResize={resizeSpy}
            />,
            { wrapper: Context }
        );
        prep(false);
        const canvas = screen.getByTestId("data-grid-canvas");

        clickAt(canvas, 150);
        clickAt(canvas, 150);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(1, expect.objectContaining({ isDoubleClick: true }));
        expect(headerSpy).not.toHaveBeenCalled();
        expect(resizeSpy).not.toHaveBeenCalled();
    });

    test("двойной клик на обычной границе: автосайз работает как раньше", () => {
        const spy = vi.fn();
        const resizeSpy = vi.fn();
        vi.useFakeTimers();
        render(
            <EventedDataEditor
                {...indicatorProps}
                onHiddenColumnsIndicatorClicked={spy}
                onColumnResize={resizeSpy}
            />,
            { wrapper: Context }
        );
        prep(false);
        const canvas = screen.getByTestId("data-grid-canvas");

        // Граница B|C = 310, индикатора там нет.
        clickAt(canvas, 310);
        clickAt(canvas, 310);

        expect(spy).not.toHaveBeenCalled();
        expect(resizeSpy).toHaveBeenCalled();
    });

    test("ресайз перетаскиванием на границе с индикатором работает", () => {
        const resizeSpy = vi.fn();
        vi.useFakeTimers();
        render(<EventedDataEditor {...indicatorProps} onColumnResize={resizeSpy} />, {
            wrapper: Context,
        });
        prep(false);
        const canvas = screen.getByTestId("data-grid-canvas");

        fireEvent.pointerDown(canvas, { clientX: 150, clientY: 16 });
        fireEvent.pointerMove(canvas, { clientX: 200, clientY: 16, buttons: 1 });
        fireEvent.pointerUp(canvas, { clientX: 200, clientY: 16 });
        fireEvent.click(canvas, { clientX: 200, clientY: 16 });

        expect(resizeSpy).toHaveBeenCalled();
        // Тянем правую границу колонки A: ширина 150 + 50.
        expect(resizeSpy).toHaveBeenCalledWith(expect.objectContaining({ title: "A" }), 200, 0, 200);
    });

    test("сгруппированная шапка, число = полная высота: двойной клик в групп-ряду раскрывает", () => {
        const spy = vi.fn();
        vi.useFakeTimers();
        render(
            <EventedDataEditor
                {...indicatorProps}
                columns={basicProps.columns.map(c => ({ ...c, group: "G" }))}
                onHiddenColumnsIndicatorClicked={spy}
            />,
            { wrapper: Context }
        );
        prep(false);
        const canvas = screen.getByTestId("data-grid-canvas");

        // Число (полная высота): двойной клик в групп-ряду (y<32) раскрывает промежуток.
        clickAt(canvas, 150, 16);
        clickAt(canvas, 150, 16);
        expect(spy).toHaveBeenCalledWith(1, expect.objectContaining({ isDoubleClick: true }));
    });

    test("сгруппированная шапка, groupDepth: полоса в листовом ряду, в групп-ряду не реагируем", () => {
        const spy = vi.fn();
        vi.useFakeTimers();
        render(
            <EventedDataEditor
                {...basicProps}
                columns={basicProps.columns.map(c => ({ ...c, group: "G" }))}
                hiddenColumnsIndicator={(col: number) => (col === 1 ? { count: 2, groupDepth: 1 } : 0)}
                onHiddenColumnsIndicatorClicked={spy}
            />,
            { wrapper: Context }
        );
        prep(false);
        const canvas = screen.getByTestId("data-grid-canvas");

        // Групповой ряд (y<32): по индикатору не реагируем.
        clickAt(canvas, 150, 16);
        clickAt(canvas, 150, 16);
        expect(spy).not.toHaveBeenCalled();

        // Листовой ряд (y 32..68): двойной клик раскрывает промежуток.
        clickAt(canvas, 150, 50);
        clickAt(canvas, 150, 50);
        expect(spy).toHaveBeenCalledWith(1, expect.objectContaining({ isDoubleClick: true }));
    });

    test("обычный клик по шапке вне индикатора работает как раньше", () => {
        const headerSpy = vi.fn();
        vi.useFakeTimers();
        render(<EventedDataEditor {...indicatorProps} onHeaderClicked={headerSpy} />, {
            wrapper: Context,
        });
        prep(false);
        const canvas = screen.getByTestId("data-grid-canvas");

        // Середина колонки A, далеко от границ. Групповых рядов нет,
        // у basicProps групп нет, шапка начинается с y=0.
        clickAt(canvas, 75);

        expect(headerSpy).toHaveBeenCalledWith(0, expect.anything());
    });
});
