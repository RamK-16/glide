import{R as e}from"./iframe-B5XmEgy5.js";import{D as n}from"./data-editor-all-Cz0EY8r1.js";import{B as i,D as m,u as c,d as p}from"./utils-Dw8hJtmC.js";import{S as u}from"./story-utils-B5axrbhE.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-DKsvR5Ui.js";import"./marked.esm-D7g0DxGq.js";import"./scrolling-data-grid-BskDifbr.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-AINEZqF_.js";const M={title:"Glide-Data-Grid/DataEditor Demos",decorators:[t=>e.createElement(u,null,e.createElement(i,{title:"100 Million Rows",description:e.createElement(m,null,"100 million rows is silly. Once we cross about 33 million pixels in height we can no longer trust the browser to scroll accurately.")},e.createElement(t,null)))]},r=()=>{const{cols:t,getCellContent:a}=c(6);return e.createElement(n,{...p,getCellContent:a,columns:t,rowHeight:31,rows:1e8,rowMarkers:"number"})};var o,s,l;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(6);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={cols} rowHeight={31} rows={100_000_000} rowMarkers="number" />;
}`,...(l=(s=r.parameters)==null?void 0:s.docs)==null?void 0:l.source}}};const S=["SillyNumbers"];export{r as SillyNumbers,S as __namedExportsOrder,M as default};
