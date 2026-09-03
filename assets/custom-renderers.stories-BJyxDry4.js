import{R as e}from"./iframe-Com6RwAs.js";import{D as u}from"./data-editor-all-7Ibwc-4X.js";import{B as C,D as f,P as R,u as k,d as M}from"./utils-CDp34RPn.js";import{S as g}from"./story-utils-DPI6WxHm.js";import{R as w,_ as s,I as D}from"./image-window-loader-GrzluXqd.js";import"./preload-helper-C1FmrZbK.js";import"./throttle-C38lo_o_.js";import"./flatten-CdjeKbf8.js";import"./scrolling-data-grid-BHYsn5mU.js";import"./marked.esm-NL_vqmE-.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-CtRKOs3N.js";const v={title:"Glide-Data-Grid/DataEditor Demos",decorators:[n=>e.createElement(g,null,e.createElement(C,{title:"Custom renderers",description:e.createElement(f,null,"Override internal cell renderers by passing the "," ",e.createElement(R,null,"renderers")," prop.")},e.createElement(n,null)))]},t=()=>{const{cols:n,getCellContent:m}=k(100,!0,!0),p=e.useMemo(()=>[...w,{...s,draw:(l,a)=>{const{ctx:o,rect:r}=l;o.fillStyle="#ffe0e0",o.fillRect(r.x,r.y,r.width,r.height),a.kind===D.Marker&&s.draw(l,a)}}],[]);return e.createElement(u,{...M,getCellContent:m,columns:n,rows:200,rowMarkers:"both",renderers:p})};var d,i,c;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`() => {
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
}`,...(c=(i=t.parameters)==null?void 0:i.docs)==null?void 0:c.source}}};const B=["OverrideMarkerRenderer"];export{t as OverrideMarkerRenderer,B as __namedExportsOrder,v as default};
