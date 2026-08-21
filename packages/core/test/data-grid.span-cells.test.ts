import { describe, expect, it } from "vitest";
import { getRowSpanBounds } from "../src/internal/data-grid/render/data-grid-render.walk.js";
import { cellIsSelected } from "../src/internal/data-grid/render/data-grid-lib.js";
import {
    pushSpanSelectionStrips,
    type SpanPartialFill,
} from "../src/internal/data-grid/render/data-grid-render.cells.js";
import { expandSelection } from "../src/data-editor/data-editor-fns.js";
import {
    CompactSelection,
    GridCellKind,
    type GridCell,
    type GridSelection,
    type InnerGridCell,
    type Rectangle,
} from "../src/internal/data-grid/data-grid-types.js";

// ── getRowSpanBounds: вертикальная геометрия объединённого по строкам блока ──────────

const rh = () => 32; // равномерная высота строк
const vrh = (r: number) => (r % 2 === 0 ? 40 : 20); // переменная высота строк

describe("getRowSpanBounds — вертикальная геометрия rowspan", () => {
    it("origin == текущая строка: y = currentDrawY, height = сумма высот блока", () => {
        const b = getRowSpanBounds([2, 5], 2, 100, rh);
        expect(b.y).toBe(100);
        expect(b.height).toBe(4 * 32); // строки 2..5 = 4 строки
    });

    it("текущая строка ниже origin: y отсчитывается вверх к origin", () => {
        // origin=2, текущая=4 (её верх=200) → y = 200 - rh(3) - rh(2) = 136
        const b = getRowSpanBounds([2, 5], 4, 200, rh);
        expect(b.y).toBe(200 - 32 - 32);
        expect(b.height).toBe(4 * 32);
    });

    it("scroll-safe: origin выше вьюпорта → y уходит в минус, высота полная", () => {
        // origin=0, первая видимая строка=2 (её верх=0) → y = 0 - rh(1) - rh(0) = -64
        const b = getRowSpanBounds([0, 5], 2, 0, rh);
        expect(b.y).toBe(-64);
        expect(b.height).toBe(6 * 32);
    });

    it("переменная высота строк: суммируется корректно", () => {
        // строки 0..2: 40 + 20 + 40 = 100
        const b = getRowSpanBounds([0, 2], 0, 0, vrh);
        expect(b.y).toBe(0);
        expect(b.height).toBe(100);
    });

    it("одиночная строка ([r,r]): высота = высота одной строки", () => {
        const b = getRowSpanBounds([3, 3], 3, 50, rh);
        expect(b.y).toBe(50);
        expect(b.height).toBe(32);
    });
});

// ── cellIsSelected: осведомлённость о диапазоне строк (rowspan) ──────────────────────

function sel(col: number, row: number): GridSelection {
    return {
        current: {
            cell: [col, row],
            range: { x: col, y: row, width: 1, height: 1 },
            rangeStack: [],
        },
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty(),
    };
}

function textCell(extra: Record<string, unknown>): InnerGridCell {
    return {
        kind: GridCellKind.Text,
        data: "x",
        displayData: "x",
        allowOverlay: false,
        ...extra,
    } as InnerGridCell;
}

describe("cellIsSelected — rowspan (диапазон строк)", () => {
    it("rowspan: выбранная строка внутри spanRows → блок выделен", () => {
        const cell = textCell({ spanRows: [1, 3] });
        expect(cellIsSelected([1, 1], cell, sel(1, 2))).toBe(true); // selRow=2 ∈ [1,3]
        expect(cellIsSelected([1, 1], cell, sel(1, 3))).toBe(true);
        expect(cellIsSelected([1, 1], cell, sel(1, 1))).toBe(true);
    });

    it("rowspan: выбранная строка вне spanRows → не выделен", () => {
        const cell = textCell({ spanRows: [1, 3] });
        expect(cellIsSelected([1, 1], cell, sel(1, 4))).toBe(false);
        expect(cellIsSelected([1, 1], cell, sel(1, 0))).toBe(false);
    });

    it("rowspan: другая колонка → не выделен", () => {
        const cell = textCell({ spanRows: [1, 3] });
        expect(cellIsSelected([1, 1], cell, sel(2, 2))).toBe(false);
    });

    it("прямоугольник (span + spanRows): выделен только если и колонка, и строка попадают", () => {
        const cell = textCell({ span: [1, 3], spanRows: [1, 2] });
        expect(cellIsSelected([1, 1], cell, sel(2, 2))).toBe(true); // col 2 ∈ [1,3], row 2 ∈ [1,2]
        expect(cellIsSelected([1, 1], cell, sel(2, 3))).toBe(false); // row 3 ∉ [1,2]
        expect(cellIsSelected([1, 1], cell, sel(4, 2))).toBe(false); // col 4 ∉ [1,3]
    });

    it("без span/spanRows: прежнее поведение (точное совпадение строки и колонки)", () => {
        const cell = textCell({});
        expect(cellIsSelected([1, 2], cell, sel(1, 2))).toBe(true);
        expect(cellIsSelected([1, 2], cell, sel(1, 3))).toBe(false);
        expect(cellIsSelected([1, 2], cell, sel(2, 2))).toBe(false);
    });

    it("чистый colspan (span без spanRows): строка проверяется точно (без изменений)", () => {
        const cell = textCell({ span: [1, 3] });
        expect(cellIsSelected([1, 5], cell, sel(2, 5))).toBe(true); // та же строка, col в span
        expect(cellIsSelected([1, 5], cell, sel(2, 6))).toBe(false); // другая строка
    });
});

// ── expandSelection: расширение диапазона выделения по spanRows (rowspan) ─────────────

