import{R as e}from"./iframe-D6f5d7xm.js";import{D as l}from"./data-editor-all-DfWQ_H6R.js";import{B as i,D as m,u as p,d as c}from"./utils-BV3YHQta.js";import{S as u}from"./story-utils-CR4mHb4g.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-C-mV7PkX.js";import"./throttle-DFnnZt85.js";import"./marked.esm-CaW3tWQk.js";import"./flatten-9n7OisLP.js";import"./scrolling-data-grid-Dld5XaK9.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-D2fkOugv.js";const O={title:"Glide-Data-Grid/DataEditor Demos",decorators:[t=>e.createElement(u,null,e.createElement(i,{title:"One Million Rows",description:e.createElement(m,null,"Data grid supports over 1 million rows. Your limit is mostly RAM.")},e.createElement(t,null)))]},r=()=>{const{cols:t,getCellContent:n}=p(6);return e.createElement(l,{...c,getCellContent:n,columns:t,rowHeight:31,rows:1e6,rowMarkers:"number"})};var o,s,a;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(6);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={cols} rowHeight={31} rows={1_000_000} rowMarkers="number" />;
}`,...(a=(s=r.parameters)==null?void 0:s.docs)==null?void 0:a.source}}};const h=["OneMillionRows"];export{r as OneMillionRows,h as __namedExportsOrder,O as default};
