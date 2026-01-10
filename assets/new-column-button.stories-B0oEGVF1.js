import{R as e}from"./iframe-VjYuGMsY.js";import{D as c}from"./data-editor-all-C18pEU2z.js";import{B as u,D as i,P as p,u as d,d as C,C as E}from"./utils-DA5KvXiW.js";import{S as w}from"./story-utils-Dv2OgOS1.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-B8cvJCVw.js";import"./marked.esm-CZueurBS.js";import"./scrolling-data-grid-Dlt80JY1.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-1xUx3BY8.js";const G={title:"Glide-Data-Grid/DataEditor Demos",decorators:[t=>e.createElement(w,null,e.createElement(u,{title:"New column button",description:e.createElement(i,null,"A new column button can be created using the ",e.createElement(p,null,"rightElement"),".")},e.createElement(t,null)))]},o=()=>{const{cols:t,getCellContent:a}=d(10,!0),s=e.useMemo(()=>t.map(m=>({...m,grow:1})),[t]);return e.createElement(c,{...C,getCellContent:a,columns:s,rightElement:e.createElement(E,null,e.createElement("button",{onClick:()=>window.alert("Add a column!")},"+")),rightElementProps:{fill:!1,sticky:!1},rows:3e3,rowMarkers:"both"})};var n,r,l;o.parameters={...o.parameters,docs:{...(n=o.parameters)==null?void 0:n.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(10, true);
  const columns = React.useMemo(() => cols.map(c => ({
    ...c,
    grow: 1
  })), [cols]);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={columns} rightElement={<ColumnAddButton>
                    <button onClick={() => window.alert("Add a column!")}>+</button>
                </ColumnAddButton>} rightElementProps={{
    fill: false,
    sticky: false
  }} rows={3000} rowMarkers="both" />;
}`,...(l=(r=o.parameters)==null?void 0:r.docs)==null?void 0:l.source}}};const N=["NewColumnButton"];export{o as NewColumnButton,N as __namedExportsOrder,G as default};
