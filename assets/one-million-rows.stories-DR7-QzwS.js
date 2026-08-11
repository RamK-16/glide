import{R as e}from"./iframe-DwHATARk.js";import{D as l}from"./data-editor-all-CATdV2tK.js";import{B as i,D as m,u as c,d as p}from"./utils-_-BHhp7b.js";import{S as u}from"./story-utils-JY22F43l.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-DIBWkkqi.js";import"./marked.esm-U8ipOrG_.js";import"./scrolling-data-grid-DKxj2AxU.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-NKb2IHJp.js";const k={title:"Glide-Data-Grid/DataEditor Demos",decorators:[t=>e.createElement(u,null,e.createElement(i,{title:"One Million Rows",description:e.createElement(m,null,"Data grid supports over 1 million rows. Your limit is mostly RAM.")},e.createElement(t,null)))]},r=()=>{const{cols:t,getCellContent:n}=c(6);return e.createElement(l,{...p,getCellContent:n,columns:t,rowHeight:31,rows:1e6,rowMarkers:"number"})};var o,s,a;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(6);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={cols} rowHeight={31} rows={1_000_000} rowMarkers="number" />;
}`,...(a=(s=r.parameters)==null?void 0:s.docs)==null?void 0:a.source}}};const G=["OneMillionRows"];export{r as OneMillionRows,G as __namedExportsOrder,k as default};
