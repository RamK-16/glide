import React from "react";
import { DataEditorAll as DataEditor } from "../../data-editor-all.js";
import {
    BeautifulWrapper,
    Description,
    PropName,
    useMockDataGenerator,
    defaultProps,
} from "../../data-editor/stories/utils.js";
import { GridColumnIcon } from "../../internal/data-grid/data-grid-types.js";
import { SimpleThemeWrapper } from "../../stories/story-utils.js";

export default {
    title: "Glide-Data-Grid/DataEditor Demos",

    decorators: [
        (Story: React.ComponentType) => (
            <SimpleThemeWrapper>
                <BeautifulWrapper
                    title="Multi-Level Column Grouping"
                    description={
                        <Description>
                            Columns in the data grid can now have multi-level groups by setting their{" "}
                            <PropName>group</PropName> property to an array of strings. Each level represents a
                            different hierarchy level.
                        </Description>
                    }>
                    <Story />
                </BeautifulWrapper>
            </SimpleThemeWrapper>
        ),
    ],
};

export const MultiLevelColumnGroups: React.VFC = () => {
    // Generate 30 columns for complex grouping
    const { cols, getCellContent } = useMockDataGenerator(30, true, true);

    // Create complex multi-level groups with more than 10 different groups
    // Structure: Year -> Quarter -> Month -> Department
    const multiLevelCols = cols.map((col, index) => {
        // 2024 Q1 groups
        if (index < 3) {
            return { ...col, group: ["2024", "Q1", "Jan", "Sales"] };
        } else if (index < 6) {
            return { ...col, group: ["2024", "Q1", "Jan", "Marketing"] };
        } else if (index < 9) {
            return { ...col, group: ["2024", "Q1", "Feb", "Sales"] };
        } else if (index < 12) {
            return { ...col, group: ["2024", "Q1", "Feb", "Marketing"] };
        } else if (index < 15) {
            return { ...col, group: ["2024", "Q1", "Mar", "Sales"] };
        } else if (index < 18) {
            return { ...col, group: ["2024", "Q1", "Mar", "Marketing"] };
        }
        // 2024 Q2 groups
        else if (index < 21) {
            return { ...col, group: ["2024", "Q2", "Apr", "Sales"] };
        } else if (index < 24) {
            return { ...col, group: ["2024", "Q2", "Apr", "Support"] };
        } else if (index < 27) {
            return { ...col, group: ["2024", "Q2", "May", "Sales"] };
        } else {
            return { ...col, group: ["2024", "Q2", "May", "Support"] };
        }
    });

    return (
        <DataEditor
            {...defaultProps}
            getCellContent={getCellContent}
            onGroupHeaderRenamed={(x, y) => window.alert(`Please rename group ${x} to ${y}`)}
            columns={multiLevelCols}
            rows={500}
            getGroupDetails={g => ({
                name: g,
                icon: g === "" ? undefined : GridColumnIcon.HeaderCode,
            })}
            groupHeaderHeight={[32, 28, 26, 24]} // Four different heights for four levels
            rowMarkers="both"
        />
    );
};

export const ThreeLevelColumnGroups: React.VFC = () => {
    const { cols, getCellContent } = useMockDataGenerator(24, true, true);

    // Create three-level groups
    const threeLevelCols = cols.map((col, index) => {
        if (index < 6) {
            // Level 1 = "2024", Level 2 = "Q1", Level 3 = "Jan"
            return { ...col, group: ["2024", "Q1", "Jan"] };
        } else if (index < 12) {
            // Level 1 = "2024", Level 2 = "Q1", Level 3 = "Feb"
            return { ...col, group: ["2024", "Q1", "Feb"] };
        } else if (index < 18) {
            // Level 1 = "2024", Level 2 = "Q2", Level 3 = "Apr"
            return { ...col, group: ["2024", "Q2", "Apr"] };
        } else {
            // Level 1 = "2024", Level 2 = "Q2", Level 3 = "May"
            return { ...col, group: ["2024", "Q2", "May"] };
        }
    });

    return (
        <DataEditor
            {...defaultProps}
            getCellContent={getCellContent}
            columns={threeLevelCols}
            rows={1000}
            getGroupDetails={g => ({
                name: g,
                icon: g === "" ? undefined : GridColumnIcon.HeaderCode,
            })}
            groupHeaderHeight={[28, 26, 24]} // Three different heights
            rowMarkers="both"
        />
    );
};
