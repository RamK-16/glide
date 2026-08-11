import{R as e}from"./iframe-B5XmEgy5.js";import{D as n}from"./data-editor-all-Cz0EY8r1.js";import{B as i,D as m,u as c,d as p}from"./utils-Dw8hJtmC.js";import{S as u}from"./story-utils-B5axrbhE.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-DKsvR5Ui.js";import"./marked.esm-D7g0DxGq.js";import"./scrolling-data-grid-BskDifbr.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-AINEZqF_.js";const T={title:"Glide-Data-Grid/DataEditor Demos",decorators:[r=>e.createElement(u,null,e.createElement(i,{title:"Ten Million Cells",description:e.createElement(m,null,"Data grid supports over 10 million cells. Go nuts with it.")},e.createElement(r,null)))]},t=()=>{const{cols:r,getCellContent:a}=c(100);return e.createElement(n,{...p,rowMarkers:"number",getCellContent:a,columns:r,rows:1e5})};var o,l,s;t.parameters={...t.parameters,docs:{...(o=t.parameters)==null?void 0:o.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(100);
  return <DataEditor {...defaultProps} rowMarkers="number" getCellContent={getCellContent} columns={cols} rows={100_000} />;
}`,...(s=(l=t.parameters)==null?void 0:l.docs)==null?void 0:s.source}}};const _=["TenMillionCells"];export{t as TenMillionCells,_ as __namedExportsOrder,T as default};
