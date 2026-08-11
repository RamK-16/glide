import{R as e}from"./iframe-B5XmEgy5.js";import{D as C}from"./data-editor-all-Cz0EY8r1.js";import{B as w,D as h,P as z,u as R,d as S}from"./utils-Dw8hJtmC.js";import{S as f}from"./story-utils-B5axrbhE.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-DKsvR5Ui.js";import"./marked.esm-D7g0DxGq.js";import"./scrolling-data-grid-BskDifbr.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-AINEZqF_.js";const W={title:"Glide-Data-Grid/DataEditor Demos",decorators:[t=>e.createElement(f,null,e.createElement(w,{title:"Column Grow",description:e.createElement(h,null,"Columns in the data grid may be set to grow to fill space by setting the"," ",e.createElement(z,null,"grow")," prop.")},e.createElement(t,null)))]},o=()=>{const{cols:t,getCellContent:c,onColumnResize:m}=R(5,!0,!0),s=e.useRef(new Set),u=e.useMemo(()=>t.map((r,n)=>({...r,grow:s.current.has(n)?void 0:(5+n)/5})),[t]);return e.createElement(C,{...S,getCellContent:c,columns:u,rows:1e3,onColumnResize:(r,n,d,p)=>{s.current.add(d),m(r,p)},rowMarkers:"both"})};var a,l,i;o.parameters={...o.parameters,docs:{...(a=o.parameters)==null?void 0:a.docs,source:{originalSource:`() => {
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
}`,...(i=(l=o.parameters)==null?void 0:l.docs)==null?void 0:i.source}}};const y=["StretchColumnSize"];export{o as StretchColumnSize,y as __namedExportsOrder,W as default};
