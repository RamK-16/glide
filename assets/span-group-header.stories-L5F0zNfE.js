import{r as e}from"./iframe-CCFyhr2K.js";import{B as Ie}from"./story-utils-EeBHTqU3.js";import{a as i,G as be}from"./image-window-loader-3p_kN3tD.js";import{D as _e}from"./data-editor-all-C7iaiwzr.js";import"./preload-helper-C1FmrZbK.js";import"./marked.esm-D-vAQWC9.js";import"./throttle-CzAv8FgA.js";import"./flatten-Cxjk6ZZe.js";import"./scrolling-data-grid-5RwFjg2t.js";const Fe={title:"Tests/SpanGroupHeader",decorators:[t=>e.createElement(Ie,{width:1500,height:640},e.createElement(t,null))]},n="Коэффициент результативности";function o({cols:t,description:r,groupHeaderHeight:ge=34,freezeColumns:Ge,getGroupDetails:me,spanShallowGroups:He,spanAlign:we,spanGroupHeader:Se,onGroupHeaderRenamed:Qe,width:f=1500,height:A=640}){const fe=e.useCallback(([I,b])=>{var _;const Q=((_=t[I])==null?void 0:_.title)??`C${I}`,Ae=Q.length>8?`${Q.slice(0,8)}…`:Q;return{kind:be.Text,displayData:`${Ae} ${b}`,data:`${Q} ${b}`,allowOverlay:!1,readonly:!0}},[t]);return e.createElement("div",{style:{width:f,height:A}},e.createElement("div",{style:{marginBottom:8,fontFamily:"monospace",fontSize:13,lineHeight:1.5,whiteSpace:"pre-wrap"}},r),e.createElement(_e,{width:f,height:A-140,getCellContent:fe,getCellsForSelection:!0,columns:t,rows:200,rowMarkers:"both",groupHeaderHeight:ge,freezeColumns:Ge,getGroupDetails:me,spanShallowGroups:He,spanAlign:we,spanGroupHeader:Se,onGroupHeaderRenamed:Qe}))}function a(){const t=[{title:"Краткое название роли",width:200,spanGroupHeader:!0},{title:"Период",width:150,spanGroupHeader:!0},{title:"Индивидуальные",width:150,group:n},{title:"Коллективные",width:150,group:n},{title:"Оценка",width:150,group:n},{title:"Продажи",width:150,spanGroupHeader:!0},{title:"Доплаты",width:150,spanGroupHeader:!0},{title:"Выплаты премий",width:160,spanGroupHeader:!0}];return e.createElement(o,{cols:t,description:e.createElement(e.Fragment,null,e.createElement("b",null,"ЛИСТОВАЯ фича (spanGroupHeader на колонке БЕЗ группы) — одиночные колонки рядом с группой"),`
`,'Колонки: «Краткое название роли», «Период», «Продажи», «Доплаты», «Выплаты премий» — spanGroupHeader: true, у них НЕТ группы. «Индивидуальные / Коллективные / Оценка» — обычная группа "',n,'" (spanGroupHeader к группам не применяется).',`
`,`
`,"✅ СЛИТЫ (одна ячейка на всю высоту шапки, заголовок по центру, без пустой полосы сверху, без горизонтального шва): Роль, Период, Продажи, Доплаты, Выплаты премий.",`
`,'✅ НЕ слита (обычная группа): "',n,'" — «',n,"» в верхнем ряду, три подколонки снизу. Это ожидаемо: листовая фича группы НЕ трогает (для слияния группы см. SGH_GroupSpan).")})}a.decorators=[];function l(){const t=[{title:"Краткое название роли",width:200},{title:"Период",width:150,spanGroupHeader:!1},{title:"Индивидуальные",width:150,group:n},{title:"Коллективные",width:150,group:n},{title:"Оценка",width:150,group:n},{title:"Продажи",width:150},{title:"Доплаты",width:150},{title:"Выплаты премий",width:160}];return e.createElement(o,{cols:t,spanGroupHeader:!0,description:e.createElement(e.Fragment,null,e.createElement("b",null,"ЛИСТОВАЯ фича через GRID-проп `spanGroupHeader` (без флага на каждой колонке)"),`
`,"На таблице стоит только `spanGroupHeader`. Он включает слияние у ВСЕХ листовых колонок (без группы) сразу: «Краткое название роли», «Продажи», «Доплаты», «Выплаты премий» — слиты автоматически.",`
`,`
`,"✅ Результат совпадает с SGH_Basic, но флаг не повторяется на колонках.",`
`,"✅ Точечный опт-аут: у «Период» стоит `spanGroupHeader: false` — эта колонка НЕ слита (значение колонки важнее grid-дефолта).",`
`,'✅ Группа "',n,'" проп НЕ трогает (у её колонок есть group) — обычная группа с подколонками.')})}l.decorators=[];function p(){const t=[{title:"Роль",width:180},{title:"Период",width:150},{title:"Индивидуальные",width:150,group:n},{title:"Коллективные",width:150,group:n},{title:"Оценка",width:150,group:n},{title:"Итого",width:150}];return e.createElement(o,{cols:t,spanGroupHeader:!0,description:e.createElement(e.Fragment,null,e.createElement("b",null,"GRID-дефолт `spanGroupHeader` БЕЗ опт-аутов — визуальный страж"),`
`,'На таблице только проп `spanGroupHeader`, ни на одной колонке флага нет. Все листовые колонки (Роль, Период, Итого) слиты на всю высоту шапки; группа "',n,'" — обычная.',`
`,`
`,"⚠️ Если grid-проп перестанет доезжать до DataGrid через обёртки, ЗДЕСЬ это видно сразу: над Роль/Период/Итого появятся пустые ячейки (как в SGH_WithoutSpan_Before). Программный страж — тест «Grid-level spanGroupHeader merges leaf headers through the wrapper chain».")})}p.decorators=[];function u(){const t=[{title:"Краткое название роли",width:200},{title:"Период",width:150},{title:"Индивидуальные",width:150,group:n},{title:"Коллективные",width:150,group:n},{title:"Оценка",width:150,group:n},{title:"Продажи",width:150},{title:"Доплаты",width:150},{title:"Выплаты премий",width:160}];return e.createElement(o,{cols:t,description:e.createElement(e.Fragment,null,e.createElement("b",null,"ЭТАЛОН «КАК БЫЛО» (флаг spanGroupHeader НЕ задан нигде) — для сравнения с SGH_Basic"),`
`,"Тот же набор колонок, что в SGH_Basic, но НИ у одной колонки нет spanGroupHeader и ни у одной группы нет span. Намеренно ничего не сливается.",`
`,`
`,'❌ Что видно (проблема, которую чиним): у одиночных «Краткое название роли», «Период», «Продажи», «Доплаты», «Выплаты премий» — ПУСТАЯ ячейка сверху, заголовок ужат в нижний ряд. Группа "',n,'" — обычная.',`
`,"Открой рядом SGH_Basic — там те же одиночные колонки уже слиты.")})}u.decorators=[];function d(){const t=[{title:"ID",width:100,spanGroupHeader:!0},{title:"Q1-A",width:150,group:["2024","Q1"]},{title:"Q1-B",width:150,group:["2024","Q1"]},{title:"Q2-C",width:150,group:["2024","Q2"]},{title:"Q2-D",width:150,group:["2024","Q2"]},{title:"Итого",width:150,spanGroupHeader:!0}];return e.createElement(o,{cols:t,groupHeaderHeight:[30,28],description:e.createElement(e.Fragment,null,e.createElement("b",null,"ЛИСТОВАЯ фича в ТРЁХрядной шапке (2 групп-ряда: 2024 → Q1/Q2)"),`
`,"Колонки: «ID» (слева) и «Итого» (справа) — spanGroupHeader: true, без группы. «Q1-A / Q1-B» — группа [2024, Q1]; «Q2-C / Q2-D» — группа [2024, Q2]. Высота шапки = 3 ряда (2 групп-ряда + ряд колонок).",`
`,`
`,"✅ СЛИТЫ на ВСЕ 3 ряда одной ячейкой: ID и Итого — ни одна из двух межуровневых линий их не пересекает.",`
`,"✅ НЕ слиты (обычные двухуровневые группы): 2024 → Q1/Q2 — «2024» в 1-м ряду, «Q1»/«Q2» во 2-м, подколонки в 3-м.")})}d.decorators=[];function s(){const t=[{title:"Роль",width:200,spanGroupHeader:!0,icon:i.HeaderString,hasMenu:!0},{title:"Индивидуальные",width:150,group:n,icon:i.HeaderNumber},{title:"Коллективные",width:150,group:n,icon:i.HeaderNumber},{title:"Итог",width:150,spanGroupHeader:!0,icon:i.HeaderNumber,hasMenu:!0}];return e.createElement(o,{cols:t,groupHeaderHeight:36,description:e.createElement(e.Fragment,null,e.createElement("b",null,"ЛИСТОВАЯ фича с кастомным контентом шапки (иконка + меню)"),`
`,'Колонки: «Роль» и «Итог» — spanGroupHeader: true + icon + hasMenu (без группы). «Индивидуальные / Коллективные» — обычная группа "',n,'".',`
`,`
`,"✅ СЛИТЫ Роль и Итог: иконка и «гамбургер»-меню центрированы по ВСЕЙ высоте слитой ячейки, а не прижаты к нижней полосе.",`
`,'✅ НЕ слита группа "',n,'" (обычная).')})}s.decorators=[];function c(){const t=[{title:"Лево-слит",width:150,spanGroupHeader:!0},{title:"A1",width:150,group:"Группа A"},{title:"A2",width:150,group:"Группа A"},{title:"Центр-слит",width:150,spanGroupHeader:!0},{title:"B1",width:150,group:"Группа B"},{title:"B2",width:150,group:"Группа B"},{title:"Право-слит",width:150,spanGroupHeader:!0}];return e.createElement(o,{cols:t,description:e.createElement(e.Fragment,null,e.createElement("b",null,"ЛИСТОВАЯ фича — слитые колонки слева / между группами / справа (сегментация линии)"),`
`,"Колонки: «Лево-слит», «Центр-слит», «Право-слит» — spanGroupHeader: true (без группы). Между ними — обычные группы «Группа A» (A1/A2) и «Группа B» (B1/B2).",`
`,`
`,"✅ СЛИТЫ 3 листовые колонки; межуровневая линия РАЗРЕЗАНА ровно по их границам (над слитой колонкой линии нет), вертикальные границы со стыками групп A/B — целые.",`
`,"✅ НЕ слиты группы A и B (обычные). Это стресс-тест краёв/середины и разреза линии.")})}c.decorators=[];function h(){const t=[{title:"Роль (frozen)",width:190,spanGroupHeader:!0},{title:"Период",width:150,spanGroupHeader:!0},{title:"Индивидуальные",width:150,group:n},{title:"Коллективные",width:150,group:n},{title:"Оценка",width:150,group:n},{title:"Продажи",width:150,spanGroupHeader:!0},{title:"Доплаты",width:150,spanGroupHeader:!0},{title:"Премии",width:150,spanGroupHeader:!0},{title:"Q1-A",width:150,group:["2024","Q1"]},{title:"Q1-B",width:150,group:["2024","Q1"]},{title:"Комментарий",width:220,spanGroupHeader:!0}];return e.createElement(o,{cols:t,groupHeaderHeight:[30,28],freezeColumns:1,description:e.createElement(e.Fragment,null,e.createElement("b",null,"ЛИСТОВАЯ фича + frozen + горизонтальный скролл (рисковая геометрия translateX / sticky)"),`
`,'Колонки: «Роль (frozen)», «Период», «Продажи», «Доплаты», «Премии», «Комментарий» — spanGroupHeader: true (лист). «Индивидуальные/Коллективные/Оценка» (группа "',n,'") и «Q1-A/Q1-B» (группа [2024, Q1]) — ОБЫЧНЫЕ группы, span у них НЕ включён.',`
`,`
`,"✅ СЛИТЫ листовые колонки на всю высоту; frozen «Роль» держит слитную шапку при прокрутке, разрез линии не «едет».",`
`,"⚠️ «",n,"» НАМЕРЕННО НЕ слит (обычная группа) → под «",n,"» видна пустая полоса. Это и есть «до» для ГРУППОВОЙ фичи. Слияние группы показано в SGH_GroupSpan (точечно) и SGH_ShallowAuto (авто).")})}h.decorators=[];function g(){const t=[{title:"Роль",width:180,spanGroupHeader:!0},{title:"Индивидуальные",width:150,group:n},{title:"Коллективные",width:150,group:n},{title:"Оценка",width:150,group:n},{title:"Q1-A",width:130,group:["2024","Q1"]},{title:"Q1-B",width:130,group:["2024","Q1"]},{title:"Q2-C",width:130,group:["2024","Q2"]}];return e.createElement(o,{cols:t,groupHeaderHeight:[30,28],getGroupDetails:r=>({name:r,span:r===n}),description:e.createElement(e.Fragment,null,e.createElement("b",null,"ГРУППОВАЯ фича (rowspan группы) — ТОЧЕЧНО через getGroupDetails().span = true"),`
`,'Колонки: «Роль» — spanGroupHeader (лист). «Индивидуальные/Коллективные/Оценка» — ОДНОуровневая группа "',n,'" (group: строка). «Q1-A/Q1-B» — [2024, Q1], «Q2-C» — [2024, Q2] (ДВУХуровневая). Шапка = 2 групп-ряда. span:true задан ТОЛЬКО группе "',n,'".',`
`,`
`,'✅ СЛИТА группа "',n,'": одноуровневая, поэтому её нижний групп-ряд (level 1) пустой — она занимает ОБА групп-ряда одной ячейкой по центру, без пустой полосы и шва; строку подколонок (Индивид/Коллект/Оценка) НЕ накрывает, дно есть.',`
`,"✅ НЕ слита «2024 → Q1/Q2» (двухуровневая, span не задан). «Роль» — лист, слит на всю высоту.",`
`,'🖱️ Наведи/кликни по слитой "',n,'" — ведёт себя как одна ячейка на всю высоту.')})}g.decorators=[];function G(){const t=[{title:"Роль",width:180,spanGroupHeader:!0},{title:"Индивидуальные",width:150,group:n},{title:"Коллективные",width:150,group:n},{title:"Оценка",width:150,group:n},{title:"План",width:130,group:"Продажи"},{title:"Факт",width:130,group:"Продажи"},{title:"Q1-A",width:130,group:["2024","Q1"]},{title:"Q1-B",width:130,group:["2024","Q1"]}];return e.createElement(o,{cols:t,groupHeaderHeight:[30,28],spanShallowGroups:!0,description:e.createElement(e.Fragment,null,e.createElement("b",null,"ГРУППОВАЯ фича — АВТО-режим (grid-проп spanShallowGroups, БЕЗ ручной разметки)"),`
`,'На таблице стоит только spanShallowGroups. Колонки: «Роль» — лист. МЕЛКИЕ (одноуровневые) группы: "',n,'" (Индивид/Коллект/Оценка) и «Продажи» (План/Факт). ГЛУБОКАЯ: [2024, Q1] (Q1-A/Q1-B). Шапка = 2 групп-ряда.',`
`,`
`,'✅ СЛИТЫ ОБЕ мелкие группы — "',n,'" И «Продажи» — автоматически, без единого getGroupDetails.',`
`,"✅ НЕ слита «2024 → Q1» (двухуровневая — не мелкая). «Роль» — лист, слит.",`
`,"Отличие от SGH_GroupSpan: там span включён руками у ОДНОЙ группы; здесь ВСЕ мелкие сливаются одним пропом (span:false у группы точечно отключил бы её из авто).")})}G.decorators=[];function m(){const t=[{title:"Роль",width:160,spanGroupHeader:!0},{title:"Индивидуальные",width:150,group:n},{title:"Коллективные",width:150,group:n},{title:"Оценка",width:150,group:n},{title:"Q1-A",width:130,group:["2024","Q1"]},{title:"Q1-B",width:130,group:["2024","Q1"]}];return e.createElement(o,{cols:t,groupHeaderHeight:[30,28],onGroupHeaderRenamed:()=>{},getGroupDetails:r=>r===n?{name:r,span:!0,overrideTheme:{bgGroupHeader:"#eaf1ff"},actions:[{title:"Настройки",icon:i.HeaderString,onClick:()=>{}}]}:{name:r},description:e.createElement(e.Fragment,null,e.createElement("b",null,"ГРУППОВАЯ фича — actions / rename / overrideTheme на СЛИТОЙ высоте (Task IV)"),`
`,'Колонки: «Роль» — лист. «Индивидуальные/Коллективные/Оценка» — группа "',n,'" со span:true + overrideTheme (голубая заливка) + action-иконка. onGroupHeaderRenamed включён → при наведении добавляется пункт Rename. «Q1-A/Q1-B» — [2024, Q1] (обычная).',`
`,`
`,'✅ Голубая заливка overrideTheme — на ВСЮ слитую высоту "',n,'" (не только верхний ряд).',`
`,"✅ При наведении иконки actions/rename — по центру слитой ячейки (не прижаты к верхней полосе).",`
`,"✅ Клик по rename → инпут-оверлей по merged-прямоугольнику (на всю слитую высоту).",`
`,"✅ НЕ слита «2024 → Q1» (обычная).")})}m.decorators=[];function H(){const t=[{title:"left·top",width:150,spanGroupHeader:!0,spanGroupHeaderAlign:{horizontal:"left",vertical:"top"}},{title:"center",width:150,spanGroupHeader:!0,spanGroupHeaderAlign:{horizontal:"center",vertical:"center"}},{title:"right·bottom",width:160,spanGroupHeader:!0,spanGroupHeaderAlign:{horizontal:"right",vertical:"bottom"}},{title:"center·top",width:150,spanGroupHeader:!0,spanGroupHeaderAlign:{horizontal:"center",vertical:"top"}},{title:"Q1-A",width:120,group:["2024","Q1"]},{title:"Q1-B",width:120,group:["2024","Q1"]}];return e.createElement(o,{cols:t,groupHeaderHeight:[38,38],description:e.createElement(e.Fragment,null,e.createElement("b",null,"ЛИСТ + выравнивание (spanGroupHeaderAlign)"),`
`,"Дефолт листа — left/center (обратная совместимость). Здесь заданы разные комбинации:",`
`,"«left·top», «center» (center/center), «right·bottom», «center·top».",`
`,`
`,"✅ Текст встаёт по заданным осям, с учётом отступов темы и иконки; высота слитой ячейки = 2 групп-ряда + строка колонки.")})}H.decorators=[];function w(){const t=[{title:"Индивидуальные",width:150,group:n},{title:"Коллективные",width:150,group:n},{title:"Оценка",width:150,group:n},{title:"Q1-A",width:120,group:["2024","Q1"]},{title:"Q1-B",width:120,group:["2024","Q1"]}];return e.createElement(o,{cols:t,groupHeaderHeight:[40,40],getGroupDetails:r=>r===n?{name:r,span:!0,spanAlign:{horizontal:"center",vertical:"top"}}:{name:r},description:e.createElement(e.Fragment,null,e.createElement("b",null,"ГРУППА + выравнивание (getGroupDetails().spanAlign)"),`
`,"«",n,"» — одноуровневая группа, сливает пустой нижний ряд (span) и прижимает заголовок"," ",e.createElement("b",null,"center/top"),". Дефолт для слитых групп — center; здесь дополнительно задан top по вертикали.",`
`,`
`,"✅ Заголовок группы по центру и сверху слитой (80px) ячейки. «2024 → Q1» — обычная двухуровневая, не сливается.")})}w.decorators=[];function S(){const t=[{title:"Роль",width:180,spanGroupHeader:!0},{title:"Индивидуальные",width:150,group:n},{title:"Коллективные",width:150,group:n},{title:"Оценка",width:150,group:n},{title:"Q1-A",width:120,group:["2024","Q1"]},{title:"Q1-B",width:120,group:["2024","Q1"]}];return e.createElement(o,{cols:t,groupHeaderHeight:[40,40],spanShallowGroups:!0,spanAlign:{horizontal:"center",vertical:"center"},getGroupDetails:r=>r===n?{name:r,spanAlign:{horizontal:"center",vertical:"bottom"}}:{name:r},description:e.createElement(e.Fragment,null,e.createElement("b",null,"GRID-ДЕФОЛТ (DataEditor spanAlign) + точечный override"),`
`,"Grid-дефолт: ",e.createElement("b",null,"center/center")," для всех слитых (лист «Роль» + слитые группы через spanShallowGroups).",`
`,"Группа «",n,"» точечно перекрывает вертикаль на ",e.createElement("b",null,"bottom")," (getGroupDetails().spanAlign).",`
`,`
`,"✅ «Роль» (лист) — center/center; «",n,"» — center/bottom; остальное — по grid-дефолту.")})}S.decorators=[];var B,K,P;a.parameters={...a.parameters,docs:{...(B=a.parameters)==null?void 0:B.docs,source:{originalSource:`function SGH_Basic() {
  const cols: GridColumn[] = [{
    title: "Краткое название роли",
    width: 200,
    spanGroupHeader: true
  }, {
    title: "Период",
    width: 150,
    spanGroupHeader: true
  }, {
    title: "Индивидуальные",
    width: 150,
    group: KPI
  }, {
    title: "Коллективные",
    width: 150,
    group: KPI
  }, {
    title: "Оценка",
    width: 150,
    group: KPI
  }, {
    title: "Продажи",
    width: 150,
    spanGroupHeader: true
  }, {
    title: "Доплаты",
    width: 150,
    spanGroupHeader: true
  }, {
    title: "Выплаты премий",
    width: 160,
    spanGroupHeader: true
  }];
  return <SpanStoryShell cols={cols} description={<>
                    <b>ЛИСТОВАЯ фича (spanGroupHeader на колонке БЕЗ группы) — одиночные колонки рядом с группой</b>
                    {"\\n"}
                    Колонки: «Краткое название роли», «Период», «Продажи», «Доплаты», «Выплаты премий» —
                    spanGroupHeader: true, у них НЕТ группы. «Индивидуальные / Коллективные / Оценка» — обычная группа "
                    {KPI}" (spanGroupHeader к группам не применяется).{"\\n"}
                    {"\\n"}
                    ✅ СЛИТЫ (одна ячейка на всю высоту шапки, заголовок по центру, без пустой полосы сверху, без
                    горизонтального шва): Роль, Период, Продажи, Доплаты, Выплаты премий.{"\\n"}✅ НЕ слита (обычная
                    группа): "{KPI}" — «{KPI}» в верхнем ряду, три подколонки снизу. Это ожидаемо: листовая фича группы
                    НЕ трогает (для слияния группы см. SGH_GroupSpan).
                </>} />;
}`,...(P=(K=a.parameters)==null?void 0:K.docs)==null?void 0:P.source}}};var E,D,C;l.parameters={...l.parameters,docs:{...(E=l.parameters)==null?void 0:E.docs,source:{originalSource:`function SGH_LeafGridDefault() {
  const cols: GridColumn[] = [{
    title: "Краткое название роли",
    width: 200
  },
  // флага нет → grid-дефолт слил
  {
    title: "Период",
    width: 150,
    spanGroupHeader: false
  },
  // точечный опт-аут → НЕ слито
  {
    title: "Индивидуальные",
    width: 150,
    group: KPI
  }, {
    title: "Коллективные",
    width: 150,
    group: KPI
  }, {
    title: "Оценка",
    width: 150,
    group: KPI
  }, {
    title: "Продажи",
    width: 150
  },
  // флага нет → grid-дефолт слил
  {
    title: "Доплаты",
    width: 150
  }, {
    title: "Выплаты премий",
    width: 160
  }];
  return <SpanStoryShell cols={cols} spanGroupHeader description={<>
                    <b>ЛИСТОВАЯ фича через GRID-проп \`spanGroupHeader\` (без флага на каждой колонке)</b>
                    {"\\n"}
                    На таблице стоит только \`spanGroupHeader\`. Он включает слияние у ВСЕХ листовых колонок (без
                    группы) сразу: «Краткое название роли», «Продажи», «Доплаты», «Выплаты премий» — слиты автоматически.
                    {"\\n"}
                    {"\\n"}✅ Результат совпадает с SGH_Basic, но флаг не повторяется на колонках.{"\\n"}✅ Точечный опт-аут:
                    у «Период» стоит \`spanGroupHeader: false\` — эта колонка НЕ слита (значение колонки важнее grid-дефолта).
                    {"\\n"}✅ Группа "{KPI}" проп НЕ трогает (у её колонок есть group) — обычная группа с подколонками.
                </>} />;
}`,...(C=(D=l.parameters)==null?void 0:D.docs)==null?void 0:C.source}}};var v,z,y;p.parameters={...p.parameters,docs:{...(v=p.parameters)==null?void 0:v.docs,source:{originalSource:`function SGH_GridDefaultAllLeaves() {
  const cols: GridColumn[] = [{
    title: "Роль",
    width: 180
  }, {
    title: "Период",
    width: 150
  }, {
    title: "Индивидуальные",
    width: 150,
    group: KPI
  }, {
    title: "Коллективные",
    width: 150,
    group: KPI
  }, {
    title: "Оценка",
    width: 150,
    group: KPI
  }, {
    title: "Итого",
    width: 150
  }];
  return <SpanStoryShell cols={cols} spanGroupHeader description={<>
                    <b>GRID-дефолт \`spanGroupHeader\` БЕЗ опт-аутов — визуальный страж</b>
                    {"\\n"}
                    На таблице только проп \`spanGroupHeader\`, ни на одной колонке флага нет. Все листовые колонки
                    (Роль, Период, Итого) слиты на всю высоту шапки; группа "{KPI}" — обычная.
                    {"\\n"}
                    {"\\n"}⚠️ Если grid-проп перестанет доезжать до DataGrid через обёртки, ЗДЕСЬ это видно сразу:
                    над Роль/Период/Итого появятся пустые ячейки (как в SGH_WithoutSpan_Before). Программный страж —
                    тест «Grid-level spanGroupHeader merges leaf headers through the wrapper chain».
                </>} />;
}`,...(y=(z=p.parameters)==null?void 0:z.docs)==null?void 0:y.source}}};var F,T,M;u.parameters={...u.parameters,docs:{...(F=u.parameters)==null?void 0:F.docs,source:{originalSource:`function SGH_WithoutSpan_Before() {
  const cols: GridColumn[] = [{
    title: "Краткое название роли",
    width: 200
  }, {
    title: "Период",
    width: 150
  }, {
    title: "Индивидуальные",
    width: 150,
    group: KPI
  }, {
    title: "Коллективные",
    width: 150,
    group: KPI
  }, {
    title: "Оценка",
    width: 150,
    group: KPI
  }, {
    title: "Продажи",
    width: 150
  }, {
    title: "Доплаты",
    width: 150
  }, {
    title: "Выплаты премий",
    width: 160
  }];
  return <SpanStoryShell cols={cols} description={<>
                    <b>ЭТАЛОН «КАК БЫЛО» (флаг spanGroupHeader НЕ задан нигде) — для сравнения с SGH_Basic</b>
                    {"\\n"}
                    Тот же набор колонок, что в SGH_Basic, но НИ у одной колонки нет spanGroupHeader и ни у одной группы
                    нет span. Намеренно ничего не сливается.{"\\n"}
                    {"\\n"}
                    ❌ Что видно (проблема, которую чиним): у одиночных «Краткое название роли», «Период», «Продажи»,
                    «Доплаты», «Выплаты премий» — ПУСТАЯ ячейка сверху, заголовок ужат в нижний ряд. Группа "{KPI}" —
                    обычная.{"\\n"}
                    Открой рядом SGH_Basic — там те же одиночные колонки уже слиты.
                </>} />;
}`,...(M=(T=u.parameters)==null?void 0:T.docs)==null?void 0:M.source}}};var L,R,k;d.parameters={...d.parameters,docs:{...(L=d.parameters)==null?void 0:L.docs,source:{originalSource:`function SGH_MultiLevel() {
  const cols: GridColumn[] = [{
    title: "ID",
    width: 100,
    spanGroupHeader: true
  }, {
    title: "Q1-A",
    width: 150,
    group: ["2024", "Q1"]
  }, {
    title: "Q1-B",
    width: 150,
    group: ["2024", "Q1"]
  }, {
    title: "Q2-C",
    width: 150,
    group: ["2024", "Q2"]
  }, {
    title: "Q2-D",
    width: 150,
    group: ["2024", "Q2"]
  }, {
    title: "Итого",
    width: 150,
    spanGroupHeader: true
  }];
  return <SpanStoryShell cols={cols} groupHeaderHeight={[30, 28]} description={<>
                    <b>ЛИСТОВАЯ фича в ТРЁХрядной шапке (2 групп-ряда: 2024 → Q1/Q2)</b>
                    {"\\n"}
                    Колонки: «ID» (слева) и «Итого» (справа) — spanGroupHeader: true, без группы. «Q1-A / Q1-B» — группа
                    [2024, Q1]; «Q2-C / Q2-D» — группа [2024, Q2]. Высота шапки = 3 ряда (2 групп-ряда + ряд колонок).
                    {"\\n"}
                    {"\\n"}
                    ✅ СЛИТЫ на ВСЕ 3 ряда одной ячейкой: ID и Итого — ни одна из двух межуровневых линий их не
                    пересекает.{"\\n"}✅ НЕ слиты (обычные двухуровневые группы): 2024 → Q1/Q2 — «2024» в 1-м ряду,
                    «Q1»/«Q2» во 2-м, подколонки в 3-м.
                </>} />;
}`,...(k=(R=d.parameters)==null?void 0:R.docs)==null?void 0:k.source}}};var x,N,W;s.parameters={...s.parameters,docs:{...(x=s.parameters)==null?void 0:x.docs,source:{originalSource:`function SGH_CustomHeader() {
  const cols: GridColumn[] = [{
    title: "Роль",
    width: 200,
    spanGroupHeader: true,
    icon: GridColumnIcon.HeaderString,
    hasMenu: true
  }, {
    title: "Индивидуальные",
    width: 150,
    group: KPI,
    icon: GridColumnIcon.HeaderNumber
  }, {
    title: "Коллективные",
    width: 150,
    group: KPI,
    icon: GridColumnIcon.HeaderNumber
  }, {
    title: "Итог",
    width: 150,
    spanGroupHeader: true,
    icon: GridColumnIcon.HeaderNumber,
    hasMenu: true
  }];
  return <SpanStoryShell cols={cols} groupHeaderHeight={36} description={<>
                    <b>ЛИСТОВАЯ фича с кастомным контентом шапки (иконка + меню)</b>
                    {"\\n"}
                    Колонки: «Роль» и «Итог» — spanGroupHeader: true + icon + hasMenu (без группы). «Индивидуальные /
                    Коллективные» — обычная группа "{KPI}".{"\\n"}
                    {"\\n"}
                    ✅ СЛИТЫ Роль и Итог: иконка и «гамбургер»-меню центрированы по ВСЕЙ высоте слитой ячейки, а не
                    прижаты к нижней полосе.{"\\n"}✅ НЕ слита группа "{KPI}" (обычная).
                </>} />;
}`,...(W=(N=s.parameters)==null?void 0:N.docs)==null?void 0:W.source}}};var $,O,V;c.parameters={...c.parameters,docs:{...($=c.parameters)==null?void 0:$.docs,source:{originalSource:`function SGH_EdgesAndMiddle() {
  const cols: GridColumn[] = [{
    title: "Лево-слит",
    width: 150,
    spanGroupHeader: true
  }, {
    title: "A1",
    width: 150,
    group: "Группа A"
  }, {
    title: "A2",
    width: 150,
    group: "Группа A"
  }, {
    title: "Центр-слит",
    width: 150,
    spanGroupHeader: true
  }, {
    title: "B1",
    width: 150,
    group: "Группа B"
  }, {
    title: "B2",
    width: 150,
    group: "Группа B"
  }, {
    title: "Право-слит",
    width: 150,
    spanGroupHeader: true
  }];
  return <SpanStoryShell cols={cols} description={<>
                    <b>ЛИСТОВАЯ фича — слитые колонки слева / между группами / справа (сегментация линии)</b>
                    {"\\n"}
                    Колонки: «Лево-слит», «Центр-слит», «Право-слит» — spanGroupHeader: true (без группы). Между ними —
                    обычные группы «Группа A» (A1/A2) и «Группа B» (B1/B2).{"\\n"}
                    {"\\n"}
                    ✅ СЛИТЫ 3 листовые колонки; межуровневая линия РАЗРЕЗАНА ровно по их границам (над слитой колонкой
                    линии нет), вертикальные границы со стыками групп A/B — целые.{"\\n"}✅ НЕ слиты группы A и B
                    (обычные). Это стресс-тест краёв/середины и разреза линии.
                </>} />;
}`,...(V=(O=c.parameters)==null?void 0:O.docs)==null?void 0:V.source}}};var X,j,q;h.parameters={...h.parameters,docs:{...(X=h.parameters)==null?void 0:X.docs,source:{originalSource:`function SGH_ScrollFrozen() {
  const cols: GridColumn[] = [{
    title: "Роль (frozen)",
    width: 190,
    spanGroupHeader: true
  }, {
    title: "Период",
    width: 150,
    spanGroupHeader: true
  }, {
    title: "Индивидуальные",
    width: 150,
    group: KPI
  }, {
    title: "Коллективные",
    width: 150,
    group: KPI
  }, {
    title: "Оценка",
    width: 150,
    group: KPI
  }, {
    title: "Продажи",
    width: 150,
    spanGroupHeader: true
  }, {
    title: "Доплаты",
    width: 150,
    spanGroupHeader: true
  }, {
    title: "Премии",
    width: 150,
    spanGroupHeader: true
  }, {
    title: "Q1-A",
    width: 150,
    group: ["2024", "Q1"]
  }, {
    title: "Q1-B",
    width: 150,
    group: ["2024", "Q1"]
  }, {
    title: "Комментарий",
    width: 220,
    spanGroupHeader: true
  }];
  return <SpanStoryShell cols={cols} groupHeaderHeight={[30, 28]} freezeColumns={1} description={<>
                    <b>ЛИСТОВАЯ фича + frozen + горизонтальный скролл (рисковая геометрия translateX / sticky)</b>
                    {"\\n"}
                    Колонки: «Роль (frozen)», «Период», «Продажи», «Доплаты», «Премии», «Комментарий» — spanGroupHeader:
                    true (лист). «Индивидуальные/Коллективные/Оценка» (группа "{KPI}") и «Q1-A/Q1-B» (группа [2024, Q1]) —
                    ОБЫЧНЫЕ группы, span у них НЕ включён.{"\\n"}
                    {"\\n"}
                    ✅ СЛИТЫ листовые колонки на всю высоту; frozen «Роль» держит слитную шапку при прокрутке, разрез
                    линии не «едет».{"\\n"}⚠️ «{KPI}» НАМЕРЕННО НЕ слит (обычная группа) → под «{KPI}» видна пустая
                    полоса. Это и есть «до» для ГРУППОВОЙ фичи. Слияние группы показано в SGH_GroupSpan (точечно) и
                    SGH_ShallowAuto (авто).
                </>} />;
}`,...(q=(j=h.parameters)==null?void 0:j.docs)==null?void 0:q.source}}};var J,U,Y;g.parameters={...g.parameters,docs:{...(J=g.parameters)==null?void 0:J.docs,source:{originalSource:`function SGH_GroupSpan() {
  const cols: GridColumn[] = [{
    title: "Роль",
    width: 180,
    spanGroupHeader: true
  }, {
    title: "Индивидуальные",
    width: 150,
    group: KPI
  }, {
    title: "Коллективные",
    width: 150,
    group: KPI
  }, {
    title: "Оценка",
    width: 150,
    group: KPI
  }, {
    title: "Q1-A",
    width: 130,
    group: ["2024", "Q1"]
  }, {
    title: "Q1-B",
    width: 130,
    group: ["2024", "Q1"]
  }, {
    title: "Q2-C",
    width: 130,
    group: ["2024", "Q2"]
  }];
  return <SpanStoryShell cols={cols} groupHeaderHeight={[30, 28]} getGroupDetails={name => ({
    name,
    span: name === KPI
  })} description={<>
                    <b>ГРУППОВАЯ фича (rowspan группы) — ТОЧЕЧНО через getGroupDetails().span = true</b>
                    {"\\n"}
                    Колонки: «Роль» — spanGroupHeader (лист). «Индивидуальные/Коллективные/Оценка» — ОДНОуровневая группа
                    "{KPI}" (group: строка). «Q1-A/Q1-B» — [2024, Q1], «Q2-C» — [2024, Q2] (ДВУХуровневая). Шапка = 2
                    групп-ряда. span:true задан ТОЛЬКО группе "{KPI}".{"\\n"}
                    {"\\n"}
                    ✅ СЛИТА группа "{KPI}": одноуровневая, поэтому её нижний групп-ряд (level 1) пустой — она занимает ОБА
                    групп-ряда одной ячейкой по центру, без пустой полосы и шва; строку подколонок (Индивид/Коллект/Оценка)
                    НЕ накрывает, дно есть.{"\\n"}✅ НЕ слита «2024 → Q1/Q2» (двухуровневая, span не задан). «Роль» — лист,
                    слит на всю высоту.{"\\n"}🖱️ Наведи/кликни по слитой "{KPI}" — ведёт себя как одна ячейка на всю высоту.
                </>} />;
}`,...(Y=(U=g.parameters)==null?void 0:U.docs)==null?void 0:Y.source}}};var Z,ee,ne;G.parameters={...G.parameters,docs:{...(Z=G.parameters)==null?void 0:Z.docs,source:{originalSource:`function SGH_ShallowAuto() {
  const cols: GridColumn[] = [{
    title: "Роль",
    width: 180,
    spanGroupHeader: true
  }, {
    title: "Индивидуальные",
    width: 150,
    group: KPI
  }, {
    title: "Коллективные",
    width: 150,
    group: KPI
  }, {
    title: "Оценка",
    width: 150,
    group: KPI
  }, {
    title: "План",
    width: 130,
    group: "Продажи"
  }, {
    title: "Факт",
    width: 130,
    group: "Продажи"
  }, {
    title: "Q1-A",
    width: 130,
    group: ["2024", "Q1"]
  }, {
    title: "Q1-B",
    width: 130,
    group: ["2024", "Q1"]
  }];
  return <SpanStoryShell cols={cols} groupHeaderHeight={[30, 28]} spanShallowGroups description={<>
                    <b>ГРУППОВАЯ фича — АВТО-режим (grid-проп spanShallowGroups, БЕЗ ручной разметки)</b>
                    {"\\n"}
                    На таблице стоит только spanShallowGroups. Колонки: «Роль» — лист. МЕЛКИЕ (одноуровневые) группы:
                    "{KPI}" (Индивид/Коллект/Оценка) и «Продажи» (План/Факт). ГЛУБОКАЯ: [2024, Q1] (Q1-A/Q1-B). Шапка = 2
                    групп-ряда.{"\\n"}
                    {"\\n"}
                    ✅ СЛИТЫ ОБЕ мелкие группы — "{KPI}" И «Продажи» — автоматически, без единого getGroupDetails.{"\\n"}✅
                    НЕ слита «2024 → Q1» (двухуровневая — не мелкая). «Роль» — лист, слит.{"\\n"}
                    Отличие от SGH_GroupSpan: там span включён руками у ОДНОЙ группы; здесь ВСЕ мелкие сливаются одним
                    пропом (span:false у группы точечно отключил бы её из авто).
                </>} />;
}`,...(ne=(ee=G.parameters)==null?void 0:ee.docs)==null?void 0:ne.source}}};var te,re,oe;m.parameters={...m.parameters,docs:{...(te=m.parameters)==null?void 0:te.docs,source:{originalSource:`function SGH_GroupActionsTheme() {
  const cols: GridColumn[] = [{
    title: "Роль",
    width: 160,
    spanGroupHeader: true
  }, {
    title: "Индивидуальные",
    width: 150,
    group: KPI
  }, {
    title: "Коллективные",
    width: 150,
    group: KPI
  }, {
    title: "Оценка",
    width: 150,
    group: KPI
  }, {
    title: "Q1-A",
    width: 130,
    group: ["2024", "Q1"]
  }, {
    title: "Q1-B",
    width: 130,
    group: ["2024", "Q1"]
  }];
  return <SpanStoryShell cols={cols} groupHeaderHeight={[30, 28]} onGroupHeaderRenamed={() => undefined} getGroupDetails={name => name === KPI ? {
    name,
    span: true,
    overrideTheme: {
      bgGroupHeader: "#eaf1ff"
    },
    actions: [{
      title: "Настройки",
      icon: GridColumnIcon.HeaderString,
      onClick: () => undefined
    }]
  } : {
    name
  }} description={<>
                    <b>ГРУППОВАЯ фича — actions / rename / overrideTheme на СЛИТОЙ высоте (Task IV)</b>
                    {"\\n"}
                    Колонки: «Роль» — лист. «Индивидуальные/Коллективные/Оценка» — группа "{KPI}" со span:true +
                    overrideTheme (голубая заливка) + action-иконка. onGroupHeaderRenamed включён → при наведении
                    добавляется пункт Rename. «Q1-A/Q1-B» — [2024, Q1] (обычная).{"\\n"}
                    {"\\n"}
                    ✅ Голубая заливка overrideTheme — на ВСЮ слитую высоту "{KPI}" (не только верхний ряд).{"\\n"}✅ При
                    наведении иконки actions/rename — по центру слитой ячейки (не прижаты к верхней полосе).{"\\n"}✅ Клик
                    по rename → инпут-оверлей по merged-прямоугольнику (на всю слитую высоту).{"\\n"}✅ НЕ слита «2024 →
                    Q1» (обычная).
                </>} />;
}`,...(oe=(re=m.parameters)==null?void 0:re.docs)==null?void 0:oe.source}}};var ie,ae,le;H.parameters={...H.parameters,docs:{...(ie=H.parameters)==null?void 0:ie.docs,source:{originalSource:`function SGH_LeafAlign() {
  const cols: GridColumn[] = [{
    title: "left·top",
    width: 150,
    spanGroupHeader: true,
    spanGroupHeaderAlign: {
      horizontal: "left",
      vertical: "top"
    }
  }, {
    title: "center",
    width: 150,
    spanGroupHeader: true,
    spanGroupHeaderAlign: {
      horizontal: "center",
      vertical: "center"
    }
  }, {
    title: "right·bottom",
    width: 160,
    spanGroupHeader: true,
    spanGroupHeaderAlign: {
      horizontal: "right",
      vertical: "bottom"
    }
  }, {
    title: "center·top",
    width: 150,
    spanGroupHeader: true,
    spanGroupHeaderAlign: {
      horizontal: "center",
      vertical: "top"
    }
  }, {
    title: "Q1-A",
    width: 120,
    group: ["2024", "Q1"]
  }, {
    title: "Q1-B",
    width: 120,
    group: ["2024", "Q1"]
  }];
  return <SpanStoryShell cols={cols} groupHeaderHeight={[38, 38]} description={<>
                    <b>ЛИСТ + выравнивание (spanGroupHeaderAlign)</b>
                    {"\\n"}
                    Дефолт листа — left/center (обратная совместимость). Здесь заданы разные комбинации:{"\\n"}«left·top»,
                    «center» (center/center), «right·bottom», «center·top».{"\\n"}
                    {"\\n"}✅ Текст встаёт по заданным осям, с учётом отступов темы и иконки;
                    высота слитой ячейки = 2 групп-ряда + строка колонки.
                </>} />;
}`,...(le=(ae=H.parameters)==null?void 0:ae.docs)==null?void 0:le.source}}};var pe,ue,de;w.parameters={...w.parameters,docs:{...(pe=w.parameters)==null?void 0:pe.docs,source:{originalSource:`function SGH_GroupAlign() {
  const cols: GridColumn[] = [{
    title: "Индивидуальные",
    width: 150,
    group: KPI
  }, {
    title: "Коллективные",
    width: 150,
    group: KPI
  }, {
    title: "Оценка",
    width: 150,
    group: KPI
  }, {
    title: "Q1-A",
    width: 120,
    group: ["2024", "Q1"]
  }, {
    title: "Q1-B",
    width: 120,
    group: ["2024", "Q1"]
  }];
  return <SpanStoryShell cols={cols} groupHeaderHeight={[40, 40]} getGroupDetails={name => name === KPI ? {
    name,
    span: true,
    spanAlign: {
      horizontal: "center",
      vertical: "top"
    }
  } : {
    name
  }} description={<>
                    <b>ГРУППА + выравнивание (getGroupDetails().spanAlign)</b>
                    {"\\n"}«{KPI}» — одноуровневая группа, сливает пустой нижний ряд (span) и прижимает заголовок{" "}
                    <b>center/top</b>. Дефолт для слитых групп — center; здесь дополнительно задан top по вертикали.{"\\n"}
                    {"\\n"}✅ Заголовок группы по центру и сверху слитой (80px) ячейки. «2024 → Q1» — обычная
                    двухуровневая, не сливается.
                </>} />;
}`,...(de=(ue=w.parameters)==null?void 0:ue.docs)==null?void 0:de.source}}};var se,ce,he;S.parameters={...S.parameters,docs:{...(se=S.parameters)==null?void 0:se.docs,source:{originalSource:`function SGH_AlignGridDefault() {
  const cols: GridColumn[] = [{
    title: "Роль",
    width: 180,
    spanGroupHeader: true
  }, {
    title: "Индивидуальные",
    width: 150,
    group: KPI
  }, {
    title: "Коллективные",
    width: 150,
    group: KPI
  }, {
    title: "Оценка",
    width: 150,
    group: KPI
  }, {
    title: "Q1-A",
    width: 120,
    group: ["2024", "Q1"]
  }, {
    title: "Q1-B",
    width: 120,
    group: ["2024", "Q1"]
  }];
  return <SpanStoryShell cols={cols} groupHeaderHeight={[40, 40]} spanShallowGroups spanAlign={{
    horizontal: "center",
    vertical: "center"
  }} getGroupDetails={name => name === KPI ? {
    name,
    spanAlign: {
      horizontal: "center",
      vertical: "bottom"
    }
  } : {
    name
  }} description={<>
                    <b>GRID-ДЕФОЛТ (DataEditor spanAlign) + точечный override</b>
                    {"\\n"}
                    Grid-дефолт: <b>center/center</b> для всех слитых (лист «Роль» + слитые группы через
                    spanShallowGroups).{"\\n"}
                    Группа «{KPI}» точечно перекрывает вертикаль на <b>bottom</b> (getGroupDetails().spanAlign).{"\\n"}
                    {"\\n"}✅ «Роль» (лист) — center/center; «{KPI}» — center/bottom; остальное — по grid-дефолту.
                </>} />;
}`,...(he=(ce=S.parameters)==null?void 0:ce.docs)==null?void 0:he.source}}};const Te=["SGH_Basic","SGH_LeafGridDefault","SGH_GridDefaultAllLeaves","SGH_WithoutSpan_Before","SGH_MultiLevel","SGH_CustomHeader","SGH_EdgesAndMiddle","SGH_ScrollFrozen","SGH_GroupSpan","SGH_ShallowAuto","SGH_GroupActionsTheme","SGH_LeafAlign","SGH_GroupAlign","SGH_AlignGridDefault"];export{S as SGH_AlignGridDefault,a as SGH_Basic,s as SGH_CustomHeader,c as SGH_EdgesAndMiddle,p as SGH_GridDefaultAllLeaves,m as SGH_GroupActionsTheme,w as SGH_GroupAlign,g as SGH_GroupSpan,H as SGH_LeafAlign,l as SGH_LeafGridDefault,d as SGH_MultiLevel,h as SGH_ScrollFrozen,G as SGH_ShallowAuto,u as SGH_WithoutSpan_Before,Te as __namedExportsOrder,Fe as default};
