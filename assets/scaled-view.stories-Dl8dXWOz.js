import{R as e}from"./iframe-VjYuGMsY.js";import{D as i}from"./data-editor-all-C18pEU2z.js";import{B as c,D as m,u as p,d}from"./utils-DA5KvXiW.js";import{S as u}from"./story-utils-Dv2OgOS1.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-B8cvJCVw.js";import"./marked.esm-CZueurBS.js";import"./scrolling-data-grid-Dlt80JY1.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-1xUx3BY8.js";const z={title:"Glide-Data-Grid/DataEditor Demos",decorators:[o=>e.createElement(u,null,e.createElement(c,{title:"Scaled view",description:e.createElement(m,null,"The data editor supports being scaled."),scale:"0.5"},e.createElement(o,null)))]},t=()=>{const{cols:o,getCellContent:n,onColumnResize:l}=p(60);return e.createElement(i,{...d,getCellContent:n,columns:o,rowMarkers:"both",rows:500,onColumnResize:l})};var r,a,s;t.parameters={...t.parameters,docs:{...(r=t.parameters)==null?void 0:r.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent,
    onColumnResize
  } = useMockDataGenerator(60);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={cols} rowMarkers="both" rows={500} onColumnResize={onColumnResize} />;
}`,...(s=(a=t.parameters)==null?void 0:a.docs)==null?void 0:s.source}}};const G=["ScaledView"];export{t as ScaledView,G as __namedExportsOrder,z as default};
