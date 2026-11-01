import{R as e}from"./iframe-DJM4aKf3.js";import{D as i}from"./data-editor-all-DnFnT7BQ.js";import{B as m,D as d,u as p,d as c}from"./utils-G4Zj7k5E.js";import{S as u}from"./story-utils-ByB6Y_U-.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-1kq9WxV6.js";import"./throttle-C5hBOrcT.js";import"./marked.esm-Bk4h7lqL.js";import"./flatten-DaskvGCQ.js";import"./scrolling-data-grid-DEZGQvN1.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-XhvYdnUX.js";const _={title:"Glide-Data-Grid/DataEditor Demos",decorators:[r=>e.createElement(u,null,e.createElement(m,{title:"Editable Grid",description:e.createElement(d,null,"Data grid supports overlay editors for changing values. There are bespoke editors for numbers, strings, images, booleans, markdown, and uri.")},e.createElement(r,null)))]},t=()=>{const{cols:r,getCellContent:s,setCellValue:n}=p(6,!1);return e.createElement(i,{...c,getCellContent:s,columns:r,rows:20,onCellEdited:n})};var o,a,l;t.parameters={...t.parameters,docs:{...(o=t.parameters)==null?void 0:o.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent,
    setCellValue
  } = useMockDataGenerator(6, false);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={cols} rows={20} onCellEdited={setCellValue} />;
}`,...(l=(a=t.parameters)==null?void 0:a.docs)==null?void 0:l.source}}};const v=["SmallEditableGrid"];export{t as SmallEditableGrid,v as __namedExportsOrder,_ as default};
