import{R as e}from"./iframe-BoRs1RBy.js";import{D as d}from"./data-editor-all-D9T9H4gP.js";import{B as u,D as c,P as m,M as p,u as f,d as C}from"./utils-Dz3Oy94h.js";import{G as D}from"./image-window-loader-BXrmWK8L.js";import{S as E}from"./story-utils-2EtoWCsI.js";import"./preload-helper-C1FmrZbK.js";import"./throttle-DQQDYI9U.js";import"./flatten-CCq4U2GM.js";import"./scrolling-data-grid-DYXWI3dx.js";import"./marked.esm-HWR-zgpl.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-DTvEHYbB.js";const T={title:"Glide-Data-Grid/DataEditor Demos",decorators:[l=>e.createElement(E,null,e.createElement(u,{title:"Validate data",description:e.createElement(e.Fragment,null,e.createElement(c,null,"Data can be validated using the ",e.createElement(m,null,"validateCell")," callback"),e.createElement(p,null,'This example only allows the word "Valid" inside text cells.'))},e.createElement(l,null)))]},a=()=>{const{cols:l,getCellContent:i,setCellValue:s}=f(60,!1);return e.createElement(d,{...C,getCellContent:i,columns:l,rowMarkers:"both",onPaste:!0,onCellEdited:s,rows:100,validateCell:(V,t)=>t.kind!==D.Text||t.data==="Valid"?!0:t.data.toLowerCase()==="valid"?{...t,data:"Valid",selectionRange:[0,3]}:!1})};var r,n,o;a.parameters={...a.parameters,docs:{...(r=a.parameters)==null?void 0:r.docs,source:{originalSource:`() => {
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
}`,...(o=(n=a.parameters)==null?void 0:n.docs)==null?void 0:o.source}}};const S=["ValidateData"];export{a as ValidateData,S as __namedExportsOrder,T as default};
