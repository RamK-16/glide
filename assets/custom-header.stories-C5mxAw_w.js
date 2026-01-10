import{R as r}from"./iframe-VjYuGMsY.js";import{D as p}from"./data-editor-all-C18pEU2z.js";import{B as f,D as h,u as x,d as g}from"./utils-DA5KvXiW.js";import{S as C}from"./story-utils-Dv2OgOS1.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-B8cvJCVw.js";import"./marked.esm-CZueurBS.js";import"./scrolling-data-grid-Dlt80JY1.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-1xUx3BY8.js";const H={title:"Glide-Data-Grid/DataEditor Demos",decorators:[n=>r.createElement(C,null,r.createElement(f,{title:"Custom Drawing",description:r.createElement(h,null,"You can draw over or under most objects in the grid.")},r.createElement(n,null)))]},o=()=>{const{cols:n,getCellContent:m}=x(1e3,!0,!0),u=r.useCallback((c,l)=>{const{ctx:t,rect:e}=c;t.beginPath(),t.rect(e.x,e.y,e.width,e.height);const a=t.createLinearGradient(0,e.y,0,e.y+e.height);a.addColorStop(0,"#ff00d934"),a.addColorStop(1,"#00a2ff34"),t.fillStyle=a,t.fill(),l()},[]),w=r.useCallback((c,l)=>{l();const{ctx:t,rect:e}=c,a=7;t.beginPath(),t.moveTo(e.x+e.width-a,e.y+1),t.lineTo(e.x+e.width,e.y+a+1),t.lineTo(e.x+e.width,e.y+1),t.closePath(),t.save(),t.fillStyle="#ff0000",t.fill(),t.restore()},[]);return r.createElement(p,{...g,getCellContent:m,columns:n,drawHeader:u,drawCell:w,rows:3e3,rowMarkers:"both"})};var s,i,d;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(1000, true, true);
  const drawHeader: DrawHeaderCallback = React.useCallback((args, draw) => {
    const {
      ctx,
      rect
    } = args;
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    const lg = ctx.createLinearGradient(0, rect.y, 0, rect.y + rect.height);
    lg.addColorStop(0, "#ff00d934");
    lg.addColorStop(1, "#00a2ff34");
    ctx.fillStyle = lg;
    ctx.fill();
    draw(); // draw at end to draw under the header
  }, []);
  const drawCell: DrawCellCallback = React.useCallback((args, draw) => {
    draw(); // draw up front to draw over the cell
    const {
      ctx,
      rect
    } = args;
    const size = 7;
    ctx.beginPath();
    ctx.moveTo(rect.x + rect.width - size, rect.y + 1);
    ctx.lineTo(rect.x + rect.width, rect.y + size + 1);
    ctx.lineTo(rect.x + rect.width, rect.y + 1);
    ctx.closePath();
    ctx.save();
    ctx.fillStyle = "#ff0000";
    ctx.fill();
    ctx.restore();
  }, []);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={cols} drawHeader={drawHeader} drawCell={drawCell} rows={3000} rowMarkers="both" />;
}`,...(d=(i=o.parameters)==null?void 0:i.docs)==null?void 0:d.source}}};const z=["CustomDrawing"];export{o as CustomDrawing,z as __namedExportsOrder,H as default};
