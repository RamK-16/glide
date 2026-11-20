import{r}from"./iframe-CUpeVJMc.js";import{r as U}from"./index-BtRdlosd.js";import{C as Z}from"./data-editor-all-BCjZtlbU.js";import{L as $,z as ee,M as te,T as re,S as ie}from"./image-window-loader-Ccev80tu.js";import{s as oe}from"./marked.esm-tFo0_PyB.js";import"./preload-helper-C1FmrZbK.js";import"./throttle-CEx6xBPo.js";import"./flatten-C2E6Wn2M.js";import"./scrolling-data-grid-DV97Ax7d.js";const ne=oe.div`
    position: absolute;

    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-sizing: border-box;

    --overlay-top: ${t=>t.targetY}px;

    left: ${t=>t.targetX}px;
    top: ${t=>t.targetY}px;
    min-width: ${t=>t.targetWidth}px;
    min-height: ${t=>t.targetHeight}px;
    width: max-content;
    max-width: 400px;
    max-height: calc(100vh - ${t=>t.targetY+10}px);

    font-family: var(--gdg-font-family);
    font-size: var(--gdg-editor-font-size);

    @keyframes glide_fade_in {
        from {
            opacity: 0%;
        }

        to {
            opacity: 100%;
        }
    }

    &.gdg-style {
        border-radius: 2px;
        background-color: var(--gdg-bg-cell);

        box-shadow:
            0 0 0 1px var(--gdg-accent-color),
            0px 0px 1px rgba(62, 65, 86, 0.4),
            0px 6px 12px rgba(62, 65, 86, 0.15);

        animation: glide_fade_in 60ms 1;
    }

    &.gdg-pad {
        padding: ${t=>Math.max(0,(t.targetHeight-28)/2)}px 8.5px 3px;
    }

    .gdg-clip-region {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        overflow-x: hidden;
        border-radius: 2px;
        flex-grow: 1;

        .gdg-growing-entry {
            height: 100%;
        }

        & input.gdg-input {
            width: 100%;
            border: none;
            border-width: 0;
            outline: none;
        }

        & textarea.gdg-input {
            border: none;
            border-width: 0;
            outline: none;
        }
    }

    text-align: start;
`;function ae(){const[t,n]=r.useState();return[t??void 0,n]}function se(){const[t,n]=ae(),[o,y]=r.useState(0),[p,S]=r.useState(!0);r.useLayoutEffect(()=>{if(t===void 0||!("IntersectionObserver"in window))return;const a=new IntersectionObserver(s=>{s.length!==0&&S(s[0].isIntersecting)},{threshold:1});return a.observe(t),()=>a.disconnect()},[t]),r.useEffect(()=>{if(p||t===void 0)return;let a;const s=()=>{const{right:k}=t.getBoundingClientRect();y(m=>Math.min(m+window.innerWidth-k-10,0)),a=requestAnimationFrame(s)};return a=requestAnimationFrame(s),()=>{a!==void 0&&cancelAnimationFrame(a)}},[t,p]);const O=r.useMemo(()=>({transform:`translateX(${o}px)`}),[o]);return{ref:n,style:O}}const ye=t=>{const{target:n,content:o,onFinishEditing:y,forceEditMode:p,initialValue:S,imageEditorOverride:O,markdownDivCreateNode:a,highlight:s,className:k,theme:m,id:G,cell:h,bloom:u,portalElementRef:v,validateCell:l,getCellRenderer:M,provideEditor:x,isOutsideClick:L,customEventTarget:N,activation:R}=t,[d,V]=r.useState(p?o:void 0),I=r.useRef(d??o);I.current=d??o;const[b,D]=r.useState(()=>l===void 0?!0:!($(o)&&(l==null?void 0:l(h,o,I.current))===!1)),g=r.useCallback((e,i)=>{y(b?e:void 0,i)},[b,y]),j=r.useCallback(e=>{if(l!==void 0&&e!==void 0&&$(e)){const i=l(h,e,I.current);i===!1?D(!1):(typeof i=="object"&&(e=i),D(!0))}V(e)},[h,l]),E=r.useRef(!1),f=r.useRef(void 0),A=r.useCallback(()=>{g(d,[0,0]),E.current=!0},[d,g]),K=r.useCallback((e,i)=>{g(e,i??f.current??[0,0]),E.current=!0},[g]),q=r.useCallback(async e=>{let i=!1;e.key==="Escape"?(e.stopPropagation(),e.preventDefault(),f.current=[0,0]):e.key==="Enter"&&!e.shiftKey?(e.stopPropagation(),e.preventDefault(),f.current=[0,1],i=!0):e.key==="Tab"&&(e.stopPropagation(),e.preventDefault(),f.current=[e.shiftKey?-1:1,0],i=!0),window.setTimeout(()=>{!E.current&&f.current!==void 0&&(g(i?d:void 0,f.current),E.current=!0)},0)},[g,d]),F=d??o,[c,B]=r.useMemo(()=>{var w,z;if(ee(o))return[];const e={...o,location:h,activation:R},i=x==null?void 0:x(e);return i!==void 0?[i,!1]:[(z=(w=M(o))==null?void 0:w.provideEditor)==null?void 0:z.call(w,e),!1]},[h,o,M,x,R]),{ref:J,style:Q}=se();let T=!0,H,W=!0,C;if(c!==void 0){T=c.disablePadding!==!0,W=c.disableStyling!==!0;const e=te(c);e&&(C=c.styleOverride);const i=e?c.editor:c;H=r.createElement(i,{portalElementRef:v,isHighlighted:s,activation:R,onChange:j,value:F,initialValue:S,onFinishedEditing:K,validatedSelection:$(F)?F.selectionRange:void 0,forceEditMode:p,target:n,imageEditorOverride:O,markdownDivCreateNode:a,isValid:b,theme:m})}C={...C,...Q};const X=(v==null?void 0:v.current)??document.getElementById("portal");if(X===null)return console.error('Cannot open Data Grid overlay editor, because portal not found. Please, either provide a portalElementRef or add `<div id="portal" />` as the last child of your `<body>`.'),null;let P=W?"gdg-style":"gdg-unstyle";b||(P+=" gdg-invalid"),T&&(P+=" gdg-pad");const Y=(u==null?void 0:u[0])??1,_=(u==null?void 0:u[1])??1;return U.createPortal(r.createElement(re.Provider,{value:m},r.createElement(Z,{style:ie(m),className:k,onClickOutside:A,isOutsideClick:L,customEventTarget:N},r.createElement(ne,{ref:J,id:G,className:P,style:C,as:B===!0?"label":void 0,targetX:n.x-Y,targetY:n.y-_,targetWidth:n.width+Y*2,targetHeight:n.height+_*2},r.createElement("div",{className:"gdg-clip-region",onKeyDown:q},H)))),X)};export{ye as default};
