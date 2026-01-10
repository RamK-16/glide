import{R as p,r as B}from"./iframe-VjYuGMsY.js";import{D as O}from"./data-editor-all-C18pEU2z.js";import{B as V,D as z,P as U,u as T,d as M}from"./utils-DA5KvXiW.js";import{h as G}from"./image-window-loader-B8cvJCVw.js";import{S as X}from"./story-utils-Dv2OgOS1.js";import"./preload-helper-C1FmrZbK.js";import"./scrolling-data-grid-Dlt80JY1.js";import"./marked.esm-CZueurBS.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-1xUx3BY8.js";const v="destination-over",E="source-over",ae={title:"Glide-Data-Grid/DataEditor Demos",decorators:[x=>p.createElement(X,null,p.createElement(V,{title:"Custom Group Header Drawing",description:p.createElement(z,null,"This example demonstrates custom rendering of group headers using the"," ",p.createElement(U,null,"drawGroupHeader")," prop. The callback receives information about the group name, level, span, and other properties, allowing for complete customization of the group header appearance.")},p.createElement(x,null)))]},H=()=>{const{cols:x,getCellContent:m}=T(30,!0,!0),C=x.map((o,e)=>e<3?{...o,group:["2024","Q1","Jan","Sales"]}:e<6?{...o,group:["2024","Q1","Jan","Marketing"]}:e<9?{...o,group:["2024","Q1","Feb","Sales"]}:e<12?{...o,group:["2024","Q1","Feb","Marketing"]}:e<15?{...o,group:["2024","Q1","Mar","Sales"]}:e<18?{...o,group:["2024","Q1","Mar","Marketing"]}:e<21?{...o,group:["2024","Q2","Apr","Sales"]}:e<24?{...o,group:["2024","Q2","Apr","Support"]}:e<27?{...o,group:["2024","Q2","May","Sales"]}:{...o,group:["2024","Q2","May","Support"]}),b=p.useCallback(o=>{const{ctx:e,groupName:c,level:s,span:n,rect:t,theme:a,isSelected:i,isHovered:r}=o;e.save(),e.beginPath(),e.rect(t.x,t.y,t.width,t.height);const g=[{start:"#e3f2fd",end:"#bbdefb"},{start:"#f3e5f5",end:"#e1bee7"},{start:"#fff3e0",end:"#ffe0b2"},{start:"#e8f5e9",end:"#c8e6c9"}],d=g[s]??g[0],h=e.createLinearGradient(t.x,t.y,t.x,t.y+t.height),u=a.accentColor;h.addColorStop(0,i?u:r?d.end:d.start),h.addColorStop(1,i?u:d.end),e.globalCompositeOperation=v,e.fillStyle=h,e.fill(),e.globalCompositeOperation=E,e.strokeStyle=i?a.accentColor:a.borderColor;const f=i?2:1;if(e.lineWidth=f,e.stroke(),c!==""){e.fillStyle=i?a.textHeaderSelected:a.textHeader,e.font=`bold ${14+s*2}px ${a.fontFamily}`,e.textAlign="left",e.textBaseline="middle",e.shadowColor="rgba(0, 0, 0, 0.2)",e.shadowBlur=2,e.shadowOffsetX=1,e.shadowOffsetY=1;const Q=12+s*4;e.fillText(c,t.x+Q,t.y+t.height/2),e.shadowColor="transparent",e.shadowBlur=0,e.shadowOffsetX=0,e.shadowOffsetY=0;const W=`(${n[1]-n[0]+1} cols)`;e.font=`10px ${a.fontFamily}`,e.fillStyle=i?a.textHeaderSelected:a.textGroupHeader??a.textHeader,e.globalAlpha=.7;const Y=e.measureText(c).width;e.fillText(W,t.x+Q+Y+8,t.y+t.height/2),e.globalAlpha=1}e.fillStyle=i?a.accentColor:a.bgHeader,e.beginPath();const l=20,S=4,k=t.x+t.width-l-S,D=t.y+S;e.arc(k+l/2,D+l/2,l/2,0,Math.PI*2),e.fill(),e.fillStyle=a.textHeader,e.font=`bold 10px ${a.fontFamily}`,e.textAlign="center",e.textBaseline="middle",e.fillText(`L${s}`,k+l/2,D+l/2),e.restore()},[]);return p.createElement(O,{...M,getCellContent:m,columns:C,rows:500,getGroupDetails:o=>({name:o,icon:o===""?void 0:G.HeaderCode}),groupHeaderHeight:[36,32,30,28],drawGroupHeader:b,rowMarkers:"both"})},w=()=>{const{cols:x,getCellContent:m}=T(24,!0,!0),C=x.map((o,e)=>e<6?{...o,group:["2024","Q1","Jan"]}:e<12?{...o,group:["2024","Q1","Feb"]}:e<18?{...o,group:["2024","Q2","Apr"]}:{...o,group:["2024","Q2","May"]}),b=p.useCallback(o=>{const{ctx:e,rect:c,theme:s,isSelected:n,isHovered:t}=o;e.save(),e.beginPath(),e.rect(c.x,c.y,c.width,c.height);const a=n?s.accentColor:t?s.bgHeaderHovered:s.bgHeader;e.globalCompositeOperation=v,e.fillStyle=a,e.fill(),e.globalCompositeOperation=E,(n||t)&&(e.strokeStyle=n?s.accentColor:s.borderColor,e.lineWidth=1,e.stroke()),e.restore()},[]);return p.createElement(O,{...M,getCellContent:m,columns:C,rows:1e3,getGroupDetails:o=>({name:o,icon:o===""?void 0:G.HeaderCode}),groupHeaderHeight:[28,26,24],drawGroupHeader:b,rowMarkers:"both"})},y=()=>{const{cols:x,getCellContent:m}=T(20,!0,!0),C=x.map((n,t)=>t<5?{...n,group:["Revenue","Q1"]}:t<10?{...n,group:["Expenses","Q1"]}:t<15?{...n,group:["Revenue","Q2"]}:{...n,group:["Expenses","Q2"]}),b=p.useCallback(n=>{const{ctx:t,groupName:a,level:i,rect:r,theme:g,isSelected:d,isHovered:h}=n;t.save(),t.beginPath(),t.rect(r.x,r.y,r.width,r.height);let u,f;if(a==="Revenue"?(u=d?"#4caf50":h?"#81c784":"#c8e6c9",f=d?"#ffffff":"#2e7d32"):a==="Expenses"?(u=d?"#f44336":h?"#e57373":"#ffcdd2",f=d?"#ffffff":"#c62828"):(u=d?g.accentColor:h?g.bgHeaderHovered:g.bgHeader,f=d?g.textHeaderSelected:g.textHeader),t.globalCompositeOperation=v,t.fillStyle=u,t.fill(),t.globalCompositeOperation=E,i===0){t.beginPath();const l=4;t.moveTo(r.x+l,r.y),t.lineTo(r.x+r.width-l,r.y),t.quadraticCurveTo(r.x+r.width,r.y,r.x+r.width,r.y+l),t.lineTo(r.x+r.width,r.y+r.height),t.lineTo(r.x,r.y+r.height),t.lineTo(r.x,r.y+l),t.quadraticCurveTo(r.x,r.y,r.x+l,r.y),t.closePath(),t.globalCompositeOperation=v,t.fill(),t.globalCompositeOperation=E}a!==""&&(t.fillStyle=f,t.font=`bold ${13+i}px ${g.fontFamily}`,t.textAlign="left",t.textBaseline="middle",t.fillText(a,r.x+10,r.y+r.height/2)),t.restore()},[]),o="data-editor-"+B.useId(),e=`.${o}`,c=[32,28,40],s=c.reduce((n,t)=>n+t,0);return p.createElement(O,{className:o,height:1e3,ref:()=>{var i,r,g,d,h;const n=document.querySelector(e);if(!n)return;const t=(h=(d=(g=(r=(i=n==null?void 0:n.children)==null?void 0:i[0])==null?void 0:r.children)==null?void 0:g[0])==null?void 0:d.children)==null?void 0:h[1];if(!t)return;const a=()=>{const u=t.scrollTop,f=n==null?void 0:n.children[0],l=n==null?void 0:n.children[0].children[0].children[0];if(!f||!l)return;const S=u<s?u:s;f.style=`height: calc(100% + ${s}px`,l.style.transform=`translateY(-${S}px)`};return t.addEventListener("scroll",a),()=>{var u;return(u=t==null?void 0:t.removeEventListener)==null?void 0:u.call(t,"scroll",a)}},...M,getCellContent:m,columns:C,rows:500,getGroupDetails:n=>({name:n,icon:n===""?void 0:G.HeaderCode}),headerHeight:c[c.length-1],groupHeaderHeight:c.slice(0,-1),drawGroupHeader:b,rowMarkers:"both"})};var N,P,I;H.parameters={...H.parameters,docs:{...(N=H.parameters)==null?void 0:N.docs,source:{originalSource:`() => {
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
    ctx.fill();
    ctx.globalCompositeOperation = COMPOSITE_SOURCE_OVER;

    // Draw border
    ctx.strokeStyle = isSelected ? theme.accentColor : theme.borderColor;
    const borderWidth = isSelected ? 2 : 1;
    ctx.lineWidth = borderWidth;
    ctx.stroke();

    // Draw custom text with shadow effect
    if (groupName !== "") {
      ctx.fillStyle = isSelected ? theme.textHeaderSelected : theme.textHeader;
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
      ctx.fillStyle = isSelected ? theme.textHeaderSelected : theme.textGroupHeader ?? theme.textHeader;
      ctx.globalAlpha = 0.7;
      const textWidth = ctx.measureText(groupName).width;
      ctx.fillText(spanText, rect.x + padding + textWidth + 8, rect.y + rect.height / 2);
      ctx.globalAlpha = 1;
    }

    // Draw level indicator badge in top-right corner
    ctx.fillStyle = isSelected ? theme.accentColor : theme.bgHeader;
    ctx.beginPath();
    const badgeSize = 20;
    const badgePadding = 4;
    const badgeX = rect.x + rect.width - badgeSize - badgePadding;
    const badgeY = rect.y + badgePadding;
    ctx.arc(badgeX + badgeSize / 2, badgeY + badgeSize / 2, badgeSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = theme.textHeader;
    ctx.font = \`bold \${10}px \${theme.fontFamily}\`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(\`L\${level}\`, badgeX + badgeSize / 2, badgeY + badgeSize / 2);
    ctx.restore();
  }, []);
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={multiLevelCols} rows={500} getGroupDetails={g => ({
    name: g,
    icon: g === "" ? undefined : GridColumnIcon.HeaderCode
  })} groupHeaderHeight={[36, 32, 30, 28]} // Four different heights for four levels
  drawGroupHeader={drawGroupHeader} rowMarkers="both" />;
}`,...(I=(P=H.parameters)==null?void 0:P.docs)==null?void 0:I.source}}};var R,L,$;w.parameters={...w.parameters,docs:{...(R=w.parameters)==null?void 0:R.docs,source:{originalSource:`() => {
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
      isHovered
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
}`,...($=(L=w.parameters)==null?void 0:L.docs)==null?void 0:$.source}}};var _,A,F;y.parameters={...y.parameters,docs:{...(_=y.parameters)==null?void 0:_.docs,source:{originalSource:`() => {
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
}`,...(F=(A=y.parameters)==null?void 0:A.docs)==null?void 0:F.source}}};const le=["CustomGroupHeaderDrawing","MinimalGroupHeader","UnstickyHeader"];export{H as CustomGroupHeaderDrawing,w as MinimalGroupHeader,y as UnstickyHeader,le as __namedExportsOrder,ae as default};
