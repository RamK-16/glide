import type { GridSelection, DataEditorProps, Theme } from "@glideapps/glide-data-grid";
import React from "react";

type Props = Pick<
    DataEditorProps,
    "columns" | "onGroupHeaderClicked" | "onGridSelectionChange" | "getGroupDetails" | "gridSelection" | "freezeColumns"
> & { theme: Theme };

type Result = Pick<
    DataEditorProps,
    "columns" | "onGroupHeaderClicked" | "onGridSelectionChange" | "getGroupDetails" | "gridSelection"
>;

export function useCollapsingGroups(props: Props): Result {
    const [collapsed, setCollapsed] = React.useState<readonly string[]>([]);
    const [gridSelectionInner, setGridSelectionsInner] = React.useState<GridSelection | undefined>(undefined);

    const {
        columns: columnsIn,
        onGroupHeaderClicked: onGroupHeaderClickedIn,
        onGridSelectionChange: onGridSelectionChangeIn,
        getGroupDetails: getGroupDetailsIn,
        gridSelection: gridSelectionIn,
        freezeColumns = 0,
        theme,
    } = props;

    const gridSelection = gridSelectionIn ?? gridSelectionInner;

    const spans = React.useMemo(() => {
        const result: [number, number][] = [];
        let current: [number, number] = [-1, -1];
        let lastGroup: string | undefined;
        for (let i = freezeColumns; i < columnsIn.length; i++) {
            const c = columnsIn[i];
            const group = Array.isArray(c.group) ? (c.group[0] ?? "") : (c.group ?? "");
            const isCollapsed = collapsed.includes(group);

            if (lastGroup !== group && current[0] !== -1) {
                result.push(current);
                current = [-1, -1];
            }

            if (isCollapsed && current[0] !== -1) {
                current[1] += 1;
            } else if (isCollapsed) {
                current = [i, 1];
            } else if (current[0] !== -1) {
                result.push(current);
                current = [-1, -1];
            }
            lastGroup = group;
        }
        if (current[0] !== -1) result.push(current);
        return result;
    }, [collapsed, columnsIn, freezeColumns]);

    const columns = React.useMemo(() => {
        if (spans.length === 0) return columnsIn;
        return columnsIn.map((c, index) => {
            for (const [start, length] of spans) {
                if (index >= start && index < start + length) {
                    let width = 8;
                    if (index === start + length - 1) {
                        width = 36;
                    }

                    return {
                        ...c,
                        width,
                        themeOverride: { bgCell: theme.bgCellMedium },
                    };
                }
            }
            return c;
        });
    }, [columnsIn, spans, theme.bgCellMedium]);

    const onGroupHeaderClicked = React.useCallback<NonNullable<Props["onGroupHeaderClicked"]>>(
        (index, a) => {
            onGroupHeaderClickedIn?.(index, a);

            const groupRaw = columns[index]?.group;
            const group = Array.isArray(groupRaw) ? (groupRaw[0] ?? "") : (groupRaw ?? "");
            if (group === "") return;
            a.preventDefault();
            setCollapsed(cv => (cv.includes(group) ? cv.filter(x => x !== group) : [...cv, group]));
        },
        [columns, onGroupHeaderClickedIn]
    );

    const onGridSelectionChange = React.useCallback<NonNullable<Props["onGridSelectionChange"]>>(
        s => {
            if (s.current !== undefined) {
                const col = s.current.cell[0];
                const column = columns[col];
                const groupRaw = column?.group;
                const group = Array.isArray(groupRaw) ? (groupRaw[0] ?? "") : (groupRaw ?? "");
                setCollapsed(cv => {
                    if (cv.includes(group)) {
                        return cv.filter(g => g !== group);
                    }
                    return cv;
                });
            }
            if (onGridSelectionChangeIn !== undefined) {
                onGridSelectionChangeIn(s);
            } else {
                setGridSelectionsInner(s);
            }
        },
        [columns, onGridSelectionChangeIn]
    );

    const getGroupDetails = React.useCallback<NonNullable<Props["getGroupDetails"]>>(
        group => {
            const result = getGroupDetailsIn?.(group);
            const groupStr = Array.isArray(group) ? (group[0] ?? "") : (group ?? "");

            return {
                ...result,
                name: groupStr,
                overrideTheme: collapsed.includes(groupStr)
                    ? {
                          bgHeader: theme.bgHeaderHasFocus,
                      }
                    : undefined,
            };
        },
        [collapsed, getGroupDetailsIn, theme.bgHeaderHasFocus]
    );

    return {
        columns,
        onGroupHeaderClicked,
        onGridSelectionChange,
        getGroupDetails,
        gridSelection,
    };
}
