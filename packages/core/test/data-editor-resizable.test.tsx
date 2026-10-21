/* eslint-disable sonarjs/no-duplicate-string */
import * as React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { vi, expect, describe, test, beforeEach, afterEach } from "vitest";
import type { GridColumn } from "../src/index.js";
import { EventedDataEditor, basicProps, prep, Context, standardBeforeEach, standardAfterEach } from "./test-utils.js";

// Колонка B (вторая, правая граница на x = 310) запрещает ресайз флагом
// resizable: false. Остальные колонки ведут себя как раньше.
const columnsWithFixedB: GridColumn[] = basicProps.columns.map((c, i) =>
    i === 1 ? { ...c, resizable: false } : c
);

const dragHeader = (canvas: HTMLElement, fromX: number, toX: number) => {
    fireEvent.pointerDown(canvas, { clientX: fromX, clientY: 16 });
    fireEvent.pointerMove(canvas, { clientX: toX, clientY: 16, buttons: 1 });
    fireEvent.pointerUp(canvas, { clientX: toX, clientY: 16 });
    fireEvent.click(canvas, { clientX: toX, clientY: 16 });
};

describe("data-editor: resizable у колонки", () => {
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

    test("перетаскивание правой границы колонки с resizable: false не меняет ширину", async () => {
        const spy = vi.fn();
        vi.useFakeTimers();
        render(<EventedDataEditor {...basicProps} columns={columnsWithFixedB} onColumnResize={spy} />, {
            wrapper: Context,
        });
        prep();
        const canvas = screen.getByTestId("data-grid-canvas");

        dragHeader(canvas, 310, 350);

        expect(spy).not.toHaveBeenCalled();
    });

    test("двойной клик по правой границе колонки с resizable: false не подбирает ширину", async () => {
        const spy = vi.fn();
        vi.useFakeTimers();
        render(<EventedDataEditor {...basicProps} columns={columnsWithFixedB} onColumnResize={spy} />, {
            wrapper: Context,
        });
        prep();
        const canvas = screen.getByTestId("data-grid-canvas");

        for (let i = 0; i < 2; i++) {
            fireEvent.pointerDown(canvas, { clientX: 310, clientY: 16 });
            fireEvent.pointerUp(canvas, { clientX: 310, clientY: 16 });
        }
        fireEvent.click(canvas, { clientX: 310, clientY: 16 });

        expect(spy).not.toHaveBeenCalled();
    });

    test("левая граница следующей колонки тоже не тянет колонку с resizable: false", async () => {
        const spy = vi.fn();
        vi.useFakeTimers();
        render(<EventedDataEditor {...basicProps} columns={columnsWithFixedB} onColumnResize={spy} />, {
            wrapper: Context,
        });
        prep();
        const canvas = screen.getByTestId("data-grid-canvas");

        // Колонка C начинается на x = 310, курсор чуть правее её левого края.
        dragHeader(canvas, 312, 350);

        expect(spy).not.toHaveBeenCalled();
    });

    test("соседние колонки без флага по-прежнему ресайзятся", async () => {
        const spy = vi.fn();
        vi.useFakeTimers();
        render(<EventedDataEditor {...basicProps} columns={columnsWithFixedB} onColumnResize={spy} />, {
            wrapper: Context,
        });
        prep();
        const canvas = screen.getByTestId("data-grid-canvas");

        // Правая граница колонки A на x = 150.
        dragHeader(canvas, 150, 190);

        expect(spy).toHaveBeenCalled();
        expect(spy.mock.calls[0][0]).toMatchObject({ title: "A" });
    });
});
