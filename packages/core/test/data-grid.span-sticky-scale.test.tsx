import * as React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import DataGrid, { type DataGridProps, type DataGridRef } from "../src/internal/data-grid/data-grid.js";
import { CompactSelection, GridCellKind } from "../src/internal/data-grid/data-grid-types.js";
import { AllCellRenderers } from "../src/cells/index.js";
import { getDefaultTheme } from "../src/index.js";
import { mergeAndRealizeTheme } from "../src/common/styles.js";
import ImageWindowLoaderImpl from "../src/common/image-window-loader.js";
import { standardBeforeEach } from "./test-utils.js";

// При CSS transform: scale(...) клик и редактор считают границы содержимого в координатах
// страницы, отрисовка в логических пикселях. Прямоугольник должен совпасть с нарисованным.

const WIDTH = 1000;
const HEIGHT = 500;
const HEADER_HEIGHT = 36;
const ROW_HEIGHT = 32;
const CONTENT_HEIGHT = 100;

// Блок в строках 0-9, колонка 0, семь строк над шапкой: виден низ блока, 95px.
const CELL_Y_OFFSET = 7;

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

const blockRowHeight = (row: number) => (row === 9 ? 90 : 30);

/** Настоящая отрисовка: прямоугольник, который drawCells передал ячейке блока. */
const renderAndGetDrawnRect = async (extra: Partial<DataGridProps>, ref?: React.Ref<DataGridRef>) => {
    // drawCell использует один объект rect на все ячейки, поэтому копируем сразу.
    const rects: { y: number; height: number }[] = [];
    const draw = vi.fn((args: { rect: { y: number; height: number } }) => {
        rects.push({ ...args.rect });
    });
    const base = { ...props, ...extra };
    render(
        <DataGrid
            {...base}
            ref={ref}
            canvasRef={React.createRef<HTMLCanvasElement>()}
            getCellContent={cell => {
                const content = base.getCellContent(cell);
                if (content.kind !== GridCellKind.Text || content.spanRows === undefined) return content;
                return { ...content, kind: GridCellKind.Custom, data: {}, copyData: "" };
            }}
            getCellRenderer={cell =>
                cell.kind === GridCellKind.Custom
                    ? ({ kind: GridCellKind.Custom, isMatch: () => true, needsHover: false, draw } as any)
                    : props.getCellRenderer(cell)
            }
        />
    );
    await waitFor(() => expect(draw).toHaveBeenCalled());
    return rects[0];
};

describe("прилипший блок при CSS-масштабе", () => {
    beforeEach(() => {
        standardBeforeEach();
        Image.prototype.decode = vi.fn();
    });

    afterEach(() => {
        cleanup();
    });

    test.each([0.5, 1, 2])("границы для событий совпадают с настоящей отрисовкой, масштаб %s", async scale => {
        mockScale(scale);
        const ref = React.createRef<DataGridRef>();
        const drawn = await renderAndGetDrawnRect({}, ref);

        const bounds = ref.current?.getContentBounds(0, 0);

        expect(drawn.height).toBe(CONTENT_HEIGHT);
        expect(bounds?.y).toBeCloseTo(drawn.y * scale);
        // Как у всех границ glide, высота на 1px больше, чтобы закрыть линию сетки.
        expect(bounds?.height).toBeCloseTo((drawn.height + 1) * scale);
    });

    test.each([0.5, 1, 2])("клик по нарисованному содержимому попадает в него, масштаб %s", async scale => {
        mockScale(scale);
        const spy = vi.fn();
        const drawn = await renderAndGetDrawnRect({ onMouseDown: spy });
        const contentY = 50;

        fireEvent.pointerDown(screen.getByTestId("data-grid-canvas"), {
            clientX: 20 * scale,
            clientY: (drawn.y + contentY) * scale,
        });

        const args = spy.mock.calls[0][0];
        expect(args.location).toEqual([0, 0]);
        // localEventY в координатах страницы, внешний код делит его на масштаб.
        expect(args.localEventY / scale).toBeCloseTo(contentY);
    });

    test("разные первая и последняя строка: границы и отрисовка выбирают одну высоту", async () => {
        mockScale(1);
        const ref = React.createRef<DataGridRef>();
        // Первая строка 30, последняя 90, от блока над низом шапки видно 60px.
        const drawn = await renderAndGetDrawnRect(
            {
                rowHeight: blockRowHeight,
                cellYOffset: 9,
                translateY: -29,
                headerHeight: 39,
                height: 468,
                getCellContent: ([col, row]) => ({
                    kind: GridCellKind.Text,
                    allowOverlay: false,
                    data: "",
                    displayData: "",
                    ...(col === 0 && row <= 9
                        ? { spanRows: [0, 9] as const, spanAlign: { vertical: "top", sticky: true } as const }
                        : {}),
                }),
            },
            ref
        );

        const bounds = ref.current?.getContentBounds(0, 0);

        expect(drawn.height).toBe(90);
        expect(bounds?.y).toBeCloseTo(drawn.y);
        expect(bounds?.height).toBeCloseTo(drawn.height + 1);
    });

    test("getScrollBodyBounds: верх и низ области данных с учётом масштаба", () => {
        mockScale(2);
        const ref = React.createRef<DataGridRef>();
        render(<DataGrid {...props} ref={ref} canvasRef={React.createRef<HTMLCanvasElement>()} />);

        expect(ref.current?.getScrollBodyBounds()).toEqual({
            top: (HEADER_HEIGHT + 1) * 2,
            bottom: HEIGHT * 2,
        });
    });
});
