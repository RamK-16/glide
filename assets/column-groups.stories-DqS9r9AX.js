import{R as e}from"./iframe-DwHATARk.js";import{D as u}from"./data-editor-all-CATdV2tK.js";import{B as i,D as p,P as d,u as c,d as g}from"./utils-_-BHhp7b.js";import{h as C}from"./image-window-loader-DIBWkkqi.js";import{S as G}from"./story-utils-JY22F43l.js";import"./preload-helper-C1FmrZbK.js";import"./scrolling-data-grid-DKxj2AxU.js";import"./marked.esm-U8ipOrG_.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-NKb2IHJp.js";const H={title:"Glide-Data-Grid/DataEditor Demos",decorators:[t=>e.createElement(G,null,e.createElement(i,{title:"Column Grouping",description:e.createElement(p,null,"Columns in the data grid may be grouped by setting their ",e.createElement(d,null,"group")," ","property.")},e.createElement(t,null)))]},o=()=>{const{cols:t,getCellContent:l}=c(20,!0,!0);return e.createElement(u,{...g,getCellContent:l,onGroupHeaderRenamed:(r,m)=>window.alert(`Please rename group ${r} to ${m}`),columns:t,rows:1e3,getGroupDetails:r=>({name:r,icon:r===""?void 0:C.HeaderCode}),rowMarkers:"both"})};var a,n,s;o.parameters={...o.parameters,docs:{...(a=o.parameters)==null?void 0:a.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(20, true, true);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} onGroupHeaderRenamed={(x, y) => window.alert(\`Please rename group \${x} to \${y}\`)} columns={cols} rows={1000} getGroupDetails={g => ({
    name: g,
    icon: g === "" ? undefined : GridColumnIcon.HeaderCode
  })} rowMarkers="both" />;
}`,...(s=(n=o.parameters)==null?void 0:n.docs)==null?void 0:s.source}}};const M=["ColumnGroups"];export{o as ColumnGroups,M as __namedExportsOrder,H as default};
