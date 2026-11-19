import{R as e}from"./iframe-CPu8J0cI.js";import{D as c}from"./data-editor-all-bPCRl3Ih.js";import{B as d,D as m,P as p,a as u,d as g}from"./utils-LkAs0Eop.js";import{S as C}from"./story-utils-CDo8g7H1.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-BRw-hy5I.js";import"./throttle-BGhDi_gy.js";import"./marked.esm-DY23z4ib.js";import"./flatten-Ra7d6F5x.js";import"./scrolling-data-grid-Dmuoe2KZ.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-BR3Pz27J.js";const x={title:"Glide-Data-Grid/DataEditor Demos",decorators:[l=>e.createElement(C,null,e.createElement(d,{title:"Lotsa cell kinds",description:e.createElement(m,null,"Data grid supports plenty cell kinds. Anything under ",e.createElement(p,null,"GridCellKind"),".")},e.createElement(l,null)))]},t=()=>{const{cols:l,getCellContent:i,onColumnResize:s,setCellValue:a}=u();return e.createElement(c,{...g,getCellContent:i,columns:l,onCellEdited:a,onPaste:!0,rowHeight:44,onColumnResize:s,highlightRegions:[{color:"#ff00ff33",range:{x:1,y:1,width:3,height:3}}],cellActivationBehavior:"single-click",editorBloom:[-4,-4],drawFocusRing:!1,rows:1e3})};var o,n,r;t.parameters={...t.parameters,docs:{...(o=t.parameters)==null?void 0:o.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent,
    onColumnResize,
    setCellValue
  } = useAllMockedKinds();
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={cols} onCellEdited={setCellValue} onPaste={true} rowHeight={44} onColumnResize={onColumnResize} highlightRegions={[{
    color: "#ff00ff33",
    range: {
      x: 1,
      y: 1,
      width: 3,
      height: 3
    }
  }]} cellActivationBehavior="single-click" editorBloom={[-4, -4]} drawFocusRing={false} rows={1000} />;
}`,...(r=(n=t.parameters)==null?void 0:n.docs)==null?void 0:r.source}}};const y=["AllCellKinds"];export{t as AllCellKinds,y as __namedExportsOrder,x as default};
