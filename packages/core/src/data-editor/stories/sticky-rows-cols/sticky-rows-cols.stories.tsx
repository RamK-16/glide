/* eslint-disable sonarjs/no-duplicate-string */
import * as React from "react";

import { BuilderThemeWrapper } from "../../../stories/story-utils.js";
import {
    type GridCell,
    GridCellKind,
    type GridColumn,
    type Item,
} from "../../../internal/data-grid/data-grid-types.js";
import { DataEditorAll as DataEditor } from "../../../data-editor-all.js";

export default {
    title: "Tests/StickyRowsCols",

    decorators: [
        (Story: React.ComponentType) => (
            <BuilderThemeWrapper width={1200} height={620}>
                <Story />
            </BuilderThemeWrapper>
        ),
    ],
};

function makeColumns(count: number, sticky: readonly number[], width = 120): GridColumn[] {
    return Array.from({ length: count }, (_, index) => ({
        title: sticky.includes(index) ? `Sticky ${index}` : `Col ${index}`,
        width,
        group: index < 3 ? "Группа A" : index < 12 ? "Группа B" : "Группа C",
    }));
}

function Description({ children }: { children: React.ReactNode }) {
    return <div style={{ padding: "6px 0", fontSize: 13 }}>{children}</div>;
}

function StickyShell({
    rows,
    columns,
    stickyRows,
    stickyColumns,
    freezeColumns,
    rowHeight,
    spanRows,
    description,
}: {
    rows: number;
    columns: number;
    stickyRows?: readonly number[];
    stickyColumns?: readonly number[];
    freezeColumns?: number;
    rowHeight?: number | ((row: number) => number);
    spanRows?: readonly [number, number];
    description: React.ReactNode;
}) {
    const gridColumns = React.useMemo(() => makeColumns(columns, stickyColumns ?? []), [columns, stickyColumns]);
    const getCellContent = React.useCallback(
        ([col, row]: Item): GridCell => {
            const inSpan = spanRows !== undefined && col === 2 && row >= spanRows[0] && row <= spanRows[1];
            const text = inSpan
                ? `Блок ${spanRows[0]}–${spanRows[1]}`
                : stickyRows?.includes(row) === true
                  ? `Липкая строка ${row}`
                  : `${col}:${row}`;
            return {
                kind: GridCellKind.Text,
                displayData: text,
                data: text,
                allowOverlay: true,
                readonly: false,
                spanRows: inSpan ? spanRows : undefined,
            };
        },
        [spanRows, stickyRows]
    );
    const [selection, setSelection] = React.useState<React.ComponentProps<typeof DataEditor>["gridSelection"]>();
    return (
        <>
            <Description>{description}</Description>
            <DataEditor
                width={1200}
                height={560}
                columns={gridColumns}
                rows={rows}
                rowHeight={rowHeight}
                getCellContent={getCellContent}
                stickyRows={stickyRows}
                stickyColumns={stickyColumns}
                freezeColumns={freezeColumns}
                gridSelection={selection}
                onGridSelectionChange={setSelection}
                rowMarkers="number"
                smoothScrollX={true}
                smoothScrollY={true}
            />
        </>
    );
}

export const RowsAndColumns = () => (
    <StickyShell
        rows={10_000}
        columns={60}
        stickyRows={[3, 10, 40]}
        stickyColumns={[4, 9]}
        freezeColumns={1}
        description="Строки 3, 10, 40 и колонки 4, 9 прилипают при прокрутке; колонка 0 закреплена всегда (freezeColumns)."
    />
);

export const VariableRowHeight = () => (
    <StickyShell
        rows={100_000}
        columns={200}
        stickyRows={[1, 5, 50, 51]}
        stickyColumns={[0, 3, 10]}
        rowHeight={row => (row % 3 === 0 ? 48 : 30)}
        description="100 000 строк с переменной высотой, 200 колонок. Липкие строки 1, 5, 50, 51 и колонки 0, 3, 10."
    />
);

export const WithRowSpan = () => (
    <StickyShell
        rows={2000}
        columns={30}
        stickyRows={[6]}
        stickyColumns={[5]}
        spanRows={[4, 12]}
        description="Строка 6 липкая и входит в слитый блок 4–12 в колонке 2: текст блока рисуется в закреплённом фрагменте, прокручиваемая часть — только фон."
    />
);

const tallStickyHeight = (row: number) => ([2, 8, 9].includes(row) ? 64 : 30);

export const TallStickyRows = () => (
    <StickyShell
        rows={5000}
        columns={40}
        stickyRows={[2, 8, 9]}
        stickyColumns={[3]}
        rowHeight={tallStickyHeight}
        description="Липкие строки 2, 8, 9 выше обычных (64px против 30px): полоса растёт ступенями, строки под ней уходят без зазоров."
    />
);

// Детерминированный «шум», чтобы высоты не менялись между перерисовками.
const randomHeight = (row: number) => 24 + ((row * 2_654_435_761) % 67);

export const RandomRowHeights = () => (
    <StickyShell
        rows={50_000}
        columns={60}
        stickyRows={[0, 7, 30, 31, 32]}
        stickyColumns={[2, 6]}
        rowHeight={randomHeight}
        description="Высота каждой строки от 24 до 90px. Липкие строки 0, 7, 30–32 разной высоты, в том числе подряд идущие."
    />
);

const shortRowsTallBand = (row: number) => (row < 6 ? 90 : 26);

export const BandTallerThanHalfScreen = () => (
    <StickyShell
        rows={3000}
        columns={30}
        stickyRows={[0, 1, 2, 3]}
        rowHeight={shortRowsTallBand}
        description="Четыре липкие строки по 90px занимают больше половины экрана; остальные строки по 26px прокручиваются под ними."
    />
);

const spanHeights = (row: number) => (row % 2 === 0 ? 22 : 44);

export const RowSpanWithVariableHeights = () => (
    <StickyShell
        rows={2000}
        columns={30}
        stickyRows={[5, 6]}
        spanRows={[3, 14]}
        rowHeight={spanHeights}
        description="Слитый блок 3–14 в колонке 2 из строк высотой 22 и 44px; липкие строки 5 и 6 внутри блока прилипают одним фрагментом."
    />
);
