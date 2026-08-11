import{R as e}from"./iframe-B5XmEgy5.js";import{D as i}from"./data-editor-all-Cz0EY8r1.js";import{B as c,D as m,u as p,d}from"./utils-Dw8hJtmC.js";import{S as u}from"./story-utils-B5axrbhE.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-DKsvR5Ui.js";import"./marked.esm-D7g0DxGq.js";import"./scrolling-data-grid-BskDifbr.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-AINEZqF_.js";const z={title:"Glide-Data-Grid/DataEditor Demos",decorators:[o=>e.createElement(u,null,e.createElement(c,{title:"Scaled view",description:e.createElement(m,null,"The data editor supports being scaled."),scale:"0.5"},e.createElement(o,null)))]},t=()=>{const{cols:o,getCellContent:n,onColumnResize:l}=p(60);return e.createElement(i,{...d,getCellContent:n,columns:o,rowMarkers:"both",rows:500,onColumnResize:l})};var r,a,s;t.parameters={...t.parameters,docs:{...(r=t.parameters)==null?void 0:r.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent,
    onColumnResize
  } = useMockDataGenerator(60);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={cols} rowMarkers="both" rows={500} onColumnResize={onColumnResize} />;
}`,...(s=(a=t.parameters)==null?void 0:a.docs)==null?void 0:s.source}}};const G=["ScaledView"];export{t as ScaledView,G as __namedExportsOrder,z as default};
