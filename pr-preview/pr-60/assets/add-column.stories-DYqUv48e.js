import{R as e}from"./iframe-D_CHh7La.js";import{D as m}from"./data-editor-all-BP5koKVh.js";import{B as c,D as u,M as i,u as p,d}from"./utils-ClOyOVO9.js";import{S as C}from"./story-utils-nNLiij0x.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-2MuPt34i.js";import"./throttle-DjA3whrK.js";import"./marked.esm-sSuBLYN_.js";import"./flatten-FpgrWzPm.js";import"./scrolling-data-grid-BtUeDjIQ.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-B5OsoQZP.js";const _={title:"Glide-Data-Grid/DataEditor Demos",decorators:[r=>e.createElement(C,null,e.createElement(c,{title:"Add and remove columns",description:e.createElement(e.Fragment,null,e.createElement(u,null,"You can add and remove columns at your disposal"),e.createElement(i,null,"Use the story's controls to change the number of columns"))},e.createElement(r,null)))]},t=r=>{const{cols:s,getCellContent:l}=p(r.columnsCount);return e.createElement(m,{...d,rowMarkers:"number",getCellContent:l,experimental:{strict:!0},columns:s,rows:1e4})};t.args={columnsCount:10};t.argTypes={columnsCount:{control:{type:"range",min:2,max:200}}};var o,n,a;t.parameters={...t.parameters,docs:{...(o=t.parameters)==null?void 0:o.docs,source:{originalSource:`p => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(p.columnsCount);
  return <DataEditor {...defaultProps} rowMarkers="number" getCellContent={getCellContent} experimental={{
    strict: true
  }} columns={cols} rows={10_000} />;
}`,...(a=(n=t.parameters)==null?void 0:n.docs)==null?void 0:a.source}}};const b=["AddColumns"];export{t as AddColumns,b as __namedExportsOrder,_ as default};
