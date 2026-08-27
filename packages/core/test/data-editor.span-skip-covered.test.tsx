/* eslint-disable sonarjs/no-duplicate-string */
import * as React from "react";
import { render, fireEvent, screen, act } from "@testing-library/react";
import { CompactSelection, DataEditor, type GridCell, type Item } from "../src/index.js";
import { vi, expect, describe, test, beforeEach, afterEach } from "vitest";
import {
    basicProps,
    Context,
    EventedDataEditor,
    makeCell,
    prep,
    sendClick,
    standardAfterEach,
    standardBeforeEach,
} from "./test-utils.js";

// Массовые операции (delete/fill/paste) не должны писать в покрытые ячейки слитого
// блока: значение получает только origin, остальные координаты блока пропускаются.

// Блок: колонки 1-2, строки 1-2, origin (1,1).
function spanMakeCell(cell: Item): GridCell {
    const [col, row] = cell;
    const base = makeCell(cell);
    if (col >= 1 && col <= 2 && row >= 1 && row <= 2) {
        return { ...base, span: [1, 2], spanRows: [1, 2] } as GridCell;
    }
    return base;
}

const spanProps = {
    ...basicProps,
    getCellContent: spanMakeCell,
};

describe("массовые операции пропускают покрытые ячейки слитого блока", () => {
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

    test("Delete по диапазону блока чистит только origin", () => {
        const editSpy = vi.fn();
        vi.useFakeTimers();
        render(
            <DataEditor
                {...spanProps}
                onCellEdited={editSpy}
                gridSelection={{
                    columns: CompactSelection.empty(),
                    rows: CompactSelection.empty(),
                    current: {
                        cell: [1, 1],
                        range: { x: 1, y: 1, width: 2, height: 2 },
                        rangeStack: [],
                    },
                }}
            />,
            { wrapper: Context }
        );
        prep(false);

        const canvas = screen.getByTestId("data-grid-canvas");
        fireEvent.keyDown(canvas, { key: "Delete" });
        act(() => {
            vi.runAllTimers();
        });

        expect(editSpy.mock.calls.map(c => c[0])).toEqual([[1, 1]]);
    });

    test("Fill down не пишет в покрытые ячейки блока", () => {
        const editSpy = vi.fn();
        vi.useFakeTimers();
        render(
            <EventedDataEditor
                {...spanProps}
                keybindings={{ downFill: true }}
                onCellEdited={editSpy}
            />,
            { wrapper: Context }
        );
        prep();

        const canvas = screen.getByTestId("data-grid-canvas");
        // Клик по origin: выделение нормализуется и расширяется на весь блок (строки 1-2).
        sendClick(canvas, {
            clientX: 230, // колонка B
            clientY: 36 + 32 + 16, // строка 1
        });
        // Shift-клик вниз: диапазон колонки 1-2, строки 1-4.
        sendClick(canvas, {
            shiftKey: true,
            clientX: 400, // колонка C
            clientY: 36 + 32 * 4 + 16, // строка 4
        });

        fireEvent.keyDown(canvas, {
            keyCode: 68,
            ctrlKey: true,
        });

        const locations = editSpy.mock.calls.map(c => c[0]);
        // Паттерн-строка (1) не перезаписывается, покрытые (строка 2) пропущены.
        expect(locations).toEqual(
            expect.arrayContaining([
                [1, 3],
                [2, 3],
                [1, 4],
                [2, 4],
            ])
        );
        expect(locations).toHaveLength(4);
    });

    test("Paste в блок пишет только в origin", async () => {
        const editSpy = vi.fn();
        vi.useFakeTimers();
        render(<EventedDataEditor {...spanProps} onCellEdited={editSpy} />, { wrapper: Context });
        prep(false);

        // 2x2 вставка накрывает весь блок.
        Object.assign(navigator, {
            clipboard: {
                ...navigator.clipboard,
                readText: vi.fn(() => Promise.resolve("a\tb\nc\td")),
            },
        });

        const canvas = screen.getByTestId("data-grid-canvas");
        vi.spyOn(document, "activeElement", "get").mockImplementation(() => canvas);
        sendClick(canvas, {
            clientX: 230, // колонка B
            clientY: 36 + 32 + 16, // строка 1 (origin блока)
        });
        act(() => {
            vi.runAllTimers();
        });

        fireEvent.paste(window);
        await act(async () => {
            vi.runAllTimers();
            await Promise.resolve();
        });

        expect(editSpy.mock.calls.map(c => c[0])).toEqual([[1, 1]]);
    });
});
