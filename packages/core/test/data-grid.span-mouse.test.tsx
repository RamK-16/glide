/* eslint-disable sonarjs/no-duplicate-string */
import * as React from "react";
import { render, fireEvent, screen, cleanup } from "@testing-library/react";
import DataGrid, { type DataGridProps } from "../src/internal/data-grid/data-grid.js";
import { CompactSelection, GridCellKind } from "../src/internal/data-grid/data-grid-types.js";
import { getDefaultTheme } from "../src/index.js";
import { AllCellRenderers } from "../src/cells/index.js";
import { vi, expect, describe, test, beforeEach, afterEach } from "vitest";
import ImageWindowLoaderImpl from "../src/common/image-window-loader.js";
import { mergeAndRealizeTheme } from "../src/common/styles.js";
import { standardBeforeEach } from "./test-utils.js";

// Хит-тест мыши по объединённым областям: клик в любую точку слитого блока тела
// нормализуется к origin, слитая колонка шапки бьётся как header на всю высоту,
// нижние (пустые) уровни слитой группы бьются как её верхний уровень.

const basicProps: DataGridProps = {
    cellXOffset: 0,
    cellYOffset: 0,
    drawGroupHeader: undefined,
    headerIcons: undefined,
    isDraggable: undefined,
    onCanvasBlur: () => undefined,
    onCanvasFocused: () => undefined,
    onCellFocused: () => undefined,
    onContextMenu: () => undefined,
    onDragEnd: () => undefined,
    onDragLeave: () => undefined,
    onDragOverCell: () => undefined,
    onDragStart: () => undefined,
    onDrop: () => undefined,
    onHeaderIndicatorClick: () => undefined,
    onItemHovered: () => undefined,
    onKeyDown: () => undefined,
    onKeyUp: () => undefined,
    onMouseDown: () => undefined,
    onMouseMoveRaw: () => undefined,
    onMouseUp: () => undefined,
    smoothScrollX: undefined,
    smoothScrollY: undefined,
    allowResize: undefined,
    canvasRef: undefined,
    disabledRows: undefined,
    eventTargetRef: undefined,
    fillHandle: undefined,
    fixedShadowX: undefined,
    fixedShadowY: undefined,
    getGroupDetails: undefined,
    getRowThemeOverride: undefined,
    highlightRegions: undefined,
    imageWindowLoader: new ImageWindowLoaderImpl(),
    onHeaderMenuClick: undefined,
    prelightCells: undefined,
    translateX: undefined,
    translateY: undefined,
    dragAndDropState: undefined,
    drawFocusRing: true,
    drawHeader: undefined,
    drawCell: undefined,
    isFocused: true,
    experimental: undefined,
    columns: [
        { title: "A", width: 150 },
        { title: "B", width: 160 },
        { title: "C", width: 170 },
        { title: "D", width: 180 },
        { title: "E", width: 190 },
    ],
    isFilling: false,
    enableGroups: false,
    theme: mergeAndRealizeTheme(getDefaultTheme()),
    freezeColumns: 0,
    selection: {
        current: undefined,
        rows: CompactSelection.empty(),
        columns: CompactSelection.empty(),
    },
    firstColAccessible: true,
    onMouseMove: () => undefined,
    getCellContent: cell => ({
        kind: GridCellKind.Text,
        allowOverlay: false,
        data: `${cell[0]},${cell[1]}`,
        displayData: `${cell[0]},${cell[1]}`,
    }),
    groupHeaderHeight: 0,
    headerHeight: 36,
    accessibilityHeight: 50,
    height: 1000,
    width: 1000,
    isDragging: false,
    isResizing: false,
    resizeColumn: undefined,
    freezeTrailingRows: 0,
    hasAppendRow: false,
    rowHeight: 32,
    rows: 1000,
    verticalBorder: () => true,
    getCellRenderer: cell => {
        if (cell.kind === GridCellKind.Custom) return undefined;
        return AllCellRenderers.find(x => x.kind === cell.kind) as any;
    },
    resizeIndicator: "full",
};

const dataGridCanvasId = "data-grid-canvas";

