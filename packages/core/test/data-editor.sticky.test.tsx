import * as React from "react";
import { render, act } from "@testing-library/react";
import { vi, expect, describe, test, beforeEach, afterEach } from "vitest";
import type { DataEditorRef } from "../src/data-editor/data-editor.js";
import { EventedDataEditor, basicProps, prep, Context, standardBeforeEach, standardAfterEach } from "./test-utils.js";

describe("data-editor: липкие строки и колонки", () => {
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

    test("липкие колонки и строки попадают в freezeRegions", async () => {
        const spy = vi.fn();
        vi.useFakeTimers();
        render(
            <EventedDataEditor
                {...basicProps}
                stickyColumns={[6, 5, 9, 99]}
                stickyRows={[400, 401, 3]}
                onVisibleRegionChanged={spy}
            />,
            { wrapper: Context }
        );
        prep();

        const extras = spy.mock.calls.at(-1)?.[3];
        // Колонки 5–6 склеены в один регион, строки 400–401 тоже; 99 вне колонок отброшена.
        expect(extras.freezeRegions).toEqual([
            { x: 5, y: 0, width: 2, height: 32 },
            { x: 9, y: 0, width: 1, height: 32 },
            { x: 0, y: 3, width: 10, height: 1 },
            { x: 5, y: 3, width: 2, height: 1 },
            { x: 9, y: 3, width: 1, height: 1 },
            { x: 0, y: 400, width: 10, height: 2 },
            { x: 5, y: 400, width: 2, height: 2 },
            { x: 9, y: 400, width: 1, height: 2 },
        ]);
    });

    function scrollTopFor(stickyRows: readonly number[] | undefined): number {
        const ref = React.createRef<DataEditorRef>();
        const view = render(<EventedDataEditor ref={ref} {...basicProps} rows={10_000} stickyRows={stickyRows} />, {
            wrapper: Context,
        });
        prep(false);
        act(() => {
            ref.current?.scrollTo(5, 500, "both", 0, 0, { vAlign: "start" });
        });
        act(() => {
            vi.runAllTimers();
        });
        const mock = Element.prototype.scrollTo as unknown as { mock: { calls: { top: number }[][] } };
        const top = mock.mock.calls.at(-1)?.[0].top ?? Number.NaN;
        view.unmount();
        return top;
    }

    test("scrollTo оставляет цель под липкими строками выше неё", async () => {
        vi.useFakeTimers();
        const plain = scrollTopFor(undefined);
        // Строки 1 и 2 выше цели прилипнут — цель должна встать под ними; 700 ниже цели не влияет.
        const sticky = scrollTopFor([1, 2, 700]);
        expect(plain - sticky).toBe(2 * 32);
    });
});
