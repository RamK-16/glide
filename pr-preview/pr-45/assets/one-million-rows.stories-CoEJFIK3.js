import{R as e}from"./iframe-DmMcrNAJ.js";import{D as l}from"./data-editor-all-2ICruyZB.js";import{B as i,D as m,u as p,d as c}from"./utils-DM5vcP-3.js";import{S as u}from"./story-utils-DS--zFlz.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-DeaQ_SAU.js";import"./throttle-DNrqMJzu.js";import"./marked.esm-DuEQUBQg.js";import"./flatten-GWEp2q_x.js";import"./scrolling-data-grid-84wLP4-J.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-8lOfFeC-.js";const O={title:"Glide-Data-Grid/DataEditor Demos",decorators:[t=>e.createElement(u,null,e.createElement(i,{title:"One Million Rows",description:e.createElement(m,null,"Data grid supports over 1 million rows. Your limit is mostly RAM.")},e.createElement(t,null)))]},r=()=>{const{cols:t,getCellContent:n}=p(6);return e.createElement(l,{...c,getCellContent:n,columns:t,rowHeight:31,rows:1e6,rowMarkers:"number"})};var o,s,a;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(6);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={cols} rowHeight={31} rows={1_000_000} rowMarkers="number" />;
}`,...(a=(s=r.parameters)==null?void 0:s.docs)==null?void 0:a.source}}};const h=["OneMillionRows"];export{r as OneMillionRows,h as __namedExportsOrder,O as default};
