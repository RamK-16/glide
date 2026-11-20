const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./article-cell-editor-D0ZdWKJz.js","./iframe-CUpeVJMc.js","./preload-helper-C1FmrZbK.js","./marked.esm-tFo0_PyB.js"])))=>i.map(i=>d[i]);
import{s as ee,m as Kr}from"./marked.esm-tFo0_PyB.js";import{r as f,W as tn,R as nn}from"./iframe-CUpeVJMc.js";import{G as V,p as Xr,m as ge,g as ie,a as Ft,u as _n,b as Yr,d as qr,c as Zr,i as Jr,r as Qr,e as Mt,D as Bn}from"./data-editor-all-DHZzerhi.js";import{_ as ke,a as ea,b as le,t as ta,c as Wn,d as D,e as ye}from"./toConsumableArray-Cg7-Q_9P.js";import{r as na}from"./index-BtRdlosd.js";import{_ as ra}from"./preload-helper-C1FmrZbK.js";import{r as ht}from"./throttle-CEx6xBPo.js";import{u as aa}from"./flatten-C2E6Wn2M.js";import{u as oa}from"./useResizeDetector-DxNlDJ5G.js";const ia=[[50,5],[61.23,39.55],[97.55,39.55],[68.16,60.9],[79.39,95.45],[50,74.1],[20.61,95.45],[31.84,60.9],[2.45,39.55],[38.77,39.55]];function la(t,e,r){let a=!1;for(const n of ia){const o=(n[0]-50)*(r/100)+e[0],l=(n[1]-50)*(r/100)+e[1];a?t.lineTo(o,l):(t.moveTo(o,l),a=!0)}t.closePath()}const sa=()=>f.createElement("svg",{width:"100",height:"100",viewBox:"0 0 100 100",fill:"none",xmlns:"http://www.w3.org/2000/svg"},f.createElement("path",{d:"M47.1468 13.7811C48.0449 11.0172 51.9551 11.0172 52.8532 13.7812L60.5522 37.4762C60.9538 38.7123 62.1056 39.5491 63.4053 39.5491H88.3198C91.226 39.5491 92.4343 43.268 90.0831 44.9762L69.9269 59.6205C68.8755 60.3845 68.4355 61.7386 68.8371 62.9746L76.5361 86.6697C77.4342 89.4336 74.2707 91.732 71.9196 90.0238L51.7634 75.3794C50.7119 74.6155 49.2881 74.6155 48.2366 75.3795L28.0804 90.0238C25.7293 91.732 22.5659 89.4336 23.4639 86.6697L31.1629 62.9746C31.5645 61.7386 31.1245 60.3845 30.0731 59.6205L9.91686 44.9762C7.56572 43.268 8.77405 39.5491 11.6802 39.5491H36.5947C37.8944 39.5491 39.0462 38.7123 39.4478 37.4762L47.1468 13.7811Z",fill:"currentColor"})),ua=ee.div`
    .gdg-active {
        color: var(--gdg-text-dark);
    }

    display: flex;
    align-items: center;
    padding: 6px 0;
    color: var(--gdg-text-light);

    > * {
        position: relative;
        width: 16px;
        height: 16px;
        cursor: pointer;
        margin-right: 2px;

        svg {
            width: 100%;
            height: 100%;
        }
    }
`,ca={kind:V.Custom,isMatch:t=>t.data.kind==="star-cell",needsHover:!0,draw:(t,e)=>{const{ctx:r,theme:a,rect:n,hoverAmount:o}=t,{rating:l}=e.data,s=a.cellHorizontalPadding;let i=n.x+s;const u=Math.min(5,Math.ceil(l));i+=8,r.beginPath();for(let c=0;c<u;c++)la(r,[i,n.y+n.height/2],16),i+=18;return r.fillStyle=a.textDark,r.globalAlpha=.6+.4*o,r.fill(),r.globalAlpha=1,!0},provideEditor:()=>t=>f.createElement(ua,null,[0,1,2,3,4].map(e=>f.createElement("div",{key:e,className:t.value.data.rating<e+1?"gdg-inactive":"gdg-active",onClick:()=>{t.onChange({...t.value,data:{...t.value.data,rating:e+1}})}},f.createElement(sa,null)))),onPaste:(t,e)=>{const r=Number.parseInt(t);return{...e,rating:Number.isNaN(r)?0:r}}},da={kind:V.Custom,isMatch:t=>t.data.kind==="sparkline-cell",needsHover:!0,needsHoverPosition:!0,draw:(t,e)=>{const{ctx:r,theme:a,rect:n,hoverAmount:o,hoverX:l}=t;let{values:s,yAxis:i,color:u,graphKind:c="area",displayValues:d,hideAxis:b}=e.data;const[p,g]=i;if(s.length===0)return!0;s=s.map(P=>Math.min(1,Math.max(0,(P-p)/(g-p))));const m=a.cellHorizontalPadding,v=m+n.x,h=n.y+3,C=n.height-6,S=n.width-m*2,x=g-p,k=g<=0?h:p>=0?h+C:h+C*(g/x);if(!b&&p<=0&&g>=0&&(r.beginPath(),r.moveTo(v,k),r.lineTo(v+S,k),r.globalAlpha=.4,r.lineWidth=1,r.strokeStyle=a.textLight,r.stroke(),r.globalAlpha=1),c==="bar"){r.beginPath();const P=2,w=(s.length-1)*P,y=(S-w)/s.length;let O=v;for(const I of s){const $=h+C-I*C;r.moveTo(O,k),r.lineTo(O+y,k),r.lineTo(O+y,$),r.lineTo(O,$),O+=y+P}r.fillStyle=e.data.color??a.accentColor,r.fill()}else{s.length===1&&(s=[s[0],s[0]],d&&(d=[d[0],d[0]])),r.beginPath();const P=(n.width-16)/(s.length-1),w=s.map((O,I)=>({x:v+P*I,y:h+C-O*C}));r.moveTo(w[0].x,w[0].y);let y=0;if(w.length>2)for(y=1;y<w.length-2;y++){const O=(w[y].x+w[y+1].x)/2,I=(w[y].y+w[y+1].y)/2;r.quadraticCurveTo(w[y].x,w[y].y,O,I)}if(r.quadraticCurveTo(w[y].x,w[y].y,w[y+1].x,w[y+1].y),r.strokeStyle=u??a.accentColor,r.lineWidth=1+o*.5,r.stroke(),r.lineTo(n.x+n.width-m,k),r.lineTo(n.x+m,k),r.closePath(),c==="area"){r.globalAlpha=.2+.2*o;const O=r.createLinearGradient(0,h,0,h+C*1.4);O.addColorStop(0,u??a.accentColor);const[I,$,F]=Xr(u??a.accentColor);O.addColorStop(1,`rgba(${I}, ${$}, ${F}, 0)`),r.fillStyle=O,r.fill(),r.globalAlpha=1}if(l!==void 0&&(c==="line"||c==="area")&&d!==void 0){r.beginPath();const O=Math.min(s.length-1,Math.max(0,Math.round((l-m)/P)));r.moveTo(v+O*P,n.y+1),r.lineTo(v+O*P,n.y+n.height),r.lineWidth=1,r.strokeStyle=a.textLight,r.stroke(),r.save(),r.font=`8px ${a.fontFamily}`,r.fillStyle=a.textMedium,r.textBaseline="top",r.fillText(d[O],v,n.y+a.cellVerticalPadding),r.restore()}}return!0},provideEditor:()=>{},onPaste:(t,e)=>e};function De(t,e,r,a,n,o){if(!(a<=0||n<=0)){if(typeof o=="number"&&o<=0){t.rect(e,r,a,n);return}typeof o=="number"&&(o={tl:o,tr:o,br:o,bl:o}),o={tl:Math.min(o.tl,n/2,a/2),tr:Math.min(o.tr,n/2,a/2),bl:Math.min(o.bl,n/2,a/2),br:Math.min(o.br,n/2,a/2)},o.tl=Math.max(0,o.tl),o.tr=Math.max(0,o.tr),o.br=Math.max(0,o.br),o.bl=Math.max(0,o.bl),t.moveTo(e+o.tl,r),t.arcTo(e+a,r,e+a,r+o.tr,o.tr),t.arcTo(e+a,r+n,e+a-o.br,r+n,o.br),t.arcTo(e,r+n,e,r+n-o.bl,o.bl),t.arcTo(e,r,e+o.tl,r,o.tl)}}const fa=ee.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding-top: 6px;
    color: var(--gdg-text-dark);

    box-sizing: border-box;

    * {
        box-sizing: border-box;
    }

    &&&& label {
        display: flex;
        cursor: pointer;

        input {
            cursor: pointer;
            width: auto;
        }

        .gdg-pill {
            margin-left: 8px;
            margin-right: 6px;
            margin-bottom: 6px;

            border-radius: var(--gdg-rounding-radius, ${t=>t.tagHeight/2}px);
            min-height: ${t=>t.tagHeight}px;
            padding: 2px ${t=>t.innerPad}px;
            display: flex;
            align-items: center;

            font: 12px var(--gdg-font-family);

            background-color: var(--gdg-bg-bubble);

            transition: box-shadow 150ms;

            &.gdg-unselected {
                opacity: 0.8;
            }
        }
    }
    label:hover .gdg-pill {
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
    }

    &&&&.gdg-readonly label {
        cursor: default;

        .gdg-pill {
            box-shadow: none !important;
        }
    }
