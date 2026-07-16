# План: rowspan для ГРУППОВЫХ ячеек шапки (spanShallowGroups)

Статус: **УТВЕРЖДЁН, готов к реализации.** Согласован API (per-group + grid-level) и
полный набор corner-кейсов как definition of done. Реализуем отдельным PR после
листового `spanGroupHeader` (уже в `feat/span-group-header`). Кода ещё нет.

---

## Что уже сделано (контекст — листовой `spanGroupHeader`)

Реализован флаг **`spanGroupHeader?: boolean`** на колонке (`BaseGridColumn`) —
«слитная шапка» для **листовой** колонки БЕЗ группы: её заголовок рисуется как одна
ячейка на всю высоту шапки (все групп-строки + строка колонки), с центрированием и
без разделительных линий поперёк. Точки правок (референс для группового аналога):
- `render/data-grid-render.header.ts` — `drawGridHeaders` (лист на всю высоту),
  `drawGroupLevel` (пропуск групп-ячейки над слитым листом, флаг `allSpanned`
  на строках 449-462), `drawGroups` (`segmentSpanGroupHeaderLine` — разрез линии).
- `render/data-grid-lib.ts` — `useMappedColumns` (проброс+нормализация флага, стр. 34-38),
  `computeBounds` (bounds на всю высоту при `row===-1`, стр. 860-867).
- `data-grid.tsx` — `getMouseArgsForPosition` (верх слитой = header `-1`, стр. 588-600).
- `render/data-grid-render.ts` — `clipHeaderDamage` (клип hover на всю высоту, стр. 40, 93).

---

## Задача: rowspan ГРУППЫ (не листа)

При многоуровневой шапке группа меньшей глубины оставляет под собой **пустую групп-строку**.

Пример (стори `Tests/SpanGroupHeader → SGH Scroll Frozen`): группа «Коэффициент
результативности» — одноуровневая (`group: "…"`), рядом группы `["2024","Q1"]` — двухуровневые,
поэтому шапка в 2 групп-ряда:

```
│ Коэффициент результативности │   ← level 0: заполнен
│           (пусто)            │   ← level 1: getGroupAtLevel(..., 1) === ""  ← ХОТИМ слить с level 0
│ Индивид │ Коллект │ Оценка   │   ← строка колонок (НЕ трогаем)
```

**Хотим:** групп-ячейка «Коэффициент результативности» занимает level 0 + level 1
(rowspan) как единая ячейка по центру над своими подколонками, но **НЕ** строку колонок.

Причина пустоты (точное место): высота шапки = `getGroupLevels` (макс. глубина групп);
`drawGroups` (`render/data-grid-render.header.ts:264`) идёт циклом по уровням, а
`getGroupAtLevel(group, level)` (`render/data-grid-render.walk.ts:126`) для одноуровневой
группы на level 1 возвращает `""` → рисуется пустая ячейка (`drawGroupHeaderInner`: заливка
есть, текст под guard `groupName !== ""`).

Отличие от листового `spanGroupHeader`:
- Лист (без группы) → спан на ВСЮ высоту (группы + строка колонки).
- Группа → спан только своих ПУСТЫХ нижних групп-уровней, **остановка над строкой колонок**.

---

## 1. Утверждённый API — симметрично листовому

Opt-in, аддитивный, off = поведение байт-в-байт прежнее. Два уровня (оба делаем):

- **Per-group (точечно, аналог флага на листе)** — через `getGroupDetails`:
  ```ts
  getGroupDetails={name => ({ name, span: true })}   // эта группа сливает пустые ряды под собой
  ```
  Новое поле `span?: boolean` в `GroupDetails`.
- **Grid-level (удобство «включил и забыл»)** — проп `DataEditor`:
  ```ts
  <DataEditor spanShallowGroups />                   // ВСЕ мелкие группы авто-сливают пустые ряды
  ```
