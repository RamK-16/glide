import{s as v}from"./marked.esm-tFo0_PyB.js";import{R as n}from"./iframe-CUpeVJMc.js";import{u as M}from"./react-laag.esm-BydvOLdK.js";import{D as k}from"./data-editor-all-BCjZtlbU.js";import{B as x,D as y,P as E,a as w,d as H}from"./utils-mEQVggKF.js";import{S as O}from"./story-utils-Cm_6lJ4s.js";import"./preload-helper-C1FmrZbK.js";import"./index-BtRdlosd.js";import"./image-window-loader-Ccev80tu.js";import"./throttle-CEx6xBPo.js";import"./flatten-C2E6Wn2M.js";import"./scrolling-data-grid-DV97Ax7d.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-DxNlDJ5G.js";const W={title:"Glide-Data-Grid/DataEditor Demos",decorators:[l=>n.createElement(O,null,n.createElement(x,{title:"Header menus",description:n.createElement(n.Fragment,null,n.createElement(y,null,"Headers on the data grid can be configured to support menus. We provide the events and the menu icon, you provide the menu. The menu icon can be modified via the"," ",n.createElement(E,null,"menuIcon")," prop."))},n.createElement(l,null)))]},R=v.div`
    width: 175px;
    padding: 8px 0;
    border-radius: 6px;
    box-shadow:
        0px 0px 1px rgba(62, 65, 86, 0.7),
        0px 6px 12px rgba(62, 65, 86, 0.35);

    display: flex;
    flex-direction: column;

    background-color: white;
    font-size: 13px;
    font-weight: 600;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
        "Helvetica Neue", sans-serif;

    .danger {
        color: rgba(255, 40, 40, 0.8);
        :hover {
            color: rgba(255, 40, 40, 1);
        }
    }

    > div {
        padding: 6px 8px;
        color: rgba(0, 0, 0, 0.7);
        :hover {
            background-color: rgba(0, 0, 0, 0.05);
            color: rgba(0, 0, 0, 0.9);
        }
        transition: background-color 100ms;
        cursor: pointer;
    }
`,s=()=>{const{cols:l,getCellContent:c,onColumnResize:m,setCellValue:p}=w(),g=n.useMemo(()=>l.map((t,r)=>r===2?{...t,hasMenu:!0,menuIcon:"dots",overlayIcon:"rowOwnerOverlay"}:r===3?{...t,hasMenu:!0,menuIcon:"headerUri"}:{...t,hasMenu:!0}),[l]),[e,o]=n.useState(),a=e!==void 0,{layerProps:h,renderLayer:C}=M({isOpen:a,auto:!0,placement:"bottom-end",triggerOffset:2,onOutsideClick:()=>o(void 0),trigger:{getBounds:()=>({left:(e==null?void 0:e.bounds.x)??0,top:(e==null?void 0:e.bounds.y)??0,width:(e==null?void 0:e.bounds.width)??0,height:(e==null?void 0:e.bounds.height)??0,right:((e==null?void 0:e.bounds.x)??0)+((e==null?void 0:e.bounds.width)??0),bottom:((e==null?void 0:e.bounds.y)??0)+((e==null?void 0:e.bounds.height)??0)})}}),b=n.useCallback((t,r)=>{o({col:t,bounds:r})},[]),f=n.useCallback(()=>{console.log("Header clicked")},[]);return n.createElement(n.Fragment,null,n.createElement(k,{...H,getCellContent:c,onHeaderMenuClick:b,onHeaderClicked:f,columns:g,onCellContextMenu:(t,r)=>r.preventDefault(),onCellEdited:p,onColumnResize:m,rows:1e3}),a&&C(n.createElement(R,{...h},n.createElement("div",{onClick:()=>o(void 0)},"These do nothing"),n.createElement("div",{onClick:()=>o(void 0)},"Add column right"),n.createElement("div",{onClick:()=>o(void 0)},"Add column left"),n.createElement("div",{className:"danger",onClick:()=>o(void 0)},"Delete"))))};var d,i,u;s.parameters={...s.parameters,docs:{...(d=s.parameters)==null?void 0:d.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent,
    onColumnResize,
    setCellValue
  } = useAllMockedKinds();
  const realCols = React.useMemo(() => {
    return cols.map((c, index) => {
      if (index === 2) {
        return {
          ...c,
          hasMenu: true,
          menuIcon: "dots",
          overlayIcon: "rowOwnerOverlay"
        };
      } else if (index === 3) {
        return {
          ...c,
          hasMenu: true,
          menuIcon: "headerUri"
        };
      }
      return {
        ...c,
        hasMenu: true
      };
    });
  }, [cols]);
  const [menu, setMenu] = React.useState<{
    col: number;
    bounds: Rectangle;
  }>();
  const isOpen = menu !== undefined;
  const {
    layerProps,
    renderLayer
  } = useLayer({
    isOpen,
    auto: true,
    placement: "bottom-end",
    triggerOffset: 2,
    onOutsideClick: () => setMenu(undefined),
    trigger: {
      getBounds: () => ({
        left: menu?.bounds.x ?? 0,
        top: menu?.bounds.y ?? 0,
        width: menu?.bounds.width ?? 0,
        height: menu?.bounds.height ?? 0,
        right: (menu?.bounds.x ?? 0) + (menu?.bounds.width ?? 0),
        bottom: (menu?.bounds.y ?? 0) + (menu?.bounds.height ?? 0)
      })
    }
  });
  const onHeaderMenuClick = React.useCallback((col: number, bounds: Rectangle) => {
    setMenu({
      col,
      bounds
    });
  }, []);
  const onHeaderClicked = React.useCallback(() => {
    // eslint-disable-next-line no-console
    console.log("Header clicked");
  }, []);
  return <>
            <DataEditor {...defaultProps} getCellContent={getCellContent} onHeaderMenuClick={onHeaderMenuClick} onHeaderClicked={onHeaderClicked} columns={realCols} onCellContextMenu={(_, e) => e.preventDefault()} onCellEdited={setCellValue} onColumnResize={onColumnResize} rows={1000} />
            {isOpen && renderLayer(<SimpleMenu {...layerProps}>
                        <div onClick={() => setMenu(undefined)}>These do nothing</div>
                        <div onClick={() => setMenu(undefined)}>Add column right</div>
                        <div onClick={() => setMenu(undefined)}>Add column left</div>
                        <div className="danger" onClick={() => setMenu(undefined)}>
                            Delete
                        </div>
                    </SimpleMenu>)}
        </>;
}`,...(u=(i=s.parameters)==null?void 0:i.docs)==null?void 0:u.source}}};const G=["HeaderMenus"];export{s as HeaderMenus,G as __namedExportsOrder,W as default};