`,pa={kind:V.Custom,isMatch:t=>t.data.kind==="tags-cell",draw:(t,e)=>{var g;const{ctx:r,theme:a,rect:n}=t,{possibleTags:o,tags:l}=e.data,s={x:n.x+a.cellHorizontalPadding,y:n.y+a.cellVerticalPadding,width:n.width-2*a.cellHorizontalPadding,height:n.height-2*a.cellVerticalPadding},i=a.bubbleHeight,u=a.bubblePadding,c=Math.max(1,Math.floor(s.height/(i+u)));let d=s.x,b=1,p=s.y+(s.height-c*i-(c-1)*u)/2;for(const m of l){const v=((g=o.find(x=>x.tag===m))==null?void 0:g.color)??a.bgBubble;r.font=`12px ${a.fontFamily}`;const C=ge(m,r).width+u*2,S=i/2;if(d!==s.x&&d+C>s.x+s.width&&b<c&&(b++,p+=i+u,d=s.x),r.fillStyle=v,r.beginPath(),De(r,d,p,C,i,a.roundingRadius??i/2),r.fill(),r.fillStyle=a.textDark,r.fillText(m,d+u,p+S+ie(r,`12px ${a.fontFamily}`)),d+=C+8,d>s.x+s.width&&b>=c)break}return!0},provideEditor:()=>t=>{const{onChange:e,value:r,theme:a}=t,{readonly:n=!1}=r,{possibleTags:o,tags:l}=r.data;return f.createElement(fa,{tagHeight:a.bubbleHeight,innerPad:a.bubblePadding,className:n?"gdg-readonly":""},o.map(s=>{const i=l.indexOf(s.tag)!==-1;return f.createElement("label",{key:s.tag},!n&&f.createElement("input",{className:"gdg-input",type:"checkbox",checked:i,onChange:()=>{const u=i?l.filter(c=>c!==s.tag):[...l,s.tag];e({...t.value,data:{...r.data,tags:u}})}}),f.createElement("div",{className:"gdg-pill "+(i?"gdg-selected":"gdg-unselected"),style:{backgroundColor:i?s.color:void 0}},s.tag))}))},onPaste:(t,e)=>({...e,tags:e.possibleTags.map(r=>r.tag).filter(r=>t.split(",").map(a=>a.trim()).includes(r))})},ma={kind:V.Custom,isMatch:t=>t.data.kind==="user-profile-cell",draw:(t,e)=>{const{ctx:r,rect:a,theme:n,imageLoader:o,col:l,row:s}=t,{image:i,name:u,initial:c,tint:d}=e.data,b=n.cellHorizontalPadding,p=Math.min(12,a.height/2-n.cellVerticalPadding),g=a.x+b,m=o.loadOrGetImage(i,l,s);r.save(),r.beginPath(),r.arc(g+p,a.y+a.height/2,p,0,Math.PI*2),r.globalAlpha=.2,r.fillStyle=d,r.fill(),r.globalAlpha=1,r.font=`600 16px ${n.fontFamily}`;const v=ge(c[0],r);return r.fillText(c[0],g+p-v.width/2,a.y+a.height/2+ie(r,`600 16px ${n.fontFamily}`)),m!==void 0&&(r.save(),r.beginPath(),r.arc(g+p,a.y+a.height/2,p,0,Math.PI*2),r.clip(),r.drawImage(m,g,a.y+a.height/2-p,p*2,p*2),r.restore()),u!==void 0&&(r.font=n.baseFontFull,r.fillStyle=n.textDark,r.fillText(u,g+p*2+b,a.y+a.height/2+ie(r,n))),r.restore(),!0},provideEditor:()=>t=>{const{isHighlighted:e,onChange:r,value:a}=t;return f.createElement(Ft,{highlight:e,autoFocus:!0,value:a.data.name??"",disabled:a.readonly??!1,onChange:n=>r({...a,data:{...a.data,name:n.target.value}})})},onPaste:(t,e)=>({...e,name:t})};function rn(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter(function(n){return Object.getOwnPropertyDescriptor(t,n).enumerable})),r.push.apply(r,a)}return r}function E(t){for(var e=1;e<arguments.length;e++){var r=arguments[e]!=null?arguments[e]:{};e%2?rn(Object(r),!0).forEach(function(a){ke(t,a,r[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):rn(Object(r)).forEach(function(a){Object.defineProperty(t,a,Object.getOwnPropertyDescriptor(r,a))})}return t}function ha(t){if(Array.isArray(t))return t}function va(t,e){var r=t==null?null:typeof Symbol<"u"&&t[Symbol.iterator]||t["@@iterator"];if(r!=null){var a,n,o,l,s=[],i=!0,u=!1;try{if(o=(r=r.call(t)).next,e===0){if(Object(r)!==r)return;i=!1}else for(;!(i=(a=o.call(r)).done)&&(s.push(a.value),s.length!==e);i=!0);}catch(c){u=!0,n=c}finally{try{if(!i&&r.return!=null&&(l=r.return(),Object(l)!==l))return}finally{if(u)throw n}}return s}}function ga(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function de(t,e){return ha(t)||va(t,e)||ea(t,e)||ga()}var ba=["defaultInputValue","defaultMenuIsOpen","defaultValue","inputValue","menuIsOpen","onChange","onInputChange","onMenuClose","onMenuOpen","value"];function Un(t){var e=t.defaultInputValue,r=e===void 0?"":e,a=t.defaultMenuIsOpen,n=a===void 0?!1:a,o=t.defaultValue,l=o===void 0?null:o,s=t.inputValue,i=t.menuIsOpen,u=t.onChange,c=t.onInputChange,d=t.onMenuClose,b=t.onMenuOpen,p=t.value,g=le(t,ba),m=f.useState(s!==void 0?s:r),v=de(m,2),h=v[0],C=v[1],S=f.useState(i!==void 0?i:n),x=de(S,2),k=x[0],P=x[1],w=f.useState(p!==void 0?p:l),y=de(w,2),O=y[0],I=y[1],$=f.useCallback(function(Q,pe){typeof u=="function"&&u(Q,pe),I(Q)},[u]),F=f.useCallback(function(Q,pe){var me;typeof c=="function"&&(me=c(Q,pe)),C(me!==void 0?me:Q)},[c]),X=f.useCallback(function(){typeof b=="function"&&b(),P(!0)},[b]),J=f.useCallback(function(){typeof d=="function"&&d(),P(!1)},[d]),A=s!==void 0?s:h,N=i!==void 0?i:k,ne=p!==void 0?p:O;return E(E({},g),{},{inputValue:A,menuIsOpen:N,onChange:$,onInputChange:F,onMenuClose:J,onMenuOpen:X,value:ne})}function ya(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function an(t,e){for(var r=0;r<e.length;r++){var a=e[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,ta(a.key),a)}}function Ca(t,e,r){return e&&an(t.prototype,e),r&&an(t,r),Object.defineProperty(t,"prototype",{writable:!1}),t}function Et(t,e){return Et=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(r,a){return r.__proto__=a,r},Et(t,e)}function wa(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&Et(t,e)}function Ge(t){return Ge=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},Ge(t)}function Gn(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}))}catch{}return(Gn=function(){return!!t})()}function Sa(t){if(t===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function xa(t,e){if(e&&(Wn(e)=="object"||typeof e=="function"))return e;if(e!==void 0)throw new TypeError("Derived constructors may only return object or undefined");return Sa(t)}function Oa(t){var e=Gn();return function(){var r,a=Ge(t);if(e){var n=Ge(this).constructor;r=Reflect.construct(a,arguments,n)}else r=a.apply(this,arguments);return xa(this,r)}}function ka(t){if(t.sheet)return t.sheet;for(var e=0;e<document.styleSheets.length;e++)if(document.styleSheets[e].ownerNode===t)return document.styleSheets[e]}function Pa(t){var e=document.createElement("style");return e.setAttribute("data-emotion",t.key),t.nonce!==void 0&&e.setAttribute("nonce",t.nonce),e.appendChild(document.createTextNode("")),e.setAttribute("data-s",""),e}var Ma=function(){function t(r){var a=this;this._insertTag=function(n){var o;a.tags.length===0?a.insertionPoint?o=a.insertionPoint.nextSibling:a.prepend?o=a.container.firstChild:o=a.before:o=a.tags[a.tags.length-1].nextSibling,a.container.insertBefore(n,o),a.tags.push(n)},this.isSpeedy=r.speedy===void 0?!0:r.speedy,this.tags=[],this.ctr=0,this.nonce=r.nonce,this.key=r.key,this.container=r.container,this.prepend=r.prepend,this.insertionPoint=r.insertionPoint,this.before=null}var e=t.prototype;return e.hydrate=function(a){a.forEach(this._insertTag)},e.insert=function(a){this.ctr%(this.isSpeedy?65e3:1)===0&&this._insertTag(Pa(this));var n=this.tags[this.tags.length-1];if(this.isSpeedy){var o=ka(n);try{o.insertRule(a,o.cssRules.length)}catch{}}else n.appendChild(document.createTextNode(a));this.ctr++},e.flush=function(){this.tags.forEach(function(a){var n;return(n=a.parentNode)==null?void 0:n.removeChild(a)}),this.tags=[],this.ctr=0},t}(),G="-ms-",je="-moz-",T="-webkit-",jn="comm",$t="rule",At="decl",Ea="@import",Kn="@keyframes",Da="@layer",Ia=Math.abs,et=String.fromCharCode,Va=Object.assign;function Ta(t,e){return U(t,0)^45?(((e<<2^U(t,0))<<2^U(t,1))<<2^U(t,2))<<2^U(t,3):0}function Xn(t){return t.trim()}function La(t,e){return(t=e.exec(t))?t[0]:t}function L(t,e,r){return t.replace(e,r)}function Dt(t,e){return t.indexOf(e)}function U(t,e){return t.charCodeAt(e)|0}function Ie(t,e,r){return t.slice(e,r)}function re(t){return t.length}function Ht(t){return t.length}function $e(t,e){return e.push(t),t}function Ra(t,e){return t.map(e).join("")}var tt=1,we=1,Yn=0,K=0,z=0,Se="";function nt(t,e,r,a,n,o,l){return{value:t,root:e,parent:r,type:a,props:n,children:o,line:tt,column:we,length:l,return:""}}function xe(t,e){return Va(nt("",null,null,"",null,null,0),t,{length:-t.length},e)}function Fa(){return z}function $a(){return z=K>0?U(Se,--K):0,we--,z===10&&(we=1,tt--),z}function q(){return z=K<Yn?U(Se,K++):0,we++,z===10&&(we=1,tt++),z}function oe(){return U(Se,K)}function ze(){return K}function Le(t,e){return Ie(Se,t,e)}function Ve(t){switch(t){case 0:case 9:case 10:case 13:case 32:return 5;case 33:case 43:case 44:case 47:case 62:case 64:case 126:case 59:case 123:case 125:return 4;case 58:return 3;case 34:case 39:case 40:case 91:return 2;case 41:case 93:return 1}return 0}function qn(t){return tt=we=1,Yn=re(Se=t),K=0,[]}function Zn(t){return Se="",t}function _e(t){return Xn(Le(K-1,It(t===91?t+2:t===40?t+1:t)))}function Aa(t){for(;(z=oe())&&z<33;)q();return Ve(t)>2||Ve(z)>3?"":" "}function Ha(t,e){for(;--e&&q()&&!(z<48||z>102||z>57&&z<65||z>70&&z<97););return Le(t,ze()+(e<6&&oe()==32&&q()==32))}function It(t){for(;q();)switch(z){case t:return K;case 34:case 39:t!==34&&t!==39&&It(z);break;case 40:t===41&&It(t);break;case 92:q();break}return K}function Na(t,e){for(;q()&&t+z!==57;)if(t+z===84&&oe()===47)break;return"/*"+Le(e,K-1)+"*"+et(t===47?t:q())}function za(t){for(;!Ve(oe());)q();return Le(t,K)}function _a(t){return Zn(Be("",null,null,null,[""],t=qn(t),0,[0],t))}function Be(t,e,r,a,n,o,l,s,i){for(var u=0,c=0,d=l,b=0,p=0,g=0,m=1,v=1,h=1,C=0,S="",x=n,k=o,P=a,w=S;v;)switch(g=C,C=q()){case 40:if(g!=108&&U(w,d-1)==58){Dt(w+=L(_e(C),"&","&\f"),"&\f")!=-1&&(h=-1);break}case 34:case 39:case 91:w+=_e(C);break;case 9:case 10:case 13:case 32:w+=Aa(g);break;case 92:w+=Ha(ze()-1,7);continue;case 47:switch(oe()){case 42:case 47:$e(Ba(Na(q(),ze()),e,r),i);break;default:w+="/"}break;case 123*m:s[u++]=re(w)*h;case 125*m:case 59:case 0:switch(C){case 0:case 125:v=0;case 59+c:h==-1&&(w=L(w,/\f/g,"")),p>0&&re(w)-d&&$e(p>32?ln(w+";",a,r,d-1):ln(L(w," ","")+";",a,r,d-2),i);break;case 59:w+=";";default:if($e(P=on(w,e,r,u,c,n,s,S,x=[],k=[],d),o),C===123)if(c===0)Be(w,e,P,P,x,o,d,s,k);else switch(b===99&&U(w,3)===110?100:b){case 100:case 108:case 109:case 115:Be(t,P,P,a&&$e(on(t,P,P,0,0,n,s,S,n,x=[],d),k),n,k,d,s,a?x:k);break;default:Be(w,P,P,P,[""],k,0,s,k)}}u=c=p=0,m=h=1,S=w="",d=l;break;case 58:d=1+re(w),p=g;default:if(m<1){if(C==123)--m;else if(C==125&&m++==0&&$a()==125)continue}switch(w+=et(C),C*m){case 38:h=c>0?1:(w+="\f",-1);break;case 44:s[u++]=(re(w)-1)*h,h=1;break;case 64:oe()===45&&(w+=_e(q())),b=oe(),c=d=re(S=w+=za(ze())),C++;break;case 45:g===45&&re(w)==2&&(m=0)}}return o}function on(t,e,r,a,n,o,l,s,i,u,c){for(var d=n-1,b=n===0?o:[""],p=Ht(b),g=0,m=0,v=0;g<a;++g)for(var h=0,C=Ie(t,d+1,d=Ia(m=l[g])),S=t;h<p;++h)(S=Xn(m>0?b[h]+" "+C:L(C,/&\f/g,b[h])))&&(i[v++]=S);return nt(t,e,r,n===0?$t:s,i,u,c)}function Ba(t,e,r){return nt(t,e,r,jn,et(Fa()),Ie(t,2,-2),0)}function ln(t,e,r,a){return nt(t,e,r,At,Ie(t,0,a),Ie(t,a+1,-1),a)}function Ce(t,e){for(var r="",a=Ht(t),n=0;n<a;n++)r+=e(t[n],n,t,e)||"";return r}function Wa(t,e,r,a){switch(t.type){case Da:if(t.children.length)break;case Ea:case At:return t.return=t.return||t.value;case jn:return"";case Kn:return t.return=t.value+"{"+Ce(t.children,a)+"}";case $t:t.value=t.props.join(",")}return re(r=Ce(t.children,a))?t.return=t.value+"{"+r+"}":""}function Ua(t){var e=Ht(t);return function(r,a,n,o){for(var l="",s=0;s<e;s++)l+=t[s](r,a,n,o)||"";return l}}function Ga(t){return function(e){e.root||(e=e.return)&&t(e)}}var ja=function(e,r,a){for(var n=0,o=0;n=o,o=oe(),n===38&&o===12&&(r[a]=1),!Ve(o);)q();return Le(e,K)},Ka=function(e,r){var a=-1,n=44;do switch(Ve(n)){case 0:n===38&&oe()===12&&(r[a]=1),e[a]+=ja(K-1,r,a);break;case 2:e[a]+=_e(n);break;case 4:if(n===44){e[++a]=oe()===58?"&\f":"",r[a]=e[a].length;break}default:e[a]+=et(n)}while(n=q());return e},Xa=function(e,r){return Zn(Ka(qn(e),r))},sn=new WeakMap,Ya=function(e){if(!(e.type!=="rule"||!e.parent||e.length<1)){for(var r=e.value,a=e.parent,n=e.column===a.column&&e.line===a.line;a.type!=="rule";)if(a=a.parent,!a)return;if(!(e.props.length===1&&r.charCodeAt(0)!==58&&!sn.get(a))&&!n){sn.set(e,!0);for(var o=[],l=Xa(r,o),s=a.props,i=0,u=0;i<l.length;i++)for(var c=0;c<s.length;c++,u++)e.props[u]=o[i]?l[i].replace(/&\f/g,s[c]):s[c]+" "+l[i]}}},qa=function(e){if(e.type==="decl"){var r=e.value;r.charCodeAt(0)===108&&r.charCodeAt(2)===98&&(e.return="",e.value="")}};function Jn(t,e){switch(Ta(t,e)){case 5103:return T+"print-"+t+t;case 5737:case 4201:case 3177:case 3433:case 1641:case 4457:case 2921:case 5572:case 6356:case 5844:case 3191:case 6645:case 3005:case 6391:case 5879:case 5623:case 6135:case 4599:case 4855:case 4215:case 6389:case 5109:case 5365:case 5621:case 3829:return T+t+t;case 5349:case 4246:case 4810:case 6968:case 2756:return T+t+je+t+G+t+t;case 6828:case 4268:return T+t+G+t+t;case 6165:return T+t+G+"flex-"+t+t;case 5187:return T+t+L(t,/(\w+).+(:[^]+)/,T+"box-$1$2"+G+"flex-$1$2")+t;case 5443:return T+t+G+"flex-item-"+L(t,/flex-|-self/,"")+t;case 4675:return T+t+G+"flex-line-pack"+L(t,/align-content|flex-|-self/,"")+t;case 5548:return T+t+G+L(t,"shrink","negative")+t;case 5292:return T+t+G+L(t,"basis","preferred-size")+t;case 6060:return T+"box-"+L(t,"-grow","")+T+t+G+L(t,"grow","positive")+t;case 4554:return T+L(t,/([^-])(transform)/g,"$1"+T+"$2")+t;case 6187:return L(L(L(t,/(zoom-|grab)/,T+"$1"),/(image-set)/,T+"$1"),t,"")+t;case 5495:case 3959:return L(t,/(image-set\([^]*)/,T+"$1$`$1");case 4968:return L(L(t,/(.+:)(flex-)?(.*)/,T+"box-pack:$3"+G+"flex-pack:$3"),/s.+-b[^;]+/,"justify")+T+t+t;case 4095:case 3583:case 4068:case 2532:return L(t,/(.+)-inline(.+)/,T+"$1$2")+t;case 8116:case 7059:case 5753:case 5535:case 5445:case 5701:case 4933:case 4677:case 5533:case 5789:case 5021:case 4765:if(re(t)-1-e>6)switch(U(t,e+1)){case 109:if(U(t,e+4)!==45)break;case 102:return L(t,/(.+:)(.+)-([^]+)/,"$1"+T+"$2-$3$1"+je+(U(t,e+3)==108?"$3":"$2-$3"))+t;case 115:return~Dt(t,"stretch")?Jn(L(t,"stretch","fill-available"),e)+t:t}break;case 4949:if(U(t,e+1)!==115)break;case 6444:switch(U(t,re(t)-3-(~Dt(t,"!important")&&10))){case 107:return L(t,":",":"+T)+t;case 101:return L(t,/(.+:)([^;!]+)(;|!.+)?/,"$1"+T+(U(t,14)===45?"inline-":"")+"box$3$1"+T+"$2$3$1"+G+"$2box$3")+t}break;case 5936:switch(U(t,e+11)){case 114:return T+t+G+L(t,/[svh]\w+-[tblr]{2}/,"tb")+t;case 108:return T+t+G+L(t,/[svh]\w+-[tblr]{2}/,"tb-rl")+t;case 45:return T+t+G+L(t,/[svh]\w+-[tblr]{2}/,"lr")+t}return T+t+G+t+t}return t}var Za=function(e,r,a,n){if(e.length>-1&&!e.return)switch(e.type){case At:e.return=Jn(e.value,e.length);break;case Kn:return Ce([xe(e,{value:L(e.value,"@","@"+T)})],n);case $t:if(e.length)return Ra(e.props,function(o){switch(La(o,/(::plac\w+|:read-\w+)/)){case":read-only":case":read-write":return Ce([xe(e,{props:[L(o,/:(read-\w+)/,":"+je+"$1")]})],n);case"::placeholder":return Ce([xe(e,{props:[L(o,/:(plac\w+)/,":"+T+"input-$1")]}),xe(e,{props:[L(o,/:(plac\w+)/,":"+je+"$1")]}),xe(e,{props:[L(o,/:(plac\w+)/,G+"input-$1")]})],n)}return""})}},Ja=[Za],Qa=function(e){var r=e.key;if(r==="css"){var a=document.querySelectorAll("style[data-emotion]:not([data-s])");Array.prototype.forEach.call(a,function(m){var v=m.getAttribute("data-emotion");v.indexOf(" ")!==-1&&(document.head.appendChild(m),m.setAttribute("data-s",""))})}var n=e.stylisPlugins||Ja,o={},l,s=[];l=e.container||document.head,Array.prototype.forEach.call(document.querySelectorAll('style[data-emotion^="'+r+' "]'),function(m){for(var v=m.getAttribute("data-emotion").split(" "),h=1;h<v.length;h++)o[v[h]]=!0;s.push(m)});var i,u=[Ya,qa];{var c,d=[Wa,Ga(function(m){c.insert(m)})],b=Ua(u.concat(n,d)),p=function(v){return Ce(_a(v),b)};i=function(v,h,C,S){c=C,p(v?v+"{"+h.styles+"}":h.styles),S&&(g.inserted[h.name]=!0)}}var g={key:r,sheet:new Ma({key:r,container:l,nonce:e.nonce,speedy:e.speedy,prepend:e.prepend,insertionPoint:e.insertionPoint}),nonce:e.nonce,inserted:o,registered:{},insert:i};return g.sheet.hydrate(s),g},Qn={exports:{}},R={};/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var W=typeof Symbol=="function"&&Symbol.for,Nt=W?Symbol.for("react.element"):60103,zt=W?Symbol.for("react.portal"):60106,rt=W?Symbol.for("react.fragment"):60107,at=W?Symbol.for("react.strict_mode"):60108,ot=W?Symbol.for("react.profiler"):60114,it=W?Symbol.for("react.provider"):60109,lt=W?Symbol.for("react.context"):60110,_t=W?Symbol.for("react.async_mode"):60111,st=W?Symbol.for("react.concurrent_mode"):60111,ut=W?Symbol.for("react.forward_ref"):60112,ct=W?Symbol.for("react.suspense"):60113,eo=W?Symbol.for("react.suspense_list"):60120,dt=W?Symbol.for("react.memo"):60115,ft=W?Symbol.for("react.lazy"):60116,to=W?Symbol.for("react.block"):60121,no=W?Symbol.for("react.fundamental"):60117,ro=W?Symbol.for("react.responder"):60118,ao=W?Symbol.for("react.scope"):60119;function Z(t){if(typeof t=="object"&&t!==null){var e=t.$$typeof;switch(e){case Nt:switch(t=t.type,t){case _t:case st:case rt:case ot:case at:case ct:return t;default:switch(t=t&&t.$$typeof,t){case lt:case ut:case ft:case dt:case it:return t;default:return e}}case zt:return e}}}function er(t){return Z(t)===st}R.AsyncMode=_t;R.ConcurrentMode=st;R.ContextConsumer=lt;R.ContextProvider=it;R.Element=Nt;R.ForwardRef=ut;R.Fragment=rt;R.Lazy=ft;R.Memo=dt;R.Portal=zt;R.Profiler=ot;R.StrictMode=at;R.Suspense=ct;R.isAsyncMode=function(t){return er(t)||Z(t)===_t};R.isConcurrentMode=er;R.isContextConsumer=function(t){return Z(t)===lt};R.isContextProvider=function(t){return Z(t)===it};R.isElement=function(t){return typeof t=="object"&&t!==null&&t.$$typeof===Nt};R.isForwardRef=function(t){return Z(t)===ut};R.isFragment=function(t){return Z(t)===rt};R.isLazy=function(t){return Z(t)===ft};R.isMemo=function(t){return Z(t)===dt};R.isPortal=function(t){return Z(t)===zt};R.isProfiler=function(t){return Z(t)===ot};R.isStrictMode=function(t){return Z(t)===at};R.isSuspense=function(t){return Z(t)===ct};R.isValidElementType=function(t){return typeof t=="string"||typeof t=="function"||t===rt||t===st||t===ot||t===at||t===ct||t===eo||typeof t=="object"&&t!==null&&(t.$$typeof===ft||t.$$typeof===dt||t.$$typeof===it||t.$$typeof===lt||t.$$typeof===ut||t.$$typeof===no||t.$$typeof===ro||t.$$typeof===ao||t.$$typeof===to)};R.typeOf=Z;Qn.exports=R;var oo=Qn.exports,tr=oo,io={$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0},lo={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},nr={};nr[tr.ForwardRef]=io;nr[tr.Memo]=lo;var so=!0;function uo(t,e,r){var a="";return r.split(" ").forEach(function(n){t[n]!==void 0?e.push(t[n]+";"):n&&(a+=n+" ")}),a}var rr=function(e,r,a){var n=e.key+"-"+r.name;(a===!1||so===!1)&&e.registered[n]===void 0&&(e.registered[n]=r.styles)},co=function(e,r,a){rr(e,r,a);var n=e.key+"-"+r.name;if(e.inserted[r.name]===void 0){var o=r;do e.insert(r===o?"."+n:"",o,e.sheet,!0),o=o.next;while(o!==void 0)}};function fo(t){for(var e=0,r,a=0,n=t.length;n>=4;++a,n-=4)r=t.charCodeAt(a)&255|(t.charCodeAt(++a)&255)<<8|(t.charCodeAt(++a)&255)<<16|(t.charCodeAt(++a)&255)<<24,r=(r&65535)*1540483477+((r>>>16)*59797<<16),r^=r>>>24,e=(r&65535)*1540483477+((r>>>16)*59797<<16)^(e&65535)*1540483477+((e>>>16)*59797<<16);switch(n){case 3:e^=(t.charCodeAt(a+2)&255)<<16;case 2:e^=(t.charCodeAt(a+1)&255)<<8;case 1:e^=t.charCodeAt(a)&255,e=(e&65535)*1540483477+((e>>>16)*59797<<16)}return e^=e>>>13,e=(e&65535)*1540483477+((e>>>16)*59797<<16),((e^e>>>15)>>>0).toString(36)}var po={animationIterationCount:1,aspectRatio:1,borderImageOutset:1,borderImageSlice:1,borderImageWidth:1,boxFlex:1,boxFlexGroup:1,boxOrdinalGroup:1,columnCount:1,columns:1,flex:1,flexGrow:1,flexPositive:1,flexShrink:1,flexNegative:1,flexOrder:1,gridRow:1,gridRowEnd:1,gridRowSpan:1,gridRowStart:1,gridColumn:1,gridColumnEnd:1,gridColumnSpan:1,gridColumnStart:1,msGridRow:1,msGridRowSpan:1,msGridColumn:1,msGridColumnSpan:1,fontWeight:1,lineHeight:1,opacity:1,order:1,orphans:1,scale:1,tabSize:1,widows:1,zIndex:1,zoom:1,WebkitLineClamp:1,fillOpacity:1,floodOpacity:1,stopOpacity:1,strokeDasharray:1,strokeDashoffset:1,strokeMiterlimit:1,strokeOpacity:1,strokeWidth:1},mo=/[A-Z]|^ms/g,ho=/_EMO_([^_]+?)_([^]*?)_EMO_/g,ar=function(e){return e.charCodeAt(1)===45},un=function(e){return e!=null&&typeof e!="boolean"},vt=Kr(function(t){return ar(t)?t:t.replace(mo,"-$&").toLowerCase()}),cn=function(e,r){switch(e){case"animation":case"animationName":if(typeof r=="string")return r.replace(ho,function(a,n,o){return ae={name:n,styles:o,next:ae},n})}return po[e]!==1&&!ar(e)&&typeof r=="number"&&r!==0?r+"px":r};function Te(t,e,r){if(r==null)return"";var a=r;if(a.__emotion_styles!==void 0)return a;switch(typeof r){case"boolean":return"";case"object":{var n=r;if(n.anim===1)return ae={name:n.name,styles:n.styles,next:ae},n.name;var o=r;if(o.styles!==void 0){var l=o.next;if(l!==void 0)for(;l!==void 0;)ae={name:l.name,styles:l.styles,next:ae},l=l.next;var s=o.styles+";";return s}return vo(t,e,r)}case"function":{if(t!==void 0){var i=ae,u=r(t);return ae=i,Te(t,e,u)}break}}var c=r;return c}function vo(t,e,r){var a="";if(Array.isArray(r))for(var n=0;n<r.length;n++)a+=Te(t,e,r[n])+";";else for(var o in r){var l=r[o];if(typeof l!="object"){var s=l;un(s)&&(a+=vt(o)+":"+cn(o,s)+";")}else if(Array.isArray(l)&&typeof l[0]=="string"&&e==null)for(var i=0;i<l.length;i++)un(l[i])&&(a+=vt(o)+":"+cn(o,l[i])+";");else{var u=Te(t,e,l);switch(o){case"animation":case"animationName":{a+=vt(o)+":"+u+";";break}default:a+=o+"{"+u+"}"}}}return a}var dn=/label:\s*([^\s;{]+)\s*(;|$)/g,ae;function or(t,e,r){if(t.length===1&&typeof t[0]=="object"&&t[0]!==null&&t[0].styles!==void 0)return t[0];var a=!0,n="";ae=void 0;var o=t[0];if(o==null||o.raw===void 0)a=!1,n+=Te(r,e,o);else{var l=o;n+=l[0]}for(var s=1;s<t.length;s++)if(n+=Te(r,e,t[s]),a){var i=o;n+=i[s]}dn.lastIndex=0;for(var u="",c;(c=dn.exec(n))!==null;)u+="-"+c[1];var d=fo(n)+u;return{name:d,styles:n,next:ae}}var go=function(e){return e()},bo=tn.useInsertionEffect?tn.useInsertionEffect:!1,yo=bo||go,ir=f.createContext(typeof HTMLElement<"u"?Qa({key:"css"}):null);ir.Provider;var Co=function(e){return f.forwardRef(function(r,a){var n=f.useContext(ir);return e(r,n,a)})},wo=f.createContext({}),Bt={}.hasOwnProperty,Vt="__EMOTION_TYPE_PLEASE_DO_NOT_USE__",So=function(e,r){var a={};for(var n in r)Bt.call(r,n)&&(a[n]=r[n]);return a[Vt]=e,a},xo=function(e){var r=e.cache,a=e.serialized,n=e.isStringTag;return rr(r,a,n),yo(function(){return co(r,a,n)}),null},Oo=Co(function(t,e,r){var a=t.css;typeof a=="string"&&e.registered[a]!==void 0&&(a=e.registered[a]);var n=t[Vt],o=[a],l="";typeof t.className=="string"?l=uo(e.registered,o,t.className):t.className!=null&&(l=t.className+" ");var s=or(o,void 0,f.useContext(wo));l+=e.key+"-"+s.name;var i={};for(var u in t)Bt.call(t,u)&&u!=="css"&&u!==Vt&&(i[u]=t[u]);return i.className=l,r&&(i.ref=r),f.createElement(f.Fragment,null,f.createElement(xo,{cache:e,serialized:s,isStringTag:typeof n=="string"}),f.createElement(n,i))}),ko=Oo,M=function(e,r){var a=arguments;if(r==null||!Bt.call(r,"css"))return f.createElement.apply(void 0,a);var n=a.length,o=new Array(n);o[0]=ko,o[1]=So(e,r);for(var l=2;l<n;l++)o[l]=a[l];return f.createElement.apply(null,o)};(function(t){var e;e||(e=t.JSX||(t.JSX={}))})(M||(M={}));function Wt(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];return or(e)}function Po(){var t=Wt.apply(void 0,arguments),e="animation-"+t.name;return{name:e,styles:"@keyframes "+e+"{"+t.styles+"}",anim:1,toString:function(){return"_EMO_"+this.name+"_"+this.styles+"_EMO_"}}}function Mo(t,e){return e||(e=t.slice(0)),Object.freeze(Object.defineProperties(t,{raw:{value:Object.freeze(e)}}))}const Eo=Math.min,Do=Math.max,Ke=Math.round,Ae=Math.floor,Xe=t=>({x:t,y:t});function Io(t){const{x:e,y:r,width:a,height:n}=t;return{width:a,height:n,top:r,left:e,right:e+a,bottom:r+n,x:e,y:r}}function pt(){return typeof window<"u"}function lr(t){return ur(t)?(t.nodeName||"").toLowerCase():"#document"}function fe(t){var e;return(t==null||(e=t.ownerDocument)==null?void 0:e.defaultView)||window}function sr(t){var e;return(e=(ur(t)?t.ownerDocument:t.document)||window.document)==null?void 0:e.documentElement}function ur(t){return pt()?t instanceof Node||t instanceof fe(t).Node:!1}function Vo(t){return pt()?t instanceof Element||t instanceof fe(t).Element:!1}function Ut(t){return pt()?t instanceof HTMLElement||t instanceof fe(t).HTMLElement:!1}function fn(t){return!pt()||typeof ShadowRoot>"u"?!1:t instanceof ShadowRoot||t instanceof fe(t).ShadowRoot}const To=new Set(["inline","contents"]);function cr(t){const{overflow:e,overflowX:r,overflowY:a,display:n}=Gt(t);return/auto|scroll|overlay|hidden|clip/.test(e+a+r)&&!To.has(n)}function Lo(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}const Ro=new Set(["html","body","#document"]);function Fo(t){return Ro.has(lr(t))}function Gt(t){return fe(t).getComputedStyle(t)}function $o(t){if(lr(t)==="html")return t;const e=t.assignedSlot||t.parentNode||fn(t)&&t.host||sr(t);return fn(e)?e.host:e}function dr(t){const e=$o(t);return Fo(e)?t.ownerDocument?t.ownerDocument.body:t.body:Ut(e)&&cr(e)?e:dr(e)}function Ye(t,e,r){var a;e===void 0&&(e=[]),r===void 0&&(r=!0);const n=dr(t),o=n===((a=t.ownerDocument)==null?void 0:a.body),l=fe(n);if(o){const s=Tt(l);return e.concat(l,l.visualViewport||[],cr(n)?n:[],s&&r?Ye(s):[])}return e.concat(n,Ye(n,[],r))}function Tt(t){return t.parent&&Object.getPrototypeOf(t.parent)?t.frameElement:null}function Ao(t){const e=Gt(t);let r=parseFloat(e.width)||0,a=parseFloat(e.height)||0;const n=Ut(t),o=n?t.offsetWidth:r,l=n?t.offsetHeight:a,s=Ke(r)!==o||Ke(a)!==l;return s&&(r=o,a=l),{width:r,height:a,$:s}}function jt(t){return Vo(t)?t:t.contextElement}function pn(t){const e=jt(t);if(!Ut(e))return Xe(1);const r=e.getBoundingClientRect(),{width:a,height:n,$:o}=Ao(e);let l=(o?Ke(r.width):r.width)/a,s=(o?Ke(r.height):r.height)/n;return(!l||!Number.isFinite(l))&&(l=1),(!s||!Number.isFinite(s))&&(s=1),{x:l,y:s}}const Ho=Xe(0);function No(t){const e=fe(t);return!Lo()||!e.visualViewport?Ho:{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}}function zo(t,e,r){return!1}function mn(t,e,r,a){e===void 0&&(e=!1);const n=t.getBoundingClientRect(),o=jt(t);let l=Xe(1);e&&(l=pn(t));const s=zo()?No(o):Xe(0);let i=(n.left+s.x)/l.x,u=(n.top+s.y)/l.y,c=n.width/l.x,d=n.height/l.y;if(o){const b=fe(o),p=a;let g=b,m=Tt(g);for(;m&&a&&p!==g;){const v=pn(m),h=m.getBoundingClientRect(),C=Gt(m),S=h.left+(m.clientLeft+parseFloat(C.paddingLeft))*v.x,x=h.top+(m.clientTop+parseFloat(C.paddingTop))*v.y;i*=v.x,u*=v.y,c*=v.x,d*=v.y,i+=S,u+=x,g=fe(m),m=Tt(g)}}return Io({width:c,height:d,x:i,y:u})}function fr(t,e){return t.x===e.x&&t.y===e.y&&t.width===e.width&&t.height===e.height}function _o(t,e){let r=null,a;const n=sr(t);function o(){var s;clearTimeout(a),(s=r)==null||s.disconnect(),r=null}function l(s,i){s===void 0&&(s=!1),i===void 0&&(i=1),o();const u=t.getBoundingClientRect(),{left:c,top:d,width:b,height:p}=u;if(s||e(),!b||!p)return;const g=Ae(d),m=Ae(n.clientWidth-(c+b)),v=Ae(n.clientHeight-(d+p)),h=Ae(c),S={rootMargin:-g+"px "+-m+"px "+-v+"px "+-h+"px",threshold:Do(0,Eo(1,i))||1};let x=!0;function k(P){const w=P[0].intersectionRatio;if(w!==i){if(!x)return l();w?l(!1,w):a=setTimeout(()=>{l(!1,1e-7)},1e3)}w===1&&!fr(u,t.getBoundingClientRect())&&l(),x=!1}try{r=new IntersectionObserver(k,{...S,root:n.ownerDocument})}catch{r=new IntersectionObserver(k,S)}r.observe(t)}return l(!0),o}function Bo(t,e,r,a){a===void 0&&(a={});const{ancestorScroll:n=!0,ancestorResize:o=!0,elementResize:l=typeof ResizeObserver=="function",layoutShift:s=typeof IntersectionObserver=="function",animationFrame:i=!1}=a,u=jt(t),c=n||o?[...u?Ye(u):[],...Ye(e)]:[];c.forEach(h=>{n&&h.addEventListener("scroll",r,{passive:!0}),o&&h.addEventListener("resize",r)});const d=u&&s?_o(u,r):null;let b=-1,p=null;l&&(p=new ResizeObserver(h=>{let[C]=h;C&&C.target===u&&p&&(p.unobserve(e),cancelAnimationFrame(b),b=requestAnimationFrame(()=>{var S;(S=p)==null||S.observe(e)})),r()}),u&&!i&&p.observe(u),p.observe(e));let g,m=i?mn(t):null;i&&v();function v(){const h=mn(t);m&&!fr(m,h)&&r(),m=h,g=requestAnimationFrame(v)}return r(),()=>{var h;c.forEach(C=>{n&&C.removeEventListener("scroll",r),o&&C.removeEventListener("resize",r)}),d==null||d(),(h=p)==null||h.disconnect(),p=null,i&&cancelAnimationFrame(g)}}var Lt=f.useLayoutEffect,Wo=["className","clearValue","cx","getStyles","getClassNames","getValue","hasValue","isMulti","isRtl","options","selectOption","selectProps","setValue","theme"],qe=function(){};function Uo(t,e){return e?e[0]==="-"?t+e:t+"__"+e:t}function Go(t,e){for(var r=arguments.length,a=new Array(r>2?r-2:0),n=2;n<r;n++)a[n-2]=arguments[n];var o=[].concat(a);if(e&&t)for(var l in e)e.hasOwnProperty(l)&&e[l]&&o.push("".concat(Uo(t,l)));return o.filter(function(s){return s}).map(function(s){return String(s).trim()}).join(" ")}var Ze=function(e){return ei(e)?e.filter(Boolean):Wn(e)==="object"&&e!==null?[e]:[]},pr=function(e){e.className,e.clearValue,e.cx,e.getStyles,e.getClassNames,e.getValue,e.hasValue,e.isMulti,e.isRtl,e.options,e.selectOption,e.selectProps,e.setValue,e.theme;var r=le(e,Wo);return E({},r)},H=function(e,r,a){var n=e.cx,o=e.getStyles,l=e.getClassNames,s=e.className;return{css:o(r,e),className:n(a??{},l(r,e),s)}};function mt(t){return[document.documentElement,document.body,window].indexOf(t)>-1}function jo(t){return mt(t)?window.innerHeight:t.clientHeight}function mr(t){return mt(t)?window.pageYOffset:t.scrollTop}function Je(t,e){if(mt(t)){window.scrollTo(0,e);return}t.scrollTop=e}function Ko(t){var e=getComputedStyle(t),r=e.position==="absolute",a=/(auto|scroll)/;if(e.position==="fixed")return document.documentElement;for(var n=t;n=n.parentElement;)if(e=getComputedStyle(n),!(r&&e.position==="static")&&a.test(e.overflow+e.overflowY+e.overflowX))return n;return document.documentElement}function Xo(t,e,r,a){return r*((t=t/a-1)*t*t+1)+e}function He(t,e){var r=arguments.length>2&&arguments[2]!==void 0?arguments[2]:200,a=arguments.length>3&&arguments[3]!==void 0?arguments[3]:qe,n=mr(t),o=e-n,l=10,s=0;function i(){s+=l;var u=Xo(s,n,o,r);Je(t,u),s<r?window.requestAnimationFrame(i):a(t)}i()}function hn(t,e){var r=t.getBoundingClientRect(),a=e.getBoundingClientRect(),n=e.offsetHeight/3;a.bottom+n>r.bottom?Je(t,Math.min(e.offsetTop+e.clientHeight-t.offsetHeight+n,t.scrollHeight)):a.top-n<r.top&&Je(t,Math.max(e.offsetTop-n,0))}function Yo(t){var e=t.getBoundingClientRect();return{bottom:e.bottom,height:e.height,left:e.left,right:e.right,top:e.top,width:e.width}}function vn(){try{return document.createEvent("TouchEvent"),!0}catch{return!1}}function qo(){try{return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)}catch{return!1}}var hr=!1,Zo={get passive(){return hr=!0}},Ne=typeof window<"u"?window:{};Ne.addEventListener&&Ne.removeEventListener&&(Ne.addEventListener("p",qe,Zo),Ne.removeEventListener("p",qe,!1));var Jo=hr;function Qo(t){return t!=null}function ei(t){return Array.isArray(t)}function Pe(t,e,r){return t?e:r}var ti=function(e){for(var r=arguments.length,a=new Array(r>1?r-1:0),n=1;n<r;n++)a[n-1]=arguments[n];var o=Object.entries(e).filter(function(l){var s=de(l,1),i=s[0];return!a.includes(i)});return o.reduce(function(l,s){var i=de(s,2),u=i[0],c=i[1];return l[u]=c,l},{})},ni=["children","innerProps"],ri=["children","innerProps"];function ai(t){var e=t.maxHeight,r=t.menuEl,a=t.minHeight,n=t.placement,o=t.shouldScroll,l=t.isFixedPosition,s=t.controlHeight,i=Ko(r),u={placement:"bottom",maxHeight:e};if(!r||!r.offsetParent)return u;var c=i.getBoundingClientRect(),d=c.height,b=r.getBoundingClientRect(),p=b.bottom,g=b.height,m=b.top,v=r.offsetParent.getBoundingClientRect(),h=v.top,C=l?window.innerHeight:jo(i),S=mr(i),x=parseInt(getComputedStyle(r).marginBottom,10),k=parseInt(getComputedStyle(r).marginTop,10),P=h-k,w=C-m,y=P+S,O=d-S-m,I=p-C+S+x,$=S+m-k,F=160;switch(n){case"auto":case"bottom":if(w>=g)return{placement:"bottom",maxHeight:e};if(O>=g&&!l)return o&&He(i,I,F),{placement:"bottom",maxHeight:e};if(!l&&O>=a||l&&w>=a){o&&He(i,I,F);var X=l?w-x:O-x;return{placement:"bottom",maxHeight:X}}if(n==="auto"||l){var J=e,A=l?P:y;return A>=a&&(J=Math.min(A-x-s,e)),{placement:"top",maxHeight:J}}if(n==="bottom")return o&&Je(i,I),{placement:"bottom",maxHeight:e};break;case"top":if(P>=g)return{placement:"top",maxHeight:e};if(y>=g&&!l)return o&&He(i,$,F),{placement:"top",maxHeight:e};if(!l&&y>=a||l&&P>=a){var N=e;return(!l&&y>=a||l&&P>=a)&&(N=l?P-k:y-k),o&&He(i,$,F),{placement:"top",maxHeight:N}}return{placement:"bottom",maxHeight:e};default:throw new Error('Invalid placement provided "'.concat(n,'".'))}return u}function oi(t){var e={bottom:"top",top:"bottom"};return t?e[t]:"bottom"}var vr=function(e){return e==="auto"?"bottom":e},ii=function(e,r){var a,n=e.placement,o=e.theme,l=o.borderRadius,s=o.spacing,i=o.colors;return E((a={label:"menu"},ke(a,oi(n),"100%"),ke(a,"position","absolute"),ke(a,"width","100%"),ke(a,"zIndex",1),a),r?{}:{backgroundColor:i.neutral0,borderRadius:l,boxShadow:"0 0 0 1px hsla(0, 0%, 0%, 0.1), 0 4px 11px hsla(0, 0%, 0%, 0.1)",marginBottom:s.menuGutter,marginTop:s.menuGutter})},gr=f.createContext(null),li=function(e){var r=e.children,a=e.minMenuHeight,n=e.maxMenuHeight,o=e.menuPlacement,l=e.menuPosition,s=e.menuShouldScrollIntoView,i=e.theme,u=f.useContext(gr)||{},c=u.setPortalPlacement,d=f.useRef(null),b=f.useState(n),p=de(b,2),g=p[0],m=p[1],v=f.useState(null),h=de(v,2),C=h[0],S=h[1],x=i.spacing.controlHeight;return Lt(function(){var k=d.current;if(k){var P=l==="fixed",w=s&&!P,y=ai({maxHeight:n,menuEl:k,minHeight:a,placement:o,shouldScroll:w,isFixedPosition:P,controlHeight:x});m(y.maxHeight),S(y.placement),c==null||c(y.placement)}},[n,o,l,s,a,c,x]),r({ref:d,placerProps:E(E({},e),{},{placement:C||vr(o),maxHeight:g})})},si=function(e){var r=e.children,a=e.innerRef,n=e.innerProps;return M("div",D({},H(e,"menu",{menu:!0}),{ref:a},n),r)},ui=si,ci=function(e,r){var a=e.maxHeight,n=e.theme.spacing.baseUnit;return E({maxHeight:a,overflowY:"auto",position:"relative",WebkitOverflowScrolling:"touch"},r?{}:{paddingBottom:n,paddingTop:n})},di=function(e){var r=e.children,a=e.innerProps,n=e.innerRef,o=e.isMulti;return M("div",D({},H(e,"menuList",{"menu-list":!0,"menu-list--is-multi":o}),{ref:n},a),r)},br=function(e,r){var a=e.theme,n=a.spacing.baseUnit,o=a.colors;return E({textAlign:"center"},r?{}:{color:o.neutral40,padding:"".concat(n*2,"px ").concat(n*3,"px")})},fi=br,pi=br,mi=function(e){var r=e.children,a=r===void 0?"No options":r,n=e.innerProps,o=le(e,ni);return M("div",D({},H(E(E({},o),{},{children:a,innerProps:n}),"noOptionsMessage",{"menu-notice":!0,"menu-notice--no-options":!0}),n),a)},hi=function(e){var r=e.children,a=r===void 0?"Loading...":r,n=e.innerProps,o=le(e,ri);return M("div",D({},H(E(E({},o),{},{children:a,innerProps:n}),"loadingMessage",{"menu-notice":!0,"menu-notice--loading":!0}),n),a)},vi=function(e){var r=e.rect,a=e.offset,n=e.position;return{left:r.left,position:n,top:a,width:r.width,zIndex:1}},gi=function(e){var r=e.appendTo,a=e.children,n=e.controlElement,o=e.innerProps,l=e.menuPlacement,s=e.menuPosition,i=f.useRef(null),u=f.useRef(null),c=f.useState(vr(l)),d=de(c,2),b=d[0],p=d[1],g=f.useMemo(function(){return{setPortalPlacement:p}},[]),m=f.useState(null),v=de(m,2),h=v[0],C=v[1],S=f.useCallback(function(){if(n){var w=Yo(n),y=s==="fixed"?0:window.pageYOffset,O=w[b]+y;(O!==(h==null?void 0:h.offset)||w.left!==(h==null?void 0:h.rect.left)||w.width!==(h==null?void 0:h.rect.width))&&C({offset:O,rect:w})}},[n,s,b,h==null?void 0:h.offset,h==null?void 0:h.rect.left,h==null?void 0:h.rect.width]);Lt(function(){S()},[S]);var x=f.useCallback(function(){typeof u.current=="function"&&(u.current(),u.current=null),n&&i.current&&(u.current=Bo(n,i.current,S,{elementResize:"ResizeObserver"in window}))},[n,S]);Lt(function(){x()},[x]);var k=f.useCallback(function(w){i.current=w,x()},[x]);if(!r&&s!=="fixed"||!h)return null;var P=M("div",D({ref:k},H(E(E({},e),{},{offset:h.offset,position:s,rect:h.rect}),"menuPortal",{"menu-portal":!0}),o),a);return M(gr.Provider,{value:g},r?na.createPortal(P,r):P)},bi=function(e){var r=e.isDisabled,a=e.isRtl;return{label:"container",direction:a?"rtl":void 0,pointerEvents:r?"none":void 0,position:"relative"}},yi=function(e){var r=e.children,a=e.innerProps,n=e.isDisabled,o=e.isRtl;return M("div",D({},H(e,"container",{"--is-disabled":n,"--is-rtl":o}),a),r)},Ci=function(e,r){var a=e.theme.spacing,n=e.isMulti,o=e.hasValue,l=e.selectProps.controlShouldRenderValue;return E({alignItems:"center",display:n&&o&&l?"flex":"grid",flex:1,flexWrap:"wrap",WebkitOverflowScrolling:"touch",position:"relative",overflow:"hidden"},r?{}:{padding:"".concat(a.baseUnit/2,"px ").concat(a.baseUnit*2,"px")})},wi=function(e){var r=e.children,a=e.innerProps,n=e.isMulti,o=e.hasValue;return M("div",D({},H(e,"valueContainer",{"value-container":!0,"value-container--is-multi":n,"value-container--has-value":o}),a),r)},Si=function(){return{alignItems:"center",alignSelf:"stretch",display:"flex",flexShrink:0}},xi=function(e){var r=e.children,a=e.innerProps;return M("div",D({},H(e,"indicatorsContainer",{indicators:!0}),a),r)},gn,Oi=["size"],ki=["innerProps","isRtl","size"],Pi={name:"8mmkcg",styles:"display:inline-block;fill:currentColor;line-height:1;stroke:currentColor;stroke-width:0"},yr=function(e){var r=e.size,a=le(e,Oi);return M("svg",D({height:r,width:r,viewBox:"0 0 20 20","aria-hidden":"true",focusable:"false",css:Pi},a))},Kt=function(e){return M(yr,D({size:20},e),M("path",{d:"M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"}))},Cr=function(e){return M(yr,D({size:20},e),M("path",{d:"M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"}))},wr=function(e,r){var a=e.isFocused,n=e.theme,o=n.spacing.baseUnit,l=n.colors;return E({label:"indicatorContainer",display:"flex",transition:"color 150ms"},r?{}:{color:a?l.neutral60:l.neutral20,padding:o*2,":hover":{color:a?l.neutral80:l.neutral40}})},Mi=wr,Ei=function(e){var r=e.children,a=e.innerProps;return M("div",D({},H(e,"dropdownIndicator",{indicator:!0,"dropdown-indicator":!0}),a),r||M(Cr,null))},Di=wr,Ii=function(e){var r=e.children,a=e.innerProps;return M("div",D({},H(e,"clearIndicator",{indicator:!0,"clear-indicator":!0}),a),r||M(Kt,null))},Vi=function(e,r){var a=e.isDisabled,n=e.theme,o=n.spacing.baseUnit,l=n.colors;return E({label:"indicatorSeparator",alignSelf:"stretch",width:1},r?{}:{backgroundColor:a?l.neutral10:l.neutral20,marginBottom:o*2,marginTop:o*2})},Ti=function(e){var r=e.innerProps;return M("span",D({},r,H(e,"indicatorSeparator",{"indicator-separator":!0})))},Li=Po(gn||(gn=Mo([`
  0%, 80%, 100% { opacity: 0; }
  40% { opacity: 1; }