describe("data-grid span mouse hit-test", () => {
    beforeEach(() => {
        standardBeforeEach();

        Element.prototype.getBoundingClientRect = () => ({
            bottom: 1000,
            height: 1000,
            left: 0,
            right: 1000,
            top: 0,
            width: 1000,
            x: 0,
            y: 0,
            toJSON: () => "",
        });
        Image.prototype.decode = vi.fn();
    });

    afterEach(() => {
        cleanup();
    });

    // Блок тела: колонки 1-2 (B: 150-310, C: 310-480), строки 1-2, origin (1,1).
    const spanProps: DataGridProps = {
        ...basicProps,
        getCellContent: cell => {
            const [c, r] = cell;
            const merged = c >= 1 && c <= 2 && r >= 1 && r <= 2;
            return {
                kind: GridCellKind.Text,
                allowOverlay: false,
                data: `${c},${r}`,
                displayData: `${c},${r}`,
                ...(merged ? { span: [1, 2] as const, spanRows: [1, 2] as const } : {}),
            };
        },
    };

    test("клик по покрытой ячейке блока нормализуется к origin", () => {
        const spy = vi.fn();
        render(<DataGrid {...spanProps} onMouseDown={spy} />);

        fireEvent.pointerDown(screen.getByTestId(dataGridCanvasId), {
            clientX: 350, // колонка C (покрытая)
            clientY: 36 + 32 * 2 + 16, // строка 2 (покрытая)
        });

        expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({
                kind: "cell",
                location: [1, 1],
            })
        );
    });

    test("клик по самому origin даёт origin", () => {
        const spy = vi.fn();
        render(<DataGrid {...spanProps} onMouseDown={spy} />);

        fireEvent.pointerDown(screen.getByTestId(dataGridCanvasId), {
            clientX: 200, // колонка B
            clientY: 36 + 32 + 16, // строка 1
        });

        expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({
                kind: "cell",
                location: [1, 1],
            })
        );
    });

    test("клик вне блока не нормализуется", () => {
        const spy = vi.fn();
        render(<DataGrid {...spanProps} onMouseDown={spy} />);

        fireEvent.pointerDown(screen.getByTestId(dataGridCanvasId), {
            clientX: 500, // колонка D
            clientY: 36 + 32 * 4 + 16, // строка 4
        });

        expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({
                kind: "cell",
                location: [3, 4],
            })
        );
    });

    test("слитая колонка шапки: клик в групповой зоне бьётся как header", () => {
        const spy = vi.fn();
        render(
            <DataGrid
                {...basicProps}
                enableGroups={true}
                groupHeaderHeight={30}
                columns={[
                    { title: "A", width: 150, spanGroupHeader: true },
                    { title: "B", width: 160, group: "P" },
                    { title: "C", width: 170, group: "P" },
                ]}
                onMouseDown={spy}
            />
        );

        fireEvent.pointerDown(screen.getByTestId(dataGridCanvasId), {
            clientX: 75, // слитая колонка A
            clientY: 15, // групповая зона
        });

        expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({
                kind: "header",
                location: [0, -1],
            })
        );
    });

    test("обычная колонка в групповой зоне бьётся как group-header", () => {
        const spy = vi.fn();
        render(
            <DataGrid
                {...basicProps}
                enableGroups={true}
                groupHeaderHeight={30}
                columns={[
                    { title: "A", width: 150, spanGroupHeader: true },
                    { title: "B", width: 160, group: "P" },
                    { title: "C", width: 170, group: "P" },
                ]}
                onMouseDown={spy}
            />
        );

        fireEvent.pointerDown(screen.getByTestId(dataGridCanvasId), {
            clientX: 200, // колонка B
            clientY: 15,
        });

        expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({
                kind: "group-header",
                location: [1, -2],
            })
        );
    });

    // Двухуровневые группы: "G" терминальна и слита вниз, "H"→"S" глубокая.
    const spannedGroupProps: Partial<DataGridProps> = {
        enableGroups: true,
        groupHeaderHeight: 30,
        columns: [
            { title: "A", width: 150, group: "G" },
            { title: "B", width: 160, group: ["H", "S"] },
        ],
        getGroupDetails: name => (name === "G" ? { name, span: true } : { name }),
    };

    test("слитая группа: клик по её нижнему (пустому) уровню бьётся как верхний уровень", () => {
        const spy = vi.fn();
        render(<DataGrid {...basicProps} {...spannedGroupProps} onMouseDown={spy} />);

        fireEvent.pointerDown(screen.getByTestId(dataGridCanvasId), {
            clientX: 75, // колонка A (группа G)
            clientY: 45, // второй групп-ряд (30-60)
        });

        expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({
                kind: "group-header",
                location: [0, -2],
            })
        );
    });

    test("глубокая группа: клик по её нижнему уровню остаётся на нижнем уровне", () => {
        const spy = vi.fn();
        render(<DataGrid {...basicProps} {...spannedGroupProps} onMouseDown={spy} />);

        fireEvent.pointerDown(screen.getByTestId(dataGridCanvasId), {
            clientX: 200, // колонка B (группа H→S)
            clientY: 45,
        });

        expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({
                kind: "group-header",
                location: [1, -3],
            })
        );
    });
});
