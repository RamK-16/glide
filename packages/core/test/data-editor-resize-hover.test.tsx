import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { CompactSelection, DataEditor, type DataEditorProps, type DataEditorRef } from "../src/index.js";
import * as gridRenderer from "../src/internal/data-grid/render/data-grid-render.js";
import * as resizeDrawing from "../src/internal/data-grid/render/data-grid.render.rings.js";
import { EventedDataEditor, basicProps, Context, prep, standardAfterEach, standardBeforeEach } from "./test-utils.js";

vi.mock("../src/common/resize-detector", () => ({
    useResizeDetector: () => ({ ref: undefined, width: 1000, height: 1000 }),
}));

function mount(extra: Partial<DataEditorProps> = {}, Editor = EventedDataEditor) {
    vi.useFakeTimers();
    const outline = vi.spyOn(resizeDrawing, "drawColumnResizeOutline");
    const draw = vi.spyOn(gridRenderer, "drawGrid");
    const ref = React.createRef<DataEditorRef>();
    const props: DataEditorProps = {
        ...basicProps,
        rows: 20,
        onColumnResize: vi.fn(),
        resizeIndicatorOnHover: true,
        ...extra,
    };
    const result = render(<Editor {...props} ref={ref} />, { wrapper: Context });
    const scroller = prep(false);
    const canvas = screen.getByTestId("data-grid-canvas");
    outline.mockClear();
    draw.mockClear();
    const hover = (x: number, y = 16) => fireEvent.pointerMove(canvas, { clientX: x, clientY: y, buttons: 0 });
    const frame = () => draw.mock.calls.at(-1)?.[0];
    return { outline, draw, ref, props, result, canvas, scroller, hover, frame };
}

beforeEach(standardBeforeEach);
afterEach(() => {
    standardAfterEach();
    vi.restoreAllMocks();
    vi.useRealTimers();
});

