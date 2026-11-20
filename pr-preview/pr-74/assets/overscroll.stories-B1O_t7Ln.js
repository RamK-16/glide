import{R as e}from"./iframe-CUpeVJMc.js";import{D as i}from"./data-editor-all-BCjZtlbU.js";import{B as u,D as d,P as t,u as v,d as g}from"./utils-mEQVggKF.js";import{S as E}from"./story-utils-Cm_6lJ4s.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-Ccev80tu.js";import"./throttle-CEx6xBPo.js";import"./marked.esm-tFo0_PyB.js";import"./flatten-C2E6Wn2M.js";import"./scrolling-data-grid-DV97Ax7d.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-DxNlDJ5G.js";const _={title:"Glide-Data-Grid/DataEditor Demos",decorators:[o=>e.createElement(E,null,e.createElement(u,{title:"Overscroll",description:e.createElement(e.Fragment,null,e.createElement(d,null,"You can allocate extra space at the ends of the grid by setting the"," ",e.createElement(t,null,"overscrollX")," and ",e.createElement(t,null,"overscrollY")," props"))},e.createElement(o,null)))]},r=o=>{const{overscrollX:n,overscrollY:c}=o,{cols:m,getCellContent:p}=v(20);return e.createElement(i,{...g,getCellContent:p,columns:m,overscrollX:n,overscrollY:c,rows:50})};r.argTypes={overscrollX:{control:{type:"range",min:0,max:600}},overscrollY:{control:{type:"range",min:0,max:600}}};r.args={overscrollX:200,overscrollY:200};var l,s,a;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`p => {
  const {
    overscrollX,
    overscrollY
  } = p;
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(20);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={cols} overscrollX={overscrollX} overscrollY={overscrollY} rows={50} />;
}`,...(a=(s=r.parameters)==null?void 0:s.docs)==null?void 0:a.source}}};const k=["Overscroll"];export{r as Overscroll,k as __namedExportsOrder,_ as default};