`]))),Ri=function(e,r){var a=e.isFocused,n=e.size,o=e.theme,l=o.colors,s=o.spacing.baseUnit;return E({label:"loadingIndicator",display:"flex",transition:"color 150ms",alignSelf:"center",fontSize:n,lineHeight:1,marginRight:n,textAlign:"center",verticalAlign:"middle"},r?{}:{color:a?l.neutral60:l.neutral20,padding:s*2})},gt=function(e){var r=e.delay,a=e.offset;return M("span",{css:Wt({animation:"".concat(Li," 1s ease-in-out ").concat(r,"ms infinite;"),backgroundColor:"currentColor",borderRadius:"1em",display:"inline-block",marginLeft:a?"1em":void 0,height:"1em",verticalAlign:"top",width:"1em"},"","")})},Fi=function(e){var r=e.innerProps,a=e.isRtl,n=e.size,o=n===void 0?4:n,l=le(e,ki);return M("div",D({},H(E(E({},l),{},{innerProps:r,isRtl:a,size:o}),"loadingIndicator",{indicator:!0,"loading-indicator":!0}),r),M(gt,{delay:0,offset:a}),M(gt,{delay:160,offset:!0}),M(gt,{delay:320,offset:!a}))},$i=function(e,r){var a=e.isDisabled,n=e.isFocused,o=e.theme,l=o.colors,s=o.borderRadius,i=o.spacing;return E({label:"control",alignItems:"center",cursor:"default",display:"flex",flexWrap:"wrap",justifyContent:"space-between",minHeight:i.controlHeight,outline:"0 !important",position:"relative",transition:"all 100ms"},r?{}:{backgroundColor:a?l.neutral5:l.neutral0,borderColor:a?l.neutral10:n?l.primary:l.neutral20,borderRadius:s,borderStyle:"solid",borderWidth:1,boxShadow:n?"0 0 0 1px ".concat(l.primary):void 0,"&:hover":{borderColor:n?l.primary:l.neutral30}})},Ai=function(e){var r=e.children,a=e.isDisabled,n=e.isFocused,o=e.innerRef,l=e.innerProps,s=e.menuIsOpen;return M("div",D({ref:o},H(e,"control",{control:!0,"control--is-disabled":a,"control--is-focused":n,"control--menu-is-open":s}),l,{"aria-disabled":a||void 0}),r)},Hi=Ai,Ni=["data"],zi=function(e,r){var a=e.theme.spacing;return r?{}:{paddingBottom:a.baseUnit*2,paddingTop:a.baseUnit*2}},_i=function(e){var r=e.children,a=e.cx,n=e.getStyles,o=e.getClassNames,l=e.Heading,s=e.headingProps,i=e.innerProps,u=e.label,c=e.theme,d=e.selectProps;return M("div",D({},H(e,"group",{group:!0}),i),M(l,D({},s,{selectProps:d,theme:c,getStyles:n,getClassNames:o,cx:a}),u),M("div",null,r))},Bi=function(e,r){var a=e.theme,n=a.colors,o=a.spacing;return E({label:"group",cursor:"default",display:"block"},r?{}:{color:n.neutral40,fontSize:"75%",fontWeight:500,marginBottom:"0.25em",paddingLeft:o.baseUnit*3,paddingRight:o.baseUnit*3,textTransform:"uppercase"})},Wi=function(e){var r=pr(e);r.data;var a=le(r,Ni);return M("div",D({},H(e,"groupHeading",{"group-heading":!0}),a))},Ui=_i,Gi=["innerRef","isDisabled","isHidden","inputClassName"],ji=function(e,r){var a=e.isDisabled,n=e.value,o=e.theme,l=o.spacing,s=o.colors;return E(E({visibility:a?"hidden":"visible",transform:n?"translateZ(0)":""},Ki),r?{}:{margin:l.baseUnit/2,paddingBottom:l.baseUnit/2,paddingTop:l.baseUnit/2,color:s.neutral80})},Sr={gridArea:"1 / 2",font:"inherit",minWidth:"2px",border:0,margin:0,outline:0,padding:0},Ki={flex:"1 1 auto",display:"inline-grid",gridArea:"1 / 1 / 2 / 3",gridTemplateColumns:"0 min-content","&:after":E({content:'attr(data-value) " "',visibility:"hidden",whiteSpace:"pre"},Sr)},Xi=function(e){return E({label:"input",color:"inherit",background:0,opacity:e?0:1,width:"100%"},Sr)},Yi=function(e){var r=e.cx,a=e.value,n=pr(e),o=n.innerRef,l=n.isDisabled,s=n.isHidden,i=n.inputClassName,u=le(n,Gi);return M("div",D({},H(e,"input",{"input-container":!0}),{"data-value":a||""}),M("input",D({className:r({input:!0},i),ref:o,style:Xi(s),disabled:l},u)))},qi=Yi,Zi=function(e,r){var a=e.theme,n=a.spacing,o=a.borderRadius,l=a.colors;return E({label:"multiValue",display:"flex",minWidth:0},r?{}:{backgroundColor:l.neutral10,borderRadius:o/2,margin:n.baseUnit/2})},Ji=function(e,r){var a=e.theme,n=a.borderRadius,o=a.colors,l=e.cropWithEllipsis;return E({overflow:"hidden",textOverflow:l||l===void 0?"ellipsis":void 0,whiteSpace:"nowrap"},r?{}:{borderRadius:n/2,color:o.neutral80,fontSize:"85%",padding:3,paddingLeft:6})},Qi=function(e,r){var a=e.theme,n=a.spacing,o=a.borderRadius,l=a.colors,s=e.isFocused;return E({alignItems:"center",display:"flex"},r?{}:{borderRadius:o/2,backgroundColor:s?l.dangerLight:void 0,paddingLeft:n.baseUnit,paddingRight:n.baseUnit,":hover":{backgroundColor:l.dangerLight,color:l.danger}})},xr=function(e){var r=e.children,a=e.innerProps;return M("div",a,r)},el=xr,tl=xr;function nl(t){var e=t.children,r=t.innerProps;return M("div",D({role:"button"},r),e||M(Kt,{size:14}))}var rl=function(e){var r=e.children,a=e.components,n=e.data,o=e.innerProps,l=e.isDisabled,s=e.removeProps,i=e.selectProps,u=a.Container,c=a.Label,d=a.Remove;return M(u,{data:n,innerProps:E(E({},H(e,"multiValue",{"multi-value":!0,"multi-value--is-disabled":l})),o),selectProps:i},M(c,{data:n,innerProps:E({},H(e,"multiValueLabel",{"multi-value__label":!0})),selectProps:i},r),M(d,{data:n,innerProps:E(E({},H(e,"multiValueRemove",{"multi-value__remove":!0})),{},{"aria-label":"Remove ".concat(r||"option")},s),selectProps:i}))},al=rl,ol=function(e,r){var a=e.isDisabled,n=e.isFocused,o=e.isSelected,l=e.theme,s=l.spacing,i=l.colors;return E({label:"option",cursor:"default",display:"block",fontSize:"inherit",width:"100%",userSelect:"none",WebkitTapHighlightColor:"rgba(0, 0, 0, 0)"},r?{}:{backgroundColor:o?i.primary:n?i.primary25:"transparent",color:a?i.neutral20:o?i.neutral0:"inherit",padding:"".concat(s.baseUnit*2,"px ").concat(s.baseUnit*3,"px"),":active":{backgroundColor:a?void 0:o?i.primary:i.primary50}})},il=function(e){var r=e.children,a=e.isDisabled,n=e.isFocused,o=e.isSelected,l=e.innerRef,s=e.innerProps;return M("div",D({},H(e,"option",{option:!0,"option--is-disabled":a,"option--is-focused":n,"option--is-selected":o}),{ref:l,"aria-disabled":a},s),r)},ll=il,sl=function(e,r){var a=e.theme,n=a.spacing,o=a.colors;return E({label:"placeholder",gridArea:"1 / 1 / 2 / 3"},r?{}:{color:o.neutral50,marginLeft:n.baseUnit/2,marginRight:n.baseUnit/2})},ul=function(e){var r=e.children,a=e.innerProps;return M("div",D({},H(e,"placeholder",{placeholder:!0}),a),r)},cl=ul,dl=function(e,r){var a=e.isDisabled,n=e.theme,o=n.spacing,l=n.colors;return E({label:"singleValue",gridArea:"1 / 1 / 2 / 3",maxWidth:"100%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},r?{}:{color:a?l.neutral40:l.neutral80,marginLeft:o.baseUnit/2,marginRight:o.baseUnit/2})},fl=function(e){var r=e.children,a=e.isDisabled,n=e.innerProps;return M("div",D({},H(e,"singleValue",{"single-value":!0,"single-value--is-disabled":a}),n),r)},pl=fl,Xt={ClearIndicator:Ii,Control:Hi,DropdownIndicator:Ei,DownChevron:Cr,CrossIcon:Kt,Group:Ui,GroupHeading:Wi,IndicatorsContainer:xi,IndicatorSeparator:Ti,Input:qi,LoadingIndicator:Fi,Menu:ui,MenuList:di,MenuPortal:gi,LoadingMessage:hi,NoOptionsMessage:mi,MultiValue:al,MultiValueContainer:el,MultiValueLabel:tl,MultiValueRemove:nl,Option:ll,Placeholder:cl,SelectContainer:yi,SingleValue:pl,ValueContainer:wi},ml=function(e){return E(E({},Xt),e.components)},bn=Number.isNaN||function(e){return typeof e=="number"&&e!==e};function hl(t,e){return!!(t===e||bn(t)&&bn(e))}function vl(t,e){if(t.length!==e.length)return!1;for(var r=0;r<t.length;r++)if(!hl(t[r],e[r]))return!1;return!0}function gl(t,e){e===void 0&&(e=vl);var r=null;function a(){for(var n=[],o=0;o<arguments.length;o++)n[o]=arguments[o];if(r&&r.lastThis===this&&e(n,r.lastArgs))return r.lastResult;var l=t.apply(this,n);return r={lastResult:l,lastArgs:n,lastThis:this},l}return a.clear=function(){r=null},a}var bl={name:"7pg0cj-a11yText",styles:"label:a11yText;z-index:9999;border:0;clip:rect(1px, 1px, 1px, 1px);height:1px;width:1px;position:absolute;overflow:hidden;padding:0;white-space:nowrap"},yl=function(e){return M("span",D({css:bl},e))},yn=yl,Cl={guidance:function(e){var r=e.isSearchable,a=e.isMulti,n=e.tabSelectsValue,o=e.context,l=e.isInitialFocus;switch(o){case"menu":return"Use Up and Down to choose options, press Enter to select the currently focused option, press Escape to exit the menu".concat(n?", press Tab to select the option and exit the menu":"",".");case"input":return l?"".concat(e["aria-label"]||"Select"," is focused ").concat(r?",type to refine list":"",", press Down to open the menu, ").concat(a?" press left to focus selected values":""):"";case"value":return"Use left and right to toggle between focused values, press Backspace to remove the currently focused value";default:return""}},onChange:function(e){var r=e.action,a=e.label,n=a===void 0?"":a,o=e.labels,l=e.isDisabled;switch(r){case"deselect-option":case"pop-value":case"remove-value":return"option ".concat(n,", deselected.");case"clear":return"All selected options have been cleared.";case"initial-input-focus":return"option".concat(o.length>1?"s":""," ").concat(o.join(","),", selected.");case"select-option":return l?"option ".concat(n," is disabled. Select another option."):"option ".concat(n,", selected.");default:return""}},onFocus:function(e){var r=e.context,a=e.focused,n=e.options,o=e.label,l=o===void 0?"":o,s=e.selectValue,i=e.isDisabled,u=e.isSelected,c=e.isAppleDevice,d=function(m,v){return m&&m.length?"".concat(m.indexOf(v)+1," of ").concat(m.length):""};if(r==="value"&&s)return"value ".concat(l," focused, ").concat(d(s,a),".");if(r==="menu"&&c){var b=i?" disabled":"",p="".concat(u?" selected":"").concat(b);return"".concat(l).concat(p,", ").concat(d(n,a),".")}return""},onFilter:function(e){var r=e.inputValue,a=e.resultsMessage;return"".concat(a).concat(r?" for search term "+r:"",".")}},wl=function(e){var r=e.ariaSelection,a=e.focusedOption,n=e.focusedValue,o=e.focusableOptions,l=e.isFocused,s=e.selectValue,i=e.selectProps,u=e.id,c=e.isAppleDevice,d=i.ariaLiveMessages,b=i.getOptionLabel,p=i.inputValue,g=i.isMulti,m=i.isOptionDisabled,v=i.isSearchable,h=i.menuIsOpen,C=i.options,S=i.screenReaderStatus,x=i.tabSelectsValue,k=i.isLoading,P=i["aria-label"],w=i["aria-live"],y=f.useMemo(function(){return E(E({},Cl),d||{})},[d]),O=f.useMemo(function(){var A="";if(r&&y.onChange){var N=r.option,ne=r.options,Q=r.removedValue,pe=r.removedValues,me=r.value,Re=function(ue){return Array.isArray(ue)?null:ue},_=Q||N||Re(me),Y=_?b(_):"",se=ne||pe||void 0,he=se?se.map(b):[],te=E({isDisabled:_&&m(_,s),label:Y,labels:he},r);A=y.onChange(te)}return A},[r,y,m,s,b]),I=f.useMemo(function(){var A="",N=a||n,ne=!!(a&&s&&s.includes(a));if(N&&y.onFocus){var Q={focused:N,label:b(N),isDisabled:m(N,s),isSelected:ne,options:o,context:N===a?"menu":"value",selectValue:s,isAppleDevice:c};A=y.onFocus(Q)}return A},[a,n,b,m,y,o,s,c]),$=f.useMemo(function(){var A="";if(h&&C.length&&!k&&y.onFilter){var N=S({count:o.length});A=y.onFilter({inputValue:p,resultsMessage:N})}return A},[o,p,h,y,C,S,k]),F=(r==null?void 0:r.action)==="initial-input-focus",X=f.useMemo(function(){var A="";if(y.guidance){var N=n?"value":h?"menu":"input";A=y.guidance({"aria-label":P,context:N,isDisabled:a&&m(a,s),isMulti:g,isSearchable:v,tabSelectsValue:x,isInitialFocus:F})}return A},[P,a,n,g,m,v,h,y,s,x,F]),J=M(f.Fragment,null,M("span",{id:"aria-selection"},O),M("span",{id:"aria-focused"},I),M("span",{id:"aria-results"},$),M("span",{id:"aria-guidance"},X));return M(f.Fragment,null,M(yn,{id:u},F&&J),M(yn,{"aria-live":w,"aria-atomic":"false","aria-relevant":"additions text",role:"log"},l&&!F&&J))},Sl=wl,Rt=[{base:"A",letters:"AⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ"},{base:"AA",letters:"Ꜳ"},{base:"AE",letters:"ÆǼǢ"},{base:"AO",letters:"Ꜵ"},{base:"AU",letters:"Ꜷ"},{base:"AV",letters:"ꜸꜺ"},{base:"AY",letters:"Ꜽ"},{base:"B",letters:"BⒷＢḂḄḆɃƂƁ"},{base:"C",letters:"CⒸＣĆĈĊČÇḈƇȻꜾ"},{base:"D",letters:"DⒹＤḊĎḌḐḒḎĐƋƊƉꝹ"},{base:"DZ",letters:"ǱǄ"},{base:"Dz",letters:"ǲǅ"},{base:"E",letters:"EⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎ"},{base:"F",letters:"FⒻＦḞƑꝻ"},{base:"G",letters:"GⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾ"},{base:"H",letters:"HⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ"},{base:"I",letters:"IⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ"},{base:"J",letters:"JⒿＪĴɈ"},{base:"K",letters:"KⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ"},{base:"L",letters:"LⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ"},{base:"LJ",letters:"Ǉ"},{base:"Lj",letters:"ǈ"},{base:"M",letters:"MⓂＭḾṀṂⱮƜ"},{base:"N",letters:"NⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤ"},{base:"NJ",letters:"Ǌ"},{base:"Nj",letters:"ǋ"},{base:"O",letters:"OⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ"},{base:"OI",letters:"Ƣ"},{base:"OO",letters:"Ꝏ"},{base:"OU",letters:"Ȣ"},{base:"P",letters:"PⓅＰṔṖƤⱣꝐꝒꝔ"},{base:"Q",letters:"QⓆＱꝖꝘɊ"},{base:"R",letters:"RⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ"},{base:"S",letters:"SⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ"},{base:"T",letters:"TⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ"},{base:"TZ",letters:"Ꜩ"},{base:"U",letters:"UⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ"},{base:"V",letters:"VⓋＶṼṾƲꝞɅ"},{base:"VY",letters:"Ꝡ"},{base:"W",letters:"WⓌＷẀẂŴẆẄẈⱲ"},{base:"X",letters:"XⓍＸẊẌ"},{base:"Y",letters:"YⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ"},{base:"Z",letters:"ZⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ"},{base:"a",letters:"aⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐ"},{base:"aa",letters:"ꜳ"},{base:"ae",letters:"æǽǣ"},{base:"ao",letters:"ꜵ"},{base:"au",letters:"ꜷ"},{base:"av",letters:"ꜹꜻ"},{base:"ay",letters:"ꜽ"},{base:"b",letters:"bⓑｂḃḅḇƀƃɓ"},{base:"c",letters:"cⓒｃćĉċčçḉƈȼꜿↄ"},{base:"d",letters:"dⓓｄḋďḍḑḓḏđƌɖɗꝺ"},{base:"dz",letters:"ǳǆ"},{base:"e",letters:"eⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ"},{base:"f",letters:"fⓕｆḟƒꝼ"},{base:"g",letters:"gⓖｇǵĝḡğġǧģǥɠꞡᵹꝿ"},{base:"h",letters:"hⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ"},{base:"hv",letters:"ƕ"},{base:"i",letters:"iⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı"},{base:"j",letters:"jⓙｊĵǰɉ"},{base:"k",letters:"kⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ"},{base:"l",letters:"lⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇ"},{base:"lj",letters:"ǉ"},{base:"m",letters:"mⓜｍḿṁṃɱɯ"},{base:"n",letters:"nⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥ"},{base:"nj",letters:"ǌ"},{base:"o",letters:"oⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵ"},{base:"oi",letters:"ƣ"},{base:"ou",letters:"ȣ"},{base:"oo",letters:"ꝏ"},{base:"p",letters:"pⓟｐṕṗƥᵽꝑꝓꝕ"},{base:"q",letters:"qⓠｑɋꝗꝙ"},{base:"r",letters:"rⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ"},{base:"s",letters:"sⓢｓßśṥŝṡšṧṣṩșşȿꞩꞅẛ"},{base:"t",letters:"tⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ"},{base:"tz",letters:"ꜩ"},{base:"u",letters:"uⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ"},{base:"v",letters:"vⓥｖṽṿʋꝟʌ"},{base:"vy",letters:"ꝡ"},{base:"w",letters:"wⓦｗẁẃŵẇẅẘẉⱳ"},{base:"x",letters:"xⓧｘẋẍ"},{base:"y",letters:"yⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ"},{base:"z",letters:"zⓩｚźẑżžẓẕƶȥɀⱬꝣ"}],xl=new RegExp("["+Rt.map(function(t){return t.letters}).join("")+"]","g"),Or={};for(var bt=0;bt<Rt.length;bt++)for(var yt=Rt[bt],Ct=0;Ct<yt.letters.length;Ct++)Or[yt.letters[Ct]]=yt.base;var kr=function(e){return e.replace(xl,function(r){return Or[r]})},Ol=gl(kr),Cn=function(e){return e.replace(/^\s+|\s+$/g,"")},kl=function(e){return"".concat(e.label," ").concat(e.value)},Pl=function(e){return function(r,a){if(r.data.__isNew__)return!0;var n=E({ignoreCase:!0,ignoreAccents:!0,stringify:kl,trim:!0,matchFrom:"any"},e),o=n.ignoreCase,l=n.ignoreAccents,s=n.stringify,i=n.trim,u=n.matchFrom,c=i?Cn(a):a,d=i?Cn(s(r)):s(r);return o&&(c=c.toLowerCase(),d=d.toLowerCase()),l&&(c=Ol(c),d=kr(d)),u==="start"?d.substr(0,c.length)===c:d.indexOf(c)>-1}},Ml=["innerRef"];function El(t){var e=t.innerRef,r=le(t,Ml),a=ti(r,"onExited","in","enter","exit","appear");return M("input",D({ref:e},a,{css:Wt({label:"dummyInput",background:0,border:0,caretColor:"transparent",fontSize:"inherit",gridArea:"1 / 1 / 2 / 3",outline:0,padding:0,width:1,color:"transparent",left:-100,opacity:0,position:"relative",transform:"scale(.01)"},"","")}))}var Dl=function(e){e.cancelable&&e.preventDefault(),e.stopPropagation()};function Il(t){var e=t.isEnabled,r=t.onBottomArrive,a=t.onBottomLeave,n=t.onTopArrive,o=t.onTopLeave,l=f.useRef(!1),s=f.useRef(!1),i=f.useRef(0),u=f.useRef(null),c=f.useCallback(function(v,h){if(u.current!==null){var C=u.current,S=C.scrollTop,x=C.scrollHeight,k=C.clientHeight,P=u.current,w=h>0,y=x-k-S,O=!1;y>h&&l.current&&(a&&a(v),l.current=!1),w&&s.current&&(o&&o(v),s.current=!1),w&&h>y?(r&&!l.current&&r(v),P.scrollTop=x,O=!0,l.current=!0):!w&&-h>S&&(n&&!s.current&&n(v),P.scrollTop=0,O=!0,s.current=!0),O&&Dl(v)}},[r,a,n,o]),d=f.useCallback(function(v){c(v,v.deltaY)},[c]),b=f.useCallback(function(v){i.current=v.changedTouches[0].clientY},[]),p=f.useCallback(function(v){var h=i.current-v.changedTouches[0].clientY;c(v,h)},[c]),g=f.useCallback(function(v){if(v){var h=Jo?{passive:!1}:!1;v.addEventListener("wheel",d,h),v.addEventListener("touchstart",b,h),v.addEventListener("touchmove",p,h)}},[p,b,d]),m=f.useCallback(function(v){v&&(v.removeEventListener("wheel",d,!1),v.removeEventListener("touchstart",b,!1),v.removeEventListener("touchmove",p,!1))},[p,b,d]);return f.useEffect(function(){if(e){var v=u.current;return g(v),function(){m(v)}}},[e,g,m]),function(v){u.current=v}}var wn=["boxSizing","height","overflow","paddingRight","position"],Sn={boxSizing:"border-box",overflow:"hidden",position:"relative",height:"100%"};function xn(t){t.cancelable&&t.preventDefault()}function On(t){t.stopPropagation()}function kn(){var t=this.scrollTop,e=this.scrollHeight,r=t+this.offsetHeight;t===0?this.scrollTop=1:r===e&&(this.scrollTop=t-1)}function Pn(){return"ontouchstart"in window||navigator.maxTouchPoints}var Mn=!!(typeof window<"u"&&window.document&&window.document.createElement),Oe=0,be={capture:!1,passive:!1};function Vl(t){var e=t.isEnabled,r=t.accountForScrollbars,a=r===void 0?!0:r,n=f.useRef({}),o=f.useRef(null),l=f.useCallback(function(i){if(Mn){var u=document.body,c=u&&u.style;if(a&&wn.forEach(function(g){var m=c&&c[g];n.current[g]=m}),a&&Oe<1){var d=parseInt(n.current.paddingRight,10)||0,b=document.body?document.body.clientWidth:0,p=window.innerWidth-b+d||0;Object.keys(Sn).forEach(function(g){var m=Sn[g];c&&(c[g]=m)}),c&&(c.paddingRight="".concat(p,"px"))}u&&Pn()&&(u.addEventListener("touchmove",xn,be),i&&(i.addEventListener("touchstart",kn,be),i.addEventListener("touchmove",On,be))),Oe+=1}},[a]),s=f.useCallback(function(i){if(Mn){var u=document.body,c=u&&u.style;Oe=Math.max(Oe-1,0),a&&Oe<1&&wn.forEach(function(d){var b=n.current[d];c&&(c[d]=b)}),u&&Pn()&&(u.removeEventListener("touchmove",xn,be),i&&(i.removeEventListener("touchstart",kn,be),i.removeEventListener("touchmove",On,be)))}},[a]);return f.useEffect(function(){if(e){var i=o.current;return l(i),function(){s(i)}}},[e,l,s]),function(i){o.current=i}}var Tl=function(e){var r=e.target;return r.ownerDocument.activeElement&&r.ownerDocument.activeElement.blur()},Ll={name:"1kfdb0e",styles:"position:fixed;left:0;bottom:0;right:0;top:0"};function Rl(t){var e=t.children,r=t.lockEnabled,a=t.captureEnabled,n=a===void 0?!0:a,o=t.onBottomArrive,l=t.onBottomLeave,s=t.onTopArrive,i=t.onTopLeave,u=Il({isEnabled:n,onBottomArrive:o,onBottomLeave:l,onTopArrive:s,onTopLeave:i}),c=Vl({isEnabled:r}),d=function(p){u(p),c(p)};return M(f.Fragment,null,r&&M("div",{onClick:Tl,css:Ll}),e(d))}var Fl={name:"1a0ro4n-requiredInput",styles:"label:requiredInput;opacity:0;pointer-events:none;position:absolute;bottom:0;left:0;right:0;width:100%"},$l=function(e){var r=e.name,a=e.onFocus;return M("input",{required:!0,name:r,tabIndex:-1,"aria-hidden":"true",onFocus:a,css:Fl,value:"",onChange:function(){}})},Al=$l;function Yt(t){var e;return typeof window<"u"&&window.navigator!=null?t.test(((e=window.navigator.userAgentData)===null||e===void 0?void 0:e.platform)||window.navigator.platform):!1}function Hl(){return Yt(/^iPhone/i)}function Pr(){return Yt(/^Mac/i)}function Nl(){return Yt(/^iPad/i)||Pr()&&navigator.maxTouchPoints>1}function zl(){return Hl()||Nl()}function _l(){return Pr()||zl()}var Bl=function(e){return e.label},Mr=function(e){return e.label},Er=function(e){return e.value},Wl=function(e){return!!e.isDisabled},Ul={clearIndicator:Di,container:bi,control:$i,dropdownIndicator:Mi,group:zi,groupHeading:Bi,indicatorsContainer:Si,indicatorSeparator:Vi,input:ji,loadingIndicator:Ri,loadingMessage:pi,menu:ii,menuList:ci,menuPortal:vi,multiValue:Zi,multiValueLabel:Ji,multiValueRemove:Qi,noOptionsMessage:fi,option:ol,placeholder:sl,singleValue:dl,valueContainer:Ci},Gl={primary:"#2684FF",primary75:"#4C9AFF",primary50:"#B2D4FF",primary25:"#DEEBFF",danger:"#DE350B",dangerLight:"#FFBDAD",neutral0:"hsl(0, 0%, 100%)",neutral5:"hsl(0, 0%, 95%)",neutral10:"hsl(0, 0%, 90%)",neutral20:"hsl(0, 0%, 80%)",neutral30:"hsl(0, 0%, 70%)",neutral40:"hsl(0, 0%, 60%)",neutral50:"hsl(0, 0%, 50%)",neutral60:"hsl(0, 0%, 40%)",neutral70:"hsl(0, 0%, 30%)",neutral80:"hsl(0, 0%, 20%)",neutral90:"hsl(0, 0%, 10%)"},jl=4,Dr=4,Kl=38,Xl=Dr*2,Yl={baseUnit:Dr,controlHeight:Kl,menuGutter:Xl},wt={borderRadius:jl,colors:Gl,spacing:Yl},ql={"aria-live":"polite",backspaceRemovesValue:!0,blurInputOnSelect:vn(),captureMenuScroll:!vn(),classNames:{},closeMenuOnSelect:!0,closeMenuOnScroll:!1,components:{},controlShouldRenderValue:!0,escapeClearsValue:!1,filterOption:Pl(),formatGroupLabel:Bl,getOptionLabel:Mr,getOptionValue:Er,isDisabled:!1,isLoading:!1,isMulti:!1,isRtl:!1,isSearchable:!0,isOptionDisabled:Wl,loadingMessage:function(){return"Loading..."},maxMenuHeight:300,minMenuHeight:140,menuIsOpen:!1,menuPlacement:"bottom",menuPosition:"absolute",menuShouldBlockScroll:!1,menuShouldScrollIntoView:!qo(),noOptionsMessage:function(){return"No options"},openMenuOnFocus:!1,openMenuOnClick:!0,options:[],pageSize:5,placeholder:"Select...",screenReaderStatus:function(e){var r=e.count;return"".concat(r," result").concat(r!==1?"s":""," available")},styles:{},tabIndex:0,tabSelectsValue:!0,unstyled:!1};function En(t,e,r,a){var n=Tr(t,e,r),o=Lr(t,e,r),l=Vr(t,e),s=Qe(t,e);return{type:"option",data:e,isDisabled:n,isSelected:o,label:l,value:s,index:a}}function We(t,e){return t.options.map(function(r,a){if("options"in r){var n=r.options.map(function(l,s){return En(t,l,e,s)}).filter(function(l){return In(t,l)});return n.length>0?{type:"group",data:r,options:n,index:a}:void 0}var o=En(t,r,e,a);return In(t,o)?o:void 0}).filter(Qo)}function Ir(t){return t.reduce(function(e,r){return r.type==="group"?e.push.apply(e,ye(r.options.map(function(a){return a.data}))):e.push(r.data),e},[])}function Dn(t,e){return t.reduce(function(r,a){return a.type==="group"?r.push.apply(r,ye(a.options.map(function(n){return{data:n.data,id:"".concat(e,"-").concat(a.index,"-").concat(n.index)}}))):r.push({data:a.data,id:"".concat(e,"-").concat(a.index)}),r},[])}function Zl(t,e){return Ir(We(t,e))}function In(t,e){var r=t.inputValue,a=r===void 0?"":r,n=e.data,o=e.isSelected,l=e.label,s=e.value;return(!Fr(t)||!o)&&Rr(t,{label:l,value:s,data:n},a)}function Jl(t,e){var r=t.focusedValue,a=t.selectValue,n=a.indexOf(r);if(n>-1){var o=e.indexOf(r);if(o>-1)return r;if(n<e.length)return e[n]}return null}function Ql(t,e){var r=t.focusedOption;return r&&e.indexOf(r)>-1?r:e[0]}var St=function(e,r){var a,n=(a=e.find(function(o){return o.data===r}))===null||a===void 0?void 0:a.id;return n||null},Vr=function(e,r){return e.getOptionLabel(r)},Qe=function(e,r){return e.getOptionValue(r)};function Tr(t,e,r){return typeof t.isOptionDisabled=="function"?t.isOptionDisabled(e,r):!1}function Lr(t,e,r){if(r.indexOf(e)>-1)return!0;if(typeof t.isOptionSelected=="function")return t.isOptionSelected(e,r);var a=Qe(t,e);return r.some(function(n){return Qe(t,n)===a})}function Rr(t,e,r){return t.filterOption?t.filterOption(e,r):!0}var Fr=function(e){var r=e.hideSelectedOptions,a=e.isMulti;return r===void 0?a:r},es=1,qt=function(t){wa(r,t);var e=Oa(r);function r(a){var n;if(ya(this,r),n=e.call(this,a),n.state={ariaSelection:null,focusedOption:null,focusedOptionId:null,focusableOptionsWithIds:[],focusedValue:null,inputIsHidden:!1,isFocused:!1,selectValue:[],clearFocusValueOnUpdate:!1,prevWasFocused:!1,inputIsHiddenAfterUpdate:void 0,prevProps:void 0,instancePrefix:"",isAppleDevice:!1},n.blockOptionHover=!1,n.isComposing=!1,n.commonProps=void 0,n.initialTouchX=0,n.initialTouchY=0,n.openAfterFocus=!1,n.scrollToFocusedOptionOnUpdate=!1,n.userIsDragging=void 0,n.controlRef=null,n.getControlRef=function(i){n.controlRef=i},n.focusedOptionRef=null,n.getFocusedOptionRef=function(i){n.focusedOptionRef=i},n.menuListRef=null,n.getMenuListRef=function(i){n.menuListRef=i},n.inputRef=null,n.getInputRef=function(i){n.inputRef=i},n.focus=n.focusInput,n.blur=n.blurInput,n.onChange=function(i,u){var c=n.props,d=c.onChange,b=c.name;u.name=b,n.ariaOnChange(i,u),d(i,u)},n.setValue=function(i,u,c){var d=n.props,b=d.closeMenuOnSelect,p=d.isMulti,g=d.inputValue;n.onInputChange("",{action:"set-value",prevInputValue:g}),b&&(n.setState({inputIsHiddenAfterUpdate:!p}),n.onMenuClose()),n.setState({clearFocusValueOnUpdate:!0}),n.onChange(i,{action:u,option:c})},n.selectOption=function(i){var u=n.props,c=u.blurInputOnSelect,d=u.isMulti,b=u.name,p=n.state.selectValue,g=d&&n.isOptionSelected(i,p),m=n.isOptionDisabled(i,p);if(g){var v=n.getOptionValue(i);n.setValue(p.filter(function(h){return n.getOptionValue(h)!==v}),"deselect-option",i)}else if(!m)d?n.setValue([].concat(ye(p),[i]),"select-option",i):n.setValue(i,"select-option");else{n.ariaOnChange(i,{action:"select-option",option:i,name:b});return}c&&n.blurInput()},n.removeValue=function(i){var u=n.props.isMulti,c=n.state.selectValue,d=n.getOptionValue(i),b=c.filter(function(g){return n.getOptionValue(g)!==d}),p=Pe(u,b,b[0]||null);n.onChange(p,{action:"remove-value",removedValue:i}),n.focusInput()},n.clearValue=function(){var i=n.state.selectValue;n.onChange(Pe(n.props.isMulti,[],null),{action:"clear",removedValues:i})},n.popValue=function(){var i=n.props.isMulti,u=n.state.selectValue,c=u[u.length-1],d=u.slice(0,u.length-1),b=Pe(i,d,d[0]||null);c&&n.onChange(b,{action:"pop-value",removedValue:c})},n.getFocusedOptionId=function(i){return St(n.state.focusableOptionsWithIds,i)},n.getFocusableOptionsWithIds=function(){return Dn(We(n.props,n.state.selectValue),n.getElementId("option"))},n.getValue=function(){return n.state.selectValue},n.cx=function(){for(var i=arguments.length,u=new Array(i),c=0;c<i;c++)u[c]=arguments[c];return Go.apply(void 0,[n.props.classNamePrefix].concat(u))},n.getOptionLabel=function(i){return Vr(n.props,i)},n.getOptionValue=function(i){return Qe(n.props,i)},n.getStyles=function(i,u){var c=n.props.unstyled,d=Ul[i](u,c);d.boxSizing="border-box";var b=n.props.styles[i];return b?b(d,u):d},n.getClassNames=function(i,u){var c,d;return(c=(d=n.props.classNames)[i])===null||c===void 0?void 0:c.call(d,u)},n.getElementId=function(i){return"".concat(n.state.instancePrefix,"-").concat(i)},n.getComponents=function(){return ml(n.props)},n.buildCategorizedOptions=function(){return We(n.props,n.state.selectValue)},n.getCategorizedOptions=function(){return n.props.menuIsOpen?n.buildCategorizedOptions():[]},n.buildFocusableOptions=function(){return Ir(n.buildCategorizedOptions())},n.getFocusableOptions=function(){return n.props.menuIsOpen?n.buildFocusableOptions():[]},n.ariaOnChange=function(i,u){n.setState({ariaSelection:E({value:i},u)})},n.onMenuMouseDown=function(i){i.button===0&&(i.stopPropagation(),i.preventDefault(),n.focusInput())},n.onMenuMouseMove=function(i){n.blockOptionHover=!1},n.onControlMouseDown=function(i){if(!i.defaultPrevented){var u=n.props.openMenuOnClick;n.state.isFocused?n.props.menuIsOpen?i.target.tagName!=="INPUT"&&i.target.tagName!=="TEXTAREA"&&n.onMenuClose():u&&n.openMenu("first"):(u&&(n.openAfterFocus=!0),n.focusInput()),i.target.tagName!=="INPUT"&&i.target.tagName!=="TEXTAREA"&&i.preventDefault()}},n.onDropdownIndicatorMouseDown=function(i){if(!(i&&i.type==="mousedown"&&i.button!==0)&&!n.props.isDisabled){var u=n.props,c=u.isMulti,d=u.menuIsOpen;n.focusInput(),d?(n.setState({inputIsHiddenAfterUpdate:!c}),n.onMenuClose()):n.openMenu("first"),i.preventDefault()}},n.onClearIndicatorMouseDown=function(i){i&&i.type==="mousedown"&&i.button!==0||(n.clearValue(),i.preventDefault(),n.openAfterFocus=!1,i.type==="touchend"?n.focusInput():setTimeout(function(){return n.focusInput()}))},n.onScroll=function(i){typeof n.props.closeMenuOnScroll=="boolean"?i.target instanceof HTMLElement&&mt(i.target)&&n.props.onMenuClose():typeof n.props.closeMenuOnScroll=="function"&&n.props.closeMenuOnScroll(i)&&n.props.onMenuClose()},n.onCompositionStart=function(){n.isComposing=!0},n.onCompositionEnd=function(){n.isComposing=!1},n.onTouchStart=function(i){var u=i.touches,c=u&&u.item(0);c&&(n.initialTouchX=c.clientX,n.initialTouchY=c.clientY,n.userIsDragging=!1)},n.onTouchMove=function(i){var u=i.touches,c=u&&u.item(0);if(c){var d=Math.abs(c.clientX-n.initialTouchX),b=Math.abs(c.clientY-n.initialTouchY),p=5;n.userIsDragging=d>p||b>p}},n.onTouchEnd=function(i){n.userIsDragging||(n.controlRef&&!n.controlRef.contains(i.target)&&n.menuListRef&&!n.menuListRef.contains(i.target)&&n.blurInput(),n.initialTouchX=0,n.initialTouchY=0)},n.onControlTouchEnd=function(i){n.userIsDragging||n.onControlMouseDown(i)},n.onClearIndicatorTouchEnd=function(i){n.userIsDragging||n.onClearIndicatorMouseDown(i)},n.onDropdownIndicatorTouchEnd=function(i){n.userIsDragging||n.onDropdownIndicatorMouseDown(i)},n.handleInputChange=function(i){var u=n.props.inputValue,c=i.currentTarget.value;n.setState({inputIsHiddenAfterUpdate:!1}),n.onInputChange(c,{action:"input-change",prevInputValue:u}),n.props.menuIsOpen||n.onMenuOpen()},n.onInputFocus=function(i){n.props.onFocus&&n.props.onFocus(i),n.setState({inputIsHiddenAfterUpdate:!1,isFocused:!0}),(n.openAfterFocus||n.props.openMenuOnFocus)&&n.openMenu("first"),n.openAfterFocus=!1},n.onInputBlur=function(i){var u=n.props.inputValue;if(n.menuListRef&&n.menuListRef.contains(document.activeElement)){n.inputRef.focus();return}n.props.onBlur&&n.props.onBlur(i),n.onInputChange("",{action:"input-blur",prevInputValue:u}),n.onMenuClose(),n.setState({focusedValue:null,isFocused:!1})},n.onOptionHover=function(i){if(!(n.blockOptionHover||n.state.focusedOption===i)){var u=n.getFocusableOptions(),c=u.indexOf(i);n.setState({focusedOption:i,focusedOptionId:c>-1?n.getFocusedOptionId(i):null})}},n.shouldHideSelectedOptions=function(){return Fr(n.props)},n.onValueInputFocus=function(i){i.preventDefault(),i.stopPropagation(),n.focus()},n.onKeyDown=function(i){var u=n.props,c=u.isMulti,d=u.backspaceRemovesValue,b=u.escapeClearsValue,p=u.inputValue,g=u.isClearable,m=u.isDisabled,v=u.menuIsOpen,h=u.onKeyDown,C=u.tabSelectsValue,S=u.openMenuOnFocus,x=n.state,k=x.focusedOption,P=x.focusedValue,w=x.selectValue;if(!m&&!(typeof h=="function"&&(h(i),i.defaultPrevented))){switch(n.blockOptionHover=!0,i.key){case"ArrowLeft":if(!c||p)return;n.focusValue("previous");break;case"ArrowRight":if(!c||p)return;n.focusValue("next");break;case"Delete":case"Backspace":if(p)return;if(P)n.removeValue(P);else{if(!d)return;c?n.popValue():g&&n.clearValue()}break;case"Tab":if(n.isComposing||i.shiftKey||!v||!C||!k||S&&n.isOptionSelected(k,w))return;n.selectOption(k);break;case"Enter":if(i.keyCode===229)break;if(v){if(!k||n.isComposing)return;n.selectOption(k);break}return;case"Escape":v?(n.setState({inputIsHiddenAfterUpdate:!1}),n.onInputChange("",{action:"menu-close",prevInputValue:p}),n.onMenuClose()):g&&b&&n.clearValue();break;case" ":if(p)return;if(!v){n.openMenu("first");break}if(!k)return;n.selectOption(k);break;case"ArrowUp":v?n.focusOption("up"):n.openMenu("last");break;case"ArrowDown":v?n.focusOption("down"):n.openMenu("first");break;case"PageUp":if(!v)return;n.focusOption("pageup");break;case"PageDown":if(!v)return;n.focusOption("pagedown");break;case"Home":if(!v)return;n.focusOption("first");break;case"End":if(!v)return;n.focusOption("last");break;default:return}i.preventDefault()}},n.state.instancePrefix="react-select-"+(n.props.instanceId||++es),n.state.selectValue=Ze(a.value),a.menuIsOpen&&n.state.selectValue.length){var o=n.getFocusableOptionsWithIds(),l=n.buildFocusableOptions(),s=l.indexOf(n.state.selectValue[0]);n.state.focusableOptionsWithIds=o,n.state.focusedOption=l[s],n.state.focusedOptionId=St(o,l[s])}return n}return Ca(r,[{key:"componentDidMount",value:function(){this.startListeningComposition(),this.startListeningToTouch(),this.props.closeMenuOnScroll&&document&&document.addEventListener&&document.addEventListener("scroll",this.onScroll,!0),this.props.autoFocus&&this.focusInput(),this.props.menuIsOpen&&this.state.focusedOption&&this.menuListRef&&this.focusedOptionRef&&hn(this.menuListRef,this.focusedOptionRef),_l()&&this.setState({isAppleDevice:!0})}},{key:"componentDidUpdate",value:function(n){var o=this.props,l=o.isDisabled,s=o.menuIsOpen,i=this.state.isFocused;(i&&!l&&n.isDisabled||i&&s&&!n.menuIsOpen)&&this.focusInput(),i&&l&&!n.isDisabled?this.setState({isFocused:!1},this.onMenuClose):!i&&!l&&n.isDisabled&&this.inputRef===document.activeElement&&this.setState({isFocused:!0}),this.menuListRef&&this.focusedOptionRef&&this.scrollToFocusedOptionOnUpdate&&(hn(this.menuListRef,this.focusedOptionRef),this.scrollToFocusedOptionOnUpdate=!1)}},{key:"componentWillUnmount",value:function(){this.stopListeningComposition(),this.stopListeningToTouch(),document.removeEventListener("scroll",this.onScroll,!0)}},{key:"onMenuOpen",value:function(){this.props.onMenuOpen()}},{key:"onMenuClose",value:function(){this.onInputChange("",{action:"menu-close",prevInputValue:this.props.inputValue}),this.props.onMenuClose()}},{key:"onInputChange",value:function(n,o){this.props.onInputChange(n,o)}},{key:"focusInput",value:function(){this.inputRef&&this.inputRef.focus()}},{key:"blurInput",value:function(){this.inputRef&&this.inputRef.blur()}},{key:"openMenu",value:function(n){var o=this,l=this.state,s=l.selectValue,i=l.isFocused,u=this.buildFocusableOptions(),c=n==="first"?0:u.length-1;if(!this.props.isMulti){var d=u.indexOf(s[0]);d>-1&&(c=d)}this.scrollToFocusedOptionOnUpdate=!(i&&this.menuListRef),this.setState({inputIsHiddenAfterUpdate:!1,focusedValue:null,focusedOption:u[c],focusedOptionId:this.getFocusedOptionId(u[c])},function(){return o.onMenuOpen()})}},{key:"focusValue",value:function(n){var o=this.state,l=o.selectValue,s=o.focusedValue;if(this.props.isMulti){this.setState({focusedOption:null});var i=l.indexOf(s);s||(i=-1);var u=l.length-1,c=-1;if(l.length){switch(n){case"previous":i===0?c=0:i===-1?c=u:c=i-1;break;case"next":i>-1&&i<u&&(c=i+1);break}this.setState({inputIsHidden:c!==-1,focusedValue:l[c]})}}}},{key:"focusOption",value:function(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:"first",o=this.props.pageSize,l=this.state.focusedOption,s=this.getFocusableOptions();if(s.length){var i=0,u=s.indexOf(l);l||(u=-1),n==="up"?i=u>0?u-1:s.length-1:n==="down"?i=(u+1)%s.length:n==="pageup"?(i=u-o,i<0&&(i=0)):n==="pagedown"?(i=u+o,i>s.length-1&&(i=s.length-1)):n==="last"&&(i=s.length-1),this.scrollToFocusedOptionOnUpdate=!0,this.setState({focusedOption:s[i],focusedValue:null,focusedOptionId:this.getFocusedOptionId(s[i])})}}},{key:"getTheme",value:function(){return this.props.theme?typeof this.props.theme=="function"?this.props.theme(wt):E(E({},wt),this.props.theme):wt}},{key:"getCommonProps",value:function(){var n=this.clearValue,o=this.cx,l=this.getStyles,s=this.getClassNames,i=this.getValue,u=this.selectOption,c=this.setValue,d=this.props,b=d.isMulti,p=d.isRtl,g=d.options,m=this.hasValue();return{clearValue:n,cx:o,getStyles:l,getClassNames:s,getValue:i,hasValue:m,isMulti:b,isRtl:p,options:g,selectOption:u,selectProps:d,setValue:c,theme:this.getTheme()}}},{key:"hasValue",value:function(){var n=this.state.selectValue;return n.length>0}},{key:"hasOptions",value:function(){return!!this.getFocusableOptions().length}},{key:"isClearable",value:function(){var n=this.props,o=n.isClearable,l=n.isMulti;return o===void 0?l:o}},{key:"isOptionDisabled",value:function(n,o){return Tr(this.props,n,o)}},{key:"isOptionSelected",value:function(n,o){return Lr(this.props,n,o)}},{key:"filterOption",value:function(n,o){return Rr(this.props,n,o)}},{key:"formatOptionLabel",value:function(n,o){if(typeof this.props.formatOptionLabel=="function"){var l=this.props.inputValue,s=this.state.selectValue;return this.props.formatOptionLabel(n,{context:o,inputValue:l,selectValue:s})}else return this.getOptionLabel(n)}},{key:"formatGroupLabel",value:function(n){return this.props.formatGroupLabel(n)}},{key:"startListeningComposition",value:function(){document&&document.addEventListener&&(document.addEventListener("compositionstart",this.onCompositionStart,!1),document.addEventListener("compositionend",this.onCompositionEnd,!1))}},{key:"stopListeningComposition",value:function(){document&&document.removeEventListener&&(document.removeEventListener("compositionstart",this.onCompositionStart),document.removeEventListener("compositionend",this.onCompositionEnd))}},{key:"startListeningToTouch",value:function(){document&&document.addEventListener&&(document.addEventListener("touchstart",this.onTouchStart,!1),document.addEventListener("touchmove",this.onTouchMove,!1),document.addEventListener("touchend",this.onTouchEnd,!1))}},{key:"stopListeningToTouch",value:function(){document&&document.removeEventListener&&(document.removeEventListener("touchstart",this.onTouchStart),document.removeEventListener("touchmove",this.onTouchMove),document.removeEventListener("touchend",this.onTouchEnd))}},{key:"renderInput",value:function(){var n=this.props,o=n.isDisabled,l=n.isSearchable,s=n.inputId,i=n.inputValue,u=n.tabIndex,c=n.form,d=n.menuIsOpen,b=n.required,p=this.getComponents(),g=p.Input,m=this.state,v=m.inputIsHidden,h=m.ariaSelection,C=this.commonProps,S=s||this.getElementId("input"),x=E(E(E({"aria-autocomplete":"list","aria-expanded":d,"aria-haspopup":!0,"aria-errormessage":this.props["aria-errormessage"],"aria-invalid":this.props["aria-invalid"],"aria-label":this.props["aria-label"],"aria-labelledby":this.props["aria-labelledby"],"aria-required":b,role:"combobox","aria-activedescendant":this.state.isAppleDevice?void 0:this.state.focusedOptionId||""},d&&{"aria-controls":this.getElementId("listbox")}),!l&&{"aria-readonly":!0}),this.hasValue()?(h==null?void 0:h.action)==="initial-input-focus"&&{"aria-describedby":this.getElementId("live-region")}:{"aria-describedby":this.getElementId("placeholder")});return l?f.createElement(g,D({},C,{autoCapitalize:"none",autoComplete:"off",autoCorrect:"off",id:S,innerRef:this.getInputRef,isDisabled:o,isHidden:v,onBlur:this.onInputBlur,onChange:this.handleInputChange,onFocus:this.onInputFocus,spellCheck:"false",tabIndex:u,form:c,type:"text",value:i},x)):f.createElement(El,D({id:S,innerRef:this.getInputRef,onBlur:this.onInputBlur,onChange:qe,onFocus:this.onInputFocus,disabled:o,tabIndex:u,inputMode:"none",form:c,value:""},x))}},{key:"renderPlaceholderOrValue",value:function(){var n=this,o=this.getComponents(),l=o.MultiValue,s=o.MultiValueContainer,i=o.MultiValueLabel,u=o.MultiValueRemove,c=o.SingleValue,d=o.Placeholder,b=this.commonProps,p=this.props,g=p.controlShouldRenderValue,m=p.isDisabled,v=p.isMulti,h=p.inputValue,C=p.placeholder,S=this.state,x=S.selectValue,k=S.focusedValue,P=S.isFocused;if(!this.hasValue()||!g)return h?null:f.createElement(d,D({},b,{key:"placeholder",isDisabled:m,isFocused:P,innerProps:{id:this.getElementId("placeholder")}}),C);if(v)return x.map(function(y,O){var I=y===k,$="".concat(n.getOptionLabel(y),"-").concat(n.getOptionValue(y));return f.createElement(l,D({},b,{components:{Container:s,Label:i,Remove:u},isFocused:I,isDisabled:m,key:$,index:O,removeProps:{onClick:function(){return n.removeValue(y)},onTouchEnd:function(){return n.removeValue(y)},onMouseDown:function(X){X.preventDefault()}},data:y}),n.formatOptionLabel(y,"value"))});if(h)return null;var w=x[0];return f.createElement(c,D({},b,{data:w,isDisabled:m}),this.formatOptionLabel(w,"value"))}},{key:"renderClearIndicator",value:function(){var n=this.getComponents(),o=n.ClearIndicator,l=this.commonProps,s=this.props,i=s.isDisabled,u=s.isLoading,c=this.state.isFocused;if(!this.isClearable()||!o||i||!this.hasValue()||u)return null;var d={onMouseDown:this.onClearIndicatorMouseDown,onTouchEnd:this.onClearIndicatorTouchEnd,"aria-hidden":"true"};return f.createElement(o,D({},l,{innerProps:d,isFocused:c}))}},{key:"renderLoadingIndicator",value:function(){var n=this.getComponents(),o=n.LoadingIndicator,l=this.commonProps,s=this.props,i=s.isDisabled,u=s.isLoading,c=this.state.isFocused;if(!o||!u)return null;var d={"aria-hidden":"true"};return f.createElement(o,D({},l,{innerProps:d,isDisabled:i,isFocused:c}))}},{key:"renderIndicatorSeparator",value:function(){var n=this.getComponents(),o=n.DropdownIndicator,l=n.IndicatorSeparator;if(!o||!l)return null;var s=this.commonProps,i=this.props.isDisabled,u=this.state.isFocused;return f.createElement(l,D({},s,{isDisabled:i,isFocused:u}))}},{key:"renderDropdownIndicator",value:function(){var n=this.getComponents(),o=n.DropdownIndicator;if(!o)return null;var l=this.commonProps,s=this.props.isDisabled,i=this.state.isFocused,u={onMouseDown:this.onDropdownIndicatorMouseDown,onTouchEnd:this.onDropdownIndicatorTouchEnd,"aria-hidden":"true"};return f.createElement(o,D({},l,{innerProps:u,isDisabled:s,isFocused:i}))}},{key:"renderMenu",value:function(){var n=this,o=this.getComponents(),l=o.Group,s=o.GroupHeading,i=o.Menu,u=o.MenuList,c=o.MenuPortal,d=o.LoadingMessage,b=o.NoOptionsMessage,p=o.Option,g=this.commonProps,m=this.state.focusedOption,v=this.props,h=v.captureMenuScroll,C=v.inputValue,S=v.isLoading,x=v.loadingMessage,k=v.minMenuHeight,P=v.maxMenuHeight,w=v.menuIsOpen,y=v.menuPlacement,O=v.menuPosition,I=v.menuPortalTarget,$=v.menuShouldBlockScroll,F=v.menuShouldScrollIntoView,X=v.noOptionsMessage,J=v.onMenuScrollToTop,A=v.onMenuScrollToBottom;if(!w)return null;var N=function(Y,se){var he=Y.type,te=Y.data,ve=Y.isDisabled,ue=Y.isSelected,Fe=Y.label,Ur=Y.value,Jt=m===te,Qt=ve?void 0:function(){return n.onOptionHover(te)},Gr=ve?void 0:function(){return n.selectOption(te)},en="".concat(n.getElementId("option"),"-").concat(se),jr={id:en,onClick:Gr,onMouseMove:Qt,onMouseOver:Qt,tabIndex:-1,role:"option","aria-selected":n.state.isAppleDevice?void 0:ue};return f.createElement(p,D({},g,{innerProps:jr,data:te,isDisabled:ve,isSelected:ue,key:en,label:Fe,type:he,value:Ur,isFocused:Jt,innerRef:Jt?n.getFocusedOptionRef:void 0}),n.formatOptionLabel(Y.data,"menu"))},ne;if(this.hasOptions())ne=this.getCategorizedOptions().map(function(_){if(_.type==="group"){var Y=_.data,se=_.options,he=_.index,te="".concat(n.getElementId("group"),"-").concat(he),ve="".concat(te,"-heading");return f.createElement(l,D({},g,{key:te,data:Y,options:se,Heading:s,headingProps:{id:ve,data:_.data},label:n.formatGroupLabel(_.data)}),_.options.map(function(ue){return N(ue,"".concat(he,"-").concat(ue.index))}))}else if(_.type==="option")return N(_,"".concat(_.index))});else if(S){var Q=x({inputValue:C});if(Q===null)return null;ne=f.createElement(d,g,Q)}else{var pe=X({inputValue:C});if(pe===null)return null;ne=f.createElement(b,g,pe)}var me={minMenuHeight:k,maxMenuHeight:P,menuPlacement:y,menuPosition:O,menuShouldScrollIntoView:F},Re=f.createElement(li,D({},g,me),function(_){var Y=_.ref,se=_.placerProps,he=se.placement,te=se.maxHeight;return f.createElement(i,D({},g,me,{innerRef:Y,innerProps:{onMouseDown:n.onMenuMouseDown,onMouseMove:n.onMenuMouseMove},isLoading:S,placement:he}),f.createElement(Rl,{captureEnabled:h,onTopArrive:J,onBottomArrive:A,lockEnabled:$},function(ve){return f.createElement(u,D({},g,{innerRef:function(Fe){n.getMenuListRef(Fe),ve(Fe)},innerProps:{role:"listbox","aria-multiselectable":g.isMulti,id:n.getElementId("listbox")},isLoading:S,maxHeight:te,focusedOption:m}),ne)}))});return I||O==="fixed"?f.createElement(c,D({},g,{appendTo:I,controlElement:this.controlRef,menuPlacement:y,menuPosition:O}),Re):Re}},{key:"renderFormField",value:function(){var n=this,o=this.props,l=o.delimiter,s=o.isDisabled,i=o.isMulti,u=o.name,c=o.required,d=this.state.selectValue;if(c&&!this.hasValue()&&!s)return f.createElement(Al,{name:u,onFocus:this.onValueInputFocus});if(!(!u||s))if(i)if(l){var b=d.map(function(m){return n.getOptionValue(m)}).join(l);return f.createElement("input",{name:u,type:"hidden",value:b})}else{var p=d.length>0?d.map(function(m,v){return f.createElement("input",{key:"i-".concat(v),name:u,type:"hidden",value:n.getOptionValue(m)})}):f.createElement("input",{name:u,type:"hidden",value:""});return f.createElement("div",null,p)}else{var g=d[0]?this.getOptionValue(d[0]):"";return f.createElement("input",{name:u,type:"hidden",value:g})}}},{key:"renderLiveRegion",value:function(){var n=this.commonProps,o=this.state,l=o.ariaSelection,s=o.focusedOption,i=o.focusedValue,u=o.isFocused,c=o.selectValue,d=this.getFocusableOptions();return f.createElement(Sl,D({},n,{id:this.getElementId("live-region"),ariaSelection:l,focusedOption:s,focusedValue:i,isFocused:u,selectValue:c,focusableOptions:d,isAppleDevice:this.state.isAppleDevice}))}},{key:"render",value:function(){var n=this.getComponents(),o=n.Control,l=n.IndicatorsContainer,s=n.SelectContainer,i=n.ValueContainer,u=this.props,c=u.className,d=u.id,b=u.isDisabled,p=u.menuIsOpen,g=this.state.isFocused,m=this.commonProps=this.getCommonProps();return f.createElement(s,D({},m,{className:c,innerProps:{id:d,onKeyDown:this.onKeyDown},isDisabled:b,isFocused:g}),this.renderLiveRegion(),f.createElement(o,D({},m,{innerRef:this.getControlRef,innerProps:{onMouseDown:this.onControlMouseDown,onTouchEnd:this.onControlTouchEnd},isDisabled:b,isFocused:g,menuIsOpen:p}),f.createElement(i,D({},m,{isDisabled:b}),this.renderPlaceholderOrValue(),this.renderInput()),f.createElement(l,D({},m,{isDisabled:b}),this.renderClearIndicator(),this.renderLoadingIndicator(),this.renderIndicatorSeparator(),this.renderDropdownIndicator())),this.renderMenu(),this.renderFormField())}}],[{key:"getDerivedStateFromProps",value:function(n,o){var l=o.prevProps,s=o.clearFocusValueOnUpdate,i=o.inputIsHiddenAfterUpdate,u=o.ariaSelection,c=o.isFocused,d=o.prevWasFocused,b=o.instancePrefix,p=n.options,g=n.value,m=n.menuIsOpen,v=n.inputValue,h=n.isMulti,C=Ze(g),S={};if(l&&(g!==l.value||p!==l.options||m!==l.menuIsOpen||v!==l.inputValue)){var x=m?Zl(n,C):[],k=m?Dn(We(n,C),"".concat(b,"-option")):[],P=s?Jl(o,C):null,w=Ql(o,x),y=St(k,w);S={selectValue:C,focusedOption:w,focusedOptionId:y,focusableOptionsWithIds:k,focusedValue:P,clearFocusValueOnUpdate:!1}}var O=i!=null&&n!==l?{inputIsHidden:i,inputIsHiddenAfterUpdate:void 0}:{},I=u,$=c&&d;return c&&!$&&(I={value:Pe(h,C,C[0]||null),options:C,action:"initial-input-focus"},$=!d),(u==null?void 0:u.action)==="initial-input-focus"&&(I=null),E(E(E({},S),O),{},{prevProps:n,ariaSelection:I,prevWasFocused:$})}}]),r}(f.Component);qt.defaultProps=ql;var ts=f.forwardRef(function(t,e){var r=Un(t);return f.createElement(qt,D({ref:e},r))}),$r=ts;const ns=t=>{const{Menu:e}=Xt,{children:r,...a}=t;return f.createElement(e,{...a},r)},rs=ee.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;

    .glide-select {
        font-family: var(--gdg-font-family);
        font-size: var(--gdg-editor-font-size);
    }
`,as=ee.div`
    font-family: var(--gdg-font-family);
    font-size: var(--gdg-editor-font-size);
    color: var(--gdg-text-dark);

    > div {
        border-radius: 4px;
        border: 1px solid var(--gdg-border-color);
    }
`,os=ee.div`
    display: "flex";
    margin: auto 8.5px;
    padding-bottom: 3px;
`,is=t=>{const{value:e,onFinishedEditing:r,initialValue:a,portalElementRef:n}=t,{allowedValues:o,value:l}=e.data,[s,i]=f.useState(l),[u,c]=f.useState(a??""),d=_n(),b=f.useMemo(()=>o.map(p=>typeof p=="string"||p===null||p===void 0?{value:p,label:(p==null?void 0:p.toString())??""}:p),[o]);return e.readonly?f.createElement(os,null,f.createElement(Ft,{highlight:!0,autoFocus:!1,disabled:!0,value:s??"",onChange:()=>{}})):f.createElement(rs,null,f.createElement($r,{className:"glide-select",inputValue:u,onInputChange:c,menuPlacement:"auto",value:b.find(p=>p.value===s),styles:{control:p=>({...p,border:0,boxShadow:"none"}),option:(p,{isFocused:g})=>({...p,fontSize:d.editorFontSize,fontFamily:d.fontFamily,cursor:g?"pointer":void 0,paddingLeft:d.cellHorizontalPadding,paddingRight:d.cellHorizontalPadding,":active":{...p[":active"],color:d.accentFg},":empty::after":{content:'"&nbsp;"',visibility:"hidden"}})},theme:p=>({...p,colors:{...p.colors,neutral0:d.bgCell,neutral5:d.bgCell,neutral10:d.bgCell,neutral20:d.bgCellMedium,neutral30:d.bgCellMedium,neutral40:d.bgCellMedium,neutral50:d.textLight,neutral60:d.textMedium,neutral70:d.textMedium,neutral80:d.textDark,neutral90:d.textDark,neutral100:d.textDark,primary:d.accentColor,primary75:d.accentColor,primary50:d.accentColor,primary25:d.accentLight}}),menuPortalTarget:(n==null?void 0:n.current)??document.getElementById("portal"),autoFocus:!0,openMenuOnFocus:!0,components:{DropdownIndicator:()=>null,IndicatorSeparator:()=>null,Menu:p=>f.createElement(as,null,f.createElement(ns,{className:"click-outside-ignore",...p}))},options:b,onChange:async p=>{p!==null&&(i(p.value),await new Promise(g=>window.requestAnimationFrame(g)),r({...e,data:{...e.data,value:p.value}}))}}))},Ar={kind:V.Custom,isMatch:t=>t.data.kind==="dropdown-cell",draw:(t,e)=>{const{ctx:r,theme:a,rect:n}=t,{value:o}=e.data,l=e.data.allowedValues.find(i=>typeof i=="string"||i===null||i===void 0?i===o:i.value===o),s=typeof l=="string"?l:(l==null?void 0:l.label)??"";return s&&(r.fillStyle=a.textDark,r.fillText(s,n.x+a.cellHorizontalPadding,n.y+n.height/2+ie(r,a))),!0},measure:(t,e,r)=>{const{value:a}=e.data;return(a?t.measureText(a).width:0)+r.cellHorizontalPadding*2},provideEditor:()=>({editor:is,disablePadding:!0,deletedValue:t=>({...t,copyData:"",data:{...t.data,value:""}})}),onPaste:(t,e)=>({...e,value:e.allowedValues.some(r=>r==null?!1:typeof r=="string"?r===t:r.value===t)?t:e.value})},ls=f.lazy(async()=>await ra(()=>import("./article-cell-editor-D0ZdWKJz.js"),__vite__mapDeps([0,1,2,3]),import.meta.url)),ss={kind:V.Custom,isMatch:t=>t.data.kind==="article-cell",draw:(t,e)=>{const{ctx:r,theme:a,rect:n}=t,{markdown:o}=e.data;let l=o;l.includes(`
`)&&(l=l.split(/\r?\n/)[0]);const s=n.width/4;return l.length>s&&(l=l.slice(0,s)),r.fillStyle=a.textDark,r.fillText(l,n.x+a.cellHorizontalPadding,n.y+n.height/2+ie(r,a)),!0},provideEditor:()=>({editor:t=>f.createElement(f.Suspense,{fallback:null},f.createElement(ls,{...t})),styleOverride:{position:"fixed",left:"12.5vw",top:"12.5vh",width:"75vw",borderRadius:"9px",maxWidth:"unset",maxHeight:"unset"},disablePadding:!0}),onPaste:(t,e)=>({...e,markdown:t})};function us(t,e){const r=/(\d+\.?\d*)\s*(px|rem|em|%|pt)/,a=t.match(r);if(a){const n=parseFloat(a[1]),o=a[2],l=n*e;return t.replace(r,`${Number(l.toPrecision(3))}${o}`)}return t}const cs={marginRight:8},ds={display:"flex",alignItems:"center",flexGrow:1},fs={kind:V.Custom,isMatch:t=>t.data.kind==="range-cell",draw:(t,e)=>{const{ctx:r,theme:a,rect:n}=t,{min:o,max:l,value:s,label:i,measureLabel:u,color:c}=e.data,d=n.x+a.cellHorizontalPadding,b=n.y+n.height/2,p=l-o,g=(s-o)/p,m=`${us(a.baseFontStyle,.9)} ${a.fontFamily}`,h=Yr(r,m)/2;r.save();let C=0;i!==void 0&&(r.font=m,C=ge(u??i,r,m).width+a.cellHorizontalPadding);const S=n.width-a.cellHorizontalPadding*2-C;if(S>=h){const x=r.createLinearGradient(d,b,d+S,b),k=c??a.accentColor;x.addColorStop(0,k),x.addColorStop(g,k),x.addColorStop(g,a.bgBubble),x.addColorStop(1,a.bgBubble),r.beginPath(),r.fillStyle=x,De(r,d,b-h/2,S,h,h/2),r.fill(),r.beginPath(),De(r,d+.5,b-h/2+.5,S-1,h-1,(h-1)/2),r.strokeStyle=a.accentLight,r.lineWidth=1,r.stroke()}return i!==void 0&&(r.textAlign="right",r.fillStyle=a.textDark,r.fillText(i,n.x+n.width-a.cellHorizontalPadding,b+ie(r,m))),r.restore(),!0},provideEditor:()=>t=>{const{data:e,readonly:r}=t.value,a=e.value.toString(),n=e.min.toString(),o=e.max.toString(),l=e.step.toString(),s=i=>{t.onChange({...t.value,data:{...e,value:Number(i.target.value)}})};return f.createElement("label",{style:ds},f.createElement("input",{style:cs,type:"range",value:a,min:n,max:o,step:l,onChange:s,disabled:r}),a)},onPaste:(t,e)=>{let r=Number.parseFloat(t);return r=Number.isNaN(r)?e.value:Math.max(e.min,Math.min(e.max,r)),{...e,value:r}}},ps={kind:V.Custom,isMatch:t=>t.data.kind==="spinner-cell",draw:t=>{const{ctx:e,theme:r,rect:a,requestAnimationFrame:n}=t,o=window.performance.now()%1e3/1e3,l=a.x+a.width/2,s=a.y+a.height/2;return e.beginPath(),e.arc(l,s,Math.min(12,a.height/6),Math.PI*2*o,Math.PI*2*o+Math.PI*1.5),e.strokeStyle=r.textMedium,e.lineWidth=1.5,e.stroke(),e.lineWidth=1,n(),!0},provideEditor:()=>{}},ms=ee.input`
    min-height: 26px;
    border: none;
    outline: none;
    background-color: transparent;
    font-size: var(--gdg-editor-font-size);
    font-family: var(--gdg-font-family);
    color: var(--gdg-text-dark);
    ::-webkit-calendar-picker-indicator {
        background-color: white;
    }
`,xt=(t,e,r)=>{if(e==null)return"";r&&(e=new Date(e.getTime()+r));const a=e.toISOString();switch(t){case"date":return a.split("T")[0];case"datetime-local":return a.replace("Z","");case"time":return a.split("T")[1].replace("Z","");default:throw new Error(`Unknown date kind ${t}`)}},hs=t=>{const e=t.value.data,{format:r,displayDate:a}=e,n=e.step!==void 0&&!Number.isNaN(Number(e.step))?Number(e.step):void 0,o=e.timezoneOffset?e.timezoneOffset*60*1e3:0,l=e.min instanceof Date?xt(r,e.min,o):e.min,s=e.max instanceof Date?xt(r,e.max,o):e.max,i=xt(r,e.date,o);return t.value.readonly?nn.createElement(Ft,{highlight:!0,autoFocus:!1,disabled:!0,value:a??"",onChange:()=>{}}):nn.createElement(ms,{"data-testid":"date-picker-cell",required:!0,type:r,defaultValue:i,min:l,max:s,step:n,autoFocus:!0,onChange:u=>{isNaN(u.target.valueAsNumber)?t.onChange({...t.value,data:{...t.value.data,date:void 0}}):t.onChange({...t.value,data:{...t.value.data,date:new Date(u.target.valueAsNumber-o)}})}})},vs={kind:V.Custom,isMatch:t=>t.data.kind==="date-picker-cell",draw:(t,e)=>{const{displayDate:r}=e.data;return qr(t,r,e.contentAlign),!0},measure:(t,e,r)=>{const{displayDate:a}=e.data;return t.measureText(a).width+r.cellHorizontalPadding*2},provideEditor:()=>({editor:hs}),onPaste:(t,e)=>{let r=NaN;return t&&(r=Number(t).valueOf(),Number.isNaN(r)&&(r=Date.parse(t),e.format==="time"&&Number.isNaN(r)&&(r=Date.parse(`1970-01-01T${t}Z`)))),{...e,date:Number.isNaN(r)?void 0:new Date(r)}}};function Vn(t){if(t.cell.data.navigateOn!=="click"!==t.ctrlKey)return;const a=document.createElement("canvas").getContext("2d",{alpha:!1});if(a===null)return;const{posX:n,bounds:o,cell:l,theme:s}=t,i=s.baseFontFull;a.font=i;const{links:u}=l.data,c=s.cellHorizontalPadding;let d=o.x+c;const b=o.x+n;for(const[p,g]of u.entries()){const m=p<u.length-1,v=ge(g.title,a),h=m?ge(g.title+",",a,i):v;if(b>d&&b<d+v.width)return g;d+=h.width+4}}const gs={kind:V.Custom,needsHover:!0,needsHoverPosition:!0,isMatch:t=>t.data.kind==="links-cell",onSelect:t=>{Vn(t)!==void 0&&t.preventDefault()},onClick:t=>{var r;const e=Vn(t);e!==void 0&&((r=e.onClick)==null||r.call(e),t.preventDefault())},draw:(t,e)=>{var m;const{ctx:r,rect:a,theme:n,hoverX:o=-100,highlighted:l}=t,{links:s,underlineOffset:i=5}=e.data,u=n.cellHorizontalPadding;let c=a.x+u;const d=a.x+o,b=n.baseFontFull,p=ie(r,b),g=a.y+a.height/2+p;for(const[v,h]of s.entries()){const C=v<s.length-1,S=ge(h.title,r,b),x=C?ge(h.title+",",r,b):S;d>c&&d<c+S.width&&((m=t.overrideCursor)==null||m.call(t,"pointer"),r.moveTo(c,Math.floor(g+i)+.5),r.lineTo(c+S.width,Math.floor(g+i)+.5),r.strokeStyle=n.textDark,r.stroke(),r.fillStyle=l?Zr(n.accentLight,n.bgCell):n.bgCell,r.fillText(C?h.title+",":h.title,c-1,g),r.fillText(C?h.title+",":h.title,c+1,g),r.fillText(C?h.title+",":h.title,c-2,g),r.fillText(C?h.title+",":h.title,c+2,g)),r.fillStyle=n.textDark,r.fillText(C?h.title+",":h.title,c,g),c+=x.width+4}return!0},provideEditor:()=>t=>{const{value:e,onChange:r}=t,{links:a,maxLinks:n=Number.MAX_SAFE_INTEGER}=e.data;return f.createElement(bs,{onKeyDown:ys},a.map((o,l)=>f.createElement(Cs,{key:l,link:o.href??"",title:o.title,focus:l===0,onDelete:a.length>1?()=>{const s=[...a];s.splice(l,1),r({...e,data:{...e.data,links:s}})}:void 0,onChange:(s,i)=>{const u=[...a];u[l]={href:s,title:i},r({...e,data:{...e.data,links:u}})}})),f.createElement("button",{disabled:a.length>=n,className:"add-link",onClick:()=>{const o=[...a,{title:""}];r({...e,data:{...e.data,links:o}})}},"Add link"))},onPaste:(t,e)=>{const r=t.split(",");if(!e.links.some((a,n)=>r[n]!==a.title))return{...e,links:r.map(a=>({title:a}))}}},bs=ee.div`
    display: flex;
    flex-direction: column;

    margin: 4px 0;

    > button {
        color: var(--gdg-accent-color);
        font-weight: 600;
        align-self: flex-end;
        border: none;
        outline: none;
        background-color: transparent;

        transition: background-color 200ms;
        border-radius: 4px;

        padding: 6px 8px;
        cursor: pointer;

        &:hover,
        &:focus-visible {
            background-color: var(--gdg-accent-light);
        }

        &:disabled {
            opacity: 0.4;
            pointer-events: none;
        }
    }

    .gdg-link-title-editor {
        display: flex;

        min-width: 250px;

        > input {
            outline: none;
            border: 1px solid var(--gdg-border-color);
            border-radius: 4px;
            box-shadow: none;
            padding: 6px 8px;
            min-width: 0;
            width: 0;
            flex-grow: 1;

            &:not(:last-child) {
                margin-right: 4px;
            }

            transition: border 200ms;

            &:focus {
                border: 1px solid var(--gdg-accent-color);
            }
        }

        &:not(:last-child) {
            margin-bottom: 4px;
        }

        > button {
            border: none;
            outline: none;
            border-radius: 4px;

            background-color: transparent;

            cursor: pointer;

            transition:
                background-color 200ms,
                color 200ms;

            color: var(--gdg-text-medium);

            &:hover,
            &:focus-visible {
                background-color: var(--gdg-accent-light);
                color: var(--gdg-text-dark);
            }
        }
    }
`;function ys(t){t.key==="Tab"&&t.stopPropagation()}const Cs=t=>{const{link:e,onChange:r,title:a,onDelete:n,focus:o}=t;return f.createElement("div",{className:"gdg-link-title-editor"},f.createElement("input",{className:"gdg-title-input",value:a,placeholder:"Title",autoFocus:o,onChange:l=>{r(e,l.target.value)}}),f.createElement("input",{className:"gdg-link-input",value:e,placeholder:"URL",onChange:l=>{r(l.target.value,a)}}),n!==void 0&&f.createElement("button",{onClick:n},f.createElement("svg",{width:16,height:16,viewBox:"0 0 24 24",fill:"none",id:"icon-import",xmlns:"http://www.w3.org/2000/svg"},f.createElement("path",{d:"M3 6L5 6L21 6",stroke:"currentColor",strokeWidth:"1px",strokeLinecap:"round",strokeLinejoin:"round"}),f.createElement("path",{d:"M17.9019 6C18.491 6 18.9525 6.50676 18.8975 7.09334L17.67 20.1867C17.5736 21.2144 16.711 22 15.6787 22H8.32127C7.28902 22 6.42635 21.2144 6.33 20.1867L5.1025 7.09334C5.04751 6.50676 5.50898 6 6.09813 6H17.9019Z",stroke:"currentColor",strokeWidth:"1px",strokeLinecap:"round",strokeLinejoin:"round"}),f.createElement("path",{d:"M14.4499 10.211L13.9949 17",stroke:"currentColor",strokeWidth:"1px",strokeLinecap:"round",strokeLinejoin:"round"}),f.createElement("path",{d:"M9.55499 10.211L10.0049 17",stroke:"currentColor",strokeWidth:"1px",strokeLinecap:"round",strokeLinejoin:"round"}),f.createElement("path",{d:"M7.5 2.25H16.5",stroke:"currentColor",strokeWidth:"1px",strokeLinecap:"round",strokeLinejoin:"round"}))))};function Ot(t,e,r){if(typeof t=="string")return e[t]!==void 0?e[t]:t;let[a,n]=t;return e[a]!==void 0&&(a=e[a]),e[n]!==void 0&&(n=e[n]),Jr(a,n,r)}function Tn(t,e,r,a){const n=Math.floor(t.x+a.cellHorizontalPadding+1),o=Math.floor(t.y+a.cellVerticalPadding+1),l=Math.ceil(t.width-a.cellHorizontalPadding*2-1),s=Math.ceil(t.height-a.cellVerticalPadding*2-1);return e!==void 0&&r!==void 0&&e+t.x>=n&&e+t.x<n+l&&r+t.y>=o&&r+t.y<o+s}const ws={kind:V.Custom,isMatch:t=>t.data.kind==="button-cell",needsHoverPosition:!0,needsHover:!0,onSelect:t=>t.preventDefault(),onClick:t=>{var l,s;const{cell:e,theme:r,bounds:a,posX:n,posY:o}=t;Tn(a,n,o,r)&&((s=(l=e.data).onClick)==null||s.call(l))},drawPrep:t=>{const{ctx:e}=t;return e.textAlign="center",{deprep:r=>{r.ctx.textAlign="start"}}},draw:(t,e)=>{var w,y;const{ctx:r,theme:a,rect:n,hoverX:o,hoverY:l,frameTime:s,drawState:i}=t,{title:u,backgroundColor:c,color:d,borderColor:b,borderRadius:p}=e.data,g=Math.floor(n.x+a.cellHorizontalPadding+1),m=Math.floor(n.y+a.cellVerticalPadding+1),v=Math.ceil(n.width-a.cellHorizontalPadding*2-1),h=Math.ceil(n.height-a.cellVerticalPadding*2-1);if(v<=0||h<=0)return!0;const C=Tn(n,o,l,a);let[S,x]=i;C&&((w=t.overrideCursor)==null||w.call(t,"pointer")),S??(S={hovered:!1,animationStartTime:0}),C!==S.hovered&&(S={...S,hovered:C,animationStartTime:s},x(S));const k=Math.min(1,(s-S.animationStartTime)/200),P=C?k:1-k;return k<1&&((y=t.requestAnimationFrame)==null||y.call(t)),c!==void 0&&(r.beginPath(),De(r,g,m,v,h,p??a.roundingRadius??0),r.fillStyle=Ot(c,a,P),r.fill()),b!==void 0&&(r.beginPath(),De(r,g+.5,m+.5,v-1,h-1,p??a.roundingRadius??0),r.strokeStyle=Ot(b,a,P),r.lineWidth=1,r.stroke()),r.fillStyle=Ot(d??a.accentColor,a,P),r.fillText(u,g+v/2,m+h/2+ie(r,a.baseFontFull)),!0},provideEditor:void 0},kt=16;function Ln(t,e,r,a,n){return t>=r+a.cellHorizontalPadding-4&&t<=r+a.cellHorizontalPadding+18&&e>=n/2-9&&e<=n/2+9}const Ss={kind:V.Custom,isMatch:t=>t.data.kind==="tree-view-cell",needsHover:!0,needsHoverPosition:!0,onClick:t=>{const{theme:e,bounds:r,posX:a,posY:n,cell:o}=t,{height:l}=r,{canOpen:s,depth:i,onClickOpener:u}=o.data;return!s||u===void 0?void 0:Ln(a,n,i*kt,e,l)?u(o):void 0},measure:(t,e,r)=>{const{text:a,depth:n}=e.data;return t.measureText(a).width+r.cellHorizontalPadding*2+(n+2)*kt},draw:(t,e)=>{var h;const{ctx:r,theme:a,rect:n,hoverX:o=0,hoverY:l=0}=t,{x:s,y:i,height:u}=n,{canOpen:c,depth:d,text:b,isOpen:p}=e.data,g=ie(r,a),m=d*kt,v=i+u/2;if(c){const C=Ln(o,l,m,a,u);p?(r.moveTo(m+s+a.cellHorizontalPadding,v-2.5),r.lineTo(m+s+a.cellHorizontalPadding+5,v+2.5),r.lineTo(m+s+a.cellHorizontalPadding+10,v-2.5)):(r.moveTo(m+s+a.cellHorizontalPadding+2.5,v-5),r.lineTo(m+s+a.cellHorizontalPadding+2.5+5,v),r.lineTo(m+s+a.cellHorizontalPadding+2.5,v+5)),r.strokeStyle=C?a.textMedium:a.textLight,r.lineWidth=2,r.stroke(),C&&((h=t.overrideCursor)==null||h.call(t,"pointer"))}return r.fillStyle=a.textDark,r.fillText(b,16+s+m+a.cellHorizontalPadding+.5,i+u/2+g),!0},provideEditor:void 0};var xs=["allowCreateWhileLoading","createOptionPosition","formatCreateLabel","isValidNewOption","getNewOptionData","onCreateOption","options","onChange"],Rn=function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:"",r=arguments.length>1?arguments[1]:void 0,a=arguments.length>2?arguments[2]:void 0,n=String(e).toLowerCase(),o=String(a.getOptionValue(r)).toLowerCase(),l=String(a.getOptionLabel(r)).toLowerCase();return o===n||l===n},Pt={formatCreateLabel:function(e){return'Create "'.concat(e,'"')},isValidNewOption:function(e,r,a,n){return!(!e||r.some(function(o){return Rn(e,o,n)})||a.some(function(o){return Rn(e,o,n)}))},getNewOptionData:function(e,r){return{label:r,value:e,__isNew__:!0}}};function Os(t){var e=t.allowCreateWhileLoading,r=e===void 0?!1:e,a=t.createOptionPosition,n=a===void 0?"last":a,o=t.formatCreateLabel,l=o===void 0?Pt.formatCreateLabel:o,s=t.isValidNewOption,i=s===void 0?Pt.isValidNewOption:s,u=t.getNewOptionData,c=u===void 0?Pt.getNewOptionData:u,d=t.onCreateOption,b=t.options,p=b===void 0?[]:b,g=t.onChange,m=le(t,xs),v=m.getOptionValue,h=v===void 0?Er:v,C=m.getOptionLabel,S=C===void 0?Mr:C,x=m.inputValue,k=m.isLoading,P=m.isMulti,w=m.value,y=m.name,O=f.useMemo(function(){return i(x,Ze(w),p,{getOptionValue:h,getOptionLabel:S})?c(x,l(x)):void 0},[l,c,S,h,x,i,p,w]),I=f.useMemo(function(){return(r||!k)&&O?n==="first"?[O].concat(ye(p)):[].concat(ye(p),[O]):p},[r,n,k,O,p]),$=f.useCallback(function(F,X){if(X.action!=="select-option")return g(F,X);var J=Array.isArray(F)?F:[F];if(J[J.length-1]===O){if(d)d(x);else{var A=c(x,x),N={action:"create-option",name:y,option:A};g(Pe(P,[].concat(ye(Ze(w)),[A]),A),N)}return}g(F,X)},[c,x,P,y,O,d,g,w]);return E(E({},m),{},{options:I,onChange:$})}var ks=f.forwardRef(function(t,e){var r=Un(t),a=Os(r);return f.createElement(qt,D({ref:e},a))}),Ps=ks;const Zt="__value",Ms=new RegExp(`^${Zt}\\d+__`),Es=ee.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    margin-top: auto;
    margin-bottom: auto;
    .gdg-multi-select {
        font-family: var(--gdg-font-family);
        font-size: var(--gdg-editor-font-size);
    }
