import{R as e}from"./iframe-DUOMWMKB.js";import{D as i}from"./data-editor-all-CIEmZ3Oy.js";import{B as m,D as d,u as p,d as c}from"./utils-Cjk2GE-g.js";import{S as u}from"./story-utils-CVcEWNI0.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-DQVbokRp.js";import"./throttle-CkIxoYA6.js";import"./marked.esm-CNbZRF2T.js";import"./flatten-Dh3Y6Y7r.js";import"./scrolling-data-grid-BB7XyoHK.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-CisFguVS.js";const _={title:"Glide-Data-Grid/DataEditor Demos",decorators:[r=>e.createElement(u,null,e.createElement(m,{title:"Editable Grid",description:e.createElement(d,null,"Data grid supports overlay editors for changing values. There are bespoke editors for numbers, strings, images, booleans, markdown, and uri.")},e.createElement(r,null)))]},t=()=>{const{cols:r,getCellContent:s,setCellValue:n}=p(6,!1);return e.createElement(i,{...c,getCellContent:s,columns:r,rows:20,onCellEdited:n})};var o,a,l;t.parameters={...t.parameters,docs:{...(o=t.parameters)==null?void 0:o.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent,
    setCellValue
  } = useMockDataGenerator(6, false);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={cols} rows={20} onCellEdited={setCellValue} />;
}`,...(l=(a=t.parameters)==null?void 0:a.docs)==null?void 0:l.source}}};const v=["SmallEditableGrid"];export{t as SmallEditableGrid,v as __namedExportsOrder,_ as default};
