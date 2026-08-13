import{R as e}from"./iframe-Bh3GObC6.js";import{D as i}from"./data-editor-all-IWm2TtrB.js";import{B as u,D as p,P as d,u as c,d as g}from"./utils-D4gIOI4s.js";import{a as C}from"./image-window-loader-CNSGdkFF.js";import{S as G}from"./story-utils-Cu7XZpYF.js";import"./preload-helper-C1FmrZbK.js";import"./throttle-CYf89UN2.js";import"./flatten-77RgX1YL.js";import"./scrolling-data-grid-DuBKTrIu.js";import"./marked.esm-lLOSjWW6.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-l_9haR-r.js";const R={title:"Glide-Data-Grid/DataEditor Demos",decorators:[t=>e.createElement(G,null,e.createElement(u,{title:"Column Grouping",description:e.createElement(p,null,"Columns in the data grid may be grouped by setting their ",e.createElement(d,null,"group")," ","property.")},e.createElement(t,null)))]},o=()=>{const{cols:t,getCellContent:l}=c(20,!0,!0);return e.createElement(i,{...g,getCellContent:l,onGroupHeaderRenamed:(r,m)=>window.alert(`Please rename group ${r} to ${m}`),columns:t,rows:1e3,getGroupDetails:r=>({name:r,icon:r===""?void 0:C.HeaderCode}),rowMarkers:"both"})};var a,n,s;o.parameters={...o.parameters,docs:{...(a=o.parameters)==null?void 0:a.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(20, true, true);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} onGroupHeaderRenamed={(x, y) => window.alert(\`Please rename group \${x} to \${y}\`)} columns={cols} rows={1000} getGroupDetails={g => ({
    name: g,
    icon: g === "" ? undefined : GridColumnIcon.HeaderCode
  })} rowMarkers="both" />;
}`,...(s=(n=o.parameters)==null?void 0:n.docs)==null?void 0:s.source}}};const $=["ColumnGroups"];export{o as ColumnGroups,$ as __namedExportsOrder,R as default};
