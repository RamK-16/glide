import{R as e}from"./iframe-BsJ-CPdr.js";import{D as i}from"./data-editor-all-DtPkoeHH.js";import{B as u,D as d,P as t,u as v,d as g}from"./utils-CdsLDgjh.js";import{S as E}from"./story-utils-CdSAXySY.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-DxEFrg0V.js";import"./throttle-c2Jp8PEZ.js";import"./marked.esm-Cy9xk-ev.js";import"./flatten-BSdzrqUm.js";import"./scrolling-data-grid-CoXaNyV4.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-D3CMph9U.js";const _={title:"Glide-Data-Grid/DataEditor Demos",decorators:[o=>e.createElement(E,null,e.createElement(u,{title:"Overscroll",description:e.createElement(e.Fragment,null,e.createElement(d,null,"You can allocate extra space at the ends of the grid by setting the"," ",e.createElement(t,null,"overscrollX")," and ",e.createElement(t,null,"overscrollY")," props"))},e.createElement(o,null)))]},r=o=>{const{overscrollX:n,overscrollY:c}=o,{cols:m,getCellContent:p}=v(20);return e.createElement(i,{...g,getCellContent:p,columns:m,overscrollX:n,overscrollY:c,rows:50})};r.argTypes={overscrollX:{control:{type:"range",min:0,max:600}},overscrollY:{control:{type:"range",min:0,max:600}}};r.args={overscrollX:200,overscrollY:200};var l,s,a;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`p => {
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