`,Ds=ee.div`
    font-family: var(--gdg-font-family);
    font-size: var(--gdg-editor-font-size);
    color: var(--gdg-text-dark);

    > div {
        border-radius: 4px;
        border: 1px solid var(--gdg-border-color);
    }
`,Ue=t=>t.map(e=>typeof e=="string"||e===null||e===void 0?{value:e,label:e??"",color:void 0}:{value:e.value,label:e.label??e.value??"",color:e.color??void 0}),Hr=(t,e,r)=>t==null?[]:t.map((a,n)=>{const o=r?`${Zt}${n}__`:"",l=e.find(s=>s.value===a);return l?{...l,value:`${o}${l.value}`}:{value:`${o}${a}`,label:a}}),Is=t=>{const{Menu:e}=Xt,{children:r,...a}=t;return f.createElement(e,{...a},r)},Vs=t=>{const{value:e,initialValue:r,onChange:a,onFinishedEditing:n,portalElementRef:o}=t,{options:l,values:s,allowCreation:i,allowDuplicates:u}=e.data,c=_n(),[d,b]=f.useState(s),[p,g]=f.useState(!0),[m,v]=f.useState(r??""),h=f.useMemo(()=>Ue(l??[]),[l]),C=i&&u&&h.length===0,S=f.useCallback(y=>{p&&y.stopPropagation()},[p]),x={control:(y,O)=>({...y,border:0,boxShadow:"none",backgroundColor:c.bgCell,pointerEvents:O.isDisabled?"auto":y.pointerEvents,cursor:O.isDisabled?"default":y.cursor}),valueContainer:y=>({...y,flexWrap:y.flexWrap??"wrap",overflowX:"auto",overflowY:"hidden"}),menu:y=>({...y,backgroundColor:c.bgCell}),option:(y,O)=>({...y,fontSize:c.editorFontSize,fontFamily:c.fontFamily,color:c.textDark,...O.isFocused?{backgroundColor:c.accentLight,cursor:"pointer"}:{},":active":{...y[":active"],color:c.accentFg,backgroundColor:c.accentColor}}),input:(y,{isDisabled:O})=>O?{display:"none"}:{...y,fontSize:c.editorFontSize,fontFamily:c.fontFamily,color:c.textDark},placeholder:y=>({...y,fontSize:c.editorFontSize,fontFamily:c.fontFamily,color:c.textLight}),noOptionsMessage:y=>({...y,fontSize:c.editorFontSize,fontFamily:c.fontFamily,color:c.textLight}),clearIndicator:y=>({...y,color:c.textLight,":hover":{color:c.textDark,cursor:"pointer"}}),multiValue:(y,{data:O})=>({...y,backgroundColor:O.color??c.bgBubble,borderRadius:`${c.roundingRadius??c.bubbleHeight/2}px`,flexShrink:0,whiteSpace:"nowrap"}),multiValueLabel:(y,{data:O,isDisabled:I})=>({...y,paddingRight:I?c.bubblePadding:0,paddingLeft:c.bubblePadding,paddingTop:0,paddingBottom:0,color:O.color?Mt(O.color)>.5?"black":"white":c.textBubble,fontSize:c.editorFontSize,fontFamily:c.fontFamily,justifyContent:"center",alignItems:"center",display:"flex",height:c.bubbleHeight,whiteSpace:"nowrap"}),multiValueRemove:(y,{data:O,isDisabled:I,isFocused:$})=>I?{display:"none"}:{...y,color:O.color?Mt(O.color)>.5?"black":"white":c.textBubble,backgroundColor:void 0,borderRadius:$?`${c.roundingRadius??c.bubbleHeight/2}px`:void 0,":hover":{cursor:"pointer"}}},k=f.useCallback(y=>{const O=y.map(I=>u&&I.startsWith(Zt)?I.replace(new RegExp(Ms),""):I);b(O),a({...e,data:{...e.data,values:O}})},[e,a,u]),P=y=>{switch(y.key){case"Enter":case"Tab":if(!m){n(e,[0,1]);return}u&&i&&(v(""),k([...d??[],m]),g(!1),y.preventDefault())}},w=i?Ps:$r;return f.createElement(Es,{onKeyDown:S,"data-testid":"multi-select-cell"},f.createElement(w,{className:"gdg-multi-select",isMulti:!0,isDisabled:e.readonly,isClearable:!0,isSearchable:!0,inputValue:m,onInputChange:v,options:h,placeholder:e.readonly?"":i?"Add...":void 0,noOptionsMessage:y=>i&&u&&y.inputValue?`Create "${y.inputValue}"`:void 0,menuIsOpen:e.readonly?!1:p,onMenuOpen:()=>g(!0),onMenuClose:()=>g(!1),value:Hr(d,h,u),onKeyDown:e.readonly?void 0:P,menuPlacement:"auto",menuPortalTarget:(o==null?void 0:o.current)??document.getElementById("portal"),autoFocus:!0,openMenuOnFocus:!0,openMenuOnClick:!0,closeMenuOnSelect:!0,backspaceRemovesValue:!0,escapeClearsValue:!1,styles:x,components:{DropdownIndicator:()=>null,IndicatorSeparator:()=>null,Menu:y=>C?null:f.createElement(Ds,null,f.createElement(Is,{className:"click-outside-ignore",...y}))},onChange:async y=>{y!==null&&k(y.map(O=>O.value))}}))},Nr={kind:V.Custom,isMatch:t=>t.data.kind==="multi-select-cell",draw:(t,e)=>{const{ctx:r,theme:a,rect:n,highlighted:o}=t,{values:l,options:s}=e.data;if(l==null)return!0;const i=Ue(s??[]),u={x:n.x+a.cellHorizontalPadding,y:n.y+a.cellVerticalPadding,width:n.width-2*a.cellHorizontalPadding,height:n.height-2*a.cellVerticalPadding},c=Math.max(1,Math.floor(u.height/(a.bubbleHeight+a.bubblePadding)));let{x:d}=u,b=1,p=c===1?u.y+(u.height-a.bubbleHeight)/2:u.y+(u.height-c*a.bubbleHeight-(c-1)*a.bubblePadding)/2;for(const g of l){const m=i.find(k=>k.value===g),v=(m==null?void 0:m.color)??(o?a.bgBubbleSelected:a.bgBubble),h=(m==null?void 0:m.label)??g,S=ge(h,r).width+a.bubblePadding*2,x=a.bubbleHeight/2;if(d!==u.x&&d+S>u.x+u.width&&b<c&&(b++,p+=a.bubbleHeight+a.bubblePadding,d=u.x),r.fillStyle=v,r.beginPath(),Qr(r,d,p,S,a.bubbleHeight,a.roundingRadius??a.bubbleHeight/2),r.fill(),r.fillStyle=m!=null&&m.color?Mt(v)>.5?"#000000":"#ffffff":a.textBubble,r.fillText(h,d+a.bubblePadding,p+x+ie(r,a)),d+=S+a.bubbleMargin,d>u.x+u.width+a.cellHorizontalPadding&&b>=c)break}return!0},measure:(t,e,r)=>{const{values:a,options:n}=e.data;if(!a)return r.cellHorizontalPadding*2;const o=Hr(a,Ue(n??[]),e.data.allowDuplicates).map(s=>s.label??s.value),l=o.reduce((s,i)=>t.measureText(i).width+s+r.bubblePadding*2+r.bubbleMargin,0);return o.length===0?r.cellHorizontalPadding*2:l+2*r.cellHorizontalPadding-r.bubbleMargin},provideEditor:()=>({editor:Vs,disablePadding:!0,deletedValue:t=>({...t,copyData:"",data:{...t.data,values:[]}})}),onPaste:(t,e)=>{if(!t||!t.trim())return{...e,values:[]};let r=t.split(",").map(a=>a.trim());if(e.allowDuplicates||(r=r.filter((a,n)=>r.indexOf(a)===n)),!e.allowCreation){const a=Ue(e.options??[]);r=r.filter(n=>a.find(o=>o.value===n))}if(r.length!==0)return{...e,values:r}}},zr=[ca,da,pa,ma,Ar,ss,ps,fs,vs,gs,ws,Ss,Nr],Ts=ee.div`
    box-sizing: border-box;

    *,
    *::before,
    *::after {
        box-sizing: inherit;
    }
