import{R as e}from"./iframe-BLavU4Hb.js";import{D as i}from"./data-editor-all-DlUbUXD2.js";import{B as m,D as d,u as p,d as c}from"./utils-DRZ64-zO.js";import{S as u}from"./story-utils-WcfJSPK_.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-CzihhpX8.js";import"./throttle-TKIZzbAF.js";import"./marked.esm-BhHHjziN.js";import"./flatten-CGMchODB.js";import"./scrolling-data-grid-D7HVtx3K.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-RidYIsvs.js";const _={title:"Glide-Data-Grid/DataEditor Demos",decorators:[r=>e.createElement(u,null,e.createElement(m,{title:"Editable Grid",description:e.createElement(d,null,"Data grid supports overlay editors for changing values. There are bespoke editors for numbers, strings, images, booleans, markdown, and uri.")},e.createElement(r,null)))]},t=()=>{const{cols:r,getCellContent:s,setCellValue:n}=p(6,!1);return e.createElement(i,{...c,getCellContent:s,columns:r,rows:20,onCellEdited:n})};var o,a,l;t.parameters={...t.parameters,docs:{...(o=t.parameters)==null?void 0:o.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent,
    setCellValue
  } = useMockDataGenerator(6, false);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={cols} rows={20} onCellEdited={setCellValue} />;
}`,...(l=(a=t.parameters)==null?void 0:a.docs)==null?void 0:l.source}}};const v=["SmallEditableGrid"];export{t as SmallEditableGrid,v as __namedExportsOrder,_ as default};