// getCellsForSelection-мок: у колонки spanCol каждая ячейка несёт spanRows, остальные обычные.
const makeGetCells = (spanCol: number, spanRows: [number, number]) =>
    ((rect: Rectangle) => {
        const out: GridCell[][] = [];
        for (let y = rect.y; y < rect.y + rect.height; y++) {
            const rowArr: GridCell[] = [];
            for (let x = rect.x; x < rect.x + rect.width; x++) {
                rowArr.push({
                    kind: GridCellKind.Text,
                    data: "",
                    displayData: "",
                    allowOverlay: false,
                    ...(x === spanCol ? { spanRows } : {}),
                } as GridCell);
            }
            out.push(rowArr);
        }
        return out;
    }) as Parameters<typeof expandSelection>[1];

function rangeSel(x: number, y: number, w: number, h: number): GridSelection {
    return {
        current: { cell: [x, y], range: { x, y, width: w, height: h }, rangeStack: [] },
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty(),
    };
}

describe("expandSelection — rowspan (расширение диапазона по строкам)", () => {
    const ac = new AbortController();

    it("диапазон на покрытой строке блока → растёт до всего spanRows", () => {
        const res = expandSelection(rangeSel(2, 3, 1, 1), makeGetCells(2, [1, 4]), 0, "default", ac);
        expect(res.current?.range).toEqual({ x: 2, y: 1, width: 1, height: 4 });
    });

    it("spanRangeBehavior = allowPartial → без расширения", () => {
        const res = expandSelection(rangeSel(2, 3, 1, 1), makeGetCells(2, [1, 4]), 0, "allowPartial", ac);
        expect(res.current?.range).toEqual({ x: 2, y: 3, width: 1, height: 1 });
    });

    it("под диапазоном нет spanRows → без изменений", () => {
        const res = expandSelection(rangeSel(0, 0, 1, 1), makeGetCells(2, [1, 4]), 0, "default", ac);
        expect(res.current?.range).toEqual({ x: 0, y: 0, width: 1, height: 1 });
    });
});

// ── pushSpanSelectionStrips: выделение строк/колонок красит полосы, а не весь блок ──
// Регресс: выделение чекбоксом одной строки блока красило весь объединённый прямоугольник,
// а при ховере соседних ячеек блок перерисовывался от невыделенной покрытой строки и заливка
// «осыпалась». Полоса считается от полного диапазона блока (не от строки-триггера).

const cols3 = [{ width: 100 }, { width: 100 }, { width: 100 }] as unknown as Parameters<
    typeof pushSpanSelectionStrips
>[8];
const evenRh = () => 20;

describe("pushSpanSelectionStrips — полосы выделения внутри слитого блока", () => {
    it("одна выделенная строка блока → одна полоса во всю ширину, высотой одной строки сверху", () => {
        const out: SpanPartialFill[] = [];
        // блок: колонки [0,0], строки [0,9]; выделена строка 0 (origin)
        pushSpanSelectionStrips(
            CompactSelection.fromSingleSelection(0),
            CompactSelection.empty(),
            [0, 0],
            [0, 9],
            0, // cellX
            0, // cellY
            100, // cellWidth
            200, // cellHeight = 10*20
            cols3,
            evenRh,
            "#aaccff",
            out
        );
        expect(out).toHaveLength(1);
        expect(out[0]).toMatchObject({ x: 0, y: 0, w: 100, h: 20, color: "#aaccff" });
    });

    it("выделение НЕ origin-строки (напр. строки 5) даёт полосу именно на ней — не зависит от строки-триггера", () => {
        const out: SpanPartialFill[] = [];
        pushSpanSelectionStrips(
            CompactSelection.fromSingleSelection(5),
            CompactSelection.empty(),
            [0, 0],
            [0, 9],
            0,
            0,
            100,
            200,
            cols3,
            evenRh,
            "#aaccff",
            out
        );
        expect(out).toHaveLength(1);
        // строка 5 → смещение 5*20 = 100
        expect(out[0]).toMatchObject({ x: 0, y: 100, w: 100, h: 20 });
    });

    it("смежные выделенные строки объединяются в одну полосу", () => {
        const out: SpanPartialFill[] = [];
        pushSpanSelectionStrips(
            CompactSelection.empty().add(2).add(3).add(4),
            CompactSelection.empty(),
            [0, 0],
            [0, 9],
            0,
            0,
            100,
            200,
            cols3,
            evenRh,
            "#aaccff",
            out
        );
        expect(out).toHaveLength(1);
        expect(out[0]).toMatchObject({ y: 40, h: 60 }); // строки 2..4: 40..100
    });

    it("выделенная колонка блока → вертикальная полоса во всю высоту", () => {
        const out: SpanPartialFill[] = [];
        // прямоугольник: колонки [0,2], строки [0,1]; выделена колонка 1
        pushSpanSelectionStrips(
            CompactSelection.empty(),
            CompactSelection.fromSingleSelection(1),
            [0, 2],
            [0, 1],
            0,
            0,
            300,
            40,
            cols3,
            evenRh,
            "#aaccff",
            out
        );
        expect(out).toHaveLength(1);
        expect(out[0]).toMatchObject({ x: 100, y: 0, w: 100, h: 40 });
    });

    it("нет пересечения выделения с блоком → полос нет", () => {
        const out: SpanPartialFill[] = [];
        pushSpanSelectionStrips(
            CompactSelection.fromSingleSelection(50),
            CompactSelection.empty(),
            [0, 0],
            [0, 9],
            0,
            0,
            100,
            200,
            cols3,
            evenRh,
            "#aaccff",
            out
        );
        expect(out).toHaveLength(0);
    });
});
