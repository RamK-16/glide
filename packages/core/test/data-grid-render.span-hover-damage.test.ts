import { describe, expect, test } from "vitest";
import { CellSet } from "../src/internal/data-grid/cell-set.js";
import {
    damageHasSpanCells,
    getBodyDamagePad,
    getDamageRepairPad,
} from "../src/internal/data-grid/render/data-grid-render.js";

// Регресс на баг: при ховере по объединённому блоку без enableLowDprHairline
// пропадали границы блока (span-repair damage-путь гейтился этим флагом, а pad был 0).
describe("span hover damage repair — развязано от enableLowDprHairline", () => {
    test("getDamageRepairPad без low-DPR = 0 (тугой header-клип, не залезает в соседний групп-ряд)", () => {
        // Ненулевой pad тут раздул бы clipHeaderDamage → светлая полоса на выделенной группе.
        expect(getDamageRepairPad(false)).toBe(0);
        expect(getDamageRepairPad(true)).toBeGreaterThanOrEqual(1);
    });

    test("getBodyDamagePad: при span в damage pad >= 1 даже без low-DPR (иначе граница блока на краю bbox не восстановится)", () => {
        expect(getBodyDamagePad(false, true)).toBeGreaterThanOrEqual(1);
        expect(getBodyDamagePad(false, false)).toBe(0);
        expect(getBodyDamagePad(true, false)).toBeGreaterThanOrEqual(1);
    });

    test("damageHasSpanCells: видит colspan-ячейку в damage", () => {
        const damage = new CellSet([[0, 0]]);
        expect(damageHasSpanCells(damage, () => ({ span: [0, 1] as const }))).toBe(true);
    });

    test("damageHasSpanCells: видит rowspan-ячейку в damage", () => {
        const damage = new CellSet([[1, 2]]);
        expect(damageHasSpanCells(damage, () => ({ spanRows: [2, 4] as const }))).toBe(true);
    });

    test("damageHasSpanCells: false, если ни одна damaged-ячейка не слита", () => {
        const damage = new CellSet([
            [0, 0],
            [1, 1],
        ]);
        expect(damageHasSpanCells(damage, () => ({}))).toBe(false);
    });

    test("damageHasSpanCells: игнорирует ячейки шапки (row < 0) и не зовёт для них getCellContent", () => {
        const damage = new CellSet([[0, -1]]);
        let called = false;
        const getCellContent = () => {
            called = true;
            return { span: [0, 1] as const };
        };
        expect(damageHasSpanCells(damage, getCellContent)).toBe(false);
        expect(called).toBe(false);
    });
});
