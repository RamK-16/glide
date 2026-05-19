import React from "react";
import { DataEditorAll as DataEditor } from "../../data-editor-all.js";
import { BeautifulWrapper, Description, MoreInfo, PropName, defaultProps } from "../../data-editor/stories/utils.js";
import { SimpleThemeWrapper } from "../../stories/story-utils.js";
import type { GridColumn, Item, GridCell } from "../../internal/data-grid/data-grid-types.js";
import { GridCellKind } from "../../internal/data-grid/data-grid-types.js";

export default {
    title: "Glide-Data-Grid/DataEditor Demos",

    decorators: [
        (Story: React.ComponentType) => (
            <SimpleThemeWrapper>
                <BeautifulWrapper
                    title="Per-column minWidth / maxWidth (ограничения ширины на колонку)"
                    description={
                        <>
                            <Description>
                                Каждая колонка может задать собственные ограничения <PropName>minWidth</PropName> и{" "}
                                <PropName>maxWidth</PropName>. Они перекрывают глобальные{" "}
                                <PropName>minColumnWidth</PropName> / <PropName>maxColumnWidth</PropName>.
                            </Description>
                            <MoreInfo>
                                Попробуйте изменить ширину колонок ниже. «Фиксированная 200px» заблокирована на 200px.
                                «Мин 150px» не сужается меньше 150. «Макс 250px» не расширяется больше 250.
                                «Мин 100 / Макс 300» ограничена диапазоном. «Без ограничений» использует глобальные значения.
                            </MoreInfo>
                        </>
                    }>
                    <Story />
                </BeautifulWrapper>
            </SimpleThemeWrapper>
        ),
    ],
};

const initialColumns: GridColumn[] = [
    {
        title: "Clamp: width 50 → min 200",
        width: 50,
        minWidth: 200,
    },
    {
        title: "Clamp: width 500 → max 250",
        width: 500,
        maxWidth: 250,
    },
    {
        title: "Мин 150px",
        width: 180,
        minWidth: 150,
    },
    {
        title: "Мин 100 / Макс 300",
        width: 200,
        minWidth: 100,
        maxWidth: 300,
    },
    {
        title: "Без ограничений",
        width: 200,
    },
    {
        title: "Растягиваемая (мин 120)",
        grow: 1,
        minWidth: 120,
    },
];

const data: string[][] = Array.from({ length: 100 }, (_, row) =>
    initialColumns.map((col, colIdx) => `Row ${row} Col ${colIdx}`)
);

export const PerColumnMinMaxWidth: React.FC = () => {
    const [cols, setCols] = React.useState<GridColumn[]>(initialColumns);

    const onColumnResize = React.useCallback((column: GridColumn, newSize: number) => {
        setCols(prev => {
            const index = prev.findIndex(c => c.title === column.title);
            if (index === -1) return prev;
            const newCols = [...prev];
            newCols[index] = { ...prev[index], width: newSize };
            return newCols;
        });
    }, []);

    const getCellContent = React.useCallback(([col, row]: Item): GridCell => {
        return {
            kind: GridCellKind.Text,
            displayData: data[row][col],
            data: data[row][col],
            allowOverlay: false,
            readonly: true,
        };
    }, []);

    return (
        <DataEditor
            {...defaultProps}
            getCellContent={getCellContent}
            columns={cols}
            rows={100}
            maxColumnWidth={2000}
            minColumnWidth={50}
            onColumnResize={onColumnResize}
        />
    );
};
