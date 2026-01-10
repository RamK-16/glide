import{R as e}from"./iframe-VjYuGMsY.js";import{D as m}from"./data-editor-all-C18pEU2z.js";import{B as u,D as p,P as S,u as C,d as f}from"./utils-DA5KvXiW.js";import{C as l}from"./image-window-loader-B8cvJCVw.js";import{S as w}from"./story-utils-Dv2OgOS1.js";import"./preload-helper-C1FmrZbK.js";import"./scrolling-data-grid-Dlt80JY1.js";import"./marked.esm-CZueurBS.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-1xUx3BY8.js";const P={title:"Glide-Data-Grid/DataEditor Demos",decorators:[n=>e.createElement(w,null,e.createElement(u,{title:"HighlightCells",description:e.createElement(p,null,"The ",e.createElement(S,null,"highlightRegions")," prop can be set to provide additional hinting or context for the current selection.")},e.createElement(n,null)))]},r=()=>{const{cols:n,getCellContent:h}=C(100),[t,g]=e.useState({columns:l.empty(),rows:l.empty()}),d=e.useMemo(()=>{if(t.current===void 0)return;const[o,i]=t.current.cell;return[{color:"#44BB0022",range:{x:o+2,y:i,width:10,height:10},style:"solid"},{color:"#b000b021",range:{x:o,y:i+2,width:1,height:1}}]},[t]);return e.createElement(m,{...f,rowMarkers:"both",freezeColumns:1,highlightRegions:d,gridSelection:t,onGridSelectionChange:g,getCellContent:h,columns:n,verticalBorder:o=>o>0,rows:1e3})};var s,c,a;r.parameters={...r.parameters,docs:{...(s=r.parameters)==null?void 0:s.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(100);
  const [gridSelection, setGridSelection] = React.useState<GridSelection>({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty()
  });
  const highlights = React.useMemo<DataEditorProps["highlightRegions"]>(() => {
    if (gridSelection.current === undefined) return undefined;
    const [col, row] = gridSelection.current.cell;
    return [{
      color: "#44BB0022",
      range: {
        x: col + 2,
        y: row,
        width: 10,
        height: 10
      },
      style: "solid"
    }, {
      color: "#b000b021",
      range: {
        x: col,
        y: row + 2,
        width: 1,
        height: 1
      }
    }];
  }, [gridSelection]);
  return <DataEditor {...defaultProps} rowMarkers="both" freezeColumns={1} highlightRegions={highlights} gridSelection={gridSelection} onGridSelectionChange={setGridSelection} getCellContent={getCellContent} columns={cols} verticalBorder={c => c > 0} rows={1000} />;
}`,...(a=(c=r.parameters)==null?void 0:c.docs)==null?void 0:a.source}}};const k=["HighlightCells"];export{r as HighlightCells,k as __namedExportsOrder,P as default};
