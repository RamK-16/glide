import{R as e}from"./iframe-BoD4WiH0.js";import{D as m}from"./data-editor-all-BUoE3Kxl.js";import{B as u,D as c,P as i,u as p,d as f}from"./utils-Dxta3Kks.js";import{S as C}from"./story-utils-CN4NCFbO.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-DL-R_KDF.js";import"./marked.esm-ChK04DKU.js";import"./scrolling-data-grid-De5pbQ3n.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-D4pSLEaH.js";const B={title:"Glide-Data-Grid/DataEditor Demos",decorators:[t=>e.createElement(C,null,e.createElement(u,{title:"Freeze columns",description:e.createElement(c,null,"Columns at the start of your grid can be frozen in place by settings"," ",e.createElement(i,null,"freezeColumns")," to a number greater than 0.")},e.createElement(t,null)))]},r=t=>{const{cols:s,getCellContent:l}=p(100);return e.createElement(m,{...f,rowMarkers:"both",freezeColumns:t.freezeColumns,getCellContent:l,columns:s,verticalBorder:!1,rows:1e3})};r.argTypes={freezeColumns:{control:{type:"range",min:0,max:10}}};r.args={freezeColumns:1};var o,a,n;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`(p: {
  freezeColumns: number;
}) => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(100);
  return <DataEditor {...defaultProps} rowMarkers="both" freezeColumns={p.freezeColumns} getCellContent={getCellContent} columns={cols} verticalBorder={false} rows={1000} />;
}`,...(n=(a=r.parameters)==null?void 0:a.docs)==null?void 0:n.source}}};const G=["FreezeColumns"];export{r as FreezeColumns,G as __namedExportsOrder,B as default};
