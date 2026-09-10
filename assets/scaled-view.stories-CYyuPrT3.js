import{R as e}from"./iframe-D6f5d7xm.js";import{D as i}from"./data-editor-all-DfWQ_H6R.js";import{B as m,D as c,u as p,d}from"./utils-BV3YHQta.js";import{S as u}from"./story-utils-CR4mHb4g.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-C-mV7PkX.js";import"./throttle-DFnnZt85.js";import"./marked.esm-CaW3tWQk.js";import"./flatten-9n7OisLP.js";import"./scrolling-data-grid-Dld5XaK9.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-D2fkOugv.js";const M={title:"Glide-Data-Grid/DataEditor Demos",decorators:[o=>e.createElement(u,null,e.createElement(m,{title:"Scaled view",description:e.createElement(c,null,"The data editor supports being scaled."),scale:"0.5"},e.createElement(o,null)))]},t=()=>{const{cols:o,getCellContent:n,onColumnResize:l}=p(60);return e.createElement(i,{...d,getCellContent:n,columns:o,rowMarkers:"both",rows:500,onColumnResize:l})};var r,a,s;t.parameters={...t.parameters,docs:{...(r=t.parameters)==null?void 0:r.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent,
    onColumnResize
  } = useMockDataGenerator(60);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={cols} rowMarkers="both" rows={500} onColumnResize={onColumnResize} />;
}`,...(s=(a=t.parameters)==null?void 0:a.docs)==null?void 0:s.source}}};const b=["ScaledView"];export{t as ScaledView,b as __namedExportsOrder,M as default};
