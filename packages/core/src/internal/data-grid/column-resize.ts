import clamp from "lodash/clamp.js";
import type { InnerGridColumn } from "./data-grid-types.js";

function minWidth(column: InnerGridColumn, fallback: number) {
    return Math.ceil(column.minWidth ?? fallback);
}

function maxWidth(column: InnerGridColumn, fallback: number) {
    return Math.floor(column.maxWidth ?? fallback);
}

export function isResizableColumn(column: InnerGridColumn | undefined, min = 0, max = Number.POSITIVE_INFINITY): boolean {
    return column !== undefined && column.resizable !== false && minWidth(column, min) < maxWidth(column, max);
}

// Drag измеряет видимую ширину, а callback принимает базовую, без growOffset.
// maxAutoWidth влияет только на автоподбор, при ручном ресайзе действует maxWidth.
export function offsetColumnSize(column: InnerGridColumn, width: number, min: number, max: number): number {
    return clamp(Math.round(width - (column.growOffset ?? 0)), minWidth(column, min), maxWidth(column, max));
}
