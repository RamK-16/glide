import{R as e}from"./iframe-CUpeVJMc.js";import{D as m}from"./data-editor-all-BCjZtlbU.js";import{B as u,D as c,P as i,u as p,d as f}from"./utils-mEQVggKF.js";import{S as C}from"./story-utils-Cm_6lJ4s.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-Ccev80tu.js";import"./throttle-CEx6xBPo.js";import"./marked.esm-tFo0_PyB.js";import"./flatten-C2E6Wn2M.js";import"./scrolling-data-grid-DV97Ax7d.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-DxNlDJ5G.js";const M={title:"Glide-Data-Grid/DataEditor Demos",decorators:[t=>e.createElement(C,null,e.createElement(u,{title:"Freeze columns",description:e.createElement(c,null,"Columns at the start of your grid can be frozen in place by settings"," ",e.createElement(i,null,"freezeColumns")," to a number greater than 0.")},e.createElement(t,null)))]},r=t=>{const{cols:s,getCellContent:l}=p(100);return e.createElement(m,{...f,rowMarkers:"both",freezeColumns:t.freezeColumns,getCellContent:l,columns:s,verticalBorder:!1,rows:1e3})};r.argTypes={freezeColumns:{control:{type:"range",min:0,max:10}}};r.args={freezeColumns:1};var o,a,n;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`(p: {
  freezeColumns: number;
}) => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(100);
  return <DataEditor {...defaultProps} rowMarkers="both" freezeColumns={p.freezeColumns} getCellContent={getCellContent} columns={cols} verticalBorder={false} rows={1000} />;
}`,...(n=(a=r.parameters)==null?void 0:a.docs)==null?void 0:n.source}}};const P=["FreezeColumns"];export{r as FreezeColumns,P as __namedExportsOrder,M as default};
