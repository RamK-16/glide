import{R as e}from"./iframe-BoD4WiH0.js";import{D as c}from"./data-editor-all-BUoE3Kxl.js";import{B as d,D as m,P as u,a as p,d as g}from"./utils-Dxta3Kks.js";import{S as C}from"./story-utils-CN4NCFbO.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-DL-R_KDF.js";import"./marked.esm-ChK04DKU.js";import"./scrolling-data-grid-De5pbQ3n.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-D4pSLEaH.js";const P={title:"Glide-Data-Grid/DataEditor Demos",decorators:[l=>e.createElement(C,null,e.createElement(d,{title:"Lotsa cell kinds",description:e.createElement(m,null,"Data grid supports plenty cell kinds. Anything under ",e.createElement(u,null,"GridCellKind"),".")},e.createElement(l,null)))]},t=()=>{const{cols:l,getCellContent:i,onColumnResize:s,setCellValue:a}=p();return e.createElement(c,{...g,getCellContent:i,columns:l,onCellEdited:a,onPaste:!0,rowHeight:44,onColumnResize:s,highlightRegions:[{color:"#ff00ff33",range:{x:1,y:1,width:3,height:3}}],cellActivationBehavior:"single-click",editorBloom:[-4,-4],drawFocusRing:!1,rows:1e3})};var o,n,r;t.parameters={...t.parameters,docs:{...(o=t.parameters)==null?void 0:o.docs,source:{originalSource:`() => {
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
}`,...(r=(n=t.parameters)==null?void 0:n.docs)==null?void 0:r.source}}};const v=["AllCellKinds"];export{t as AllCellKinds,v as __namedExportsOrder,P as default};
