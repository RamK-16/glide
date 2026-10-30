import { describe, expect, test } from "vitest";
import { getRowOffsets, getVisibleRows } from "../src/internal/scrolling-data-grid/row-offsets.js";

function visibleRowsByLoop(y: number, height: number, rows: number, rowHeight: (r: number) => number, smooth: boolean) {
    let ty = 0;
    let cellY = 0;
    let cellBottom = 0;
    let top = 0;
    for (let row = 0; row < rows; row++) {
        const rh = rowHeight(row);
        const cy = top + (smooth ? 0 : rh / 2);
        if (y >= top + rh) {
            top += rh;
            cellY++;
            cellBottom++;
        } else if (y > cy) {
            top += rh;
            if (smooth) {
                ty += cy - y;
            } else {
                cellY++;
            }
            cellBottom++;
        } else if (y + height > rh / 2 + top) {
            top += rh;
            cellBottom++;
        } else {
            break;
        }
    }
    return { cellY, cellBottom, ty };
}

const uneven = (r: number) => (r % 3 === 0 ? 30 : r % 2 ? 50 : 61);
const heightsOf = (heights: readonly number[]) => (r: number) => heights[r];

describe("getRowOffsets", () => {
    test("offsets are row tops, the last one is the total height", () => {
        expect([...getRowOffsets(3, uneven)]).toEqual([0, 30, 80, 141]);
        expect([...getRowOffsets(0, uneven)]).toEqual([0]);
    });

    test("overwrites a buffer of the same length, allocates for another length", () => {
        const buffer = getRowOffsets(3, () => 10);
        expect(getRowOffsets(3, uneven, buffer)).toBe(buffer);
        expect([...buffer]).toEqual([0, 30, 80, 141]);

        const longer = getRowOffsets(4, uneven, buffer);
        expect(longer).not.toBe(buffer);
        expect([...longer]).toEqual([0, 30, 80, 141, 171]);
    });
});

describe("getVisibleRows", () => {
    test.each([true, false])("matches the per-row walk, smoothScrollY=%s", smooth => {
        const rows = 200;
        const offsets = getRowOffsets(rows, uneven);
        const total = offsets[rows];
        for (const height of [0, 25, 300, total + 100]) {
            for (let y = -40; y <= total + 40; y += 7) {
                expect(getVisibleRows(y, height, uneven, offsets, smooth)).toEqual(
                    visibleRowsByLoop(y, height, rows, uneven, smooth)
                );
            }
        }
    });

    test.each([
        ["integer", (n: number) => Math.floor(n * 200)],
        ["fractional", (n: number) => n * 100],
        ["rem-scaled", (n: number) => [34, 46, 58][Math.floor(n * 3)] * 1.15],
        ["mostly zero", (n: number) => (n < 0.7 ? 0 : 30.1)],
    ])("matches the per-row walk exactly at row tops and middles, %s heights", (_, height) => {
        let seed = 7;
        const random = () => (seed = (seed * 1_103_515_245 + 12_345) % 2_147_483_648) / 2_147_483_648;
        for (let iter = 0; iter < 10; iter++) {
            const rows = Math.floor(random() * 150);
            const heights: number[] = [];
            for (let r = 0; r < rows; r++) heights.push(height(random()));
            const rowHeight = heightsOf(heights);
            const offsets = getRowOffsets(rows, rowHeight);
            let top = 0;
            for (let r = 0; r < rows; r++) {
                const rh = heights[r];
                for (const y of [top, top + rh / 2, top + rh, top + rh / 2 + 1e-9]) {
                    for (const viewport of [0, 33.3, 500]) {
                        for (const smooth of [true, false]) {
                            expect(getVisibleRows(y, viewport, rowHeight, offsets, smooth)).toEqual(
                                visibleRowsByLoop(y, viewport, rows, rowHeight, smooth)
                            );
                        }
                    }
                }
                top += rh;
            }
        }
    });

    test("no rows", () => {
        expect(getVisibleRows(10, 100, uneven, getRowOffsets(0, uneven), true)).toEqual({
            cellY: 0,
            cellBottom: 0,
            ty: 0,
        });
    });

    test("asks rowHeight only for visible rows", () => {
        const rows = 1_000_000;
        const offsets = getRowOffsets(rows, uneven);
        let calls = 0;
        const counted = (r: number) => {
            calls++;
            return uneven(r);
        };
        getVisibleRows(offsets[500_000] + 10, 600, counted, offsets, true);
        expect(calls).toBeLessThan(30);
    });
});
