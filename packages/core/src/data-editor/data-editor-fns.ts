import type { DataGridSearchProps } from "../internal/data-grid-search/data-grid-search.js";
import { type GridCell, type GridSelection, type Rectangle } from "../internal/data-grid/data-grid-types.js";
import { getCopyBufferContents, type CopyBuffer } from "./copy-paste.js";

export function expandSelection(
    newVal: GridSelection,
    getCellsForSelection: DataGridSearchProps["getCellsForSelection"],
    rowMarkerOffset: number,
    spanRangeBehavior: "allowPartial" | "default",
    abortController: AbortController
): GridSelection {
    const origVal = newVal;
    if (spanRangeBehavior === "allowPartial" || newVal.current === undefined || getCellsForSelection === undefined)
        return newVal;
    let isFilled = false;
    do {
        if (newVal?.current === undefined) break;
        const r: Rectangle = newVal.current?.range;
        const cells: (readonly GridCell[])[] = [];

        const collect = (rect: Rectangle): boolean => {
            const fetched = getCellsForSelection(rect, abortController.signal);
            if (typeof fetched === "function") return false;
            cells.push(...fetched);
            return true;
        };

        if (r.width > 2) {
            // Боковые полосы — как раньше: colspan ловим по левому/правому столбцу.
            if (!collect({ x: r.x, y: r.y, width: 1, height: r.height })) return origVal;
            if (!collect({ x: r.x + r.width - 1, y: r.y, width: 1, height: r.height })) return origVal;
            // Высокий диапазон — добираем верхнюю/нижнюю строки, чтобы поймать rowspan,
            // пересекающий верхнюю/нижнюю границу (симметрично боковым полосам для colspan).
            if (r.height > 2) {
                if (!collect({ x: r.x, y: r.y, width: r.width, height: 1 })) return origVal;
                if (!collect({ x: r.x, y: r.y + r.height - 1, width: r.width, height: 1 })) return origVal;
            }
        } else {
            // Узкий по ширине диапазон берём целиком — ловит и colspan, и rowspan.
            if (!collect({ x: r.x, y: r.y, width: r.width, height: r.height })) return origVal;
        }

        let left = r.x - rowMarkerOffset;
        let right = r.x + r.width - 1 - rowMarkerOffset;
        let top = r.y;
        let bottom = r.y + r.height - 1;
        for (const row of cells) {
            for (const cell of row) {
                if (cell.span !== undefined) {
                    left = Math.min(cell.span[0], left);
                    right = Math.max(cell.span[1], right);
                }
                if (cell.spanRows !== undefined) {
                    top = Math.min(cell.spanRows[0], top);
                    bottom = Math.max(cell.spanRows[1], bottom);
                }
            }
        }

        if (
            left === r.x - rowMarkerOffset &&
            right === r.x + r.width - 1 - rowMarkerOffset &&
            top === r.y &&
            bottom === r.y + r.height - 1
        ) {
            isFilled = true;
        } else {
            newVal = {
                current: {
                    cell: newVal.current.cell ?? [0, 0],
                    range: {
                        x: left + rowMarkerOffset,
                        y: top,
                        width: right - left + 1,
                        height: bottom - top + 1,
                    },
                    rangeStack: newVal.current.rangeStack,
                },
                columns: newVal.columns,
                rows: newVal.rows,
            };
        }
    } while (!isFilled);
    return newVal;
}

function descape(s: string): string {
    if (s.startsWith('"') && s.endsWith('"')) {
        s = s.slice(1, -1).replace(/""/g, '"');
    }
    return s;
}

export function unquote(str: string): CopyBuffer {
    const enum State {
        None,
        inString,
        inStringPostQuote,
    }

    const result: string[][] = [];
    let current: string[] = [];

    let start = 0;
    let state = State.None;
    str = str.replace(/\r\n/g, "\n");
    let index = 0;
    for (const char of str) {
        switch (state) {
            case State.None:
                if (char === "\t" || char === "\n") {
                    current.push(str.slice(start, index));
                    start = index + 1;

                    if (char === "\n") {
                        result.push(current);
                        current = [];
                    }
                } else if (char === `"`) {
                    state = State.inString;
                }
                break;
            case State.inString:
                if (char === `"`) {
                    state = State.inStringPostQuote;
                }
                break;
            case State.inStringPostQuote:
                if (char === '"') {
                    state = State.inString;
                } else if (char === "\t" || char === "\n") {
                    current.push(descape(str.slice(start, index)));
                    start = index + 1;

                    if (char === "\n") {
                        result.push(current);
                        current = [];
                    }
                    state = State.None;
                } else {
                    state = State.None;
                }
                break;
        }

        index++;
    }
    if (start < str.length) {
        current.push(descape(str.slice(start, str.length)));
    }
    result.push(current);
    return result.map(r => r.map(c => ({ rawValue: c, formatted: c, format: "string" })));
}

export function copyToClipboard(
    cells: readonly (readonly GridCell[])[],
    columnIndexes: readonly number[],
    e?: ClipboardEvent
) {
    const copyBuffer = getCopyBufferContents(cells, columnIndexes);

    // eslint-disable-next-line unicorn/consistent-function-scoping
    const copyWithWriteText = (s: string) => {
        void window.navigator.clipboard?.writeText(s);
    };

    const copyWithWrite = (s: string, html: string): boolean => {
        if (window.navigator.clipboard?.write === undefined) return false;
        void window.navigator.clipboard.write([
            new ClipboardItem({
                // eslint-disable-next-line sonarjs/no-duplicate-string
                "text/plain": new Blob([s], { type: "text/plain" }),
                "text/html": new Blob([html], {
                    type: "text/html",
                }),
            }),
        ]);
        return true;
    };

    const copyWithClipboardData = (s: string, html: string) => {
        try {
            if (e === undefined || e.clipboardData === null) throw new Error("No clipboard data");

            // This might fail if we had to await the thunk
            e?.clipboardData?.setData("text/plain", s);
            e?.clipboardData?.setData("text/html", html);
        } catch {
            if (!copyWithWrite(s, html)) {
                copyWithWriteText(s);
            }
        }
    };

    if (window.navigator.clipboard?.write !== undefined || e?.clipboardData !== undefined) {
        void copyWithClipboardData(copyBuffer.textPlain, copyBuffer.textHtml);
    } else {
        void copyWithWriteText(copyBuffer.textPlain);
    }

    e?.preventDefault();
}

/**
 * Checkbox behavior:
 *
 * true + click -> unchecked
 * false + click -> checked
 * indeterminate + click -> checked
 * empty + click -> checked
 */
export function toggleBoolean(data: boolean | null | undefined): boolean | null | undefined {
    return data !== true;
}
