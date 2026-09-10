import{R as e}from"./iframe-Dj-c93eC.js";import{C as a,u as f}from"./image-window-loader-BBX2yld6.js";import{D as w}from"./data-editor-all-DCPzorWd.js";import{B as y,D as E,P as g,M as D,K as l,a as K,d as R}from"./utils-Km7H9S8R.js";import{S as v}from"./story-utils-DXTZjkKk.js";import"./preload-helper-C1FmrZbK.js";import"./throttle-qh5c6Cq5.js";import"./marked.esm-Chy7_nBT.js";import"./flatten-DpK2-f9m.js";import"./scrolling-data-grid-BP-SgQtB.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-D3jVzk0R.js";const x={title:"Glide-Data-Grid/DataEditor Demos",decorators:[n=>e.createElement(v,null,e.createElement(y,{title:"Search is easy",description:e.createElement(e.Fragment,null,e.createElement(E,null,"Search for any data in your grid by setting ",e.createElement(g,null,"showSearch"),"."),e.createElement(D,null,"In this story, ",e.createElement(l,null,"Ctrl")," (",e.createElement(l,null,"⌘")," on Mac) +"," ",e.createElement(l,null,"f")," toggles the search bar. Make sure you're focused on the Data Grid!"))},e.createElement(n,null)))]},o=()=>{const{cols:n,getCellContent:m,onColumnResize:u,setCellValue:p}=K(),[S,r]=e.useState(!1),[d,h]=e.useState({rows:a.empty(),columns:a.empty()});return f("keydown",e.useCallback(t=>{(t.ctrlKey||t.metaKey)&&t.code==="KeyF"&&(r(C=>!C),t.stopPropagation(),t.preventDefault())},[]),window,!1,!0),e.createElement(w,{...R,getCellContent:m,getCellsForSelection:!0,gridSelection:d,onGridSelectionChange:h,columns:n,onCellEdited:p,onColumnResize:u,showSearch:S,onSearchClose:()=>r(!1),rows:1e4})};var s,c,i;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`() => {
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
}`,...(i=(c=o.parameters)==null?void 0:c.docs)==null?void 0:i.source}}};const L=["BuiltInSearch"];export{o as BuiltInSearch,L as __namedExportsOrder,x as default};
