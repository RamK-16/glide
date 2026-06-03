import * as React from "react";

import { useState, useMemo } from "storybook/preview-api";
import { BuilderThemeWrapper } from "../../stories/story-utils.js";
import {
    type CustomCell,
    type GridCell,
    GridCellKind,
    type GridColumn,
    type Item,
} from "../../internal/data-grid/data-grid-types.js";
import type { DataEditorRef } from "../data-editor.js";
import type { CustomRenderer, DrawArgs } from "../../cells/cell-types.js";
import type { GridMouseEventArgs } from "../../internal/data-grid/event-args.js";
import { DataEditorAll as DataEditor } from "../../data-editor-all.js";
import { styled } from "@linaria/react";

export default {
    title: "Tests/TestCases/Bugs",

    decorators: [
        (Story: React.ComponentType) => (
            <BuilderThemeWrapper width={1000} height={800}>
                <Story />
            </BuilderThemeWrapper>
        ),
    ],
};

const bug70Gen = ([, row]: Item): GridCell => ({
    allowOverlay: true,
    kind: GridCellKind.Number,
    data: row,
    displayData: row.toString(),
});

const ignore = () => undefined;

const Bug70Style = styled.div`
    display: flex;
    flex-direction: column;

    > a {
        margin-bottom: 20px;
    }
`;

export function Bug70() {
    const cols = [
        { title: "Col1", width: 100 },
        { title: "Col2", width: 100 },
    ];

    return (
        <Bug70Style className="App">
            <p>To cause error: scroll down at least one row, edit a cell in Col2, and hit Tab</p>
            <a href="https://github.com/glideapps/glide-data-grid/issues/70" target="_blank" rel="noreferrer">
                Original report
            </a>
            <DataEditor
                width={500}
                height={500}
                rows={100}
                columns={cols}
                getCellContent={bug70Gen}
                onCellEdited={ignore}
            />
        </Bug70Style>
    );
}

const filterColumnsGen = ([col, row]: Item): GridCell => ({
    allowOverlay: true,
    kind: GridCellKind.Text,
    data: `${col} - ${row}`,
    displayData: `${col} - ${row}`,
});

const filteringColumns = [
    { title: "Col AAAA", width: 120 },
    { title: "Col AAA", width: 120 },
    { title: "Col AA", width: 120 },
    { title: "Col A", width: 120 },
    { title: "Col", width: 120 },
];

export function FilterColumns() {
    const [searchText, setSearchText] = useState("");

    const cols = useMemo(() => {
        if (searchText === "") {
            return filteringColumns;
        }

        return filteringColumns.filter(c => c.title.toLowerCase().includes(searchText.toLowerCase()));
    }, [searchText]);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    return (
        <div>
            <input value={searchText} onChange={onInputChange} />
            <DataEditor
                width={1000}
                height={500}
                rows={100}
                columns={cols}
                getCellContent={filterColumnsGen}
                smoothScrollX={true}
                smoothScrollY={true}
            />
        </div>
    );
}

interface LowDprHoverCellData {
    readonly kind: "low-dpr-hover-cell";
    readonly text: string;
    readonly rowHover: boolean;
    readonly cellHover: boolean;
}

type LowDprHoverCell = CustomCell<LowDprHoverCellData>;

const lowDprHoverRenderer: CustomRenderer<LowDprHoverCell> = {
    kind: GridCellKind.Custom,
    isMatch: (cell): cell is LowDprHoverCell => "kind" in cell.data && cell.data.kind === "low-dpr-hover-cell",
    draw: (args: DrawArgs<LowDprHoverCell>, cell) => {
        const { ctx, rect, theme } = args;
        const { rowHover, cellHover, text } = cell.data;

        ctx.fillStyle = cellHover ? "#ffe8c2" : rowHover ? "#fff7d8" : theme.bgCell;
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

        ctx.fillStyle = cellHover ? "#8a3b00" : theme.textDark;
        ctx.font = theme.baseFontFull;
        ctx.fillText(text, rect.x + 10, rect.y + rect.height / 2 + 4);

        if (rowHover) {
            ctx.fillStyle = cellHover ? "#d96c00" : "#d9a400";
            ctx.fillRect(rect.x + rect.width - 14, rect.y + 8, 6, rect.height - 16);
        }
    },
    onPaste: () => undefined,
};

const lowDprColumns: readonly GridColumn[] = Array.from({ length: 12 }, (_, index) => ({
    title: `Column ${index + 1}`,
    width: index < 2 ? 130 : 150,
    group: index < 2 ? "Frozen" : index < 6 ? "Group A" : "Group B",
}));

const lowDprRows = 120;

const LowDprHairlineStyle = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export function LowDprHairlineDamageHover() {
    const ref = React.useRef<DataEditorRef>(null);
    const hoveredCellRef = React.useRef<Item | undefined>(undefined);

    const updateRows = React.useCallback((...rows: Array<number | undefined>) => {
        const uniqueRows = new Set(rows.filter((row): row is number => row !== undefined && row >= 0));
        if (uniqueRows.size === 0) return;

        const cells: Array<{ cell: Item }> = [];
        for (const row of uniqueRows) {
            for (let col = 0; col < lowDprColumns.length; col++) {
                cells.push({ cell: [col, row] });
            }
        }

        ref.current?.updateCells(cells);
    }, []);

    const getCellContent = React.useCallback(([col, row]: Item): GridCell => {
        const hoveredCell = hoveredCellRef.current;
        const rowHover = hoveredCell?.[1] === row;
        const cellHover = hoveredCell?.[0] === col && rowHover;

        return {
            kind: GridCellKind.Custom,
            allowOverlay: false,
            copyData: `R${row} C${col}`,
            data: {
                kind: "low-dpr-hover-cell",
                text: `R${row + 1} C${col + 1}`,
                rowHover,
                cellHover,
            },
        };
    }, []);

    const onMouseMove = React.useCallback(
        (event: GridMouseEventArgs) => {
            const previousCell = hoveredCellRef.current;
            const nextCell = event.kind === "cell" ? event.location : undefined;
            const sameCell = previousCell?.[0] === nextCell?.[0] && previousCell?.[1] === nextCell?.[1];

            if (sameCell) return;

            hoveredCellRef.current = nextCell;
            updateRows(previousCell?.[1], nextCell?.[1]);
        },
        [updateRows]
    );

    return (
        <LowDprHairlineStyle>
            <div>
                Set browser zoom below 100%, then move the pointer over rows. The story calls updateCells for the
                previous and next hovered rows while custom cells repaint their full rect.
            </div>
            <DataEditor
                ref={ref}
                width={1000}
                height={560}
                rows={lowDprRows}
                columns={lowDprColumns}
                freezeColumns={2}
                freezeTrailingRows={1}
                groupHeaderHeight={28}
                getCellContent={getCellContent}
                customRenderers={[lowDprHoverRenderer]}
                onMouseMove={onMouseMove}
                experimental={{ enableLowDprHairline: true }}
                smoothScrollX
                smoothScrollY
            />
        </LowDprHairlineStyle>
    );
}