- **Приоритет:** эффективный span группы = `getGroupDetails(name).span` если задан,
  иначе `spanShallowGroups`. То есть `span: false` точечно **отключает** авто для группы.

Единая ментальная модель для пользователя: *«ячейка шапки забирает пустые ряды под собой»* —
лист забирает групп-ряды над колонкой, группа забирает пустые групп-ряды под собой.

---

## 2. Definition of Done — corner-кейсы

Всё за opt-in. **Ragged-guard:** сливаем группу на level L вниз ТОЛЬКО если у ВСЕХ колонок её
span нет группы глубже L (`getGroupAtLevel(col.group, L+1) === ""` для всех). Иначе — рисуем
как сейчас (без спана).

**Рендер:**
- [ ] Спан на несколько пустых рядов (шапка глубиной 3+, группа на level 0 с 2 пустыми рядами).
- [ ] Вложенность: мелкая группа на level 1 сливает только внутри своего поддерева.
- [ ] Разрез межуровневых линий под слитой группой — пер-уровнево, на её x-диапазоне (`segmentSpanGroupHeaderLine`).
- [ ] Вертикальные границы на краях спана целые.
- [ ] `drawGroupHeaderCallback` (кастомный рендер) — rect слитой высоты.
- [ ] `overrideTheme` заливка — на слитую высоту.
- [ ] Frozen/sticky + горизонтальный скролл (translateX/clipX): слитая группа не «едет».
- [ ] Low-DPR hairline линии.

**Hover:**
- [ ] Наведение в любую точку слитой ячейки подсвечивает её целиком (не отдельно верх и пустой ряд).
- [ ] Клип hover-damage на слитую высоту (групп-аналог `clipHeaderDamage`).

**Клики / хит-тест:**
- [ ] Клик в любую точку слитой ячейки → групп-ряд `-2-L`, а не пустой под-уровень.
- [ ] Выделение всей группы, меню и `actions` срабатывают из любой точки слитой ячейки.

**Ресайз / drag:**
- [ ] Ресайз колонок (ручки на строке колонок) не перехватывается слитой ячейкой.
- [ ] Drag-reorder колонок/групп не ломается изменённой геометрией.
- [ ] Пересчёт слитой высоты при массиве `groupHeaderHeight` (разные высоты рядов).

**Выделение / rename / damage:**
- [ ] Highlight выделенной группы — на слитую высоту (рамка/заливка).
- [ ] Overlay инпута `onGroupHeaderRenamed` (`group-rename.tsx`) — по слитому прямоугольнику.
- [ ] Частичная перерисовка (damage) слитой области перерисовывает её целиком, без полос.

**Вырожденные:**
- [ ] Шапка в 1 групп-ряд → пустых рядов нет → фича no-op.
- [ ] Группа с пустым именем на level 0 — no-op.
- [ ] Соседство со слитыми листовыми колонками (`spanGroupHeader`).
- [ ] RTL: v1 — LTR-only, зафиксировать в JSDoc (как у листа).

---

## 3. Алгоритм рендера

Ядро — обобщение уже написанного листового `allSpanned`-скипа на группы.

1. В `drawGroups` до отрисовки уровней собрать **spanned-группы**: обход `walkGroups` по
   уровням сверху вниз; для каждой (level L, span S) вычислить `effectiveSpan(S,L)` (API §1)
   И ragged-guard (все колонки S пусты на L+1…levels-1). Если да — запомнить регион
   `{ level: L, colStart, colEnd, mergedHeight = sum(heights[L..levels-1]) }`.
2. `drawGroupLevel(level=L)`: для spanned-региона рисуем ячейку высотой `mergedHeight`
   (вместо `heights[L]`), контент центрируем по слитой высоте.
3. `drawGroupLevel(level>L)`: колонки, покрытые spanned-регионом сверху, **пропускаем**
   (предикат `coveredBySpanAbove(col, level)` — прямой аналог `allSpanned`, стр. 449-462).
