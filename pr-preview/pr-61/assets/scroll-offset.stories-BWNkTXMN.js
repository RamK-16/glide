import{R as e}from"./iframe-DJM4aKf3.js";import{D as n}from"./data-editor-all-DnFnT7BQ.js";import{B as c,D as m,P as i,u as p,d as f}from"./utils-G4Zj7k5E.js";import{S as u}from"./story-utils-ByB6Y_U-.js";import"./lodash-CXcX5NL6.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-1kq9WxV6.js";import"./throttle-C5hBOrcT.js";import"./marked.esm-Bk4h7lqL.js";import"./flatten-DaskvGCQ.js";import"./scrolling-data-grid-DEZGQvN1.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-XhvYdnUX.js";const B={title:"Glide-Data-Grid/DataEditor Demos",decorators:[t=>e.createElement(u,null,e.createElement(c,{title:"Scroll Offset",description:e.createElement(m,null,"The ",e.createElement(i,null,"rowGrouping")," prop can be used to group and even fold rows.")},e.createElement(t,null)))]},r=()=>{const{cols:t,getCellContent:l}=p(100);return e.createElement(n,{...f,height:"100%",rowMarkers:"both",scrollOffsetY:400,getCellContent:l,columns:t,rows:1e3})};var o,s,a;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(100);
  const rows = 1000;
  return <DataEditor {...defaultProps} height="100%" rowMarkers="both" scrollOffsetY={400} getCellContent={getCellContent} columns={cols}
  // verticalBorder={false}
  rows={rows} />;
}`,...(a=(s=r.parameters)==null?void 0:s.docs)==null?void 0:a.source}}};const _=["ScrollOffset"];export{r as ScrollOffset,_ as __namedExportsOrder,B as default};
