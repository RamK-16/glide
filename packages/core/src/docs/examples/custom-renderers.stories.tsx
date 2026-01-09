import React from "react";
import { DataEditorAll as DataEditor } from "../../data-editor-all.js";
import {
    BeautifulWrapper,
    Description,
    PropName,
    defaultProps,
    useMockDataGenerator,
} from "../../data-editor/stories/utils.js";
import { SimpleThemeWrapper } from "../../stories/story-utils.js";
import {
    markerCellRenderer,
    AllCellRenderers,
    type InternalCellRenderer,
    type InnerGridCell,
    type MarkerCell,
    InnerGridCellKind,
} from "../../index.js";
import type { DrawArgs } from "../../cells/cell-types.js";

export default {
    title: "Glide-Data-Grid/DataEditor Demos",
    decorators: [
        (Story: React.ComponentType) => (
            <SimpleThemeWrapper>
                <BeautifulWrapper
                    title="Custom renderers"
                    description={
                        <Description>
                            Override internal cell renderers by passing the {" "}
                            <PropName>renderers</PropName> prop.
                        </Description>
                    }
                >
                    <Story />
                </BeautifulWrapper>
            </SimpleThemeWrapper>
        ),
    ],
};

export const OverrideMarkerRenderer: React.VFC = () => {
    const { cols, getCellContent } = useMockDataGenerator(100, true, true);

    const renderers = React.useMemo<readonly InternalCellRenderer<InnerGridCell>[]>(() => {
        return [
            ...AllCellRenderers,
            {
                ...markerCellRenderer,
                draw: (args, cell) => {
                    const { ctx, rect } = args;
                    ctx.fillStyle = "#ffe0e0";
                    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
                    if (cell.kind === InnerGridCellKind.Marker) {
                        markerCellRenderer.draw(args as DrawArgs<MarkerCell>, cell as MarkerCell);
                    }
                },
            } as InternalCellRenderer<InnerGridCell>,
        ];
    }, []);

    return (
        <DataEditor
            {...defaultProps}
            getCellContent={getCellContent}
            columns={cols}
            rows={200}
            rowMarkers="both"
            renderers={renderers}
        />
    );
};