import{R as e}from"./iframe-vS6kewij.js";import{D as W}from"./data-editor-all-pSxBhyFb.js";import{B as f,D as E,P as o,M as D,d as R}from"./utils-DmWGjTXm.js";import{S as g}from"./story-utils-DtA8Tvf2.js";import{G}from"./image-window-loader-BDQ0svk5.js";import"./preload-helper-C1FmrZbK.js";import"./throttle-Bg7BnV3d.js";import"./flatten-BZi04caO.js";import"./scrolling-data-grid-BTSQjLvf.js";import"./marked.esm-d_BjGHzM.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-8owi7hvw.js";const A={title:"Glide-Data-Grid/DataEditor Demos",decorators:[t=>e.createElement(g,null,e.createElement(f,{title:"Per-column minWidth / maxWidth (ограничения ширины на колонку)",description:e.createElement(e.Fragment,null,e.createElement(E,null,"Каждая колонка может задать собственные ограничения ",e.createElement(o,null,"minWidth")," и"," ",e.createElement(o,null,"maxWidth"),". Они перекрывают глобальные"," ",e.createElement(o,null,"minColumnWidth")," / ",e.createElement(o,null,"maxColumnWidth"),"."),e.createElement(D,null,"Попробуйте изменить ширину колонок ниже. «Фиксированная 200px» заблокирована на 200px. «Мин 150px» не сужается меньше 150. «Макс 250px» не расширяется больше 250. «Мин 100 / Макс 300» ограничена диапазоном. «Без ограничений» использует глобальные значения."))},e.createElement(t,null)))]},x=[{title:"Clamp: width 50 → min 200",width:50,minWidth:200},{title:"Clamp: width 500 → max 250",width:500,maxWidth:250},{title:"Мин 150px",width:180,minWidth:150},{title:"Мин 100 / Макс 300",width:200,minWidth:100,maxWidth:300},{title:"Без ограничений",width:200},{title:"Растягиваемая (мин 120)",grow:1,minWidth:120}],u=Array.from({length:100},(t,a)=>x.map((d,m)=>`Row ${a} Col ${m}`)),r=()=>{const[t,a]=e.useState(x),d=e.useCallback((n,l)=>{a(i=>{const s=i.findIndex(w=>w.title===n.title);if(s===-1)return i;const c=[...i];return c[s]={...i[s],width:l},c})},[]),m=e.useCallback(([n,l])=>({kind:G.Text,displayData:u[l][n],data:u[l][n],allowOverlay:!1,readonly:!0}),[]);return e.createElement(W,{...R,getCellContent:m,columns:t,rows:100,maxColumnWidth:2e3,minColumnWidth:50,onColumnResize:d})};var C,p,h;r.parameters={...r.parameters,docs:{...(C=r.parameters)==null?void 0:C.docs,source:{originalSource:`() => {
  const [cols, setCols] = React.useState<GridColumn[]>(initialColumns);
  const onColumnResize = React.useCallback((column: GridColumn, newSize: number) => {
    setCols(prev => {
      const index = prev.findIndex(c => c.title === column.title);
      if (index === -1) return prev;
      const newCols = [...prev];
      newCols[index] = {
        ...prev[index],
        width: newSize
      };
      return newCols;
    });
  }, []);
  const getCellContent = React.useCallback(([col, row]: Item): GridCell => {
    return {
      kind: GridCellKind.Text,
      displayData: data[row][col],
      data: data[row][col],
      allowOverlay: false,
      readonly: true
    };
  }, []);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={cols} rows={100} maxColumnWidth={2000} minColumnWidth={50} onColumnResize={onColumnResize} />;
}`,...(h=(p=r.parameters)==null?void 0:p.docs)==null?void 0:h.source}}};const B=["PerColumnMinMaxWidth"];export{r as PerColumnMinMaxWidth,B as __namedExportsOrder,A as default};
