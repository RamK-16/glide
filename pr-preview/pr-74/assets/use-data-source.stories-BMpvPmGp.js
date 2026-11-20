var se=Object.defineProperty;var ie=(n,e,t)=>e in n?se(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var I=(n,e,t)=>ie(n,typeof e!="symbol"?e+"":e,t);import{s as T}from"./marked.esm-tFo0_PyB.js";import{R,g as le,r as a}from"./iframe-CUpeVJMc.js";import{y as F}from"./index-D_kXk1yT.js";import{q as ce,s as ue,u as de,w as pe,x as fe,i as ne,y as me,z as ge,A as ye,r as Ce,n as B}from"./throttle-CEx6xBPo.js";import{G as b,f as he,h as _,j as M,D as te}from"./data-editor-all-DHZzerhi.js";import{u as be}from"./useResizeDetector-DxNlDJ5G.js";import"./preload-helper-C1FmrZbK.js";import"./flatten-C2E6Wn2M.js";function xe(n){const[e,t]=R.useState([]),[o,s]=R.useState(void 0),{columns:r,onGroupHeaderClicked:i,onGridSelectionChange:C,getGroupDetails:g,gridSelection:l,freezeColumns:f=0,theme:d}=n,k=l??o,c=R.useMemo(()=>{const p=[];let h=[-1,-1],w;for(let v=f;v<r.length;v++){const S=r[v],A=Array.isArray(S.group)?S.group[0]??"":S.group??"",E=e.includes(A);w!==A&&h[0]!==-1&&(p.push(h),h=[-1,-1]),E&&h[0]!==-1?h[1]+=1:E?h=[v,1]:h[0]!==-1&&(p.push(h),h=[-1,-1]),w=A}return h[0]!==-1&&p.push(h),p},[e,r,f]),u=R.useMemo(()=>c.length===0?r:r.map((p,h)=>{for(const[w,v]of c)if(h>=w&&h<w+v){let S=8;return h===w+v-1&&(S=36),{...p,width:S,themeOverride:{bgCell:d.bgCellMedium}}}return p}),[r,c,d.bgCellMedium]),y=R.useCallback((p,h)=>{var S;i==null||i(p,h);const w=(S=u[p])==null?void 0:S.group,v=Array.isArray(w)?w[0]??"":w??"";v!==""&&(h.preventDefault(),t(A=>A.includes(v)?A.filter(E=>E!==v):[...A,v]))},[u,i]),x=R.useCallback(p=>{if(p.current!==void 0){const h=p.current.cell[0],w=u[h],v=w==null?void 0:w.group,S=Array.isArray(v)?v[0]??"":v??"";t(A=>A.includes(S)?A.filter(E=>E!==S):A)}C!==void 0?C(p):s(p)},[u,C]),m=R.useCallback(p=>{const h=g==null?void 0:g(p),w=Array.isArray(p)?p[0]??"":p??"";return{...h,name:w,overrideTheme:e.includes(w)?{bgHeader:d.bgHeaderHasFocus}:void 0}},[e,g,d.bgHeaderHasFocus]);return{columns:u,onGroupHeaderClicked:y,onGridSelectionChange:x,getGroupDetails:m,gridSelection:k}}var ke=ue,we=ce;function ve(n,e){var t=-1,o=we(n)?Array(n.length):[];return ke(n,function(s,r,i){o[++t]=e(s,r,i)}),o}var Se=ve;function Ae(n,e){var t=n.length;for(n.sort(e);t--;)n[t]=n[t].value;return n}var Fe=Ae,$=de;function Re(n,e){if(n!==e){var t=n!==void 0,o=n===null,s=n===n,r=$(n),i=e!==void 0,C=e===null,g=e===e,l=$(e);if(!C&&!l&&!r&&n>e||r&&i&&g&&!C&&!l||o&&i&&g||!t&&g||!s)return 1;if(!o&&!r&&!l&&n<e||l&&t&&s&&!o&&!r||C&&t&&s||!i&&s||!g)return-1}return 0}var Me=Re,Ee=Me;function He(n,e,t){for(var o=-1,s=n.criteria,r=e.criteria,i=s.length,C=t.length;++o<i;){var g=Ee(s[o],r[o]);if(g){if(o>=C)return g;var l=t[o];return g*(l=="desc"?-1:1)}}return n.index-e.index}var De=He,z=pe,Ue=me,Ge=ye,Be=Se,Te=Fe,ze=ge,Ie=De,_e=fe,$e=ne;function Oe(n,e,t){e.length?e=z(e,function(r){return $e(r)?function(i){return Ue(i,r.length===1?r[0]:r)}:r}):e=[_e];var o=-1;e=z(e,ze(Ge));var s=Be(n,function(r,i,C){var g=z(e,function(l){return l(r)});return{criteria:g,index:++o,value:r}});return Te(s,function(r,i){return Ie(r,i,t)})}var Ne=Oe,Le=Ne,O=ne;function Ke(n,e,t,o){return n==null?[]:(O(e)||(e=e==null?[]:[e]),t=o?void 0:t,O(t)||(t=t==null?[]:[t]),Le(n,e,t))}var Pe=Ke;const N=le(Pe);function G(n){return n.id??`${n.group??""}/${n.title}`}function L(n,e){return typeof e=="string"?G(n)===e:G(n)===G(e)}function K(n,e,t){const o=e.indexOf(n);if(o===-1)return Number.MAX_SAFE_INTEGER;const s=t.findIndex(r=>L(n,r));if(s!==-1)return s;for(let r=o;r>=0;r--){const i=t.findIndex(C=>L(e[r],C));if(i!==-1)return i+.5}return-1}function Ve(n){const{columns:e,getCellContent:t,onColumnMoved:o}=n,[s,r]=a.useState(()=>e.map(G)),i=a.useMemo(()=>N(e,f=>K(f,e,s)),[s,e]),C=a.useRef(o);C.current=o;const g=a.useCallback((f,d)=>{var k;r(c=>{const u=[...c],[y]=u.splice(f,1);return u.splice(d,0,y),u}),(k=C.current)==null||k.call(C,f,d)},[]);a.useEffect(()=>{r(f=>N(e,d=>K(d,e,f)).map(G))},[e]);const l=a.useCallback(f=>{const[d,k]=f,c=i[d],u=e.indexOf(c);return t([u,k])},[i,e,t]);return{columns:i,onColumnMoved:g,getCellContent:l}}function We(n){var e,t;switch(n.kind){case b.Number:return((e=n.data)==null?void 0:e.toString())??"";case b.Boolean:return((t=n.data)==null?void 0:t.toString())??"";case b.Markdown:case b.RowID:case b.Text:case b.Uri:return n.data??"";case b.Bubble:case b.Image:return n.data.join("");case b.Drilldown:return n.data.map(o=>o.text).join("");case b.Protected:case b.Loading:return"";case b.Custom:return n.copyData}}function P(n){if(typeof n=="number")return n;if(n.length>0){const e=Number(n);isNaN(e)||(n=e)}return n}function Ze(n,e){return n=P(n),e=P(e),typeof n=="string"&&typeof e=="string"?n.localeCompare(e):typeof n=="number"&&typeof e=="number"?n===e?0:n>e?1:-1:n==e?0:n>e?1:-1}function je(n,e){return n>e?1:n===e?0:-1}function Ye(n){const{sort:e,rows:t,getCellContent:o}=n,s=a.useMemo(()=>e===void 0?[]:Array.isArray(e)?e:[e],[e]),r=a.useMemo(()=>s.map(l=>{const f=n.columns.findIndex(d=>l.column===d||d.id!==void 0&&l.column.id===d.id);return f===-1?void 0:f}),[s,n.columns]),i=a.useMemo(()=>{const l=s.map((d,k)=>({sort:d,col:r[k]})).filter(d=>d.col!==void 0);if(l.length===0)return;const f=l.map(()=>new Array(t));for(let d=0;d<l.length;d++){const{col:k}=l[d],c=[k,0];for(let u=0;u<t;u++)c[1]=u,f[d][u]=We(o(c))}return Ce(t).sort((d,k)=>{for(let c=0;c<l.length;c++){const{sort:u}=l[c],y=f[c][d],x=f[c][k];let m;if(u.mode==="raw"?m=je(y,x):u.mode==="smart"?m=Ze(y,x):m=y.localeCompare(x),m!==0)return(u.direction??"asc")==="desc"&&(m=-m),m}return 0})},[o,t,s,r]),C=a.useCallback(l=>i===void 0?l:i[l],[i]),g=a.useCallback(([l,f])=>i===void 0?o([l,f]):(f=i[f],o([l,f])),[o,i]);return i===void 0?{getCellContent:n.getCellContent,getOriginalIndex:C}:{getOriginalIndex:C,getCellContent:g}}const Xe={undoHistory:[],redoHistory:[],canUndo:!1,canRedo:!1,isApplyingUndo:!1,isApplyingRedo:!1};function qe(n,e){const t={...n};switch(e.type){case"undo":if(n.canUndo){t.undoHistory=[...n.undoHistory];const o=t.undoHistory.pop();return t.operation=o,t.canUndo=t.undoHistory.length>0,t.isApplyingUndo=!0,t}return n;case"redo":if(n.canRedo){t.redoHistory=[...n.redoHistory];const o=t.redoHistory.pop();return t.operation=o,t.canRedo=t.redoHistory.length>0,t.isApplyingRedo=!0,t}return n;case"operationApplied":return t.operation=void 0,t.isApplyingRedo=!1,t.isApplyingUndo=!1,t;case"edit":return!n.isApplyingRedo&&!n.isApplyingUndo&&(t.undoHistory=[...n.undoHistory,e.batch],t.redoHistory=[],t.canUndo=!0,t.canRedo=!1),n.isApplyingUndo&&(t.redoHistory=[...n.redoHistory,e.batch],t.canRedo=!0),n.isApplyingRedo&&(t.undoHistory=[...n.undoHistory,e.batch],t.canUndo=!0),t;default:throw new Error("Invalid action")}}function Je(n,e,t,o){const[s,r]=a.useReducer(qe,Xe),i=a.useRef(null),C=a.useRef(null),g=a.useRef(!1),l=a.useRef(!1);a.useEffect(()=>{g.current=s.isApplyingUndo,l.current=s.isApplyingRedo},[s.isApplyingUndo,s.isApplyingRedo]);const[f,d]=a.useState(null),k=a.useRef(null),c=a.useCallback(m=>{d(m),k.current=m},[o]),u=a.useCallback((m,p)=>{if(!(g.current||l.current)&&k.current){clearTimeout(C.current);const w=e(m);i.current===null&&(i.current={edits:[],selection:k.current}),i.current.edits.push({cell:m,newValue:w}),C.current=setTimeout(()=>{i.current&&(r({type:"edit",batch:i.current}),i.current=null)},0)}t(m,p)},[t,e]),y=a.useCallback(()=>{r({type:"undo"})},[r]),x=a.useCallback(()=>{r({type:"redo"})},[r]);return a.useEffect(()=>{if(s.operation!==void 0&&k.current!==null&&n.current!==null){const m=[],p={edits:[],selection:k.current};for(const h of s.operation.edits){const w=e(h.cell);p.edits.push({cell:h.cell,newValue:w}),t(h.cell,h.newValue),m.push({cell:h.cell})}d(s.operation.selection),k.current=s.operation.selection,n.current.updateCells(m),r({type:"edit",batch:p}),r({type:"operationApplied"})}},[s.operation,n,t,d,e]),a.useEffect(()=>{const m=p=>{p.key==="z"&&(p.metaKey||p.ctrlKey)&&(p.shiftKey?x():y()),p.key==="y"&&(p.metaKey||p.ctrlKey)&&x()};return window.addEventListener("keydown",m),()=>{window.removeEventListener("keydown",m)}},[y,x]),a.useMemo(()=>({undo:y,redo:x,canUndo:s.canUndo,canRedo:s.canRedo,onCellEdited:u,onGridSelectionChange:c,gridSelection:f}),[y,x,u,s.canUndo,s.canRedo,c,f])}F.seed(1337);function Qe(n){return!!n}function en(n,e){var o;const t=n.data;if(typeof t==typeof e.data)return{...e,data:t};switch(e.kind){case b.Uri:return B(t)?{...e,data:t[0]}:{...e,data:(t==null?void 0:t.toString())??""};case b.Boolean:return B(t)?{...e,data:t[0]!==void 0}:n.kind===b.Boolean?{...e,data:n.data}:{...e,data:!!Qe(t)};case b.Image:return B(t)?{...e,data:[t[0]]}:{...e,data:[(t==null?void 0:t.toString())??""]};case b.Number:return{...e,data:0};case b.Text:case b.Markdown:return B(t)?{...e,data:t[0].toString()??""}:{...e,data:((o=n.data)==null?void 0:o.toString())??""};case b.Custom:return e}sn()}function nn(n){const{getContent:e,...t}=n;return t}function V(n,e){const t=[{title:"First name",id:"First name",group:e?"Name":void 0,icon:M.HeaderString,hasMenu:!1,getContent:()=>{const r=F.name.firstName();return{kind:b.Text,displayData:r,data:r,allowOverlay:!0,readonly:!0}}},{title:"Last name",id:"Last name",group:e?"Name":void 0,icon:M.HeaderString,hasMenu:!1,getContent:()=>{const r=F.name.lastName();return{kind:b.Text,displayData:r,data:r,allowOverlay:!0,readonly:!0}}},{title:"Avatar",id:"Avatar",group:e?"Info":void 0,icon:M.HeaderImage,hasMenu:!1,getContent:()=>{const r=Math.round(Math.random()*100);return{kind:b.Image,data:[`https://picsum.photos/id/${r}/900/900`],displayData:[`https://picsum.photos/id/${r}/40/40`],allowOverlay:!0,readonly:!0}}},{title:"Email",id:"Email",group:e?"Info":void 0,icon:M.HeaderString,hasMenu:!1,getContent:()=>{const r=F.internet.email();return{kind:b.Text,displayData:r,data:r,allowOverlay:!0,readonly:!0}}},{title:"Title",id:"Title",group:e?"Info":void 0,icon:M.HeaderString,hasMenu:!1,getContent:()=>{const r=F.name.jobTitle();return{kind:b.Text,displayData:r,data:r,allowOverlay:!0,readonly:!0}}},{title:"More Info",id:"More Info",group:e?"Info":void 0,icon:M.HeaderUri,hasMenu:!1,getContent:()=>{const r=F.internet.url();return{kind:b.Uri,displayData:r,data:r,allowOverlay:!0,readonly:!0}}}];if(n<t.length)return t.slice(0,n);const o=n-t.length,s=[...new Array(o)].map((r,i)=>tn(i+t.length,e));return[...t,...s]}function tn(n,e){return{title:`Column ${n}`,id:`Column ${n}`,group:e?`Group ${Math.round(n/3)}`:void 0,icon:M.HeaderString,hasMenu:!1,getContent:()=>{const t=F.lorem.word();return{kind:b.Text,data:t,displayData:t,allowOverlay:!0,readonly:!0}}}}class rn{constructor(){I(this,"cachedContent",new Map)}get(e,t){const o=this.cachedContent.get(e);if(o!==void 0)return o[t]}set(e,t,o){let s=this.cachedContent.get(e);s===void 0&&this.cachedContent.set(e,s=[]),s[t]=o}}function on(n,e=!0,t=!1){const o=a.useRef(new rn),[s,r]=a.useState(()=>V(n,t));a.useEffect(()=>{r(V(n,t))},[t,n]);const i=a.useCallback((c,u)=>{r(y=>{const x=y.findIndex(p=>p.title===c.title),m=[...y];return m.splice(x,1,{...y[x],width:u}),m})},[]),C=a.useMemo(()=>s.map(nn),[s]),g=a.useRef(s);g.current=s;const l=a.useCallback(([c,u])=>{let y=o.current.get(c,u);return y===void 0&&(y=g.current[c].getContent(),!e&&he(y)&&(y={...y,readonly:e}),o.current.set(c,u,y)),y},[e]),f=a.useCallback(c=>{const u=[];for(let y=c.y;y<c.y+c.height;y++){const x=[];for(let m=c.x;m<c.x+c.width;m++)x.push(l([m,y]));u.push(x)}return u},[l]),d=a.useCallback(([c,u],y)=>{o.current.set(c,u,y)},[]),k=a.useCallback(([c,u],y)=>{let x=o.current.get(c,u);if(x===void 0&&(x=s[c].getContent()),_(y)&&_(x)){const m=en(y,x);o.current.set(c,u,{...m,displayData:typeof m.data=="string"?m.data:m.displayData,lastUpdated:performance.now()})}},[s]);return{cols:C,getCellContent:l,onColumnResize:i,setCellValue:k,getCellsForSelection:f,setCellValueRaw:d}}function an(n="This should not happen"){throw new Error(n)}function sn(n){return an("Hell froze over")}F.seed(1337);const ln=T.div`
    box-sizing: border-box;

    *,
    *::before,
    *::after {
        box-sizing: inherit;
    }
`,cn=n=>a.createElement(ln,null,a.createElement("div",{className:"content"},n.children)),wn={title:"Extra Packages/Source",decorators:[n=>a.createElement(cn,null,a.createElement(n,null))]},un=T.div`
    background-color: #2790b9;
    background: linear-gradient(90deg, #2790b9, #2070a9);
    color: white;

    padding: 32px 48px;

    display: flex;
    flex-direction: column;
    height: 100vh;

    font-family: sans-serif;

    & > h1 {
        font-size: 50px;
        font-weight: 600;
        flex-shrink: 0;
        margin: 0 0 12px 0;
    }

    .sizer {
        flex-grow: 1;

        background-color: white;

        border-radius: 12px;
        box-shadow:
            rgba(9, 30, 66, 0.25) 0px 4px 8px -2px,
            rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;

        .sizer-clip {
            border-radius: 12px;
            overflow: hidden;
            transform: translateZ(0);

            height: 100%;
        }
    }
`,re=n=>{const{title:e,children:t,description:o}=n,{ref:s,width:r,height:i}=be();return a.createElement(un,null,a.createElement("h1",null,e),o,a.createElement("div",{className:"sizer"},a.createElement("div",{className:"sizer-clip",ref:s},a.createElement("div",{style:{position:"relative",width:r??100,height:i??100}},t))))},oe=T.p`
    font-size: 18px;
    flex-shrink: 0;
    margin: 0 0 20px 0;
`,H=T.p`
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
`,ae={smoothScrollX:!0,smoothScrollY:!0,isDraggable:!1,rowMarkers:"none",width:"100%"},dn={accentColor:"#4F5DFF",accentFg:"#FFFFFF",accentLight:"rgba(62, 116, 253, 0.1)",textDark:"#313139",textMedium:"#737383",textLight:"#B2B2C0",textBubble:"#313139",bgIconHeader:"#737383",fgIconHeader:"#FFFFFF",textHeader:"#313139",textGroupHeader:"#313139BB",textHeaderSelected:"#FFFFFF",bgCell:"#FFFFFF",bgCellMedium:"#FAFAFB",bgHeader:"#F7F7F8",bgHeaderHasFocus:"#E9E9EB",bgHeaderHovered:"#EFEFF1",bgBubble:"#EDEDF3",bgBubbleSelected:"#FFFFFF",bubbleHeight:20,bubblePadding:6,bubbleMargin:4,headerIconSize:20,markerFontStyle:"13px",bgSearchResult:"#fff9e3",borderColor:"rgba(115, 116, 131, 0.16)",horizontalBorderColor:"rgba(115, 116, 131, 0.16)",drilldownBorder:"rgba(0, 0, 0, 0)",linkColor:"#4F5DFF",cellHorizontalPadding:8,cellVerticalPadding:3,headerFontStyle:"600 13px",baseFontStyle:"13px",editorFontSize:"13px",lineHeight:1.4,fontFamily:"Inter, Roboto, -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Ubuntu, noto, arial, sans-serif"},pn=[{title:"A",width:200,group:"Group 1"},{title:"B",width:200,group:"Group 1"},{title:"C",width:200,group:"Group 2"},{title:"D",width:200,group:"Group 2"},{title:"E",width:200,group:"Group 2"}],D=()=>{const n=a.useRef({}),e=1e5,t=Ve({columns:pn,getCellContent:a.useCallback(([g,l])=>{if(g===0)return{kind:b.Text,allowOverlay:!0,data:`${l}`,displayData:`${l}`};const f=`${g},${l}`;n.current[f]===void 0&&(n.current[f]=F.name.firstName()+" "+F.name.lastName());const d=n.current[f];return{kind:b.Text,allowOverlay:!0,data:d,displayData:d}},[])}),[o,s]=a.useState(),r=Ye({columns:t.columns,getCellContent:t.getCellContent,rows:e,sort:o===void 0?void 0:{column:t.columns[o],direction:"desc",mode:"smart"}}),i=xe({columns:t.columns,theme:dn,freezeColumns:0}),C=a.useCallback(g=>{s(g)},[]);return a.createElement(re,{title:"Custom source extensions",description:a.createElement(oe,null,"Fixme.")},a.createElement(te,{...ae,...t,...r,...i,rows:e,onColumnMoved:t.onColumnMoved,onHeaderClicked:C}))};D.parameters={options:{showPanel:!1}};const U=()=>{const{cols:n,getCellContent:e,setCellValue:t}=on(6),o=a.useRef(null),{gridSelection:s,onCellEdited:r,onGridSelectionChange:i,undo:C,canRedo:g,canUndo:l,redo:f}=Je(o,e,t);return a.createElement(re,{title:"Undo / Redo Support",description:a.createElement(oe,null,"A simple undo/redo implementation",a.createElement(H,null,"Use keyboard shortcuts CMD+Z and CMD+SHIFT+Z / CTRL+Z and CTRL+Y. Or click these buttons:",a.createElement("button",{onClick:C,disabled:!l,style:{opacity:l?1:.4}},"Undo"),a.createElement("button",{onClick:f,disabled:!g,style:{opacity:g?1:.4}},"Redo")),a.createElement(H,null,"It works by taking a snapshot of the content of a cell before it is edited and replaying any edits back."))},a.createElement(te,{...ae,ref:o,onCellEdited:r,getCellContent:e,gridSelection:s??void 0,onGridSelectionChange:i,columns:n,rows:1e3}))};U.parameters={options:{showPanel:!1}};var W,Z,j;H.parameters={...H.parameters,docs:{...(W=H.parameters)==null?void 0:W.docs,source:{originalSource:`styled.p\`
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
}`,...(ee=(Q=U.parameters)==null?void 0:Q.docs)==null?void 0:ee.source}}};const vn=["MoreInfo","UseDataSource","UndoRedo"];export{H as MoreInfo,U as UndoRedo,D as UseDataSource,vn as __namedExportsOrder,wn as default};
