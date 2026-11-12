import React from "react";
import { DataEditorAll as DataEditor } from "../../data-editor-all.js";
import { BeautifulWrapper, Description, PropName, defaultProps } from "../../data-editor/stories/utils.js";
import { SimpleThemeWrapper } from "../../stories/story-utils.js";
import {
    GridCellKind,
    type GridCell,
    type GridColumn,
    type Item,
    type Rectangle,
} from "../../internal/data-grid/data-grid-types.js";

export default {
    title: "Glide-Data-Grid/DataEditor Demos",

    decorators: [
        (Story: React.ComponentType) => (
            <SimpleThemeWrapper>
                <BeautifulWrapper
                    title="Huge Uneven Rows"
                    description={
                        <Description>
                            Millions of rows with <PropName>rowHeight</PropName> as a callback. In the{" "}
                            <PropName>auto</PropName> mode visible rows get new heights on every scroll and the callback
                            changes, like auto row height by content does.
                        </Description>
                    }
                >
                    <Story />
                </BeautifulWrapper>
            </SimpleThemeWrapper>
        ),
    ],
};

type HeightMode = "fixed" | "callback" | "auto";

const ROW_COUNTS = [10_000, 100_000, 1_000_000, 5_000_000];
const COL_COUNTS = [6, 100, 1000];
const BASE_HEIGHT = 34;

const heightByRow = (row: number) => BASE_HEIGHT + ((row * 7919) % 5) * 12;

const panelStyle: React.CSSProperties = {
    display: "flex",
    gap: 16,
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 12,
    fontSize: 14,
    color: "#222",
};

function useFrameStats() {
    const [stats, setStats] = React.useState({ fps: 0, slowest: 0, calls: 0 });
    const calls = React.useRef(0);

    React.useEffect(() => {
        let frames = 0;
        let slowest = 0;
        let prev = performance.now();
        let started = prev;
        let handle = 0;
        const tick = (now: number) => {
            frames += 1;
            slowest = Math.max(slowest, now - prev);
            prev = now;
            if (now - started >= 1000) {
                setStats({ fps: Math.round((frames * 1000) / (now - started)), slowest, calls: calls.current });
                frames = 0;
                slowest = 0;
                calls.current = 0;
                started = now;
            }
            handle = requestAnimationFrame(tick);
        };
        handle = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(handle);
    }, []);

    return { stats, calls };
}

export const HugeUnevenRows: React.FC = () => {
    const [rows, setRows] = React.useState(1_000_000);
    const [colCount, setColCount] = React.useState(100);
    const [mode, setMode] = React.useState<HeightMode>("auto");
    const [smoothScrollY, setSmoothScrollY] = React.useState(true);
    const { stats, calls } = useFrameStats();

    const columns = React.useMemo<GridColumn[]>(
        () => Array.from({ length: colCount }, (_, i) => ({ id: `c${i}`, title: `Column ${i}`, width: 120 })),
        [colCount]
    );

    const heights = React.useMemo(() => new Uint16Array(rows), [rows]);
    const [version, setVersion] = React.useState(0);

    const onVisibleRegionChanged = React.useCallback(
        (range: Rectangle) => {
            if (mode !== "auto") return;
            let changed = false;
            const last = Math.min(range.y + range.height, rows - 1);
            for (let r = range.y; r <= last; r++) {
                if (heights[r] === 0) {
                    heights[r] = heightByRow(r);
                    changed = true;
                }
            }
            if (changed) setVersion(v => v + 1);
        },
        [mode, rows, heights]
    );

    const rowHeight = React.useMemo(() => {
        if (mode === "fixed") return BASE_HEIGHT;
        if (mode === "callback") {
            return (row: number) => {
                calls.current += 1;
                return heightByRow(row);
            };
        }
        return (row: number) => {
            calls.current += 1;
            return heights[row] || BASE_HEIGHT;
        };
        // version: появились новые высоты, glide должен спросить их заново
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, heights, calls, version]);

    const getCellContent = React.useCallback(([col, row]: Item): GridCell => {
        const text = col === 0 ? `Row ${row}` : `${row}:${col}`;
        return { kind: GridCellKind.Text, data: text, displayData: text, allowOverlay: false };
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={panelStyle}>
                <label>
                    Rows{" "}
                    <select value={rows} onChange={e => setRows(Number(e.target.value))}>
                        {ROW_COUNTS.map(n => (
                            <option key={n} value={n}>
                                {n.toLocaleString()}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Columns{" "}
                    <select value={colCount} onChange={e => setColCount(Number(e.target.value))}>
                        {COL_COUNTS.map(n => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Row height{" "}
                    <select value={mode} onChange={e => setMode(e.target.value as HeightMode)}>
                        <option value="fixed">number</option>
                        <option value="callback">callback, stable</option>
                        <option value="auto">callback, changes on scroll</option>
                    </select>
                </label>
                <label>
                    <input type="checkbox" checked={smoothScrollY} onChange={e => setSmoothScrollY(e.target.checked)} />{" "}
                    smoothScrollY
                </label>
                <span>
                    {stats.fps} fps · slowest frame {stats.slowest.toFixed(0)} ms · rowHeight calls/s{" "}
                    {stats.calls.toLocaleString()}
                </span>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
                <DataEditor
                    {...defaultProps}
                    smoothScrollY={smoothScrollY}
                    getCellContent={getCellContent}
                    columns={columns}
                    rows={rows}
                    rowHeight={rowHeight}
                    rowMarkers="number"
                    height="100%"
                    onVisibleRegionChanged={onVisibleRegionChanged}
                />
            </div>
        </div>
    );
};
