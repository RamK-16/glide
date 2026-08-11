import{R as e}from"./iframe-B5XmEgy5.js";import{D as d}from"./data-editor-all-Cz0EY8r1.js";import{B as u,D as c,P as m,M as p,u as f,d as C}from"./utils-Dw8hJtmC.js";import{G as D}from"./image-window-loader-DKsvR5Ui.js";import{S as E}from"./story-utils-B5axrbhE.js";import"./preload-helper-C1FmrZbK.js";import"./scrolling-data-grid-BskDifbr.js";import"./marked.esm-D7g0DxGq.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-AINEZqF_.js";const b={title:"Glide-Data-Grid/DataEditor Demos",decorators:[l=>e.createElement(E,null,e.createElement(u,{title:"Validate data",description:e.createElement(e.Fragment,null,e.createElement(c,null,"Data can be validated using the ",e.createElement(m,null,"validateCell")," callback"),e.createElement(p,null,'This example only allows the word "Valid" inside text cells.'))},e.createElement(l,null)))]},a=()=>{const{cols:l,getCellContent:s,setCellValue:i}=f(60,!1);return e.createElement(d,{...C,getCellContent:s,columns:l,rowMarkers:"both",onPaste:!0,onCellEdited:i,rows:100,validateCell:(V,t)=>t.kind!==D.Text||t.data==="Valid"?!0:t.data.toLowerCase()==="valid"?{...t,data:"Valid",selectionRange:[0,3]}:!1})};var r,n,o;a.parameters={...a.parameters,docs:{...(r=a.parameters)==null?void 0:r.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent,
    setCellValue
  } = useMockDataGenerator(60, false);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={cols} rowMarkers={"both"} onPaste={true} onCellEdited={setCellValue} rows={100} validateCell={(_cell, newValue) => {
    if (newValue.kind !== GridCellKind.Text) return true;
    if (newValue.data === "Valid") return true;
    if (newValue.data.toLowerCase() === "valid") {
      return {
        ...newValue,
        data: "Valid",
        selectionRange: [0, 3]
      };
    }
    return false;
  }} />;
}`,...(o=(n=a.parameters)==null?void 0:n.docs)==null?void 0:o.source}}};const R=["ValidateData"];export{a as ValidateData,R as __namedExportsOrder,b as default};
