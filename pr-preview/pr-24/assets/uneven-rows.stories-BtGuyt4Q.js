import{R as e}from"./iframe-B5XmEgy5.js";import{D as m}from"./data-editor-all-Cz0EY8r1.js";import{B as c,D as i,P as p,u,d}from"./utils-Dw8hJtmC.js";import{S as w}from"./story-utils-B5axrbhE.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-DKsvR5Ui.js";import"./marked.esm-D7g0DxGq.js";import"./scrolling-data-grid-BskDifbr.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-AINEZqF_.js";const b={title:"Glide-Data-Grid/DataEditor Demos",decorators:[r=>e.createElement(w,null,e.createElement(c,{title:"Uneven Rows",description:e.createElement(i,null,"Rows can be made uneven by passing a callback to the ",e.createElement(p,null,"rowHeight")," prop")},e.createElement(r,null)))]},t=()=>{const{cols:r,getCellContent:l}=u(6);return e.createElement(m,{...d,rowHeight:o=>o%3===0?30:o%2?50:60,getCellContent:l,columns:r,rows:1e3})};var a,n,s;t.parameters={...t.parameters,docs:{...(a=t.parameters)==null?void 0:a.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(6);
  return <DataEditor {...defaultProps} rowHeight={r => r % 3 === 0 ? 30 : r % 2 ? 50 : 60} getCellContent={getCellContent} columns={cols} rows={1000} />;
}`,...(s=(n=t.parameters)==null?void 0:n.docs)==null?void 0:s.source}}};const k=["UnevenRows"];export{t as UnevenRows,k as __namedExportsOrder,b as default};
