import { describe, expect, it } from "vitest";
import { segmentSpanGroupHeaderLine } from "../src/internal/data-grid/render/data-grid-render.header.js";

describe("segmentSpanGroupHeaderLine — разрез межуровневой линии вокруг слитых колонок", () => {
    it("нет слитых колонок → одна сплошная линия во всю ширину", () => {
        expect(segmentSpanGroupHeaderLine(1000, [])).toEqual([[0, 1000]]);
    });

    it("один разрыв в середине → два отрезка по краям", () => {
        expect(segmentSpanGroupHeaderLine(1000, [[300, 450]])).toEqual([
            [0, 300],
            [450, 1000],
        ]);
    });

    it("разрыв у левого края (с 0) → только правый отрезок", () => {
        expect(segmentSpanGroupHeaderLine(1000, [[0, 200]])).toEqual([[200, 1000]]);
    });

    it("разрыв у правого края (до width) → только левый отрезок", () => {
        expect(segmentSpanGroupHeaderLine(1000, [[800, 1000]])).toEqual([[0, 800]]);
    });

    it("несколько разрывов (края + середина) → отрезки между ними", () => {
        expect(
            segmentSpanGroupHeaderLine(1000, [
                [0, 150],
                [400, 550],
                [900, 1000],
            ])
        ).toEqual([
            [150, 400],
            [550, 900],
        ]);
    });

    it("две соседние слитые колонки (стыкующиеся интервалы) → один общий вырез", () => {
        // [100,250] и [250,400] стыкуются в [100,400]
        expect(
            segmentSpanGroupHeaderLine(1000, [
                [100, 250],
                [250, 400],
            ])
        ).toEqual([
            [0, 100],
            [400, 1000],
        ]);
    });

    it("несортированные интервалы (порядок walkColumns не гарантирован) → сортируются внутри", () => {
        expect(
            segmentSpanGroupHeaderLine(1000, [
                [700, 800],
                [100, 200],
            ])
        ).toEqual([
            [0, 100],
            [200, 700],
            [800, 1000],
        ]);
    });

    it("наезжающие интервалы → корректно схлопываются", () => {
        expect(
            segmentSpanGroupHeaderLine(1000, [
                [100, 400],
                [300, 500],
            ])
        ).toEqual([
            [0, 100],
            [500, 1000],
        ]);
    });

    it("интервал уходит за правый край (скролл) → правого отрезка нет, левый обрезан", () => {
        expect(segmentSpanGroupHeaderLine(1000, [[900, 1200]])).toEqual([[0, 900]]);
    });

    it("интервал с отрицательным началом (колонка уехала влево при скролле) → игнорируется слева", () => {
        // gap [-100, 200] покрывает левый край, дальше линия с 200
        expect(segmentSpanGroupHeaderLine(1000, [[-100, 200]])).toEqual([[200, 1000]]);
    });

    it("слитые колонки покрывают всю ширину → линии нет вообще", () => {
        expect(
            segmentSpanGroupHeaderLine(1000, [
                [0, 500],
                [500, 1000],
            ])
        ).toEqual([]);
    });

    it("нулевая ширина → пустой список отрезков", () => {
        expect(segmentSpanGroupHeaderLine(0, [])).toEqual([]);
    });
});
