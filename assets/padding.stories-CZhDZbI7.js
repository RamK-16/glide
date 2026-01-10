import{R as t}from"./iframe-VjYuGMsY.js";import{D as m}from"./data-editor-all-C18pEU2z.js";import{B as c,D as g,P as n,u,d as h}from"./utils-DA5KvXiW.js";import{S as E}from"./story-utils-Dv2OgOS1.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-B8cvJCVw.js";import"./marked.esm-CZueurBS.js";import"./scrolling-data-grid-Dlt80JY1.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-1xUx3BY8.js";const G={title:"Glide-Data-Grid/DataEditor Demos",decorators:[a=>t.createElement(E,null,t.createElement(c,{title:"Padding",description:t.createElement(t.Fragment,null,t.createElement(g,null,"You can add padding at the ends of the grid by setting the"," ",t.createElement(n,null,"paddingRight")," and ",t.createElement(n,null,"paddingBottom")," props"))},t.createElement(a,null)))]},e=a=>{const{paddingRight:i,paddingBottom:s}=a,{cols:p,getCellContent:l}=u(20);return t.createElement(m,{...h,getCellContent:l,columns:p,rowMarkers:"both",experimental:{paddingRight:i,paddingBottom:s},rows:50})};e.argTypes={paddingRight:{control:{type:"range",min:0,max:600}},paddingBottom:{control:{type:"range",min:0,max:600}}};e.args={paddingRight:200,paddingBottom:200};var r,o,d;e.parameters={...e.parameters,docs:{...(r=e.parameters)==null?void 0:r.docs,source:{originalSource:`p => {
  const {
    paddingRight,
    paddingBottom
  } = p;
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(20);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={cols} rowMarkers={"both"} experimental={{
    paddingRight,
    paddingBottom
  }} rows={50} />;
}`,...(d=(o=e.parameters)==null?void 0:o.docs)==null?void 0:d.source}}};const M=["Padding"];export{e as Padding,M as __namedExportsOrder,G as default};
