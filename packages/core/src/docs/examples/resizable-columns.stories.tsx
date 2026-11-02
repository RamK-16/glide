import React from "react";
import { DataEditorAll as DataEditor } from "../../data-editor-all.js";
import {
    BeautifulWrapper,
    Description,
    MoreInfo,
    PropName,
    useMockDataGenerator,
    defaultProps,
} from "../../data-editor/stories/utils.js";
import { SimpleThemeWrapper } from "../../stories/story-utils.js";
import type { DataEditorProps } from "../../data-editor/data-editor.js";

export default {
    title: "Glide-Data-Grid/DataEditor Demos",

    decorators: [
        (Story: React.ComponentType) => (
            <SimpleThemeWrapper>
                <BeautifulWrapper
                    title="Resizable columns"
                    description={
                        <>
                            <Description>
                                You can resize columns by dragging their edges, as long as you respond to the{" "}
                                <PropName>onColumnResize</PropName> prop.
                            </Description>
                            <MoreInfo>
                                By setting the <PropName>overscrollX</PropName> property extra space can be allocated at
                                the end of the grid to allow for easier resizing of the final column. You can highlight
                                multiple columns to resize them all at once.
                            </MoreInfo>
                        </>
                    }
                >
                    <Story />
                </BeautifulWrapper>
            </SimpleThemeWrapper>
        ),
    ],
};

export const ResizableColumns: React.VFC = () => {
    const { cols, getCellContent, onColumnResize } = useMockDataGenerator(60);

    return (
        <DataEditor
            {...defaultProps}
            getCellContent={getCellContent}
            columns={cols}
            rowMarkers="both"
            overscrollX={200}
            overscrollY={200}
            maxColumnAutoWidth={500}
            maxColumnWidth={2000}
            rows={50}
            scaleToRem={true}
            theme={React.useMemo(
                () => ({
                    baseFontStyle: "0.8125rem",
                    headerFontStyle: "600 0.8125rem",
                    editorFontSize: "0.8125rem",
                }),
                []
            )}
            onColumnResize={onColumnResize}
        />
    );
};

export const ResizeIndicatorOnHover = () => {
    const { cols, getCellContent, onColumnResize } = useMockDataGenerator(6);
    const [enabled, setEnabled] = React.useState(true);
    const [canResize, setCanResize] = React.useState(true);
    const [indicator, setIndicator] = React.useState<NonNullable<DataEditorProps["resizeIndicator"]>>("full");
    const columns = React.useMemo(
        () =>
            cols.map((column, index) => ({
                ...column,
                group: index === 0 ? undefined : "Details",
                resizable: index !== 1,
                minWidth: index === 2 ? 100 : undefined,
                maxWidth: index === 2 ? 320 : undefined,
            })),
        [cols]
    );
    const theme = React.useMemo(() => ({ resizeIndicatorColor: "#0B7ECB" }), []);

    return (
        <div style={{ color: "#1f2328" }}>
            <div style={{ display: "flex", gap: 16, padding: "8px 0" }}>
                <label>
                    <input type="checkbox" checked={enabled} onChange={event => setEnabled(event.target.checked)} />
                    Hover indicator
                </label>
                <label>
                    <input type="checkbox" checked={canResize} onChange={event => setCanResize(event.target.checked)} />
                    Allow resizing
                </label>
                <label>
                    Height
                    <select value={indicator} onChange={event => setIndicator(event.target.value as typeof indicator)}>
                        <option value="full">Full height</option>
                        <option value="header">Header only</option>
                        <option value="none">None</option>
                    </select>
                </label>
            </div>
            <p>2 px, #0B7ECB, col-resize cursor. The first data column is frozen, the second cannot be resized.</p>
            <DataEditor
                {...defaultProps}
                width={720}
                height={380}
                columns={columns}
                rows={50}
                getCellContent={getCellContent}
                onColumnResize={canResize ? onColumnResize : undefined}
                resizeIndicatorOnHover={enabled}
                resizeIndicator={indicator}
                theme={theme}
                rowMarkers="both"
                freezeColumns={1}
                overscrollX={100}
            />
        </div>
    );
};
