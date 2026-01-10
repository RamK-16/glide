import{g as A,R as r}from"./iframe-VjYuGMsY.js";import{aj as S,ak as $,f as D,G as y,C as B}from"./image-window-loader-B8cvJCVw.js";import{S as W}from"./story-utils-Dv2OgOS1.js";import{D as F}from"./data-editor-all-C18pEU2z.js";import{B as O}from"./utils-DA5KvXiW.js";import{a as V}from"./doc-wrapper-DAtOyRfK.js";import"./preload-helper-C1FmrZbK.js";import"./marked.esm-CZueurBS.js";import"./scrolling-data-grid-Dlt80JY1.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-1xUx3BY8.js";import"./toConsumableArray-Cg7-Q_9P.js";function K(e,t,o){var c=-1,a=e.length;t<0&&(t=-t>a?0:a+t),o=o>a?a:o,o<0&&(o+=a),a=t>o?0:o-t>>>0,t>>>=0;for(var s=Array(a);++c<a;)s[c]=e[c+t];return s}var j=K,L=S;function q(e){var t=L(e),o=t%1;return t===t?o?t-o:t:0}var H=q,J=j,N=$,Q=H,U=Math.ceil,X=Math.max;function Y(e,t,o){(o?N(e,t,o):t===void 0)?t=1:t=X(Q(t),0);var c=e==null?0:e.length;if(!c||t<1)return[];for(var a=0,s=0,m=Array(U(c/t));a<c;)m[s++]=J(e,a,a+=t);return m}var Z=Y;const z=A(Z),fe={title:"Glide-Data-Grid/DataEditor Demos",decorators:[e=>r.createElement(W,null,r.createElement(e,null))]};function ee(e,t,o,c,a,s){e=Math.max(e,1);const m=r.useRef(B.empty()),h=r.useRef([]),[f,I]=r.useState({x:0,y:0,width:0,height:0}),C=r.useRef(f);C.current=f;const P=r.useCallback(n=>{I(l=>n.x===l.x&&n.y===l.y&&n.width===l.width&&n.height===l.height?l:n)},[]),x=r.useCallback(n=>{const[l,d]=n,i=h.current[d];return i!==void 0?c(i,l):{kind:y.Loading,allowOverlay:!1}},[c]),k=r.useCallback(async n=>{var p;m.current=m.current.add(n);const l=n*e,d=await o([l,(n+1)*e]),i=C.current,u=[],w=h.current;for(const[b,_]of d.entries()){w[b+l]=_;for(let v=i.x;v<=i.x+i.width;v++)u.push({cell:[v,b+l]})}(p=s.current)==null||p.updateCells(u)},[o,s,e]),G=r.useCallback(n=>async()=>{const l=Math.max(0,Math.floor(n.y/e)),d=Math.floor((n.y+n.height)/e);for(const u of z(D(l,d+1).filter(w=>!m.current.hasIndex(w)),t))await Promise.allSettled(u.map(k));const i=[];for(let u=n.y;u<n.y+n.height;u++){const w=[];for(let p=n.x;p<n.x+n.width;p++)w.push(x([p,u]));i.push(w)}return i},[x,k,t,e]);r.useEffect(()=>{const n=f,l=Math.max(0,Math.floor((n.y-e/2)/e)),d=Math.floor((n.y+n.height+e/2)/e);for(const i of D(l,d+1))m.current.hasIndex(i)||k(i)},[k,e,f]);const T=r.useCallback((n,l)=>{const[,d]=n,i=h.current[d];if(i===void 0)return;const u=a(n,l,i);u!==void 0&&(h.current[d]=u)},[a]);return{getCellContent:x,onVisibleRegionChanged:P,onCellEdited:T,getCellsForSelection:G}}const g=()=>{const e=r.useRef(null),t=r.useCallback(async a=>(await new Promise(s=>setTimeout(s,300)),D(a[0],a[1]).map(s=>[`1, ${s}`,`2, ${s}`])),[]),o=r.useMemo(()=>[{title:"A",width:150},{title:"B",width:200}],[]),c=ee(50,5,t,r.useCallback((a,s)=>({kind:y.Text,data:a[s],allowOverlay:!0,displayData:a[s]}),[]),r.useCallback((a,s,m)=>{const[h]=a;if(s.kind!==y.Text)return;const f=[...m];return f[h]=s.data,f},[]),e);return r.createElement(O,{title:"Server Side Data",description:r.createElement(V,null,"Glide data grid is fully ready to handle your server side data needs. This example condenses the implementation into a single custom hook and loads in pages of 50. We are using 300ms sleeps, but network transactions should work the same.")},r.createElement(F,{ref:e,...c,width:"100%",columns:o,rows:3e3,rowMarkers:"both"}))};g.parameters={options:{showPanel:!1}};var R,M,E;g.parameters={...g.parameters,docs:{...(R=g.parameters)==null?void 0:R.docs,source:{originalSource:`() => {
  const ref = React.useRef<DataEditorRef | null>(null);
  const getRowData = React.useCallback(async (r: Item) => {
    await new Promise(res => setTimeout(res, 300));
    return range(r[0], r[1]).map(rowIndex => [\`1, \${rowIndex}\`, \`2, \${rowIndex}\`]);
  }, []);
  const columns = React.useMemo<readonly GridColumn[]>(() => {
    return [{
      title: "A",
      width: 150
    }, {
      title: "B",
      width: 200
    }];
  }, []);
  const args = useAsyncData<string[]>(50, 5, getRowData, React.useCallback((rowData, col) => ({
    kind: GridCellKind.Text,
    data: rowData[col],
    allowOverlay: true,
    displayData: rowData[col]
  }), []), React.useCallback((cell, newVal, rowData) => {
    const [col] = cell;
    if (newVal.kind !== GridCellKind.Text) return undefined;
    const newRow: string[] = [...rowData];
    newRow[col] = newVal.data;
    return newRow;
  }, []), ref);
  return <BeautifulWrapper title="Server Side Data" description={<Description>
                    Glide data grid is fully ready to handle your server side data needs. This example condenses the
                    implementation into a single custom hook and loads in pages of 50. We are using 300ms sleeps, but
                    network transactions should work the same.
                </Description>}>
            <DataEditor ref={ref} {...args} width="100%" columns={columns} rows={3000} rowMarkers="both" />
        </BeautifulWrapper>;
}`,...(E=(M=g.parameters)==null?void 0:M.docs)==null?void 0:E.source}}};const he=["ServerSideData"];export{g as ServerSideData,he as __namedExportsOrder,fe as default};
