import{R as e}from"./iframe-sA5cxhH0.js";import{D as l}from"./data-editor-all-CtJna6Cq.js";import{B as i,D as m,u as p,d as c}from"./utils-DXRyaGtM.js";import{S as u}from"./story-utils-CcbOwPnx.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-CA2ZLF0t.js";import"./throttle-B_ZU_1xq.js";import"./marked.esm-BeK7MPHt.js";import"./flatten-CcIdJbQZ.js";import"./scrolling-data-grid-k0F803YP.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-B3wGtvVp.js";const O={title:"Glide-Data-Grid/DataEditor Demos",decorators:[t=>e.createElement(u,null,e.createElement(i,{title:"One Million Rows",description:e.createElement(m,null,"Data grid supports over 1 million rows. Your limit is mostly RAM.")},e.createElement(t,null)))]},r=()=>{const{cols:t,getCellContent:n}=p(6);return e.createElement(l,{...c,getCellContent:n,columns:t,rowHeight:31,rows:1e6,rowMarkers:"number"})};var o,s,a;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(6);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={cols} rowHeight={31} rows={1_000_000} rowMarkers="number" />;
}`,...(a=(s=r.parameters)==null?void 0:s.docs)==null?void 0:a.source}}};const h=["OneMillionRows"];export{r as OneMillionRows,h as __namedExportsOrder,O as default};
