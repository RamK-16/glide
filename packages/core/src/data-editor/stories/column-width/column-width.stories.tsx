/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable unicorn/prefer-code-point */
/* eslint-disable react/no-unescaped-entities */
import * as React from "react";

import { useState, useCallback } from "storybook/preview-api";
import { BuilderThemeWrapper } from "../../../stories/story-utils.js";
import {
    type GridCell,
    GridCellKind,
    type GridColumn,
    type Item,
} from "../../../internal/data-grid/data-grid-types.js";
import { DataEditorAll as DataEditor } from "../../../data-editor-all.js";

export default {
    title: "Tests/ColumnWidth",

    decorators: [
        (Story: React.ComponentType) => (
            <BuilderThemeWrapper width={1600} height={800}>
                <Story />
            </BuilderThemeWrapper>
        ),
    ],
};

// =====================================================
// Корнер-кейсы ширины колонок (логика обёртки: width =grow:0, нет width =grow:1)
// =====================================================

function adaptGrow(col: GridColumn): GridColumn {
    if (col.grow !== undefined) return col;
    const hasWidth = "width" in col && typeof col.width === "number";
    return { ...col, grow: hasWidth ? 0 : 1 };
}

function withAdaptedGrow(cols: GridColumn[]): GridColumn[] {
    return cols.map(adaptGrow);
}

function getWidthTestData([col, row]: Item): GridCell {
    const texts = [
        `ID-${row}`,
        `Заголовок строки ${row} — длинный текст для проверки auto-sizing`,
        row % 2 === 0 ? "Высокий" : "Низкий",
        `Категория ${String.fromCharCode(65 + (row % 5))}`,
        `${(row * 17) % 100}%`,
    ];
    return {
        kind: GridCellKind.Text,
        displayData: texts[col] ?? `${col},${row}`,
        data: texts[col] ?? `${col},${row}`,
        allowOverlay: false,
    };
}

function useResizableCols(initial: GridColumn[]) {
    const [cols, setCols] = useState<GridColumn[]>(initial);
    const onColumnResize = useCallback(
        (col: GridColumn, newSize: number) => {
            const index = cols.findIndex(c => c.id === col.id);
            if (index === -1) return;
            const next = [...cols];
            next[index] = { ...next[index], width: newSize };
            setCols(next);
        },
        [cols]
    );
    return { cols, onColumnResize };
}

