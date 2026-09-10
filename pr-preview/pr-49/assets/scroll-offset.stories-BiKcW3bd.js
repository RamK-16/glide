import{R as e}from"./iframe-Dj-c93eC.js";import{D as n}from"./data-editor-all-DCPzorWd.js";import{B as c,D as m,P as i,u as p,d as f}from"./utils-Km7H9S8R.js";import{S as u}from"./story-utils-DXTZjkKk.js";import"./lodash-pwwfWVFG.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-BBX2yld6.js";import"./throttle-qh5c6Cq5.js";import"./marked.esm-Chy7_nBT.js";import"./flatten-DpK2-f9m.js";import"./scrolling-data-grid-BP-SgQtB.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-D3jVzk0R.js";const B={title:"Glide-Data-Grid/DataEditor Demos",decorators:[t=>e.createElement(u,null,e.createElement(c,{title:"Scroll Offset",description:e.createElement(m,null,"The ",e.createElement(i,null,"rowGrouping")," prop can be used to group and even fold rows.")},e.createElement(t,null)))]},r=()=>{const{cols:t,getCellContent:l}=p(100);return e.createElement(n,{...f,height:"100%",rowMarkers:"both",scrollOffsetY:400,getCellContent:l,columns:t,rows:1e3})};var o,s,a;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(100);
  const rows = 1000;
  return <DataEditor {...defaultProps} height="100%" rowMarkers="both" scrollOffsetY={400} getCellContent={getCellContent} columns={cols}
  // verticalBorder={false}
  rows={rows} />;
}`,...(a=(s=r.parameters)==null?void 0:s.docs)==null?void 0:a.source}}};const _=["ScrollOffset"];export{r as ScrollOffset,_ as __namedExportsOrder,B as default};
