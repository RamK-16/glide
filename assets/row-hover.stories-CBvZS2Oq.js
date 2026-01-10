import{R as e}from"./iframe-VjYuGMsY.js";import{D as f}from"./data-editor-all-C18pEU2z.js";import{B as p,D as w,P as v,a as R,d as g}from"./utils-DA5KvXiW.js";import{S as C}from"./story-utils-Dv2OgOS1.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-B8cvJCVw.js";import"./marked.esm-CZueurBS.js";import"./scrolling-data-grid-Dlt80JY1.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-1xUx3BY8.js";const _={title:"Glide-Data-Grid/DataEditor Demos",decorators:[t=>e.createElement(C,null,e.createElement(p,{title:"Row Hover Effect",description:e.createElement(w,null,"Through careful usage of the ",e.createElement(v,null,"onItemHovered")," callback it is possible to easily create a row hover effect.")},e.createElement(t,null)))]},r=()=>{const{cols:t,getCellContent:c}=R(),[n,i]=e.useState(void 0),d=e.useCallback(o=>{const[h,u]=o.location;i(o.kind!=="cell"?void 0:u)},[]),m=e.useCallback(o=>{if(o===n)return{bgCell:"#f7f7f7",bgCellMedium:"#f0f0f0"}},[n]);return e.createElement(f,{...g,rowMarkers:"both",onItemHovered:d,getCellContent:c,getRowThemeOverride:m,columns:t,rows:300})};var a,l,s;r.parameters={...r.parameters,docs:{...(a=r.parameters)==null?void 0:a.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent
  } = useAllMockedKinds();
  const [hoverRow, setHoverRow] = React.useState<number | undefined>(undefined);
  const onItemHovered = React.useCallback((args: GridMouseEventArgs) => {
    const [_, row] = args.location;
    setHoverRow(args.kind !== "cell" ? undefined : row);
  }, []);
  const getRowThemeOverride = React.useCallback<GetRowThemeCallback>(row => {
    if (row !== hoverRow) return undefined;
    return {
      bgCell: "#f7f7f7",
      bgCellMedium: "#f0f0f0"
    };
  }, [hoverRow]);
  return <DataEditor {...defaultProps} rowMarkers="both" onItemHovered={onItemHovered} getCellContent={getCellContent} getRowThemeOverride={getRowThemeOverride} columns={cols} rows={300} />;
}`,...(s=(l=r.parameters)==null?void 0:l.docs)==null?void 0:s.source}}};const A=["RowHover"];export{r as RowHover,A as __namedExportsOrder,_ as default};
