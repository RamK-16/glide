import{R as e}from"./iframe-Dj-c93eC.js";import{D as d}from"./data-editor-all-DCPzorWd.js";import{B as u,D as p,P as C,u as f,d as g}from"./utils-Km7H9S8R.js";import{S as h}from"./story-utils-DXTZjkKk.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-BBX2yld6.js";import"./throttle-qh5c6Cq5.js";import"./marked.esm-Chy7_nBT.js";import"./flatten-DpK2-f9m.js";import"./scrolling-data-grid-BP-SgQtB.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-D3jVzk0R.js";const M={title:"Glide-Data-Grid/DataEditor Demos",decorators:[r=>e.createElement(h,null,e.createElement(u,{title:"Theme per row",description:e.createElement(e.Fragment,null,e.createElement(p,null,"Each row can provide theme overrides for rendering that row using the"," ",e.createElement(C,null,"getRowThemeOverride")," callback."))},e.createElement(r,null)))]},o=()=>{const{cols:r,getCellContent:s,onColumnResize:i,setCellValue:m}=f(5),c=e.useMemo(()=>{const t=[...r];return t[3]={...t[3],themeOverride:{bgCell:"#d6fafd"}},t},[r]);return e.createElement(d,{...g,getCellContent:s,columns:c,height:"100%",getRowThemeOverride:t=>t%2===0?void 0:{bgCell:"#e0f0ff88"},onCellEdited:m,onColumnResize:i,rows:10})};var n,l,a;o.parameters={...o.parameters,docs:{...(n=o.parameters)==null?void 0:n.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent,
    onColumnResize,
    setCellValue
  } = useMockDataGenerator(5);
  const realCols = React.useMemo(() => {
    const c = [...cols];
    c[3] = {
      ...c[3],
      themeOverride: {
        bgCell: "#d6fafd"
      }
    };
    return c;
  }, [cols]);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={realCols} height="100%"
  // trailingRowOptions={{
  //     sticky: true,
  //     tint: true,
  // }}
  // onRowAppended={() => undefined}
  getRowThemeOverride={i => i % 2 === 0 ? undefined : {
    bgCell: "#e0f0ff88"
    //   borderColor: "#3f90e0",
  }} onCellEdited={setCellValue} onColumnResize={onColumnResize} rows={10} />;
}`,...(a=(l=o.parameters)==null?void 0:l.docs)==null?void 0:a.source}}};const S=["ThemePerRow"];export{o as ThemePerRow,S as __namedExportsOrder,M as default};
