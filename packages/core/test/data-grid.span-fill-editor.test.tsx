import * as React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import DataGrid, { type DataGridProps } from "../src/internal/data-grid/data-grid.js";
import { CompactSelection, GridCellKind, type GridCell } from "../src/internal/data-grid/data-grid-types.js";
import { getDefaultTheme } from "../src/index.js";
import { AllCellRenderers } from "../src/cells/index.js";
import { expect, describe, test, beforeEach, afterEach } from "vitest";
import ImageWindowLoaderImpl from "../src/common/image-window-loader.js";
import { mergeAndRealizeTheme } from "../src/common/styles.js";
import { standardBeforeEach } from "./test-utils.js";

// Настоящая отрисовка DataGrid: выделение, растянутое до объединённого блока, не
// заливает блок только под открытым редактором без рамки фокуса. Признак должен
// дойти от пропа до заливки ячеек, а не только до аргументов drawGrid.

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
        {
            title: "A",
            width: 150,
        },
        {
            title: "B",
            width: 160,
        },
        {
            title: "C",
            width: 170,
        },
        {
            title: "D",
            width: 180,
        },
        {
            title: "E",
            width: 190,
        },
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

type MockCanvasContext = CanvasRenderingContext2D & {
    __getEvents: () => readonly { type: string; props?: Record<string, unknown> }[];
};

const SELECTION_FILL = "#ff0000";

// Столбец 0, строки 2–8 один блок; выделение ровно по блоку, фокус в его главной ячейке.
const getCellContent = (cell: readonly [number, number]): GridCell => ({
    kind: GridCellKind.Text,
    allowOverlay: false,
    data: "",
    displayData: "",
    ...(cell[0] === 0 && cell[1] >= 2 && cell[1] <= 8 ? { spanRows: [2, 8] as const } : {}),
});

const blockSelection: DataGridProps["selection"] = {
    current: { cell: [0, 2], range: { x: 0, y: 2, width: 1, height: 7 }, rangeStack: [] },
    rows: CompactSelection.empty(),
    columns: CompactSelection.empty(),
};

const blockIsFilled = (props: Partial<DataGridProps>) => {
    render(
        <DataGrid
            {...basicProps}
            getCellContent={getCellContent}
            selection={blockSelection}
            theme={mergeAndRealizeTheme({ ...getDefaultTheme(), accentLight: SELECTION_FILL })}
            experimental={{ renderStrategy: "single-buffer" }}
            {...props}
        />
    );
    const canvas = screen.getByTestId("data-grid-canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as MockCanvasContext;
    return ctx.__getEvents().some(e => e.type === "fillStyle" && e.props?.value === SELECTION_FILL);
};

describe("заливка блока, растянутого выделением", () => {
    beforeEach(() => {
        standardBeforeEach();
    });

    afterEach(() => {
        cleanup();
    });

    test("без рамки и без редактора блок залит (столбец из одного блока, выделенный по шапке)", () => {
        expect(blockIsFilled({ drawFocusRing: false, editorOpen: false })).toBe(true);
    });

    test("без рамки под открытым редактором блок не залит", () => {
        expect(blockIsFilled({ drawFocusRing: false, editorOpen: true })).toBe(false);
    });

    test("с рамкой фокуса блок залит и под редактором", () => {
        expect(blockIsFilled({ drawFocusRing: true, editorOpen: true })).toBe(true);
    });
});
