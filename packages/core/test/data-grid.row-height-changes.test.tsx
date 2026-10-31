import * as React from "react";
import { render, cleanup } from "@testing-library/react";
import DataGrid, { type DataGridProps } from "../src/internal/data-grid/data-grid.js";
import { CompactSelection, GridCellKind, type GridCell } from "../src/internal/data-grid/data-grid-types.js";
import { getDefaultTheme } from "../src/index.js";
import { AllCellRenderers } from "../src/cells/index.js";
import { vi, expect, describe, test, beforeEach, afterEach } from "vitest";
import ImageWindowLoaderImpl from "../src/common/image-window-loader.js";
import { mergeAndRealizeTheme } from "../src/common/styles.js";
import type { RowHeightCallback } from "../src/internal/scrolling-data-grid/row-offsets.js";
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
const SIZE = 1000;

const heightsFn = (heights: Map<number, number>, version: number, changes?: RowHeightCallback["changes"]) =>
    Object.assign((row: number) => heights.get(row) ?? 30, { version, changes }) as RowHeightCallback;

/** Прямоугольник клипа кадра: он на всю ширину, у ячеек свои клипы уже */
const frameClips = (events: readonly DrawEvent[]) =>
    events.filter(e => e.type === "rect" && e.props?.x === 0 && e.props?.width === SIZE).map(e => e.props?.y);
const fullRedraw = (events: readonly DrawEvent[]) =>
    events.some(e => e.type === "fillRect" && e.props?.x === 0 && e.props?.y === 0 && e.props?.width === SIZE);

const textCell = (cell: readonly [number, number]): GridCell => ({
    kind: GridCellKind.Text,
    allowOverlay: false,
    data: `${cell[0]},${cell[1]}`,
    displayData: `${cell[0]},${cell[1]}`,
});

const spannedCell = (cell: readonly [number, number]): GridCell =>
    cell[0] === 0 && cell[1] >= 2 && cell[1] <= 8 ? { ...textCell(cell), spanRows: [2, 8] } : textCell(cell);

describe("data-grid: подсказка changes у rowHeight", () => {
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

    const setup = (getCellContent: DataGridProps["getCellContent"] = textCell, props: Partial<DataGridProps> = {}) => {
        const heights = new Map<number, number>();
        const first = heightsFn(heights, 1);
        const spy = vi.fn(getCellContent);
        const view = render(
            <DataGrid
                {...basicProps}
                {...props}
                rowHeight={first}
                getCellContent={spy}
                experimental={{ renderStrategy: "single-buffer" }}
            />
        );
        const canvas = view.container.querySelector("canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d") as MockCanvasContext;
        const change = (row: number, height: number, previousVersion = 1, version = 2) => {
            heights.set(row, height);
            ctx.__clearEvents();
            spy.mockClear();
            view.rerender(
                <DataGrid
                    {...basicProps}
                    {...props}
                    rowHeight={heightsFn(heights, version, { previousVersion, from: row, to: row })}
                    getCellContent={spy}
                    experimental={{ renderStrategy: "single-buffer" }}
                />
            );
            return { events: ctx.__getEvents(), askedRows: spy.mock.calls.map(([cell]) => cell[1]) };
        };
        return { change };
    };

    test("перерисовывается только область от изменившейся строки, строки выше не спрашиваются", () => {
        const { events, askedRows } = setup().change(5, 80);
        expect(fullRedraw(events)).toBe(false);
        expect(frameClips(events)).toContain(HEADER + 5 * 30);
        expect(Math.min(...askedRows)).toBe(5);
    });

    test("подсказка от другой версии: кадр целиком", () => {
        const { events } = setup().change(5, 80, 7);
        expect(fullRedraw(events)).toBe(true);
    });

    test("строка внутри слитого блока: область поднимается к началу блока", () => {
        const { events } = setup(spannedCell).change(7, 130);
        expect(fullRedraw(events)).toBe(false);
        expect(frameClips(events)).toContain(HEADER + 2 * 30);
        expect(frameClips(events)).not.toContain(HEADER + 7 * 30);
    });

    test("изменилась итоговая строка снизу: кадр целиком", () => {
        const { events } = setup(textCell, { freezeTrailingRows: 1 }).change(999, 80);
        expect(fullRedraw(events)).toBe(true);
    });
});
