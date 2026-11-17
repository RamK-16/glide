import * as React from "react";
import { render, cleanup } from "@testing-library/react";
import DataGrid, { type DataGridProps, type DataGridRef } from "../src/internal/data-grid/data-grid.js";
import {
    CompactSelection,
    type DrawnFrame,
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
        const ref = React.createRef<DataGridRef>();
        const grid = (p: Partial<DataGridProps>) => (
            <DataGrid
                ref={ref}
                {...basicProps}
                {...props}
                getCellContent={spy}
                {...p}
                experimental={{ renderStrategy: "single-buffer", ...props.experimental }}
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
        /** Точечная дорисовка ячеек, как делает updateCells у DataEditor */
        const damage = (cells: Array<readonly [number, number]>) => {
            ctx.__clearEvents();
            ref.current?.damage(cells.map(cell => ({ cell })));
            return ctx.__getEvents();
        };
        return { change, damage };
    };

    test("точечная дорисовка строки перекрашивает и пустую область правее колонок", () => {
        // колонки занимают 850 из 1000 px; у строки 3 свой фон, он красится и в пустой области
        const { damage } = setup({ getRowThemeOverride: row => (row === 3 ? { bgCell: "#aabbcc" } : undefined) });
        const events = damage([[1, 3]]);
        expect(fullRedraw(events)).toBe(false);
        const blankRowFill = events.some(
            e => e.type === "fillRect" && e.props?.x === COL_X[5] && e.props?.y === HEADER + 3 * ROW && e.props?.height === ROW
        );
        expect(blankRowFill).toBe(true);
        // в широкой таблице пустой области нет, лишних заливок тоже
        const wide = setup({ columns: basicProps.columns.map(c => ({ ...c, width: 300 })) });
        const wideEvents = wide.damage([[1, 3]]);
        expect(wideEvents.some(e => e.type === "fillRect" && e.props?.width === 10_000)).toBe(false);
    });

    test("точечная дорисовка со слитыми ячейками рисует разделитель закреплённых колонок линиями сетки после ячеек, как полный кадр", () => {
        const spanned = (cell: readonly [number, number]): GridCell =>
            cell[0] >= 1 && cell[0] <= 2 && cell[1] >= 4 && cell[1] <= 7
                ? { ...textCell(cell), span: [1, 2], spanRows: [4, 7] }
                : textCell(cell);
        const { damage } = setup({ freezeColumns: 1 }, spanned);
        const events = damage([[1, 5]]);
        expect(fullRedraw(events)).toBe(false);
        // линии на всю высоту холста (overdrawStickyBoundaries) нет: в полном кадре её перекрывает фон
        const overdraw = events.findIndex(e => e.type === "moveTo" && e.props?.x === COL_X[1] + 0.5 && e.props?.y === 0);
        expect(overdraw).toBe(-1);
        // без слитого блока линия границы зоны в повреждённой строке рисуется после ячеек,
        // как линия сетки (слитый блок свою левую линию закрывает и в полном кадре)
        const plain = setup({ freezeColumns: 1, getCellBorder: () => undefined }).damage([[1, 5]]);
        expect(fullRedraw(plain)).toBe(false);
        const firstText = plain.findIndex(e => e.type === "fillText");
        const rowLine = plain.findIndex(
            e =>
                e.type === "moveTo" &&
                e.props?.x === COL_X[1] + 0.5 &&
                e.props?.y >= HEADER + 4 * ROW &&
                e.props?.y <= HEADER + 5 * ROW + 1
        );
        expect(firstText).toBeGreaterThanOrEqual(0);
        expect(rowLine).toBeGreaterThan(firstText);
    });

    test("без линии слева у первой колонки за закреплённой зоной точечная дорисовка красит её от границы зоны", () => {
        const lined = setup({ freezeColumns: 1, selection: sel(1, 3) }).damage([[1, 3]]);
        expect(
            lined.some(e => e.type === "fillRect" && e.props?.x === COL_X[1] + 1 && e.props?.y === HEADER + 3 * ROW + 1)
        ).toBe(true);
        const plain = setup({ freezeColumns: 1, selection: sel(1, 3), verticalBorder: () => false }).damage([[1, 3]]);
        expect(
            plain.some(e => e.type === "fillRect" && e.props?.x === COL_X[1] && e.props?.y === HEADER + 3 * ROW + 1)
        ).toBe(true);
    });

    test("точечная дорисовка ячеек восстанавливает обычные обводки и обводки поверх выделения, в этом порядке", () => {
        const below = { color: "#0000ff", range: { x: 3, y: 4, width: 1, height: 1 }, style: "solid-outline" as const };
        const above = {
            color: "#ff0000",
            range: { x: 2, y: 4, width: 1, height: 1 },
            style: "solid-outline" as const,
            drawAboveSelection: true,
        };
        const { damage } = setup({ highlightRegions: [below, above] });
        const events = damage([[1, 4]]);
        expect(fullRedraw(events)).toBe(false);
        const strokeAt = (col: number) =>
            events.findIndex(
                e => e.type === "strokeRect" && e.props?.x === COL_X[col] + 0.5 && e.props?.y === HEADER + 4 * ROW + 0.5
            );
        expect(strokeAt(3)).toBeGreaterThanOrEqual(0);
        expect(strokeAt(2)).toBeGreaterThan(strokeAt(3));
    });

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
        const { events, askedRows, headerEvents } = change({ selection: sel(3, 20) });
        expect(fullRedraw(events)).toBe(false);
        expect(hasClip(events, cellRect(1, 5))).toBe(true);
        expect(hasClip(events, cellRect(3, 20))).toBe(true);
        expect(askedRows.every(row => (row >= 4 && row <= 6) || (row >= 19 && row <= 21))).toBe(true);
        // колонка выбранной ячейки сменилась: шапка отмечает её заново
        expect(headerDrawn(headerEvents)).toBe(true);
    });

    test("переход по строкам в той же колонке: шапка не трогается", () => {
        const { change } = setup({ selection: sel(1, 5) });
        const { events, headerEvents } = change({ selection: sel(1, 8) });
        expect(fullRedraw(events)).toBe(false);
        expect(hasClip(events, cellRect(1, 8))).toBe(true);
        expect(headerDrawn(headerEvents)).toBe(false);
    });

    test("протяжка диапазона: прежний и новый диапазоны", () => {
        const { change } = setup({ selection: sel(1, 5, { x: 1, y: 5, width: 2, height: 2 }) });
        const { events } = change({ selection: sel(1, 5, { x: 1, y: 5, width: 3, height: 3 }) });
        expect(fullRedraw(events)).toBe(false);
        // прежний диапазон лежит в новом, отдельной области у него нет
        expect(hasClip(events, cellRect(1, 5, 2, 2))).toBe(false);
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

    test("обводка нетронутого региона не ложится на прошлый кадр второй раз", () => {
        const ring = { color: "#ff000080", range: { x: 3, y: 10, width: 1, height: 1 }, style: "solid" as const };
        const { change } = setup({ highlightRegions: [ring] });
        const { events } = change({ selection: sel(1, 5) });
        expect(fullRedraw(events)).toBe(false);
        // Обводка в стороне от выделения уже есть на сдвинутом кадре. Она штрихуется один раз,
        // после ячеек и под клипом областей (мок-холст клип не учитывает, но вызов один), а не
        // дважды: раньше первый штрих ложился на весь кадр ещё до ячеек.
        const ringStrokes = events.filter(
            e => e.type === "strokeRect" && e.props?.x === COL_X[3] + 0.5 && e.props?.y === HEADER + 10 * ROW + 0.5
        );
        expect(ringStrokes).toHaveLength(1);
    });

    test("сменились регионы подсветки: только их области", () => {
        const { change } = setup();
        const { events } = change({
            highlightRegions: [{ color: "#ff0000", range: { x: 2, y: 3, width: 1, height: 1 }, style: "no-outline" }],
        });
        expect(fullRedraw(events)).toBe(false);
        expect(hasClip(events, cellRect(2, 3))).toBe(true);
    });

    test("без линий сетки точечная дорисовка красит ячейку от левого и верхнего края", () => {
        // линии есть: заливка отступает на пиксель слева и сверху под линии
        const withLines = setup({ selection: sel(3, 3) });
        const lined = withLines.damage([[1, 3]]);
        expect(lined.some(e => e.type === "fillRect" && e.props?.x === COL_X[1] + 1 && e.props?.y === HEADER + 3 * ROW + 1)).toBe(
            true
        );
        // линий нет: пиксели на их месте принадлежат ячейке
        const noLines = setup({ selection: sel(3, 3), verticalBorder: () => false, horizontalBorder: () => false });
        const plain = noLines.damage([[1, 3]]);
        expect(plain.some(e => e.type === "fillRect" && e.props?.x === COL_X[1] && e.props?.y === HEADER + 3 * ROW)).toBe(true);
    });

    test("прыжок больше экрана с закреплённой колонкой: кадр целиком, без полосы на границе", () => {
        const { change } = setup({ freezeColumns: 1, selection: sel(1, 5) });
        const { events, askedRows } = change({ selection: sel(1, 55), cellYOffset: 50 });
        expect(fullRedraw(events)).toBe(true);
        // спрошены строки нового экрана, а не только граница закреплённой зоны
        expect(askedRows).toContain(60);
    });

    test("выделение и прокрутка за один кадр: сдвиг кадра плюс области выделения", () => {
        const { change } = setup({ selection: sel(1, 5) });
        const { events } = change({ selection: sel(1, 6), cellYOffset: 1 });
        expect(fullRedraw(events)).toBe(false);
        // новая полоса снизу от сдвига на одну строку, на пиксель выше шва
        expect(hasClip(events, { x: 0, y: SIZE - ROW - 1, width: SIZE, height: ROW + 1 })).toBe(true);
        // строки на экране поднялись на одну: прежняя ячейка [1,5] стоит там, где была строка 4
        expect(hasClip(events, cellRect(1, 4))).toBe(true);
        expect(hasClip(events, cellRect(1, 5))).toBe(true);
    });

    test("вместе с выделением сменились данные: кадр целиком", () => {
        const { change } = setup();
        const { events } = change({ selection: sel(1, 5), getCellContent: cell => textCell(cell) });
        expect(fullRedraw(events)).toBe(true);
    });

    test("вместе с выделением сменилась функция drawCell: кадр целиком", () => {
        const blue: DataGridProps["drawCell"] = args => {
            args.ctx.fillStyle = "#0000ff";
            args.ctx.fillRect(args.rect.x, args.rect.y, args.rect.width, args.rect.height);
            return true;
        };
        const { change } = setup({ drawCell: blue, selection: sel(3, 4) });
        const drawnRows: number[] = [];
        const green: DataGridProps["drawCell"] = args => {
            drawnRows.push(args.row);
            return true;
        };
        const { events } = change({ drawCell: green, selection: sel(3, 5) });
        expect(fullRedraw(events)).toBe(true);
        // новая функция рисует и ячейки вне прежней и новой областей выделения
        expect(drawnRows).toContain(20);
    });

    test("вместе с выделением сменилась функция drawHeader: тело частично, шапка заново", () => {
        const drawHeader: DataGridProps["drawHeader"] = (_args, draw) => draw();
        const { change } = setup({ drawHeader, selection: sel(1, 5) });
        // переход по строкам в той же колонке шапку сам не трогает, её перерисовывает новая функция
        const { events, headerEvents } = change({ drawHeader: (_args, draw) => draw(), selection: sel(1, 6) });
        expect(fullRedraw(events)).toBe(false);
        expect(headerDrawn(headerEvents)).toBe(true);
    });

    test("разделитель закреплённых колонок рисуется только в областях выделения", () => {
        // красная обводка региона лежит на разделителе (x = 150), выделение далеко от неё
        const ring = { color: "#ff000040", range: { x: 1, y: 15, width: 1, height: 2 }, style: "solid" as const };
        const { change } = setup({ freezeColumns: 1, highlightRegions: [ring], selection: sel(3, 4) });
        const { events } = change({ selection: sel(3, 5) });
        expect(fullRedraw(events)).toBe(false);
        const types = events.map(e => e.type);
        const boundary = events.findIndex(e => e.type === "moveTo" && e.props?.x === COL_X[1] + 0.5 && e.props?.y === 0);
        expect(boundary).toBeGreaterThan(0);
        // перед разделителем стоит клип по областям выделения, а не весь холст
        const before = types.slice(0, boundary);
        expect(before.lastIndexOf("clip")).toBeGreaterThan(before.lastIndexOf("restore"));
        expect(hasClip(events.slice(before.lastIndexOf("save"), boundary), cellRect(3, 5))).toBe(true);
    });

    test("выбрана строка: кадр целиком", () => {
        const { change } = setup();
        const { events } = change({ selection: { ...none, rows: CompactSelection.fromSingleSelection(3) } });
        expect(fullRedraw(events)).toBe(true);
    });

    test("блок задет выделением за кадром: его видимая часть перерисовывается", () => {
        // блок колонок 1..2 строк 4..7, выбрана ячейка (1,5), экран прокручен к строке 6
        const spanned = (cell: readonly [number, number]): GridCell =>
            cell[0] >= 1 && cell[0] <= 2 && cell[1] >= 4 && cell[1] <= 7
                ? { ...textCell(cell), span: [1, 2], spanRows: [4, 7] }
                : textCell(cell);
        const { change } = setup({ cellYOffset: 6, selection: sel(1, 5) }, spanned);
        const { events, askedRows } = change({ selection: sel(3, 20) });
        expect(fullRedraw(events)).toBe(false);
        // строки 6 и 7 блока стоят на экране первыми двумя, новая ячейка в 14-й строке экрана
        expect(hasClip(events, cellRect(1, 0, 2, 2))).toBe(true);
        expect(hasClip(events, cellRect(3, 14))).toBe(true);
        expect(askedRows).toContain(6);
        expect(askedRows).toContain(7);
    });

    test("выделение за кадром: тело не трогается, шапка обновляется", () => {
        const { change } = setup({ selection: sel(1, 500) });
        const far = sel(2, 600);
        const moved = change({ selection: far });
        expect(moved.events.some(e => e.type === "fillRect" || e.type === "rect")).toBe(false);
        expect(headerDrawn(moved.headerEvents)).toBe(true);
        const blurred = change({ selection: far, isFocused: false });
        expect(blurred.events.some(e => e.type === "fillRect" || e.type === "rect")).toBe(false);
        expect(headerDrawn(blurred.headerEvents)).toBe(false);
        // следующий обычный кадр по-прежнему частичный
        const back = change({ selection: sel(1, 5) });
        expect(fullRedraw(back.events)).toBe(false);
        expect(hasClip(back.events, cellRect(1, 5))).toBe(true);
    });

    test("регион с обводкой в первой видимой строке сменился: шапка обновляется", () => {
        const ring = (col: number) => ({
            color: "#ff0000",
            range: { x: col, y: 0, width: 1, height: 1 },
            style: "solid" as const,
        });
        const { change } = setup({ highlightRegions: [ring(1)] });
        const { events, headerEvents } = change({ highlightRegions: [ring(3)] });
        expect(fullRedraw(events)).toBe(false);
        expect(headerDrawn(headerEvents)).toBe(true);
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
    describe("отметка о кадре onFrameDrawn", () => {
        const frames: DrawnFrame[] = [];
        const last = () => frames[frames.length - 1];
        const tracked = (props: Partial<DataGridProps> = {}) => {
            frames.length = 0;
            return setup({ ...props, experimental: { onFrameDrawn: frame => frames.push(frame) } });
        };

        test("первый кадр целиком, со всем холстом и шапкой", () => {
            tracked({ selection: sel(1, 5) });
            expect(frames).toHaveLength(1);
            expect(last()).toEqual({ kind: "full", header: true, regions: [{ x: 0, y: 0, width: SIZE, height: SIZE }] });
        });

        test("переход по строкам: только выделение, шапка не трогается; смена колонки рисует шапку", () => {
            const { change } = tracked({ selection: sel(1, 5) });
            change({ selection: sel(1, 6) });
            expect(frames).toHaveLength(2);
            expect(last().kind).toBe("selection");
            expect(last().header).toBe(false);
            // прежняя и новая ячейки, весь холст не перерисован
            expect(last().regions.length).toBeGreaterThan(0);
            expect(last().regions.every(r => r.width < SIZE && r.height < SIZE)).toBe(true);
            change({ selection: sel(3, 6) });
            expect(last()).toMatchObject({ kind: "selection", header: true });
        });

        test("повторный рендер без изменений кадра не даёт", () => {
            const { change } = tracked({ selection: sel(1, 5) });
            change({});
            expect(frames).toHaveLength(1);
        });

        test("выделение ушло за экран: стирается только прежняя ячейка, дальше областей нет", () => {
            const { change } = tracked({ selection: sel(1, 5) });
            change({ selection: sel(1, 500) });
            expect(last()).toMatchObject({ kind: "selection", regions: [cellRect(1, 5)] });
            change({ selection: sel(1, 600) });
            expect(last()).toMatchObject({ kind: "selection", regions: [] });
        });

        test("точечная дорисовка ячеек: damage с их областями", () => {
            const { damage } = tracked({ selection: sel(1, 5) });
            damage([[1, 3]]);
            expect(last().kind).toBe("damage");
            expect(last().header).toBe(false);
            expect(last().regions).toHaveLength(1);
            expect(last().regions[0]).toMatchObject({ x: COL_X[1], width: COL_X[2] - COL_X[1] });
        });

        test("смена данных вместе с выделением: кадр целиком", () => {
            const { change } = tracked({ selection: sel(1, 5) });
            change({ selection: sel(1, 6), rows: 999 });
            expect(last()).toMatchObject({ kind: "full", header: true });
        });
    });
});
