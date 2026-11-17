import{R as e}from"./iframe-DUVzDgRe.js";import{D as m}from"./data-editor-all-DebgIl5G.js";import{B as c,D as u,M as i,u as p,d}from"./utils-CdRvwCHd.js";import{S as C}from"./story-utils-CWDX46z3.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-vlepfwIB.js";import"./throttle-Bo98JR1T.js";import"./marked.esm-10dn120L.js";import"./flatten-CqMnxuFn.js";import"./scrolling-data-grid-DGdhlrbm.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-Bw5PHq86.js";const _={title:"Glide-Data-Grid/DataEditor Demos",decorators:[r=>e.createElement(C,null,e.createElement(c,{title:"Add and remove columns",description:e.createElement(e.Fragment,null,e.createElement(u,null,"You can add and remove columns at your disposal"),e.createElement(i,null,"Use the story's controls to change the number of columns"))},e.createElement(r,null)))]},t=r=>{const{cols:s,getCellContent:l}=p(r.columnsCount);return e.createElement(m,{...d,rowMarkers:"number",getCellContent:l,experimental:{strict:!0},columns:s,rows:1e4})};t.args={columnsCount:10};t.argTypes={columnsCount:{control:{type:"range",min:2,max:200}}};var o,n,a;t.parameters={...t.parameters,docs:{...(o=t.parameters)==null?void 0:o.docs,source:{originalSource:`p => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(p.columnsCount);
  return <DataEditor {...defaultProps} rowMarkers="number" getCellContent={getCellContent} experimental={{
    strict: true
  }} columns={cols} rows={10_000} />;
}`,...(a=(n=t.parameters)==null?void 0:n.docs)==null?void 0:a.source}}};const b=["AddColumns"];export{t as AddColumns,b as __namedExportsOrder,_ as default};
