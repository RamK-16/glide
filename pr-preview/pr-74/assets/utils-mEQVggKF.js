var T=Object.defineProperty;var z=(e,t,a)=>t in e?T(e,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[t]=a;var D=(e,t,a)=>z(e,typeof t!="symbol"?t+"":t,a);import{r as l}from"./iframe-CUpeVJMc.js";import{a5 as S,a6 as E,L as v,G as n,a as d}from"./image-window-loader-Ccev80tu.js";import{y as o}from"./index-D_kXk1yT.js";import{s as x}from"./marked.esm-tFo0_PyB.js";import{n as k}from"./throttle-CEx6xBPo.js";import{n as B}from"./flatten-C2E6Wn2M.js";import{u as $}from"./useResizeDetector-DxNlDJ5G.js";o.seed(1337);function A(e){return!!e}function O(e,t){var s;const a=e.data;if(typeof a==typeof t.data)return{...t,data:a};switch(t.kind){case n.Uri:return k(a)?{...t,data:a[0]}:{...t,data:(a==null?void 0:a.toString())??""};case n.Boolean:return k(a)?{...t,data:a[0]!==void 0}:e.kind===n.Boolean?{...t,data:e.data}:{...t,data:!!A(a)};case n.Image:return k(a)?{...t,data:[a[0]]}:{...t,data:[(a==null?void 0:a.toString())??""]};case n.Number:return{...t,data:0};case n.Text:case n.Markdown:return k(a)?{...t,data:a[0].toString()??""}:{...t,data:((s=e.data)==null?void 0:s.toString())??""};case n.Custom:return t}}function H(e){const{getContent:t,...a}=e;return a}const X=x.div`
    width: 120px;
    display: flex;
    flex-direction: column;
    background-color: #f1f1f1;
    height: 100%;
    button {
        border: none;
        outline: none;
        height: 37px;
        width: 120px;
        font-size: 20px;
        background-color: #f7f7f8;
        color: #000000dd;
        border-bottom: 1px solid #e1e2e5;

        transition: background-color 200ms;

        cursor: pointer;
        :hover {
            background-color: #efeff1;
        }
    }
`,R=x.div`
    background-color: #2790b9;
    background: linear-gradient(90deg, #2790b9, #2070a9);
    color: white;

    padding: 32px 48px;

    display: flex;
    flex-direction: column;
    height: 100vh;

    font-family: sans-serif;

    &.double {
        height: 200vh;
    }

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

    &.firefox .sizer {
        border-radius: 0;
        box-shadow: unset;

        .sizer-clip {
            border-radius: 0;
        }
    }

    .white {
        background-color: white;
    }
`,Y=x.span`
    font-family: monospace;
    font-weight: 500;
    color: #ffe394;
`,Z=x.p`
    font-size: 18px;
    flex-shrink: 0;
    margin: 0 0 20px 0;
`,q=x.p`
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
`,J=e=>{const{title:t,children:a,description:s,className:u,scale:r}=e,{ref:w,width:C,height:b}=$();return l.createElement(R,{className:u+(S.value?" firefox":"")},l.createElement("h1",null,t),s,l.createElement("div",{style:{scale:r},className:"sizer"},l.createElement("div",{className:"sizer-clip",ref:w},l.createElement("div",{style:{position:"relative",width:C??100,height:b??100}},a))))};function U(e,t){return{title:`Column ${e}`,id:`Column ${e}`,group:t?`Group ${Math.round(e/3)}`:void 0,icon:d.HeaderString,hasMenu:!1,getContent:()=>{const a=o.lorem.word();return{kind:n.Text,data:a,displayData:a,allowOverlay:!0,readonly:!0}}}}function I(e,t){const a=[{title:"First name",id:"First name",group:t?"Name":void 0,icon:d.HeaderString,hasMenu:!1,getContent:()=>{const r=o.name.firstName();return{kind:n.Text,displayData:r,data:r,allowOverlay:!0,readonly:!0}}},{title:"Last name",id:"Last name",group:t?"Name":void 0,icon:d.HeaderString,hasMenu:!1,getContent:()=>{const r=o.name.lastName();return{kind:n.Text,displayData:r,data:r,allowOverlay:!0,readonly:!0}}},{title:"Avatar",id:"Avatar",group:t?"Info":void 0,icon:d.HeaderImage,hasMenu:!1,getContent:()=>{const r=Math.round(Math.random()*100);return{kind:n.Image,data:[`https://picsum.photos/id/${r}/900/900`],displayData:[`https://picsum.photos/id/${r}/40/40`],allowOverlay:!0,readonly:!0}}},{title:"Email",id:"Email",group:t?"Info":void 0,icon:d.HeaderString,hasMenu:!1,getContent:()=>{const r=o.internet.email();return{kind:n.Text,displayData:r,data:r,allowOverlay:!0,readonly:!0}}},{title:"Title",id:"Title",group:t?"Info":void 0,icon:d.HeaderString,hasMenu:!1,getContent:()=>{const r=o.name.jobTitle();return{kind:n.Text,displayData:r,data:r,allowOverlay:!0,readonly:!0}}},{title:"More Info",id:"More Info",group:t?"Info":void 0,icon:d.HeaderUri,hasMenu:!1,getContent:()=>{const r=o.internet.url();return{kind:n.Uri,displayData:r,data:r,hoverEffect:!0,allowOverlay:!0,readonly:!0,onClickUri:w=>{window.open(r,"_blank"),w.preventDefault()}}}}];if(e<a.length)return a.slice(0,e);const s=e-a.length,u=[...new Array(s)].map((r,w)=>U(w+a.length,t));return[...a,...u]}class N{constructor(){D(this,"cachedContent",new Map)}get(t,a){const s=this.cachedContent.get(t);if(s!==void 0)return s[a]}set(t,a,s){let u=this.cachedContent.get(t);u===void 0&&this.cachedContent.set(t,u=[]),u[a]=s}}function Q(e,t=!0,a=!1){const s=l.useRef(new N),[u,r]=l.useState(()=>I(e,a));l.useEffect(()=>{r(I(e,a))},[a,e]);const w=l.useCallback((c,f)=>{r(i=>{const h=i.findIndex(M=>M.title===c.title),g=[...i];return g.splice(h,1,{...i[h],width:f}),g})},[]),C=l.useMemo(()=>u.map(H),[u]),b=l.useRef(u);b.current=u;const p=l.useCallback(([c,f])=>{let i=s.current.get(c,f);return i===void 0&&(i=b.current[c].getContent(),!t&&E(i)&&(i={...i,readonly:t}),s.current.set(c,f,i)),i},[t]),y=l.useCallback(([c,f],i)=>{s.current.set(c,f,i)},[]),m=l.useCallback(([c,f],i)=>{let h=s.current.get(c,f);if(h===void 0&&(h=u[c].getContent()),v(i)&&v(h)){const g=O(i,h);s.current.set(c,f,{...g,displayData:typeof g.data=="string"?g.data:g.displayData,lastUpdated:performance.now()})}},[u]);return{cols:C,getCellContent:p,onColumnResize:w,setCellValue:m,setCellValueRaw:y}}const ee=x.kbd`
    background-color: #f4f4f4;
    color: #2b2b2b;
    padding: 2px 6px;
    font-family: monospace;
    font-size: 14px;
    border-radius: 4px;
    box-shadow: 0px 1px 2px #00000040;
    margin: 0 0.1em;
`,te={smoothScrollX:!0,smoothScrollY:!0,getCellsForSelection:!0,width:"100%"};function ae(e){switch(e.kind){case n.Boolean:return{...e,data:!1};case n.Image:return{...e,data:[],displayData:[]};case n.Drilldown:case n.Bubble:return{...e,data:[]};case n.Uri:case n.Markdown:return{...e,data:""};case n.Text:return{...e,data:"",displayData:""};case n.Number:return{...e,data:0,displayData:""}}return e}function G(){return[{title:"Row ID",width:120,icon:d.HeaderRowID,hasMenu:!1,getContent:()=>({kind:n.RowID,data:o.datatype.uuid(),allowOverlay:!0})},{title:"Protected",width:120,icon:d.HeaderCode,hasMenu:!1,getContent:()=>({kind:n.Protected,data:o.finance.bitcoinAddress(),allowOverlay:!1})},{title:"Loading",width:120,icon:d.HeaderString,hasMenu:!1,getContent:()=>({kind:n.Loading,allowOverlay:!1,skeletonWidth:70,skeletonWidthVariability:25})},{title:"Text",width:120,icon:d.HeaderCode,hasMenu:!1,getContent:()=>{const e=o.name.firstName();return{kind:n.Text,data:e,displayData:e,allowOverlay:!0,hoverEffect:!0,themeOverride:{cellVerticalPadding:8,cellHorizontalPadding:8},hoverEffectTheme:{bgColor:"#f4f4f4",fullSize:!0}}}},{title:"Number",width:120,icon:d.HeaderNumber,hasMenu:!1,getContent:()=>{const e=o.datatype.number(100);return{kind:n.Number,data:e,displayData:`${e}`,allowOverlay:!0,hoverEffect:!0,themeOverride:{cellVerticalPadding:8,cellHorizontalPadding:8},hoverEffectTheme:{bgColor:"#f4f4f4",fullSize:!0}}}},{title:"Boolean",width:120,icon:d.HeaderBoolean,hasMenu:!1,getContent:()=>{const e=Math.random(),t=e<.1?void 0:e<.2?null:e<.6;return{kind:n.Boolean,data:t,allowOverlay:!1,readonly:!1}}},{title:"Image",width:120,icon:d.HeaderImage,hasMenu:!1,getContent:()=>({kind:n.Image,data:[`${o.image.animals(40,40)}?random=${o.datatype.number(1e5)}`],allowOverlay:!0,readonly:!0})},{title:"Uri",width:120,icon:d.HeaderUri,hasMenu:!1,getContent:()=>{const e=o.internet.url();return{kind:n.Uri,data:e,allowOverlay:!0,hoverEffect:!0,onClickUri:()=>{window.open(e,"_blank")}}}},{title:"Markdown",width:120,icon:d.HeaderMarkdown,hasMenu:!1,getContent:()=>{const e=`# Title
Hello my name is *${o.name.firstName()}*

## TODO:
Try out [Glide](https://www.glideapps.com/)
`;return{kind:n.Markdown,data:e,allowOverlay:!0}}},{title:"Bubble",width:120,icon:d.HeaderArray,hasMenu:!1,getContent:()=>({kind:n.Bubble,data:[o.lorem.word(),o.lorem.word(),o.lorem.word(),o.lorem.words(2),o.lorem.words(2),o.lorem.words(2)],allowOverlay:!0})},{title:"Drilldown",width:120,icon:d.HeaderArray,hasMenu:!1,getContent:()=>({kind:n.Drilldown,data:[{text:o.address.cityName(),img:`${o.image.nature(40,40)}?random=${o.datatype.number(1e5)}`},{text:o.address.cityName(),img:`${o.image.nature(40,40)}?random=${o.datatype.number(1e5)}`}],allowOverlay:!0})}]}function ne(){const e=l.useRef(new N),[t,a]=l.useState(G),s=l.useCallback((p,y)=>{a(m=>{const c=m.findIndex(i=>i.title===p.title),f=[...m];return f.splice(c,1,{...m[c],width:y}),f})},[]),u=l.useMemo(()=>t.map(H),[t]),[r,w]=l.useState(0),C=l.useCallback(([p,y])=>{B(r);let m=e.current.get(p,y);return m===void 0&&(m=t[p].getContent(),e.current.set(p,y,m)),m},[t,r]),b=l.useCallback(([p,y],m,c,f)=>{var h;let i=e.current.get(p,y);if(i===void 0&&(i=t[p].getContent()),v(m)&&v(i)){const g=O(m,i);e.current.set(p,y,{...g,displayData:c===!0?void 0:((h=g.data)==null?void 0:h.toString())??""}),f===!0&&w(M=>M+1)}},[t]);return{cols:u,getCellContent:C,onColumnResize:s,setCellValue:b}}export{J as B,X as C,Z as D,ee as K,q as M,Y as P,ne as a,R as b,ae as c,te as d,Q as u};
