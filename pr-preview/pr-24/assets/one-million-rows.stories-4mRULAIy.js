import{R as e}from"./iframe-B5XmEgy5.js";import{D as l}from"./data-editor-all-Cz0EY8r1.js";import{B as i,D as m,u as c,d as p}from"./utils-Dw8hJtmC.js";import{S as u}from"./story-utils-B5axrbhE.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-DKsvR5Ui.js";import"./marked.esm-D7g0DxGq.js";import"./scrolling-data-grid-BskDifbr.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-AINEZqF_.js";const k={title:"Glide-Data-Grid/DataEditor Demos",decorators:[t=>e.createElement(u,null,e.createElement(i,{title:"One Million Rows",description:e.createElement(m,null,"Data grid supports over 1 million rows. Your limit is mostly RAM.")},e.createElement(t,null)))]},r=()=>{const{cols:t,getCellContent:n}=c(6);return e.createElement(l,{...p,getCellContent:n,columns:t,rowHeight:31,rows:1e6,rowMarkers:"number"})};var o,s,a;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(6);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={cols} rowHeight={31} rows={1_000_000} rowMarkers="number" />;
}`,...(a=(s=r.parameters)==null?void 0:s.docs)==null?void 0:a.source}}};const G=["OneMillionRows"];export{r as OneMillionRows,G as __namedExportsOrder,k as default};
