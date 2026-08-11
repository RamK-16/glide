import{R as e}from"./iframe-Dr7NldeW.js";import{D as l}from"./data-editor-all-BkMvE3pA.js";import{B as i,D as m,u as p,d as c}from"./utils-CFrrsBc8.js";import{S as u}from"./story-utils-BrGGhJoN.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-DzVPh8Ni.js";import"./throttle-ta17sIyr.js";import"./marked.esm-DkHoS7su.js";import"./flatten-CWrf-Xt9.js";import"./scrolling-data-grid-N7wqNh48.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-C3S_2HIG.js";const O={title:"Glide-Data-Grid/DataEditor Demos",decorators:[t=>e.createElement(u,null,e.createElement(i,{title:"One Million Rows",description:e.createElement(m,null,"Data grid supports over 1 million rows. Your limit is mostly RAM.")},e.createElement(t,null)))]},r=()=>{const{cols:t,getCellContent:n}=p(6);return e.createElement(l,{...c,getCellContent:n,columns:t,rowHeight:31,rows:1e6,rowMarkers:"number"})};var o,s,a;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(6);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={cols} rowHeight={31} rows={1_000_000} rowMarkers="number" />;
}`,...(a=(s=r.parameters)==null?void 0:s.docs)==null?void 0:a.source}}};const h=["OneMillionRows"];export{r as OneMillionRows,h as __namedExportsOrder,O as default};
