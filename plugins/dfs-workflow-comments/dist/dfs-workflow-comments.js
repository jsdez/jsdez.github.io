/*! For license information please see dfs-workflow-comments.js.LICENSE.txt */
(()=>{"use strict";const t=window,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;class o{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}}const r=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t;var n;const a=window,l=a.trustedTypes,d=l?l.emptyScript:"",h=a.reactiveElementPolyfillSupport,c={toAttribute(t,e){switch(e){case Boolean:t=t?d:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},m=(t,e)=>e!==t&&(e==e||t==t),p={attribute:!0,type:String,converter:c,reflect:!1,hasChanged:m};class u extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,s)=>{const i=this._$Ep(s,e);void 0!==i&&(this._$Ev.set(i,s),t.push(i))})),t}static createProperty(t,e=p){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,i=this.getPropertyDescriptor(t,s,e);void 0!==i&&Object.defineProperty(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){return{get(){return this[e]},set(i){const o=this[t];this[e]=i,this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||p}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of e)this.createProperty(s,t[s])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Ep(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,s;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var s;const i=null!==(s=this.shadowRoot)&&void 0!==s?s:this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{e?s.adoptedStyleSheets=i.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):i.forEach((e=>{const i=document.createElement("style"),o=t.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=e.cssText,s.appendChild(i)}))})(i,this.constructor.elementStyles),i}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EO(t,e,s=p){var i;const o=this.constructor._$Ep(t,s);if(void 0!==o&&!0===s.reflect){const r=(void 0!==(null===(i=s.converter)||void 0===i?void 0:i.toAttribute)?s.converter:c).toAttribute(e,s.type);this._$El=t,null==r?this.removeAttribute(o):this.setAttribute(o,r),this._$El=null}}_$AK(t,e){var s;const i=this.constructor,o=i._$Ev.get(t);if(void 0!==o&&this._$El!==o){const t=i.getPropertyOptions(o),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(s=t.converter)||void 0===s?void 0:s.fromAttribute)?t.converter:c;this._$El=o,this[o]=r.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,s){let i=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||m)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===s.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,s))):i=!1),!this.isUpdatePending&&i&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,e)=>this[e]=t)),this._$Ei=void 0);let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(s)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,e)=>this._$EO(e,this[e],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}var g;u.finalized=!0,u.elementProperties=new Map,u.elementStyles=[],u.shadowRootOptions={mode:"open"},null==h||h({ReactiveElement:u}),(null!==(n=a.reactiveElementVersions)&&void 0!==n?n:a.reactiveElementVersions=[]).push("1.6.1");const v=window,f=v.trustedTypes,b=f?f.createPolicy("lit-html",{createHTML:t=>t}):void 0,y=`lit$${(Math.random()+"").slice(9)}$`,$="?"+y,w=`<${$}>`,_=document,A=(t="")=>_.createComment(t),x=t=>null===t||"object"!=typeof t&&"function"!=typeof t,S=Array.isArray,C=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,E=/-->/g,k=/>/g,N=RegExp(">|[ \t\n\f\r](?:([^\\s\"'>=/]+)([ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r\"'`<>=]|(\"|')|))|$)","g"),O=/'/g,U=/"/g,L=/^(?:script|style|textarea|title)$/i,B=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),P=B(1),H=(B(2),Symbol.for("lit-noChange")),M=Symbol.for("lit-nothing"),T=new WeakMap,j=_.createTreeWalker(_,129,null,!1),R=(t,e)=>{const s=t.length-1,i=[];let o,r=2===e?"<svg>":"",n=C;for(let e=0;e<s;e++){const s=t[e];let a,l,d=-1,h=0;for(;h<s.length&&(n.lastIndex=h,l=n.exec(s),null!==l);)h=n.lastIndex,n===C?"!--"===l[1]?n=E:void 0!==l[1]?n=k:void 0!==l[2]?(L.test(l[2])&&(o=RegExp("</"+l[2],"g")),n=N):void 0!==l[3]&&(n=N):n===N?">"===l[0]?(n=null!=o?o:C,d=-1):void 0===l[1]?d=-2:(d=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?N:'"'===l[3]?U:O):n===U||n===O?n=N:n===E||n===k?n=C:(n=N,o=void 0);const c=n===N&&t[e+1].startsWith("/>")?" ":"";r+=n===C?s+w:d>=0?(i.push(a),s.slice(0,d)+"$lit$"+s.slice(d)+y+c):s+y+(-2===d?(i.push(void 0),e):c)}const a=r+(t[s]||"<?>")+(2===e?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==b?b.createHTML(a):a,i]};class D{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,r=0;const n=t.length-1,a=this.parts,[l,d]=R(t,e);if(this.el=D.createElement(l,s),j.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(i=j.nextNode())&&a.length<n;){if(1===i.nodeType){if(i.hasAttributes()){const t=[];for(const e of i.getAttributeNames())if(e.endsWith("$lit$")||e.startsWith(y)){const s=d[r++];if(t.push(e),void 0!==s){const t=i.getAttribute(s.toLowerCase()+"$lit$").split(y),e=/([.?@])?(.*)/.exec(s);a.push({type:1,index:o,name:e[2],strings:t,ctor:"."===e[1]?F:"?"===e[1]?q:"@"===e[1]?J:W})}else a.push({type:6,index:o})}for(const e of t)i.removeAttribute(e)}if(L.test(i.tagName)){const t=i.textContent.split(y),e=t.length-1;if(e>0){i.textContent=f?f.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],A()),j.nextNode(),a.push({type:2,index:++o});i.append(t[e],A())}}}else if(8===i.nodeType)if(i.data===$)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(y,t+1));)a.push({type:7,index:o}),t+=y.length-1}o++}}static createElement(t,e){const s=_.createElement("template");return s.innerHTML=t,s}}function I(t,e,s=t,i){var o,r,n,a;if(e===H)return e;let l=void 0!==i?null===(o=s._$Co)||void 0===o?void 0:o[i]:s._$Cl;const d=x(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==d&&(null===(r=null==l?void 0:l._$AO)||void 0===r||r.call(l,!1),void 0===d?l=void 0:(l=new d(t),l._$AT(t,s,i)),void 0!==i?(null!==(n=(a=s)._$Co)&&void 0!==n?n:a._$Co=[])[i]=l:s._$Cl=l),void 0!==l&&(e=I(t,l._$AS(t,e.values),l,i)),e}class z{constructor(t,e){this.u=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}v(t){var e;const{el:{content:s},parts:i}=this._$AD,o=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:_).importNode(s,!0);j.currentNode=o;let r=j.nextNode(),n=0,a=0,l=i[0];for(;void 0!==l;){if(n===l.index){let e;2===l.type?e=new V(r,r.nextSibling,this,t):1===l.type?e=new l.ctor(r,l.name,l.strings,this,t):6===l.type&&(e=new K(r,this,t)),this.u.push(e),l=i[++a]}n!==(null==l?void 0:l.index)&&(r=j.nextNode(),n++)}return o}p(t){let e=0;for(const s of this.u)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class V{constructor(t,e,s,i){var o;this.type=2,this._$AH=M,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cm=null===(o=null==i?void 0:i.isConnected)||void 0===o||o}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cm}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=I(this,t,e),x(t)?t===M||null==t||""===t?(this._$AH!==M&&this._$AR(),this._$AH=M):t!==this._$AH&&t!==H&&this.g(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>S(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.k(t):this.g(t)}O(t,e=this._$AB){return this._$AA.parentNode.insertBefore(t,e)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}g(t){this._$AH!==M&&x(this._$AH)?this._$AA.nextSibling.data=t:this.T(_.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:i}=t,o="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=D.createElement(i.h,this.options)),i);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===o)this._$AH.p(s);else{const t=new z(o,this),e=t.v(this.options);t.p(s),this.T(e),this._$AH=t}}_$AC(t){let e=T.get(t.strings);return void 0===e&&T.set(t.strings,e=new D(t)),e}k(t){S(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new V(this.O(A()),this.O(A()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cm=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class W{constructor(t,e,s,i,o){this.type=1,this._$AH=M,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=M}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,s,i){const o=this.strings;let r=!1;if(void 0===o)t=I(this,t,e,0),r=!x(t)||t!==this._$AH&&t!==H,r&&(this._$AH=t);else{const i=t;let n,a;for(t=o[0],n=0;n<o.length-1;n++)a=I(this,i[s+n],e,n),a===H&&(a=this._$AH[n]),r||(r=!x(a)||a!==this._$AH[n]),a===M?t=M:t!==M&&(t+=(null!=a?a:"")+o[n+1]),this._$AH[n]=a}r&&!i&&this.j(t)}j(t){t===M?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class F extends W{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===M?void 0:t}}const Z=f?f.emptyScript:"";class q extends W{constructor(){super(...arguments),this.type=4}j(t){t&&t!==M?this.element.setAttribute(this.name,Z):this.element.removeAttribute(this.name)}}class J extends W{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){var s;if((t=null!==(s=I(this,t,e,0))&&void 0!==s?s:M)===H)return;const i=this._$AH,o=t===M&&i!==M||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==M&&(i===M||o);o&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t)}}class K{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){I(this,t)}}const G=v.litHtmlPolyfillSupport;var Q,X;null==G||G(D,V),(null!==(g=v.litHtmlVersions)&&void 0!==g?g:v.litHtmlVersions=[]).push("2.6.1");class Y extends u{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const s=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=s.firstChild),s}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{var i,o;const r=null!==(i=null==s?void 0:s.renderBefore)&&void 0!==i?i:e;let n=r._$litPart$;if(void 0===n){const t=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:null;r._$litPart$=n=new V(e.insertBefore(A(),t),t,void 0,null!=s?s:{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return H}}Y.finalized=!0,Y._$litElement$=!0,null===(Q=globalThis.litElementHydrateSupport)||void 0===Q||Q.call(globalThis,{LitElement:Y});const tt=globalThis.litElementPolyfillSupport;null==tt||tt({LitElement:Y}),(null!==(X=globalThis.litElementVersions)&&void 0!==X?X:globalThis.litElementVersions=[]).push("3.2.2");const et=((t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1]),t[0]);return new o(i,t,s)})`
:host {
  display: block;
  max-width: 100%;
  font-family: var(--ntx-form-theme-font-family);
}

.comments-history {
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden; /* Ensures rounded corners apply correctly */
}

.comments-history.comments-border {
  border-radius: var(--ntx-form-theme-border-radius);
  border-color: var(--ntx-form-theme-color-border)!important;
  border: 1px solid;
}

/* Shadow Effect */
.comments-history::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 20px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), transparent);
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  pointer-events: none;
}

.comments-history.scrolled::before {
  opacity: 1;
}

.comment-card {
  border: none; /* Remove borders */
  margin: 0;
  padding: 0.5rem;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

/* Apply alternating row colors when commentsStriped class is applied */
.comments-history.comments-striped .comment-card:nth-child(odd) {
  background-color: var(--ntx-form-theme-color-form-background);
}

.comments-history.comments-striped .comment-card:nth-child(even) {
  background-color: var(--ntx-form-theme-color-form-background-alternate-contrast);
}

/* Apply border between comments when commentsBorder class is applied */
.comments-history .comment-card:not(:first-child) {
  border-top-style: solid;
  border-top-width: 1px;
  border-color: var(--ntx-form-theme-color-border);
  border-radius: 0;
}

/* First comment gets top rounded corners */
.comments-history .comment-card:first-child {
  border-top-left-radius: var(--ntx-form-theme-border-radius);
  border-top-right-radius: var(--ntx-form-theme-border-radius);
}

/* Last comment gets bottom rounded corners */
.comments-history .comment-card:last-child {
  border-bottom-left-radius: var(--ntx-form-theme-border-radius);
  border-bottom-right-radius: var(--ntx-form-theme-border-radius);
}

/* Hover effect */
.comment-card:hover {
  background-color: var(--ntx-form-theme-color-input-background);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* Selected state */
.comment-card.selected {
  background-color: var(--ntx-form-theme-color-border);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.comment-date {
  font-size: 14px;
}

.card-body {
  padding: 0.5rem;
}

.d-flex {
  display: flex;
}

.flex-row {
  flex-direction: row;
}

.align-items-center {
  align-items: center;
}

.me-2 {
  margin-right: 0.5rem;
}

.ms-2 {
  margin-left: 0.5rem;
}

.fw-bold {
  font-weight: bold;
}

.text-muted {
  color: #6c757d;
}

.badge-default {
  background-color: var(--ntx-form-theme-color-primary-button-background, #e0e0e0);
  color: var(--ntx-form-theme-color-primary-button-font, #000);
}

.comment-textarea {
  width: 100%;
  height: 100px;
  min-height: 72px;
  padding: 0.4375rem 0.75rem;
  background: var(--ntx-form-theme-color-input-background);
  border-color: var(--ntx-form-theme-color-border);
  border-radius: var(--ntx-form-theme-border-radius);
  caret-color: var(--ntx-form-theme-color-input-text);
  color: var(--ntx-form-theme-color-input-text);
  font-family: var(--ntx-form-theme-font-family);
  font-size: var(--ntx-form-theme-text-input-size);
  margin-bottom: 1rem;
}

.comment-textarea:focus {
  border-color: var(--ntx-form-theme-color-primary);
  outline: 0;
}

.comment-text {
  user-select: text;
}

.btn-default {
  background-color: var(--ntx-form-theme-color-primary-button-background);
  border-color: var(--ntx-form-theme-color-primary-button-background);
  border-radius: var(--ntx-form-theme-border-radius);
  color: var(--ntx-form-theme-color-primary-button-font);
  font-family: var(--ntx-form-theme-font-family);
  font-size: var(--ntx-form-theme-text-label-size);
}

.btn-default:hover {
  background-color: var(--ntx-form-theme-color-primary-button-hover);
  color: var(--ntx-form-theme-color-primary-button-font);
}

.btn-default:disabled {
  background-color: var(--ntx-form-theme-color-primary-button-disabled);
  border-color: var(--ntx-form-theme-color-primary-button-disabled);
  color: var(--ntx-form-theme-color-primary-button-font);
}
`,st=P`
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    class="bi bi-send me-2"
    viewBox="0 0 16 16"
  >
    <path
      d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"
    />
  </svg>
`,it=P`
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    class="bi bi-trash3-fill"
    viewBox="0 0 16 16"
  >
    <path
      d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"
    />
  </svg>
`,ot=(P`
<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 800 800">
  <defs>
    <style>
      .st0 {
        fill: #fff;
      }
    </style>
  </defs>
  <path class="st0" d="M687,639.7c77.1-103.3,55.8-249.5-47.5-326.5-13.6-10.2-28.3-18.8-43.8-25.8-25.2-145.1-163.3-242.3-308.4-217.1C142.2,95.5,45,233.6,70.2,378.7c7.5,43.2,25.5,83.8,52.5,118.3l-46.3,46c-9.5,9.6-12.2,23.9-7,36.3,5.1,12.4,17.2,20.6,30.7,20.7h189.7c38.6,81.3,120.4,133.1,210.3,133.3h200c13.5,0,25.6-8.2,30.7-20.7,5.2-12.4,2.5-26.7-7-36.3l-36.7-36.7ZM266.7,500c0,11.2.9,22.3,2.7,33.3h-89l11.7-11.3c13.1-13,13.2-34.1.2-47.1,0,0-.1-.1-.2-.2-37.7-37.3-58.9-88.3-58.7-141.3,0-110.5,89.5-200,200-200,84.9-.5,160.6,53.1,188.3,133.3h-21.7c-128.9,0-233.3,104.5-233.3,233.3ZM618,666.7l1.7,1.7h-119.7c-92-.2-166.5-74.9-166.4-167,.2-92,74.9-166.5,167-166.4,92,.2,166.5,74.9,166.4,167,0,44.2-17.7,86.5-49,117.7-6.3,6.2-9.9,14.5-10,23.3,0,8.9,3.6,17.4,10,23.7Z"/>
</svg>
`,P`
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrows-expand" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10"/>
svg></svg>
`);class rt extends Y{static get styles(){return et}static getMetaConfig(){return{controlName:"dfs-workflow-comments",fallbackDisableSubmit:!1,description:"Notes and comments",iconUrl:"https://jsdez.github.io/plugins/dfs-workflow-comments/dist/icon.svg",groupName:"DFS",version:"1.0",properties:{commentsBorder:{title:"Show Border on comments",type:"boolean",defaultValue:!0},commentsStriped:{title:"Striped comments",type:"boolean",defaultValue:!0},firstName:{type:"string",title:"First name"},lastName:{type:"string",title:"Last name"},email:{type:"string",title:"Email Address"},taskowner:{type:"string",title:"Task Owner"},badge:{type:"string",description:"Label for status badge e.g. Rejected, Approved, Return etc. Default blank value is Update",title:"Badge"},badgeStyle:{type:"string",description:"Select the style for the badge from the dropdown based on Bootstrap 5 badge",title:"Badge Style",enum:["Default","Primary","Secondary","Success","Danger","Warning","Info","Light","Dark"],defaultValue:"Default"},inputobj:{type:"object",title:"Input Object",description:"Enter the comments object from previous control here"},historyLimit:{type:"integer",title:"Comment history display limit",description:"Enter a number value of how many comments should be shown, older comments are hidden, entering 0 will show all comments, default is 5.",defaultValue:5},outputobj:{title:"Comments Output",type:"object",description:"Workflow Comments Output Do Not Use",isValueField:!0,properties:{comments:{type:"object",description:"Array of comments",items:{type:"object",properties:{firstName:{type:"string",description:"First Name",title:"First Name"},lastName:{type:"string",description:"Last Name",title:"Last Name"},email:{type:"string",description:"Email Address",title:"Email Address"},taskowner:{type:"string",description:"Task Owner",title:"Task Owner"},badge:{type:"string",description:"Badge Status",title:"Badge Status"},badgeStyle:{type:"string",description:"Badge Style",title:"Badge Style"},comment:{type:"string",description:"Comment",title:"Comment"},timestamp:{type:"string",format:"date-time",description:"Log time",title:"Log time"}}}},mostRecentComment:{type:"object",description:"Latest comment",properties:{firstName:{type:"string",description:"First Name",title:"First Name"},lastName:{type:"string",description:"Last Name",title:"Last Name"},email:{type:"string",description:"Email Address",title:"Email Address"},taskowner:{type:"string",description:"Task Owner",title:"Task Owner"},badge:{type:"string",description:"Badge Status",title:"Badge Status"},badgeStyle:{type:"string",description:"Badge Style",title:"Badge Style"},comment:{type:"string",description:"Comment",title:"Comment"},timestamp:{type:"string",format:"date-time",description:"Log time",title:"Log time"}}}}}},events:["ntx-value-change"],standardProperties:{fieldLabel:!0,description:!0,readOnly:!0,visibility:!0}}}static properties={commentsBorder:{type:Boolean},commentsStriped:{type:Boolean},firstName:{type:String},lastName:{type:String},email:{type:String},taskowner:{type:String},badge:{type:String},badgeStyle:{type:String},inputobj:{type:Object},workingComments:{type:Array},newComment:{type:String},readOnly:{type:Boolean},deletableIndices:{type:Array},historyLimit:{type:Number},showAll:{type:Boolean},outputobj:{type:Object}};constructor(){super(),this.commentsBorder=!0,this.commentsStriped=!0,this.firstName="",this.lastName="",this.email="",this.taskowner="",this.badge="Update",this.badgeStyle="Default",this.inputobj=null,this.workingComments=[],this.newComment="",this.deletableIndices=[],this.historyLimit=5,this.showAll=!1}toggleShowAll(){this.showAll=!this.showAll}get displayedComments(){return this.showAll?this.workingComments:this.workingComments.slice(-this.historyLimit)}updated(t){t.has("inputobj")&&Array.isArray(this.inputobj?.comments)&&(this.workingComments=[...this.inputobj.comments],this.deletableIndices=[]),(t.has("commentsBorder")||t.has("commentsStriped"))&&this.requestUpdate(),t.has("readOnly")&&this.requestUpdate()}addComment(){const t=(new Date).toISOString(),e={firstName:this.firstName||"Anonymous",lastName:this.lastName||"",email:this.email||"N/A",taskowner:this.taskowner||"",badge:this.badge||"Update",badgeStyle:this.badgeStyle||"Default",comment:this.newComment,timestamp:t};this.workingComments=[...this.workingComments,e],this.deletableIndices=[...this.deletableIndices,this.workingComments.length-1];const s=e,i={comments:this.workingComments,mostRecentComment:s};this.dispatchEvent(new CustomEvent("ntx-value-change",{detail:i})),this.newComment=""}deleteComment(t){this.workingComments=this.workingComments.filter(((e,s)=>s!==t)),this.deletableIndices=this.deletableIndices.filter((e=>e!==t)).map((e=>e>t?e-1:e));const e=this.workingComments[this.workingComments.length-1]||null,s={comments:this.workingComments,mostRecentComment:e};this.dispatchEvent(new CustomEvent("ntx-value-change",{detail:s}))}handleCommentChange(t){this.newComment=t.target.value}render(){const t=0===this.historyLimit||this.showAll?this.workingComments:this.workingComments.slice(-this.historyLimit),e=[this.commentsBorder?"comments-border":"",this.commentsStriped?"comments-striped":""].filter(Boolean).join(" ");return P`
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      
      <!-- Show "Show All Comments" button if there are more comments than the limit -->
      ${this.historyLimit>0&&this.workingComments.length>this.historyLimit?P`
        <div class="d-flex justify-content-center mb-3">
          <button 
            class="btn btn-default rounded-pill d-flex align-items-center"
            type="button"
            @click=${this.toggleShowAll}
          >
            ${ot} 
            <div class="ms-1">
            ${this.showAll?" Hide All Comments":" Show All Comments"}
            </div>
          </button>
        </div>
      `:""}
  
      <!-- Display the comments with applied styles -->
      ${t.length>0?P`
        <div class="comments-history ${e}">
          ${t.map(((t,e)=>P`
            <div class="card comment-card">
              <div class="card-body">
                <div class="d-flex flex-row align-items-center">
                  <h6 class="fw-bold mb-0">${t.firstName} ${t.lastName||""}</h6>
                  ${t.taskowner?P`
                    <span class="badge bg-secondary rounded-pill text-dark ms-2">${t.taskowner}</span>
                  `:""}
                  <span class="badge ${this.getBadgeClass(t.badgeStyle)||"Default"} rounded-pill ms-2">
                    ${t.badge||"Update"}
                  </span>
                  ${this.deletableIndices.includes(e)&&!this.readOnly?P`
                    <button class="btn btn-sm btn-danger ms-auto" @click=${()=>this.deleteComment(e)}>
                      ${it}
                    </button>
                  `:""}
                </div>
                <div class="d-flex flex-row align-items-center">
                  <p class="mb-0 text-muted comment-date">
                    ${new Date(t.timestamp).toLocaleString("en-GB",{weekday:"short",year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!1})}
                  </p>
                </div>
                <div>
                  <p class="mb-0 py-3 comment-text">${t.comment}</p>
                </div>
              </div>
            </div>
          `))}
        </div>
      `:P``}
  
      ${this.readOnly?"":P`
        <div class="mt-4">
          <textarea
            class="comment-textarea"
            .value=${this.newComment}
            @input=${this.handleCommentChange}
            placeholder="Write your comment here..."
          ></textarea>
          <button
            class="btn btn-default d-flex align-items-center"
            type="button"
            @click=${this.addComment}
            ?disabled=${!this.newComment.trim()}
          >
            ${st} Add Comment
          </button>
        </div>
      `}
    `}getBadgeClass(t){const e={Default:"badge badge-default",Primary:"badge bg-primary text-white",Secondary:"badge bg-secondary text-white",Success:"badge bg-success text-white",Danger:"badge bg-danger text-white",Warning:"badge bg-warning text-dark",Info:"badge bg-info",Light:"badge bg-light text-dark",Dark:"badge bg-dark text-white"};return e[t]||e.Default}}customElements.define("dfs-workflow-comments",rt)})();