/* eslint-disable sonarjs/no-duplicate-string */
import * as React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { vi, expect, describe, test, beforeEach, afterEach } from "vitest";
import { GridCellKind, type CustomCell, type DataEditorRef, type GridCell, type Item } from "../src/index.js";
import {
    EventedDataEditor,
    basicProps,
    prep,
    Context,
    standardBeforeEach,
    standardAfterEach,
    getCellCenterPositionForDefaultGrid,
} from "./test-utils.js";

// Обёртки над таблицей нередко перерисовывают ячейки синхронно из onItemHovered
// (updateCells прежней и новой строки). Информация о наведении для отрисовки
// должна к этому моменту быть уже новой: иначе прежняя ячейка рисуется с
// координатами курсора, который из неё ушёл, а новая без них.
describe("data-editor: наведение в damage-перерисовке из onItemHovered", () => {
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

    test("прежняя ячейка рисуется без hoverX, новая с hoverX", async () => {
        vi.useFakeTimers();

        const customCell = (_cell: Item): GridCell => ({
            kind: GridCellKind.Custom,
            allowOverlay: false,
            data: "custom",
            copyData: "custom",
        });

        const draws: { cell: Item; hoverX: number | undefined }[] = [];
        const ref = React.createRef<DataEditorRef>();
        let previous: Item | undefined;

        render(
            <EventedDataEditor
                {...basicProps}
                ref={ref}
                getCellContent={customCell}
                customRenderers={[
                    {
                        kind: GridCellKind.Custom,
                        isMatch: (_cell: CustomCell): _cell is CustomCell => true,
                        needsHover: true,
                        needsHoverPosition: true,
                        draw: args => {
                            draws.push({ cell: [args.col, args.row], hoverX: args.hoverX });
                            return true;
                        },
                    },
                ]}
                onItemHovered={args => {
                    if (args.kind !== "cell") return;
                    const cells = [{ cell: args.location }];
                    if (previous !== undefined) cells.push({ cell: previous });
                    previous = args.location;
                    ref.current?.updateCells(cells);
                }}
            />,
            {
                wrapper: Context,
            }
        );
        prep(false);

        const canvas = screen.getByTestId("data-grid-canvas");
        const [ax, ay] = getCellCenterPositionForDefaultGrid([1, 1]);
        const [bx, by] = getCellCenterPositionForDefaultGrid([2, 1]);

        fireEvent.pointerMove(canvas, { clientX: ax, clientY: ay });
        vi.runAllTimers();
        draws.length = 0;

        fireEvent.pointerMove(canvas, { clientX: bx, clientY: by });
        vi.runAllTimers();

        const drawsOfA = draws.filter(d => d.cell[0] === 1 && d.cell[1] === 1);
        const drawsOfB = draws.filter(d => d.cell[0] === 2 && d.cell[1] === 1);

        expect(drawsOfA.length).toBeGreaterThan(0);
        expect(drawsOfA.every(d => d.hoverX === undefined)).toBe(true);
        expect(drawsOfB.some(d => d.hoverX !== undefined)).toBe(true);
    });
});
