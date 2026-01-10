import{R as e}from"./iframe-VjYuGMsY.js";import{D as c}from"./data-editor-all-C18pEU2z.js";import{u as g,B as p,D as u,P as b,M as d,K as n,d as h}from"./utils-DA5KvXiW.js";import{S as R}from"./story-utils-Dv2OgOS1.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-B8cvJCVw.js";import"./marked.esm-CZueurBS.js";import"./scrolling-data-grid-Dlt80JY1.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-1xUx3BY8.js";const x={title:"Glide-Data-Grid/DataEditor Demos",decorators:[o=>e.createElement(R,null,e.createElement(o,null))]},t=()=>{const{cols:o,getCellContent:l}=g(100),[i,m]=e.useState({x:0,y:0,width:0,height:0});return e.createElement(p,{title:"Observe Visible Region",description:e.createElement(e.Fragment,null,e.createElement(u,null,"The visible region can be observed using ",e.createElement(b,null,"onVisibleRegionChanged")),e.createElement(d,null,"Then current visible region is x:",e.createElement(n,null,i.x)," y:",e.createElement(n,null,i.y)," width:",e.createElement(n,null,i.width)," height:",e.createElement(n,null,i.height)))},e.createElement(c,{...h,getCellContent:l,columns:o,rows:1e3,onVisibleRegionChanged:m}))};var r,s,a;t.parameters={...t.parameters,docs:{...(r=t.parameters)==null?void 0:r.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(100);
  const [visibleRegion, setVisibleRegion] = React.useState<Rectangle>({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });
  return <BeautifulWrapper title="Observe Visible Region" description={<>
                    <Description>
                        The visible region can be observed using <PropName>onVisibleRegionChanged</PropName>
                    </Description>
                    <MoreInfo>
                        Then current visible region is x:<KeyName>{visibleRegion.x}</KeyName> y:
                        <KeyName>{visibleRegion.y}</KeyName> width:
                        <KeyName>{visibleRegion.width}</KeyName> height:<KeyName>{visibleRegion.height}</KeyName>
                    </MoreInfo>
                </>}>
            <DataEditor {...defaultProps} getCellContent={getCellContent} columns={cols} rows={1000} onVisibleRegionChanged={setVisibleRegion} />
        </BeautifulWrapper>;
}`,...(a=(s=t.parameters)==null?void 0:s.docs)==null?void 0:a.source}}};const M=["ObserveVisibleRegion"];export{t as ObserveVisibleRegion,M as __namedExportsOrder,x as default};
