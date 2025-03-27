/*! For license information please see neo-rs-collapse.js.LICENSE.txt */
(()=>{"use strict";const t=window,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;class n{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}}const o=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,i))(e)})(t):t;var r;const l=window,a=l.trustedTypes,h=a?a.emptyScript:"",c=l.reactiveElementPolyfillSupport,d={toAttribute(t,e){switch(e){case Boolean:t=t?h:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},u=(t,e)=>e!==t&&(e==e||t==t),p={attribute:!0,type:String,converter:d,reflect:!1,hasChanged:u};class v extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,i)=>{const s=this._$Ep(i,e);void 0!==s&&(this._$Ev.set(s,i),t.push(s))})),t}static createProperty(t,e=p){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,i,e);void 0!==s&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){const n=this[t];this[e]=s,this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||p}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var i;const s=null!==(i=this.shadowRoot)&&void 0!==i?i:this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{e?i.adoptedStyleSheets=s.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):s.forEach((e=>{const s=document.createElement("style"),n=t.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=e.cssText,i.appendChild(s)}))})(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=p){var s;const n=this.constructor._$Ep(t,i);if(void 0!==n&&!0===i.reflect){const o=(void 0!==(null===(s=i.converter)||void 0===s?void 0:s.toAttribute)?i.converter:d).toAttribute(e,i.type);this._$El=t,null==o?this.removeAttribute(n):this.setAttribute(n,o),this._$El=null}}_$AK(t,e){var i;const s=this.constructor,n=s._$Ev.get(t);if(void 0!==n&&this._$El!==n){const t=s.getPropertyOptions(n),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:d;this._$El=n,this[n]=o.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let s=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||u)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,e)=>this[e]=t)),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,e)=>this._$EO(e,this[e],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}var $;v.finalized=!0,v.elementProperties=new Map,v.elementStyles=[],v.shadowRootOptions={mode:"open"},null==c||c({ReactiveElement:v}),(null!==(r=l.reactiveElementVersions)&&void 0!==r?r:l.reactiveElementVersions=[]).push("1.6.1");const g=window,f=g.trustedTypes,m=f?f.createPolicy("lit-html",{createHTML:t=>t}):void 0,_=`lit$${(Math.random()+"").slice(9)}$`,y="?"+_,A=`<${y}>`,S=document,b=(t="")=>S.createComment(t),C=t=>null===t||"object"!=typeof t&&"function"!=typeof t,E=Array.isArray,w=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,x=/-->/g,I=/>/g,N=RegExp(">|[ \t\n\f\r](?:([^\\s\"'>=/]+)([ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r\"'`<>=]|(\"|')|))|$)","g"),P=/'/g,O=/"/g,U=/^(?:script|style|textarea|title)$/i,T=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),H=T(1),R=(T(2),Symbol.for("lit-noChange")),k=Symbol.for("lit-nothing"),M=new WeakMap,z=S.createTreeWalker(S,129,null,!1),L=(t,e)=>{const i=t.length-1,s=[];let n,o=2===e?"<svg>":"",r=w;for(let e=0;e<i;e++){const i=t[e];let l,a,h=-1,c=0;for(;c<i.length&&(r.lastIndex=c,a=r.exec(i),null!==a);)c=r.lastIndex,r===w?"!--"===a[1]?r=x:void 0!==a[1]?r=I:void 0!==a[2]?(U.test(a[2])&&(n=RegExp("</"+a[2],"g")),r=N):void 0!==a[3]&&(r=N):r===N?">"===a[0]?(r=null!=n?n:w,h=-1):void 0===a[1]?h=-2:(h=r.lastIndex-a[2].length,l=a[1],r=void 0===a[3]?N:'"'===a[3]?O:P):r===O||r===P?r=N:r===x||r===I?r=w:(r=N,n=void 0);const d=r===N&&t[e+1].startsWith("/>")?" ":"";o+=r===w?i+A:h>=0?(s.push(l),i.slice(0,h)+"$lit$"+i.slice(h)+_+d):i+_+(-2===h?(s.push(void 0),e):d)}const l=o+(t[i]||"<?>")+(2===e?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==m?m.createHTML(l):l,s]};class q{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0;const r=t.length-1,l=this.parts,[a,h]=L(t,e);if(this.el=q.createElement(a,i),z.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(s=z.nextNode())&&l.length<r;){if(1===s.nodeType){if(s.hasAttributes()){const t=[];for(const e of s.getAttributeNames())if(e.endsWith("$lit$")||e.startsWith(_)){const i=h[o++];if(t.push(e),void 0!==i){const t=s.getAttribute(i.toLowerCase()+"$lit$").split(_),e=/([.?@])?(.*)/.exec(i);l.push({type:1,index:n,name:e[2],strings:t,ctor:"."===e[1]?W:"?"===e[1]?K:"@"===e[1]?Z:V})}else l.push({type:6,index:n})}for(const e of t)s.removeAttribute(e)}if(U.test(s.tagName)){const t=s.textContent.split(_),e=t.length-1;if(e>0){s.textContent=f?f.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],b()),z.nextNode(),l.push({type:2,index:++n});s.append(t[e],b())}}}else if(8===s.nodeType)if(s.data===y)l.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(_,t+1));)l.push({type:7,index:n}),t+=_.length-1}n++}}static createElement(t,e){const i=S.createElement("template");return i.innerHTML=t,i}}function j(t,e,i=t,s){var n,o,r,l;if(e===R)return e;let a=void 0!==s?null===(n=i._$Co)||void 0===n?void 0:n[s]:i._$Cl;const h=C(e)?void 0:e._$litDirective$;return(null==a?void 0:a.constructor)!==h&&(null===(o=null==a?void 0:a._$AO)||void 0===o||o.call(a,!1),void 0===h?a=void 0:(a=new h(t),a._$AT(t,i,s)),void 0!==s?(null!==(r=(l=i)._$Co)&&void 0!==r?r:l._$Co=[])[s]=a:i._$Cl=a),void 0!==a&&(e=j(t,a._$AS(t,e.values),a,s)),e}class B{constructor(t,e){this.u=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}v(t){var e;const{el:{content:i},parts:s}=this._$AD,n=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:S).importNode(i,!0);z.currentNode=n;let o=z.nextNode(),r=0,l=0,a=s[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new D(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new F(o,this,t)),this.u.push(e),a=s[++l]}r!==(null==a?void 0:a.index)&&(o=z.nextNode(),r++)}return n}p(t){let e=0;for(const i of this.u)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class D{constructor(t,e,i,s){var n;this.type=2,this._$AH=k,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cm=null===(n=null==s?void 0:s.isConnected)||void 0===n||n}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cm}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=j(this,t,e),C(t)?t===k||null==t||""===t?(this._$AH!==k&&this._$AR(),this._$AH=k):t!==this._$AH&&t!==R&&this.g(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>E(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.k(t):this.g(t)}O(t,e=this._$AB){return this._$AA.parentNode.insertBefore(t,e)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}g(t){this._$AH!==k&&C(this._$AH)?this._$AA.nextSibling.data=t:this.T(S.createTextNode(t)),this._$AH=t}$(t){var e;const{values:i,_$litType$:s}=t,n="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=q.createElement(s.h,this.options)),s);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===n)this._$AH.p(i);else{const t=new B(n,this),e=t.v(this.options);t.p(i),this.T(e),this._$AH=t}}_$AC(t){let e=M.get(t.strings);return void 0===e&&M.set(t.strings,e=new q(t)),e}k(t){E(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new D(this.O(b()),this.O(b()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cm=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class V{constructor(t,e,i,s,n){this.type=1,this._$AH=k,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=k}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(void 0===n)t=j(this,t,e,0),o=!C(t)||t!==this._$AH&&t!==R,o&&(this._$AH=t);else{const s=t;let r,l;for(t=n[0],r=0;r<n.length-1;r++)l=j(this,s[i+r],e,r),l===R&&(l=this._$AH[r]),o||(o=!C(l)||l!==this._$AH[r]),l===k?t=k:t!==k&&(t+=(null!=l?l:"")+n[r+1]),this._$AH[r]=l}o&&!s&&this.j(t)}j(t){t===k?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class W extends V{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===k?void 0:t}}const J=f?f.emptyScript:"";class K extends V{constructor(){super(...arguments),this.type=4}j(t){t&&t!==k?this.element.setAttribute(this.name,J):this.element.removeAttribute(this.name)}}class Z extends V{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=j(this,t,e,0))&&void 0!==i?i:k)===R)return;const s=this._$AH,n=t===k&&s!==k||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==k&&(s===k||n);n&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class F{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){j(this,t)}}const G=g.litHtmlPolyfillSupport;var Q,X;null==G||G(q,D),(null!==($=g.litHtmlVersions)&&void 0!==$?$:g.litHtmlVersions=[]).push("2.6.1");class Y extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var s,n;const o=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:e;let r=o._$litPart$;if(void 0===r){const t=null!==(n=null==i?void 0:i.renderBefore)&&void 0!==n?n:null;o._$litPart$=r=new D(e.insertBefore(b(),t),t,void 0,null!=i?i:{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return R}}Y.finalized=!0,Y._$litElement$=!0,null===(Q=globalThis.litElementHydrateSupport)||void 0===Q||Q.call(globalThis,{LitElement:Y});const tt=globalThis.litElementPolyfillSupport;null==tt||tt({LitElement:Y}),(null!==(X=globalThis.litElementVersions)&&void 0!==X?X:globalThis.litElementVersions=[]).push("3.2.2");class et extends Y{static getMetaConfig(){return{controlName:"neo-rs-collapse",fallbackDisableSubmit:!1,description:"Collapsible Repeating Sections",iconUrl:"",groupName:"NEO",version:"1.0",properties:{targetClass:{type:"string",title:"Repeating Section CSS Class",description:"Please enter the class used to target the repeating section"},nameInputClass:{type:"string",title:"Input Name CSS Class",description:"If you wish to have a dynamic section name, Please enter the class used to target input inside the section containing the section name"},sectionName:{type:"string",title:"Manual Section Name",description:"If you wish to name each section the same, enter it here, the name will be used followed by a number, e.g. entering Item will result in Item 1, Item 2,..."},sectionCount:{title:"Section Count",type:"number",description:"Please enter a formula which counts the repeating section using the count() function e.g. count([Form].[Repeating section 1])"},showIcon:{title:"Show Icon",type:"boolean",defaultValue:!0},showName:{title:"Show Name",type:"boolean",defaultValue:!0}},standardProperties:{fieldLabel:!0,description:!0}}}static properties={sectionName:{type:String},nameInputClass:{type:String},sectionCount:{type:Number},targetClass:{type:String},showIcon:{type:Boolean},showName:{type:Boolean}};constructor(){super(),this.sectionName="Section",this.nameInputClass="section-name",this.sectionCount=0,this.targetClass="",this.showIcon=!0,this.showName=!0,this.lastOpenIndex=-1,this.isInitializing=!1,this.previousSectionCount=0}connectedCallback(){super.connectedCallback(),this._initTimer=setTimeout((()=>{this.initCollapsibleSections(),this.observeRepeatingSection()}),200)}createChevronIcon(t){const e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("version","1.1"),e.setAttribute("width","34"),e.setAttribute("height","34"),e.setAttribute("viewBox","0 0 36 36"),e.classList.add("nx-icon--allow-events"),e.style.transition="transform 0.2s ease-in-out";const i=document.createElementNS("http://www.w3.org/2000/svg","use");return i.setAttribute("href",t?"#chevron-down":"#chevron-right"),e.appendChild(i),e}updateChevronState(t,e){if(!t)return;const i=t.querySelector("use");i&&i.setAttribute("href",e?"#chevron-down":"#chevron-right")}initCollapsibleSections(){if(!this.isInitializing){this.isInitializing=!0;try{const t=document.querySelector(`.${this.targetClass}`);if(!t)return console.error(`No repeating section found with class: ${this.targetClass}`),void(this.isInitializing=!1);const e=t.querySelectorAll(".ntx-repeating-section-repeated-section");if(0===e.length)return console.error("No sections found to make collapsible"),void(this.isInitializing=!1);for(const[t,i]of e.entries()){const s=[".nx-form-runtime-light",".nx-form-runtime","[data-form-content]",".ng-star-inserted > div",".nx-form-runtime-section"];let n=null;for(const t of s)if(n=i.querySelector(t),n)break;if(!n){console.error(`No content found to toggle for section ${t}`);continue}const o=i.querySelector(".ntx-repeating-section-overlay");if(!o){console.error(`No overlay found for section ${t}`);continue}Object.assign(o.style,{cursor:"pointer",padding:"0px 0px 0px 10px",backgroundColor:"#f0f0f0",border:"1px solid #ddd",userSelect:"none",display:"flex",justifyContent:"flex-start",alignItems:"center",gap:"10px"}),o.innerHTML="";const r=document.createElement("div");if(r.style.display="flex",r.style.alignItems="center",r.style.gap="10px",r.style.width="100%",this.showIcon){const e=t===this.lastOpenIndex,i=this.createChevronIcon(e);r.appendChild(i)}let l="";if(this.nameInputClass){const t=i.querySelector(`input.${this.nameInputClass}`);t?.input.value&&(l=t.value)}l||(l=this.sectionName||"Section");const a=document.createElement("span");a.textContent=`${l} ${t+1}`,a.style.fontWeight="bold",a.style.marginRight="auto",r.appendChild(a),o.appendChild(r);const h=t===this.lastOpenIndex;n.style.display=h?"block":"none",o.style.backgroundColor=h?"#e0e0e0":"#f0f0f0",o.onclick=i=>{i.target.closest(".ntx-repeating-section-remove-button")||(this.lastOpenIndex=t,e.forEach(((e,i)=>{let n=null;for(const t of s)if(n=e.querySelector(t),n)break;const o=e.querySelector(".ntx-repeating-section-overlay"),r=o?.querySelector("svg");if(n&&o){const e=i===t;n.style.display=e?"block":"none",o.style.backgroundColor=e?"#e0e0e0":"#f0f0f0",r&&this.updateChevronState(r,e)}})))}}this.lastOpenIndex=-1===this.lastOpenIndex?e.length-1:Math.min(this.lastOpenIndex,e.length-1)}catch(t){console.error("Error in initCollapsibleSections:",t)}finally{this.isInitializing=!1}}}observeRepeatingSection(){const t=document.querySelector(`.${this.targetClass}`);t&&new MutationObserver((()=>{clearTimeout(this._observerTimer),this._observerTimer=setTimeout((()=>{const e=t.querySelectorAll(".ntx-repeating-section-repeated-section");0===e.length?(this.lastOpenIndex=-1,this.previousSectionCount=0):this.lastOpenIndex>=e.length&&(this.lastOpenIndex=e.length-1),this.initCollapsibleSections()}),100)})).observe(t,{childList:!0,subtree:!0})}observeInputChanges(){const t=document.querySelector(`.${this.targetClass}`);if(!t)return;const e=t.querySelectorAll(`input.${this.nameInputClass}`);for(const t of e)t.addEventListener("input",(t=>{const e=t.target.closest(".ntx-repeating-section-repeated-section");if(!e)return;const i=e.querySelector(".ntx-repeating-section-overlay span");i&&(i.textContent=`${t.target.value} ${this.getSectionIndex(e)+1}`)}))}renderPropertiesPreview(){return H`
      <div style="padding: 10px; background-color: #f4f4f4; border: 1px solid #ddd;">
        <h3>Properties Debug Preview</h3>
        <ul>
          <li><strong>sectionName:</strong> ${this.sectionName}</li>
          <li><strong>nameInputClass:</strong> ${this.nameInputClass}</li>
          <li><strong>sectionCount:</strong> ${this.sectionCount}</li>
          <li><strong>targetClass:</strong> ${this.targetClass}</li>
          <li><strong>showIcon:</strong> ${this.showIcon}</li>
          <li><strong>showName:</strong> ${this.showName}</li>
        </ul>
      </div>
    `}render(){return H`
      ${this.renderPropertiesPreview()}
    `}}customElements.define("neo-rs-collapse",et)})();