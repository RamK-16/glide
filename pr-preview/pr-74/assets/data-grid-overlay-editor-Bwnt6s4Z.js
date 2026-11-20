import{r}from"./iframe-CUpeVJMc.js";import{r as U}from"./index-BtRdlosd.js";import{h as T,k as Z,l as ee,T as te,C as re,n as ie}from"./data-editor-all-DHZzerhi.js";import{s as ne}from"./marked.esm-tFo0_PyB.js";import"./preload-helper-C1FmrZbK.js";import"./throttle-CEx6xBPo.js";import"./flatten-C2E6Wn2M.js";const ae=ne.div`
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
`;function oe(){const[t,a]=r.useState();return[t??void 0,a]}function se(){const[t,a]=oe(),[n,y]=r.useState(0),[p,k]=r.useState(!0);r.useLayoutEffect(()=>{if(t===void 0||!("IntersectionObserver"in window))return;const o=new IntersectionObserver(s=>{s.length!==0&&k(s[0].isIntersecting)},{threshold:1});return o.observe(t),()=>o.disconnect()},[t]),r.useEffect(()=>{if(p||t===void 0)return;let o;const s=()=>{const{right:S}=t.getBoundingClientRect();y(m=>Math.min(m+window.innerWidth-S-10,0)),o=requestAnimationFrame(s)};return o=requestAnimationFrame(s),()=>{o!==void 0&&cancelAnimationFrame(o)}},[t,p]);const O=r.useMemo(()=>({transform:`translateX(${n}px)`}),[n]);return{ref:a,style:O}}const me=t=>{const{target:a,content:n,onFinishEditing:y,forceEditMode:p,initialValue:k,imageEditorOverride:O,markdownDivCreateNode:o,highlight:s,className:S,theme:m,id:_,cell:h,bloom:c,portalElementRef:x,validateCell:d,getCellRenderer:$,provideEditor:b,isOutsideClick:G,customEventTarget:K,activation:R}=t,[l,j]=r.useState(p?n:void 0),D=r.useRef(l??n);D.current=l??n;const[E,I]=r.useState(()=>d===void 0?!0:!(T(n)&&(d==null?void 0:d(h,n,D.current))===!1)),f=r.useCallback((e,i)=>{y(E?e:void 0,i)},[E,y]),z=r.useCallback(e=>{if(d!==void 0&&e!==void 0&&T(e)){const i=d(h,e,D.current);i===!1?I(!1):(typeof i=="object"&&(e=i),I(!0))}j(e)},[h,d]),v=r.useRef(!1),g=r.useRef(void 0),A=r.useCallback(()=>{f(l,[0,0]),v.current=!0},[l,f]),L=r.useCallback((e,i)=>{f(e,i??g.current??[0,0]),v.current=!0},[f]),q=r.useCallback(async e=>{let i=!1;e.key==="Escape"?(e.stopPropagation(),e.preventDefault(),g.current=[0,0]):e.key==="Enter"&&!e.shiftKey?(e.stopPropagation(),e.preventDefault(),g.current=[0,1],i=!0):e.key==="Tab"&&(e.stopPropagation(),e.preventDefault(),g.current=[e.shiftKey?-1:1,0],i=!0),window.setTimeout(()=>{!v.current&&g.current!==void 0&&(f(i?l:void 0,g.current),v.current=!0)},0)},[f,l]),F=l??n,[u,B]=r.useMemo(()=>{var w,Y;if(Z(n))return[];const e={...n,location:h,activation:R},i=b==null?void 0:b(e);return i!==void 0?[i,!1]:[(Y=(w=$(n))==null?void 0:w.provideEditor)==null?void 0:Y.call(w,e),!1]},[h,n,$,b,R]),{ref:J,style:Q}=se();let M=!0,N,V=!0,C;if(u!==void 0){M=u.disablePadding!==!0,V=u.disableStyling!==!0;const e=ee(u);e&&(C=u.styleOverride);const i=e?u.editor:u;N=r.createElement(i,{portalElementRef:x,isHighlighted:s,activation:R,onChange:z,value:F,initialValue:k,onFinishedEditing:L,validatedSelection:T(F)?F.selectionRange:void 0,forceEditMode:p,target:a,imageEditorOverride:O,markdownDivCreateNode:o,isValid:E,theme:m})}C={...C,...Q};const H=(x==null?void 0:x.current)??document.getElementById("portal");if(H===null)return console.error('Cannot open Data Grid overlay editor, because portal not found. Please, either provide a portalElementRef or add `<div id="portal" />` as the last child of your `<body>`.'),null;let P=V?"gdg-style":"gdg-unstyle";E||(P+=" gdg-invalid"),M&&(P+=" gdg-pad");const W=(c==null?void 0:c[0])??1,X=(c==null?void 0:c[1])??1;return U.createPortal(r.createElement(te.Provider,{value:m},r.createElement(re,{style:ie(m),className:S,onClickOutside:A,isOutsideClick:G,customEventTarget:K},r.createElement(ae,{ref:J,id:_,className:P,style:C,as:B===!0?"label":void 0,targetX:a.x-W,targetY:a.y-X,targetWidth:a.width+W*2,targetHeight:a.height+X*2},r.createElement("div",{className:"gdg-clip-region",onKeyDown:q},N)))),H)};export{me as default};
