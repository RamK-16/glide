import{r as t}from"./iframe-CfgikH3_.js";import{B as Wt}from"./story-utils-BmDNZFBU.js";import{G as Ct}from"./image-window-loader-Cz48fBTX.js";import{D as E}from"./data-editor-all-D41UsjMf.js";import"./preload-helper-C1FmrZbK.js";import"./marked.esm-CO4vYkPn.js";import"./throttle-DIzrw2qQ.js";import"./flatten-BiOBU7uo.js";import"./scrolling-data-grid-DJnaeU4e.js";const{useState:S,useCallback:gt}=__STORYBOOK_MODULE_PREVIEW_API__,Ft={title:"Tests/ColumnWidth",decorators:[n=>t.createElement(Wt,{width:1600,height:800},t.createElement(n,null))]};function Tt(n){if(n.grow!==void 0)return n;const e="width"in n&&typeof n.width=="number";return{...n,grow:e?0:1}}function r(n){return n.map(Tt)}function A([n,e]){const i=[`ID-${e}`,`Заголовок строки ${e} — длинный текст для проверки auto-sizing`,e%2===0?"Высокий":"Низкий",`Категория ${String.fromCharCode(65+e%5)}`,`${e*17%100}%`];return{kind:Ct.Text,displayData:i[n]??`${n},${e}`,data:i[n]??`${n},${e}`,allowOverlay:!1}}function o(n){const[e,i]=S(n),l=gt((a,m)=>{const s=e.findIndex(yt=>yt.id===a.id);if(s===-1)return;const R=[...e];R[s]={...R[s],width:m},i(R)},[e]);return{cols:e,onColumnResize:l}}function d({cols:n,onColumnResize:e,description:i,width:l=1500,height:a=600}){return t.createElement("div",{style:{width:l,height:a}},t.createElement("div",{style:{marginBottom:8,fontFamily:"monospace",fontSize:13,lineHeight:1.5,whiteSpace:"pre-wrap"}},i),t.createElement(E,{width:l,height:a-100,getCellContent:A,getCellsForSelection:!0,columns:n,rows:100,onColumnResize:e}))}function p(){const{cols:n,onColumnResize:e}=o(r([{title:"ID (w:80)",id:"id",width:80},{title:"Title (w:300)",id:"title",width:300},{title:"Priority (w:150)",id:"priority",width:150},{title:"Type (w:200)",id:"type",width:200},{title:"Complete (w:120)",id:"complete",width:120}]));return t.createElement(d,{cols:n,onColumnResize:e,description:t.createElement(t.Fragment,null,t.createElement("b",null,"Кейс: все колонки с width"),`
`,"Логика обёртки: width есть =grow: 0. Колонки НЕ растягиваются.",`
`,"Сумма = 850px, контейнер = 1500px. Справа пустое место.",`
`,"Ресайз: свободное перетаскивание без ограничений.")})}p.decorators=[];function c(){const{cols:n,onColumnResize:e}=o(r([{title:"ID",id:"id"},{title:"Title",id:"title"},{title:"Priority",id:"priority"},{title:"Type",id:"type"},{title:"Complete",id:"complete"}]));return t.createElement(d,{cols:n,onColumnResize:e,description:t.createElement(t.Fragment,null,t.createElement("b",null,"Кейс: все колонки без width"),`
`,"Логика обёртки: width нет =grow: 1. Колонки auto-size + grow заполняет контейнер.",`
`,"Ожидание: колонки подобрали ширину по контенту, затем grow дораспределил остаток поровну.",`
`,"Вся ширина контейнера (1500px) занята.")})}c.decorators=[];function u(){const{cols:n,onColumnResize:e}=o(r([{title:"ID (w:80)",id:"id",width:80},{title:"Title (auto, max:3000)",id:"title",maxWidth:3e3},{title:"Priority (w:150)",id:"priority",width:150},{title:"Type (auto)",id:"type"},{title:"Complete (w:120)",id:"complete",width:120}]));return t.createElement(d,{cols:n,onColumnResize:e,description:t.createElement(t.Fragment,null,t.createElement("b",null,"Кейс: микс фиксированных и авто-колонок"),`
`,"ID, Priority, Complete имеют width =grow: 0 (фиксированные, 350px суммарно).",`
`,"Title, Type без width =grow: 1 (делят оставшиеся ~1150px через grow).",`
`,"Ожидание: Title и Type заполняют все свободное место.")})}u.decorators=[];function h(){const{cols:n,onColumnResize:e}=o(r([{title:"ID (min:50)",id:"id",minWidth:50},{title:"Title (min:200)",id:"title",minWidth:200},{title:"Priority (min:100)",id:"priority",minWidth:100},{title:"Type (min:80)",id:"type",minWidth:80},{title:"Complete (min:60)",id:"complete",minWidth:60}]));return t.createElement(d,{cols:n,onColumnResize:e,description:t.createElement(t.Fragment,null,t.createElement("b",null,"Кейс: только minWidth (без width =grow: 1)"),`
`,"Все колонки auto-size + grow. minWidth задает нижнюю границу.",`
`,"Ожидание: колонки не уже minWidth, grow заполняет контейнер.",`
`,"Ресайз: нельзя сузить ниже minWidth.")})}h.decorators=[];function w(){const{cols:n,onColumnResize:e}=o(r([{title:"ID (max:100)",id:"id",maxWidth:100},{title:"Title (max:250)",id:"title",maxWidth:250},{title:"Priority (max:120)",id:"priority",maxWidth:120},{title:"Type (max:180)",id:"type",maxWidth:180},{title:"Complete (max:90)",id:"complete",maxWidth:90}]));return t.createElement(d,{cols:n,onColumnResize:e,description:t.createElement(t.Fragment,null,t.createElement("b",null,"Кейс: только maxWidth (без width =grow: 1)"),`
`,"Все колонки auto-size + grow. Сумма maxWidth = 740px, контейнер = 1500px.",`
`,"grow довел все колонки до maxWidth. Дальше расти некуда =760px пустого места.",`
`,"ПОБОЧНЫЙ ЭФФЕКТ: ресайз заблокирован (все уперлись, grow возвращает обратно).",`
`,'Это ожидаемо: нет "свободной" колонки-поглотителя.')})}w.decorators=[];function x(){const{cols:n,onColumnResize:e}=o(r([{title:"ID (w:80)",id:"id",width:80},{title:"Title (max:250)",id:"title",maxWidth:250},{title:"Priority (max:120)",id:"priority",maxWidth:120},{title:"Type (без ограничений)",id:"type"},{title:"Complete (w:120)",id:"complete",width:120}]));return t.createElement(d,{cols:n,onColumnResize:e,description:t.createElement(t.Fragment,null,t.createElement("b",null,"Кейс: maxWidth + свободная колонка-поглотитель"),`
`,"ID, Complete фиксированные (grow: 0). Title, Priority, Type без width (grow: 1).",`
`,"Title ограничен 250px, Priority 120px. Type без ограничений.",`
`,"Ожидание: Title=250, Priority=120, Type забирает остаток (~930px).",`
`,"Ресайз: Title и Priority можно сузить, излишек уйдет в Type.")})}x.decorators=[];function y(){const{cols:n,onColumnResize:e}=o(r([{title:"ID (w:80)",id:"id",width:80},{title:"Title (min:200, max:400)",id:"title",minWidth:200,maxWidth:400},{title:"Priority (min:80, max:150)",id:"priority",minWidth:80,maxWidth:150},{title:"Type (без ограничений)",id:"type"},{title:"Complete (w:120)",id:"complete",width:120}]));return t.createElement(d,{cols:n,onColumnResize:e,description:t.createElement(t.Fragment,null,t.createElement("b",null,"Кейс: minWidth + maxWidth + свободная колонка"),`
`,"ID, Complete фиксированные (grow: 0). Title, Priority, Type без width (grow: 1).",`
`,"Title: 200-400px. Priority: 80-150px. Type: без ограничений.",`
`,"Ожидание: Title=400, Priority=150, Type забирает остаток (~750px).",`
`,"Ресайз: Title можно сузить до 200, освобожденное место уйдет в Type.")})}y.decorators=[];function W(){const{cols:n,onColumnResize:e}=o(r([{title:"ID (w:80)",id:"id",width:80},{title:"Title (maxAuto:200)",id:"title",maxAutoWidth:200},{title:"Priority (maxAuto:100)",id:"priority",maxAutoWidth:100},{title:"Type (без ограничений)",id:"type"},{title:"Complete (w:120)",id:"complete",width:120}]));return t.createElement(d,{cols:n,onColumnResize:e,description:t.createElement(t.Fragment,null,t.createElement("b",null,"Кейс: maxAutoWidth + свободная колонка (ОСНОВНОЙ КЕЙС обёртки)"),`
`,"ID, Complete фиксированные (grow: 0). Title, Priority, Type без width (grow: 1).",`
`,"Title ограничен maxAutoWidth=200, Priority maxAutoWidth=100. Type без ограничений.",`
`,"Ожидание: Title=200, Priority=100, Type забирает остаток (~1000px).",`
`,"Ресайз: Title и Priority можно расширить шире maxAutoWidth (мягкое ограничение).")})}W.decorators=[];function C(){const{cols:n,onColumnResize:e}=o(r([{title:"# (w:50)",id:"num",width:50},{title:"Имя (min:150, maxAuto:300)",id:"name",minWidth:150,maxAutoWidth:300},{title:"Статус (maxAuto:100, max:200)",id:"status",maxAutoWidth:100,maxWidth:200},{title:"Описание (без ограничений)",id:"desc"},{title:"Дата (w:120)",id:"date",width:120}]));return t.createElement(d,{cols:n,onColumnResize:e,description:t.createElement(t.Fragment,null,t.createElement("b",null,"Кейс: симуляция реальной таблицы (как в обёртке)"),`
`,"# и Дата — фиксированные (width =grow: 0). Остальные auto (grow: 1).",`
`,"Имя: min 150, auto до 300. Статус: auto до 100, ресайз до 200.",`
`,"Описание: без ограничений, колонка-поглотитель.",`
`,"Ожидание: Имя=300, Статус=100, Описание забирает остаток.",`
`,"Ресайз: Имя можно сузить до 150 или расширить шире 300. Статус до 200 макс.")})}C.decorators=[];function g(){const{cols:n,onColumnResize:e}=o([{title:"ID (w:80)",id:"id",width:80,grow:0},{title:"Title (maxAuto:300, grow:3)",id:"title",maxAutoWidth:300,grow:3},{title:"Priority (maxAuto:150, grow:1)",id:"priority",maxAutoWidth:150,grow:1},{title:"Type (grow:2)",id:"type",grow:2},{title:"Complete (w:120)",id:"complete",width:120,grow:0}]);return t.createElement(d,{cols:n,onColumnResize:e,description:t.createElement(t.Fragment,null,t.createElement("b",null,"Кейс: разные веса grow (3, 1, 2)"),`
`,"Title grow:3, Priority grow:1, Type grow:2. Свободное место ~1300px.",`
`,"Title хочет 650px (3/6), но cap=300 =получает 300. Остаток перераспределяется.",`
`,"Priority хочет ~217px (1/6), но cap=150 =получает 150.",`
`,"Type без cap =забирает весь остаток (~850px).")})}g.decorators=[];function T(){const{cols:n,onColumnResize:e}=o(r([{title:"ID (w:200)",id:"id",width:200},{title:"Title (w:400)",id:"title",width:400},{title:"Priority (w:300)",id:"priority",width:300},{title:"Type (w:350)",id:"type",width:350},{title:"Complete (w:250)",id:"complete",width:250}]));return t.createElement(d,{cols:n,onColumnResize:e,width:800,description:t.createElement(t.Fragment,null,t.createElement("b",null,"Кейс: колонки шире контейнера (800px)"),`
`,"Все с width (grow: 0). Сумма 1500px шире 800px контейнера.",`
`,"Ожидание: горизонтальный скролл, колонки на своих ширинах.",`
`,"grow не работает (нет свободного места). Ресайз нормальный.")})}T.decorators=[];function ft(){const n=[];for(let e=0;e<30;e++){const i=60+e%5*20;n.push({title:`Col${e} (${i}px, min:${i-20}, max:${i+40})`,id:`col${e}`,width:i,minWidth:i-20,maxWidth:i+40})}return n}function bt({cols:n}){return t.createElement("div",{style:{fontFamily:"monospace",fontSize:11,lineHeight:1.4,overflowY:"auto",maxHeight:550,border:"1px solid #ccc",padding:6,background:"#fafafa",minWidth:320}},t.createElement("table",{style:{borderCollapse:"collapse",width:"100%"}},t.createElement("thead",null,t.createElement("tr",{style:{borderBottom:"2px solid #999",textAlign:"left"}},t.createElement("th",{style:{padding:"2px 6px"}},"#"),t.createElement("th",{style:{padding:"2px 6px"}},"id"),t.createElement("th",{style:{padding:"2px 6px"}},"width"),t.createElement("th",{style:{padding:"2px 6px"}},"min"),t.createElement("th",{style:{padding:"2px 6px"}},"max"),t.createElement("th",{style:{padding:"2px 6px"}},"grow"))),t.createElement("tbody",null,n.map((e,i)=>t.createElement("tr",{key:e.id??i,style:{borderBottom:"1px solid #eee"}},t.createElement("td",{style:{padding:"2px 6px",color:"#888"}},i),t.createElement("td",{style:{padding:"2px 6px"}},e.id),t.createElement("td",{style:{padding:"2px 6px",fontWeight:"bold"}},e.width??"auto"),t.createElement("td",{style:{padding:"2px 6px"}},e.minWidth??"-"),t.createElement("td",{style:{padding:"2px 6px"}},e.maxWidth??"-"),t.createElement("td",{style:{padding:"2px 6px"}},e.grow??"-"))))))}function f(){const{cols:n,onColumnResize:e}=o(r(ft()));return t.createElement("div",{style:{display:"flex",gap:16,width:1600,height:600}},t.createElement("div",{style:{flex:1,minWidth:0}},t.createElement("div",{style:{marginBottom:8,fontFamily:"monospace",fontSize:13,lineHeight:1.5,whiteSpace:"pre-wrap"}},t.createElement("b",null,"Кейс: 30 колонок с minWidth/maxWidth, без grow"),`
`,"Все с width (grow: 0). Суммарно ~2400px, контейнер 1200px.",`
`,"В grow-if НЕ заходим. Горизонтальный скролл.",`
`,"minWidth не даёт сжать ниже, maxWidth не даёт расширить выше."),t.createElement(E,{width:1200,height:480,getCellContent:A,getCellsForSelection:!0,columns:n,rows:100,onColumnResize:e})),t.createElement(bt,{cols:n}))}f.decorators=[];function b(){const{cols:n,onColumnResize:e}=o(r([{title:"Title (max:3000, maxAuto:3000)",id:"title",maxWidth:3e3,maxAutoWidth:3e3}]));return t.createElement(d,{cols:n,onColumnResize:e,description:t.createElement(t.Fragment,null,t.createElement("b",null,"Кейс: одна колонка, grow:1, maxWidth:3000"),`
`,"Контейнер 1500px. maxWidth 3000 — потолок выше контейнера.",`
`,"Ожидание: колонка займёт все 1500px (grow заполнит контейнер).")})}b.decorators=[];function zt(n){const[e,i]=S(0);return t.useEffect(()=>{const l=n.current;if(l===null)return;const a=new ResizeObserver(m=>{for(const s of m)i(Math.floor(s.contentRect.width))});return a.observe(l),i(Math.floor(l.clientWidth)),()=>a.disconnect()},[n]),e}function z(){const[n,e]=S(!1),i=t.useRef(null),l=zt(i),{cols:a,onColumnResize:m}=o(r([{title:"ID (w:80)",id:"id",width:80},{title:"Title",id:"title"},{title:"Priority",id:"priority"},{title:"Type",id:"type"},{title:"Complete (w:120)",id:"complete",width:120}]));return t.createElement("div",{style:{display:"flex",width:1600,height:600}},t.createElement("div",{ref:i,style:{width:n?1e3:1500,transition:"width 0.3s ease",overflow:"hidden"}},t.createElement("div",{style:{marginBottom:8,fontFamily:"monospace",fontSize:13,lineHeight:1.5,whiteSpace:"pre-wrap"}},t.createElement("b",null,"Кейс: сайдбар влияет на ширину контейнера"),`
`,"Контейнер: ",l,"px (анимируется). Title, Priority, Type — grow:1.",`
`,"При открытии сайдбара контейнер сужается 1500→1000px."),t.createElement("button",{onClick:()=>e(s=>!s),style:{marginBottom:8,padding:"4px 12px",cursor:"pointer"}},n?"Закрыть сайдбар":"Открыть сайдбар"),l>0&&t.createElement(E,{width:l,height:450,getCellContent:A,getCellsForSelection:!0,columns:a,rows:100,onColumnResize:m,smoothScrollX:!0})),n&&t.createElement("div",{style:{width:500,background:"#f0f0f0",borderLeft:"2px solid #ccc",padding:16,fontFamily:"monospace",fontSize:13}},t.createElement("b",null,"Сайдбар"),t.createElement("p",null,"Этот сайдбар сужает контейнер таблицы на 500px."),t.createElement("p",null,"Grow-колонки должны перераспределиться.")))}z.decorators=[];var P,_,D;p.parameters={...p.parameters,docs:{...(P=p.parameters)==null?void 0:P.docs,source:{originalSource:`function CW_AllWithWidth() {
  const {
    cols,
    onColumnResize
  } = useResizableCols(withAdaptedGrow([{
    title: "ID (w:80)",
    id: "id",
    width: 80
  }, {
    title: "Title (w:300)",
    id: "title",
    width: 300
  }, {
    title: "Priority (w:150)",
    id: "priority",
    width: 150
  }, {
    title: "Type (w:200)",
    id: "type",
    width: 200
  }, {
    title: "Complete (w:120)",
    id: "complete",
    width: 120
  }]));
  return <WidthStoryShell cols={cols} onColumnResize={onColumnResize} description={<>
                    <b>Кейс: все колонки с width</b>
                    {"\\n"}
                    Логика обёртки: width есть =grow: 0. Колонки НЕ растягиваются.{"\\n"}
                    Сумма = 850px, контейнер = 1500px. Справа пустое место.{"\\n"}
                    Ресайз: свободное перетаскивание без ограничений.
                </>} />;
}`,...(D=(_=p.parameters)==null?void 0:_.docs)==null?void 0:D.source}}};var v,I,F;c.parameters={...c.parameters,docs:{...(v=c.parameters)==null?void 0:v.docs,source:{originalSource:`function CW_AllNoWidth() {
  const {
    cols,
    onColumnResize
  } = useResizableCols(withAdaptedGrow([{
    title: "ID",
    id: "id"
  }, {
    title: "Title",
    id: "title"
  }, {
    title: "Priority",
    id: "priority"
  }, {
    title: "Type",
    id: "type"
  }, {
    title: "Complete",
    id: "complete"
  }]));
  return <WidthStoryShell cols={cols} onColumnResize={onColumnResize} description={<>
                    <b>Кейс: все колонки без width</b>
                    {"\\n"}
                    Логика обёртки: width нет =grow: 1. Колонки auto-size + grow заполняет контейнер.{"\\n"}
                    Ожидание: колонки подобрали ширину по контенту, затем grow дораспределил остаток поровну.{"\\n"}
                    Вся ширина контейнера (1500px) занята.
                </>} />;
}`,...(F=(I=c.parameters)==null?void 0:I.docs)==null?void 0:F.source}}};var M,G,O;u.parameters={...u.parameters,docs:{...(M=u.parameters)==null?void 0:M.docs,source:{originalSource:`function CW_MixedWidthAndAuto() {
  const {
    cols,
    onColumnResize
  } = useResizableCols(withAdaptedGrow([{
    title: "ID (w:80)",
    id: "id",
    width: 80
  }, {
    title: "Title (auto, max:3000)",
    id: "title",
    maxWidth: 3000
  }, {
    title: "Priority (w:150)",
    id: "priority",
    width: 150
  }, {
    title: "Type (auto)",
    id: "type"
  }, {
    title: "Complete (w:120)",
    id: "complete",
    width: 120
  }]));
  return <WidthStoryShell cols={cols} onColumnResize={onColumnResize} description={<>
                    <b>Кейс: микс фиксированных и авто-колонок</b>
                    {"\\n"}
                    ID, Priority, Complete имеют width =grow: 0 (фиксированные, 350px суммарно).{"\\n"}
                    Title, Type без width =grow: 1 (делят оставшиеся ~1150px через grow).{"\\n"}
                    Ожидание: Title и Type заполняют все свободное место.
                </>} />;
}`,...(O=(G=u.parameters)==null?void 0:G.docs)==null?void 0:O.source}}};var $,B,k;h.parameters={...h.parameters,docs:{...($=h.parameters)==null?void 0:$.docs,source:{originalSource:`function CW_MinWidthNoWidth() {
  const {
    cols,
    onColumnResize
  } = useResizableCols(withAdaptedGrow([{
    title: "ID (min:50)",
    id: "id",
    minWidth: 50
  }, {
    title: "Title (min:200)",
    id: "title",
    minWidth: 200
  }, {
    title: "Priority (min:100)",
    id: "priority",
    minWidth: 100
  }, {
    title: "Type (min:80)",
    id: "type",
    minWidth: 80
  }, {
    title: "Complete (min:60)",
    id: "complete",
    minWidth: 60
  }]));
  return <WidthStoryShell cols={cols} onColumnResize={onColumnResize} description={<>
                    <b>Кейс: только minWidth (без width =grow: 1)</b>
                    {"\\n"}
                    Все колонки auto-size + grow. minWidth задает нижнюю границу.{"\\n"}
                    Ожидание: колонки не уже minWidth, grow заполняет контейнер.{"\\n"}
                    Ресайз: нельзя сузить ниже minWidth.
                </>} />;
}`,...(k=(B=h.parameters)==null?void 0:B.docs)==null?void 0:k.source}}};var N,H,L;w.parameters={...w.parameters,docs:{...(N=w.parameters)==null?void 0:N.docs,source:{originalSource:`function CW_MaxWidthAllCapped() {
  const {
    cols,
    onColumnResize
  } = useResizableCols(withAdaptedGrow([{
    title: "ID (max:100)",
    id: "id",
    maxWidth: 100
  }, {
    title: "Title (max:250)",
    id: "title",
    maxWidth: 250
  }, {
    title: "Priority (max:120)",
    id: "priority",
    maxWidth: 120
  }, {
    title: "Type (max:180)",
    id: "type",
    maxWidth: 180
  }, {
    title: "Complete (max:90)",
    id: "complete",
    maxWidth: 90
  }]));
  return <WidthStoryShell cols={cols} onColumnResize={onColumnResize} description={<>
                    <b>Кейс: только maxWidth (без width =grow: 1)</b>
                    {"\\n"}
                    Все колонки auto-size + grow. Сумма maxWidth = 740px, контейнер = 1500px.{"\\n"}
                    grow довел все колонки до maxWidth. Дальше расти некуда =760px пустого места.{"\\n"}
                    ПОБОЧНЫЙ ЭФФЕКТ: ресайз заблокирован (все уперлись, grow возвращает обратно).{"\\n"}
                    Это ожидаемо: нет "свободной" колонки-поглотителя.
                </>} />;
}`,...(L=(H=w.parameters)==null?void 0:H.docs)==null?void 0:L.source}}};var K,X,Y;x.parameters={...x.parameters,docs:{...(K=x.parameters)==null?void 0:K.docs,source:{originalSource:`function CW_MaxWidthWithFreeColumn() {
  const {
    cols,
    onColumnResize
  } = useResizableCols(withAdaptedGrow([{
    title: "ID (w:80)",
    id: "id",
    width: 80
  }, {
    title: "Title (max:250)",
    id: "title",
    maxWidth: 250
  }, {
    title: "Priority (max:120)",
    id: "priority",
    maxWidth: 120
  }, {
    title: "Type (без ограничений)",
    id: "type"
  }, {
    title: "Complete (w:120)",
    id: "complete",
    width: 120
  }]));
  return <WidthStoryShell cols={cols} onColumnResize={onColumnResize} description={<>
                    <b>Кейс: maxWidth + свободная колонка-поглотитель</b>
                    {"\\n"}
                    ID, Complete фиксированные (grow: 0). Title, Priority, Type без width (grow: 1).{"\\n"}
                    Title ограничен 250px, Priority 120px. Type без ограничений.{"\\n"}
                    Ожидание: Title=250, Priority=120, Type забирает остаток (~930px).{"\\n"}
                    Ресайз: Title и Priority можно сузить, излишек уйдет в Type.
                </>} />;
}`,...(Y=(X=x.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var U,V,j;y.parameters={...y.parameters,docs:{...(U=y.parameters)==null?void 0:U.docs,source:{originalSource:`function CW_MinMaxWithFreeColumn() {
  const {
    cols,
    onColumnResize
  } = useResizableCols(withAdaptedGrow([{
    title: "ID (w:80)",
    id: "id",
    width: 80
  }, {
    title: "Title (min:200, max:400)",
    id: "title",
    minWidth: 200,
    maxWidth: 400
  }, {
    title: "Priority (min:80, max:150)",
    id: "priority",
    minWidth: 80,
    maxWidth: 150
  }, {
    title: "Type (без ограничений)",
    id: "type"
  }, {
    title: "Complete (w:120)",
    id: "complete",
    width: 120
  }]));
  return <WidthStoryShell cols={cols} onColumnResize={onColumnResize} description={<>
                    <b>Кейс: minWidth + maxWidth + свободная колонка</b>
                    {"\\n"}
                    ID, Complete фиксированные (grow: 0). Title, Priority, Type без width (grow: 1).{"\\n"}
                    Title: 200-400px. Priority: 80-150px. Type: без ограничений.{"\\n"}
                    Ожидание: Title=400, Priority=150, Type забирает остаток (~750px).{"\\n"}
                    Ресайз: Title можно сузить до 200, освобожденное место уйдет в Type.
                </>} />;
}`,...(j=(V=y.parameters)==null?void 0:V.docs)==null?void 0:j.source}}};var q,J,Q;W.parameters={...W.parameters,docs:{...(q=W.parameters)==null?void 0:q.docs,source:{originalSource:`function CW_MaxAutoWidthWithFreeColumn() {
  const {
    cols,
    onColumnResize
  } = useResizableCols(withAdaptedGrow([{
    title: "ID (w:80)",
    id: "id",
    width: 80
  }, {
    title: "Title (maxAuto:200)",
    id: "title",
    maxAutoWidth: 200
  }, {
    title: "Priority (maxAuto:100)",
    id: "priority",
    maxAutoWidth: 100
  }, {
    title: "Type (без ограничений)",
    id: "type"
  }, {
    title: "Complete (w:120)",
    id: "complete",
    width: 120
  }]));
  return <WidthStoryShell cols={cols} onColumnResize={onColumnResize} description={<>
                    <b>Кейс: maxAutoWidth + свободная колонка (ОСНОВНОЙ КЕЙС обёртки)</b>
                    {"\\n"}
                    ID, Complete фиксированные (grow: 0). Title, Priority, Type без width (grow: 1).{"\\n"}
                    Title ограничен maxAutoWidth=200, Priority maxAutoWidth=100. Type без ограничений.{"\\n"}
                    Ожидание: Title=200, Priority=100, Type забирает остаток (~1000px).{"\\n"}
                    Ресайз: Title и Priority можно расширить шире maxAutoWidth (мягкое ограничение).
                </>} />;
}`,...(Q=(J=W.parameters)==null?void 0:J.docs)==null?void 0:Q.source}}};var Z,tt,et;C.parameters={...C.parameters,docs:{...(Z=C.parameters)==null?void 0:Z.docs,source:{originalSource:`function CW_RealTableSimulation() {
  const {
    cols,
    onColumnResize
  } = useResizableCols(withAdaptedGrow([{
    title: "# (w:50)",
    id: "num",
    width: 50
  }, {
    title: "Имя (min:150, maxAuto:300)",
    id: "name",
    minWidth: 150,
    maxAutoWidth: 300
  }, {
    title: "Статус (maxAuto:100, max:200)",
    id: "status",
    maxAutoWidth: 100,
    maxWidth: 200
  }, {
    title: "Описание (без ограничений)",
    id: "desc"
  }, {
    title: "Дата (w:120)",
    id: "date",
    width: 120
  }]));
  return <WidthStoryShell cols={cols} onColumnResize={onColumnResize} description={<>
                    <b>Кейс: симуляция реальной таблицы (как в обёртке)</b>
                    {"\\n"}# и Дата — фиксированные (width =grow: 0). Остальные auto (grow: 1).{"\\n"}
                    Имя: min 150, auto до 300. Статус: auto до 100, ресайз до 200.{"\\n"}
                    Описание: без ограничений, колонка-поглотитель.{"\\n"}
                    Ожидание: Имя=300, Статус=100, Описание забирает остаток.{"\\n"}
                    Ресайз: Имя можно сузить до 150 или расширить шире 300. Статус до 200 макс.
                </>} />;
}`,...(et=(tt=C.parameters)==null?void 0:tt.docs)==null?void 0:et.source}}};var nt,it,ot;g.parameters={...g.parameters,docs:{...(nt=g.parameters)==null?void 0:nt.docs,source:{originalSource:`function CW_DifferentGrowWeights() {
  const {
    cols,
    onColumnResize
  } = useResizableCols([{
    title: "ID (w:80)",
    id: "id",
    width: 80,
    grow: 0
  }, {
    title: "Title (maxAuto:300, grow:3)",
    id: "title",
    maxAutoWidth: 300,
    grow: 3
  }, {
    title: "Priority (maxAuto:150, grow:1)",
    id: "priority",
    maxAutoWidth: 150,
    grow: 1
  }, {
    title: "Type (grow:2)",
    id: "type",
    grow: 2
  }, {
    title: "Complete (w:120)",
    id: "complete",
    width: 120,
    grow: 0
  }]);
  return <WidthStoryShell cols={cols} onColumnResize={onColumnResize} description={<>
                    <b>Кейс: разные веса grow (3, 1, 2)</b>
                    {"\\n"}
                    Title grow:3, Priority grow:1, Type grow:2. Свободное место ~1300px.{"\\n"}
                    Title хочет 650px (3/6), но cap=300 =получает 300. Остаток перераспределяется.{"\\n"}
                    Priority хочет ~217px (1/6), но cap=150 =получает 150.{"\\n"}
                    Type без cap =забирает весь остаток (~850px).
                </>} />;
}`,...(ot=(it=g.parameters)==null?void 0:it.docs)==null?void 0:ot.source}}};var rt,lt,dt;T.parameters={...T.parameters,docs:{...(rt=T.parameters)==null?void 0:rt.docs,source:{originalSource:`function CW_NarrowContainer() {
  const {
    cols,
    onColumnResize
  } = useResizableCols(withAdaptedGrow([{
    title: "ID (w:200)",
    id: "id",
    width: 200
  }, {
    title: "Title (w:400)",
    id: "title",
    width: 400
  }, {
    title: "Priority (w:300)",
    id: "priority",
    width: 300
  }, {
    title: "Type (w:350)",
    id: "type",
    width: 350
  }, {
    title: "Complete (w:250)",
    id: "complete",
    width: 250
  }]));
  return <WidthStoryShell cols={cols} onColumnResize={onColumnResize} width={800} description={<>
                    <b>Кейс: колонки шире контейнера (800px)</b>
                    {"\\n"}
                    Все с width (grow: 0). Сумма 1500px шире 800px контейнера.{"\\n"}
                    Ожидание: горизонтальный скролл, колонки на своих ширинах.{"\\n"}
                    grow не работает (нет свободного места). Ресайз нормальный.
                </>} />;
}`,...(dt=(lt=T.parameters)==null?void 0:lt.docs)==null?void 0:dt.source}}};var at,st,mt;f.parameters={...f.parameters,docs:{...(at=f.parameters)==null?void 0:at.docs,source:{originalSource:`function CW_30ColumnsMinMax() {
  const {
    cols,
    onColumnResize
  } = useResizableCols(withAdaptedGrow(make30Columns()));
  return <div style={{
    display: "flex",
    gap: 16,
    width: 1600,
    height: 600
  }}>
            <div style={{
      flex: 1,
      minWidth: 0
    }}>
                <div style={{
        marginBottom: 8,
        fontFamily: "monospace",
        fontSize: 13,
        lineHeight: 1.5,
        whiteSpace: "pre-wrap"
      }}>
                    <b>Кейс: 30 колонок с minWidth/maxWidth, без grow</b>
                    {"\\n"}
                    Все с width (grow: 0). Суммарно ~2400px, контейнер 1200px.{"\\n"}
                    В grow-if НЕ заходим. Горизонтальный скролл.{"\\n"}
                    minWidth не даёт сжать ниже, maxWidth не даёт расширить выше.
                </div>
                <DataEditor width={1200} height={480} getCellContent={getWidthTestData} getCellsForSelection={true} columns={cols} rows={100} onColumnResize={onColumnResize} />
            </div>
            <ColumnInfoPanel cols={cols} />
        </div>;
}`,...(mt=(st=f.parameters)==null?void 0:st.docs)==null?void 0:mt.source}}};var pt,ct,ut;b.parameters={...b.parameters,docs:{...(pt=b.parameters)==null?void 0:pt.docs,source:{originalSource:`function CW_SingleColumnMax3000() {
  const {
    cols,
    onColumnResize
  } = useResizableCols(withAdaptedGrow([{
    title: "Title (max:3000, maxAuto:3000)",
    id: "title",
    maxWidth: 3000,
    maxAutoWidth: 3000
  }]));
  return <WidthStoryShell cols={cols} onColumnResize={onColumnResize} description={<>
                    <b>Кейс: одна колонка, grow:1, maxWidth:3000</b>
                    {"\\n"}
                    Контейнер 1500px. maxWidth 3000 — потолок выше контейнера.{"\\n"}
                    Ожидание: колонка займёт все 1500px (grow заполнит контейнер).
                </>} />;
}`,...(ut=(ct=b.parameters)==null?void 0:ct.docs)==null?void 0:ut.source}}};var ht,wt,xt;z.parameters={...z.parameters,docs:{...(ht=z.parameters)==null?void 0:ht.docs,source:{originalSource:`function CW_SidebarResize() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const observedWidth = useContainerWidth(containerRef);
  const {
    cols,
    onColumnResize
  } = useResizableCols(withAdaptedGrow([{
    title: "ID (w:80)",
    id: "id",
    width: 80
  }, {
    title: "Title",
    id: "title"
  }, {
    title: "Priority",
    id: "priority"
  }, {
    title: "Type",
    id: "type"
  }, {
    title: "Complete (w:120)",
    id: "complete",
    width: 120
  }]));
  return <div style={{
    display: "flex",
    width: 1600,
    height: 600
  }}>
            <div ref={containerRef} style={{
      width: sidebarOpen ? 1000 : 1500,
      transition: "width 0.3s ease",
      overflow: "hidden"
    }}>
                <div style={{
        marginBottom: 8,
        fontFamily: "monospace",
        fontSize: 13,
        lineHeight: 1.5,
        whiteSpace: "pre-wrap"
      }}>
                    <b>Кейс: сайдбар влияет на ширину контейнера</b>
                    {"\\n"}
                    Контейнер: {observedWidth}px (анимируется). Title, Priority, Type — grow:1.{"\\n"}
                    При открытии сайдбара контейнер сужается 1500→1000px.
                </div>
                <button onClick={() => setSidebarOpen(s => !s)} style={{
        marginBottom: 8,
        padding: "4px 12px",
        cursor: "pointer"
      }}>
                    {sidebarOpen ? "Закрыть сайдбар" : "Открыть сайдбар"}
                </button>
                {observedWidth > 0 && <DataEditor width={observedWidth} height={450} getCellContent={getWidthTestData} getCellsForSelection={true} columns={cols} rows={100} onColumnResize={onColumnResize} smoothScrollX={true} />}
            </div>
            {sidebarOpen && <div style={{
      width: 500,
      background: "#f0f0f0",
      borderLeft: "2px solid #ccc",
      padding: 16,
      fontFamily: "monospace",
      fontSize: 13
    }}>
                    <b>Сайдбар</b>
                    <p>Этот сайдбар сужает контейнер таблицы на 500px.</p>
                    <p>Grow-колонки должны перераспределиться.</p>
                </div>}
        </div>;
}`,...(xt=(wt=z.parameters)==null?void 0:wt.docs)==null?void 0:xt.source}}};const Mt=["CW_AllWithWidth","CW_AllNoWidth","CW_MixedWidthAndAuto","CW_MinWidthNoWidth","CW_MaxWidthAllCapped","CW_MaxWidthWithFreeColumn","CW_MinMaxWithFreeColumn","CW_MaxAutoWidthWithFreeColumn","CW_RealTableSimulation","CW_DifferentGrowWeights","CW_NarrowContainer","CW_30ColumnsMinMax","CW_SingleColumnMax3000","CW_SidebarResize"];export{f as CW_30ColumnsMinMax,c as CW_AllNoWidth,p as CW_AllWithWidth,g as CW_DifferentGrowWeights,W as CW_MaxAutoWidthWithFreeColumn,w as CW_MaxWidthAllCapped,x as CW_MaxWidthWithFreeColumn,y as CW_MinMaxWithFreeColumn,h as CW_MinWidthNoWidth,u as CW_MixedWidthAndAuto,T as CW_NarrowContainer,C as CW_RealTableSimulation,z as CW_SidebarResize,b as CW_SingleColumnMax3000,Mt as __namedExportsOrder,Ft as default};
