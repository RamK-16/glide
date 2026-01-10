import{R as t}from"./iframe-VjYuGMsY.js";import{D as x}from"./data-editor-all-C18pEU2z.js";import{B as R,D as f,M as g,K as E,u as h,c as y,d as D}from"./utils-DA5KvXiW.js";import{S as k}from"./story-utils-Dv2OgOS1.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-B8cvJCVw.js";import"./marked.esm-CZueurBS.js";import"./scrolling-data-grid-Dlt80JY1.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-1xUx3BY8.js";const O={title:"Glide-Data-Grid/DataEditor Demos",decorators:[r=>t.createElement(k,null,t.createElement(R,{title:"Add data to middle",description:t.createElement(t.Fragment,null,t.createElement(f,null,"You can return a different location to have the new row append take place."),t.createElement(g,null,"Note that ",t.createElement(E,null,"insertIndex"),' is zero-based while the number column on the left side of the grid is one-based, so inserting at index "4" creates a new row at "5"'))},t.createElement(r,null)))]},o=r=>{const{cols:m,getCellContent:a,setCellValueRaw:s,setCellValue:p}=h(60,!1),[i,w]=t.useState(50),l=r.insertIndex,C=t.useCallback(async()=>{for(let e=i;e>l;e--)for(let n=0;n<6;n++)s([n,e],a([n,e-1]));for(let e=0;e<6;e++){const n=a([e,l]);s([e,l],y(n))}return w(e=>e+1),l},[a,i,s,l]);return t.createElement(x,{...D,getCellContent:a,columns:m,rowMarkers:"both",onCellEdited:p,trailingRowOptions:{hint:"New row...",sticky:!0,tint:!0},rows:i,onRowAppended:C})};o.args={insertIndex:10};o.argTypes={insertIndex:{control:{type:"range",min:1,max:48}}};var c,d,u;o.parameters={...o.parameters,docs:{...(c=o.parameters)==null?void 0:c.docs,source:{originalSource:`p => {
  const {
    cols,
    getCellContent,
    setCellValueRaw,
    setCellValue
  } = useMockDataGenerator(60, false);
  const [numRows, setNumRows] = React.useState(50);
  const index = p.insertIndex;
  const onRowAppended = React.useCallback(async () => {
    // shift rows below index down
    for (let y = numRows; y > index; y--) {
      for (let x = 0; x < 6; x++) {
        setCellValueRaw([x, y], getCellContent([x, y - 1]));
      }
    }
    for (let c = 0; c < 6; c++) {
      const cell = getCellContent([c, index]);
      setCellValueRaw([c, index], clearCell(cell));
    }
    setNumRows(cv => cv + 1);
    return index;
  }, [getCellContent, numRows, setCellValueRaw, index]);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={cols} rowMarkers={"both"} onCellEdited={setCellValue} trailingRowOptions={{
    hint: "New row...",
    sticky: true,
    tint: true
  }} rows={numRows} onRowAppended={onRowAppended} />;
}`,...(u=(d=o.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};const _=["AddDataToMiddle"];export{o as AddDataToMiddle,_ as __namedExportsOrder,O as default};
