import{R as e}from"./iframe-BsJ-CPdr.js";import{D as i}from"./data-editor-all-DtPkoeHH.js";import{B as c,D as m,P as d,u as p,d as u}from"./utils-CdsLDgjh.js";import{S as b}from"./story-utils-CdSAXySY.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-DxEFrg0V.js";import"./throttle-c2Jp8PEZ.js";import"./marked.esm-Cy9xk-ev.js";import"./flatten-BSdzrqUm.js";import"./scrolling-data-grid-CoXaNyV4.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-D3CMph9U.js";const S={title:"Glide-Data-Grid/DataEditor Demos",decorators:[t=>e.createElement(b,null,e.createElement(c,{title:"Row markers",description:e.createElement(e.Fragment,null,e.createElement(m,null,"Row Markers can be controlled by setting the ",e.createElement(d,null,"rowMarkers")," prop."))},e.createElement(t,null)))]},r=t=>{const{cols:l,getCellContent:n}=p(10,!1);return e.createElement(i,{...u,getCellContent:n,verticalBorder:!1,rowMarkers:{kind:t.markers,checkboxStyle:"square",headerAlwaysVisible:!0,headerDisabled:t.headerDisabled,headerTheme:{textMedium:"rgba(51, 51, 51, 0.50)"}},columns:l,rows:400})};r.args={markers:"both",headerDisabled:!1};r.argTypes={markers:{control:{type:"select"},options:["both","checkbox","number","none","clickable-number","checkbox-visible"]},headerDisabled:{control:{type:"boolean"}}};var a,o,s;r.parameters={...r.parameters,docs:{...(a=r.parameters)==null?void 0:a.docs,source:{originalSource:`p => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(10, false);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} verticalBorder={false} rowMarkers={{
    kind: p.markers,
    checkboxStyle: "square",
    headerAlwaysVisible: true,
    headerDisabled: p.headerDisabled,
    headerTheme: {
      textMedium: "rgba(51, 51, 51, 0.50)"
    }
  }} columns={cols} rows={400} />;
}`,...(s=(o=r.parameters)==null?void 0:o.docs)==null?void 0:s.source}}};const B=["RowMarkers"];export{r as RowMarkers,B as __namedExportsOrder,S as default};
