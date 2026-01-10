import{R as n}from"./iframe-VjYuGMsY.js";import{D as d}from"./data-editor-all-C18pEU2z.js";import{B as v,D as h,P as M,u as f,d as C}from"./utils-DA5KvXiW.js";import{h as Q}from"./image-window-loader-B8cvJCVw.js";import{S as L}from"./story-utils-Dv2OgOS1.js";import"./preload-helper-C1FmrZbK.js";import"./scrolling-data-grid-Dlt80JY1.js";import"./marked.esm-CZueurBS.js";import"./index-D_kXk1yT.js";import"./useResizeDetector-1xUx3BY8.js";const A={title:"Glide-Data-Grid/DataEditor Demos",decorators:[t=>n.createElement(L,null,n.createElement(v,{title:"Multi-Level Column Grouping",description:n.createElement(h,null,"Columns in the data grid can now have multi-level groups by setting their"," ",n.createElement(M,null,"group")," property to an array of strings. Each level represents a different hierarchy level.")},n.createElement(t,null)))]},o=()=>{const{cols:t,getCellContent:a}=f(30,!0,!0),u=t.map((e,r)=>r<3?{...e,group:["2024","Q1","Jan","Sales"]}:r<6?{...e,group:["2024","Q1","Jan","Marketing"]}:r<9?{...e,group:["2024","Q1","Feb","Sales"]}:r<12?{...e,group:["2024","Q1","Feb","Marketing"]}:r<15?{...e,group:["2024","Q1","Mar","Sales"]}:r<18?{...e,group:["2024","Q1","Mar","Marketing"]}:r<21?{...e,group:["2024","Q2","Apr","Sales"]}:r<24?{...e,group:["2024","Q2","Apr","Support"]}:r<27?{...e,group:["2024","Q2","May","Sales"]}:{...e,group:["2024","Q2","May","Support"]});return n.createElement(d,{...C,getCellContent:a,onGroupHeaderRenamed:(e,r)=>window.alert(`Please rename group ${e} to ${r}`),columns:u,rows:500,getGroupDetails:e=>({name:e,icon:e===""?void 0:Q.HeaderCode}),groupHeaderHeight:[32,28,26,24],rowMarkers:"both"})},l=()=>{const{cols:t,getCellContent:a}=f(24,!0,!0),u=t.map((e,r)=>r<6?{...e,group:["2024","Q1","Jan"]}:r<12?{...e,group:["2024","Q1","Feb"]}:r<18?{...e,group:["2024","Q2","Apr"]}:{...e,group:["2024","Q2","May"]});return n.createElement(d,{...C,getCellContent:a,columns:u,rows:1e3,getGroupDetails:e=>({name:e,icon:e===""?void 0:Q.HeaderCode}),groupHeaderHeight:[28,26,24],rowMarkers:"both"})};var s,p,i;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`() => {
  // Generate 30 columns for complex grouping
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(30, true, true);

  // Create complex multi-level groups with more than 10 different groups
  // Structure: Year -> Quarter -> Month -> Department
  const multiLevelCols = cols.map((col, index) => {
    // 2024 Q1 groups
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
    }
    // 2024 Q2 groups
    else if (index < 21) {
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
  return <DataEditor {...defaultProps} getCellContent={getCellContent} onGroupHeaderRenamed={(x, y) => window.alert(\`Please rename group \${x} to \${y}\`)} columns={multiLevelCols} rows={500} getGroupDetails={g => ({
    name: g,
    icon: g === "" ? undefined : GridColumnIcon.HeaderCode
  })} groupHeaderHeight={[32, 28, 26, 24]} // Four different heights for four levels
  rowMarkers="both" />;
}`,...(i=(p=o.parameters)==null?void 0:p.docs)==null?void 0:i.source}}};var g,m,c;l.parameters={...l.parameters,docs:{...(g=l.parameters)==null?void 0:g.docs,source:{originalSource:`() => {
  const {
    cols,
    getCellContent
  } = useMockDataGenerator(24, true, true);

  // Create three-level groups
  const threeLevelCols = cols.map((col, index) => {
    if (index < 6) {
      // Level 1 = "2024", Level 2 = "Q1", Level 3 = "Jan"
      return {
        ...col,
        group: ["2024", "Q1", "Jan"]
      };
    } else if (index < 12) {
      // Level 1 = "2024", Level 2 = "Q1", Level 3 = "Feb"
      return {
        ...col,
        group: ["2024", "Q1", "Feb"]
      };
    } else if (index < 18) {
      // Level 1 = "2024", Level 2 = "Q2", Level 3 = "Apr"
      return {
        ...col,
        group: ["2024", "Q2", "Apr"]
      };
    } else {
      // Level 1 = "2024", Level 2 = "Q2", Level 3 = "May"
      return {
        ...col,
        group: ["2024", "Q2", "May"]
      };
    }
  });
  return <DataEditor {...defaultProps} getCellContent={getCellContent} columns={threeLevelCols} rows={1000} getGroupDetails={g => ({
    name: g,
    icon: g === "" ? undefined : GridColumnIcon.HeaderCode
  })} groupHeaderHeight={[28, 26, 24]} // Three different heights
  rowMarkers="both" />;
}`,...(c=(m=l.parameters)==null?void 0:m.docs)==null?void 0:c.source}}};const F=["MultiLevelColumnGroups","ThreeLevelColumnGroups"];export{o as MultiLevelColumnGroups,l as ThreeLevelColumnGroups,F as __namedExportsOrder,A as default};
