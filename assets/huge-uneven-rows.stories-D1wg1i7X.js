import{R as e}from"./iframe-B0-fEWM0.js";import{D as _}from"./data-editor-all-BE_rxIk3.js";import{B as D,D as A,P as C,d as O}from"./utils-0VYS1IqP.js";import{S as G}from"./story-utils-C4L-XNzm.js";import{G as T}from"./image-window-loader-CXrnUubn.js";import"./preload-helper-C1FmrZbK.js";import"./throttle-DLjE8mD_.js";import"./flatten-BOKCwLRr.js";import"./scrolling-data-grid-BFw48Y0Z.js";import"./marked.esm-BxsnsY9W.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-D25-f7P5.js";const Q={title:"Glide-Data-Grid/DataEditor Demos",decorators:[n=>e.createElement(G,null,e.createElement(D,{title:"Huge Uneven Rows",description:e.createElement(A,null,"Millions of rows with ",e.createElement(C,null,"rowHeight")," as a callback. In the"," ",e.createElement(C,null,"auto")," mode visible rows get new heights on every scroll and the callback changes, like auto row height by content does.")},e.createElement(n,null)))]},U=[1e4,1e5,1e6,5e6],Y=[6,100,1e3],w=34,b=n=>w+n*7919%5*12,$={display:"flex",gap:16,alignItems:"center",flexWrap:"wrap",marginBottom:12,fontSize:14,color:"#222"};function B(){const[n,f]=e.useState({fps:0,slowest:0,calls:0}),s=e.useRef(0);return e.useEffect(()=>{let u=0,o=0,m=performance.now(),c=m,h=0;const i=l=>{u+=1,o=Math.max(o,l-m),m=l,l-c>=1e3&&(f({fps:Math.round(u*1e3/(l-c)),slowest:o,calls:s.current}),u=0,o=0,s.current=0,c=l),h=requestAnimationFrame(i)};return h=requestAnimationFrame(i),()=>cancelAnimationFrame(h)},[]),{stats:n,calls:s}}const p=()=>{const[n,f]=e.useState(1e6),[s,u]=e.useState(100),[o,m]=e.useState("auto"),[c,h]=e.useState(!0),{stats:i,calls:l}=B(),E=e.useMemo(()=>Array.from({length:s},(t,a)=>({id:`c${a}`,title:`Column ${a}`,width:120})),[s]),g=e.useMemo(()=>new Uint16Array(n),[n]),[y,k]=e.useState(0),x=e.useCallback(t=>{if(o!=="auto")return;let a=!1;const d=Math.min(t.y+t.height,n-1);for(let r=t.y;r<=d;r++)g[r]===0&&(g[r]=b(r),a=!0);a&&k(r=>r+1)},[o,n,g]),H=e.useMemo(()=>o==="fixed"?w:o==="callback"?t=>(l.current+=1,b(t)):t=>(l.current+=1,g[t]||w),[o,g,l,y]),M=e.useCallback(([t,a])=>{const d=t===0?`Row ${a}`:`${a}:${t}`;return{kind:T.Text,data:d,displayData:d,allowOverlay:!1}},[]);return e.createElement("div",{style:{display:"flex",flexDirection:"column",height:"100%"}},e.createElement("div",{style:$},e.createElement("label",null,"Rows"," ",e.createElement("select",{value:n,onChange:t=>f(Number(t.target.value))},U.map(t=>e.createElement("option",{key:t,value:t},t.toLocaleString())))),e.createElement("label",null,"Columns"," ",e.createElement("select",{value:s,onChange:t=>u(Number(t.target.value))},Y.map(t=>e.createElement("option",{key:t,value:t},t)))),e.createElement("label",null,"Row height"," ",e.createElement("select",{value:o,onChange:t=>m(t.target.value)},e.createElement("option",{value:"fixed"},"number"),e.createElement("option",{value:"callback"},"callback, stable"),e.createElement("option",{value:"auto"},"callback, changes on scroll"))),e.createElement("label",null,e.createElement("input",{type:"checkbox",checked:c,onChange:t=>h(t.target.checked)})," ","smoothScrollY"),e.createElement("span",null,i.fps," fps · slowest frame ",i.slowest.toFixed(0)," ms · rowHeight calls/s"," ",i.calls.toLocaleString())),e.createElement("div",{style:{flex:1,minHeight:0}},e.createElement(_,{...O,smoothScrollY:c,getCellContent:M,columns:E,rows:n,rowHeight:H,rowMarkers:"number",height:"100%",onVisibleRegionChanged:x})))};var v,S,R;p.parameters={...p.parameters,docs:{...(v=p.parameters)==null?void 0:v.docs,source:{originalSource:`() => {
  const [rows, setRows] = React.useState(1_000_000);
  const [colCount, setColCount] = React.useState(100);
  const [mode, setMode] = React.useState<HeightMode>("auto");
  const [smoothScrollY, setSmoothScrollY] = React.useState(true);
  const {
    stats,
    calls
  } = useFrameStats();
  const columns = React.useMemo<GridColumn[]>(() => Array.from({
    length: colCount
  }, (_, i) => ({
    id: \`c\${i}\`,
    title: \`Column \${i}\`,
    width: 120
  })), [colCount]);
  const heights = React.useMemo(() => new Uint16Array(rows), [rows]);
  const [version, setVersion] = React.useState(0);
  const onVisibleRegionChanged = React.useCallback((range: Rectangle) => {
    if (mode !== "auto") return;
    let changed = false;
    const last = Math.min(range.y + range.height, rows - 1);
    for (let r = range.y; r <= last; r++) {
      if (heights[r] === 0) {
        heights[r] = heightByRow(r);
        changed = true;
      }
    }
    if (changed) setVersion(v => v + 1);
  }, [mode, rows, heights]);
  const rowHeight = React.useMemo(() => {
    if (mode === "fixed") return BASE_HEIGHT;
    if (mode === "callback") {
      return (row: number) => {
        calls.current += 1;
        return heightByRow(row);
      };
    }
    return (row: number) => {
      calls.current += 1;
      return heights[row] || BASE_HEIGHT;
    };
    // version: появились новые высоты, glide должен спросить их заново
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, heights, calls, version]);
  const getCellContent = React.useCallback(([col, row]: Item): GridCell => {
    const text = col === 0 ? \`Row \${row}\` : \`\${row}:\${col}\`;
    return {
      kind: GridCellKind.Text,
      data: text,
      displayData: text,
      allowOverlay: false
    };
  }, []);
  return <div style={{
    display: "flex",
    flexDirection: "column",
    height: "100%"
  }}>
            <div style={panelStyle}>
                <label>
                    Rows{" "}
                    <select value={rows} onChange={e => setRows(Number(e.target.value))}>
                        {ROW_COUNTS.map(n => <option key={n} value={n}>
                                {n.toLocaleString()}
                            </option>)}
                    </select>
                </label>
                <label>
                    Columns{" "}
                    <select value={colCount} onChange={e => setColCount(Number(e.target.value))}>
                        {COL_COUNTS.map(n => <option key={n} value={n}>
                                {n}
                            </option>)}
                    </select>
                </label>
                <label>
                    Row height{" "}
                    <select value={mode} onChange={e => setMode(e.target.value as HeightMode)}>
                        <option value="fixed">number</option>
                        <option value="callback">callback, stable</option>
                        <option value="auto">callback, changes on scroll</option>
                    </select>
                </label>
                <label>
                    <input type="checkbox" checked={smoothScrollY} onChange={e => setSmoothScrollY(e.target.checked)} />{" "}
                    smoothScrollY
                </label>
                <span>
                    {stats.fps} fps · slowest frame {stats.slowest.toFixed(0)} ms · rowHeight calls/s{" "}
                    {stats.calls.toLocaleString()}
                </span>
            </div>
            <div style={{
      flex: 1,
      minHeight: 0
    }}>
                <DataEditor {...defaultProps} smoothScrollY={smoothScrollY} getCellContent={getCellContent} columns={columns} rows={rows} rowHeight={rowHeight} rowMarkers="number" height="100%" onVisibleRegionChanged={onVisibleRegionChanged} />
            </div>
        </div>;
}`,...(R=(S=p.parameters)==null?void 0:S.docs)==null?void 0:R.source}}};const X=["HugeUnevenRows"];export{p as HugeUnevenRows,X as __namedExportsOrder,Q as default};