describe("resizeIndicatorOnHover", () => {
    test("is opt-in; the existing drag indicator still works with the option disabled", () => {
        const { outline, hover, canvas } = mount({ resizeIndicatorOnHover: undefined });
        hover(310);
        expect(outline).not.toHaveBeenCalled();
        fireEvent.pointerDown(canvas, { clientX: 310, clientY: 16 });
        expect(outline).toHaveBeenCalled();
    });

    test("immediately draws only the header line in the accent color without entering resize", () => {
        const onColumnResizeStart = vi.fn();
        const { outline, hover, frame } = mount({ onColumnResizeStart, theme: { resizeIndicatorColor: "#0B7ECB" } });
        hover(310);
        expect(frame()).toMatchObject({ hoveredResizeCol: 1, isResizing: false });
        expect(outline).toHaveBeenCalled();
        expect(
            outline.mock.calls.every(
                ([, x, top, bottom, color]) => x === 310 && top === 0 && bottom === 36 && color === "#0B7ECB"
            )
        ).toBe(true);
        expect(onColumnResizeStart).not.toHaveBeenCalled();
    });

    test.each(["full", "header", "none"] as const)(
        "respects resizeIndicator=%s for hover and drag",
        resizeIndicator => {
            const { outline, hover, canvas } = mount({ resizeIndicator });
            hover(310);
            if (resizeIndicator === "none") expect(outline).not.toHaveBeenCalled();
            else {
                expect(outline).toHaveBeenCalled();
                expect(outline.mock.calls.every(([, , top]) => top === 0)).toBe(true);
            }
            outline.mockClear();
            fireEvent.pointerDown(canvas, { clientX: 310, clientY: 16 });
            if (resizeIndicator === "none") expect(outline).not.toHaveBeenCalled();
            else {
                expect(outline).toHaveBeenCalled();
                expect(outline.mock.calls.some(([, , top]) => top === 36)).toBe(resizeIndicator === "full");
            }
        }
    );

    test.each([true, false])("header drag includes its bottom border with hover=%s", enabled => {
        const { hover, canvas, outline } = mount({ resizeIndicator: "header", resizeIndicatorOnHover: enabled });
        hover(310);
        outline.mockClear();
        fireEvent.pointerDown(canvas, { clientX: 310, clientY: 16 });
        expect(outline.mock.calls.map(([, , top, bottom]) => [top, bottom])).toEqual([[0, 37]]);
    });

    test("uses the existing five-pixel hit area and clears immediately outside the header edge", () => {
        const { hover, frame, outline, ref } = mount();
        const left = ref.current?.getBounds(1, -1);
        const right = ref.current?.getBounds(2, -1);
        if (left === undefined || right === undefined) throw new Error("Missing header bounds");
        // Native bounds include the one-pixel border on the left column's right side.
        const hitStart = left.x + left.width - 5;
        const hitEnd = right.x + 5;
        for (const x of [hitStart, 310, hitEnd]) {
            hover(x);
            expect(frame()?.hoveredResizeCol).toBe(1);
        }
        for (const [x, y] of [
            [hitStart - 1, 16],
            [hitEnd + 1, 16],
            [310, 40],
        ]) {
            hover(310);
            outline.mockClear();
            hover(x, y);
            expect(frame()?.hoveredResizeCol).toBeUndefined();
            // Synchronous header damage can precede the state update; the final frame must be clear.
            outline.mockClear();
            gridRenderer.drawGrid(frame()!, undefined);
            expect(outline).not.toHaveBeenCalled();
        }
    });

    test("does not enable resizing when no resize callback is provided", () => {
        const { outline, hover } = mount({ onColumnResize: undefined });
        hover(310);
        expect(outline).not.toHaveBeenCalled();
    });

    test.each([{ resizable: false }, { minWidth: 160, maxWidth: 160 }])("ignores disabled/fixed columns: %j", fixed => {
        const { outline, hover } = mount({
            columns: basicProps.columns.map((column, index) => (index === 1 ? { ...column, ...fixed } : column)),
        });
        hover(310);
        hover(312);
        expect(outline).not.toHaveBeenCalled();
        hover(480);
        expect(outline).toHaveBeenCalled();
    });

    test.each([
        { minColumnWidth: 160, maxColumnWidth: 160 },
        { minColumnWidth: 160, columns: basicProps.columns.map(c => ({ ...c, maxWidth: 160 })) },
        { maxColumnWidth: 160, columns: basicProps.columns.map(c => ({ ...c, minWidth: 160 })) },
        { columns: basicProps.columns.map(c => ({ ...c, resizable: false })) },
    ])("fixed effective widths disable the cursor, hover and drag together", limits => {
        const onColumnResizeStart = vi.fn();
        const { hover, canvas, outline, props } = mount({ ...limits, onColumnResizeStart });
        hover(310);
        expect(canvas.style.cursor).not.toBe("col-resize");
        fireEvent.pointerDown(canvas, { clientX: 310, clientY: 16 });
        fireEvent.pointerMove(canvas, { clientX: 330, clientY: 16, buttons: 1 });
        fireEvent.pointerUp(canvas, { clientX: 330, clientY: 16 });
        expect(outline).not.toHaveBeenCalled();
        expect(onColumnResizeStart).not.toHaveBeenCalled();
        expect(props.onColumnResize).not.toHaveBeenCalled();
    });

    test("per-column limits can reopen a fixed grid range; other fixed selected columns stay untouched", () => {
        const onColumnResize = vi.fn();
        const onColumnResizeEnd = vi.fn();
        const { canvas, hover } = mount({
            minColumnWidth: 160,
            maxColumnWidth: 160,
            columns: basicProps.columns.map((c, i) => (i === 1 ? { ...c, maxWidth: 300 } : c)),
            gridSelection: { columns: CompactSelection.fromSingleSelection([1, 3]), rows: CompactSelection.empty() },
            onColumnResize,
            onColumnResizeEnd,
        });
        hover(310);
        expect(canvas.style.cursor).toBe("col-resize");
        fireEvent.pointerDown(canvas, { clientX: 310, clientY: 16 });
        fireEvent.pointerMove(canvas, { clientX: 340, clientY: 16, buttons: 1 });
        fireEvent.pointerUp(canvas, { clientX: 340, clientY: 16 });
        for (const callback of [onColumnResize, onColumnResizeEnd]) {
            expect(callback).toHaveBeenCalled();
            expect(callback.mock.calls.every(([, , index]) => index === 1)).toBe(true);
        }
    });

    test("excludes row markers and uses normalized data-column indexes", () => {
        const { ref, outline, hover, frame } = mount({ rowMarkers: "both" });
        const bounds = ref.current?.getBounds(0, -1);
        if (bounds === undefined) throw new Error("Missing header bounds");
        hover(bounds.x - 1);
        expect(outline).not.toHaveBeenCalled();
        hover(bounds.x + bounds.width - 1);
        expect(frame()?.hoveredResizeCol).toBe(1); // internal index includes the row marker
        expect(outline).toHaveBeenCalled();
    });

    test("supports the outer edge of the last column", () => {
        const { outline, hover, frame } = mount({ columns: basicProps.columns.slice(0, 2) });
        hover(312);
        expect(frame()?.hoveredResizeCol).toBe(1);
        expect(outline.mock.calls.some(([, x]) => x === 310)).toBe(true);
    });

    test("clears the outer edge above the canvas, including indirect moves", () => {
        const { hover, canvas, frame } = mount({ columns: basicProps.columns.slice(0, 2) });
        for (const target of [document.body, canvas]) {
            hover(312);
            expect(canvas.style.cursor).toBe("col-resize");
            expect(frame()?.hoveredResizeCol).toBe(1);
            fireEvent.pointerMove(target, { clientX: 312, clientY: -50, buttons: 0 });
            expect(canvas.style.cursor).not.toBe("col-resize");
            expect(frame()?.hoveredResizeCol).toBeUndefined();
        }
    });

    test.each(["single-buffer", "double-buffer"] as const)(
        "redraws only the header when hover enters, moves or leaves (%s)",
        renderStrategy => {
            const onFrameDrawn = vi.fn();
            const { hover, frame, outline } = mount({ experimental: { renderStrategy, onFrameDrawn } });
            for (const [x, col] of [
                [310, 1],
                [480, 2],
                [400, undefined],
            ] as const) {
                onFrameDrawn.mockClear();
                outline.mockClear();
                hover(x);
                expect(frame()?.hoveredResizeCol).toBe(col);
                expect(onFrameDrawn).toHaveBeenLastCalledWith({ kind: "damage", header: true, regions: [] });
                if (col !== undefined) expect(outline.mock.calls.some(([, edge]) => edge === x)).toBe(true);
            }
        }
    );

    test("keeps the hover line when an offscreen selection redraws only the header", () => {
        const onFrameDrawn = vi.fn();
        const { hover, frame, outline } = mount({
            rows: 1000,
            experimental: { onFrameDrawn, renderStrategy: "single-buffer" },
        });
        hover(310);
        const hovered = frame();
        if (hovered === undefined) throw new Error("Missing hover frame");
        const selectOffscreen = (x: number) => ({
            ...hovered,
            selection: {
                ...hovered.selection,
                current: { cell: [x, 500] as const, range: { x, y: 500, width: 1, height: 1 }, rangeStack: [] },
            },
        });
        const first = selectOffscreen(1);
        gridRenderer.drawGrid(first, hovered);
        outline.mockClear();
        gridRenderer.drawGrid(selectOffscreen(2), first);
        expect(onFrameDrawn).toHaveBeenLastCalledWith({ kind: "selection", header: true, regions: [] });
        expect(outline).toHaveBeenCalledOnce();
        expect(outline.mock.calls[0].slice(1, 4)).toEqual([310, 0, 36]);
    });

    test("clears hover on blur and leaving the window", () => {
        const { hover, frame, canvas } = mount();
        for (const clear of [
            () => fireEvent.blur(window),
            () => fireEvent.pointerOut(canvas, { relatedTarget: null }),
        ]) {
            hover(310);
            expect(frame()?.hoveredResizeCol).toBe(1);
            clear();
            expect(frame()?.hoveredResizeCol).toBeUndefined();
        }
    });

    test("keeps hover on vertical and unrelated scroll, clears it on horizontal scroll", () => {
        const { hover, frame, scroller } = mount({ rows: 1000, smoothScrollX: true, smoothScrollY: true });
        if (scroller === null) throw new Error("Missing scroller");
        hover(310);
        fireEvent.scroll(document.body);
        expect(frame()?.hoveredResizeCol).toBe(1);
        vi.spyOn(scroller, "scrollHeight", "get").mockReturnValue(32_000);
        vi.spyOn(scroller, "scrollWidth", "get").mockReturnValue(2000);
        fireEvent.scroll(scroller, { target: { scrollTop: 80 } });
        expect(frame()?.translateY !== 0 || frame()?.cellYOffset !== 0).toBe(true);
        expect(frame()?.hoveredResizeCol).toBe(1);
        fireEvent.scroll(scroller, { target: { scrollLeft: 90 } });
        expect(frame()?.hoveredResizeCol).toBeUndefined();
    });

    test.each([16, 80])("data and selection updates do not remeasure a stationary pointer at y=%i", y => {
        const { hover, canvas, frame, result, props, ref } = mount({ scrollToActiveCell: false }, DataEditor);
        hover(310, y);
        const measure = vi.spyOn(canvas, "getBoundingClientRect");
        for (const row of [2, 3, 4]) {
            result.rerender(
                <DataEditor
                    {...props}
                    ref={ref}
                    getCellContent={cell => props.getCellContent(cell)}
                    gridSelection={{
                        rows: CompactSelection.fromSingleSelection(row),
                        columns: CompactSelection.empty(),
                    }}
                />
            );
            expect(frame()?.hoveredResizeCol).toBe(y === 16 ? 1 : undefined);
        }
        expect(measure).not.toHaveBeenCalled();
    });

    test.each([{ resizeIndicatorOnHover: false }, { onColumnResize: undefined }])(
        "clears a visible line when disabled: %j",
        disabled => {
            const { hover, frame, props, result, ref, canvas } = mount();
            hover(310);
            expect(frame()?.hoveredResizeCol).toBe(1);
            result.rerender(<EventedDataEditor {...props} {...disabled} ref={ref} />);
            expect(frame()?.hoveredResizeCol).toBeUndefined();
            expect(canvas.style.cursor === "col-resize").toBe(disabled.resizeIndicatorOnHover === false);
        }
    );

    test("rechecks a stationary header pointer when column widths change", () => {
        const { hover, frame, props, result, ref, canvas } = mount();
        hover(310);
        expect(frame()?.hoveredResizeCol).toBe(1);
        result.rerender(
            <EventedDataEditor
                {...props}
                ref={ref}
                columns={props.columns.map((c, i) => (i === 1 ? { ...c, width: 210 } : c))}
            />
        );
        expect(frame()?.hoveredResizeCol).toBeUndefined();
        expect(canvas.style.cursor).not.toBe("col-resize");
        result.rerender(<EventedDataEditor {...props} ref={ref} />);
        expect(frame()?.hoveredResizeCol).toBe(1);
        expect(canvas.style.cursor).toBe("col-resize");
    });

    test("resizes a spanGroupHeader column from the upper group band", () => {
        const { hover, canvas, frame, outline } = mount({
            columns: basicProps.columns.map((c, i) =>
                i === 0 ? { ...c, spanGroupHeader: true } : { ...c, group: "Group" }
            ),
        });
        hover(149, 12);
        expect(frame()?.hoveredResizeCol).toBe(0);
        expect(outline.mock.calls.at(-1)?.slice(1, 4)).toEqual([150, 0, 68]);
        fireEvent.pointerDown(canvas, { clientX: 149, clientY: 12 });
        expect(frame()?.isResizing).toBe(true);
    });

    test("does not show a mouse hover indicator for touch input", () => {
        const { canvas, outline } = mount();
        const touch = new MouseEvent("pointermove", { bubbles: true, clientX: 310, clientY: 16 });
        Object.defineProperty(touch, "pointerType", { value: "touch" });
        fireEvent(canvas, touch);
        expect(outline).not.toHaveBeenCalled();
    });

    test("hands off to drag and restores hover at the resized edge, preserving callbacks", () => {
        const onColumnResizeStart = vi.fn();
        const onColumnResizeEnd = vi.fn();
        const { canvas, hover, frame, result, props, ref, outline } = mount({
            onColumnResizeStart,
            onColumnResizeEnd,
            theme: { resizeIndicatorColor: "#0B7ECB" },
        });
        hover(310);
        outline.mockClear();
        fireEvent.pointerDown(canvas, { clientX: 310, clientY: 16 });
        expect(
            outline.mock.calls.some(
                ([, x, top, bottom, color]) => x === 310 && top === 36 && bottom === 1000 && color === "#0B7ECB"
            )
        ).toBe(true);
        fireEvent.pointerMove(canvas, { clientX: 350, clientY: 16, buttons: 1 });
        expect(frame()).toMatchObject({ isResizing: true, hoveredResizeCol: undefined });
        result.rerender(
            <EventedDataEditor
                {...props}
                ref={ref}
                columns={props.columns.map((column, index) => (index === 1 ? { ...column, width: 200 } : column))}
            />
        );
        outline.mockClear();
        fireEvent.pointerUp(canvas, { clientX: 350, clientY: 16 });
        expect(frame()).toMatchObject({ isResizing: false, hoveredResizeCol: 1 });
        expect(outline).toHaveBeenCalled();
        expect(outline.mock.calls.every(([, x, top, bottom]) => x === 350 && top === 0 && bottom === 36)).toBe(true);
        expect(onColumnResizeStart).toHaveBeenCalledOnce();
        expect(onColumnResizeEnd).toHaveBeenCalledOnce();
    });

    test("does not restore hover after release away from the actual edge", () => {
        const { canvas, hover, frame } = mount();
        hover(310);
        fireEvent.pointerDown(canvas, { clientX: 310, clientY: 16 });
        fireEvent.pointerMove(canvas, { clientX: 900, clientY: 16, buttons: 1 });
        fireEvent.pointerUp(canvas, { clientX: 900, clientY: 16 });
        expect(frame()).toMatchObject({ isResizing: false, hoveredResizeCol: undefined });
    });

    test("does not restore hover when another element covers the header at release", () => {
        const { canvas, hover, frame } = mount();
        hover(310);
        fireEvent.pointerDown(canvas, { clientX: 310, clientY: 16 });
        fireEvent.pointerUp(document.body, { clientX: 310, clientY: 16 });
        expect(frame()).toMatchObject({ isResizing: false, hoveredResizeCol: undefined });
    });

    test.each(["single-buffer", "double-buffer", "direct"] as const)(
        "repairs hover only in the header and drag in the body after damage (%s)",
        renderStrategy => {
            const { outline, hover, ref, canvas } = mount({ experimental: { renderStrategy } });
            hover(310);
            for (const row of [-1, 0]) {
                outline.mockClear();
                act(() => ref.current?.updateCells([{ cell: [1, row] }]));
                expect(outline.mock.calls.some(([, , top]) => top === 36)).toBe(false);
                if (row === -1) {
                    expect(
                        outline.mock.calls.some(([, x, top, bottom]) => x === 310 && top === 0 && bottom === 36)
                    ).toBe(true);
                }
            }
            fireEvent.pointerDown(canvas, { clientX: 310, clientY: 16 });
            for (const row of [-1, 0]) {
                outline.mockClear();
                act(() => ref.current?.updateCells([{ cell: [1, row] }]));
                expect(outline.mock.calls.some(([, x, top]) => x === 310 && top === 36)).toBe(true);
                if (row === -1) {
                    expect(
                        outline.mock.calls.some(([, x, top, bottom]) => x === 310 && top === 0 && bottom === 37)
                    ).toBe(true);
                }
            }
        }
    );

    test("uses the full grouped header height at a frozen boundary", () => {
        const { outline, hover } = mount({
            freezeColumns: 1,
            columns: basicProps.columns.map(column => ({ ...column, group: "Group" })),
        });
        hover(150, 50);
        expect(outline).toHaveBeenCalled();
        expect(outline.mock.calls.every(([, x, top, bottom]) => x === 150 && top === 0 && bottom === 68)).toBe(true);
    });
});
