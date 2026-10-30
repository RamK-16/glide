import{R as e}from"./iframe-ClCxR0cq.js";import{D as l}from"./data-editor-all-BhShDNXn.js";import{B as i,D as m,u as p,d as c}from"./utils-Bxsp5fIC.js";import{S as u}from"./story-utils-CBYeDmXI.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-CVlj3G8e.js";import"./throttle-Dhay9fT1.js";import"./marked.esm-Gk8wqMPY.js";import"./flatten-QZnnRHLM.js";import"./scrolling-data-grid-Bm2bpx0r.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-M8yPTOBx.js";const O={title:"Glide-Data-Grid/DataEditor Demos",decorators:[t=>e.createElement(u,null,e.createElement(i,{title:"One Million Rows",description:e.createElement(m,null,"Data grid supports over 1 million rows. Your limit is mostly RAM.")},e.createElement(t,null)))]},r=()=>{const{cols:t,getCellContent:n}=p(6);return e.createElement(l,{...c,getCellContent:n,columns:t,rowHeight:31,rows:1e6,rowMarkers:"number"})};var o,s,a;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(6);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={cols} rowHeight={31} rows={1_000_000} rowMarkers="number" />;
}`,...(a=(s=r.parameters)==null?void 0:s.docs)==null?void 0:a.source}}};const h=["OneMillionRows"];export{r as OneMillionRows,h as __namedExportsOrder,O as default};
