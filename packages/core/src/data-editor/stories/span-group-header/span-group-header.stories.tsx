/* eslint-disable react/no-unescaped-entities */
import * as React from "react";

import { BuilderThemeWrapper } from "../../../stories/story-utils.js";
import {
    type GridCell,
    GridCellKind,
    type GridColumn,
    GridColumnIcon,
    type Item,
} from "../../../internal/data-grid/data-grid-types.js";
import { DataEditorAll as DataEditor } from "../../../data-editor-all.js";

export default {
    title: "Tests/SpanGroupHeader",

    decorators: [
        (Story: React.ComponentType) => (
            <BuilderThemeWrapper width={1500} height={640}>
                <Story />
            </BuilderThemeWrapper>
        ),
    ],
};

// =====================================================
// spanGroupHeader: одиночная колонка рисует шапку как ОДНУ слитную ячейку на всю
// высоту (групповые строки + строка колонки) — без пустой полосы сверху и без шва.
// Флаг opt-in: не задан → колонка рендерится как раньше.
// =====================================================

const KPI = "Коэффициент результативности";

function SpanStoryShell({
    cols,
    description,
    groupHeaderHeight = 34,
    freezeColumns,
    width = 1500,
    height = 640,
}: {
    cols: GridColumn[];
    description: React.ReactNode;
    groupHeaderHeight?: number | number[];
    freezeColumns?: number;
    width?: number;
    height?: number;
}) {
    const getCellContent = React.useCallback(
        ([col, row]: Item): GridCell => {
            const title = cols[col]?.title ?? `C${col}`;
            const short = title.length > 8 ? `${title.slice(0, 8)}…` : title;
            return {
                kind: GridCellKind.Text,
                displayData: `${short} ${row}`,
                data: `${title} ${row}`,
                allowOverlay: false,
                readonly: true,
            };
        },
        [cols]
    );

    return (
        <div style={{ width, height }}>
            <div
                style={{
                    marginBottom: 8,
                    fontFamily: "monospace",
                    fontSize: 13,
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
                }}>
                {description}
            </div>
            <DataEditor
                width={width}
                height={height - 140}
                getCellContent={getCellContent}
                getCellsForSelection={true}
                columns={cols}
                rows={200}
                rowMarkers="both"
                groupHeaderHeight={groupHeaderHeight}
                freezeColumns={freezeColumns}
            />
        </div>
    );
}

// 1. Основной кейс из задачи: одиночные колонки + одна группа с 3 подколонками.
export function SGH_Basic() {
    const cols: GridColumn[] = [
        { title: "Краткое название роли", width: 200, spanGroupHeader: true },
        { title: "Период", width: 150, spanGroupHeader: true },
        { title: "Индивидуальные", width: 150, group: KPI },
        { title: "Коллективные", width: 150, group: KPI },
        { title: "Оценка", width: 150, group: KPI },
        { title: "Продажи", width: 150, spanGroupHeader: true },
        { title: "Доплаты", width: 150, spanGroupHeader: true },
        { title: "Выплаты премий", width: 160, spanGroupHeader: true },
    ];
    return (
        <SpanStoryShell
            cols={cols}
            description={
                <>
                    <b>Кейс из задачи: одиночные колонки рядом с группой</b>
                    {"\n"}
                    Роль, Период, Продажи, Доплаты, Премии — spanGroupHeader: true. Группа "{KPI}" — обычная (3
                    подколонки).{"\n"}
                    ✅ Что увидеть: у одиночных НЕТ пустой полосы сверху; заголовок центрирован по всей высоте шапки;
                    нет горизонтального шва посреди ячейки.
                </>
            }
        />
    );
}
SGH_Basic.decorators = [];

// 2. Тот же набор БЕЗ флага — как выглядит СЕЙЧАС (для сравнения до/после).
export function SGH_WithoutSpan_Before() {
    const cols: GridColumn[] = [
        { title: "Краткое название роли", width: 200 },
        { title: "Период", width: 150 },
        { title: "Индивидуальные", width: 150, group: KPI },
        { title: "Коллективные", width: 150, group: KPI },
        { title: "Оценка", width: 150, group: KPI },
        { title: "Продажи", width: 150 },
        { title: "Доплаты", width: 150 },
        { title: "Выплаты премий", width: 160 },
    ];
    return (
        <SpanStoryShell
            cols={cols}
            description={
                <>
                    <b>ДО доработки (без spanGroupHeader) — для сравнения с SGH_Basic</b>
                    {"\n"}
                    Тот же набор колонок, флаг не задан.{"\n"}
                    ❌ Что увидеть: у одиночных пустая ячейка сверху + заголовок ужат в нижнюю строку. Именно это и
                    чиним.
                </>
            }
        />
    );
}
SGH_WithoutSpan_Before.decorators = [];

