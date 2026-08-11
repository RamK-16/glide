import{r as n}from"./iframe-hHpGbwgg.js";import{B as Qn}from"./story-utils-COZhae9d.js";import{a as i,G as An}from"./image-window-loader-NMjLACqt.js";import{D as fn}from"./data-editor-all-CgYPsZ4Y.js";import"./preload-helper-C1FmrZbK.js";import"./marked.esm-Cggckqpg.js";import"./throttle-BObCEQz_.js";import"./flatten-BHbELlzR.js";import"./scrolling-data-grid-usGCO-Yy.js";const vn={title:"Tests/SpanGroupHeader",decorators:[t=>n.createElement(Qn,{width:1500,height:640},n.createElement(t,null))]},e="Коэффициент результативности";function o({cols:t,description:r,groupHeaderHeight:dn=34,freezeColumns:cn,getGroupDetails:hn,spanShallowGroups:gn,spanAlign:Gn,spanGroupHeader:mn,onGroupHeaderRenamed:Hn,width:Q=1500,height:A=640}){const wn=n.useCallback(([f,I])=>{var b;const S=((b=t[f])==null?void 0:b.title)??`C${f}`,Sn=S.length>8?`${S.slice(0,8)}…`:S;return{kind:An.Text,displayData:`${Sn} ${I}`,data:`${S} ${I}`,allowOverlay:!1,readonly:!0}},[t]);return n.createElement("div",{style:{width:Q,height:A}},n.createElement("div",{style:{marginBottom:8,fontFamily:"monospace",fontSize:13,lineHeight:1.5,whiteSpace:"pre-wrap"}},r),n.createElement(fn,{width:Q,height:A-140,getCellContent:wn,getCellsForSelection:!0,columns:t,rows:200,rowMarkers:"both",groupHeaderHeight:dn,freezeColumns:cn,getGroupDetails:hn,spanShallowGroups:gn,spanAlign:Gn,spanGroupHeader:mn,onGroupHeaderRenamed:Hn}))}function a(){const t=[{title:"Краткое название роли",width:200,spanGroupHeader:!0},{title:"Период",width:150,spanGroupHeader:!0},{title:"Индивидуальные",width:150,group:e},{title:"Коллективные",width:150,group:e},{title:"Оценка",width:150,group:e},{title:"Продажи",width:150,spanGroupHeader:!0},{title:"Доплаты",width:150,spanGroupHeader:!0},{title:"Выплаты премий",width:160,spanGroupHeader:!0}];return n.createElement(o,{cols:t,description:n.createElement(n.Fragment,null,n.createElement("b",null,"ЛИСТОВАЯ фича (spanGroupHeader на колонке БЕЗ группы) — одиночные колонки рядом с группой"),`
`,'Колонки: «Краткое название роли», «Период», «Продажи», «Доплаты», «Выплаты премий» — spanGroupHeader: true, у них НЕТ группы. «Индивидуальные / Коллективные / Оценка» — обычная группа "',e,'" (spanGroupHeader к группам не применяется).',`
`,`
`,"✅ СЛИТЫ (одна ячейка на всю высоту шапки, заголовок по центру, без пустой полосы сверху, без горизонтального шва): Роль, Период, Продажи, Доплаты, Выплаты премий.",`
`,'✅ НЕ слита (обычная группа): "',e,'" — «',e,"» в верхнем ряду, три подколонки снизу. Это ожидаемо: листовая фича группы НЕ трогает (для слияния группы см. SGH_GroupSpan).")})}a.decorators=[];function l(){const t=[{title:"Краткое название роли",width:200},{title:"Период",width:150,spanGroupHeader:!1},{title:"Индивидуальные",width:150,group:e},{title:"Коллективные",width:150,group:e},{title:"Оценка",width:150,group:e},{title:"Продажи",width:150},{title:"Доплаты",width:150},{title:"Выплаты премий",width:160}];return n.createElement(o,{cols:t,spanGroupHeader:!0,description:n.createElement(n.Fragment,null,n.createElement("b",null,"ЛИСТОВАЯ фича через GRID-проп `spanGroupHeader` (без флага на каждой колонке)"),`
`,"На таблице стоит только `spanGroupHeader`. Он включает слияние у ВСЕХ листовых колонок (без группы) сразу: «Краткое название роли», «Продажи», «Доплаты», «Выплаты премий» — слиты автоматически.",`
`,`
`,"✅ Результат совпадает с SGH_Basic, но флаг не повторяется на колонках.",`
`,"✅ Точечный опт-аут: у «Период» стоит `spanGroupHeader: false` — эта колонка НЕ слита (значение колонки важнее grid-дефолта).",`
`,'✅ Группа "',e,'" проп НЕ трогает (у её колонок есть group) — обычная группа с подколонками.')})}l.decorators=[];function p(){const t=[{title:"Краткое название роли",width:200},{title:"Период",width:150},{title:"Индивидуальные",width:150,group:e},{title:"Коллективные",width:150,group:e},{title:"Оценка",width:150,group:e},{title:"Продажи",width:150},{title:"Доплаты",width:150},{title:"Выплаты премий",width:160}];return n.createElement(o,{cols:t,description:n.createElement(n.Fragment,null,n.createElement("b",null,"ЭТАЛОН «КАК БЫЛО» (флаг spanGroupHeader НЕ задан нигде) — для сравнения с SGH_Basic"),`
`,"Тот же набор колонок, что в SGH_Basic, но НИ у одной колонки нет spanGroupHeader и ни у одной группы нет span. Намеренно ничего не сливается.",`
`,`
`,'❌ Что видно (проблема, которую чиним): у одиночных «Краткое название роли», «Период», «Продажи», «Доплаты», «Выплаты премий» — ПУСТАЯ ячейка сверху, заголовок ужат в нижний ряд. Группа "',e,'" — обычная.',`
`,"Открой рядом SGH_Basic — там те же одиночные колонки уже слиты.")})}p.decorators=[];function u(){const t=[{title:"ID",width:100,spanGroupHeader:!0},{title:"Q1-A",width:150,group:["2024","Q1"]},{title:"Q1-B",width:150,group:["2024","Q1"]},{title:"Q2-C",width:150,group:["2024","Q2"]},{title:"Q2-D",width:150,group:["2024","Q2"]},{title:"Итого",width:150,spanGroupHeader:!0}];return n.createElement(o,{cols:t,groupHeaderHeight:[30,28],description:n.createElement(n.Fragment,null,n.createElement("b",null,"ЛИСТОВАЯ фича в ТРЁХрядной шапке (2 групп-ряда: 2024 → Q1/Q2)"),`
`,"Колонки: «ID» (слева) и «Итого» (справа) — spanGroupHeader: true, без группы. «Q1-A / Q1-B» — группа [2024, Q1]; «Q2-C / Q2-D» — группа [2024, Q2]. Высота шапки = 3 ряда (2 групп-ряда + ряд колонок).",`
`,`
`,"✅ СЛИТЫ на ВСЕ 3 ряда одной ячейкой: ID и Итого — ни одна из двух межуровневых линий их не пересекает.",`
`,"✅ НЕ слиты (обычные двухуровневые группы): 2024 → Q1/Q2 — «2024» в 1-м ряду, «Q1»/«Q2» во 2-м, подколонки в 3-м.")})}u.decorators=[];function s(){const t=[{title:"Роль",width:200,spanGroupHeader:!0,icon:i.HeaderString,hasMenu:!0},{title:"Индивидуальные",width:150,group:e,icon:i.HeaderNumber},{title:"Коллективные",width:150,group:e,icon:i.HeaderNumber},{title:"Итог",width:150,spanGroupHeader:!0,icon:i.HeaderNumber,hasMenu:!0}];return n.createElement(o,{cols:t,groupHeaderHeight:36,description:n.createElement(n.Fragment,null,n.createElement("b",null,"ЛИСТОВАЯ фича с кастомным контентом шапки (иконка + меню)"),`
`,'Колонки: «Роль» и «Итог» — spanGroupHeader: true + icon + hasMenu (без группы). «Индивидуальные / Коллективные» — обычная группа "',e,'".',`
`,`
`,"✅ СЛИТЫ Роль и Итог: иконка и «гамбургер»-меню центрированы по ВСЕЙ высоте слитой ячейки, а не прижаты к нижней полосе.",`
`,'✅ НЕ слита группа "',e,'" (обычная).')})}s.decorators=[];function d(){const t=[{title:"Лево-слит",width:150,spanGroupHeader:!0},{title:"A1",width:150,group:"Группа A"},{title:"A2",width:150,group:"Группа A"},{title:"Центр-слит",width:150,spanGroupHeader:!0},{title:"B1",width:150,group:"Группа B"},{title:"B2",width:150,group:"Группа B"},{title:"Право-слит",width:150,spanGroupHeader:!0}];return n.createElement(o,{cols:t,description:n.createElement(n.Fragment,null,n.createElement("b",null,"ЛИСТОВАЯ фича — слитые колонки слева / между группами / справа (сегментация линии)"),`
`,"Колонки: «Лево-слит», «Центр-слит», «Право-слит» — spanGroupHeader: true (без группы). Между ними — обычные группы «Группа A» (A1/A2) и «Группа B» (B1/B2).",`
`,`
`,"✅ СЛИТЫ 3 листовые колонки; межуровневая линия РАЗРЕЗАНА ровно по их границам (над слитой колонкой линии нет), вертикальные границы со стыками групп A/B — целые.",`
`,"✅ НЕ слиты группы A и B (обычные). Это стресс-тест краёв/середины и разреза линии.")})}d.decorators=[];function c(){const t=[{title:"Роль (frozen)",width:190,spanGroupHeader:!0},{title:"Период",width:150,spanGroupHeader:!0},{title:"Индивидуальные",width:150,group:e},{title:"Коллективные",width:150,group:e},{title:"Оценка",width:150,group:e},{title:"Продажи",width:150,spanGroupHeader:!0},{title:"Доплаты",width:150,spanGroupHeader:!0},{title:"Премии",width:150,spanGroupHeader:!0},{title:"Q1-A",width:150,group:["2024","Q1"]},{title:"Q1-B",width:150,group:["2024","Q1"]},{title:"Комментарий",width:220,spanGroupHeader:!0}];return n.createElement(o,{cols:t,groupHeaderHeight:[30,28],freezeColumns:1,description:n.createElement(n.Fragment,null,n.createElement("b",null,"ЛИСТОВАЯ фича + frozen + горизонтальный скролл (рисковая геометрия translateX / sticky)"),`
`,'Колонки: «Роль (frozen)», «Период», «Продажи», «Доплаты», «Премии», «Комментарий» — spanGroupHeader: true (лист). «Индивидуальные/Коллективные/Оценка» (группа "',e,'") и «Q1-A/Q1-B» (группа [2024, Q1]) — ОБЫЧНЫЕ группы, span у них НЕ включён.',`
`,`
`,"✅ СЛИТЫ листовые колонки на всю высоту; frozen «Роль» держит слитную шапку при прокрутке, разрез линии не «едет».",`
`,"⚠️ «",e,"» НАМЕРЕННО НЕ слит (обычная группа) → под «",e,"» видна пустая полоса. Это и есть «до» для ГРУППОВОЙ фичи. Слияние группы показано в SGH_GroupSpan (точечно) и SGH_ShallowAuto (авто).")})}c.decorators=[];function h(){const t=[{title:"Роль",width:180,spanGroupHeader:!0},{title:"Индивидуальные",width:150,group:e},{title:"Коллективные",width:150,group:e},{title:"Оценка",width:150,group:e},{title:"Q1-A",width:130,group:["2024","Q1"]},{title:"Q1-B",width:130,group:["2024","Q1"]},{title:"Q2-C",width:130,group:["2024","Q2"]}];return n.createElement(o,{cols:t,groupHeaderHeight:[30,28],getGroupDetails:r=>({name:r,span:r===e}),description:n.createElement(n.Fragment,null,n.createElement("b",null,"ГРУППОВАЯ фича (rowspan группы) — ТОЧЕЧНО через getGroupDetails().span = true"),`
`,'Колонки: «Роль» — spanGroupHeader (лист). «Индивидуальные/Коллективные/Оценка» — ОДНОуровневая группа "',e,'" (group: строка). «Q1-A/Q1-B» — [2024, Q1], «Q2-C» — [2024, Q2] (ДВУХуровневая). Шапка = 2 групп-ряда. span:true задан ТОЛЬКО группе "',e,'".',`
`,`
`,'✅ СЛИТА группа "',e,'": одноуровневая, поэтому её нижний групп-ряд (level 1) пустой — она занимает ОБА групп-ряда одной ячейкой по центру, без пустой полосы и шва; строку подколонок (Индивид/Коллект/Оценка) НЕ накрывает, дно есть.',`
`,"✅ НЕ слита «2024 → Q1/Q2» (двухуровневая, span не задан). «Роль» — лист, слит на всю высоту.",`
`,'🖱️ Наведи/кликни по слитой "',e,'" — ведёт себя как одна ячейка на всю высоту.')})}h.decorators=[];function g(){const t=[{title:"Роль",width:180,spanGroupHeader:!0},{title:"Индивидуальные",width:150,group:e},{title:"Коллективные",width:150,group:e},{title:"Оценка",width:150,group:e},{title:"План",width:130,group:"Продажи"},{title:"Факт",width:130,group:"Продажи"},{title:"Q1-A",width:130,group:["2024","Q1"]},{title:"Q1-B",width:130,group:["2024","Q1"]}];return n.createElement(o,{cols:t,groupHeaderHeight:[30,28],spanShallowGroups:!0,description:n.createElement(n.Fragment,null,n.createElement("b",null,"ГРУППОВАЯ фича — АВТО-режим (grid-проп spanShallowGroups, БЕЗ ручной разметки)"),`
`,'На таблице стоит только spanShallowGroups. Колонки: «Роль» — лист. МЕЛКИЕ (одноуровневые) группы: "',e,'" (Индивид/Коллект/Оценка) и «Продажи» (План/Факт). ГЛУБОКАЯ: [2024, Q1] (Q1-A/Q1-B). Шапка = 2 групп-ряда.',`
`,`
`,'✅ СЛИТЫ ОБЕ мелкие группы — "',e,'" И «Продажи» — автоматически, без единого getGroupDetails.',`
`,"✅ НЕ слита «2024 → Q1» (двухуровневая — не мелкая). «Роль» — лист, слит.",`
`,"Отличие от SGH_GroupSpan: там span включён руками у ОДНОЙ группы; здесь ВСЕ мелкие сливаются одним пропом (span:false у группы точечно отключил бы её из авто).")})}g.decorators=[];function G(){const t=[{title:"Роль",width:160,spanGroupHeader:!0},{title:"Индивидуальные",width:150,group:e},{title:"Коллективные",width:150,group:e},{title:"Оценка",width:150,group:e},{title:"Q1-A",width:130,group:["2024","Q1"]},{title:"Q1-B",width:130,group:["2024","Q1"]}];return n.createElement(o,{cols:t,groupHeaderHeight:[30,28],onGroupHeaderRenamed:()=>{},getGroupDetails:r=>r===e?{name:r,span:!0,overrideTheme:{bgGroupHeader:"#eaf1ff"},actions:[{title:"Настройки",icon:i.HeaderString,onClick:()=>{}}]}:{name:r},description:n.createElement(n.Fragment,null,n.createElement("b",null,"ГРУППОВАЯ фича — actions / rename / overrideTheme на СЛИТОЙ высоте (Task IV)"),`
`,'Колонки: «Роль» — лист. «Индивидуальные/Коллективные/Оценка» — группа "',e,'" со span:true + overrideTheme (голубая заливка) + action-иконка. onGroupHeaderRenamed включён → при наведении добавляется пункт Rename. «Q1-A/Q1-B» — [2024, Q1] (обычная).',`
`,`
`,'✅ Голубая заливка overrideTheme — на ВСЮ слитую высоту "',e,'" (не только верхний ряд).',`
`,"✅ При наведении иконки actions/rename — по центру слитой ячейки (не прижаты к верхней полосе).",`
`,"✅ Клик по rename → инпут-оверлей по merged-прямоугольнику (на всю слитую высоту).",`
`,"✅ НЕ слита «2024 → Q1» (обычная).")})}G.decorators=[];function m(){const t=[{title:"left·top",width:150,spanGroupHeader:!0,spanGroupHeaderAlign:{horizontal:"left",vertical:"top"}},{title:"center",width:150,spanGroupHeader:!0,spanGroupHeaderAlign:{horizontal:"center",vertical:"center"}},{title:"right·bottom",width:160,spanGroupHeader:!0,spanGroupHeaderAlign:{horizontal:"right",vertical:"bottom"}},{title:"center·top",width:150,spanGroupHeader:!0,spanGroupHeaderAlign:{horizontal:"center",vertical:"top"}},{title:"Q1-A",width:120,group:["2024","Q1"]},{title:"Q1-B",width:120,group:["2024","Q1"]}];return n.createElement(o,{cols:t,groupHeaderHeight:[38,38],description:n.createElement(n.Fragment,null,n.createElement("b",null,"ЛИСТ + выравнивание (spanGroupHeaderAlign)"),`
`,"Дефолт листа — left/center (обратная совместимость). Здесь заданы разные комбинации:",`
`,"«left·top», «center» (center/center), «right·bottom», «center·top».",`
`,`
`,"✅ Текст встаёт по заданным осям, с учётом отступов темы и иконки; высота слитой ячейки = 2 групп-ряда + строка колонки.")})}m.decorators=[];function H(){const t=[{title:"Индивидуальные",width:150,group:e},{title:"Коллективные",width:150,group:e},{title:"Оценка",width:150,group:e},{title:"Q1-A",width:120,group:["2024","Q1"]},{title:"Q1-B",width:120,group:["2024","Q1"]}];return n.createElement(o,{cols:t,groupHeaderHeight:[40,40],getGroupDetails:r=>r===e?{name:r,span:!0,spanAlign:{horizontal:"center",vertical:"top"}}:{name:r},description:n.createElement(n.Fragment,null,n.createElement("b",null,"ГРУППА + выравнивание (getGroupDetails().spanAlign)"),`
`,"«",e,"» — одноуровневая группа, сливает пустой нижний ряд (span) и прижимает заголовок"," ",n.createElement("b",null,"center/top"),". Дефолт для слитых групп — center; здесь дополнительно задан top по вертикали.",`
`,`
`,"✅ Заголовок группы по центру и сверху слитой (80px) ячейки. «2024 → Q1» — обычная двухуровневая, не сливается.")})}H.decorators=[];function w(){const t=[{title:"Роль",width:180,spanGroupHeader:!0},{title:"Индивидуальные",width:150,group:e},{title:"Коллективные",width:150,group:e},{title:"Оценка",width:150,group:e},{title:"Q1-A",width:120,group:["2024","Q1"]},{title:"Q1-B",width:120,group:["2024","Q1"]}];return n.createElement(o,{cols:t,groupHeaderHeight:[40,40],spanShallowGroups:!0,spanAlign:{horizontal:"center",vertical:"center"},getGroupDetails:r=>r===e?{name:r,spanAlign:{horizontal:"center",vertical:"bottom"}}:{name:r},description:n.createElement(n.Fragment,null,n.createElement("b",null,"GRID-ДЕФОЛТ (DataEditor spanAlign) + точечный override"),`
`,"Grid-дефолт: ",n.createElement("b",null,"center/center")," для всех слитых (лист «Роль» + слитые группы через spanShallowGroups).",`
`,"Группа «",e,"» точечно перекрывает вертикаль на ",n.createElement("b",null,"bottom")," (getGroupDetails().spanAlign).",`
`,`
`,"✅ «Роль» (лист) — center/center; «",e,"» — center/bottom; остальное — по grid-дефолту.")})}w.decorators=[];var B,_,K;a.parameters={...a.parameters,docs:{...(B=a.parameters)==null?void 0:B.docs,source:{originalSource:`function SGH_Basic() {
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
}`,...(K=(_=a.parameters)==null?void 0:_.docs)==null?void 0:K.source}}};var E,P,D;l.parameters={...l.parameters,docs:{...(E=l.parameters)==null?void 0:E.docs,source:{originalSource:`function SGH_LeafGridDefault() {
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
}`,...(D=(P=l.parameters)==null?void 0:P.docs)==null?void 0:D.source}}};var C,v,z;p.parameters={...p.parameters,docs:{...(C=p.parameters)==null?void 0:C.docs,source:{originalSource:`function SGH_WithoutSpan_Before() {
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
}`,...(z=(v=p.parameters)==null?void 0:v.docs)==null?void 0:z.source}}};var y,F,T;u.parameters={...u.parameters,docs:{...(y=u.parameters)==null?void 0:y.docs,source:{originalSource:`function SGH_MultiLevel() {
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
}`,...(T=(F=u.parameters)==null?void 0:F.docs)==null?void 0:T.source}}};var M,R,k;s.parameters={...s.parameters,docs:{...(M=s.parameters)==null?void 0:M.docs,source:{originalSource:`function SGH_CustomHeader() {
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
}`,...(k=(R=s.parameters)==null?void 0:R.docs)==null?void 0:k.source}}};var L,x,N;d.parameters={...d.parameters,docs:{...(L=d.parameters)==null?void 0:L.docs,source:{originalSource:`function SGH_EdgesAndMiddle() {
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
}`,...(N=(x=d.parameters)==null?void 0:x.docs)==null?void 0:N.source}}};var $,W,O;c.parameters={...c.parameters,docs:{...($=c.parameters)==null?void 0:$.docs,source:{originalSource:`function SGH_ScrollFrozen() {
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
}`,...(O=(W=c.parameters)==null?void 0:W.docs)==null?void 0:O.source}}};var V,X,j;h.parameters={...h.parameters,docs:{...(V=h.parameters)==null?void 0:V.docs,source:{originalSource:`function SGH_GroupSpan() {
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
}`,...(j=(X=h.parameters)==null?void 0:X.docs)==null?void 0:j.source}}};var q,J,U;g.parameters={...g.parameters,docs:{...(q=g.parameters)==null?void 0:q.docs,source:{originalSource:`function SGH_ShallowAuto() {
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
}`,...(U=(J=g.parameters)==null?void 0:J.docs)==null?void 0:U.source}}};var Y,Z,nn;G.parameters={...G.parameters,docs:{...(Y=G.parameters)==null?void 0:Y.docs,source:{originalSource:`function SGH_GroupActionsTheme() {
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
}`,...(nn=(Z=G.parameters)==null?void 0:Z.docs)==null?void 0:nn.source}}};var en,tn,rn;m.parameters={...m.parameters,docs:{...(en=m.parameters)==null?void 0:en.docs,source:{originalSource:`function SGH_LeafAlign() {
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
}`,...(rn=(tn=m.parameters)==null?void 0:tn.docs)==null?void 0:rn.source}}};var on,an,ln;H.parameters={...H.parameters,docs:{...(on=H.parameters)==null?void 0:on.docs,source:{originalSource:`function SGH_GroupAlign() {
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
}`,...(ln=(an=H.parameters)==null?void 0:an.docs)==null?void 0:ln.source}}};var pn,un,sn;w.parameters={...w.parameters,docs:{...(pn=w.parameters)==null?void 0:pn.docs,source:{originalSource:`function SGH_AlignGridDefault() {
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
}`,...(sn=(un=w.parameters)==null?void 0:un.docs)==null?void 0:sn.source}}};const zn=["SGH_Basic","SGH_LeafGridDefault","SGH_WithoutSpan_Before","SGH_MultiLevel","SGH_CustomHeader","SGH_EdgesAndMiddle","SGH_ScrollFrozen","SGH_GroupSpan","SGH_ShallowAuto","SGH_GroupActionsTheme","SGH_LeafAlign","SGH_GroupAlign","SGH_AlignGridDefault"];export{w as SGH_AlignGridDefault,a as SGH_Basic,s as SGH_CustomHeader,d as SGH_EdgesAndMiddle,G as SGH_GroupActionsTheme,H as SGH_GroupAlign,h as SGH_GroupSpan,m as SGH_LeafAlign,l as SGH_LeafGridDefault,u as SGH_MultiLevel,c as SGH_ScrollFrozen,g as SGH_ShallowAuto,p as SGH_WithoutSpan_Before,zn as __namedExportsOrder,vn as default};
