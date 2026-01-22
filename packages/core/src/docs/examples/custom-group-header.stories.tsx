import React, { useId } from "react";
import { DataEditorAll as DataEditor } from "../../data-editor-all.js";
import {
    BeautifulWrapper,
    Description,
    PropName,
    useMockDataGenerator,
    defaultProps,
} from "../../data-editor/stories/utils.js";
import type { DrawGroupHeaderCallback } from "../../internal/data-grid/data-grid-types.js";
import { GridColumnIcon } from "../../internal/data-grid/data-grid-types.js";
import { SimpleThemeWrapper } from "../../stories/story-utils.js";

const COMPOSITE_DESTINATION_OVER = "destination-over";
const COMPOSITE_SOURCE_OVER = "source-over";

export default {
    title: "Glide-Data-Grid/DataEditor Demos",

    decorators: [
        (Story: React.ComponentType) => (
            <SimpleThemeWrapper>
                <BeautifulWrapper
                    title="Custom Group Header Drawing"
                    description={
                        <Description>
                            This example demonstrates custom rendering of group headers using the{" "}
                            <PropName>drawGroupHeader</PropName> prop. The callback receives information about the group
                            name, level, span, and other properties, allowing for complete customization of the group
                            header appearance.
                        </Description>
                    }>
                    <Story />
                </BeautifulWrapper>
            </SimpleThemeWrapper>
        ),
    ],
};

