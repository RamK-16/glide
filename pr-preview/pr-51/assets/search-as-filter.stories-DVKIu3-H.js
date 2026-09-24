import{R as e}from"./iframe-D0oCNEqE.js";import{C as r,u as w}from"./image-window-loader-CQ4EeyG0.js";import{D as f}from"./data-editor-all-DttR3xgU.js";import{B as V,D as y,a as E,d as R}from"./utils-D2QT2-Gt.js";import{S as D}from"./story-utils-6lEGHdtT.js";import"./preload-helper-C1FmrZbK.js";import"./throttle-Q_dl0vHX.js";import"./marked.esm-D-5wix1y.js";import"./flatten-ChoV_xFb.js";import"./scrolling-data-grid-BbzHGkN6.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-DE2_iAQb.js";const L={title:"Glide-Data-Grid/DataEditor Demos",decorators:[a=>e.createElement(D,null,e.createElement(V,{title:"Filtering down to search results",description:e.createElement(e.Fragment,null,e.createElement(y,null,"You can update your grid however you want based on search inputs."))},e.createElement(a,null)))]},o=()=>{const{cols:a,getCellContent:m,onColumnResize:h,setCellValue:S}=E(),[p,s]=e.useState(!1),[d,C]=e.useState({rows:r.empty(),columns:r.empty()});w("keydown",e.useCallback(t=>{(t.ctrlKey||t.metaKey)&&t.code==="KeyF"&&(s(g=>!g),t.stopPropagation(),t.preventDefault())},[]),window,!1,!0);const[n,l]=e.useState("");return e.createElement(f,{...R,searchResults:[],getCellContent:m,getCellsForSelection:!0,gridSelection:d,onGridSelectionChange:C,columns:a,onCellEdited:S,onColumnResize:h,searchValue:n,onSearchValueChange:l,showSearch:p,onSearchClose:()=>{s(!1),l("")},rows:n.length===0?1e4:n.length})};var c,i,u;o.parameters={...o.parameters,docs:{...(c=o.parameters)==null?void 0:c.docs,source:{originalSource:`() => {
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
  const [searchValue, setSearchValue] = React.useState("");
  return <DataEditor {...defaultProps} searchResults={[]} getCellContent={getCellContent} getCellsForSelection={true} gridSelection={selection} onGridSelectionChange={setSelection} columns={cols} onCellEdited={setCellValue} onColumnResize={onColumnResize} searchValue={searchValue} onSearchValueChange={setSearchValue} showSearch={showSearch} onSearchClose={() => {
    setShowSearch(false);
    setSearchValue("");
  }} rows={searchValue.length === 0 ? 10_000 : searchValue.length} />;
}`,...(u=(i=o.parameters)==null?void 0:i.docs)==null?void 0:u.source}}};const M=["SearchAsFilter"];export{o as SearchAsFilter,M as __namedExportsOrder,L as default};
