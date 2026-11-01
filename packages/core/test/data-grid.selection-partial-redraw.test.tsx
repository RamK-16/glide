import * as React from "react";
import { render, cleanup } from "@testing-library/react";
import DataGrid, { type DataGridProps } from "../src/internal/data-grid/data-grid.js";
import {
    CompactSelection,
    GridCellKind,
    type GridCell,
    type GridSelection,
    type Rectangle,
} from "../src/internal/data-grid/data-grid-types.js";
import { getDefaultTheme } from "../src/index.js";
import { AllCellRenderers } from "../src/cells/index.js";
import { vi, expect, describe, test, beforeEach, afterEach } from "vitest";
import ImageWindowLoaderImpl from "../src/common/image-window-loader.js";
import { mergeAndRealizeTheme } from "../src/common/styles.js";
import { SELECTION_REGION_PAD as PAD } from "../src/internal/data-grid/render/data-grid-render.selection-regions.js";
import { standardBeforeEach } from "./test-utils.js";

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

type DrawEvent = { type: string; props?: Record<string, number> };
type MockCanvasContext = CanvasRenderingContext2D & {
    __clearEvents: () => void;
    __getEvents: () => readonly DrawEvent[];
};

const HEADER = 36;
const ROW = 32;
const SIZE = 1000;
/** Левые края колонок A..E */
const COL_X = [0, 150, 310, 480, 660, 850];

/** На холсте шапки что-то нарисовано (служебные save и restore не считаются) */
const headerDrawn = (events: readonly DrawEvent[]) => events.some(e => e.type === "fillRect" || e.type === "fillText");
const fullRedraw = (events: readonly DrawEvent[]) =>
    events.some(e => e.type === "fillRect" && e.props?.x === 0 && e.props?.y === 0 && e.props?.width === SIZE);
const hasClip = (events: readonly DrawEvent[], r: Rectangle) =>
    events.some(
        e =>
            e.type === "rect" &&
            e.props?.x === r.x &&
            e.props?.y === r.y &&
            e.props?.width === r.width &&
            e.props?.height === r.height
    );
/** Экранная область ячеек с запасом, строки считаются от начала таблицы */
const cellRect = (col: number, row: number, cols = 1, rows = 1): Rectangle => ({
    x: COL_X[col] - PAD,
    y: HEADER + row * ROW - PAD,
    width: COL_X[col + cols] - COL_X[col] + PAD * 2,
    height: rows * ROW + PAD * 2,
});

const textCell = (cell: readonly [number, number]): GridCell => ({
    kind: GridCellKind.Text,
    allowOverlay: false,
    data: `${cell[0]},${cell[1]}`,
    displayData: `${cell[0]},${cell[1]}`,
});

const none: GridSelection = { current: undefined, columns: CompactSelection.empty(), rows: CompactSelection.empty() };
const sel = (col: number, row: number, range?: Rectangle): GridSelection => ({
    ...none,
    current: { cell: [col, row], range: range ?? { x: col, y: row, width: 1, height: 1 }, rangeStack: [] },
});

