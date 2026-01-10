import{R as n}from"./iframe-VjYuGMsY.js";import{D as g}from"./data-editor-all-C18pEU2z.js";import{B as O,D as x,P as h,u as I,c as f,d as E}from"./utils-DA5KvXiW.js";import{h as a}from"./image-window-loader-B8cvJCVw.js";import{S as D}from"./story-utils-Dv2OgOS1.js";import"./preload-helper-C1FmrZbK.js";import"./scrolling-data-grid-Dlt80JY1.js";import"./marked.esm-CZueurBS.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-1xUx3BY8.js";const B={title:"Glide-Data-Grid/DataEditor Demos",decorators:[t=>n.createElement(D,null,n.createElement(O,{title:"Trailing row options",description:n.createElement(x,null,"You can customize the trailing row in each column by setting a"," ",n.createElement(h,null,"trailingRowOptions")," in your columns.")},n.createElement(t,null)))]},b={2:"Smol text",3:"Add",5:"New"},k={2:a.HeaderArray,3:a.HeaderEmoji,5:a.HeaderNumber},T={2:0,3:0,5:0},A={3:!0},S={2:{baseFontStyle:"10px"}},l=()=>{const{cols:t,getCellContent:s,setCellValueRaw:i,setCellValue:d}=I(60,!1),[r,p]=n.useState(50),w=n.useCallback(()=>{const o=r;for(let e=0;e<6;e++){const C=s([e,o]);i([e,o],f(C))}p(e=>e+1)},[s,r,i]),R=n.useMemo(()=>t.map((o,e)=>({...o,trailingRowOptions:{hint:b[e],addIcon:k[e],targetColumn:T[e],disabled:A[e],themeOverride:S[e]}})),[t]);return n.createElement(g,{...E,getCellContent:s,columns:R,rowMarkers:"both",onCellEdited:d,trailingRowOptions:{tint:!0,sticky:!0},rows:r,onRowAppended:w})};var c,m,u;l.parameters={...l.parameters,docs:{...(c=l.parameters)==null?void 0:c.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent,
    setCellValueRaw,
    setCellValue
  } = useMockDataGenerator(60, false);
  const [numRows, setNumRows] = React.useState(50);
  const onRowAppended = React.useCallback(() => {
    const newRow = numRows;
    for (let c = 0; c < 6; c++) {
      const cell = getCellContent([c, newRow]);
      setCellValueRaw([c, newRow], clearCell(cell));
    }
    setNumRows(cv => cv + 1);
  }, [getCellContent, numRows, setCellValueRaw]);
  const columnsWithRowOptions: GridColumn[] = React.useMemo(() => {
    return cols.map((c, idx) => ({
      ...c,
      trailingRowOptions: {
        hint: trailingRowOptionsColumnIndexesHint[idx],
        addIcon: trailingRowOptionsColumnIndexesIcon[idx],
        targetColumn: trailingRowOptionsColumnIndexesTarget[idx],
        disabled: trailingRowOptionsColumnIndexesDisabled[idx],
        themeOverride: trailingRowOptionsColumnIndexesTheme[idx]
      }
    }));
  }, [cols]);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={columnsWithRowOptions} rowMarkers={"both"} onCellEdited={setCellValue} trailingRowOptions={{
    tint: true,
    sticky: true
  }} rows={numRows} onRowAppended={onRowAppended} />;
}`,...(u=(m=l.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};const j=["TrailingRowOptions"];export{l as TrailingRowOptions,j as __namedExportsOrder,B as default};
