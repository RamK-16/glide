import{R as e}from"./iframe-C2nlpL-u.js";import{D as n}from"./data-editor-all-B21J8YsR.js";import{B as i,D as m,u as p,d as c}from"./utils--UDJjhZA.js";import{S as u}from"./story-utils-4Ywzy2ee.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-CbnqS_kn.js";import"./throttle-C3oX_PE2.js";import"./marked.esm-DedntjVM.js";import"./flatten-CAgCzqvR.js";import"./scrolling-data-grid-ewGCat2z.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-u0ZLEjz8.js";const S={title:"Glide-Data-Grid/DataEditor Demos",decorators:[r=>e.createElement(u,null,e.createElement(i,{title:"Ten Million Cells",description:e.createElement(m,null,"Data grid supports over 10 million cells. Go nuts with it.")},e.createElement(r,null)))]},t=()=>{const{cols:r,getCellContent:a}=p(100);return e.createElement(n,{...c,rowMarkers:"number",getCellContent:a,columns:r,rows:1e5})};var o,l,s;t.parameters={...t.parameters,docs:{...(o=t.parameters)==null?void 0:o.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(100);
  return <DataEditor {...defaultProps} rowMarkers="number" getCellContent={getCellContent} columns={cols} rows={100_000} />;
}`,...(s=(l=t.parameters)==null?void 0:l.docs)==null?void 0:s.source}}};const b=["TenMillionCells"];export{t as TenMillionCells,b as __namedExportsOrder,S as default};
