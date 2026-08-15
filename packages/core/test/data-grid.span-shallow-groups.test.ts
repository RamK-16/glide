import { describe, expect, it } from "vitest";
import { computeBounds, type MappedGridColumn } from "../src/internal/data-grid/render/data-grid-lib.js";
import {
    findSpannedGroupRegion,
    getGroupLevels,
    getSpannedGroupRegions,
} from "../src/internal/data-grid/render/data-grid-render.walk.js";

// Минимальный конструктор MappedGridColumn для тестов геометрии/логики регионов.
function col(partial: Partial<MappedGridColumn>): MappedGridColumn {
    return { title: "", width: 100, sourceIndex: 0, sticky: false, ...partial } as unknown as MappedGridColumn;
}

// Мелкая (одноуровневая) группа KPI рядом с глубокой (двухуровневой) 2024→Q1.
// getGroupLevels = 2, поэтому у KPI нижний групп-ряд (level 1) пустой — кандидат на слияние.
const cols: MappedGridColumn[] = [
    col({ sourceIndex: 0, group: "KPI" }),
    col({ sourceIndex: 1, group: "KPI" }),
    col({ sourceIndex: 2, group: "KPI" }),
    col({ sourceIndex: 3, group: ["2024", "Q1"] }),
    col({ sourceIndex: 4, group: ["2024", "Q1"] }),
];

const spanAll = () => true;

describe("getSpannedGroupRegions — какие группы сливаются", () => {
    it("мелкая (терминальная) группа со span → регион на её уровне", () => {
        const levels = getGroupLevels(cols);
        const regions = getSpannedGroupRegions(cols, levels, spanAll);
        expect(regions).toEqual([{ level: 0, startCol: 0, endCol: 2 }]);
    });

    it("глубокая группа (2024→Q1) НЕ становится регионом (нижний ряд не пуст)", () => {
        const regions = getSpannedGroupRegions(cols, getGroupLevels(cols), spanAll);
        expect(regions.some(r => r.startCol === 3)).toBe(false);
    });

    it("isSpanned=false → регионов нет (opt-out)", () => {
        const regions = getSpannedGroupRegions(cols, getGroupLevels(cols), () => false);
        expect(regions).toEqual([]);
    });

    it("точечный span только у KPI → сливается только KPI", () => {
        const regions = getSpannedGroupRegions(cols, getGroupLevels(cols), name => name === "KPI");
        expect(regions).toEqual([{ level: 0, startCol: 0, endCol: 2 }]);
    });

    it("ragged: под группой у части колонок есть подгруппа → НЕ сливаем", () => {
        const ragged: MappedGridColumn[] = [
            col({ sourceIndex: 0, group: "Mix" }),
            col({ sourceIndex: 1, group: ["Mix", "Sub"] }),
        ];
        const regions = getSpannedGroupRegions(ragged, getGroupLevels(ragged), spanAll);
        expect(regions).toEqual([]);
    });

    it("одноуровневая шапка (levels=1) → регионов нет (пустых рядов нет)", () => {
        const flat: MappedGridColumn[] = [
            col({ sourceIndex: 0, group: "A" }),
            col({ sourceIndex: 1, group: "A" }),
        ];
        expect(getGroupLevels(flat)).toBe(1);
        expect(getSpannedGroupRegions(flat, getGroupLevels(flat), spanAll)).toEqual([]);
    });
});

