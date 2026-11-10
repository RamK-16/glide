import{R as e}from"./iframe-DsBih3xr.js";import{D as c}from"./data-editor-all-B_6wezJ9.js";import{u as m,B as p,D as u,P as d,M as k,K as o,d as E}from"./utils-fCbbFLEe.js";import{S as w}from"./story-utils-DQ1A7BQe.js";import"./preload-helper-C1FmrZbK.js";import"./image-window-loader-Csb0-e00.js";import"./throttle-D7uY6qCm.js";import"./marked.esm-DL5NWXI8.js";import"./flatten-ZJGyIpt7.js";import"./scrolling-data-grid-BHLSrTxb.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-f5jlc8ea.js";const P={title:"Glide-Data-Grid/DataEditor Demos",decorators:[t=>e.createElement(w,null,e.createElement(t,null))]},r=()=>{const{cols:t,getCellContent:l}=m(6),i=e.createElement(c,{...E,rowMarkers:"checkbox-visible",getCellContent:l,columns:t,rows:1e3});return e.createElement(p,{title:"Automatic Row Markers",description:e.createElement(e.Fragment,null,e.createElement(u,null,"You can enable row markers with rich selection behavior using the"," ",e.createElement(d,null,"rowMarkers")," prop."),e.createElement(k,null,"Use ",e.createElement(o,null,"⇧")," + click to make range selections, and ",e.createElement(o,null,"Ctrl")," (",e.createElement(o,null,"⌘")," on Mac) + click to add/remove individual rows."))},i)};var a,n,s;r.parameters={...r.parameters,docs:{...(a=r.parameters)==null?void 0:a.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(6);
  const dataEditor = <DataEditor {...defaultProps} rowMarkers={"checkbox-visible"} getCellContent={getCellContent} columns={cols} rows={1000} />;
  return <BeautifulWrapper title="Automatic Row Markers" description={<>
                    <Description>
                        You can enable row markers with rich selection behavior using the{" "}
                        <PropName>rowMarkers</PropName> prop.
                    </Description>
                    <MoreInfo>
                        Use <KeyName>⇧</KeyName> + click to make range selections, and <KeyName>Ctrl</KeyName> (
                        <KeyName>⌘</KeyName> on Mac) + click to add/remove individual rows.
                    </MoreInfo>
                </>}>
            {dataEditor}
        </BeautifulWrapper>;
}`,...(s=(n=r.parameters)==null?void 0:n.docs)==null?void 0:s.source}}};const A=["AutomaticRowMarkers"];export{r as AutomaticRowMarkers,A as __namedExportsOrder,P as default};
