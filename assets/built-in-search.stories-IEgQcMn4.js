import{R as e}from"./iframe-VjYuGMsY.js";import{C as r,j as f}from"./image-window-loader-B8cvJCVw.js";import{D as w}from"./data-editor-all-C18pEU2z.js";import{B as y,D as E,P as g,M as D,K as l,a as K,d as R}from"./utils-DA5KvXiW.js";import{S as v}from"./story-utils-Dv2OgOS1.js";import"./preload-helper-C1FmrZbK.js";import"./marked.esm-CZueurBS.js";import"./scrolling-data-grid-Dlt80JY1.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-1xUx3BY8.js";const A={title:"Glide-Data-Grid/DataEditor Demos",decorators:[n=>e.createElement(v,null,e.createElement(y,{title:"Search is easy",description:e.createElement(e.Fragment,null,e.createElement(E,null,"Search for any data in your grid by setting ",e.createElement(g,null,"showSearch"),"."),e.createElement(D,null,"In this story, ",e.createElement(l,null,"Ctrl")," (",e.createElement(l,null,"⌘")," on Mac) +"," ",e.createElement(l,null,"f")," toggles the search bar. Make sure you're focused on the Data Grid!"))},e.createElement(n,null)))]},o=()=>{const{cols:n,getCellContent:m,onColumnResize:u,setCellValue:S}=K(),[d,a]=e.useState(!1),[p,h]=e.useState({rows:r.empty(),columns:r.empty()});return f("keydown",e.useCallback(t=>{(t.ctrlKey||t.metaKey)&&t.code==="KeyF"&&(a(C=>!C),t.stopPropagation(),t.preventDefault())},[]),window,!1,!0),e.createElement(w,{...R,getCellContent:m,getCellsForSelection:!0,gridSelection:p,onGridSelectionChange:h,columns:n,onCellEdited:S,onColumnResize:u,showSearch:d,onSearchClose:()=>a(!1),rows:1e4})};var s,c,i;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent,
    onColumnResize,
    setCellValue
  } = useAllMockedKinds();
  const [showSearch, setShowSearch] = React.useState(false);
  const [selection, setSelection] = React.useState<GridSelection>({
    rows: CompactSelection.empty(),
    columns: CompactSelection.empty()
  });
  useEventListener("keydown", React.useCallback(event => {
    if ((event.ctrlKey || event.metaKey) && event.code === "KeyF") {
      setShowSearch(cv => !cv);
      event.stopPropagation();
      event.preventDefault();
    }
  }, []), window, false, true);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} getCellsForSelection={true} gridSelection={selection} onGridSelectionChange={setSelection} columns={cols} onCellEdited={setCellValue} onColumnResize={onColumnResize} showSearch={showSearch} onSearchClose={() => setShowSearch(false)} rows={10_000} />;
}`,...(i=(c=o.parameters)==null?void 0:c.docs)==null?void 0:i.source}}};const V=["BuiltInSearch"];export{o as BuiltInSearch,V as __namedExportsOrder,A as default};
