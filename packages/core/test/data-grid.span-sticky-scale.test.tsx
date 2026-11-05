import * as React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import DataGrid, { type DataGridProps, type DataGridRef } from "../src/internal/data-grid/data-grid.js";
import { CompactSelection, GridCellKind } from "../src/internal/data-grid/data-grid-types.js";
import { stickySpanContentBox } from "../src/internal/data-grid/render/data-grid-render.cells.js";
import { AllCellRenderers } from "../src/cells/index.js";
import { getDefaultTheme } from "../src/index.js";
import { mergeAndRealizeTheme } from "../src/common/styles.js";
import ImageWindowLoaderImpl from "../src/common/image-window-loader.js";
import { standardBeforeEach } from "./test-utils.js";

// При CSS transform: scale(...) клик, наведение и редактор считают границы содержимого
// в координатах страницы, отрисовка в логических пикселях. Прямоугольник должен совпасть.

const WIDTH = 1000;
const HEIGHT = 500;
const HEADER_HEIGHT = 36;
const ROW_HEIGHT = 32;
const CONTENT_HEIGHT = 100;
// Границы glide на 1px ниже отрисовки при любом масштабе, к масштабированию не относится.
const BOUNDS_OFFSET = 1;

// Блок в строках 0-9, колонка 0, семь строк над шапкой: виден низ блока, 95px.
const CELL_Y_OFFSET = 7;
const LOGICAL_BLOCK_Y = HEADER_HEIGHT - CELL_Y_OFFSET * ROW_HEIGHT;
const LOGICAL_BLOCK_HEIGHT = 10 * ROW_HEIGHT;

const props: DataGridProps = {
    cellXOffset: 0,
    cellYOffset: CELL_Y_OFFSET,
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
    getCellContent: ([col, row]) => ({
        kind: GridCellKind.Text,
        allowOverlay: false,
        data: "",
        displayData: "",
        ...(col === 0 && row <= 9
            ? {
                  spanRows: [0, 9] as const,
                  spanAlign: { vertical: "top", sticky: true, stickyContentHeight: CONTENT_HEIGHT } as const,
              }
            : {}),
    }),
    groupHeaderHeight: 0,
    headerHeight: HEADER_HEIGHT,
    accessibilityHeight: 50,
    height: HEIGHT,
    width: WIDTH,
    isDragging: false,
    isResizing: false,
    resizeColumn: undefined,
    freezeTrailingRows: 0,
    hasAppendRow: false,
    rowHeight: ROW_HEIGHT,
    rows: 100,
    verticalBorder: () => true,
    getCellRenderer: cell => {
        if (cell.kind === GridCellKind.Custom) return undefined;
        return AllCellRenderers.find(x => x.kind === cell.kind) as any;
    },
    resizeIndicator: "full",
    imageWindowLoader: new ImageWindowLoaderImpl(),
};

const mockScale = (scale: number) => {
    Element.prototype.getBoundingClientRect = () => ({
        bottom: HEIGHT * scale,
        height: HEIGHT * scale,
        left: 0,
        right: WIDTH * scale,
        top: 0,
        width: WIDTH * scale,
        x: 0,
        y: 0,
        toJSON: () => "",
    });
};

describe("прилипший блок при CSS-масштабе", () => {
    beforeEach(() => {
        standardBeforeEach();
        Image.prototype.decode = vi.fn();
    });

    afterEach(() => {
        cleanup();
    });

    // Как считает отрисовка: логические пиксели, без масштаба.
    const drawn = stickySpanContentBox(
        LOGICAL_BLOCK_Y,
        LOGICAL_BLOCK_HEIGHT,
        HEADER_HEIGHT + 1,
        HEIGHT,
        ROW_HEIGHT,
        ROW_HEIGHT,
        CONTENT_HEIGHT
    );

    test.each([0.5, 1, 2])("границы для событий совпадают с отрисовкой, масштаб %s", scale => {
        mockScale(scale);
        const ref = React.createRef<DataGridRef>();
        render(<DataGrid {...props} ref={ref} canvasRef={React.createRef<HTMLCanvasElement>()} />);

        const bounds = ref.current?.getContentBounds(0, 0);

        expect(drawn.height).toBe(CONTENT_HEIGHT);
        expect(bounds?.height).toBeCloseTo(drawn.height * scale);
        expect(bounds?.y).toBeCloseTo((drawn.y + BOUNDS_OFFSET) * scale);
    });

    test.each([0.5, 1, 2])("клик по нарисованному содержимому попадает в него, масштаб %s", scale => {
        mockScale(scale);
        const spy = vi.fn();
        render(<DataGrid {...props} onMouseDown={spy} />);
        const contentY = 50;

        fireEvent.pointerDown(screen.getByTestId("data-grid-canvas"), {
            clientX: 20 * scale,
            clientY: (drawn.y + contentY) * scale,
        });

        const args = spy.mock.calls[0][0];
        expect(args.location).toEqual([0, 0]);
        // localEventY в координатах страницы, потребитель делит его на масштаб.
        expect(args.localEventY / scale).toBeCloseTo(contentY - BOUNDS_OFFSET);
    });
});
