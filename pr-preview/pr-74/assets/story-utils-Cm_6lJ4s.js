import{r as e}from"./iframe-CUpeVJMc.js";import{s as r}from"./marked.esm-tFo0_PyB.js";const o=r.div`
    display: flex;
    height: 100vh;
    width: 100vw;
    position: relative;

    & > .content {
        display: block;

        width: ${t=>t.width}px;
        height: ${t=>t.height}px;
        align-self: center;

        position: relative;

        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

        user-select: none;

        box-sizing: border-box;

        *,
        *::before,
        *::after {
            box-sizing: inherit;
        }
    }
`,l=r.div`
    box-sizing: border-box;

    *,
    *::before,
    *::after {
        box-sizing: inherit;
    }
`;class c extends e.PureComponent{render(){const{context:a,children:i,...n}=this.props;return e.createElement(e.Fragment,null,e.createElement(o,{...n},e.createElement("div",{className:"content"},i)),e.createElement("div",{id:"portal"}))}}const d=t=>e.createElement(l,null,e.createElement("div",{className:"content"},t.children));export{c as B,d as S};
