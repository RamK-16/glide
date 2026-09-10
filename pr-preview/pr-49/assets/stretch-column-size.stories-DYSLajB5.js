import{R as e}from"./iframe-Dj-c93eC.js";import{D as C}from"./data-editor-all-DCPzorWd.js";import{B as w,D as h,P as z,u as R,d as S}from"./utils-Km7H9S8R.js";import{S as f}from"./story-utils-DXTZjkKk.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-BBX2yld6.js";import"./throttle-qh5c6Cq5.js";import"./marked.esm-Chy7_nBT.js";import"./flatten-DpK2-f9m.js";import"./scrolling-data-grid-BP-SgQtB.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-D3jVzk0R.js";const B={title:"Glide-Data-Grid/DataEditor Demos",decorators:[t=>e.createElement(f,null,e.createElement(w,{title:"Column Grow",description:e.createElement(h,null,"Columns in the data grid may be set to grow to fill space by setting the"," ",e.createElement(z,null,"grow")," prop.")},e.createElement(t,null)))]},o=()=>{const{cols:t,getCellContent:m,onColumnResize:c}=R(5,!0,!0),s=e.useRef(new Set),u=e.useMemo(()=>t.map((r,n)=>({...r,grow:s.current.has(n)?void 0:(5+n)/5})),[t]);return e.createElement(C,{...S,getCellContent:m,columns:u,rows:1e3,onColumnResize:(r,n,p,d)=>{s.current.add(p),c(r,d)},rowMarkers:"both"})};var a,l,i;o.parameters={...o.parameters,docs:{...(a=o.parameters)==null?void 0:a.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent,
    onColumnResize
  } = useMockDataGenerator(5, true, true);
  const hasResized = React.useRef(new Set<number>());
  const columns = React.useMemo(() => {
    return cols.map((x, i) => ({
      ...x,
      grow: hasResized.current.has(i) ? undefined : (5 + i) / 5
    }));
  }, [cols]);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={columns} rows={1000} onColumnResize={(col, _newSize, colIndex, newSizeWithGrow) => {
    hasResized.current.add(colIndex);
    onColumnResize(col, newSizeWithGrow);
  }} rowMarkers="both" />;
}`,...(i=(l=o.parameters)==null?void 0:l.docs)==null?void 0:i.source}}};const I=["StretchColumnSize"];export{o as StretchColumnSize,I as __namedExportsOrder,B as default};
