import{R as e}from"./iframe-CUpeVJMc.js";import{D as v}from"./data-editor-all-BCjZtlbU.js";import{B as D,D as S,P as d,M as w,u as b,d as f}from"./utils-mEQVggKF.js";import{S as M}from"./story-utils-Cm_6lJ4s.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-Ccev80tu.js";import"./throttle-CEx6xBPo.js";import"./marked.esm-tFo0_PyB.js";import"./flatten-C2E6Wn2M.js";import"./scrolling-data-grid-DV97Ax7d.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-DxNlDJ5G.js";const Y={title:"Glide-Data-Grid/DataEditor Demos",decorators:[n=>e.createElement(M,null,e.createElement(D,{title:"Resizable columns",description:e.createElement(e.Fragment,null,e.createElement(S,null,"You can resize columns by dragging their edges, as long as you respond to the"," ",e.createElement(d,null,"onColumnResize")," prop."),e.createElement(w,null,"By setting the ",e.createElement(d,null,"overscrollX")," property extra space can be allocated at the end of the grid to allow for easier resizing of the final column. You can highlight multiple columns to resize them all at once."))},e.createElement(n,null)))]},r=()=>{const{cols:n,getCellContent:l,onColumnResize:s}=b(60);return e.createElement(v,{...f,getCellContent:l,columns:n,rowMarkers:"both",overscrollX:200,overscrollY:200,maxColumnAutoWidth:500,maxColumnWidth:2e3,rows:50,scaleToRem:!0,theme:e.useMemo(()=>({baseFontStyle:"0.8125rem",headerFontStyle:"600 0.8125rem",editorFontSize:"0.8125rem"}),[]),onColumnResize:s})},a=()=>{const{cols:n,getCellContent:l,onColumnResize:s}=b(6),[i,E]=e.useState(!0),[c,R]=e.useState(!0),[u,y]=e.useState("full"),x=e.useMemo(()=>n.map((t,o)=>({...t,group:o===0?void 0:"Details",resizable:o!==1,minWidth:o===2?100:void 0,maxWidth:o===2?320:void 0})),[n]),k=e.useMemo(()=>({resizeIndicatorColor:"#0B7ECB"}),[]);return e.createElement("div",{style:{color:"#1f2328"}},e.createElement("div",{style:{display:"flex",gap:16,padding:"8px 0"}},e.createElement("label",null,e.createElement("input",{type:"checkbox",checked:i,onChange:t=>E(t.target.checked)}),"Hover indicator"),e.createElement("label",null,e.createElement("input",{type:"checkbox",checked:c,onChange:t=>R(t.target.checked)}),"Allow resizing"),e.createElement("label",null,"Drag indicator",e.createElement("select",{value:u,onChange:t=>y(t.target.value)},e.createElement("option",{value:"full"},"Full height"),e.createElement("option",{value:"header"},"Header only"),e.createElement("option",{value:"none"},"None (also hides hover)")))),e.createElement("p",null,"Hover: header only, without delay or animation. Drag: full height by default. Both: 2 px, #0B7ECB, col-resize cursor. The first data column is frozen, the second cannot be resized."),e.createElement(v,{...f,width:720,height:380,columns:x,rows:50,getCellContent:l,onColumnResize:c?s:void 0,resizeIndicatorOnHover:i,resizeIndicator:u,theme:k,rowMarkers:"both",freezeColumns:1,overscrollX:100}))};var m,h,p;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent,
    onColumnResize
  } = useMockDataGenerator(60);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={cols} rowMarkers="both" overscrollX={200} overscrollY={200} maxColumnAutoWidth={500} maxColumnWidth={2000} rows={50} scaleToRem={true} theme={React.useMemo(() => ({
    baseFontStyle: "0.8125rem",
    headerFontStyle: "600 0.8125rem",
    editorFontSize: "0.8125rem"
  }), [])} onColumnResize={onColumnResize} />;
}`,...(p=(h=r.parameters)==null?void 0:h.docs)==null?void 0:p.source}}};var g,C,z;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent,
    onColumnResize
  } = useMockDataGenerator(6);
  const [enabled, setEnabled] = React.useState(true);
  const [canResize, setCanResize] = React.useState(true);
  const [indicator, setIndicator] = React.useState<NonNullable<DataEditorProps["resizeIndicator"]>>("full");
  const columns = React.useMemo(() => cols.map((column, index) => ({
    ...column,
    group: index === 0 ? undefined : "Details",
    resizable: index !== 1,
    minWidth: index === 2 ? 100 : undefined,
    maxWidth: index === 2 ? 320 : undefined
  })), [cols]);
  const theme = React.useMemo(() => ({
    resizeIndicatorColor: "#0B7ECB"
  }), []);
  return <div style={{
    color: "#1f2328"
  }}>
            <div style={{
      display: "flex",
      gap: 16,
      padding: "8px 0"
    }}>
                <label>
                    <input type="checkbox" checked={enabled} onChange={event => setEnabled(event.target.checked)} />
                    Hover indicator
                </label>
                <label>
                    <input type="checkbox" checked={canResize} onChange={event => setCanResize(event.target.checked)} />
                    Allow resizing
                </label>
                <label>
                    Drag indicator
                    <select value={indicator} onChange={event => setIndicator(event.target.value as typeof indicator)}>
                        <option value="full">Full height</option>
                        <option value="header">Header only</option>
                        <option value="none">None (also hides hover)</option>
                    </select>
                </label>
            </div>
            <p>
                Hover: header only, without delay or animation. Drag: full height by default. Both: 2 px, #0B7ECB,
                col-resize cursor. The first data column is frozen, the second cannot be resized.
            </p>
            <DataEditor {...defaultProps} width={720} height={380} columns={columns} rows={50} getCellContent={getCellContent} onColumnResize={canResize ? onColumnResize : undefined} resizeIndicatorOnHover={enabled} resizeIndicator={indicator} theme={theme} rowMarkers="both" freezeColumns={1} overscrollX={100} />
        </div>;
}`,...(z=(C=a.parameters)==null?void 0:C.docs)==null?void 0:z.source}}};const _=["ResizableColumns","ResizeIndicatorOnHover"];export{r as ResizableColumns,a as ResizeIndicatorOnHover,_ as __namedExportsOrder,Y as default};