4. Межуровневые линии (`strokeHBorderSegmented`): под slитой группой линию, которую её
   merge пересекает, режем на x-диапазоне региона (добавить регионы групп в `spannedRanges`
   пер-уровнево, не только листовые full-height).

---

## 4. Точки правок (групп-аналоги листовых фиксов)

- **`render/data-grid-render.header.ts`** — `drawGroups`/`drawGroupLevel`/`drawGroupHeaderInner`:
  сбор spanned-регионов, отрисовка на `mergedHeight`, скип покрытых колонок, сегментация линий,
  rect слитой высоты для `drawGroupHeaderCallback`/actions/rename-заливки.
- **`render/data-grid-render.walk.ts`** — при необходимости хелпер «глубина группы в span» для
  ragged-guard (рядом с `getGroupAtLevel`/`getGroupLevels`).
- **`data-grid.tsx`** `getMouseArgsForPosition` (стр. ~588): расширить листовую нормализацию —
  если попали в уровень, покрытый spanned-группой сверху, ремапим `row` в уровень этой группы
  (`-2 - L`).
- **`render/data-grid-lib.ts`** `computeBounds` (ветка `row <= -2`, стр. 869-879): для spanned-группы
  вернуть `y = yOffset(L)`, `height = mergedHeight` (сейчас — высота одного уровня).
- **`render/data-grid-render.ts`** `clipHeaderDamage`: групп-аналог full-height клипа для
  spanned-группы (сейчас full-height клип есть только для листа на `[col,-1]`, стр. 93).
- **`internal/data-grid/data-grid-types.ts`** — поле `span?: boolean` в `GroupDetails`;
  проп `spanShallowGroups?: boolean` в типах `DataEditor`/`DataGrid` + проброс.
- **`group-rename.tsx`** (если затрагивается) — позиционирование overlay по слитой высоте.

---

## 5. Тесты и стори

- Юнит: сегментация линий пер-уровнево; `computeBounds` слитой группы (y/height); ragged-guard
  (при вложенной подгруппе спана НЕТ); no-op при 1 уровне. Файлы рядом с
  `data-grid-render.span-group-header.test.ts` / `data-grid-lib.span-group-header.test.ts`.
- Интеграционные (`data-grid.test.tsx`): hit-test/hover ремап в спан-группу, выделение группы
  из нижней зоны слитой ячейки.
- Стори в `stories/span-group-header/` (namespace `Tests/SpanGroupHeader`): базовый спан-группа
  (SGH Scroll Frozen как эталон «до»), 3-уровневая шапка, ragged (часть колонок с подгруппой —
  НЕ сливается), группа с actions/rename на слитой высоте.

---

## 6. Риск и порядок

Основной багоёмкий фактор — НЕ сам rowspan, а **rename / actions / selection / overrideTheme**
групп на изменённой высоте (у листьев этого нет). Оценка: в 2–3× объёмнее листовой фичи.

- Сначала мёржим листовой `spanGroupHeader` (ветка `feat/span-group-header`), затем group-rowspan
  отдельным PR — не смешивать риск.
- Трогаем те же файлы рендера шапки, что и **открытый PR #13 (unstickyHeader)** — координировать
  порядок мёржа с Рамилём.

---

## Переиспользуемое из листовой фичи
- `segmentSpanGroupHeaderLine(width, gaps)` — разрез горизонтальной линии по x-диапазонам.
- Паттерн Task IV: нормализация хит-теста + bounds на слитую высоту + клип на слитую высоту
  (`getMouseArgsForPosition` / `computeBounds` / `clipHeaderDamage`).
- Приём `allSpanned`-скипа покрытых колонок (`drawGroupLevel`, стр. 449-462) — обобщаем на группы.
- Принцип: всё за opt-in флагом, при отсутствии — поведение байт-в-байт прежнее.
