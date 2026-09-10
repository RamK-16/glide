import{R as e}from"./iframe-Kg9IYTCB.js";import{D as n}from"./data-editor-all-ChForpnd.js";import{B as c,D as m,P as i,u as p,d as f}from"./utils-MdlBzUIZ.js";import{S as u}from"./story-utils-Bj0_QPxs.js";import"./lodash-B6q8v0ll.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-BV1LwiaE.js";import"./throttle-CVbytFHq.js";import"./marked.esm-Ch6bmoxH.js";import"./flatten-D0FSpzD3.js";import"./scrolling-data-grid-ka5GD6Xa.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-BZROPe21.js";const B={title:"Glide-Data-Grid/DataEditor Demos",decorators:[t=>e.createElement(u,null,e.createElement(c,{title:"Scroll Offset",description:e.createElement(m,null,"The ",e.createElement(i,null,"rowGrouping")," prop can be used to group and even fold rows.")},e.createElement(t,null)))]},r=()=>{const{cols:t,getCellContent:l}=p(100);return e.createElement(n,{...f,height:"100%",rowMarkers:"both",scrollOffsetY:400,getCellContent:l,columns:t,rows:1e3})};var o,s,a;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(100);
  const rows = 1000;
  return <DataEditor {...defaultProps} height="100%" rowMarkers="both" scrollOffsetY={400} getCellContent={getCellContent} columns={cols}
  // verticalBorder={false}
  rows={rows} />;
}`,...(a=(s=r.parameters)==null?void 0:s.docs)==null?void 0:a.source}}};const _=["ScrollOffset"];export{r as ScrollOffset,_ as __namedExportsOrder,B as default};
