import{R as e}from"./iframe-DJM4aKf3.js";import{D as u}from"./data-editor-all-DnFnT7BQ.js";import{B as C,D as f,P as k,u as R,d as M}from"./utils-G4Zj7k5E.js";import{S as g}from"./story-utils-ByB6Y_U-.js";import{S as w,a3 as s,I as D}from"./image-window-loader-1kq9WxV6.js";import"./preload-helper-C1FmrZbK.js";import"./throttle-C5hBOrcT.js";import"./flatten-DaskvGCQ.js";import"./scrolling-data-grid-DEZGQvN1.js";import"./marked.esm-Bk4h7lqL.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-XhvYdnUX.js";const _={title:"Glide-Data-Grid/DataEditor Demos",decorators:[n=>e.createElement(g,null,e.createElement(C,{title:"Custom renderers",description:e.createElement(f,null,"Override internal cell renderers by passing the "," ",e.createElement(k,null,"renderers")," prop.")},e.createElement(n,null)))]},t=()=>{const{cols:n,getCellContent:m}=R(100,!0,!0),p=e.useMemo(()=>[...w,{...s,draw:(l,a)=>{const{ctx:o,rect:r}=l;o.fillStyle="#ffe0e0",o.fillRect(r.x,r.y,r.width,r.height),a.kind===D.Marker&&s.draw(l,a)}}],[]);return e.createElement(u,{...M,getCellContent:m,columns:n,rows:200,rowMarkers:"both",renderers:p})};var d,i,c;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(100, true, true);
  const renderers = React.useMemo<readonly InternalCellRenderer<InnerGridCell>[]>(() => {
    return [...AllCellRenderers, {
      ...markerCellRenderer,
      draw: (args, cell) => {
        const {
          ctx,
          rect
        } = args;
        ctx.fillStyle = "#ffe0e0";
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
        if (cell.kind === InnerGridCellKind.Marker) {
          markerCellRenderer.draw(args as DrawArgs<MarkerCell>, cell as MarkerCell);
        }
      }
    } as InternalCellRenderer<InnerGridCell>];
  }, []);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={cols} rows={200} rowMarkers="both" renderers={renderers} />;
}`,...(c=(i=t.parameters)==null?void 0:i.docs)==null?void 0:c.source}}};const B=["OverrideMarkerRenderer"];export{t as OverrideMarkerRenderer,B as __namedExportsOrder,_ as default};
