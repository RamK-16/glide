import{R as e}from"./iframe-DwHATARk.js";import{D as u}from"./data-editor-all-CATdV2tK.js";import{B as C,D as f,P as k,u as R,d as M}from"./utils-_-BHhp7b.js";import{S as g}from"./story-utils-JY22F43l.js";import{a9 as w,ai as o,I as D}from"./image-window-loader-DIBWkkqi.js";import"./preload-helper-C1FmrZbK.js";import"./scrolling-data-grid-DKxj2AxU.js";import"./marked.esm-U8ipOrG_.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-NKb2IHJp.js";const b={title:"Glide-Data-Grid/DataEditor Demos",decorators:[n=>e.createElement(g,null,e.createElement(C,{title:"Custom renderers",description:e.createElement(f,null,"Override internal cell renderers by passing the "," ",e.createElement(k,null,"renderers")," prop.")},e.createElement(n,null)))]},t=()=>{const{cols:n,getCellContent:m}=R(100,!0,!0),p=e.useMemo(()=>[...w,{...o,draw:(l,a)=>{const{ctx:s,rect:r}=l;s.fillStyle="#ffe0e0",s.fillRect(r.x,r.y,r.width,r.height),a.kind===D.Marker&&o.draw(l,a)}}],[]);return e.createElement(u,{...M,getCellContent:m,columns:n,rows:200,rowMarkers:"both",renderers:p})};var d,i,c;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`() => {
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
}`,...(c=(i=t.parameters)==null?void 0:i.docs)==null?void 0:c.source}}};const v=["OverrideMarkerRenderer"];export{t as OverrideMarkerRenderer,v as __namedExportsOrder,b as default};
