import{R as e}from"./iframe-BoD4WiH0.js";import{D as i}from"./data-editor-all-BUoE3Kxl.js";import{B as m,D as d,u as c,d as p}from"./utils-Dxta3Kks.js";import{S as u}from"./story-utils-CN4NCFbO.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-DL-R_KDF.js";import"./marked.esm-ChK04DKU.js";import"./scrolling-data-grid-De5pbQ3n.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-D4pSLEaH.js";const w={title:"Glide-Data-Grid/DataEditor Demos",decorators:[r=>e.createElement(u,null,e.createElement(m,{title:"Editable Grid",description:e.createElement(d,null,"Data grid supports overlay editors for changing values. There are bespoke editors for numbers, strings, images, booleans, markdown, and uri.")},e.createElement(r,null)))]},t=()=>{const{cols:r,getCellContent:s,setCellValue:n}=c(6,!1);return e.createElement(i,{...p,getCellContent:s,columns:r,rows:20,onCellEdited:n})};var a,o,l;t.parameters={...t.parameters,docs:{...(a=t.parameters)==null?void 0:a.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent,
    setCellValue
  } = useMockDataGenerator(6, false);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={cols} rows={20} onCellEdited={setCellValue} />;
}`,...(l=(o=t.parameters)==null?void 0:o.docs)==null?void 0:l.source}}};const V=["SmallEditableGrid"];export{t as SmallEditableGrid,V as __namedExportsOrder,w as default};
