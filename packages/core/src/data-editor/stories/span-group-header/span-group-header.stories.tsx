/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable sonarjs/no-duplicate-string */
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
    getGroupDetails,
    spanShallowGroups,
    onGroupHeaderRenamed,
    width = 1500,
    height = 640,
}: {
    cols: GridColumn[];
    description: React.ReactNode;
    groupHeaderHeight?: number | number[];
    freezeColumns?: number;
    getGroupDetails?: React.ComponentProps<typeof DataEditor>["getGroupDetails"];
    spanShallowGroups?: boolean;
    onGroupHeaderRenamed?: React.ComponentProps<typeof DataEditor>["onGroupHeaderRenamed"];
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
                getGroupDetails={getGroupDetails}
                spanShallowGroups={spanShallowGroups}
                onGroupHeaderRenamed={onGroupHeaderRenamed}
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
                    <b>ЛИСТОВАЯ фича (spanGroupHeader на колонке БЕЗ группы) — одиночные колонки рядом с группой</b>
                    {"\n"}
                    Колонки: «Краткое название роли», «Период», «Продажи», «Доплаты», «Выплаты премий» —
                    spanGroupHeader: true, у них НЕТ группы. «Индивидуальные / Коллективные / Оценка» — обычная группа "
                    {KPI}" (spanGroupHeader к группам не применяется).{"\n"}
                    {"\n"}
                    ✅ СЛИТЫ (одна ячейка на всю высоту шапки, заголовок по центру, без пустой полосы сверху, без
                    горизонтального шва): Роль, Период, Продажи, Доплаты, Выплаты премий.{"\n"}✅ НЕ слита (обычная
                    группа): "{KPI}" — «{KPI}» в верхнем ряду, три подколонки снизу. Это ожидаемо: листовая фича группы
                    НЕ трогает (для слияния группы см. SGH_GroupSpan).
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
                    <b>ЭТАЛОН «КАК БЫЛО» (флаг spanGroupHeader НЕ задан нигде) — для сравнения с SGH_Basic</b>
                    {"\n"}
                    Тот же набор колонок, что в SGH_Basic, но НИ у одной колонки нет spanGroupHeader и ни у одной группы
                    нет span. Намеренно ничего не сливается.{"\n"}
                    {"\n"}
                    ❌ Что видно (проблема, которую чиним): у одиночных «Краткое название роли», «Период», «Продажи»,
                    «Доплаты», «Выплаты премий» — ПУСТАЯ ячейка сверху, заголовок ужат в нижний ряд. Группа "{KPI}" —
                    обычная.{"\n"}
                    Открой рядом SGH_Basic — там те же одиночные колонки уже слиты.
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
                    <b>ЛИСТОВАЯ фича в ТРЁХрядной шапке (2 групп-ряда: 2024 → Q1/Q2)</b>
                    {"\n"}
                    Колонки: «ID» (слева) и «Итого» (справа) — spanGroupHeader: true, без группы. «Q1-A / Q1-B» — группа
                    [2024, Q1]; «Q2-C / Q2-D» — группа [2024, Q2]. Высота шапки = 3 ряда (2 групп-ряда + ряд колонок).
                    {"\n"}
                    {"\n"}
                    ✅ СЛИТЫ на ВСЕ 3 ряда одной ячейкой: ID и Итого — ни одна из двух межуровневых линий их не
                    пересекает.{"\n"}✅ НЕ слиты (обычные двухуровневые группы): 2024 → Q1/Q2 — «2024» в 1-м ряду,
                    «Q1»/«Q2» во 2-м, подколонки в 3-м.
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
                    <b>ЛИСТОВАЯ фича с кастомным контентом шапки (иконка + меню)</b>
                    {"\n"}
                    Колонки: «Роль» и «Итог» — spanGroupHeader: true + icon + hasMenu (без группы). «Индивидуальные /
                    Коллективные» — обычная группа "{KPI}".{"\n"}
                    {"\n"}
                    ✅ СЛИТЫ Роль и Итог: иконка и «гамбургер»-меню центрированы по ВСЕЙ высоте слитой ячейки, а не
                    прижаты к нижней полосе.{"\n"}✅ НЕ слита группа "{KPI}" (обычная).
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
                    <b>ЛИСТОВАЯ фича — слитые колонки слева / между группами / справа (сегментация линии)</b>
                    {"\n"}
                    Колонки: «Лево-слит», «Центр-слит», «Право-слит» — spanGroupHeader: true (без группы). Между ними —
                    обычные группы «Группа A» (A1/A2) и «Группа B» (B1/B2).{"\n"}
                    {"\n"}
                    ✅ СЛИТЫ 3 листовые колонки; межуровневая линия РАЗРЕЗАНА ровно по их границам (над слитой колонкой
                    линии нет), вертикальные границы со стыками групп A/B — целые.{"\n"}✅ НЕ слиты группы A и B
                    (обычные). Это стресс-тест краёв/середины и разреза линии.
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
                    <b>ЛИСТОВАЯ фича + frozen + горизонтальный скролл (рисковая геометрия translateX / sticky)</b>
                    {"\n"}
                    Колонки: «Роль (frozen)», «Период», «Продажи», «Доплаты», «Премии», «Комментарий» — spanGroupHeader:
                    true (лист). «Индивидуальные/Коллективные/Оценка» (группа "{KPI}") и «Q1-A/Q1-B» (группа [2024, Q1]) —
                    ОБЫЧНЫЕ группы, span у них НЕ включён.{"\n"}
                    {"\n"}
                    ✅ СЛИТЫ листовые колонки на всю высоту; frozen «Роль» держит слитную шапку при прокрутке, разрез
                    линии не «едет».{"\n"}⚠️ «{KPI}» НАМЕРЕННО НЕ слит (обычная группа) → под «{KPI}» видна пустая
                    полоса. Это и есть «до» для ГРУППОВОЙ фичи. Слияние группы показано в SGH_GroupSpan (точечно) и
                    SGH_ShallowAuto (авто).
                </>
            }
        />
    );
}
SGH_ScrollFrozen.decorators = [];

