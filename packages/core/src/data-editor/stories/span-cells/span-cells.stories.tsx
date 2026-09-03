/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable react/no-unescaped-entities */
import * as React from "react";

import { BuilderThemeWrapper } from "../../../stories/story-utils.js";
import {
    type GridCell,
    GridCellKind,
    type GridColumn,
    type Item,
    type SpanAlignment,
} from "../../../internal/data-grid/data-grid-types.js";
import { DataEditorAll as DataEditor } from "../../../data-editor-all.js";

export default {
    title: "Tests/SpanCells",

    decorators: [
        (Story: React.ComponentType) => (
            <BuilderThemeWrapper width={1200} height={620}>
                <Story />
            </BuilderThemeWrapper>
        ),
    ],
};

// =====================================================
// Объединение ячеек тела: прямоугольный блок (span = колонки, spanRows = строки) с
// 2D-выравниванием контента (spanAlign). Каждая покрытая ячейка возвращает одинаковые
// span/spanRows — рендер сам выбирает origin и рисует блок один раз, внутренние линии
// сетки гаснут, контент занимает всю слитую область.
// =====================================================

interface Merge {
    readonly startRow: number;
    readonly endRow: number;
    readonly startCol: number;
    readonly endCol: number;
    readonly label: string;
    readonly spanAlign?: SpanAlignment;
}

function findMerge(merges: readonly Merge[], col: number, row: number): Merge | undefined {
    return merges.find(m => col >= m.startCol && col <= m.endCol && row >= m.startRow && row <= m.endRow);
}

function makeCols(n: number, width = 170): GridColumn[] {
    return Array.from({ length: n }, (_, i) => ({ title: `Col ${i}`, width }));
}

function CellSpanShell({
    cols,
    merges,
    description,
    rowHeight,
    width = 1200,
    height = 620,
    freezeColumns,
}: {
    cols: GridColumn[];
    merges: readonly Merge[];
    description: React.ReactNode;
    rowHeight?: number;
    width?: number;
    height?: number;
    freezeColumns?: number;
}) {
    const getCellContent = React.useCallback(
        ([col, row]: Item): GridCell => {
            const m = findMerge(merges, col, row);
            if (m !== undefined) {
                return {
                    kind: GridCellKind.Text,
                    displayData: m.label,
                    data: m.label,
                    allowOverlay: false,
                    readonly: true,
                    span: m.startCol === m.endCol ? undefined : [m.startCol, m.endCol],
                    spanRows: m.startRow === m.endRow ? undefined : [m.startRow, m.endRow],
                    spanAlign: m.spanAlign,
                };
            }
            return {
                kind: GridCellKind.Text,
                displayData: `${col}·${row}`,
                data: `${col} ${row}`,
                allowOverlay: false,
                readonly: true,
            };
        },
        [merges]
    );

    return (
        <div style={{ width, height }}>
            <div
                style={{
                    marginBottom: 8,
                    fontFamily: "monospace",
                    fontSize: 13,
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
                }}
            >
                {description}
            </div>
            <DataEditor
                width={width}
                height={height - 120}
                getCellContent={getCellContent}
                getCellsForSelection={true}
                columns={cols}
                rows={200}
                rowMarkers="both"
                rowHeight={rowHeight}
                freezeColumns={freezeColumns}
            />
        </div>
    );
}

// 1. Базовое объединение: вертикальный rowspan + прямоугольный блок.
export function SC_Basic() {
    const cols = makeCols(5);
    const merges: Merge[] = [
        { startRow: 1, endRow: 3, startCol: 0, endCol: 0, label: "rowspan 1–3" },
        { startRow: 5, endRow: 8, startCol: 1, endCol: 1, label: "rowspan 5–8" },
        { startRow: 1, endRow: 2, startCol: 2, endCol: 3, label: "блок 2×2" },
    ];
    return (
        <CellSpanShell
            cols={cols}
            merges={merges}
            description={
                <>
                    <b>Базовое объединение ячеек тела</b>
                    {"\n"}Col0 строки 1–3 (rowspan), Col1 строки 5–8 (rowspan), Col2–3 строки 1–2 (прямоугольник 2×2).
                    Контент по центру (дефолт), внутренних линий сетки внутри блока нет.
                </>
            }
        />
    );
}
SC_Basic.decorators = [];

// 2. Матрица выравнивания: 3 колонки × 3 блока = 9 комбинаций spanAlign.
export function SC_AlignMatrix() {
    const cols = makeCols(3, 220);
    const H: NonNullable<SpanAlignment["horizontal"]>[] = ["left", "center", "right"];
    const V: NonNullable<SpanAlignment["vertical"]>[] = ["top", "center", "bottom"];
    const merges: Merge[] = [];
    for (let b = 0; b < 3; b++) {
        for (let c = 0; c < 3; c++) {
            const startRow = b * 3;
            merges.push({
                startRow,
                endRow: startRow + 2,
                startCol: c,
                endCol: c,
                label: `${H[c]}/${V[b]}`,
                spanAlign: { horizontal: H[c], vertical: V[b] },
            });
        }
    }
    return (
        <CellSpanShell
            cols={cols}
            merges={merges}
            rowHeight={44}
            description={
                <>
                    <b>Матрица выравнивания (9 комбинаций spanAlign)</b>
                    {"\n"}3 колонки × 3 блока по 3 строки. Горизонталь left/center/right × вертикаль top/center/bottom.
                </>
            }
        />
    );
}
SC_AlignMatrix.decorators = [];

// 3. Scroll-safe: высокие блоки, origin-строка уезжает выше вьюпорта при прокрутке.
export function SC_ScrollSafe() {
    const cols = makeCols(4);
    const merges: Merge[] = [
        { startRow: 2, endRow: 10, startCol: 0, endCol: 0, label: "tall 2–10 (top)", spanAlign: { vertical: "top" } },
        {
            startRow: 4,
            endRow: 12,
            startCol: 2,
            endCol: 2,
            label: "tall 4–12 (center)",
            spanAlign: { vertical: "center" },
        },
    ];
    return (
        <CellSpanShell
            cols={cols}
            merges={merges}
            description={
                <>
                    <b>Scroll-safe (origin уезжает выше)</b>
                    {"\n"}Высокие блоки: Col0 строки 2–10, Col2 строки 4–12. Прокрути вниз так, чтобы верхняя (origin)
                    строка блока ушла выше видимой области — блок и текст должны остаться корректными.
                </>
            }
        />
    );
}
SC_ScrollSafe.decorators = [];

// 4. Прямоугольник + чистый colspan рядом.
export function SC_RectAndColspan() {
    const cols = makeCols(5);
    const merges: Merge[] = [
        {
            startRow: 1,
            endRow: 1,
            startCol: 0,
            endCol: 2,
            label: "colspan 0–2",
            spanAlign: { horizontal: "center" },
        },
        {
            startRow: 3,
            endRow: 5,
            startCol: 1,
            endCol: 3,
            label: "блок 3×3",
            spanAlign: { horizontal: "center", vertical: "center" },
        },
    ];
    return (
        <CellSpanShell
            cols={cols}
            merges={merges}
            description={
                <>
                    <b>Colspan + прямоугольный блок</b>
                    {"\n"}Row1 Col0–2 — чистый горизонтальный colspan (центр); Col1–3 строки 3–5 — прямоугольник 3×3
                    (центр по обеим осям).
                </>
            }
        />
    );
}
SC_RectAndColspan.decorators = [];