function WidthStoryShell({ cols, onColumnResize, description, width = 1500, height = 600 }: {
    cols: GridColumn[];
    onColumnResize: (col: GridColumn, newSize: number) => void;
    description: React.ReactNode;
    width?: number;
    height?: number;
}) {
    return (
        <div style={{ width, height }}>
            <div style={{ marginBottom: 8, fontFamily: "monospace", fontSize: 13, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                {description}
            </div>
            <DataEditor
                width={width}
                height={height - 100}
                getCellContent={getWidthTestData}
                getCellsForSelection={true}
                columns={cols}
                rows={100}
                onColumnResize={onColumnResize}
            />
        </div>
    );
}

// 1. Все колонки с width (grow: 0)
export function CW_AllWithWidth() {
    const { cols, onColumnResize } = useResizableCols(withAdaptedGrow([
        { title: "ID (w:80)", id: "id", width: 80 },
        { title: "Title (w:300)", id: "title", width: 300 },
        { title: "Priority (w:150)", id: "priority", width: 150 },
        { title: "Type (w:200)", id: "type", width: 200 },
        { title: "Complete (w:120)", id: "complete", width: 120 },
    ]));
    return (
        <WidthStoryShell cols={cols} onColumnResize={onColumnResize} description={
            <><b>Кейс: все колонки с width</b>{"\n"}
            Логика обёртки: width есть =grow: 0. Колонки НЕ растягиваются.{"\n"}
            Сумма = 850px, контейнер = 1500px. Справа пустое место.{"\n"}
            Ресайз: свободное перетаскивание без ограничений.</>
        } />
    );
}
CW_AllWithWidth.decorators = [];

// 2. Все колонки без width (grow: 1)
export function CW_AllNoWidth() {
    const { cols, onColumnResize } = useResizableCols(withAdaptedGrow([
        { title: "ID", id: "id" },
        { title: "Title", id: "title" },
        { title: "Priority", id: "priority" },
        { title: "Type", id: "type" },
        { title: "Complete", id: "complete" },
    ]));
    return (
        <WidthStoryShell cols={cols} onColumnResize={onColumnResize} description={
            <><b>Кейс: все колонки без width</b>{"\n"}
            Логика обёртки: width нет =grow: 1. Колонки auto-size + grow заполняет контейнер.{"\n"}
            Ожидание: колонки подобрали ширину по контенту, затем grow дораспределил остаток поровну.{"\n"}
            Вся ширина контейнера (1500px) занята.</>
        } />
    );
}
CW_AllNoWidth.decorators = [];

// 3. Микс: часть с width (grow:0), часть без (grow:1)
export function CW_MixedWidthAndAuto() {
    const { cols, onColumnResize } = useResizableCols(withAdaptedGrow([
        { title: "ID (w:80)", id: "id", width: 80 },
        { title: "Title (auto)", id: "title" },
        { title: "Priority (w:150)", id: "priority", width: 150 },
        { title: "Type (auto)", id: "type" },
        { title: "Complete (w:120)", id: "complete", width: 120 },
    ]));
    return (
        <WidthStoryShell cols={cols} onColumnResize={onColumnResize} description={
            <><b>Кейс: микс фиксированных и авто-колонок</b>{"\n"}
            ID, Priority, Complete имеют width =grow: 0 (фиксированные, 350px суммарно).{"\n"}
            Title, Type без width =grow: 1 (делят оставшиеся ~1150px через grow).{"\n"}
            Ожидание: Title и Type заполняют все свободное место.</>
        } />
    );
}
CW_MixedWidthAndAuto.decorators = [];

// 4. minWidth без width (grow: 1)
export function CW_MinWidthNoWidth() {
    const { cols, onColumnResize } = useResizableCols(withAdaptedGrow([
        { title: "ID (min:50)", id: "id", minWidth: 50 },
        { title: "Title (min:200)", id: "title", minWidth: 200 },
        { title: "Priority (min:100)", id: "priority", minWidth: 100 },
        { title: "Type (min:80)", id: "type", minWidth: 80 },
        { title: "Complete (min:60)", id: "complete", minWidth: 60 },
    ]));
    return (
        <WidthStoryShell cols={cols} onColumnResize={onColumnResize} description={
            <><b>Кейс: только minWidth (без width =grow: 1)</b>{"\n"}
            Все колонки auto-size + grow. minWidth задает нижнюю границу.{"\n"}
            Ожидание: колонки не уже minWidth, grow заполняет контейнер.{"\n"}
            Ресайз: нельзя сузить ниже minWidth.</>
        } />
    );
}
CW_MinWidthNoWidth.decorators = [];

// 5. maxWidth без width (grow: 1) — все уперлись
export function CW_MaxWidthAllCapped() {
    const { cols, onColumnResize } = useResizableCols(withAdaptedGrow([
        { title: "ID (max:100)", id: "id", maxWidth: 100 },
        { title: "Title (max:250)", id: "title", maxWidth: 250 },
        { title: "Priority (max:120)", id: "priority", maxWidth: 120 },
        { title: "Type (max:180)", id: "type", maxWidth: 180 },
        { title: "Complete (max:90)", id: "complete", maxWidth: 90 },
    ]));
    return (
        <WidthStoryShell cols={cols} onColumnResize={onColumnResize} description={
            <><b>Кейс: только maxWidth (без width =grow: 1)</b>{"\n"}
            Все колонки auto-size + grow. Сумма maxWidth = 740px, контейнер = 1500px.{"\n"}
            grow довел все колонки до maxWidth. Дальше расти некуда =760px пустого места.{"\n"}
            ПОБОЧНЫЙ ЭФФЕКТ: ресайз заблокирован (все уперлись, grow возвращает обратно).{"\n"}
            Это ожидаемо: нет "свободной" колонки-поглотителя.</>
        } />
    );
}
CW_MaxWidthAllCapped.decorators = [];

// 6. maxWidth + свободная колонка
export function CW_MaxWidthWithFreeColumn() {
    const { cols, onColumnResize } = useResizableCols(withAdaptedGrow([
        { title: "ID (w:80)", id: "id", width: 80 },
        { title: "Title (max:250)", id: "title", maxWidth: 250 },
        { title: "Priority (max:120)", id: "priority", maxWidth: 120 },
        { title: "Type (без ограничений)", id: "type" },
        { title: "Complete (w:120)", id: "complete", width: 120 },
    ]));
    return (
        <WidthStoryShell cols={cols} onColumnResize={onColumnResize} description={
            <><b>Кейс: maxWidth + свободная колонка-поглотитель</b>{"\n"}
            ID, Complete фиксированные (grow: 0). Title, Priority, Type без width (grow: 1).{"\n"}
            Title ограничен 250px, Priority 120px. Type без ограничений.{"\n"}
            Ожидание: Title=250, Priority=120, Type забирает остаток (~930px).{"\n"}
            Ресайз: Title и Priority можно сузить, излишек уйдет в Type.</>
        } />
    );
}
CW_MaxWidthWithFreeColumn.decorators = [];

// 7. minWidth + maxWidth + свободная колонка
export function CW_MinMaxWithFreeColumn() {
    const { cols, onColumnResize } = useResizableCols(withAdaptedGrow([
        { title: "ID (w:80)", id: "id", width: 80 },
        { title: "Title (min:200, max:400)", id: "title", minWidth: 200, maxWidth: 400 },
        { title: "Priority (min:80, max:150)", id: "priority", minWidth: 80, maxWidth: 150 },
        { title: "Type (без ограничений)", id: "type" },
        { title: "Complete (w:120)", id: "complete", width: 120 },
    ]));
    return (
        <WidthStoryShell cols={cols} onColumnResize={onColumnResize} description={
            <><b>Кейс: minWidth + maxWidth + свободная колонка</b>{"\n"}
            ID, Complete фиксированные (grow: 0). Title, Priority, Type без width (grow: 1).{"\n"}
            Title: 200-400px. Priority: 80-150px. Type: без ограничений.{"\n"}
            Ожидание: Title=400, Priority=150, Type забирает остаток (~750px).{"\n"}
            Ресайз: Title можно сузить до 200, освобожденное место уйдет в Type.</>
        } />
    );
}
CW_MinMaxWithFreeColumn.decorators = [];

// 8. maxAutoWidth + свободная колонка (ОСНОВНОЙ КЕЙС)
export function CW_MaxAutoWidthWithFreeColumn() {
    const { cols, onColumnResize } = useResizableCols(withAdaptedGrow([
        { title: "ID (w:80)", id: "id", width: 80 },
        { title: "Title (maxAuto:200)", id: "title", maxAutoWidth: 200 },
        { title: "Priority (maxAuto:100)", id: "priority", maxAutoWidth: 100 },
        { title: "Type (без ограничений)", id: "type" },
        { title: "Complete (w:120)", id: "complete", width: 120 },
    ]));
    return (
        <WidthStoryShell cols={cols} onColumnResize={onColumnResize} description={
            <><b>Кейс: maxAutoWidth + свободная колонка (ОСНОВНОЙ КЕЙС обёртки)</b>{"\n"}
            ID, Complete фиксированные (grow: 0). Title, Priority, Type без width (grow: 1).{"\n"}
            Title ограничен maxAutoWidth=200, Priority maxAutoWidth=100. Type без ограничений.{"\n"}
            Ожидание: Title=200, Priority=100, Type забирает остаток (~1000px).{"\n"}
            Ресайз: Title и Priority можно расширить шире maxAutoWidth (мягкое ограничение).</>
        } />
    );
}
CW_MaxAutoWidthWithFreeColumn.decorators = [];

// 9. Симуляция реальной таблицы
export function CW_RealTableSimulation() {
    const { cols, onColumnResize } = useResizableCols(withAdaptedGrow([
        { title: "# (w:50)", id: "num", width: 50 },
        { title: "Имя (min:150, maxAuto:300)", id: "name", minWidth: 150, maxAutoWidth: 300 },
        { title: "Статус (maxAuto:100, max:200)", id: "status", maxAutoWidth: 100, maxWidth: 200 },
        { title: "Описание (без ограничений)", id: "desc" },
        { title: "Дата (w:120)", id: "date", width: 120 },
    ]));
    return (
        <WidthStoryShell cols={cols} onColumnResize={onColumnResize} description={
            <><b>Кейс: симуляция реальной таблицы (как в обёртке)</b>{"\n"}
            # и Дата — фиксированные (width =grow: 0). Остальные auto (grow: 1).{"\n"}
            Имя: min 150, auto до 300. Статус: auto до 100, ресайз до 200.{"\n"}
            Описание: без ограничений, колонка-поглотитель.{"\n"}
            Ожидание: Имя=300, Статус=100, Описание забирает остаток.{"\n"}
            Ресайз: Имя можно сузить до 150 или расширить шире 300. Статус до 200 макс.</>
        } />
    );
}
CW_RealTableSimulation.decorators = [];

// 10. Разные веса grow + caps
export function CW_DifferentGrowWeights() {
    const { cols, onColumnResize } = useResizableCols([
        { title: "ID (w:80)", id: "id", width: 80, grow: 0 },
        { title: "Title (maxAuto:300, grow:3)", id: "title", maxAutoWidth: 300, grow: 3 },
        { title: "Priority (maxAuto:150, grow:1)", id: "priority", maxAutoWidth: 150, grow: 1 },
        { title: "Type (grow:2)", id: "type", grow: 2 },
        { title: "Complete (w:120)", id: "complete", width: 120, grow: 0 },
    ]);
    return (
        <WidthStoryShell cols={cols} onColumnResize={onColumnResize} description={
            <><b>Кейс: разные веса grow (3, 1, 2)</b>{"\n"}
            Title grow:3, Priority grow:1, Type grow:2. Свободное место ~1300px.{"\n"}
            Title хочет 650px (3/6), но cap=300 =получает 300. Остаток перераспределяется.{"\n"}
            Priority хочет ~217px (1/6), но cap=150 =получает 150.{"\n"}
            Type без cap =забирает весь остаток (~850px).</>
        } />
    );
}
CW_DifferentGrowWeights.decorators = [];

// 11. Узкий контейнер
export function CW_NarrowContainer() {
    const { cols, onColumnResize } = useResizableCols(withAdaptedGrow([
        { title: "ID (w:200)", id: "id", width: 200 },
        { title: "Title (w:400)", id: "title", width: 400 },
        { title: "Priority (w:300)", id: "priority", width: 300 },
        { title: "Type (w:350)", id: "type", width: 350 },
        { title: "Complete (w:250)", id: "complete", width: 250 },
    ]));
    return (
        <WidthStoryShell cols={cols} onColumnResize={onColumnResize} width={800} description={
            <><b>Кейс: колонки шире контейнера (800px)</b>{"\n"}
            Все с width (grow: 0). Сумма 1500px шире 800px контейнера.{"\n"}
            Ожидание: горизонтальный скролл, колонки на своих ширинах.{"\n"}
            grow не работает (нет свободного места). Ресайз нормальный.</>
        } />
    );
}
CW_NarrowContainer.decorators = [];