// 7. Слитая ГРУППА (rowspan): мелкая группа схлопывает свой пустой нижний ряд.
export function SGH_GroupSpan() {
    const cols: GridColumn[] = [
        { title: "Роль", width: 180, spanGroupHeader: true },
        { title: "Индивидуальные", width: 150, group: KPI },
        { title: "Коллективные", width: 150, group: KPI },
        { title: "Оценка", width: 150, group: KPI },
        { title: "Q1-A", width: 130, group: ["2024", "Q1"] },
        { title: "Q1-B", width: 130, group: ["2024", "Q1"] },
        { title: "Q2-C", width: 130, group: ["2024", "Q2"] },
    ];
    return (
        <SpanStoryShell
            cols={cols}
            groupHeaderHeight={[30, 28]}
            getGroupDetails={name => ({ name, span: name === KPI })}
            description={
                <>
                    <b>ГРУППОВАЯ фича (rowspan группы) — ТОЧЕЧНО через getGroupDetails().span = true</b>
                    {"\n"}
                    Колонки: «Роль» — spanGroupHeader (лист). «Индивидуальные/Коллективные/Оценка» — ОДНОуровневая группа
                    "{KPI}" (group: строка). «Q1-A/Q1-B» — [2024, Q1], «Q2-C» — [2024, Q2] (ДВУХуровневая). Шапка = 2
                    групп-ряда. span:true задан ТОЛЬКО группе "{KPI}".{"\n"}
                    {"\n"}
                    ✅ СЛИТА группа "{KPI}": одноуровневая, поэтому её нижний групп-ряд (level 1) пустой — она занимает ОБА
                    групп-ряда одной ячейкой по центру, без пустой полосы и шва; строку подколонок (Индивид/Коллект/Оценка)
                    НЕ накрывает, дно есть.{"\n"}✅ НЕ слита «2024 → Q1/Q2» (двухуровневая, span не задан). «Роль» — лист,
                    слит на всю высоту.{"\n"}🖱️ Наведи/кликни по слитой "{KPI}" — ведёт себя как одна ячейка на всю высоту.
                </>
            }
        />
    );
}
SGH_GroupSpan.decorators = [];