export const CustomGroupHeaderDrawing: React.VFC = () => {
    const { cols, getCellContent } = useMockDataGenerator(30, true, true);

    // Create multi-level groups: Year -> Quarter -> Month -> Department
    const multiLevelCols = cols.map((col, index) => {
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
        } else if (index < 21) {
            return { ...col, group: ["2024", "Q2", "Apr", "Sales"] };
        } else if (index < 24) {
            return { ...col, group: ["2024", "Q2", "Apr", "Support"] };
        } else if (index < 27) {
            return { ...col, group: ["2024", "Q2", "May", "Sales"] };
        } else {
            return { ...col, group: ["2024", "Q2", "May", "Support"] };
        }
    });

    const drawGroupHeader: DrawGroupHeaderCallback = React.useCallback(args => {
        const { ctx, groupName, level, span, rect, theme, isSelected, isHovered } = args;
        // console.log(groupName, level, isHovered);

        // First draw default to get icons and actions, but we'll draw over the background
        // Save the context state before default drawing
        ctx.save();

        // Call default drawing first to render icons and actions
        // draw();

        // Now draw our custom background OVER the default (but icons/actions will show through)
        ctx.beginPath();
        ctx.rect(rect.x, rect.y, rect.width, rect.height);

        // Different colors for different levels
        const levelColors = [
            { start: "#e3f2fd", end: "#bbdefb" }, // Level 0 (Year) - Light blue
            { start: "#f3e5f5", end: "#e1bee7" }, // Level 1 (Quarter) - Light purple
            { start: "#fff3e0", end: "#ffe0b2" }, // Level 2 (Month) - Light orange
            { start: "#e8f5e9", end: "#c8e6c9" }, // Level 3 (Department) - Light green
        ];

        const colors = levelColors[level] ?? levelColors[0];
        const gradient = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.height);
        const selectedColor = theme.accentColor;
        gradient.addColorStop(0, isSelected ? selectedColor : isHovered ? colors.end : colors.start);
        gradient.addColorStop(1, isSelected ? selectedColor : colors.end);

        // Use composite operation to draw background behind existing content
        ctx.globalCompositeOperation = COMPOSITE_DESTINATION_OVER;
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.globalCompositeOperation = COMPOSITE_SOURCE_OVER;

        // Draw border
        ctx.strokeStyle = isSelected ? theme.accentColor : theme.borderColor;
        const borderWidth = isSelected ? 2 : 1;
        ctx.lineWidth = borderWidth;
        ctx.stroke();

        // Draw custom text with shadow effect
        if (groupName !== "") {
            ctx.fillStyle = isSelected ? theme.textHeaderSelected : theme.textHeader;
            ctx.font = `bold ${14 + level * 2}px ${theme.fontFamily}`;
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";

            // Text shadow for depth
            ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
            ctx.shadowBlur = 2;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;

            const padding = 12 + level * 4;
         
            ctx.fillText(groupName, rect.x + padding, rect.y + rect.height / 2);

            // Reset shadow
            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            // Draw span indicator (number of columns in group)
            const spanText = `(${span[1] - span[0] + 1} cols)`;
            ctx.font = `${10}px ${theme.fontFamily}`;
            ctx.fillStyle = isSelected ? theme.textHeaderSelected : (theme.textGroupHeader ?? theme.textHeader);
            ctx.globalAlpha = 0.7;
            const textWidth = ctx.measureText(groupName).width;
            ctx.fillText(spanText, rect.x + padding + textWidth + 8, rect.y + rect.height / 2);
            ctx.globalAlpha = 1;
        }

        // Draw level indicator badge in top-right corner
        ctx.fillStyle = isSelected ? theme.accentColor : theme.bgHeader;
        ctx.beginPath();
        const badgeSize = 20;
        const badgePadding = 4;
        const badgeX = rect.x + rect.width - badgeSize - badgePadding;
        const badgeY = rect.y + badgePadding;
        ctx.arc(badgeX + badgeSize / 2, badgeY + badgeSize / 2, badgeSize / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = theme.textHeader;
        ctx.font = `bold ${10}px ${theme.fontFamily}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`L${level}`, badgeX + badgeSize / 2, badgeY + badgeSize / 2);

        ctx.restore();
    }, []);

    return (
        <DataEditor
            {...defaultProps}
            getCellContent={getCellContent}
            columns={multiLevelCols}
            rows={500}
            getGroupDetails={g => ({
                name: g,
                icon: g === "" ? undefined : GridColumnIcon.HeaderCode,
            })}
            groupHeaderHeight={[36, 32, 30, 28]} // Four different heights for four levels
            // drawGroupHeader={drawGroupHeader}
            rowMarkers="both"
            
            onGroupHeaderClicked={(args) => {
                console.log('onGroupHeaderClicked',args);
            }}
            onMouseMove={(args) => {
                if(args.kind === "group-header") {

                    // console.log('onMouseMove',args);
                }
            }}
            onCellClicked={(args) => {
                

                    // console.log('onCellClicked',args);
                
            }}
        />
    );
};

export const MinimalGroupHeader: React.VFC = () => {
    const { cols, getCellContent } = useMockDataGenerator(24, true, true);

    // Create three-level groups
    const threeLevelCols = cols.map((col, index) => {
        if (index < 6) {
            return { ...col, group: ["2024", "Q1", "Jan"] };
        } else if (index < 12) {
            return { ...col, group: ["2024", "Q1", "Feb"] };
        } else if (index < 18) {
            return { ...col, group: ["2024", "Q2", "Apr"] };
        } else {
            return { ...col, group: ["2024", "Q2", "May"] };
        }
    });

    const drawGroupHeader: DrawGroupHeaderCallback = React.useCallback(args => {
        const { ctx, rect, theme, isSelected, isHovered, groupName } = args;
    
        // Call default drawing first
        ctx.save();
        // draw();

        // Then draw our minimal customizations on top
        ctx.beginPath();
        ctx.rect(rect.x, rect.y, rect.width, rect.height);

        // Very subtle background overlay
        const bgColor = isSelected ? theme.accentColor : isHovered ? theme.bgHeaderHovered : theme.bgHeader;

        ctx.globalCompositeOperation = COMPOSITE_DESTINATION_OVER;
        ctx.fillStyle = bgColor;
        ctx.fill();
        ctx.globalCompositeOperation = COMPOSITE_SOURCE_OVER;

        // Simple border
        if (isSelected || isHovered) {
            ctx.strokeStyle = isSelected ? theme.accentColor : theme.borderColor;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        ctx.restore();
    }, []);

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
            drawGroupHeader={drawGroupHeader}
            rowMarkers="both"
        />
    );
};

export const UnstickyHeader: React.VFC = () => {
    const { cols, getCellContent } = useMockDataGenerator(20, true, true);

    // Create groups with different types
    const styledCols = cols.map((col, index) => {
        if (index < 5) {
            return { ...col, group: ["Revenue", "Q1"] };
        } else if (index < 10) {
            return { ...col, group: ["Expenses", "Q1"] };
        } else if (index < 15) {
            return { ...col, group: ["Revenue", "Q2"] };
        } else {
            return { ...col, group: ["Expenses", "Q2"] };
        }
    });

    const drawGroupHeader: DrawGroupHeaderCallback = React.useCallback(args => {
        const { ctx, groupName, level, rect, theme, isSelected, isHovered } = args;

        // Call default drawing first
        ctx.save();
        // draw();

        // Then apply custom styling
        ctx.beginPath();
        ctx.rect(rect.x, rect.y, rect.width, rect.height);

        // Different styling based on group name
        let bgColor: string;
        let textColor: string;

        if (groupName === "Revenue") {
            bgColor = isSelected ? "#4caf50" : isHovered ? "#81c784" : "#c8e6c9";
            textColor = isSelected ? "#ffffff" : "#2e7d32";
        } else if (groupName === "Expenses") {
            bgColor = isSelected ? "#f44336" : isHovered ? "#e57373" : "#ffcdd2";
            textColor = isSelected ? "#ffffff" : "#c62828";
        } else {
            // Quarter level
            bgColor = isSelected ? theme.accentColor : isHovered ? theme.bgHeaderHovered : theme.bgHeader;
            textColor = isSelected ? theme.textHeaderSelected : theme.textHeader;
        }

        // Draw background behind existing content
        ctx.globalCompositeOperation = COMPOSITE_DESTINATION_OVER;
        ctx.fillStyle = bgColor;
        ctx.fill();
        ctx.globalCompositeOperation = COMPOSITE_SOURCE_OVER;

        // Rounded corners for top level (draw as overlay)
        if (level === 0) {
            ctx.beginPath();
            const radius = 4;
            ctx.moveTo(rect.x + radius, rect.y);
            ctx.lineTo(rect.x + rect.width - radius, rect.y);
            ctx.quadraticCurveTo(rect.x + rect.width, rect.y, rect.x + rect.width, rect.y + radius);
            ctx.lineTo(rect.x + rect.width, rect.y + rect.height);
            ctx.lineTo(rect.x, rect.y + rect.height);
            ctx.lineTo(rect.x, rect.y + radius);
            ctx.quadraticCurveTo(rect.x, rect.y, rect.x + radius, rect.y);
            ctx.closePath();
            ctx.globalCompositeOperation = COMPOSITE_DESTINATION_OVER;
            ctx.fill();
            ctx.globalCompositeOperation = COMPOSITE_SOURCE_OVER;
        }

        // Custom text color (draw text on top)
        if (groupName !== "") {
            ctx.fillStyle = textColor;
            ctx.font = `bold ${13 + level}px ${theme.fontFamily}`;
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText(groupName, rect.x + 10, rect.y + rect.height / 2);
        }

        ctx.restore();
    }, []);
    const dataEditorClassName = "data-editor-" + useId();
    const dataEditorSelector = `.${dataEditorClassName}`;
    const headerHeight = [32, 28, 40];
    const headerHeightNum = headerHeight.reduce((acc, curr) => acc + curr, 0);

    return (
        <DataEditor
            className={dataEditorClassName}
            height={1000}
            ref={() => {
                /** пример реализации незакрепленного шапки */
                const dataEditorElement = document.querySelector(dataEditorSelector) as HTMLElement | undefined;
                if (!dataEditorElement) return;

                const scroller = dataEditorElement?.children?.[0]?.children?.[0]?.children?.[1] as
                    | HTMLElement
                    | undefined;

                if (!scroller) return;

                const scrollCb = () => {
                    const y = scroller.scrollTop;

                    const tableFirstInner = dataEditorElement?.children[0] as HTMLElement | undefined;
                    const canvasTableWrapper = dataEditorElement?.children[0].children[0].children[0] as
                        | HTMLCanvasElement
                        | undefined;

                    if (!tableFirstInner || !canvasTableWrapper) return;
                    const fixedY = y < headerHeightNum ? y : headerHeightNum;
                    /** его высота удобна тем, что =100%; его высота влияет на высоту canvas элемента таблицы */
                    tableFirstInner.style = `height: calc(100% + ${headerHeightNum}px`;
                    canvasTableWrapper.style.transform = `translateY(-${fixedY}px)`;
                };
                scroller.addEventListener("scroll", scrollCb);

                return () => scroller?.removeEventListener?.("scroll", scrollCb);
            }}
            {...defaultProps}
            getCellContent={getCellContent}
            columns={styledCols}
            rows={500}
            getGroupDetails={g => ({
                name: g,
                icon: g === "" ? undefined : GridColumnIcon.HeaderCode,
            })}
            headerHeight={headerHeight[headerHeight.length - 1]}
            groupHeaderHeight={headerHeight.slice(0, -1)}
            drawGroupHeader={drawGroupHeader}
            rowMarkers="both"
        />
    );
};

// Версия с последовательным скроллом (чтобы первые строки не заезжали под шапку - на будущее, версия сырая)
// () => {
//     /** пример реализации незакрепленного шапки */
//     const dataEditorElement = document.querySelector(dataEditorSelector) as HTMLElement | undefined;
//     if (!dataEditorElement) return;

//     const scroller = dataEditorElement?.children?.[0]?.children?.[0]?.children?.[1] as
//         | HTMLElement
//         | undefined;

//     if (!scroller) return;

//     let y = 0;
//     let accumulatedScroll = 0;

//     const tableFirstInner = dataEditorElement?.children[0] as HTMLElement | undefined;
//     const canvasTableWrapper = dataEditorElement?.children[0].children[0].children[0] as
//         | HTMLCanvasElement
//         | undefined;

//     const scrollCb = () => {
//         y = scroller.scrollTop;

//         if (!tableFirstInner || !canvasTableWrapper) return;
//         const fixedY = y < headerHeightNum ? y : headerHeightNum;
//         const accessedToScroll = accumulatedScroll > headerHeightNum;

//         if (!accessedToScroll) {
//             scroller.scrollTop = 0;
//         }
//     };
//     scroller.addEventListener("scroll", scrollCb);

//     const wheelCb = (e: WheelEvent) => {
//         const d = 3;
//         if (e.wheelDeltaY > 0) {
//             accumulatedScroll = accumulatedScroll - d < 0 ? 0 : accumulatedScroll - d;
//         } else {
//             accumulatedScroll += d;
//         }

//         const fixedAccessedScroll =
//             accumulatedScroll < headerHeightNum ? accumulatedScroll : headerHeightNum;
//         /** его высота удобна тем, что =100%; его высота влияет на высоту canvas элемента таблицы */
//         tableFirstInner.style = `height: calc(100% + ${headerHeightNum}px`;
//         canvasTableWrapper.style.transform = `translateY(-${fixedAccessedScroll}px)`;
//         console.log("WheelEvent", accumulatedScroll);
//     };
//     scroller.addEventListener("wheel", wheelCb);

//     return () => {
//         scroller?.removeEventListener?.("scroll", scrollCb);
//         scroller?.removeEventListener?.("wheel", wheelCb);
//     };
// }
