import{R as e}from"./iframe-VjYuGMsY.js";import{D as n}from"./data-editor-all-C18pEU2z.js";import{b as m,D as c,u,d as a}from"./utils-DA5KvXiW.js";import{S as p}from"./story-utils-Dv2OgOS1.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-B8cvJCVw.js";import"./marked.esm-CZueurBS.js";import"./scrolling-data-grid-Dlt80JY1.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-1xUx3BY8.js";const x={title:"Glide-Data-Grid/DataEditor Demos",decorators:[t=>e.createElement(p,null,e.createElement(m,null,e.createElement("h1",null,"Layout Integration"),e.createElement(c,null,"Trying the grid in different situations"),e.createElement(t,null)))]},r=()=>{const{cols:t,getCellContent:o}=u(1e3,!0,!0);return e.createElement(e.Fragment,null,e.createElement(n,{...a,getCellContent:o,columns:t,rows:10,rowMarkers:"both",height:200}),e.createElement(n,{...a,getCellContent:o,columns:t,rows:10,rowMarkers:"both"}),e.createElement("div",{style:{display:"flex",height:"300px"}},e.createElement(n,{...a,getCellContent:o,columns:t,rows:10,rowMarkers:"both"}),e.createElement("div",{style:{flexShrink:0}},"This is some text what happens here?")))};var l,s,i;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(1000, true, true);
  return <>
            <DataEditor {...defaultProps} getCellContent={getCellContent} columns={cols} rows={10} rowMarkers="both" height={200} />
            <DataEditor {...defaultProps} getCellContent={getCellContent} columns={cols} rows={10} rowMarkers="both" />
            <div style={{
      display: "flex",
      height: "300px"
    }}>
                <DataEditor {...defaultProps} getCellContent={getCellContent} columns={cols} rows={10} rowMarkers="both" />
                <div style={{
        flexShrink: 0
      }}>This is some text what happens here?</div>
            </div>
        </>;
}`,...(i=(s=r.parameters)==null?void 0:s.docs)==null?void 0:i.source}}};const M=["LayoutIntegration"];export{r as LayoutIntegration,M as __namedExportsOrder,x as default};