describe("getSpannedGroupRegions под DnD-реордером (позиция ≠ sourceIndex)", () => {
    // Одиночная слитая группа pppp (sourceIndex 6) перетащена в СЕРЕДИНУ — стоит на
    // позиции 5, а на позиции 6 оказался лист глубокой группы (sourceIndex 5). Прежний
    // цикл effectiveCols[span[0]..span[1]] брал effectiveCols[6] (чужой лист с подгруппой)
    // и ошибочно исключал регион pppp → сквош рвался. Теперь терминальность считается по
    // фактическим членам.
    const reordered: MappedGridColumn[] = [
        col({ sourceIndex: 0 }), // ID, без группы, поз 0
        col({ sourceIndex: 1, group: ["Показатели", "Продажи"] }), // поз 1
        col({ sourceIndex: 2, group: ["Показатели", "Продажи"] }), // поз 2
        col({ sourceIndex: 3, group: ["Показатели", "Оценка"] }), // поз 3
        col({ sourceIndex: 4, group: ["Показатели", "Оценка"] }), // поз 4
        col({ sourceIndex: 6, group: "pppp" }), // TR перетащен сюда (поз 5)
        col({ sourceIndex: 5, group: ["Показатели", "Оценка"] }), // Итог (поз 6)
    ];
    const isPppp = (name: string) => name === "pppp";

    it("терминальная слитая группа pppp определяется корректно, несмотря на реордер", () => {
        const regions = getSpannedGroupRegions(reordered, getGroupLevels(reordered), isPppp);
        expect(regions).toEqual([{ level: 0, startCol: 6, endCol: 6 }]);
    });

    it("без реордера (позиция = sourceIndex) результат тот же", () => {
        const inOrder: MappedGridColumn[] = [
            col({ sourceIndex: 0 }),
            col({ sourceIndex: 1, group: ["Показатели", "Продажи"] }),
            col({ sourceIndex: 2, group: ["Показатели", "Продажи"] }),
            col({ sourceIndex: 3, group: ["Показатели", "Оценка"] }),
            col({ sourceIndex: 4, group: ["Показатели", "Оценка"] }),
            col({ sourceIndex: 5, group: ["Показатели", "Оценка"] }),
            col({ sourceIndex: 6, group: "pppp" }),
        ];
        const regions = getSpannedGroupRegions(inOrder, getGroupLevels(inOrder), isPppp);
        expect(regions).toEqual([{ level: 0, startCol: 6, endCol: 6 }]);
    });
});

describe("findSpannedGroupRegion — покрытие колонки регионом", () => {
    const regions = getSpannedGroupRegions(cols, getGroupLevels(cols), spanAll);

    it("нижний (пустой) уровень колонки KPI → возвращает регион", () => {
        expect(findSpannedGroupRegion(regions, 1, 1)).toEqual({ level: 0, startCol: 0, endCol: 2 });
    });

    it("верхний уровень группы KPI → тот же регион", () => {
        expect(findSpannedGroupRegion(regions, 0, 0)).toEqual({ level: 0, startCol: 0, endCol: 2 });
    });

    it("колонка вне региона (2024) → undefined", () => {
        expect(findSpannedGroupRegion(regions, 3, 1)).toBeUndefined();
    });
});

describe("computeBounds — слитая группа на всю высоту групп-шапки", () => {
    const GROUP_HEIGHTS = [30, 28]; // 2 групп-ряда
    const GROUP_TOTAL = 58;
    const HEADER_H = 36;
    const TOTAL_H = GROUP_TOTAL + HEADER_H; // 94

    function bounds(colIndex: number, row: number, regions?: ReturnType<typeof getSpannedGroupRegions>) {
        return computeBounds(
            colIndex,
            row,
            1000,
            1000,
            GROUP_HEIGHTS,
            TOTAL_H,
            0,
            0,
            0,
            0,
            100,
            0,
            0,
            cols,
            32,
            regions
        );
    }

    const regions = getSpannedGroupRegions(cols, getGroupLevels(cols), spanAll);

    it("слитая группа (row=-2) → bounds на ОБА групп-ряда (y=0, height=58)", () => {
        const b = bounds(0, -2, regions);
        expect(b.y).toBe(0);
        expect(b.height).toBe(GROUP_TOTAL);
    });

    it("та же группа БЕЗ регионов → только свой ряд (height=30)", () => {
        const b = bounds(0, -2, undefined);
        expect(b.y).toBe(0);
        expect(b.height).toBe(GROUP_HEIGHTS[0]);
    });

    it("глубокая группа 2024 (верхний ряд) не затронута → высота одного ряда", () => {
        const b = bounds(3, -2, regions);
        expect(b.height).toBe(GROUP_HEIGHTS[0]);
    });
});
