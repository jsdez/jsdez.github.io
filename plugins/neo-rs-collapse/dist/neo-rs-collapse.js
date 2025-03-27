/*! For license information please see neo-rs-collapse.js.LICENSE.txt */
(()=>{"use strict";const t=window,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;class n{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}}const o=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,i))(e)})(t):t;var r;const l=window,h=l.trustedTypes,a=h?h.emptyScript:"",c=l.reactiveElementPolyfillSupport,d={toAttribute(t,e){switch(e){case Boolean:t=t?a:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},u=(t,e)=>e!==t&&(e==e||t==t),p={attribute:!0,type:String,converter:d,reflect:!1,hasChanged:u};class v extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,i)=>{const s=this._$Ep(i,e);void 0!==s&&(this._$Ev.set(s,i),t.push(s))})),t}static createProperty(t,e=p){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,i,e);void 0!==s&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){const n=this[t];this[e]=s,this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||p}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var i;const s=null!==(i=this.shadowRoot)&&void 0!==i?i:this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{e?i.adoptedStyleSheets=s.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):s.forEach((e=>{const s=document.createElement("style"),n=t.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=e.cssText,i.appendChild(s)}))})(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=p){var s;const n=this.constructor._$Ep(t,i);if(void 0!==n&&!0===i.reflect){const o=(void 0!==(null===(s=i.converter)||void 0===s?void 0:s.toAttribute)?i.converter:d).toAttribute(e,i.type);this._$El=t,null==o?this.removeAttribute(n):this.setAttribute(n,o),this._$El=null}}_$AK(t,e){var i;const s=this.constructor,n=s._$Ev.get(t);if(void 0!==n&&this._$El!==n){const t=s.getPropertyOptions(n),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:d;this._$El=n,this[n]=o.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let s=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||u)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,e)=>this[e]=t)),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,e)=>this._$EO(e,this[e],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}var $;v.finalized=!0,v.elementProperties=new Map,v.elementStyles=[],v.shadowRootOptions={mode:"open"},null==c||c({ReactiveElement:v}),(null!==(r=l.reactiveElementVersions)&&void 0!==r?r:l.reactiveElementVersions=[]).push("1.6.1");const g=window,f=g.trustedTypes,_=f?f.createPolicy("lit-html",{createHTML:t=>t}):void 0,m=`lit$${(Math.random()+"").slice(9)}$`,y="?"+m,A=`<${y}>`,S=document,b=(t="")=>S.createComment(t),C=t=>null===t||"object"!=typeof t&&"function"!=typeof t,E=Array.isArray,w=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,x=/-->/g,N=/>/g,O=RegExp(">|[ \t\n\f\r](?:([^\\s\"'>=/]+)([ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r\"'`<>=]|(\"|')|))|$)","g"),I=/'/g,P=/"/g,U=/^(?:script|style|textarea|title)$/i,T=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),H=(T(1),T(2),Symbol.for("lit-noChange")),R=Symbol.for("lit-nothing"),k=new WeakMap,M=S.createTreeWalker(S,129,null,!1),z=(t,e)=>{const i=t.length-1,s=[];let n,o=2===e?"<svg>":"",r=w;for(let e=0;e<i;e++){const i=t[e];let l,h,a=-1,c=0;for(;c<i.length&&(r.lastIndex=c,h=r.exec(i),null!==h);)c=r.lastIndex,r===w?"!--"===h[1]?r=x:void 0!==h[1]?r=N:void 0!==h[2]?(U.test(h[2])&&(n=RegExp("</"+h[2],"g")),r=O):void 0!==h[3]&&(r=O):r===O?">"===h[0]?(r=null!=n?n:w,a=-1):void 0===h[1]?a=-2:(a=r.lastIndex-h[2].length,l=h[1],r=void 0===h[3]?O:'"'===h[3]?P:I):r===P||r===I?r=O:r===x||r===N?r=w:(r=O,n=void 0);const d=r===O&&t[e+1].startsWith("/>")?" ":"";o+=r===w?i+A:a>=0?(s.push(l),i.slice(0,a)+"$lit$"+i.slice(a)+m+d):i+m+(-2===a?(s.push(void 0),e):d)}const l=o+(t[i]||"<?>")+(2===e?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==_?_.createHTML(l):l,s]};class L{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0;const r=t.length-1,l=this.parts,[h,a]=z(t,e);if(this.el=L.createElement(h,i),M.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(s=M.nextNode())&&l.length<r;){if(1===s.nodeType){if(s.hasAttributes()){const t=[];for(const e of s.getAttributeNames())if(e.endsWith("$lit$")||e.startsWith(m)){const i=a[o++];if(t.push(e),void 0!==i){const t=s.getAttribute(i.toLowerCase()+"$lit$").split(m),e=/([.?@])?(.*)/.exec(i);l.push({type:1,index:n,name:e[2],strings:t,ctor:"."===e[1]?V:"?"===e[1]?J:"@"===e[1]?K:D})}else l.push({type:6,index:n})}for(const e of t)s.removeAttribute(e)}if(U.test(s.tagName)){const t=s.textContent.split(m),e=t.length-1;if(e>0){s.textContent=f?f.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],b()),M.nextNode(),l.push({type:2,index:++n});s.append(t[e],b())}}}else if(8===s.nodeType)if(s.data===y)l.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(m,t+1));)l.push({type:7,index:n}),t+=m.length-1}n++}}static createElement(t,e){const i=S.createElement("template");return i.innerHTML=t,i}}function j(t,e,i=t,s){var n,o,r,l;if(e===H)return e;let h=void 0!==s?null===(n=i._$Co)||void 0===n?void 0:n[s]:i._$Cl;const a=C(e)?void 0:e._$litDirective$;return(null==h?void 0:h.constructor)!==a&&(null===(o=null==h?void 0:h._$AO)||void 0===o||o.call(h,!1),void 0===a?h=void 0:(h=new a(t),h._$AT(t,i,s)),void 0!==s?(null!==(r=(l=i)._$Co)&&void 0!==r?r:l._$Co=[])[s]=h:i._$Cl=h),void 0!==h&&(e=j(t,h._$AS(t,e.values),h,s)),e}class B{constructor(t,e){this.u=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}v(t){var e;const{el:{content:i},parts:s}=this._$AD,n=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:S).importNode(i,!0);M.currentNode=n;let o=M.nextNode(),r=0,l=0,h=s[0];for(;void 0!==h;){if(r===h.index){let e;2===h.type?e=new q(o,o.nextSibling,this,t):1===h.type?e=new h.ctor(o,h.name,h.strings,this,t):6===h.type&&(e=new Z(o,this,t)),this.u.push(e),h=s[++l]}r!==(null==h?void 0:h.index)&&(o=M.nextNode(),r++)}return n}p(t){let e=0;for(const i of this.u)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class q{constructor(t,e,i,s){var n;this.type=2,this._$AH=R,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cm=null===(n=null==s?void 0:s.isConnected)||void 0===n||n}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cm}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=j(this,t,e),C(t)?t===R||null==t||""===t?(this._$AH!==R&&this._$AR(),this._$AH=R):t!==this._$AH&&t!==H&&this.g(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>E(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.k(t):this.g(t)}O(t,e=this._$AB){return this._$AA.parentNode.insertBefore(t,e)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}g(t){this._$AH!==R&&C(this._$AH)?this._$AA.nextSibling.data=t:this.T(S.createTextNode(t)),this._$AH=t}$(t){var e;const{values:i,_$litType$:s}=t,n="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=L.createElement(s.h,this.options)),s);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===n)this._$AH.p(i);else{const t=new B(n,this),e=t.v(this.options);t.p(i),this.T(e),this._$AH=t}}_$AC(t){let e=k.get(t.strings);return void 0===e&&k.set(t.strings,e=new L(t)),e}k(t){E(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new q(this.O(b()),this.O(b()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cm=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class D{constructor(t,e,i,s,n){this.type=1,this._$AH=R,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=R}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(void 0===n)t=j(this,t,e,0),o=!C(t)||t!==this._$AH&&t!==H,o&&(this._$AH=t);else{const s=t;let r,l;for(t=n[0],r=0;r<n.length-1;r++)l=j(this,s[i+r],e,r),l===H&&(l=this._$AH[r]),o||(o=!C(l)||l!==this._$AH[r]),l===R?t=R:t!==R&&(t+=(null!=l?l:"")+n[r+1]),this._$AH[r]=l}o&&!s&&this.j(t)}j(t){t===R?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class V extends D{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===R?void 0:t}}const W=f?f.emptyScript:"";class J extends D{constructor(){super(...arguments),this.type=4}j(t){t&&t!==R?this.element.setAttribute(this.name,W):this.element.removeAttribute(this.name)}}class K extends D{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=j(this,t,e,0))&&void 0!==i?i:R)===H)return;const s=this._$AH,n=t===R&&s!==R||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==R&&(s===R||n);n&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class Z{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){j(this,t)}}const F=g.litHtmlPolyfillSupport;var G,Q;null==F||F(L,q),(null!==($=g.litHtmlVersions)&&void 0!==$?$:g.litHtmlVersions=[]).push("2.6.1");class X extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var s,n;const o=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:e;let r=o._$litPart$;if(void 0===r){const t=null!==(n=null==i?void 0:i.renderBefore)&&void 0!==n?n:null;o._$litPart$=r=new q(e.insertBefore(b(),t),t,void 0,null!=i?i:{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return H}}X.finalized=!0,X._$litElement$=!0,null===(G=globalThis.litElementHydrateSupport)||void 0===G||G.call(globalThis,{LitElement:X});const Y=globalThis.litElementPolyfillSupport;null==Y||Y({LitElement:X}),(null!==(Q=globalThis.litElementVersions)&&void 0!==Q?Q:globalThis.litElementVersions=[]).push("3.2.2");class tt extends X{static getMetaConfig(){return{controlName:"neo-rs-collapse",fallbackDisableSubmit:!1,description:"Collapsible Repeating Sections",iconUrl:"",groupName:"NEO",version:"1.0",properties:{targetClass:{type:"string",title:"Repeating Section CSS Class",description:"Please enter the class used to target the repeating section"},nameInputClass:{type:"string",title:"Input Name CSS Class",description:"If you wish to have a dynamic section name, Please enter the class used to target input inside the section containing the section name"},sectionName:{type:"string",title:"Manual Section Name",description:"If you wish to name each section the same, enter it here, the name will be used followed by a number, e.g. entering Item will result in Item 1, Item 2,..."},sectionCount:{title:"Section Count",type:"number",description:"Please enter a formula which counts the repeating section using the count() function e.g. count([Form].[Repeating section 1])"},showIcon:{title:"Show Icon",type:"boolean",defaultValue:!0},showName:{title:"Show Name",type:"boolean",defaultValue:!0}},standardProperties:{fieldLabel:!0,description:!0}}}static properties={sectionName:{type:String},sectionCount:{type:Number},targetClass:{type:String},showIcon:{type:Boolean},showName:{type:Boolean}};constructor(){super(),this.sectionName="Section",this.sectionCount=0,this.targetClass="",this.showIcon=!0,this.showName=!0,this.lastOpenIndex=-1,this.isInitializing=!1,this.previousSectionCount=0}connectedCallback(){super.connectedCallback(),this._initTimer=setTimeout((()=>{this.initCollapsibleSections(),this.observeRepeatingSection()}),200)}createChevronIcon(t){const e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("version","1.1"),e.setAttribute("width","34"),e.setAttribute("height","34"),e.setAttribute("viewBox","0 0 36 36"),e.classList.add("nx-icon--allow-events"),e.style.transition="transform 0.2s ease-in-out";const i=document.createElementNS("http://www.w3.org/2000/svg","use");return i.setAttribute("href",t?"#chevron-down":"#chevron-right"),e.appendChild(i),e}updateChevronState(t,e){if(!t)return;const i=t.querySelector("use");i&&i.setAttribute("href",e?"#chevron-down":"#chevron-right")}initCollapsibleSections(){if(!this.isInitializing){this.isInitializing=!0;try{const t=document.querySelector(`.${this.targetClass}`);if(!t)return console.error(`No repeating section found with class: ${this.targetClass}`),void(this.isInitializing=!1);const e=t.querySelectorAll(".ntx-repeating-section-repeated-section");if(0===e.length)return console.error("No sections found to make collapsible"),void(this.isInitializing=!1);(e.length>this.previousSectionCount||this.lastOpenIndex>=e.length||this.lastOpenIndex<-1)&&(this.lastOpenIndex=e.length-1);const i=-1===this.lastOpenIndex?e.length-1:Math.min(this.lastOpenIndex,e.length-1);e.forEach(((t,s)=>{const n=[".nx-form-runtime-light",".nx-form-runtime","[data-form-content]",".ng-star-inserted > div",".nx-form-runtime-section"];let o=null;for(const e of n)if(o=t.querySelector(e),o)break;if(!o)return void console.error(`No content found to toggle for section ${s}`);const r=t.querySelector(".ntx-repeating-section-overlay");if(!r)return void console.error(`No overlay found for section ${s}`);Object.assign(r.style,{cursor:"pointer",padding:"0px 0px 0px 10px",backgroundColor:"#f0f0f0",border:"1px solid #ddd",userSelect:"none",display:"flex",justifyContent:"flex-start",alignItems:"center",gap:"10px"}),r.innerHTML="";const l=document.createElement("div");if(l.style.display="flex",l.style.alignItems="center",l.style.gap="10px",l.style.width="100%",this.showIcon){const t=s===i,e=this.createChevronIcon(t);l.appendChild(e)}if(this.showName){const t=document.createElement("span");t.textContent=`${this.sectionName} ${s+1}`,t.style.fontWeight="bold",t.style.marginRight="auto",l.appendChild(t)}r.appendChild(l);const h=s===i;o.style.display=h?"block":"none",r.style.backgroundColor=h?"#e0e0e0":"#f0f0f0",r.onclick=t=>{t.target.closest(".ntx-repeating-section-remove-button")||(this.lastOpenIndex=s,e.forEach(((t,e)=>{let i=null;for(const e of n)if(i=t.querySelector(e),i)break;const o=t.querySelector(".ntx-repeating-section-overlay"),r=o?.querySelector("svg");if(i&&o){const t=e===s;i.style.display=t?"block":"none",o.style.backgroundColor=t?"#e0e0e0":"#f0f0f0",r&&this.updateChevronState(r,t)}})))}})),this.lastOpenIndex=i,this.previousSectionCount=e.length}catch(t){console.error("Error in initCollapsibleSections:",t)}finally{this.isInitializing=!1}}}observeRepeatingSection(){const t=document.querySelector(`.${this.targetClass}`);t&&new MutationObserver((()=>{clearTimeout(this._observerTimer),this._observerTimer=setTimeout((()=>{const e=t.querySelectorAll(".ntx-repeating-section-repeated-section");0===e.length?(this.lastOpenIndex=-1,this.previousSectionCount=0):this.lastOpenIndex>=e.length&&(this.lastOpenIndex=e.length-1),this.initCollapsibleSections()}),100)})).observe(t,{childList:!0,subtree:!0})}render(){return null}}customElements.define("neo-rs-collapse",tt)})();