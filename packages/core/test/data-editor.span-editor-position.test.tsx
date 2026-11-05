import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { CompactSelection, DataEditor, GridCellKind, type GridCell, type Item } from "../src/index.js";
import type { Rectangle } from "../src/internal/data-grid/data-grid-types.js";
import { basicProps, Context, prep, standardAfterEach, standardBeforeEach } from "./test-utils.js";

// Настоящий DataEditor: куда встаёт редактор объединённого блока.
// Область: шапка 36, строки 32, высота грида 1000.

const ROW_HEIGHT = 32;
const HEADER_HEIGHT = 36;
const GRID_HEIGHT = 1000;
const ROWS = 100;

describe("редактор объединённого блока", () => {
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

    const openEditor = async (
        spanRows: readonly [number, number],
        stickyContentHeight: number | undefined,
        cellRow: number,
        extra: Partial<React.ComponentProps<typeof DataEditor>>,
        vertical: "top" | "bottom" = "top"
    ) => {
        vi.useFakeTimers();
        let target: Rectangle | undefined;
        const Editor = (p: { target: Rectangle }) => {
            target = p.target;
            return null;
        };
        const getCellContent = ([col, row]: Item): GridCell =>
            col === 0 && row >= spanRows[0] && row <= spanRows[1]
                ? {
                      kind: GridCellKind.Custom,
                      allowOverlay: true,
                      copyData: "",
                      data: {},
                      spanRows,
                      spanAlign: {
                          vertical,
                          sticky: true,
                          ...(stickyContentHeight !== undefined && { stickyContentHeight }),
                      },
                  }
                : { kind: GridCellKind.Text, allowOverlay: false, data: "", displayData: "" };

        render(
            <DataEditor
                {...basicProps}
                {...extra}
                gridSelection={{
                    current: {
                        cell: [0, cellRow],
                        range: { x: 0, y: cellRow, width: 1, height: 1 },
                        rangeStack: [],
                    },
                    columns: CompactSelection.empty(),
                    rows: CompactSelection.empty(),
                }}
                rows={ROWS}
                rowHeight={ROW_HEIGHT}
                headerHeight={HEADER_HEIGHT}
                getCellContent={getCellContent}
                customRenderers={[
                    {
                        kind: GridCellKind.Custom,
                        isMatch: (_c): _c is any => true,
                        draw: () => true,
                        provideEditor: () => ({ editor: Editor as any }),
                    },
                ]}
            />,
            { wrapper: Context }
        );
        prep();
        const canvas = screen.getByTestId("data-grid-canvas");
        fireEvent.keyDown(canvas, { keyCode: 74, key: "j" });
        await act(() => new Promise(r => window.setTimeout(r, 500)));
        return target;
    };

    test("закреплённые строки: редактор там, где нарисован блок", async () => {
        const target = await openEditor([0, 2], undefined, 0, { stickyRows: [0, 1, 2] });

        expect(target).toBeDefined();
        expect(target?.y).toBeLessThanOrEqual(HEADER_HEIGHT + 2);
    });

    test("область прокрутки: низ содержимого ниже грида, редактор остаётся над низом области", async () => {
        // Блок 1600px, содержимое 1200: нарисовано до 1237, грид заканчивается на 1000.
        const target = await openEditor([0, 49], 1200, 0, {}, "bottom");

        expect(target).toBeDefined();
        expect(target?.y).toBeLessThan(GRID_HEIGHT);
    });
});