// 8. Авто-режим: grid-проп spanShallowGroups сливает ВСЕ мелкие группы без разметки.
export function SGH_ShallowAuto() {
    const cols: GridColumn[] = [
        { title: "Роль", width: 180, spanGroupHeader: true },
        { title: "Индивидуальные", width: 150, group: KPI },
        { title: "Коллективные", width: 150, group: KPI },
        { title: "Оценка", width: 150, group: KPI },
        { title: "План", width: 130, group: "Продажи" },
        { title: "Факт", width: 130, group: "Продажи" },
        { title: "Q1-A", width: 130, group: ["2024", "Q1"] },
        { title: "Q1-B", width: 130, group: ["2024", "Q1"] },
    ];
    return (
        <SpanStoryShell
            cols={cols}
            groupHeaderHeight={[30, 28]}
            spanShallowGroups
            description={
                <>
                    <b>ГРУППОВАЯ фича — АВТО-режим (grid-проп spanShallowGroups, БЕЗ ручной разметки)</b>
                    {"\n"}
                    На таблице стоит только spanShallowGroups. Колонки: «Роль» — лист. МЕЛКИЕ (одноуровневые) группы:
                    "{KPI}" (Индивид/Коллект/Оценка) и «Продажи» (План/Факт). ГЛУБОКАЯ: [2024, Q1] (Q1-A/Q1-B). Шапка = 2
                    групп-ряда.{"\n"}
                    {"\n"}
                    ✅ СЛИТЫ ОБЕ мелкие группы — "{KPI}" И «Продажи» — автоматически, без единого getGroupDetails.{"\n"}✅
                    НЕ слита «2024 → Q1» (двухуровневая — не мелкая). «Роль» — лист, слит.{"\n"}
                    Отличие от SGH_GroupSpan: там span включён руками у ОДНОЙ группы; здесь ВСЕ мелкие сливаются одним
                    пропом (span:false у группы точечно отключил бы её из авто).
                </>
            }
        />
    );
}
SGH_ShallowAuto.decorators = [];

// 9. Task IV на слитой группе: actions + rename + overrideTheme на merged-высоте.
export function SGH_GroupActionsTheme() {
    const cols: GridColumn[] = [
        { title: "Роль", width: 160, spanGroupHeader: true },
        { title: "Индивидуальные", width: 150, group: KPI },
        { title: "Коллективные", width: 150, group: KPI },
        { title: "Оценка", width: 150, group: KPI },
        { title: "Q1-A", width: 130, group: ["2024", "Q1"] },
        { title: "Q1-B", width: 130, group: ["2024", "Q1"] },
    ];
    return (
        <SpanStoryShell
            cols={cols}
            groupHeaderHeight={[30, 28]}
            onGroupHeaderRenamed={() => undefined}
            getGroupDetails={name =>
                name === KPI
                    ? {
                          name,
                          span: true,
                          overrideTheme: { bgGroupHeader: "#eaf1ff" },
                          actions: [
                              { title: "Настройки", icon: GridColumnIcon.HeaderString, onClick: () => undefined },
                          ],
                      }
                    : { name }
            }
            description={
                <>
                    <b>ГРУППОВАЯ фича — actions / rename / overrideTheme на СЛИТОЙ высоте (Task IV)</b>
                    {"\n"}
                    Колонки: «Роль» — лист. «Индивидуальные/Коллективные/Оценка» — группа "{KPI}" со span:true +
                    overrideTheme (голубая заливка) + action-иконка. onGroupHeaderRenamed включён → при наведении
                    добавляется пункт Rename. «Q1-A/Q1-B» — [2024, Q1] (обычная).{"\n"}
                    {"\n"}
                    ✅ Голубая заливка overrideTheme — на ВСЮ слитую высоту "{KPI}" (не только верхний ряд).{"\n"}✅ При
                    наведении иконки actions/rename — по центру слитой ячейки (не прижаты к верхней полосе).{"\n"}✅ Клик
                    по rename → инпут-оверлей по merged-прямоугольнику (на всю слитую высоту).{"\n"}✅ НЕ слита «2024 →
                    Q1» (обычная).
                </>
            }
        />
    );
}
SGH_GroupActionsTheme.decorators = [];
