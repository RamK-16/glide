import{R as e}from"./iframe-BsJ-CPdr.js";import{D as n}from"./data-editor-all-DtPkoeHH.js";import{b as m,D as c,u,d as a}from"./utils-CdsLDgjh.js";import{S as p}from"./story-utils-CdSAXySY.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-DxEFrg0V.js";import"./throttle-c2Jp8PEZ.js";import"./marked.esm-Cy9xk-ev.js";import"./flatten-BSdzrqUm.js";import"./scrolling-data-grid-CoXaNyV4.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-D3CMph9U.js";const b={title:"Glide-Data-Grid/DataEditor Demos",decorators:[t=>e.createElement(p,null,e.createElement(m,null,e.createElement("h1",null,"Layout Integration"),e.createElement(c,null,"Trying the grid in different situations"),e.createElement(t,null)))]},r=()=>{const{cols:t,getCellContent:o}=u(1e3,!0,!0);return e.createElement(e.Fragment,null,e.createElement(n,{...a,getCellContent:o,columns:t,rows:10,rowMarkers:"both",height:200}),e.createElement(n,{...a,getCellContent:o,columns:t,rows:10,rowMarkers:"both"}),e.createElement("div",{style:{display:"flex",height:"300px"}},e.createElement(n,{...a,getCellContent:o,columns:t,rows:10,rowMarkers:"both"}),e.createElement("div",{style:{flexShrink:0}},"This is some text what happens here?")))};var l,s,i;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`() => {
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
}`,...(i=(s=r.parameters)==null?void 0:s.docs)==null?void 0:i.source}}};const v=["LayoutIntegration"];export{r as LayoutIntegration,v as __namedExportsOrder,b as default};
