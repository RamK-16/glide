import{r}from"./iframe-Com6RwAs.js";import{B as A}from"./story-utils-DPI6WxHm.js";import{G as p}from"./image-window-loader-GrzluXqd.js";import{D as f}from"./data-editor-all-7Ibwc-4X.js";import{s as x}from"./marked.esm-NL_vqmE-.js";import"./preload-helper-C1FmrZbK.js";import"./throttle-C38lo_o_.js";import"./flatten-CdjeKbf8.js";import"./scrolling-data-grid-BHYsn5mU.js";const{useState:k,useMemo:L}=__STORYBOOK_MODULE_PREVIEW_API__,U={title:"Tests/TestCases/Bugs",decorators:[e=>r.createElement(A,{width:1e3,height:800},r.createElement(e,null))]},M=([,e])=>({allowOverlay:!0,kind:p.Number,data:e,displayData:e.toString()}),_=()=>{},$=x("div")({name:"Bug70Style",class:"b1nvh7n2",propsAsIs:!1});function d(){const e=[{title:"Col1",width:100},{title:"Col2",width:100}];return r.createElement($,{className:"App"},r.createElement("p",null,"To cause error: scroll down at least one row, edit a cell in Col2, and hit Tab"),r.createElement("a",{href:"https://github.com/glideapps/glide-data-grid/issues/70",target:"_blank",rel:"noreferrer"},"Original report"),r.createElement(f,{width:500,height:500,rows:100,columns:e,getCellContent:M,onCellEdited:_}))}const B=([e,n])=>({allowOverlay:!0,kind:p.Text,data:`${e} - ${n}`,displayData:`${e} - ${n}`}),C=[{title:"Col AAAA",width:120},{title:"Col AAA",width:120},{title:"Col AA",width:120},{title:"Col A",width:120},{title:"Col",width:120}];function m(){const[e,n]=k(""),s=L(()=>e===""?C:C.filter(i=>i.title.toLowerCase().includes(e.toLowerCase())),[e]),l=i=>{n(i.target.value)};return r.createElement("div",null,r.createElement("input",{value:e,onChange:l}),r.createElement(f,{width:1e3,height:500,rows:100,columns:s,getCellContent:B,smoothScrollX:!0,smoothScrollY:!0}))}const G={kind:p.Custom,isMatch:e=>"kind"in e.data&&e.data.kind==="low-dpr-hover-cell",draw:(e,n)=>{const{ctx:s,rect:l,theme:i}=e,{rowHover:a,cellHover:o,text:t}=n.data;s.fillStyle=o?"#ffe8c2":a?"#fff7d8":i.bgCell,s.fillRect(l.x,l.y,l.width,l.height),s.fillStyle=o?"#8a3b00":i.textDark,s.font=i.baseFontFull,s.fillText(t,l.x+10,l.y+l.height/2+4),a&&(s.fillStyle=o?"#d96c00":"#d9a400",s.fillRect(l.x+l.width-14,l.y+8,6,l.height-16))},onPaste:()=>{}},g=Array.from({length:12},(e,n)=>({title:`Column ${n+1}`,width:n<2?130:150,group:n<2?"Frozen":n<6?"Group A":"Group B"})),I=120,O=x("div")({name:"LowDprHairlineStyle",class:"l113lbb1",propsAsIs:!1});function h(){const e=r.useRef(null),n=r.useRef(void 0),s=r.useCallback((...a)=>{var c;const o=new Set(a.filter(u=>u!==void 0&&u>=0));if(o.size===0)return;const t=[];for(const u of o)for(let w=0;w<g.length;w++)t.push({cell:[w,u]});(c=e.current)==null||c.updateCells(t)},[]),l=r.useCallback(([a,o])=>{const t=n.current,c=(t==null?void 0:t[1])===o,u=(t==null?void 0:t[0])===a&&c;return{kind:p.Custom,allowOverlay:!1,copyData:`R${o} C${a}`,data:{kind:"low-dpr-hover-cell",text:`R${o+1} C${a+1}`,rowHover:c,cellHover:u}}},[]),i=r.useCallback(a=>{const o=n.current,t=a.kind==="cell"?a.location:void 0;(o==null?void 0:o[0])===(t==null?void 0:t[0])&&(o==null?void 0:o[1])===(t==null?void 0:t[1])||(n.current=t,s(o==null?void 0:o[1],t==null?void 0:t[1]))},[s]);return r.createElement(O,null,r.createElement("div",null,"Set browser zoom below 100%, then move the pointer over rows. The story calls updateCells for the previous and next hovered rows while custom cells repaint their full rect."),r.createElement(f,{ref:e,width:1e3,height:560,rows:I,columns:g,freezeColumns:2,freezeTrailingRows:1,groupHeaderHeight:28,getCellContent:l,customRenderers:[G],onMouseMove:i,experimental:{enableLowDprHairline:!0},smoothScrollX:!0,smoothScrollY:!0}))}var v,R,S;d.parameters={...d.parameters,docs:{...(v=d.parameters)==null?void 0:v.docs,source:{originalSource:`function Bug70() {
  const cols = [{
    title: "Col1",
    width: 100
  }, {
    title: "Col2",
    width: 100
  }];
  return <Bug70Style className="App">
            <p>To cause error: scroll down at least one row, edit a cell in Col2, and hit Tab</p>
            <a href="https://github.com/glideapps/glide-data-grid/issues/70" target="_blank" rel="noreferrer">
                Original report
            </a>
            <DataEditor width={500} height={500} rows={100} columns={cols} getCellContent={bug70Gen} onCellEdited={ignore} />
        </Bug70Style>;
}`,...(S=(R=d.parameters)==null?void 0:R.docs)==null?void 0:S.source}}};var D,b,y;m.parameters={...m.parameters,docs:{...(D=m.parameters)==null?void 0:D.docs,source:{originalSource:`function FilterColumns() {
  const [searchText, setSearchText] = useState("");
  const cols = useMemo(() => {
    if (searchText === "") {
      return filteringColumns;
    }
    return filteringColumns.filter(c => c.title.toLowerCase().includes(searchText.toLowerCase()));
  }, [searchText]);
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };
  return <div>
            <input value={searchText} onChange={onInputChange} />
            <DataEditor width={1000} height={500} rows={100} columns={cols} getCellContent={filterColumnsGen} smoothScrollX={true} smoothScrollY={true} />
        </div>;
}`,...(y=(b=m.parameters)==null?void 0:b.docs)==null?void 0:y.source}}};var E,H,T;h.parameters={...h.parameters,docs:{...(E=h.parameters)==null?void 0:E.docs,source:{originalSource:`function LowDprHairlineDamageHover() {
  const ref = React.useRef<DataEditorRef>(null);
  const hoveredCellRef = React.useRef<Item | undefined>(undefined);
  const updateRows = React.useCallback((...rows: Array<number | undefined>) => {
    const uniqueRows = new Set(rows.filter((row): row is number => row !== undefined && row >= 0));
    if (uniqueRows.size === 0) return;
    const cells: Array<{
      cell: Item;
    }> = [];
    for (const row of uniqueRows) {
      for (let col = 0; col < lowDprColumns.length; col++) {
        cells.push({
          cell: [col, row]
        });
      }
    }
    ref.current?.updateCells(cells);
  }, []);
  const getCellContent = React.useCallback(([col, row]: Item): GridCell => {
    const hoveredCell = hoveredCellRef.current;
    const rowHover = hoveredCell?.[1] === row;
    const cellHover = hoveredCell?.[0] === col && rowHover;
    return {
      kind: GridCellKind.Custom,
      allowOverlay: false,
      copyData: \`R\${row} C\${col}\`,
      data: {
        kind: "low-dpr-hover-cell",
        text: \`R\${row + 1} C\${col + 1}\`,
        rowHover,
        cellHover
      }
    };
  }, []);
  const onMouseMove = React.useCallback((event: GridMouseEventArgs) => {
    const previousCell = hoveredCellRef.current;
    const nextCell = event.kind === "cell" ? event.location : undefined;
    const sameCell = previousCell?.[0] === nextCell?.[0] && previousCell?.[1] === nextCell?.[1];
    if (sameCell) return;
    hoveredCellRef.current = nextCell;
    updateRows(previousCell?.[1], nextCell?.[1]);
  }, [updateRows]);
  return <LowDprHairlineStyle>
            <div>
                Set browser zoom below 100%, then move the pointer over rows. The story calls updateCells for the
                previous and next hovered rows while custom cells repaint their full rect.
            </div>
            <DataEditor ref={ref} width={1000} height={560} rows={lowDprRows} columns={lowDprColumns} freezeColumns={2} freezeTrailingRows={1} groupHeaderHeight={28} getCellContent={getCellContent} customRenderers={[lowDprHoverRenderer]} onMouseMove={onMouseMove} experimental={{
      enableLowDprHairline: true
    }} smoothScrollX smoothScrollY />
        </LowDprHairlineStyle>;
}`,...(T=(H=h.parameters)==null?void 0:H.docs)==null?void 0:T.source}}};const V=["Bug70","FilterColumns","LowDprHairlineDamageHover"];export{d as Bug70,m as FilterColumns,h as LowDprHairlineDamageHover,V as __namedExportsOrder,U as default};
