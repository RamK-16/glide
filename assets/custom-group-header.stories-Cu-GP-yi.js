import{R as d,r as z}from"./iframe-B6cNpsU9.js";import{e as W,D as O}from"./data-editor-all-MhbDzrW0.js";import{B as U,D as X,P as q,u as T,d as G}from"./utils-D50ero11.js";import{a as M}from"./image-window-loader-kJGAlfKi.js";import{S as J}from"./story-utils-Bd5l1xuS.js";import"./preload-helper-C1FmrZbK.js";import"./throttle-DKgBHFMo.js";import"./flatten-BngIKhsg.js";import"./scrolling-data-grid-Ym7IQ9By.js";import"./marked.esm-Cf7BJE3d.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-YpqfKhzp.js";const y="destination-over",E="source-over",ie={title:"Glide-Data-Grid/DataEditor Demos",decorators:[m=>d.createElement(J,null,d.createElement(U,{title:"Custom Group Header Drawing",description:d.createElement(X,null,"This example demonstrates custom rendering of group headers using the"," ",d.createElement(q,null,"drawGroupHeader")," prop. The callback receives information about the group name, level, span, and other properties, allowing for complete customization of the group header appearance.")},d.createElement(m,null)))]},H=()=>{const{cols:m,getCellContent:C}=T(30,!0,!0),b=m.map((r,e)=>e<3?{...r,group:["2024","Q1","Jan","Sales"]}:e<6?{...r,group:["2024","Q1","Jan","Marketing"]}:e<9?{...r,group:["2024","Q1","Feb","Sales"]}:e<12?{...r,group:["2024","Q1","Feb","Marketing"]}:e<15?{...r,group:["2024","Q1","Mar","Sales"]}:e<18?{...r,group:["2024","Q1","Mar","Marketing"]}:e<21?{...r,group:["2024","Q2","Apr","Sales"]}:e<24?{...r,group:["2024","Q2","Apr","Support"]}:e<27?{...r,group:["2024","Q2","May","Sales"]}:{...r,group:["2024","Q2","May","Support"]}),S=d.useCallback(r=>{const{ctx:e,groupName:o,level:t,span:u,rect:a,theme:n,isSelected:i,isHovered:g}=r;console.log(r),e.save(),e.beginPath(),e.rect(a.x,a.y,a.width,a.height);const f=[{start:"#e3f2fd",end:"#bbdefb"},{start:"#f3e5f5",end:"#e1bee7"},{start:"#fff3e0",end:"#ffe0b2"},{start:"#e8f5e9",end:"#c8e6c9"}],c=f[t]??f[0],p=e.createLinearGradient(a.x,a.y,a.x,a.y+a.height),h=n.accentColor;if(p.addColorStop(0,i?h:g?c.end:c.start),p.addColorStop(1,i?h:c.end),e.globalCompositeOperation=y,e.fillStyle=p,e.globalCompositeOperation=E,o!==""){e.font=`bold ${14+t*2}px ${n.fontFamily}`,e.textAlign="left",e.textBaseline="middle",e.shadowColor="rgba(0, 0, 0, 0.2)",e.shadowBlur=2,e.shadowOffsetX=1,e.shadowOffsetY=1;const N=12+t*4;e.fillText(o,a.x+N,a.y+a.height/2),e.shadowColor="transparent",e.shadowBlur=0,e.shadowOffsetX=0,e.shadowOffsetY=0;const B=`(${u[1]-u[0]+1} cols)`;e.font=`10px ${n.fontFamily}`,e.globalAlpha=.7;const V=e.measureText(o).width;e.fillText(B,a.x+N+V+8,a.y+a.height/2),e.globalAlpha=1}e.beginPath();const x=20,k=4,D=a.x+a.width-x-k,Q=a.y+k;e.arc(D+x/2,Q+x/2,x/2,0,Math.PI*2),e.font=`bold 10px ${n.fontFamily}`,e.textAlign="center",e.textBaseline="middle",e.fillText(`L${t}`,D+x/2,Q+x/2),e.restore()},[]),[s,l]=d.useState(W);return d.createElement(O,{...G,getCellContent:C,columns:b,rows:500,getGroupDetails:r=>({name:r,icon:r===""?void 0:M.HeaderCode}),groupHeaderHeight:[36,32,30,28],drawGroupHeader:S,drawHeader:(r,e)=>{console.log(r),e()},rowMarkers:"both",gridSelection:s,onGridSelectionChange:r=>{l(r),console.log("onGridSelectionChange",r)},onGroupHeaderClicked:r=>{console.log("onGroupHeaderClicked",r)},onMouseMove:r=>{r.kind},onCellClicked:r=>{}})},w=()=>{const{cols:m,getCellContent:C}=T(24,!0,!0),b=m.map((s,l)=>l<6?{...s,group:["2024","Q1","Jan"]}:l<12?{...s,group:["2024","Q1","Feb"]}:l<18?{...s,group:["2024","Q2","Apr"]}:{...s,group:["2024","Q2","May"]}),S=d.useCallback(s=>{const{ctx:l,rect:r,theme:e,isSelected:o,isHovered:t,groupName:u}=s;l.save(),l.beginPath(),l.rect(r.x,r.y,r.width,r.height);const a=o?e.accentColor:t?e.bgHeaderHovered:e.bgHeader;l.globalCompositeOperation=y,l.fillStyle=a,l.fill(),l.globalCompositeOperation=E,(o||t)&&(l.strokeStyle=o?e.accentColor:e.borderColor,l.lineWidth=1,l.stroke()),l.restore()},[]);return d.createElement(O,{...G,getCellContent:C,columns:b,rows:1e3,getGroupDetails:s=>({name:s,icon:s===""?void 0:M.HeaderCode}),groupHeaderHeight:[28,26,24],drawGroupHeader:S,rowMarkers:"both"})},v=()=>{const{cols:m,getCellContent:C}=T(20,!0,!0),b=m.map((o,t)=>t<5?{...o,group:["Revenue","Q1"]}:t<10?{...o,group:["Expenses","Q1"]}:t<15?{...o,group:["Revenue","Q2"]}:{...o,group:["Expenses","Q2"]}),S=d.useCallback(o=>{const{ctx:t,groupName:u,level:a,rect:n,theme:i,isSelected:g,isHovered:f}=o;t.save(),t.beginPath(),t.rect(n.x,n.y,n.width,n.height);let c,p;if(u==="Revenue"?(c=g?"#4caf50":f?"#81c784":"#c8e6c9",p=g?"#ffffff":"#2e7d32"):u==="Expenses"?(c=g?"#f44336":f?"#e57373":"#ffcdd2",p=g?"#ffffff":"#c62828"):(c=g?i.accentColor:f?i.bgHeaderHovered:i.bgHeader,p=g?i.textHeaderSelected:i.textHeader),t.globalCompositeOperation=y,t.fillStyle=c,t.fill(),t.globalCompositeOperation=E,a===0){t.beginPath();const h=4;t.moveTo(n.x+h,n.y),t.lineTo(n.x+n.width-h,n.y),t.quadraticCurveTo(n.x+n.width,n.y,n.x+n.width,n.y+h),t.lineTo(n.x+n.width,n.y+n.height),t.lineTo(n.x,n.y+n.height),t.lineTo(n.x,n.y+h),t.quadraticCurveTo(n.x,n.y,n.x+h,n.y),t.closePath(),t.globalCompositeOperation=y,t.fill(),t.globalCompositeOperation=E}u!==""&&(t.fillStyle=p,t.font=`bold ${13+a}px ${i.fontFamily}`,t.textAlign="left",t.textBaseline="middle",t.fillText(u,n.x+10,n.y+n.height/2)),t.restore()},[]),s="data-editor-"+z.useId(),l=`.${s}`,r=[32,28,40],e=r.reduce((o,t)=>o+t,0);return d.createElement(O,{className:s,height:1e3,ref:()=>{var a,n,i,g,f;const o=document.querySelector(l);if(!o)return;const t=(f=(g=(i=(n=(a=o==null?void 0:o.children)==null?void 0:a[0])==null?void 0:n.children)==null?void 0:i[0])==null?void 0:g.children)==null?void 0:f[1];if(!t)return;const u=()=>{const c=t.scrollTop,p=o==null?void 0:o.children[0],h=o==null?void 0:o.children[0].children[0].children[0];if(!p||!h)return;const x=c<e?c:e;p.style=`height: calc(100% + ${e}px`,h.style.transform=`translateY(-${x}px)`};return t.addEventListener("scroll",u),()=>{var c;return(c=t==null?void 0:t.removeEventListener)==null?void 0:c.call(t,"scroll",u)}},...G,getCellContent:C,columns:b,rows:500,getGroupDetails:o=>({name:o,icon:o===""?void 0:M.HeaderCode}),headerHeight:r[r.length-1],groupHeaderHeight:r.slice(0,-1),drawGroupHeader:S,rowMarkers:"both"})};var P,I,R;H.parameters={...H.parameters,docs:{...(P=H.parameters)==null?void 0:P.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(30, true, true);

  // Create multi-level groups: Year -> Quarter -> Month -> Department
  const multiLevelCols = cols.map((col, index) => {
    if (index < 3) {
      return {
        ...col,
        group: ["2024", "Q1", "Jan", "Sales"]
      };
    } else if (index < 6) {
      return {
        ...col,
        group: ["2024", "Q1", "Jan", "Marketing"]
      };
    } else if (index < 9) {
      return {
        ...col,
        group: ["2024", "Q1", "Feb", "Sales"]
      };
    } else if (index < 12) {
      return {
        ...col,
        group: ["2024", "Q1", "Feb", "Marketing"]
      };
    } else if (index < 15) {
      return {
        ...col,
        group: ["2024", "Q1", "Mar", "Sales"]
      };
    } else if (index < 18) {
      return {
        ...col,
        group: ["2024", "Q1", "Mar", "Marketing"]
      };
    } else if (index < 21) {
      return {
        ...col,
        group: ["2024", "Q2", "Apr", "Sales"]
      };
    } else if (index < 24) {
      return {
        ...col,
        group: ["2024", "Q2", "Apr", "Support"]
      };
    } else if (index < 27) {
      return {
        ...col,
        group: ["2024", "Q2", "May", "Sales"]
      };
    } else {
      return {
        ...col,
        group: ["2024", "Q2", "May", "Support"]
      };
    }
  });
  const drawGroupHeader: DrawGroupHeaderCallback = React.useCallback(args => {
    const {
      ctx,
      groupName,
      level,
      span,
      rect,
      theme,
      isSelected,
      isHovered
    } = args;
    console.log(args);

    // First draw default to get icons and actions, but we'll draw over the background
    // Save the context state before default drawing
    ctx.save();

    // Call default drawing first to render icons and actions
    // draw();

    // Now draw our custom background OVER the default (but icons/actions will show through)
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.width, rect.height);

    // Different colors for different levels
    const levelColors = [{
      start: "#e3f2fd",
      end: "#bbdefb"
    },
    // Level 0 (Year) - Light blue
    {
      start: "#f3e5f5",
      end: "#e1bee7"
    },
    // Level 1 (Quarter) - Light purple
    {
      start: "#fff3e0",
      end: "#ffe0b2"
    },
    // Level 2 (Month) - Light orange
    {
      start: "#e8f5e9",
      end: "#c8e6c9"
    } // Level 3 (Department) - Light green
    ];
    const colors = levelColors[level] ?? levelColors[0];
    const gradient = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.height);
    const selectedColor = theme.accentColor;
    gradient.addColorStop(0, isSelected ? selectedColor : isHovered ? colors.end : colors.start);
    gradient.addColorStop(1, isSelected ? selectedColor : colors.end);

    // Use composite operation to draw background behind existing content
    ctx.globalCompositeOperation = COMPOSITE_DESTINATION_OVER;
    ctx.fillStyle = gradient;
    // ctx.fill();
    ctx.globalCompositeOperation = COMPOSITE_SOURCE_OVER;

    // Draw custom text with shadow effect
    if (groupName !== "") {
      // ctx.fillStyle = isSelected ? theme.textHeaderSelected : theme.textHeader;
      ctx.font = \`bold \${14 + level * 2}px \${theme.fontFamily}\`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      // Text shadow for depth
      ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      const padding = 12 + level * 4;
      ctx.fillText(groupName, rect.x + padding, rect.y + rect.height / 2);

      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Draw span indicator (number of columns in group)
      const spanText = \`(\${span[1] - span[0] + 1} cols)\`;
      ctx.font = \`\${10}px \${theme.fontFamily}\`;
      // ctx.fillStyle = isSelected ? theme.textHeaderSelected : (theme.textGroupHeader ?? theme.textHeader);
      ctx.globalAlpha = 0.7;
      const textWidth = ctx.measureText(groupName).width;
      ctx.fillText(spanText, rect.x + padding + textWidth + 8, rect.y + rect.height / 2);
      ctx.globalAlpha = 1;
    }

    // Draw level indicator badge in top-right corner
    // ctx.fillStyle = isSelected ? theme.accentColor : theme.bgHeader;
    ctx.beginPath();
    const badgeSize = 20;
    const badgePadding = 4;
    const badgeX = rect.x + rect.width - badgeSize - badgePadding;
    const badgeY = rect.y + badgePadding;
    ctx.arc(badgeX + badgeSize / 2, badgeY + badgeSize / 2, badgeSize / 2, 0, Math.PI * 2);
    // ctx.fill();

    // ctx.fillStyle = theme.textHeader;
    ctx.font = \`bold \${10}px \${theme.fontFamily}\`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(\`L\${level}\`, badgeX + badgeSize / 2, badgeY + badgeSize / 2);
    ctx.restore();
  }, []);
  const [sel, setSel] = React.useState<GridSelection>(emptyGridSelection);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={multiLevelCols} rows={500} getGroupDetails={g => ({
    name: g,
    icon: g === "" ? undefined : GridColumnIcon.HeaderCode
  })}
  // freezeColumns={3}
  groupHeaderHeight={[36, 32, 30, 28]} // Four different heights for four levels
  drawGroupHeader={drawGroupHeader} drawHeader={(args, draw) => {
    console.log(args);
    draw();
  }} rowMarkers="both" gridSelection={sel} onGridSelectionChange={args => {
    setSel(args);
    console.log("onGridSelectionChange", args);
  }} onGroupHeaderClicked={args => {
    console.log("onGroupHeaderClicked", args);
  }} onMouseMove={args => {
    if (args.kind === "group-header") {
      // console.log('onMouseMove',args);
    }
  }} onCellClicked={args => {
    // console.log('onCellClicked',args);
  }} />;
}`,...(R=(I=H.parameters)==null?void 0:I.docs)==null?void 0:R.source}}};var L,$,_;w.parameters={...w.parameters,docs:{...(L=w.parameters)==null?void 0:L.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(24, true, true);

  // Create three-level groups
  const threeLevelCols = cols.map((col, index) => {
    if (index < 6) {
      return {
        ...col,
        group: ["2024", "Q1", "Jan"]
      };
    } else if (index < 12) {
      return {
        ...col,
        group: ["2024", "Q1", "Feb"]
      };
    } else if (index < 18) {
      return {
        ...col,
        group: ["2024", "Q2", "Apr"]
      };
    } else {
      return {
        ...col,
        group: ["2024", "Q2", "May"]
      };
    }
  });
  const drawGroupHeader: DrawGroupHeaderCallback = React.useCallback(args => {
    const {
      ctx,
      rect,
      theme,
      isSelected,
      isHovered,
      groupName
    } = args;

    // Call default drawing first
    ctx.save();
    // draw();

    // Then draw our minimal customizations on top
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.width, rect.height);

    // Very subtle background overlay
    const bgColor = isSelected ? theme.accentColor : isHovered ? theme.bgHeaderHovered : theme.bgHeader;
    ctx.globalCompositeOperation = COMPOSITE_DESTINATION_OVER;
    ctx.fillStyle = bgColor;
    ctx.fill();
    ctx.globalCompositeOperation = COMPOSITE_SOURCE_OVER;

    // Simple border
    if (isSelected || isHovered) {
      ctx.strokeStyle = isSelected ? theme.accentColor : theme.borderColor;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();
  }, []);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={threeLevelCols} rows={1000} getGroupDetails={g => ({
    name: g,
    icon: g === "" ? undefined : GridColumnIcon.HeaderCode
  })} groupHeaderHeight={[28, 26, 24]} // Three different heights
  drawGroupHeader={drawGroupHeader} rowMarkers="both" />;
}`,...(_=($=w.parameters)==null?void 0:$.docs)==null?void 0:_.source}}};var A,F,Y;v.parameters={...v.parameters,docs:{...(A=v.parameters)==null?void 0:A.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(20, true, true);

  // Create groups with different types
  const styledCols = cols.map((col, index) => {
    if (index < 5) {
      return {
        ...col,
        group: ["Revenue", "Q1"]
      };
    } else if (index < 10) {
      return {
        ...col,
        group: ["Expenses", "Q1"]
      };
    } else if (index < 15) {
      return {
        ...col,
        group: ["Revenue", "Q2"]
      };
    } else {
      return {
        ...col,
        group: ["Expenses", "Q2"]
      };
    }
  });
  const drawGroupHeader: DrawGroupHeaderCallback = React.useCallback(args => {
    const {
      ctx,
      groupName,
      level,
      rect,
      theme,
      isSelected,
      isHovered
    } = args;

    // Call default drawing first
    ctx.save();
    // draw();

    // Then apply custom styling
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.width, rect.height);

    // Different styling based on group name
    let bgColor: string;
    let textColor: string;
    if (groupName === "Revenue") {
      bgColor = isSelected ? "#4caf50" : isHovered ? "#81c784" : "#c8e6c9";
      textColor = isSelected ? "#ffffff" : "#2e7d32";
    } else if (groupName === "Expenses") {
      bgColor = isSelected ? "#f44336" : isHovered ? "#e57373" : "#ffcdd2";
      textColor = isSelected ? "#ffffff" : "#c62828";
    } else {
      // Quarter level
      bgColor = isSelected ? theme.accentColor : isHovered ? theme.bgHeaderHovered : theme.bgHeader;
      textColor = isSelected ? theme.textHeaderSelected : theme.textHeader;
    }

    // Draw background behind existing content
    ctx.globalCompositeOperation = COMPOSITE_DESTINATION_OVER;
    ctx.fillStyle = bgColor;
    ctx.fill();
    ctx.globalCompositeOperation = COMPOSITE_SOURCE_OVER;

    // Rounded corners for top level (draw as overlay)
    if (level === 0) {
      ctx.beginPath();
      const radius = 4;
      ctx.moveTo(rect.x + radius, rect.y);
      ctx.lineTo(rect.x + rect.width - radius, rect.y);
      ctx.quadraticCurveTo(rect.x + rect.width, rect.y, rect.x + rect.width, rect.y + radius);
      ctx.lineTo(rect.x + rect.width, rect.y + rect.height);
      ctx.lineTo(rect.x, rect.y + rect.height);
      ctx.lineTo(rect.x, rect.y + radius);
      ctx.quadraticCurveTo(rect.x, rect.y, rect.x + radius, rect.y);
      ctx.closePath();
      ctx.globalCompositeOperation = COMPOSITE_DESTINATION_OVER;
      ctx.fill();
      ctx.globalCompositeOperation = COMPOSITE_SOURCE_OVER;
    }

    // Custom text color (draw text on top)
    if (groupName !== "") {
      ctx.fillStyle = textColor;
      ctx.font = \`bold \${13 + level}px \${theme.fontFamily}\`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(groupName, rect.x + 10, rect.y + rect.height / 2);
    }
    ctx.restore();
  }, []);
  const dataEditorClassName = "data-editor-" + useId();
  const dataEditorSelector = \`.\${dataEditorClassName}\`;
  const headerHeight = [32, 28, 40];
  const headerHeightNum = headerHeight.reduce((acc, curr) => acc + curr, 0);
  return <DataEditor className={dataEditorClassName} height={1000} ref={() => {
    /** пример реализации незакрепленного шапки */
    const dataEditorElement = document.querySelector(dataEditorSelector) as HTMLElement | undefined;
    if (!dataEditorElement) return;
    const scroller = dataEditorElement?.children?.[0]?.children?.[0]?.children?.[1] as HTMLElement | undefined;
    if (!scroller) return;
    const scrollCb = () => {
      const y = scroller.scrollTop;
      const tableFirstInner = dataEditorElement?.children[0] as HTMLElement | undefined;
      const canvasTableWrapper = dataEditorElement?.children[0].children[0].children[0] as HTMLCanvasElement | undefined;
      if (!tableFirstInner || !canvasTableWrapper) return;
      const fixedY = y < headerHeightNum ? y : headerHeightNum;
      /** его высота удобна тем, что =100%; его высота влияет на высоту canvas элемента таблицы */
      tableFirstInner.style = \`height: calc(100% + \${headerHeightNum}px\`;
      canvasTableWrapper.style.transform = \`translateY(-\${fixedY}px)\`;
    };
    scroller.addEventListener("scroll", scrollCb);
    return () => scroller?.removeEventListener?.("scroll", scrollCb);
  }} {...defaultProps} getCellContent={getCellContent} columns={styledCols} rows={500} getGroupDetails={g => ({
    name: g,
    icon: g === "" ? undefined : GridColumnIcon.HeaderCode
  })} headerHeight={headerHeight[headerHeight.length - 1]} groupHeaderHeight={headerHeight.slice(0, -1)} drawGroupHeader={drawGroupHeader} rowMarkers="both" />;
}`,...(Y=(F=v.parameters)==null?void 0:F.docs)==null?void 0:Y.source}}};const de=["CustomGroupHeaderDrawing","MinimalGroupHeader","UnstickyHeader"];export{H as CustomGroupHeaderDrawing,w as MinimalGroupHeader,v as UnstickyHeader,de as __namedExportsOrder,ie as default};
