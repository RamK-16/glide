import{R as e}from"./iframe-VjYuGMsY.js";import{D as u}from"./data-editor-all-C18pEU2z.js";import{B as p,D as E,P as C,u as f,d as g}from"./utils-DA5KvXiW.js";import{S as h}from"./story-utils-Dv2OgOS1.js";import{G as v}from"./image-window-loader-B8cvJCVw.js";import"./preload-helper-C1FmrZbK.js";import"./scrolling-data-grid-Dlt80JY1.js";import"./marked.esm-CZueurBS.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-1xUx3BY8.js";const B={title:"Glide-Data-Grid/DataEditor Demos",decorators:[t=>e.createElement(h,null,e.createElement(p,{title:"Custom Editors",description:e.createElement(E,null,"The ",e.createElement(C,null,"provideEditor")," callback allows you to provide a custom editor for a cell. In this example, cells in the first column get a custom editor.")},e.createElement(t,null)))]},c=t=>{const{value:o,onFinishedEditing:r}=t,[a,i]=e.useState(o.data);return e.createElement("div",{style:{width:"100%",height:"100%"}},"Type something:",e.createElement("input",{style:{width:"100%",height:"100%",boxSizing:"border-box",border:"2px solid #666",background:"#333",color:"white",padding:"0 8px"},value:a,onChange:m=>i(m.target.value),onBlur:()=>r({...o,data:a})}))};c.displayName="CustomEditor";const x=t=>{var o;if(((o=t.location)==null?void 0:o[0])===0)return r=>e.createElement(c,{...r})},l=()=>{const{cols:t,getCellContent:o,setCellValue:r}=f(10,!1);return e.createElement(u,{...g,getCellContent:o,columns:t,rows:20,onCellEdited:(a,i)=>{i.kind===v.Text&&r(a,i)},provideEditor:x})};l.displayName="CustomEditors";var n,s,d;l.parameters={...l.parameters,docs:{...(n=l.parameters)==null?void 0:n.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent,
    setCellValue
  } = useMockDataGenerator(10, false);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={cols} rows={20} onCellEdited={(cell, newValue) => {
    if (newValue.kind !== GridCellKind.Text) return;
    setCellValue(cell, newValue);
  }} provideEditor={provideEditor as ProvideEditorCallback<any>} />;
}`,...(d=(s=l.parameters)==null?void 0:s.docs)==null?void 0:d.source}}};const N=["CustomEditors"];export{l as CustomEditors,N as __namedExportsOrder,B as default};
