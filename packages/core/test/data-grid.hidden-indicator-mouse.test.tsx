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

// Хит-тест индикатора скрытых колонок: попадание в зону границы помечает args
// полем hiddenIndicatorCol, при этом обычная edge-механика (ресайз) сохраняется.

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
    allowResize: true,
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

// Границы колонок: A|B = 150, B|C = 310, C|D = 480, D|E = 660, правый край = 850.

describe("data-grid hidden-indicator hit-test", () => {
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

    const withIndicator: DataGridProps = {
        ...basicProps,
        hiddenColumnsIndicator: col => (col === 2 ? 1 : 0),
    };

    test("попадание в зону индикатора: hiddenIndicatorCol заполнен, isEdge сохранён", () => {
        const spy = vi.fn();
        render(<DataGrid {...withIndicator} onMouseDown={spy} />);

        fireEvent.pointerDown(screen.getByTestId(dataGridCanvasId), {
            clientX: 310, // граница B|C, скрыта колонка
            clientY: 16,
        });

        // Edge-механика сохраняется: как и раньше, левая граница отдаёт предыдущую
        // колонку (для ресайза), но args дополнительно помечены индикатором.
        expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({
                kind: "header",
                location: [1, -1],
                hiddenIndicatorCol: 2,
                isEdge: true,
            })
        );
    });

    test("зона работает с обеих сторон границы", () => {
        const spy = vi.fn();
        render(<DataGrid {...withIndicator} onMouseDown={spy} />);
        const canvas = screen.getByTestId(dataGridCanvasId);

        fireEvent.pointerDown(canvas, { clientX: 306, clientY: 16 }); // слева от границы
        fireEvent.pointerDown(canvas, { clientX: 314, clientY: 16 }); // справа от границы

        expect(spy).toHaveBeenNthCalledWith(1, expect.objectContaining({ hiddenIndicatorCol: 2 }));
        expect(spy).toHaveBeenNthCalledWith(2, expect.objectContaining({ hiddenIndicatorCol: 2 }));
    });

    test("та же граница без индикатора: обычный edge без пометки", () => {
        const spy = vi.fn();
        render(<DataGrid {...basicProps} onMouseDown={spy} />);

        fireEvent.pointerDown(screen.getByTestId(dataGridCanvasId), {
            clientX: 310,
            clientY: 16,
        });

        expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({
                kind: "header",
                isEdge: true,
            })
        );
        expect(spy.mock.calls[0][0].hiddenIndicatorCol).toBeUndefined();
    });

    test("другая граница при включённом индикаторе остаётся обычным edge", () => {
        const spy = vi.fn();
        render(<DataGrid {...withIndicator} onMouseDown={spy} />);

        fireEvent.pointerDown(screen.getByTestId(dataGridCanvasId), {
            clientX: 480, // граница C|D, скрытых нет
            clientY: 16,
        });

        expect(spy).toHaveBeenCalledWith(expect.objectContaining({ kind: "header", isEdge: true }));
        expect(spy.mock.calls[0][0].hiddenIndicatorCol).toBeUndefined();
    });

    test("несколько скрытых подряд: полоска одна, зона та же", () => {
        const spy = vi.fn();
        render(
            <DataGrid {...basicProps} hiddenColumnsIndicator={col => (col === 2 ? 5 : 0)} onMouseDown={spy} />
        );
        const canvas = screen.getByTestId(dataGridCanvasId);

        fireEvent.pointerDown(canvas, { clientX: 310, clientY: 16 });
        fireEvent.pointerDown(canvas, { clientX: 330, clientY: 16 }); // далеко от границы

        expect(spy).toHaveBeenNthCalledWith(1, expect.objectContaining({ hiddenIndicatorCol: 2 }));
        expect(spy.mock.calls[1][0].hiddenIndicatorCol).toBeUndefined();
    });

    test("скрыта первая колонка: индикатор на левом краю таблицы", () => {
        const spy = vi.fn();
        render(<DataGrid {...basicProps} hiddenColumnsIndicator={col => (col === 0 ? 1 : 0)} onMouseDown={spy} />);

        fireEvent.pointerDown(screen.getByTestId(dataGridCanvasId), {
            clientX: 2,
            clientY: 16,
        });

        expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({ kind: "header", hiddenIndicatorCol: 0, isEdge: false })
        );
    });

    test("скрыта последняя колонка: индикатор на правом краю последней видимой", () => {
        const spy = vi.fn();
        render(<DataGrid {...basicProps} hiddenColumnsIndicator={col => (col === 5 ? 1 : 0)} onMouseDown={spy} />);

        fireEvent.pointerDown(screen.getByTestId(dataGridCanvasId), {
            clientX: 848, // правый край E = 850, полоска растёт влево
            clientY: 16,
        });

        expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({ kind: "header", hiddenIndicatorCol: 5, isEdge: true })
        );
    });

    const groupedCols = [
        { title: "A", width: 150, group: "P" },
        { title: "B", width: 160, group: "P" },
        { title: "C", width: 170, group: "Q" },
    ];

    test("число (groupDepth 0): полоса на всю высоту, ловим и в групп-ряду, и в листовом", () => {
        const spy = vi.fn();
        render(
            <DataGrid
                {...basicProps}
                enableGroups={true}
                groupHeaderHeight={30}
                columns={groupedCols}
                hiddenColumnsIndicator={col => (col === 1 ? 1 : 0)}
                onMouseDown={spy}
            />
        );

        // Групповой ряд (y 0..30): ловим (полоса на всю высоту).
        fireEvent.pointerDown(screen.getByTestId(dataGridCanvasId), { clientX: 150, clientY: 15 });
        expect(spy).toHaveBeenLastCalledWith(expect.objectContaining({ hiddenIndicatorCol: 1 }));

        // Листовой ряд (y >= 30): тоже ловим.
        fireEvent.pointerDown(screen.getByTestId(dataGridCanvasId), { clientX: 150, clientY: 45 });
        expect(spy).toHaveBeenLastCalledWith(expect.objectContaining({ kind: "header", hiddenIndicatorCol: 1 }));
    });

    test("groupDepth пропускает верхние групп-ряды: ловим только в листовом", () => {
        const spy = vi.fn();
        render(
            <DataGrid
                {...basicProps}
                enableGroups={true}
                groupHeaderHeight={30}
                columns={groupedCols}
                // groupDepth 1: пропустить 1 групп-ряд, полоса только в листовом ряду.
                hiddenColumnsIndicator={col => (col === 1 ? { count: 1, groupDepth: 1 } : 0)}
                onMouseDown={spy}
            />
        );

        // Групповой ряд (y 0..30): НЕ ловим.
        fireEvent.pointerDown(screen.getByTestId(dataGridCanvasId), { clientX: 150, clientY: 15 });
        expect(spy.mock.calls[0][0].hiddenIndicatorCol).toBeUndefined();

        // Листовой ряд (y >= 30): ловим.
        fireEvent.pointerDown(screen.getByTestId(dataGridCanvasId), { clientX: 150, clientY: 45 });
        expect(spy).toHaveBeenLastCalledWith(expect.objectContaining({ kind: "header", hiddenIndicatorCol: 1 }));
    });

    test("большая полоса даёт грань ресайза левой колонки в групп-ряду", () => {
        const spy = vi.fn();
        render(
            <DataGrid
                {...basicProps}
                enableGroups={true}
                groupHeaderHeight={30}
                columns={groupedCols}
                hiddenColumnsIndicator={col => (col === 1 ? 1 : 0)}
                onMouseDown={spy}
            />
        );

        // Групп-ряд (y 0..30) на границе A|B (x 150): в групп-ряду ресайза обычно нет,
        // но большая полоса отдаёт грань ресайза левой колонки.
        fireEvent.pointerDown(screen.getByTestId(dataGridCanvasId), { clientX: 150, clientY: 15 });
        expect(spy).toHaveBeenLastCalledWith(
            expect.objectContaining({
                kind: "header",
                location: [0, -1],
                isEdge: true,
                hiddenIndicatorCol: 1,
            })
        );
    });

    test("маленькая полоса грань ресайза в групп-ряду не даёт", () => {
        const spy = vi.fn();
        render(
            <DataGrid
                {...basicProps}
                enableGroups={true}
                groupHeaderHeight={30}
                columns={groupedCols}
                // groupDepth 1: полоса только в листовом ряду, в групп-ряду её нет.
                hiddenColumnsIndicator={col => (col === 1 ? { count: 1, groupDepth: 1 } : 0)}
                onMouseDown={spy}
            />
        );

        // Групп-ряд: полосы тут нет, поэтому обычный групповой хит без грани ресайза.
        fireEvent.pointerDown(screen.getByTestId(dataGridCanvasId), { clientX: 150, clientY: 15 });
        const args = spy.mock.calls[0][0];
        expect(args.hiddenIndicatorCol).toBeUndefined();
        expect(args.kind).toBe("group-header");
    });

    test("клик по ячейке тела на той же вертикали индикатор не задевает", () => {
        const spy = vi.fn();
        render(<DataGrid {...withIndicator} onMouseDown={spy} />);

        fireEvent.pointerDown(screen.getByTestId(dataGridCanvasId), {
            clientX: 310,
            clientY: 36 + 16, // первая строка тела
        });

        expect(spy).toHaveBeenCalledWith(expect.objectContaining({ kind: "cell" }));
        expect(spy.mock.calls[0][0].hiddenIndicatorCol).toBeUndefined();
    });
});
