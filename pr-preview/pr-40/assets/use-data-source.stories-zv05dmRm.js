var ae=Object.defineProperty;var ie=(n,e,t)=>e in n?ae(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var _=(n,e,t)=>ie(n,typeof e!="symbol"?e+"":e,t);import{s as T}from"./marked.esm-BF0uC1P7.js";import{R as x,g as le,r as s}from"./iframe-CtASaWxP.js";import{y as R}from"./index-D_kXk1yT.js";import{q as ce,s as ue,u as de,w as pe,x as fe,i as ne,y as me,z as ge,A as ye,r as Ce,n as B}from"./throttle-CwWzIuP9.js";import{G as b,f as he,h as $,j as M,D as te}from"./data-editor-all-BHZ8gQhZ.js";import{u as be}from"./useResizeDetector-DRSoCJWs.js";import"./preload-helper-C1FmrZbK.js";import"./flatten--AwaX-nt.js";function ke(n){const[e,t]=x.useState([]),[o,a]=x.useState(void 0),{columns:r,onGroupHeaderClicked:i,onGridSelectionChange:C,getGroupDetails:g,gridSelection:l,freezeColumns:f=0,theme:d}=n,S=l??o,c=x.useMemo(()=>{const p=[];let h=[-1,-1],v;for(let w=f;w<r.length;w++){const A=r[w],F=Array.isArray(A.group)?A.group[0]??"":A.group??"",E=e.includes(F);v!==F&&h[0]!==-1&&(p.push(h),h=[-1,-1]),E&&h[0]!==-1?h[1]+=1:E?h=[w,1]:h[0]!==-1&&(p.push(h),h=[-1,-1]),v=F}return h[0]!==-1&&p.push(h),p},[e,r,f]),u=x.useMemo(()=>c.length===0?r:r.map((p,h)=>{for(const[v,w]of c)if(h>=v&&h<v+w){let A=8;return h===v+w-1&&(A=36),{...p,width:A,themeOverride:{bgCell:d.bgCellMedium}}}return p}),[r,c,d.bgCellMedium]),y=x.useCallback((p,h)=>{var A;i==null||i(p,h);const v=(A=u[p])==null?void 0:A.group,w=Array.isArray(v)?v[0]??"":v??"";w!==""&&(h.preventDefault(),t(F=>F.includes(w)?F.filter(E=>E!==w):[...F,w]))},[u,i]),k=x.useCallback(p=>{if(p.current!==void 0){const h=p.current.cell[0],v=u[h],w=v==null?void 0:v.group,A=Array.isArray(w)?w[0]??"":w??"";t(F=>F.includes(A)?F.filter(E=>E!==A):F)}C!==void 0?C(p):a(p)},[u,C]),m=x.useCallback(p=>{const h=g==null?void 0:g(p),v=Array.isArray(p)?p[0]??"":p??"";return{...h,name:v,overrideTheme:e.includes(v)?{bgHeader:d.bgHeaderHasFocus}:void 0}},[e,g,d.bgHeaderHasFocus]);return{columns:u,onGroupHeaderClicked:y,onGridSelectionChange:k,getGroupDetails:m,gridSelection:S}}var Se=ue,ve=ce;function we(n,e){var t=-1,o=ve(n)?Array(n.length):[];return Se(n,function(a,r,i){o[++t]=e(a,r,i)}),o}var Ae=we;function Fe(n,e){var t=n.length;for(n.sort(e);t--;)n[t]=n[t].value;return n}var Re=Fe,O=de;function xe(n,e){if(n!==e){var t=n!==void 0,o=n===null,a=n===n,r=O(n),i=e!==void 0,C=e===null,g=e===e,l=O(e);if(!C&&!l&&!r&&n>e||r&&i&&g&&!C&&!l||o&&i&&g||!t&&g||!a)return 1;if(!o&&!r&&!l&&n<e||l&&t&&a&&!o&&!r||C&&t&&a||!i&&a||!g)return-1}return 0}var Me=xe,Ee=Me;function He(n,e,t){for(var o=-1,a=n.criteria,r=e.criteria,i=a.length,C=t.length;++o<i;){var g=Ee(a[o],r[o]);if(g){if(o>=C)return g;var l=t[o];return g*(l=="desc"?-1:1)}}return n.index-e.index}var De=He,I=pe,Ue=me,Ge=ye,Be=Ae,Te=Re,Ie=ge,_e=De,$e=fe,Oe=ne;function ze(n,e,t){e.length?e=I(e,function(r){return Oe(r)?function(i){return Ue(i,r.length===1?r[0]:r)}:r}):e=[$e];var o=-1;e=I(e,Ie(Ge));var a=Be(n,function(r,i,C){var g=I(e,function(l){return l(r)});return{criteria:g,index:++o,value:r}});return Te(a,function(r,i){return _e(r,i,t)})}var Ne=ze,Le=Ne,z=ne;function Ke(n,e,t,o){return n==null?[]:(z(e)||(e=e==null?[]:[e]),t=o?void 0:t,z(t)||(t=t==null?[]:[t]),Le(n,e,t))}var Pe=Ke;const N=le(Pe);function G(n){return n.id??`${n.group??""}/${n.title}`}function L(n,e){return typeof e=="string"?G(n)===e:G(n)===G(e)}function K(n,e,t){const o=e.indexOf(n);if(o===-1)return Number.MAX_SAFE_INTEGER;const a=t.findIndex(r=>L(n,r));if(a!==-1)return a;for(let r=o;r>=0;r--){const i=t.findIndex(C=>L(e[r],C));if(i!==-1)return i+.5}return-1}function Ve(n){const{columns:e,getCellContent:t,onColumnMoved:o}=n,[a,r]=s.useState(()=>e.map(G)),i=s.useMemo(()=>N(e,f=>K(f,e,a)),[a,e]),C=s.useRef(o);C.current=o;const g=s.useCallback((f,d)=>{var S;r(c=>{const u=[...c],[y]=u.splice(f,1);return u.splice(d,0,y),u}),(S=C.current)==null||S.call(C,f,d)},[]);s.useEffect(()=>{r(f=>N(e,d=>K(d,e,f)).map(G))},[e]);const l=s.useCallback(f=>{const[d,S]=f,c=i[d],u=e.indexOf(c);return t([u,S])},[i,e,t]);return{columns:i,onColumnMoved:g,getCellContent:l}}function We(n){var e,t;switch(n.kind){case b.Number:return((e=n.data)==null?void 0:e.toString())??"";case b.Boolean:return((t=n.data)==null?void 0:t.toString())??"";case b.Markdown:case b.RowID:case b.Text:case b.Uri:return n.data??"";case b.Bubble:case b.Image:return n.data.join("");case b.Drilldown:return n.data.map(o=>o.text).join("");case b.Protected:case b.Loading:return"";case b.Custom:return n.copyData}}function P(n){if(typeof n=="number")return n;if(n.length>0){const e=Number(n);isNaN(e)||(n=e)}return n}function Ze(n,e){return n=P(n),e=P(e),typeof n=="string"&&typeof e=="string"?n.localeCompare(e):typeof n=="number"&&typeof e=="number"?n===e?0:n>e?1:-1:n==e?0:n>e?1:-1}function je(n,e){return n>e?1:n===e?0:-1}function Ye(n){const{sort:e,rows:t,getCellContent:o}=n,a=s.useMemo(()=>e===void 0?[]:Array.isArray(e)?e:[e],[e]),r=s.useMemo(()=>a.map(l=>{const f=n.columns.findIndex(d=>l.column===d||d.id!==void 0&&l.column.id===d.id);return f===-1?void 0:f}),[a,n.columns]),i=s.useMemo(()=>{const l=a.map((d,S)=>({sort:d,col:r[S]})).filter(d=>d.col!==void 0);if(l.length===0)return;const f=l.map(()=>new Array(t));for(let d=0;d<l.length;d++){const{col:S}=l[d],c=[S,0];for(let u=0;u<t;u++)c[1]=u,f[d][u]=We(o(c))}return Ce(t).sort((d,S)=>{for(let c=0;c<l.length;c++){const{sort:u}=l[c],y=f[c][d],k=f[c][S];let m;if(u.mode==="raw"?m=je(y,k):u.mode==="smart"?m=Ze(y,k):m=y.localeCompare(k),m!==0)return(u.direction??"asc")==="desc"&&(m=-m),m}return 0})},[o,t,a,r]),C=s.useCallback(l=>i===void 0?l:i[l],[i]),g=s.useCallback(([l,f])=>i===void 0?o([l,f]):(f=i[f],o([l,f])),[o,i]);return i===void 0?{getCellContent:n.getCellContent,getOriginalIndex:C}:{getOriginalIndex:C,getCellContent:g}}const Xe={undoHistory:[],redoHistory:[],canUndo:!1,canRedo:!1,isApplyingUndo:!1,isApplyingRedo:!1};function qe(n,e){const t={...n};switch(e.type){case"undo":if(n.canUndo){t.undoHistory=[...n.undoHistory];const o=t.undoHistory.pop();return t.operation=o,t.canUndo=t.undoHistory.length>0,t.isApplyingUndo=!0,t}return n;case"redo":if(n.canRedo){t.redoHistory=[...n.redoHistory];const o=t.redoHistory.pop();return t.operation=o,t.canRedo=t.redoHistory.length>0,t.isApplyingRedo=!0,t}return n;case"operationApplied":return t.operation=void 0,t.isApplyingRedo=!1,t.isApplyingUndo=!1,t;case"edit":return!n.isApplyingRedo&&!n.isApplyingUndo&&(t.undoHistory=[...n.undoHistory,e.batch],t.redoHistory=[],t.canUndo=!0,t.canRedo=!1),n.isApplyingUndo&&(t.redoHistory=[...n.redoHistory,e.batch],t.canRedo=!0),n.isApplyingRedo&&(t.undoHistory=[...n.undoHistory,e.batch],t.canUndo=!0),t;default:throw new Error("Invalid action")}}function Je(n,e,t,o){const[a,r]=s.useReducer(qe,Xe),i=s.useRef(null),C=s.useRef(null),g=s.useRef(!1),l=s.useRef(!1);s.useEffect(()=>{g.current=a.isApplyingUndo,l.current=a.isApplyingRedo},[a.isApplyingUndo,a.isApplyingRedo]);const[f,d]=s.useState(null),S=s.useRef(null),c=s.useCallback(m=>{d(m),S.current=m},[o]),u=s.useCallback((m,p)=>{if(!(g.current||l.current)&&S.current){clearTimeout(C.current);const v=e(m);i.current===null&&(i.current={edits:[],selection:S.current}),i.current.edits.push({cell:m,newValue:v}),C.current=setTimeout(()=>{i.current&&(r({type:"edit",batch:i.current}),i.current=null)},0)}t(m,p)},[t,e]),y=s.useCallback(()=>{r({type:"undo"})},[r]),k=s.useCallback(()=>{r({type:"redo"})},[r]);return s.useEffect(()=>{if(a.operation!==void 0&&S.current!==null&&n.current!==null){const m=[],p={edits:[],selection:S.current};for(const h of a.operation.edits){const v=e(h.cell);p.edits.push({cell:h.cell,newValue:v}),t(h.cell,h.newValue),m.push({cell:h.cell})}d(a.operation.selection),S.current=a.operation.selection,n.current.updateCells(m),r({type:"edit",batch:p}),r({type:"operationApplied"})}},[a.operation,n,t,d,e]),s.useEffect(()=>{const m=p=>{p.key==="z"&&(p.metaKey||p.ctrlKey)&&(p.shiftKey?k():y()),p.key==="y"&&(p.metaKey||p.ctrlKey)&&k()};return window.addEventListener("keydown",m),()=>{window.removeEventListener("keydown",m)}},[y,k]),s.useMemo(()=>({undo:y,redo:k,canUndo:a.canUndo,canRedo:a.canRedo,onCellEdited:u,onGridSelectionChange:c,gridSelection:f}),[y,k,u,a.canUndo,a.canRedo,c,f])}R.seed(1337);function Qe(n){return!!n}function en(n,e){var o;const t=n.data;if(typeof t==typeof e.data)return{...e,data:t};switch(e.kind){case b.Uri:return B(t)?{...e,data:t[0]}:{...e,data:(t==null?void 0:t.toString())??""};case b.Boolean:return B(t)?{...e,data:t[0]!==void 0}:n.kind===b.Boolean?{...e,data:n.data}:{...e,data:!!Qe(t)};case b.Image:return B(t)?{...e,data:[t[0]]}:{...e,data:[(t==null?void 0:t.toString())??""]};case b.Number:return{...e,data:0};case b.Text:case b.Markdown:return B(t)?{...e,data:t[0].toString()??""}:{...e,data:((o=n.data)==null?void 0:o.toString())??""};case b.Custom:return e}an()}function nn(n){const{getContent:e,...t}=n;return t}function V(n,e){const t=[{title:"First name",id:"First name",group:e?"Name":void 0,icon:M.HeaderString,hasMenu:!1,getContent:()=>{const r=R.name.firstName();return{kind:b.Text,displayData:r,data:r,allowOverlay:!0,readonly:!0}}},{title:"Last name",id:"Last name",group:e?"Name":void 0,icon:M.HeaderString,hasMenu:!1,getContent:()=>{const r=R.name.lastName();return{kind:b.Text,displayData:r,data:r,allowOverlay:!0,readonly:!0}}},{title:"Avatar",id:"Avatar",group:e?"Info":void 0,icon:M.HeaderImage,hasMenu:!1,getContent:()=>{const r=Math.round(Math.random()*100);return{kind:b.Image,data:[`https://picsum.photos/id/${r}/900/900`],displayData:[`https://picsum.photos/id/${r}/40/40`],allowOverlay:!0,readonly:!0}}},{title:"Email",id:"Email",group:e?"Info":void 0,icon:M.HeaderString,hasMenu:!1,getContent:()=>{const r=R.internet.email();return{kind:b.Text,displayData:r,data:r,allowOverlay:!0,readonly:!0}}},{title:"Title",id:"Title",group:e?"Info":void 0,icon:M.HeaderString,hasMenu:!1,getContent:()=>{const r=R.name.jobTitle();return{kind:b.Text,displayData:r,data:r,allowOverlay:!0,readonly:!0}}},{title:"More Info",id:"More Info",group:e?"Info":void 0,icon:M.HeaderUri,hasMenu:!1,getContent:()=>{const r=R.internet.url();return{kind:b.Uri,displayData:r,data:r,allowOverlay:!0,readonly:!0}}}];if(n<t.length)return t.slice(0,n);const o=n-t.length,a=[...new Array(o)].map((r,i)=>tn(i+t.length,e));return[...t,...a]}function tn(n,e){return{title:`Column ${n}`,id:`Column ${n}`,group:e?`Group ${Math.round(n/3)}`:void 0,icon:M.HeaderString,hasMenu:!1,getContent:()=>{const t=R.lorem.word();return{kind:b.Text,data:t,displayData:t,allowOverlay:!0,readonly:!0}}}}class rn{constructor(){_(this,"cachedContent",new Map)}get(e,t){const o=this.cachedContent.get(e);if(o!==void 0)return o[t]}set(e,t,o){let a=this.cachedContent.get(e);a===void 0&&this.cachedContent.set(e,a=[]),a[t]=o}}function on(n,e=!0,t=!1){const o=s.useRef(new rn),[a,r]=s.useState(()=>V(n,t));s.useEffect(()=>{r(V(n,t))},[t,n]);const i=s.useCallback((c,u)=>{r(y=>{const k=y.findIndex(p=>p.title===c.title),m=[...y];return m.splice(k,1,{...y[k],width:u}),m})},[]),C=s.useMemo(()=>a.map(nn),[a]),g=s.useRef(a);g.current=a;const l=s.useCallback(([c,u])=>{let y=o.current.get(c,u);return y===void 0&&(y=g.current[c].getContent(),!e&&he(y)&&(y={...y,readonly:e}),o.current.set(c,u,y)),y},[e]),f=s.useCallback(c=>{const u=[];for(let y=c.y;y<c.y+c.height;y++){const k=[];for(let m=c.x;m<c.x+c.width;m++)k.push(l([m,y]));u.push(k)}return u},[l]),d=s.useCallback(([c,u],y)=>{o.current.set(c,u,y)},[]),S=s.useCallback(([c,u],y)=>{let k=o.current.get(c,u);if(k===void 0&&(k=a[c].getContent()),$(y)&&$(k)){const m=en(y,k);o.current.set(c,u,{...m,displayData:typeof m.data=="string"?m.data:m.displayData,lastUpdated:performance.now()})}},[a]);return{cols:C,getCellContent:l,onColumnResize:i,setCellValue:S,getCellsForSelection:f,setCellValueRaw:d}}function sn(n="This should not happen"){throw new Error(n)}function an(n){return sn("Hell froze over")}R.seed(1337);const ln=T("div")({name:"SimpleWrapper",class:"ss4kmn3",propsAsIs:!1}),cn=n=>s.createElement(ln,null,s.createElement("div",{className:"content"},n.children)),vn={title:"Extra Packages/Source",decorators:[n=>s.createElement(cn,null,s.createElement(n,null))]},un=T("div")({name:"BeautifulStyle",class:"bkh67gx",propsAsIs:!1}),re=n=>{const{title:e,children:t,description:o}=n,{ref:a,width:r,height:i}=be();return s.createElement(un,null,s.createElement("h1",null,e),o,s.createElement("div",{className:"sizer"},s.createElement("div",{className:"sizer-clip",ref:a},s.createElement("div",{style:{position:"relative",width:r??100,height:i??100}},t))))},oe=T("p")({name:"Description",class:"d1deot3s",propsAsIs:!1}),H=T("p")({name:"MoreInfo",class:"m1ml0sw1",propsAsIs:!1}),se={smoothScrollX:!0,smoothScrollY:!0,isDraggable:!1,rowMarkers:"none",width:"100%"},dn={accentColor:"#4F5DFF",accentFg:"#FFFFFF",accentLight:"rgba(62, 116, 253, 0.1)",textDark:"#313139",textMedium:"#737383",textLight:"#B2B2C0",textBubble:"#313139",bgIconHeader:"#737383",fgIconHeader:"#FFFFFF",textHeader:"#313139",textGroupHeader:"#313139BB",textHeaderSelected:"#FFFFFF",bgCell:"#FFFFFF",bgCellMedium:"#FAFAFB",bgHeader:"#F7F7F8",bgHeaderHasFocus:"#E9E9EB",bgHeaderHovered:"#EFEFF1",bgBubble:"#EDEDF3",bgBubbleSelected:"#FFFFFF",bubbleHeight:20,bubblePadding:6,bubbleMargin:4,headerIconSize:20,markerFontStyle:"13px",bgSearchResult:"#fff9e3",borderColor:"rgba(115, 116, 131, 0.16)",horizontalBorderColor:"rgba(115, 116, 131, 0.16)",drilldownBorder:"rgba(0, 0, 0, 0)",linkColor:"#4F5DFF",cellHorizontalPadding:8,cellVerticalPadding:3,headerFontStyle:"600 13px",baseFontStyle:"13px",editorFontSize:"13px",lineHeight:1.4,fontFamily:"Inter, Roboto, -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Ubuntu, noto, arial, sans-serif"},pn=[{title:"A",width:200,group:"Group 1"},{title:"B",width:200,group:"Group 1"},{title:"C",width:200,group:"Group 2"},{title:"D",width:200,group:"Group 2"},{title:"E",width:200,group:"Group 2"}],D=()=>{const n=s.useRef({}),e=1e5,t=Ve({columns:pn,getCellContent:s.useCallback(([g,l])=>{if(g===0)return{kind:b.Text,allowOverlay:!0,data:`${l}`,displayData:`${l}`};const f=`${g},${l}`;n.current[f]===void 0&&(n.current[f]=R.name.firstName()+" "+R.name.lastName());const d=n.current[f];return{kind:b.Text,allowOverlay:!0,data:d,displayData:d}},[])}),[o,a]=s.useState(),r=Ye({columns:t.columns,getCellContent:t.getCellContent,rows:e,sort:o===void 0?void 0:{column:t.columns[o],direction:"desc",mode:"smart"}}),i=ke({columns:t.columns,theme:dn,freezeColumns:0}),C=s.useCallback(g=>{a(g)},[]);return s.createElement(re,{title:"Custom source extensions",description:s.createElement(oe,null,"Fixme.")},s.createElement(te,{...se,...t,...r,...i,rows:e,onColumnMoved:t.onColumnMoved,onHeaderClicked:C}))};D.parameters={options:{showPanel:!1}};const U=()=>{const{cols:n,getCellContent:e,setCellValue:t}=on(6),o=s.useRef(null),{gridSelection:a,onCellEdited:r,onGridSelectionChange:i,undo:C,canRedo:g,canUndo:l,redo:f}=Je(o,e,t);return s.createElement(re,{title:"Undo / Redo Support",description:s.createElement(oe,null,"A simple undo/redo implementation",s.createElement(H,null,"Use keyboard shortcuts CMD+Z and CMD+SHIFT+Z / CTRL+Z and CTRL+Y. Or click these buttons:",s.createElement("button",{onClick:C,disabled:!l,style:{opacity:l?1:.4}},"Undo"),s.createElement("button",{onClick:f,disabled:!g,style:{opacity:g?1:.4}},"Redo")),s.createElement(H,null,"It works by taking a snapshot of the content of a cell before it is edited and replaying any edits back."))},s.createElement(te,{...se,ref:o,onCellEdited:r,getCellContent:e,gridSelection:a??void 0,onGridSelectionChange:i,columns:n,rows:1e3}))};U.parameters={options:{showPanel:!1}};var W,Z,j;H.parameters={...H.parameters,docs:{...(W=H.parameters)==null?void 0:W.docs,source:{originalSource:`styled.p\`
    font-size: 14px;
    flex-shrink: 0;
    margin: 0 0 20px 0;

    button {
        background-color: #f4f4f4;
        color: #2b2b2b;
        padding: 2px 6px;
        font-family: monospace;
        font-size: 14px;
        border-radius: 4px;
        box-shadow: 0px 1px 2px #00000040;
        margin: 0 0.1em;
        border: none;
        cursor: pointer;
    }
\``,...(j=(Z=H.parameters)==null?void 0:Z.docs)==null?void 0:j.source}}};var Y,X,q;D.parameters={...D.parameters,docs:{...(Y=D.parameters)==null?void 0:Y.docs,source:{originalSource:`() => {
  const cache = React.useRef<Record<string, string>>({});
  const rows = 100_000;
  const moveArgs = useMoveableColumns({
    columns: cols,
    getCellContent: React.useCallback(([col, row]) => {
      if (col === 0) {
        return {
          kind: GridCellKind.Text,
          allowOverlay: true,
          data: \`\${row}\`,
          displayData: \`\${row}\`
        };
      }
      const key = \`\${col},\${row}\`;
      if (cache.current[key] === undefined) {
        cache.current[key] = faker.name.firstName() + " " + faker.name.lastName();
      }
      const d = cache.current[key];
      return {
        kind: GridCellKind.Text,
        allowOverlay: true,
        data: d,
        displayData: d
      };
    }, [])
  });
  const [sort, setSort] = React.useState<number>();
  const sortArgs = useColumnSort({
    columns: moveArgs.columns,
    getCellContent: moveArgs.getCellContent,
    rows,
    sort: sort === undefined ? undefined : {
      column: moveArgs.columns[sort],
      direction: "desc",
      mode: "smart"
    }
  });
  const collapseArgs = useCollapsingGroups({
    columns: moveArgs.columns,
    theme: testTheme,
    freezeColumns: 0
  });
  const onHeaderClick = React.useCallback((index: number) => {
    setSort(index);
  }, []);
  return <BeautifulWrapper title="Custom source extensions" description={<Description>Fixme.</Description>}>
            <DataEditor {...defaultProps} {...moveArgs} {...sortArgs} {...collapseArgs} rows={rows} onColumnMoved={moveArgs.onColumnMoved} onHeaderClicked={onHeaderClick} />
        </BeautifulWrapper>;
}`,...(q=(X=D.parameters)==null?void 0:X.docs)==null?void 0:q.source}}};var J,Q,ee;U.parameters={...U.parameters,docs:{...(J=U.parameters)==null?void 0:J.docs,source:{originalSource:`() => {
  const {
    cols: columns,
    getCellContent,
    setCellValue
  } = useMockDataGenerator(6);
  const gridRef = React.useRef<DataEditorRef>(null);
  const {
    gridSelection,
    onCellEdited,
    onGridSelectionChange,
    undo,
    canRedo,
    canUndo,
    redo
  } = useUndoRedo(gridRef, getCellContent, setCellValue);
  return <BeautifulWrapper title="Undo / Redo Support" description={<Description>
                    A simple undo/redo implementation
                    <MoreInfo>
                        Use keyboard shortcuts CMD+Z and CMD+SHIFT+Z / CTRL+Z and CTRL+Y. Or click these buttons:
                        <button onClick={undo} disabled={!canUndo} style={{
        opacity: canUndo ? 1 : 0.4
      }}>
                            Undo
                        </button>
                        <button onClick={redo} disabled={!canRedo} style={{
        opacity: canRedo ? 1 : 0.4
      }}>
                            Redo
                        </button>
                    </MoreInfo>
                    <MoreInfo>
                        It works by taking a snapshot of the content of a cell before it is edited and replaying any
                        edits back.
                    </MoreInfo>
                </Description>}>
            <DataEditor {...defaultProps} ref={gridRef} onCellEdited={onCellEdited} getCellContent={getCellContent} gridSelection={gridSelection ?? undefined} onGridSelectionChange={onGridSelectionChange} columns={columns} rows={1000} />
        </BeautifulWrapper>;
}`,...(ee=(Q=U.parameters)==null?void 0:Q.docs)==null?void 0:ee.source}}};const wn=["MoreInfo","UseDataSource","UndoRedo"];export{H as MoreInfo,U as UndoRedo,D as UseDataSource,wn as __namedExportsOrder,vn as default};
