import{r as l}from"./iframe-CUpeVJMc.js";import{s as p}from"./marked.esm-tFo0_PyB.js";import{N as v}from"./react-number-format.es-DvKrG2lM.js";import"./preload-helper-C1FmrZbK.js";const S=p.div`
    display: flex;
    margin: 6px 0 3px;
    color: var(--gdg-text-dark);

    > input {
        font-size: var(--gdg-editor-font-size);
        padding: 0;
        font-family: var(--gdg-font-family);
        color: var(--gdg-text-dark);
        background-color: var(--gdg-bg-cell);
    }
`;function d(){var a,r,o;return((o=(r=(a=Intl.NumberFormat())==null?void 0:a.formatToParts(1.1))==null?void 0:r.find(e=>e.type==="decimal"))==null?void 0:o.value)??"."}function h(){return d()==="."?",":"."}const E=i=>{const{value:n,onChange:a,disabled:r,highlight:o,validatedSelection:e,fixedDecimals:s,allowNegative:g,thousandSeparator:m,decimalSeparator:f}=i,u=l.useRef(null);return l.useLayoutEffect(()=>{var t;if(e!==void 0){const c=typeof e=="number"?[e,null]:e;(t=u.current)==null||t.setSelectionRange(c[0],c[1])}},[e]),l.createElement(S,null,l.createElement(v,{autoFocus:!0,getInputRef:u,className:"gdg-input",onFocus:t=>t.target.setSelectionRange(o?0:t.target.value.length,t.target.value.length),disabled:r===!0,decimalScale:s,allowNegative:g,thousandSeparator:m??h(),decimalSeparator:f??d(),value:Object.is(n,-0)?"-":n??"",onValueChange:a}))};export{E as default};
