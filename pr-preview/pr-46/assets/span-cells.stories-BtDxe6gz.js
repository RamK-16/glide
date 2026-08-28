import{r as e}from"./iframe-gAOLjoLa.js";import{B as z}from"./story-utils-B8ySLVQn.js";import{G as R}from"./image-window-loader-Dz22i1uq.js";import{D as H}from"./data-editor-all-BGZjIGQw.js";import"./preload-helper-C1FmrZbK.js";import"./marked.esm-B7yOw_qN.js";import"./throttle-Bge67UJ4.js";import"./flatten-CQRU4ZyZ.js";import"./scrolling-data-grid-BRouUnBX.js";const j={title:"Tests/SpanCells",decorators:[t=>e.createElement(z,{width:1200,height:620},e.createElement(t,null))]};function B(t,n,a){return t.find(l=>n>=l.startCol&&n<=l.endCol&&a>=l.startRow&&a<=l.endRow)}function m(t,n=170){return Array.from({length:t},(a,l)=>({title:`Col ${l}`,width:n}))}function g({cols:t,merges:n,description:a,rowHeight:l,width:s=1200,height:r=620,freezeColumns:C}){const x=e.useCallback(([u,w])=>{const o=B(n,u,w);return o!==void 0?{kind:R.Text,displayData:o.label,data:o.label,allowOverlay:!1,readonly:!0,span:o.startCol===o.endCol?void 0:[o.startCol,o.endCol],spanRows:o.startRow===o.endRow?void 0:[o.startRow,o.endRow],spanAlign:o.spanAlign}:{kind:R.Text,displayData:`${u}·${w}`,data:`${u} ${w}`,allowOverlay:!1,readonly:!0}},[n]);return e.createElement("div",{style:{width:s,height:r}},e.createElement("div",{style:{marginBottom:8,fontFamily:"monospace",fontSize:13,lineHeight:1.5,whiteSpace:"pre-wrap"}},a),e.createElement(H,{width:s,height:r-120,getCellContent:x,getCellsForSelection:!0,columns:t,rows:200,rowMarkers:"both",rowHeight:l,freezeColumns:C}))}function c(){const t=m(5),n=[{startRow:1,endRow:3,startCol:0,endCol:0,label:"rowspan 1–3"},{startRow:5,endRow:8,startCol:1,endCol:1,label:"rowspan 5–8"},{startRow:1,endRow:2,startCol:2,endCol:3,label:"блок 2×2"}];return e.createElement(g,{cols:t,merges:n,description:e.createElement(e.Fragment,null,e.createElement("b",null,"Базовое объединение ячеек тела"),`
`,"Col0 строки 1–3 (rowspan), Col1 строки 5–8 (rowspan), Col2–3 строки 1–2 (прямоугольник 2×2). Контент по центру (дефолт), внутренних линий сетки внутри блока нет.")})}c.decorators=[];function i(){const t=m(3,220),n=["left","center","right"],a=["top","center","bottom"],l=[];for(let s=0;s<3;s++)for(let r=0;r<3;r++){const C=s*3;l.push({startRow:C,endRow:C+2,startCol:r,endCol:r,label:`${n[r]}/${a[s]}`,spanAlign:{horizontal:n[r],vertical:a[s]}})}return e.createElement(g,{cols:t,merges:l,rowHeight:44,description:e.createElement(e.Fragment,null,e.createElement("b",null,"Матрица выравнивания (9 комбинаций spanAlign)"),`
`,"3 колонки × 3 блока по 3 строки. Горизонталь left/center/right × вертикаль top/center/bottom.")})}i.decorators=[];function p(){const t=m(4),n=[{startRow:2,endRow:10,startCol:0,endCol:0,label:"tall 2–10 (top)",spanAlign:{vertical:"top"}},{startRow:4,endRow:12,startCol:2,endCol:2,label:"tall 4–12 (center)",spanAlign:{vertical:"center"}}];return e.createElement(g,{cols:t,merges:n,description:e.createElement(e.Fragment,null,e.createElement("b",null,"Scroll-safe (origin уезжает выше)"),`
`,"Высокие блоки: Col0 строки 2–10, Col2 строки 4–12. Прокрути вниз так, чтобы верхняя (origin) строка блока ушла выше видимой области — блок и текст должны остаться корректными.")})}p.decorators=[];function d(){const t=m(5),n=[{startRow:1,endRow:1,startCol:0,endCol:2,label:"colspan 0–2",spanAlign:{horizontal:"center"}},{startRow:3,endRow:5,startCol:1,endCol:3,label:"блок 3×3",spanAlign:{horizontal:"center",vertical:"center"}}];return e.createElement(g,{cols:t,merges:n,description:e.createElement(e.Fragment,null,e.createElement("b",null,"Colspan + прямоугольный блок"),`
`,"Row1 Col0–2 — чистый горизонтальный colspan (центр); Col1–3 строки 3–5 — прямоугольник 3×3 (центр по обеим осям).")})}d.decorators=[];var b,S,f;c.parameters={...c.parameters,docs:{...(b=c.parameters)==null?void 0:b.docs,source:{originalSource:`function SC_Basic() {
  const cols = makeCols(5);
  const merges: Merge[] = [{
    startRow: 1,
    endRow: 3,
    startCol: 0,
    endCol: 0,
    label: "rowspan 1–3"
  }, {
    startRow: 5,
    endRow: 8,
    startCol: 1,
    endCol: 1,
    label: "rowspan 5–8"
  }, {
    startRow: 1,
    endRow: 2,
    startCol: 2,
    endCol: 3,
    label: "блок 2×2"
  }];
  return <CellSpanShell cols={cols} merges={merges} description={<>
                    <b>Базовое объединение ячеек тела</b>
                    {"\\n"}Col0 строки 1–3 (rowspan), Col1 строки 5–8 (rowspan), Col2–3 строки 1–2 (прямоугольник 2×2).
                    Контент по центру (дефолт), внутренних линий сетки внутри блока нет.
                </>} />;
}`,...(f=(S=c.parameters)==null?void 0:S.docs)==null?void 0:f.source}}};var h,A,E;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`function SC_AlignMatrix() {
  const cols = makeCols(3, 220);
  const H: NonNullable<SpanAlignment["horizontal"]>[] = ["left", "center", "right"];
  const V: NonNullable<SpanAlignment["vertical"]>[] = ["top", "center", "bottom"];
  const merges: Merge[] = [];
  for (let b = 0; b < 3; b++) {
    for (let c = 0; c < 3; c++) {
      const startRow = b * 3;
      merges.push({
        startRow,
        endRow: startRow + 2,
        startCol: c,
        endCol: c,
        label: \`\${H[c]}/\${V[b]}\`,
        spanAlign: {
          horizontal: H[c],
          vertical: V[b]
        }
      });
    }
  }
  return <CellSpanShell cols={cols} merges={merges} rowHeight={44} description={<>
                    <b>Матрица выравнивания (9 комбинаций spanAlign)</b>
                    {"\\n"}3 колонки × 3 блока по 3 строки. Горизонталь left/center/right × вертикаль top/center/bottom.
                </>} />;
}`,...(E=(A=i.parameters)==null?void 0:A.docs)==null?void 0:E.source}}};var v,_,y;p.parameters={...p.parameters,docs:{...(v=p.parameters)==null?void 0:v.docs,source:{originalSource:`function SC_ScrollSafe() {
  const cols = makeCols(4);
  const merges: Merge[] = [{
    startRow: 2,
    endRow: 10,
    startCol: 0,
    endCol: 0,
    label: "tall 2–10 (top)",
    spanAlign: {
      vertical: "top"
    }
  }, {
    startRow: 4,
    endRow: 12,
    startCol: 2,
    endCol: 2,
    label: "tall 4–12 (center)",
    spanAlign: {
      vertical: "center"
    }
  }];
  return <CellSpanShell cols={cols} merges={merges} description={<>
                    <b>Scroll-safe (origin уезжает выше)</b>
                    {"\\n"}Высокие блоки: Col0 строки 2–10, Col2 строки 4–12. Прокрути вниз так, чтобы верхняя (origin)
                    строка блока ушла выше видимой области — блок и текст должны остаться корректными.
                </>} />;
}`,...(y=(_=p.parameters)==null?void 0:_.docs)==null?void 0:y.source}}};var k,M,$;d.parameters={...d.parameters,docs:{...(k=d.parameters)==null?void 0:k.docs,source:{originalSource:`function SC_RectAndColspan() {
  const cols = makeCols(5);
  const merges: Merge[] = [{
    startRow: 1,
    endRow: 1,
    startCol: 0,
    endCol: 2,
    label: "colspan 0–2",
    spanAlign: {
      horizontal: "center"
    }
  }, {
    startRow: 3,
    endRow: 5,
    startCol: 1,
    endCol: 3,
    label: "блок 3×3",
    spanAlign: {
      horizontal: "center",
      vertical: "center"
    }
  }];
  return <CellSpanShell cols={cols} merges={merges} description={<>
                    <b>Colspan + прямоугольный блок</b>
                    {"\\n"}Row1 Col0–2 — чистый горизонтальный colspan (центр); Col1–3 строки 3–5 — прямоугольник 3×3
                    (центр по обеим осям).
                </>} />;
}`,...($=(M=d.parameters)==null?void 0:M.docs)==null?void 0:$.source}}};const q=["SC_Basic","SC_AlignMatrix","SC_ScrollSafe","SC_RectAndColspan"];export{i as SC_AlignMatrix,c as SC_Basic,d as SC_RectAndColspan,p as SC_ScrollSafe,q as __namedExportsOrder,j as default};