`,Ls=t=>f.createElement(Ts,null,f.createElement("div",{className:"content"},t.children)),Us={title:"Extra Packages/Cells",decorators:[t=>f.createElement(Ls,null,f.createElement(t,null))]},Rs=ee.div`
    background-color: #2790b9;
    background: linear-gradient(90deg, #2790b9, #2070a9);
    color: white;

    padding: 32px 48px;

    display: flex;
    flex-direction: column;
    height: 100vh;

    font-family: sans-serif;

    & > h1 {
        font-size: 50px;
        font-weight: 600;
        flex-shrink: 0;
        margin: 0 0 12px 0;
    }

    .sizer {
        flex-grow: 1;

        background-color: white;

        border-radius: 12px;
        box-shadow:
            rgba(9, 30, 66, 0.25) 0px 4px 8px -2px,
            rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;

        .sizer-clip {
            border-radius: 12px;
            overflow: hidden;
            transform: translateZ(0);

            height: 100%;
        }
    }
`,_r=t=>{const{title:e,children:r,description:a}=t,{ref:n,width:o,height:l}=oa();return f.createElement(Rs,null,f.createElement("h1",null,e),a,f.createElement("div",{className:"sizer"},f.createElement("div",{className:"sizer-clip",ref:n},f.createElement("div",{style:{position:"relative",width:o??100,height:l??100}},r))))},Br=ee.p`
    font-size: 18px;
    flex-shrink: 0;
    margin: 0 0 20px 0;
`,Wr={smoothScrollX:!0,smoothScrollY:!0,isDraggable:!1,rowMarkers:"none",width:"100%"};let j=1;function B(){return(j=j*16807%2147483647)/2147483647}const ce=[{tag:"Bug",color:"#ff4d4d35"},{tag:"Feature",color:"#35f8ff35"},{tag:"Enhancement",color:"#48ff5735"},{tag:"First Issue",color:"#436fff35"},{tag:"PR",color:"#e0ff3235"},{tag:"Assigned",color:"#ff1eec35"}],Me=()=>f.createElement(_r,{title:"Custom cells",description:f.createElement(Br,null,"Some of our extension cells.")},f.createElement(Bn,{...Wr,customRenderers:zr,onPaste:!0,onCellEdited:(...t)=>console.log("Edit Cell",...t),getCellsForSelection:!0,getCellContent:t=>{const[e,r]=t;if(e===0)return{kind:V.Custom,allowOverlay:!0,copyData:"4",data:{kind:"star-cell",label:"Test",rating:4}};if(e===1){j=r+1;const a=ht(0,15).map(()=>B()*100-50);return{kind:V.Custom,allowOverlay:!1,copyData:"4",data:{kind:"sparkline-cell",values:a,displayValues:a.map(n=>Math.round(n).toString()),color:r%2===0?"#77c4c4":"#D98466",yAxis:[-50,50]}}}else if(e===2){j=r+1;const a=ht(0,15).map(()=>B()*100-50);return{kind:V.Custom,allowOverlay:!1,copyData:"4",data:{kind:"sparkline-cell",values:a,displayValues:a.map(n=>Math.round(n).toString()),color:r%2===0?"#77c4c4":"#D98466",graphKind:"line",hideAxis:!0,yAxis:[-50,50]}}}else{if(e===3)return j=r+1,{kind:V.Custom,allowOverlay:!1,copyData:"4",data:{kind:"sparkline-cell",values:ht(0,15).map(()=>B()*100-50),color:r%2===0?"#77c4c4":"#D98466",graphKind:"bar",yAxis:[-50,50]}};if(e===4)return j=r+1,B(),{kind:V.Custom,allowOverlay:!0,copyData:"4",readonly:r%2===0,data:{kind:"tags-cell",possibleTags:ce,tags:aa([ce[Math.round(B()*1e3)%ce.length].tag,ce[Math.round(B()*1e3)%ce.length].tag,ce[Math.round(B()*1e3)%ce.length].tag,ce[Math.round(B()*1e3)%ce.length].tag])}};if(e===5)return j=r+1,B(),{kind:V.Custom,allowOverlay:!0,copyData:"4",readonly:r%2===0,data:{kind:"user-profile-cell",image:r%2?void 0:"https://i.redd.it/aqc1hwhalsz71.jpg",initial:"B",tint:"#F1D86E",name:r%5?void 0:"Bee bb"}};if(e===6)return j=r+1,B(),{kind:V.Custom,allowOverlay:!0,copyData:"4",readonly:r%2===0,data:{kind:"dropdown-cell",allowedValues:[null,"Good","Better",{value:"best",label:"Best"}],value:"Good"}};if(e===7){j=r+1,B();const a=B();return{kind:V.Custom,allowOverlay:!0,copyData:"4",readonly:r%2===0,data:{kind:"range-cell",min:10,max:30,value:10+Math.round(a*20),step:1,label:`${Math.round(a*100)}%`,measureLabel:"100%",color:r%2===0?"#77c4c4":void 0}}}else{if(e===8)return j=r+1,B(),{kind:V.Custom,allowOverlay:!0,copyData:"4",readonly:r%2===0,data:{kind:"article-cell",markdown:"## This is a test"}};if(e===9)return j=r+1,B(),{kind:V.Custom,allowOverlay:!0,copyData:"4",data:{kind:"spinner-cell"}};if(e===10)return j=r+1,B(),{kind:V.Custom,allowOverlay:!0,copyData:"4",readonly:r%2===0,data:{kind:"date-picker-cell",date:new Date,displayDate:new Date().toISOString(),format:"datetime-local"}};if(e===11)return j=r+1,B(),{kind:V.Custom,allowOverlay:!0,copyData:"4",readonly:r%2===0,data:{kind:"date-picker-cell",date:new Date,displayDate:new Date().toISOString().split("T")[0],format:"date"}};if(e===12)return j=r+1,B(),{kind:V.Custom,allowOverlay:!0,copyData:"4",readonly:r%2===0,data:{kind:"date-picker-cell",date:new Date,displayDate:new Date().toISOString().split("T")[1].replace("Z",""),format:"time"}};if(e===13)return j=r+1,B(),{kind:V.Custom,allowOverlay:!0,copyData:"4",data:{kind:"links-cell",underlineOffset:6,links:[{title:"Linky phone",onClick:()=>alert("Click 1")},{title:"Click the linky dinky",onClick:()=>alert("Click 2")}]}};if(e===14)return j=r+1,B(),{kind:V.Custom,allowOverlay:!0,copyData:"4",readonly:!0,data:{kind:"button-cell",backgroundColor:["transparent","#6572ffee"],color:["accentColor","accentFg"],borderColor:"#6572ffa0",borderRadius:9,title:"View Details",onClick:()=>window.alert("Button clicked")},themeOverride:{baseFontStyle:"700 12px"}};if(e===15)return{kind:V.Custom,allowOverlay:!1,copyData:"4",data:{canOpen:!0,depth:r%3,isOpen:r%7===0,kind:"tree-view-cell",text:"Row "+r,onClickOpener:()=>{alert("Open")}},readonly:!0};if(e===16)return{kind:V.Custom,allowOverlay:!0,copyData:["glide","data","grid"].join(","),readonly:r%2===0,data:{kind:"multi-select-cell",values:["glide","data","grid"],options:[{value:"glide",color:"#ffc38a"},{value:"data",color:"#ebfdea"},{value:"grid",color:"teal"}],allowDuplicates:!1,allowCreation:!0}}}}throw new Error("Fail")},columns:[{title:"Stars",width:100},{title:"Sparkline (area)",width:150},{title:"Sparkline (line)",width:150},{title:"Sparkline (bars)",width:150},{title:"Tags",width:250},{title:"Profile",width:150},{id:"dropdown",title:"Dropdown"},{title:"Range",width:150},{title:"Article",width:150},{title:"Spinner",width:150},{id:"datetime-picker",title:"Datetime Picker"},{id:"date-picker",title:"Date Picker"},{id:"time-picker",title:"Time Picker"},{title:"Links",width:150},{title:"Button",width:120},{id:"treeview",title:"TreeView"},{id:"multiselect",title:"Multiselect"}],rows:500}));Me.parameters={options:{showPanel:!1}};const Ee=()=>{const t=f.useRef([[]]);return f.createElement(_r,{title:"Custom cell editing",description:f.createElement(Br,null,"Cells can be edited and responding to copy/paste using the copyData attribute.")},f.createElement(Bn,{...Wr,customRenderers:zr,onPaste:!0,fillHandle:!0,onCellEdited:(e,r)=>{var o;const[a,n]=e;r.kind===V.Custom&&(((o=t.current)==null?void 0:o[a])==null&&(t.current[a]=[]),Ar.isMatch(r)&&a===0?t.current[a][n]=r.data.value??"":Nr.isMatch(r)&&(a===1||a===2)&&(t.current[a][n]=r.data.values??[]))},getCellsForSelection:!0,getCellContent:e=>{var n,o,l,s,i,u;const[r,a]=e;if(r===0){const c=((o=(n=t.current)==null?void 0:n[r])==null?void 0:o[a])??"A";return{kind:V.Custom,allowOverlay:!0,copyData:c,data:{kind:"dropdown-cell",allowedValues:["A","B","C"],value:c}}}else if(r===1){const c=((s=(l=t.current)==null?void 0:l[r])==null?void 0:s[a])??["glide"];return{kind:V.Custom,allowOverlay:!0,copyData:c==null?void 0:c.join(","),data:{kind:"multi-select-cell",values:c,options:[{value:"glide",color:"#ffc38a",label:"Glide"},{value:"data",color:"#ebfdea",label:"Data"},{value:"grid",color:"teal",label:"Grid"}],allowDuplicates:!1,allowCreation:!0}}}else if(r===2){const c=((u=(i=t.current)==null?void 0:i[r])==null?void 0:u[a])??["glide data grid"];return{kind:V.Custom,allowOverlay:!0,copyData:c==null?void 0:c.join(","),data:{kind:"multi-select-cell",values:c,allowDuplicates:!0,allowCreation:!0}}}throw new Error("Fail")},columns:[{title:"Dropdown",width:150},{title:"Multi Select",width:200,themeOverride:{roundingRadius:4}},{title:"Multi Select (no options)",width:200}],rows:500}))};Ee.parameters={options:{showPanel:!1}};var Fn,$n,An;Me.parameters={...Me.parameters,docs:{...(Fn=Me.parameters)==null?void 0:Fn.docs,source:{originalSource:`() => {
  return <BeautifulWrapper title="Custom cells" description={<Description>Some of our extension cells.</Description>}>
            <DataEditor {...defaultProps} customRenderers={allCells} onPaste={true}
    // eslint-disable-next-line no-console
    onCellEdited={(...args) => console.log("Edit Cell", ...args)} getCellsForSelection={true} getCellContent={cell => {
      const [col, row] = cell;
      if (col === 0) {
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: "4",
          data: {
            kind: "star-cell",
            label: "Test",
            rating: 4
          }
        } as StarCell;
      } else if (col === 1) {
        num = row + 1;
        const values = range(0, 15).map(() => rand() * 100 - 50);
        return {
          kind: GridCellKind.Custom,
          allowOverlay: false,
          copyData: "4",
          data: {
            kind: "sparkline-cell",
            values,
            displayValues: values.map(x => Math.round(x).toString()),
            color: row % 2 === 0 ? "#77c4c4" : "#D98466",
            yAxis: [-50, 50]
          }
        } as SparklineCell;
      } else if (col === 2) {
        num = row + 1;
        const values = range(0, 15).map(() => rand() * 100 - 50);
        return {
          kind: GridCellKind.Custom,
          allowOverlay: false,
          copyData: "4",
          data: {
            kind: "sparkline-cell",
            values,
            displayValues: values.map(x => Math.round(x).toString()),
            color: row % 2 === 0 ? "#77c4c4" : "#D98466",
            graphKind: "line",
            hideAxis: true,
            yAxis: [-50, 50]
          }
        } as SparklineCell;
      } else if (col === 3) {
        num = row + 1;
        return {
          kind: GridCellKind.Custom,
          allowOverlay: false,
          copyData: "4",
          data: {
            kind: "sparkline-cell",
            values: range(0, 15).map(() => rand() * 100 - 50),
            color: row % 2 === 0 ? "#77c4c4" : "#D98466",
            graphKind: "bar",
            yAxis: [-50, 50]
          }
        } as SparklineCell;
      } else if (col === 4) {
        num = row + 1;
        rand();
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: "4",
          readonly: row % 2 === 0,
          data: {
            kind: "tags-cell",
            possibleTags: possibleTags,
            tags: uniq([possibleTags[Math.round(rand() * 1000) % possibleTags.length].tag, possibleTags[Math.round(rand() * 1000) % possibleTags.length].tag, possibleTags[Math.round(rand() * 1000) % possibleTags.length].tag, possibleTags[Math.round(rand() * 1000) % possibleTags.length].tag])
          }
        } as TagsCell;
      } else if (col === 5) {
        num = row + 1;
        rand();
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: "4",
          readonly: row % 2 === 0,
          data: {
            kind: "user-profile-cell",
            image: row % 2 ? undefined : "https://i.redd.it/aqc1hwhalsz71.jpg",
            initial: "B",
            tint: "#F1D86E",
            name: row % 5 ? undefined : "Bee bb"
          }
        } as UserProfileCell;
      } else if (col === 6) {
        num = row + 1;
        rand();
        const d: DropdownCell = {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: "4",
          readonly: row % 2 === 0,
          data: {
            kind: "dropdown-cell",
            allowedValues: [null, "Good", "Better", {
              value: "best",
              label: "Best"
            }],
            value: "Good"
          }
        };
        return d;
      } else if (col === 7) {
        num = row + 1;
        rand();
        const v = rand();
        const d: RangeCell = {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: "4",
          readonly: row % 2 === 0,
          data: {
            kind: "range-cell",
            min: 10,
            max: 30,
            value: 10 + Math.round(v * 20),
            step: 1,
            label: \`\${Math.round(v * 100)}%\`,
            measureLabel: "100%",
            color: row % 2 === 0 ? "#77c4c4" : undefined
          }
        };
        return d;
      } else if (col === 8) {
        num = row + 1;
        rand();
        const d: ArticleCell = {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: "4",
          readonly: row % 2 === 0,
          data: {
            kind: "article-cell",
            markdown: "## This is a test"
          }
        };
        return d;
      } else if (col === 9) {
        num = row + 1;
        rand();
        const d: SpinnerCell = {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: "4",
          data: {
            kind: "spinner-cell"
          }
        };
        return d;
      } else if (col === 10) {
        num = row + 1;
        rand();
        const d: DatePickerCell = {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: "4",
          readonly: row % 2 === 0,
          data: {
            kind: "date-picker-cell",
            date: new Date(),
            displayDate: new Date().toISOString(),
            format: "datetime-local"
          }
        };
        return d;
      } else if (col === 11) {
        num = row + 1;
        rand();
        const d: DatePickerCell = {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: "4",
          readonly: row % 2 === 0,
          data: {
            kind: "date-picker-cell",
            date: new Date(),
            displayDate: new Date().toISOString().split("T")[0],
            format: "date"
          }
        };
        return d;
      } else if (col === 12) {
        num = row + 1;
        rand();
        const d: DatePickerCell = {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: "4",
          readonly: row % 2 === 0,
          data: {
            kind: "date-picker-cell",
            date: new Date(),
            displayDate: new Date().toISOString().split("T")[1].replace("Z", ""),
            format: "time"
          }
        };
        return d;
      } else if (col === 13) {
        num = row + 1;
        rand();
        const d: LinksCell = {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: "4",
          data: {
            kind: "links-cell",
            underlineOffset: 6,
            links: [{
              title: "Linky phone",
              onClick: () => alert("Click 1")
            }, {
              title: "Click the linky dinky",
              onClick: () => alert("Click 2")
            }]
          }
        };
        return d;
      } else if (col === 14) {
        num = row + 1;
        rand();
        const d: ButtonCell = {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: "4",
          readonly: true,
          data: {
            kind: "button-cell",
            backgroundColor: ["transparent", "#6572ffee"],
            color: ["accentColor", "accentFg"],
            borderColor: "#6572ffa0",
            borderRadius: 9,
            title: "View Details",
            onClick: () => window.alert("Button clicked")
          },
          themeOverride: {
            baseFontStyle: "700 12px"
          }
        };
        return d;
      } else if (col === 15) {
        const t: TreeViewCell = {
          kind: GridCellKind.Custom,
          allowOverlay: false,
          copyData: "4",
          data: {
            canOpen: true,
            depth: row % 3,
            isOpen: row % 7 === 0,
            kind: "tree-view-cell",
            text: "Row " + row,
            onClickOpener: () => {
              alert("Open");
              return undefined;
            }
          },
          readonly: true
        };
        return t;
      } else if (col === 16) {
        const t: MultiSelectCell = {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: ["glide", "data", "grid"].join(","),
          readonly: row % 2 === 0,
          data: {
            kind: "multi-select-cell",
            values: ["glide", "data", "grid"],
            options: [{
              value: "glide",
              color: "#ffc38a"
            }, {
              value: "data",
              color: "#ebfdea"
            }, {
              value: "grid",
              color: "teal"
            }],
            allowDuplicates: false,
            allowCreation: true
          }
        };
        return t;
      }
      throw new Error("Fail");
    }} columns={[{
      title: "Stars",
      width: 100
    }, {
      title: "Sparkline (area)",
      width: 150
    }, {
      title: "Sparkline (line)",
      width: 150
    }, {
      title: "Sparkline (bars)",
      width: 150
    }, {
      title: "Tags",
      width: 250
    }, {
      title: "Profile",
      width: 150
    }, {
      id: "dropdown",
      title: "Dropdown"
    }, {
      title: "Range",
      width: 150
    }, {
      title: "Article",
      width: 150
    }, {
      title: "Spinner",
      width: 150
    }, {
      id: "datetime-picker",
      title: "Datetime Picker"
    }, {
      id: "date-picker",
      title: "Date Picker"
    }, {
      id: "time-picker",
      title: "Time Picker"
    }, {
      title: "Links",
      width: 150
    }, {
      title: "Button",
      width: 120
    }, {
      id: "treeview",
      title: "TreeView"
    }, {
      id: "multiselect",
      title: "Multiselect"
    }]} rows={500} />
        </BeautifulWrapper>;
}`,...(An=($n=Me.parameters)==null?void 0:$n.docs)==null?void 0:An.source}}};var Hn,Nn,zn;Ee.parameters={...Ee.parameters,docs:{...(Hn=Ee.parameters)==null?void 0:Hn.docs,source:{originalSource:`() => {
  const data = React.useRef<any[][]>([[]]);
  return <BeautifulWrapper title="Custom cell editing" description={<Description>
                    Cells can be edited and responding to copy/paste using the copyData attribute.
                </Description>}>
            <DataEditor {...defaultProps} customRenderers={allCells} onPaste={true} fillHandle={true} onCellEdited={(cell, newVal) => {
      const [col, row] = cell;
      if (newVal.kind !== GridCellKind.Custom) {
        return;
      }
      if (data.current?.[col] == null) {
        data.current[col] = [];
      }
      if (DropdownRenderer.isMatch(newVal) && col === 0) {
        data.current[col][row] = newVal.data.value ?? "";
      } else if (MultiSelectRenderer.isMatch(newVal) && (col === 1 || col === 2)) {
        data.current[col][row] = newVal.data.values ?? [];
      }
    }} getCellsForSelection={true} getCellContent={cell => {
      const [col, row] = cell;
      if (col === 0) {
        const val = data.current?.[col]?.[row] ?? "A";
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: val,
          data: {
            kind: "dropdown-cell",
            allowedValues: ["A", "B", "C"],
            value: val
          }
        } as DropdownCell;
      } else if (col === 1) {
        const val = data.current?.[col]?.[row] ?? ["glide"];
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: val?.join(","),
          data: {
            kind: "multi-select-cell",
            values: val,
            options: [{
              value: "glide",
              color: "#ffc38a",
              label: "Glide"
            }, {
              value: "data",
              color: "#ebfdea",
              label: "Data"
            }, {
              value: "grid",
              color: "teal",
              label: "Grid"
            }],
            allowDuplicates: false,
            allowCreation: true
          }
        } as MultiSelectCell;
      } else if (col === 2) {
        const val = data.current?.[col]?.[row] ?? ["glide data grid"];
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: val?.join(","),
          data: {
            kind: "multi-select-cell",
            values: val,
            allowDuplicates: true,
            allowCreation: true
          }
        } as MultiSelectCell;
      }
      throw new Error("Fail");
    }} columns={[{
      title: "Dropdown",
      width: 150
    }, {
      title: "Multi Select",
      width: 200,
      themeOverride: {
        roundingRadius: 4
      }
    }, {
      title: "Multi Select (no options)",
      width: 200
    }]} rows={500} />
        </BeautifulWrapper>;
}`,...(zn=(Nn=Ee.parameters)==null?void 0:Nn.docs)==null?void 0:zn.source}}};const Gs=["CustomCells","CustomCellEditing"];export{Ee as CustomCellEditing,Me as CustomCells,Gs as __namedExportsOrder,Us as default};