describe("data-grid: частичная перерисовка при смене выделения", () => {
    beforeEach(() => {
        standardBeforeEach();
        Element.prototype.getBoundingClientRect = () => ({
            bottom: SIZE,
            height: SIZE,
            left: 0,
            right: SIZE,
            top: 0,
            width: SIZE,
            x: 0,
            y: 0,
            toJSON: () => "",
        });
        Image.prototype.decode = vi.fn();
    });

    afterEach(() => cleanup());

    const setup = (props: Partial<DataGridProps> = {}, cellContent = textCell) => {
        // Строки спрошенных ячеек запоминаем в момент вызова: drawCells передаёт один и тот же
        // массив-индекс, и после кадра в нём остаётся последняя ячейка.
        let askedRows: number[] = [];
        const spy = vi.fn((cell: readonly [number, number]) => {
            askedRows.push(cell[1]);
            return cellContent(cell);
        });
        const grid = (p: Partial<DataGridProps>) => (
            <DataGrid
                {...basicProps}
                {...props}
                getCellContent={spy}
                {...p}
                experimental={{ renderStrategy: "single-buffer" }}
            />
        );
        const view = render(grid({}));
        const [canvas, overlay] = Array.from(view.container.querySelectorAll("canvas")) as HTMLCanvasElement[];
        const ctx = canvas.getContext("2d") as MockCanvasContext;
        const headerCtx = overlay.getContext("2d") as MockCanvasContext;
        const change = (p: Partial<DataGridProps>) => {
            ctx.__clearEvents();
            headerCtx.__clearEvents();
            askedRows = [];
            view.rerender(grid(p));
            return { events: ctx.__getEvents(), headerEvents: headerCtx.__getEvents(), askedRows };
        };
        return { change };
    };

    test("клик по ячейке: перерисовывается только её область, другие строки не спрашиваются", () => {
        const { events, askedRows, headerEvents } = setup().change({ selection: sel(1, 5) });
        expect(fullRedraw(events)).toBe(false);
        expect(hasClip(events, cellRect(1, 5))).toBe(true);
        expect(askedRows.length).toBeGreaterThan(0);
        expect(askedRows.every(row => row >= 4 && row <= 6)).toBe(true);
        // шапка отмечает колонку выбранной ячейки
        expect(headerDrawn(headerEvents)).toBe(true);
    });

    test("переход на другую ячейку: прежняя и новая области", () => {
        const { change } = setup({ selection: sel(1, 5) });
        const { events, askedRows } = change({ selection: sel(3, 20) });
        expect(fullRedraw(events)).toBe(false);
        expect(hasClip(events, cellRect(1, 5))).toBe(true);
        expect(hasClip(events, cellRect(3, 20))).toBe(true);
        expect(askedRows.every(row => (row >= 4 && row <= 6) || (row >= 19 && row <= 21))).toBe(true);
    });

    test("протяжка диапазона: прежний и новый диапазоны", () => {
        const { change } = setup({ selection: sel(1, 5, { x: 1, y: 5, width: 2, height: 2 }) });
        const { events } = change({ selection: sel(1, 5, { x: 1, y: 5, width: 3, height: 3 }) });
        expect(fullRedraw(events)).toBe(false);
        expect(hasClip(events, cellRect(1, 5, 2, 2))).toBe(true);
        expect(hasClip(events, cellRect(1, 5, 3, 3))).toBe(true);
    });

    test("уход и возврат фокуса: только область выделения, шапка не трогается", () => {
        const { change } = setup({ selection: sel(1, 5) });
        const blurred = change({ isFocused: false });
        expect(fullRedraw(blurred.events)).toBe(false);
        expect(hasClip(blurred.events, cellRect(1, 5))).toBe(true);
        expect(headerDrawn(blurred.headerEvents)).toBe(false);
        const focused = change({ isFocused: true });
        expect(fullRedraw(focused.events)).toBe(false);
    });

    test("сменились регионы подсветки: только их области", () => {
        const { change } = setup();
        const { events } = change({
            highlightRegions: [{ color: "#ff0000", range: { x: 2, y: 3, width: 1, height: 1 }, style: "no-outline" }],
        });
        expect(fullRedraw(events)).toBe(false);
        expect(hasClip(events, cellRect(2, 3))).toBe(true);
    });

    test("выделение и прокрутка за один кадр: сдвиг кадра плюс области выделения", () => {
        const { change } = setup({ selection: sel(1, 5) });
        const { events } = change({ selection: sel(1, 6), cellYOffset: 1 });
        expect(fullRedraw(events)).toBe(false);
        // новая полоса снизу от сдвига на одну строку
        expect(hasClip(events, { x: 0, y: SIZE - ROW, width: SIZE, height: ROW })).toBe(true);
        // строки на экране поднялись на одну: прежняя ячейка [1,5] стоит там, где была строка 4
        expect(hasClip(events, cellRect(1, 4))).toBe(true);
        expect(hasClip(events, cellRect(1, 5))).toBe(true);
    });

    test("вместе с выделением сменились данные: кадр целиком", () => {
        const { change } = setup();
        const { events } = change({ selection: sel(1, 5), getCellContent: cell => textCell(cell) });
        expect(fullRedraw(events)).toBe(true);
    });

    test("выбрана строка: кадр целиком", () => {
        const { change } = setup();
        const { events } = change({ selection: { ...none, rows: CompactSelection.fromSingleSelection(3) } });
        expect(fullRedraw(events)).toBe(true);
    });

    test("ячейка в слитом блоке: область на весь блок", () => {
        const spanned = (cell: readonly [number, number]): GridCell =>
            cell[0] >= 1 && cell[0] <= 2 && cell[1] >= 4 && cell[1] <= 7
                ? { ...textCell(cell), span: [1, 2], spanRows: [4, 7] }
                : textCell(cell);
        const { change } = setup({}, spanned);
        const { events } = change({ selection: sel(1, 5) });
        expect(fullRedraw(events)).toBe(false);
        expect(hasClip(events, cellRect(1, 4, 2, 4))).toBe(true);
    });
});
