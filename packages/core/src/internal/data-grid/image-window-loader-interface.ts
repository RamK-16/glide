import type { CellSet } from "./cell-set.js";
import type { Rectangle } from "./data-grid-types.js";

/** @category Types */
export interface ImageWindowLoader {
    /**
     * @param freezeRows строки вне окна, которые видны всегда (закреплённые снизу и прилипшие сверху)
     * @param stickyColumns прилипшие колонки вне префикса freezeCols
     */
    setWindow(newWindow: Rectangle, freezeCols: number, freezeRows: number[], stickyColumns?: readonly number[]): void;
    loadOrGetImage(url: string, col: number, row: number): HTMLImageElement | ImageBitmap | undefined;
    setCallback(imageLoaded: (locations: CellSet) => void): void;
}