// 3. Многоуровневые группы: слитная колонка тянется на 2 групп-строки + строку колонки.
export function SGH_MultiLevel() {
    const cols: GridColumn[] = [
        { title: "ID", width: 100, spanGroupHeader: true },
        { title: "Q1-A", width: 150, group: ["2024", "Q1"] },
        { title: "Q1-B", width: 150, group: ["2024", "Q1"] },
        { title: "Q2-C", width: 150, group: ["2024", "Q2"] },
        { title: "Q2-D", width: 150, group: ["2024", "Q2"] },
        { title: "Итого", width: 150, spanGroupHeader: true },
    ];
    return (
        <SpanStoryShell
            cols={cols}
            groupHeaderHeight={[30, 28]}
            description={
                <>
                    <b>Многоуровневые группы (2 уровня): 2024 → Q1/Q2</b>
                    {"\n"}
                    Слитные ID и Итого при высоте шапки в 3 ряда (2 групп-строки + строка колонки).{"\n"}
                    ✅ Что увидеть: ID и Итого занимают ВСЕ 3 ряда одной ячейкой; ни одна межуровневая линия их не
                    пересекает.
                </>
            }
        />
    );
}
SGH_MultiLevel.decorators = [];

// 4. Кастомный контент шапки у слитой колонки: icon + меню.
export function SGH_CustomHeader() {
    const cols: GridColumn[] = [
        { title: "Роль", width: 200, spanGroupHeader: true, icon: GridColumnIcon.HeaderString, hasMenu: true },
        { title: "Индивидуальные", width: 150, group: KPI, icon: GridColumnIcon.HeaderNumber },
        { title: "Коллективные", width: 150, group: KPI, icon: GridColumnIcon.HeaderNumber },
        { title: "Итог", width: 150, spanGroupHeader: true, icon: GridColumnIcon.HeaderNumber, hasMenu: true },
    ];
    return (
        <SpanStoryShell
            cols={cols}
            groupHeaderHeight={36}
            description={
                <>
                    <b>Кастомный контент шапки в слитой ячейке (иконка + меню)</b>
                    {"\n"}
                    Слитные Роль и Итог имеют icon и hasMenu.{"\n"}
                    ✅ Что увидеть: иконка и «гамбургер»-меню центрированы по ВСЕЙ высоте слитой ячейки, а не прижаты к
                    нижней полосе.
                </>
            }
        />
    );
}
SGH_CustomHeader.decorators = [];

// 5. Слитные на КРАЯХ и в СЕРЕДИНЕ между группами — проверка разреза линии и стыков.
export function SGH_EdgesAndMiddle() {
    const cols: GridColumn[] = [
        { title: "Лево-слит", width: 150, spanGroupHeader: true },
        { title: "A1", width: 150, group: "Группа A" },
        { title: "A2", width: 150, group: "Группа A" },
        { title: "Центр-слит", width: 150, spanGroupHeader: true },
        { title: "B1", width: 150, group: "Группа B" },
        { title: "B2", width: 150, group: "Группа B" },
        { title: "Право-слит", width: 150, spanGroupHeader: true },
    ];
    return (
        <SpanStoryShell
            cols={cols}
            description={
                <>
                    <b>Слитные слева / между группами / справа</b>
                    {"\n"}
                    Проверка сегментации горизонтальной линии и вертикальных стыков с группами A и B.{"\n"}
                    ✅ Что увидеть: межуровневая линия разрезана ровно по границам слитых колонок (над ними линии нет);
                    вертикальные границы с группами целые.
                </>
            }
        />
    );
}
SGH_EdgesAndMiddle.decorators = [];

// 6. Горизонтальный скролл + frozen: первая слитная колонка заморожена (самый рисковый кейс).
export function SGH_ScrollFrozen() {
    const cols: GridColumn[] = [
        { title: "Роль (frozen)", width: 190, spanGroupHeader: true },
        { title: "Период", width: 150, spanGroupHeader: true },
        { title: "Индивидуальные", width: 150, group: KPI },
        { title: "Коллективные", width: 150, group: KPI },
        { title: "Оценка", width: 150, group: KPI },
        { title: "Продажи", width: 150, spanGroupHeader: true },
        { title: "Доплаты", width: 150, spanGroupHeader: true },
        { title: "Премии", width: 150, spanGroupHeader: true },
        { title: "Q1-A", width: 150, group: ["2024", "Q1"] },
        { title: "Q1-B", width: 150, group: ["2024", "Q1"] },
        { title: "Комментарий", width: 220, spanGroupHeader: true },
    ];
    return (
        <SpanStoryShell
            cols={cols}
            groupHeaderHeight={[30, 28]}
            freezeColumns={1}
            description={
                <>
                    <b>Скролл + frozen: первая слитная колонка заморожена</b>
                    {"\n"}
                    Самый рисковый кейс — геометрия при translateX / sticky.{"\n"}
                    ✅ Что увидеть при горизонтальной прокрутке: разрез линии и слитые ячейки НЕ «едут»; frozen «Роль»
                    держит слитную шапку на всю высоту.
                </>
            }
        />
    );
}
SGH_ScrollFrozen.decorators = [];
