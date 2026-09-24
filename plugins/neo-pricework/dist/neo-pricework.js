/*! For license information please see neo-pricework.js.LICENSE.txt */
(()=>{"use strict";const t=window,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),o=new WeakMap;class s{constructor(t,e,o){if(this._$cssResult$=!0,o!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const r=this.t;if(e&&void 0===t){const e=void 0!==r&&1===r.length;e&&(t=o.get(r)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o.set(r,t))}return t}toString(){return this.cssText}}const i=(r,o)=>{e?r.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet):o.forEach(e=>{const o=document.createElement("style"),s=t.litNonce;void 0!==s&&o.setAttribute("nonce",s),o.textContent=e.cssText,r.appendChild(o)})},n=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return(t=>new s("string"==typeof t?t:t+"",void 0,r))(e)})(t):t;var a;const l=window,d=l.trustedTypes,c=d?d.emptyScript:"",h=l.reactiveElementPolyfillSupport,p={toAttribute(t,e){switch(e){case Boolean:t=t?c:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=null!==t;break;case Number:r=null===t?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch(t){r=null}}return r}},m=(t,e)=>e!==t&&(e==e||t==t),u={attribute:!0,type:String,converter:p,reflect:!1,hasChanged:m},g="finalized";class f extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach((e,r)=>{const o=this._$Ep(r,e);void 0!==o&&(this._$Ev.set(o,r),t.push(o))}),t}static createProperty(t,e=u){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const r="symbol"==typeof t?Symbol():"__"+t,o=this.getPropertyDescriptor(t,r,e);void 0!==o&&Object.defineProperty(this.prototype,t,o)}}static getPropertyDescriptor(t,e,r){return{get(){return this[e]},set(o){const s=this[t];this[e]=o,this.requestUpdate(t,s,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||u}static finalize(){if(this.hasOwnProperty(g))return!1;this[g]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const r of e)this.createProperty(r,t[r])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const t of r)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Ep(t,e){const r=e.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach(t=>t(this))}addController(t){var e,r;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(r=t.hostConnected)||void 0===r||r.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])})}createRenderRoot(){var t;const e=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return i(e,this.constructor.elementStyles),e}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)})}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)})}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$EO(t,e,r=u){var o;const s=this.constructor._$Ep(t,r);if(void 0!==s&&!0===r.reflect){const i=(void 0!==(null===(o=r.converter)||void 0===o?void 0:o.toAttribute)?r.converter:p).toAttribute(e,r.type);this._$El=t,null==i?this.removeAttribute(s):this.setAttribute(s,i),this._$El=null}}_$AK(t,e){var r;const o=this.constructor,s=o._$Ev.get(t);if(void 0!==s&&this._$El!==s){const t=o.getPropertyOptions(s),i="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(r=t.converter)||void 0===r?void 0:r.fromAttribute)?t.converter:p;this._$El=s,this[s]=i.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,r){let o=!0;void 0!==t&&(((r=r||this.constructor.getPropertyOptions(t)).hasChanged||m)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===r.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,r))):o=!1),!this.isUpdatePending&&o&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((t,e)=>this[e]=t),this._$Ei=void 0);let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)}),this.update(r)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(r)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach(t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach((t,e)=>this._$EO(e,this[e],t)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}var b;f[g]=!0,f.elementProperties=new Map,f.elementStyles=[],f.shadowRootOptions={mode:"open"},null==h||h({ReactiveElement:f}),(null!==(a=l.reactiveElementVersions)&&void 0!==a?a:l.reactiveElementVersions=[]).push("1.6.3");const v=window,y=v.trustedTypes,x=y?y.createPolicy("lit-html",{createHTML:t=>t}):void 0,w="$lit$",$=`lit$${(Math.random()+"").slice(9)}$`,A="?"+$,k=`<${A}>`,S=document,_=()=>S.createComment(""),j=t=>null===t||"object"!=typeof t&&"function"!=typeof t,I=Array.isArray,C="[ \t\n\f\r]",E=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,P=/-->/g,O=/>/g,T=RegExp(`>|${C}(?:([^\\s"'>=/]+)(${C}*=${C}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,M=/"/g,N=/^(?:script|style|textarea|title)$/i,R=t=>(e,...r)=>({_$litType$:t,strings:e,values:r}),L=R(1),U=(R(2),Symbol.for("lit-noChange")),q=Symbol.for("lit-nothing"),z=new WeakMap,H=S.createTreeWalker(S,129,null,!1);function W(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==x?x.createHTML(e):e}const F=(t,e)=>{const r=t.length-1,o=[];let s,i=2===e?"<svg>":"",n=E;for(let e=0;e<r;e++){const r=t[e];let a,l,d=-1,c=0;for(;c<r.length&&(n.lastIndex=c,l=n.exec(r),null!==l);)c=n.lastIndex,n===E?"!--"===l[1]?n=P:void 0!==l[1]?n=O:void 0!==l[2]?(N.test(l[2])&&(s=RegExp("</"+l[2],"g")),n=T):void 0!==l[3]&&(n=T):n===T?">"===l[0]?(n=null!=s?s:E,d=-1):void 0===l[1]?d=-2:(d=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?T:'"'===l[3]?M:D):n===M||n===D?n=T:n===P||n===O?n=E:(n=T,s=void 0);const h=n===T&&t[e+1].startsWith("/>")?" ":"";i+=n===E?r+k:d>=0?(o.push(a),r.slice(0,d)+w+r.slice(d)+$+h):r+$+(-2===d?(o.push(void 0),e):h)}return[W(t,i+(t[r]||"<?>")+(2===e?"</svg>":"")),o]};class K{constructor({strings:t,_$litType$:e},r){let o;this.parts=[];let s=0,i=0;const n=t.length-1,a=this.parts,[l,d]=F(t,e);if(this.el=K.createElement(l,r),H.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(o=H.nextNode())&&a.length<n;){if(1===o.nodeType){if(o.hasAttributes()){const t=[];for(const e of o.getAttributeNames())if(e.endsWith(w)||e.startsWith($)){const r=d[i++];if(t.push(e),void 0!==r){const t=o.getAttribute(r.toLowerCase()+w).split($),e=/([.?@])?(.*)/.exec(r);a.push({type:1,index:s,name:e[2],strings:t,ctor:"."===e[1]?V:"?"===e[1]?Y:"@"===e[1]?X:Q})}else a.push({type:6,index:s})}for(const e of t)o.removeAttribute(e)}if(N.test(o.tagName)){const t=o.textContent.split($),e=t.length-1;if(e>0){o.textContent=y?y.emptyScript:"";for(let r=0;r<e;r++)o.append(t[r],_()),H.nextNode(),a.push({type:2,index:++s});o.append(t[e],_())}}}else if(8===o.nodeType)if(o.data===A)a.push({type:2,index:s});else{let t=-1;for(;-1!==(t=o.data.indexOf($,t+1));)a.push({type:7,index:s}),t+=$.length-1}s++}}static createElement(t,e){const r=S.createElement("template");return r.innerHTML=t,r}}function J(t,e,r=t,o){var s,i,n,a;if(e===U)return e;let l=void 0!==o?null===(s=r._$Co)||void 0===s?void 0:s[o]:r._$Cl;const d=j(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==d&&(null===(i=null==l?void 0:l._$AO)||void 0===i||i.call(l,!1),void 0===d?l=void 0:(l=new d(t),l._$AT(t,r,o)),void 0!==o?(null!==(n=(a=r)._$Co)&&void 0!==n?n:a._$Co=[])[o]=l:r._$Cl=l),void 0!==l&&(e=J(t,l._$AS(t,e.values),l,o)),e}class B{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:r},parts:o}=this._$AD,s=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:S).importNode(r,!0);H.currentNode=s;let i=H.nextNode(),n=0,a=0,l=o[0];for(;void 0!==l;){if(n===l.index){let e;2===l.type?e=new G(i,i.nextSibling,this,t):1===l.type?e=new l.ctor(i,l.name,l.strings,this,t):6===l.type&&(e=new tt(i,this,t)),this._$AV.push(e),l=o[++a]}n!==(null==l?void 0:l.index)&&(i=H.nextNode(),n++)}return H.currentNode=S,s}v(t){let e=0;for(const r of this._$AV)void 0!==r&&(void 0!==r.strings?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class G{constructor(t,e,r,o){var s;this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=o,this._$Cp=null===(s=null==o?void 0:o.isConnected)||void 0===s||s}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),j(t)?t===q||null==t||""===t?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==U&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):(t=>I(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==q&&j(this._$AH)?this._$AA.nextSibling.data=t:this.$(S.createTextNode(t)),this._$AH=t}g(t){var e;const{values:r,_$litType$:o}=t,s="number"==typeof o?this._$AC(t):(void 0===o.el&&(o.el=K.createElement(W(o.h,o.h[0]),this.options)),o);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===s)this._$AH.v(r);else{const t=new B(s,this),e=t.u(this.options);t.v(r),this.$(e),this._$AH=t}}_$AC(t){let e=z.get(t.strings);return void 0===e&&z.set(t.strings,e=new K(t)),e}T(t){I(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,o=0;for(const s of t)o===e.length?e.push(r=new G(this.k(_()),this.k(_()),this,this.options)):r=e[o],r._$AI(s),o++;o<e.length&&(this._$AR(r&&r._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){var r;for(null===(r=this._$AP)||void 0===r||r.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class Q{constructor(t,e,r,o,s){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=s,r.length>2||""!==r[0]||""!==r[1]?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=q}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,r,o){const s=this.strings;let i=!1;if(void 0===s)t=J(this,t,e,0),i=!j(t)||t!==this._$AH&&t!==U,i&&(this._$AH=t);else{const o=t;let n,a;for(t=s[0],n=0;n<s.length-1;n++)a=J(this,o[r+n],e,n),a===U&&(a=this._$AH[n]),i||(i=!j(a)||a!==this._$AH[n]),a===q?t=q:t!==q&&(t+=(null!=a?a:"")+s[n+1]),this._$AH[n]=a}i&&!o&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class V extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}const Z=y?y.emptyScript:"";class Y extends Q{constructor(){super(...arguments),this.type=4}j(t){t&&t!==q?this.element.setAttribute(this.name,Z):this.element.removeAttribute(this.name)}}class X extends Q{constructor(t,e,r,o,s){super(t,e,r,o,s),this.type=5}_$AI(t,e=this){var r;if((t=null!==(r=J(this,t,e,0))&&void 0!==r?r:q)===U)return;const o=this._$AH,s=t===q&&o!==q||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,i=t!==q&&(o===q||s);s&&this.element.removeEventListener(this.name,this,o),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,r;"function"==typeof this._$AH?this._$AH.call(null!==(r=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==r?r:this.element,t):this._$AH.handleEvent(t)}}class tt{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const et=v.litHtmlPolyfillSupport;var rt,ot;null==et||et(K,G),(null!==(b=v.litHtmlVersions)&&void 0!==b?b:v.litHtmlVersions=[]).push("2.8.0");class st extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const r=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=r.firstChild),r}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,r)=>{var o,s;const i=null!==(o=null==r?void 0:r.renderBefore)&&void 0!==o?o:e;let n=i._$litPart$;if(void 0===n){const t=null!==(s=null==r?void 0:r.renderBefore)&&void 0!==s?s:null;i._$litPart$=n=new G(e.insertBefore(_(),t),t,void 0,null!=r?r:{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return U}}st.finalized=!0,st._$litElement$=!0,null===(rt=globalThis.litElementHydrateSupport)||void 0===rt||rt.call(globalThis,{LitElement:st});const it=globalThis.litElementPolyfillSupport;null==it||it({LitElement:st}),(null!==(ot=globalThis.litElementVersions)&&void 0!==ot?ot:globalThis.litElementVersions=[]).push("3.3.3");const nt=((t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,r,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+t[o+1],t[0]);return new s(o,t,r)})`
  :host { display:block; font-family: var(--ntx-form-theme-font-family, 'Open Sans', 'Helvetica', 'Arial', sans-serif); }
  :host, :host *, :host *::before, :host *::after { box-sizing: border-box; }

      .card { background: var(--ntx-form-theme-color-form-background, #fff); border: 1px solid var(--ntx-form-theme-color-border, #898f94); border-radius: var(--ntx-form-theme-border-radius, 4px); box-shadow: var(--ntx-form-theme-popover-box-shadow, none); }
      .card + .card { margin-top: .75rem; }
      .card-body { padding: .75rem 1rem; }
      .card-title { margin: 0; font-weight: 600; color: var(--ntx-form-theme-color-input-text, #161718); }
      .muted { color: var(--ntx-form-theme-color-input-text-placeholder, #6c757d); }

      .list-header{ display:flex; justify-content:space-between; align-items:center; margin-bottom:.5rem; }
      .badge { display:inline-block; padding:.25rem .5rem; border-radius:999px; background: var(--ntx-form-theme-color-secondary-button-background, #fff); color: var(--ntx-form-theme-color-secondary, #575c61); border:1px solid var(--ntx-form-theme-color-border, #898f94); font-size:12px; }

      .btn { cursor:pointer; display:inline-flex; align-items:center; gap:.35rem; font-weight:600; border-radius: var(--ntx-form-theme-border-radius, 4px); border:1px solid transparent; padding:.45rem .75rem; line-height:1.25; }
      .btn:disabled { opacity:.65; cursor:not-allowed; }
      .btn-primary { background: var(--ntx-form-theme-color-primary-button-background, #006bd6); color: var(--ntx-form-theme-color-primary-button-font, #fff); }
      .btn-primary:hover { background: var(--ntx-form-theme-color-primary-button-hover, #2d83dc); }
      .btn-outline { background: transparent; color: var(--ntx-form-theme-color-primary, #006bd6); border-color: var(--ntx-form-theme-color-primary, #006bd6); }
      .btn-outline:hover { background: color-mix(in srgb, var(--ntx-form-theme-color-primary, #006bd6), #fff 85%); }
      .btn-danger { background: var(--ntx-form-theme-color-error, #e60000); color:#fff; }
  .icon-btn { display:inline-flex; align-items:center; justify-content:center; width:34px; height:34px; padding:0; border:1px solid var(--ntx-form-theme-color-border, #898f94); border-radius: var(--ntx-form-theme-border-radius, 4px); background: var(--ntx-form-theme-color-form-background, #fff); color: var(--ntx-form-theme-color-error, #e60000); }
  .icon-btn:hover { background: color-mix(in srgb, var(--ntx-form-theme-color-error, #e60000), #fff 90%); }
  .icon-btn.success { background: var(--ntx-form-theme-color-success, #2e7d32); color: #fff; border-color: var(--ntx-form-theme-color-success, #2e7d32); }
  .icon-btn.success:hover { background: color-mix(in srgb, var(--ntx-form-theme-color-success, #2e7d32), #000 10%); }
      .btn-light { background: var(--ntx-form-theme-color-form-background, #fff); border:1px solid var(--ntx-form-theme-color-border, #898f94); color: var(--ntx-form-theme-color-input-text, #161718); }

      .rows { display:flex; flex-direction:column; gap:.5rem; }
      .row { display:grid; grid-template-columns: 1fr auto; gap:.5rem; align-items:start; }
      .title { font-weight:600; }
      .actions { display:flex; gap:.5rem; }
    .actions-inline { display:flex; align-items:center; gap:.5rem; }
    .pill-group { display:flex; flex-wrap:wrap; gap:.35rem; margin-top:.25rem; }
    .notes { margin-top:.5rem; padding:.5rem .75rem; background: var(--ntx-form-theme-color-form-background-alternate-contrast, #0000000d); border-left:3px solid var(--ntx-form-theme-color-primary, #006bd6); border-radius: var(--ntx-form-theme-border-radius, 4px); }
  .icon-btn.neutral { color: var(--ntx-form-theme-color-input-text, #161718); }
  .icon-btn.primary { color: var(--ntx-form-theme-color-primary, #006bd6); }

  /* Field lines and labels in list rows */
  .field-line { display:flex; align-items:center; flex-wrap:wrap; gap:.5rem; }
  .inline-label { font-weight:600; color: var(--ntx-form-theme-color-input-text, #161718); }
  .right .summary { text-align:right; margin-bottom:.35rem; color: var(--ntx-form-theme-color-input-text, #161718); }
  .right-actions { display:flex; flex-direction:column; gap:.35rem; align-items:flex-end; }
  .btn-compact { padding:.3rem .5rem; line-height:1.1; }

      .footer { margin-top:.75rem; display:flex; justify-content:space-between; align-items:center; }
      .total { font-weight:700; }

      .empty { color: var(--ntx-form-theme-color-input-text-placeholder, #6c757d); text-align:center; padding: .75rem; border: 1px dashed var(--ntx-form-theme-color-border, #898f94); border-radius: var(--ntx-form-theme-border-radius, 4px); background: var(--ntx-form-theme-color-form-background-alternate-contrast, #0000000d); }
      .input-error { margin-bottom: .75rem; padding: .75rem 1rem; border: 1px solid var(--ntx-form-theme-color-error, #e60000); border-radius: var(--ntx-form-theme-border-radius, 4px); background: color-mix(in srgb, var(--ntx-form-theme-color-error, #e60000), #fff 94%); color: var(--ntx-form-theme-color-input-text, #161718); }
      .input-error > strong { display: block; margin-bottom: .25rem; color: var(--ntx-form-theme-color-error, #e60000); }
      .input-error details { margin-top: .5rem; }
      .input-error summary { cursor: pointer; font-weight: 600; }
      .input-error p { margin: .5rem 0; }
      .input-error pre { margin: .5rem 0 0; padding: .5rem; overflow: auto; border-radius: var(--ntx-form-theme-border-radius, 4px); background: var(--ntx-form-theme-color-form-background, #fff); border: 1px solid var(--ntx-form-theme-color-border, #898f94); font-size: 12px; }

      /* Modal */
      .backdrop { position:fixed; inset:0; background: rgba(0,0,0,.45); display:flex; align-items:center; justify-content:center; padding: 10px; z-index:10000; }
  .modal { width: min(720px, calc(100vw - 20px)); max-width: 100%; max-height: 90vh; display:flex; flex-direction:column; background: var(--ntx-form-theme-color-form-background, #fff); border: 1px solid var(--ntx-form-theme-color-border, #898f94); border-radius: var(--ntx-form-theme-border-radius, 4px); box-shadow: 0 10px 30px rgba(0,0,0,.25); box-sizing: border-box; }
  .modal-header, .modal-footer { flex: 0 0 auto; padding:.75rem 1rem; border-bottom:1px solid var(--ntx-form-theme-color-border, #898f94); display:flex; align-items:center; justify-content:space-between; }
      .modal-footer { border-bottom:0; border-top:1px solid var(--ntx-form-theme-color-border, #898f94); }
  .modal-body { flex: 1 1 auto; overflow:auto; padding:1rem; }
      .form-grid { display:grid; grid-template-columns: 1fr; gap:.75rem; }
      @media (min-width: 600px) { .form-grid { grid-template-columns: 1fr 1fr; } }
      .form-group { display:flex; flex-direction:column; gap:.25rem; }
      label { font-size: var(--ntx-form-theme-text-label-size, 14px); color: var(--ntx-form-theme-color-input-text, #161718); }
  input, textarea, select { display:block; width: 100%; max-width: 100%; font-size: var(--ntx-form-theme-text-input-size, 14px); border:1px solid var(--ntx-form-theme-color-border, #898f94); border-radius: var(--ntx-form-theme-border-radius, 4px); padding:.45rem .6rem; background: var(--ntx-form-theme-color-input-background, #fff); color: var(--ntx-form-theme-color-input-text, #161718); }
      textarea { min-height: 72px; resize: vertical; }
      .right { text-align:right; }
  .pill { border-radius:999px; padding:.15rem .5rem; background: var(--ntx-form-theme-color-primary-light90, #e8f1f9); color: var(--ntx-form-theme-color-primary, #006bd6); font-weight:600; }

  /* Address box with suggestions drawn inside the editor (not on the page body) */
  .address-field { position: relative; }
  .address-field input { width: 100%; box-sizing: border-box; }
  .address-suggestions { position: absolute; top: calc(100% + 2px); left: 0; right: 0; z-index: 5; margin: 0; padding: .25rem 0; list-style: none; background: var(--ntx-form-theme-color-form-background, #fff); border: 1px solid var(--ntx-form-theme-color-border, #898f94); border-radius: var(--ntx-form-theme-border-radius, 4px); box-shadow: 0 6px 16px rgba(0,0,0,.18); max-height: 260px; overflow: auto; }
  .address-option { display: flex; flex-direction: column; gap: .1rem; padding: .45rem .75rem; cursor: pointer; font-size: 14px; color: var(--ntx-form-theme-color-input-text, #161718); }
  .address-option.active { background: color-mix(in srgb, var(--ntx-form-theme-color-primary, #006bd6), #fff 88%); }
  .address-main { font-weight: 600; }
  .address-secondary { font-size: 12px; color: var(--ntx-form-theme-color-input-text-placeholder, #6c757d); }
  .address-attribution { padding: .25rem .75rem 0; text-align: right; font-size: 11px; white-space: nowrap; color: var(--ntx-form-theme-color-input-text-placeholder, #5f6368); }
  /* Available work items (touch-friendly) */
  .avail-list { display:flex; flex-direction:column; gap:.5rem; max-height: 260px; font-size: 14px; overflow:auto; border:1px solid var(--ntx-form-theme-color-border, #898f94); border-radius: var(--ntx-form-theme-border-radius, 4px); padding:.5rem; background: var(--ntx-form-theme-color-form-background, #fff); width: 100%; max-width: 100%; }
  .avail-row { display:flex; align-items:center; justify-content:space-between; gap:.75rem; padding:.6rem .6rem; border:1px solid var(--ntx-form-theme-color-border, #898f94); border-radius: var(--ntx-form-theme-border-radius, 4px); min-height:44px; width: 100%; box-sizing: border-box; }
  .avail-list > .avail-row { flex: 0 0 auto; }
  .avail-main { display:flex; flex-direction:column; align-items:flex-start; gap:.2rem; min-width:0; flex:1 1 auto; }
  .avail-meta { display:flex; flex-wrap:wrap; align-items:center; gap:.4rem; }
  .avail-empty { padding:.6rem .1rem; font-size:14px; }
  .avail-note { margin-top:.35rem; font-size:12px; }
  .pill-sm { font-size:11px; font-weight:600; padding:.1rem .45rem; }
  .pill-muted { background: var(--ntx-form-theme-color-form-background-alternate-contrast, #0000000d); color: var(--ntx-form-theme-color-input-text, #161718); font-weight:500; }
  input[type="search"] { -webkit-appearance: none; appearance: none; }

  /* Selected work items grouped by contract */
  .item-group { display:flex; flex-direction:column; gap:.5rem; min-width:0; padding-left:.5rem; border-left:3px solid var(--ntx-form-theme-color-primary, #006bd6); }
  .item-group + .item-group { margin-top:.35rem; }
  .item-group-body > .list-row { min-width:0; box-sizing:border-box; }
  /* Group header: a full-width button that expands/collapses the group */
  .item-group-head { display:flex; align-items:center; gap:.4rem .6rem; width:100%; min-height:44px; margin:0; padding:.35rem .25rem; border:0; border-radius: var(--ntx-form-theme-border-radius, 4px); background:none; color:inherit; font:inherit; font-size:14px; text-align:left; cursor:pointer; box-sizing:border-box; }
  .item-group-head:hover { background: var(--ntx-form-theme-color-form-background-alternate-contrast, #0000000d); }
  .item-group-head:focus-visible { outline:2px solid var(--ntx-form-theme-color-primary, #006bd6); outline-offset:1px; }
  .item-group-chevron { flex:0 0 auto; transition: transform .15s ease; }
  .item-group.expanded .item-group-chevron { transform: rotate(90deg); }
  .item-group-name { font-weight:700; flex:1 1 auto; min-width:0; overflow-wrap:anywhere; }
  .item-group-body { display:flex; flex-direction:column; gap:.5rem; }
  .item-group-body[hidden] { display:none; }
  .item-group.collapsed { gap:0; }
  .item-group-total { color: var(--ntx-form-theme-color-input-text-placeholder, #6c757d); font-size:13px; white-space:nowrap; }
  .avail-title { font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .avail-price { color: var(--ntx-form-theme-color-input-text-placeholder, #6c757d); white-space:nowrap; }
  .avail-actions { flex:0 0 auto; }

      /* Selected items list styling */
      .list-table { display:flex; flex-direction:column; gap:.5rem; font-size:14px; }
  /* Requested fixed column widths */
  :host { --neo-col-unit: 50px; --neo-col-qty: 75px; --neo-col-cost: 50px; --neo-col-remove: 30px; }
      .list-row { padding:.5rem .75rem; background: var(--ntx-form-theme-color-form-background-alternate-contrast, #0000000d); border:1px solid var(--ntx-form-theme-color-border, #898f94); border-radius: var(--ntx-form-theme-border-radius, 4px); }
      .cell-name { min-width: 0; }
      .cell-name .title { font-weight:600; word-break: break-word; }
      .cell-unit { text-align: right; white-space: nowrap; }
      .cell-qty { text-align:right; }
      .cell-cost { white-space: nowrap; text-align:right; }
  .qty-input { width: var(--neo-col-qty); max-width: var(--neo-col-qty); }
      .cell-label { display: none; margin-right: .25rem; color: var(--ntx-form-theme-color-input-text-placeholder, #6c757d); font-size: 12px; }

      /* Large screens: one-line grid with header */
      @media (min-width: 576px) {
        .list-head { display:grid; grid-template-columns: 1fr var(--neo-col-unit) var(--neo-col-qty) var(--neo-col-cost) var(--neo-col-remove); gap:.75rem; align-items:center; padding:.25rem .75rem; }
        .list-row { display:grid; grid-template-columns: 1fr var(--neo-col-unit) var(--neo-col-qty) var(--neo-col-cost) var(--neo-col-remove); gap:.75rem; align-items:center; }
        .cell-numbers { display: contents; }
        .cell-remove { justify-self: end; }
        .cell-label { display: none; }
  .list-head .center { text-align: center; }
        /* Line the headings up with rows indented inside contract groups */
        .list-table > .list-head { margin-left: calc(.5rem + 3px); }
  .qty-input { width: var(--neo-col-qty); max-width: var(--neo-col-qty); }
      }

      /* Small screens: two-line layout, inline labels for numeric cells */
      @media (max-width: 575.98px) {
        .list-head { display:none; }
        .list-row { display:grid; grid-template-columns: 1fr var(--neo-col-remove); grid-template-rows: auto auto; row-gap:.25rem; }
        .cell-name { grid-column: 1 / 2; grid-row: 1; }
        .cell-remove { grid-column: 2 / 3; grid-row: 1; justify-self:end; display:flex; }
        /* Price | Qty | Cost as three columns, small label above each value */
        .cell-numbers { grid-column: 1 / -1; grid-row: 2; display:grid; grid-template-columns: 1fr auto 1fr; align-items:end; gap:.5rem; min-width:0; }
        .cell-unit, .cell-qty, .cell-cost { width: auto; display:flex; flex-direction:column; gap:.1rem; min-width:0; }
        .cell-unit { align-items:flex-start; text-align:left; }
        .cell-qty { align-items:center; text-align:center; }
        .cell-cost { align-items:flex-end; text-align:right; }
  :host { --neo-col-qty: 72px; }
  .qty-input { width: var(--neo-col-qty); max-width: var(--neo-col-qty); }
        .cell-label { display: block; margin: 0; }
  .avail-title { white-space: normal; overflow-wrap: anywhere; word-break: break-word; }
      }

      /* Details view styles */
      .job-details { margin-top: .75rem; padding-top: .75rem; border-top: 1px solid var(--ntx-form-theme-color-border, #898f94); }
      .job-details .items-table { width: 100%; border-collapse: collapse; margin-bottom: .5rem; font-size: 12px; }
      .job-details .items-table th, .job-details .items-table td { padding: .35rem .5rem; text-align: left; border-bottom: 1px solid var(--ntx-form-theme-color-border, #898f94); }
      .job-details .items-table th { background: var(--ntx-form-theme-color-form-background-alternate-contrast, #0000000d); font-weight: 600; }
      .job-details .items-table .text-right { text-align: right; }
      .job-details .items-table .code-col { width: 80px; }
      .job-details .items-table .contract-col { width: 90px; }
      .job-details .items-table .qty-col { width: 50px; text-align: center; }
      .job-details .items-table .price-col { width: 70px; }
      .job-details .items-table .cost-col { width: 70px; }
      .job-details .job-notes { padding: .5rem .75rem; background: var(--ntx-form-theme-color-form-background-alternate-contrast, #0000000d); border-left: 3px solid var(--ntx-form-theme-color-primary, #006bd6); border-radius: var(--ntx-form-theme-border-radius, 4px); font-size: 13px; }

      /* Read-only mode: always show details */
      :host([readonly]) .job-details { display: block; }
      :host([readonly]) .btn { display: none; }

      /* Print-specific styles */
      @media print {
        :host { font-family: 'Arial', sans-serif !important; }
        .card { margin-bottom: .25rem; box-shadow: none; border: 1px solid #000; background: #fff !important; page-break-inside: avoid; }
        .card-body { padding: .25rem .5rem; }
        .list-header { border-bottom: 2px solid #000; padding-bottom: .25rem; margin-bottom: .5rem; }
        .card-title, .badge { color: #000 !important; }
        .badge { background: #f0f0f0 !important; border: 1px solid #000; }
        .footer { border-top: 2px solid #000; padding-top: .5rem; margin-top: .5rem; }

        /* Always show details in print */
        .job-details { display: block !important; }
        .job-details .items-table { border: 1px solid #000; font-size: 9px; page-break-inside: avoid; }
        .job-details .items-table th { background: #f0f0f0 !important; color: #000 !important; border: 1px solid #000; }
        .job-details .items-table td { border: 1px solid #000; color: #000 !important; }
        .job-details .items-table th, .job-details .items-table td { padding: .1rem .2rem; }
        .job-details .job-notes { font-size: 9px; padding: .15rem .25rem; background: #f8f8f8 !important; color: #000 !important; border-left: 2px solid #000 !important; }
        .pill { font-size: 8px; background: #e8e8e8 !important; color: #000 !important; border: 1px solid #000; }

        /* Hide interactive elements in print */
        .btn, .icon-btn, .modal, .backdrop { display: none !important; }

        /* Force black text for all elements */
        * { color: #000 !important; }
      }
`,at=()=>Math.random().toString(36).slice(2,10),lt=t=>String(t??"").trim(),dt="Google Maps",ct="OS Places",ht=["street_address","premise","subpremise","route","postal_code"],pt=["gb"],mt=/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;async function ut(t,e,r,o){const s=new URL(`https://api.os.uk/search/places/v1/${t}`);Object.entries(e).forEach(([t,e])=>s.searchParams.set(t,e));const i=await fetch(s,{headers:{key:r},signal:o});if(!i.ok){let e="";try{const t=await i.json();e=t?.error?.message||t?.fault?.faultstring||""}catch(t){}throw new Error(`OS Places ${t} request failed (${i.status})${e?`: ${e}`:""}`)}return((await i.json()).results||[]).map(t=>t.DPA||t.LPI).filter(Boolean)}function gt(t){const e=t.ADDRESS||"",r=t.POSTCODE||t.POSTCODE_LOCATOR||"",o=r?`, ${r}`:"";return{provider:"os",text:e,mainText:o&&e.endsWith(o)?e.slice(0,-o.length):e,secondaryText:r,address:e,uprn:null==t.UPRN?"":String(t.UPRN)}}const ft="__neoPriceworkMapsReady";let bt=null;function vt(){return new Promise((t,e)=>{const r=Date.now();!function o(){window.google?.maps?.importLibrary?t():Date.now()-r>15e3?e(new Error("Google Maps loaded without importLibrary support")):setTimeout(o,50)}()})}function yt(t){return window.google?.maps?.importLibrary?window.google.maps.importLibrary("places"):(bt||(bt=new Promise((e,r)=>{const o=()=>r(new Error("Failed to load Google Maps API")),s=document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');if(s)return s.addEventListener("error",o,{once:!0}),void vt().then(e,r);window[ft]=()=>{delete window[ft],vt().then(e,r)};const i=document.createElement("script");i.src=`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(t)}&loading=async&v=weekly&callback=${ft}`,i.async=!0,i.dataset.neoPriceworkGmaps="1",i.addEventListener("error",()=>{i.remove(),delete window[ft],o()},{once:!0}),document.head.appendChild(i)}).then(()=>window.google.maps.importLibrary("places")),bt.catch(()=>{bt=null})),bt)}class xt extends st{static getMetaConfig(){return{controlName:"neo-pricework",fallbackDisableSubmit:!1,description:"Create, list and edit job line items with totals",iconUrl:"",groupName:"NEO",version:"1.0",properties:{formMode:{type:"string",title:"Form mode",description:"Choose the Nintex Forms host environment for this control.",enum:["Nintex Cloud Form","Nintex SharePoint Form"],defaultValue:"Nintex Cloud Form"},addressProvider:{type:"string",title:"Address Lookup Provider",description:"Service that suggests UK addresses as the engineer types. Google Maps returns the formatted address; OS Places returns the address and its UPRN.",enum:[dt,ct],defaultValue:dt},apiKey:{type:"string",title:"Google Maps API Key",description:"Browser API key with the Maps JavaScript API and Places API (New) enabled. Used when the Address Lookup Provider is Google Maps."},osPlacesApiKey:{type:"string",title:"OS Places API Key",description:"OS Data Hub API key for a project with the OS Places API. Used when the Address Lookup Provider is OS Places."},inputstr:{type:"string",title:"Input string",description:"JSON string representation of the jobs payload. When nonempty, this takes precedence over Input object."},inputobj:{type:"object",title:"Input object",description:"Preload jobs array and meta",properties:{jobs:{type:"array",items:{type:"object",properties:{id:{type:"string"},address:{type:"string",title:"Address"},uprn:{type:"string",title:"UPRN"},contract:{type:"string",title:"Contract"},notes:{type:"string",title:"Job Notes"},items:{type:"array",items:{type:"object",properties:{itemCode:{type:"string"},name:{type:"string"},price:{type:"number"},quantity:{type:"number"},contract:{type:"string"},spid:{type:"integer"}}}}}}}}},contracts:{type:"string",title:"Contracts (comma-separated)",description:"Provide the list of available contracts separated by commas",defaultValue:""},workItems:{type:"object",title:"Work Items Catalog",description:"Provide work items to choose from grouped by contract",properties:{items:{type:"array",items:{type:"object",properties:{name:{type:"string",title:"Display Name"},contract:{type:"string",title:"Contract key"},itemCode:{type:"string",title:"Item code"},price:{type:"number",title:"Unit price"}}}}}},readOnly:{type:"boolean",title:"Read only",defaultValue:!1},reset:{type:"boolean",title:"Reset",description:"Works like a button: set to true to clear all jobs, the loaded Input object and Input string, and the output value, as if the control had loaded with blank inputs. Reset then switches itself back to false. If the same Input object/string is sent again afterwards it is ignored; a different input loads normally.",defaultValue:!1},outputobj:{type:"object",title:"Output object",isValueField:!0,description:"Complete job pricing data with summary totals",properties:{jobs:{type:"array",title:"Jobs",description:"Array of all jobs with complete details",items:{type:"object",properties:{id:{type:"string",title:"Job ID",description:"Unique job identifier"},address:{type:"string",title:"Address",description:"Job address"},uprn:{type:"string",title:"UPRN",description:"Unique Property Reference Number for the address, when known (empty otherwise)"},contract:{type:"string",title:"Contract",description:"Contract identifier"},contracts:{type:"array",title:"Contracts",description:"Array of all contracts for this job",items:{type:"string"}},notes:{type:"string",title:"Notes",description:"Job notes"},items:{type:"array",title:"Work Items",description:"Work items for this job",items:{type:"object",properties:{name:{type:"string",title:"Item Name",description:"Work item name"},itemCode:{type:"string",title:"Item Code",description:"Work item code"},price:{type:"number",title:"Unit Price",description:"Unit price"},quantity:{type:"number",title:"Quantity",description:"Quantity selected"},cost:{type:"number",title:"Total Cost",description:"Total cost (price × quantity)"},contract:{type:"string",title:"Contract",description:"Associated contract"},spid:{type:"integer",title:"SharePoint ID",description:"SharePoint list item ID for traceability"}}}},totalCost:{type:"number",title:"Job Total Cost",description:"Total cost for this job"},totalItems:{type:"number",title:"Total Items",description:"Total number of work items in this job"}}}},totalJobs:{type:"number",title:"Total Jobs",description:"Total number of jobs"},totalWorkItems:{type:"number",title:"Total Work Items",description:"Total work items across all jobs"},totalPrice:{type:"number",title:"Total Price",description:"Total price of all work across all jobs"}}}},events:["ntx-value-change"],standardProperties:{fieldLabel:!0,description:!0,readOnly:!0,visibility:!0}}}static properties={formMode:{type:String},addressProvider:{type:String},apiKey:{type:String},osPlacesApiKey:{type:String},inputstr:{type:String},inputobj:{type:Object},outputobj:{type:Object},contracts:{type:String},workItems:{type:Object},readOnly:{type:Boolean,reflect:!0},reset:{type:Boolean},jobs:{type:Array},showModal:{type:Boolean},editingIndex:{type:Number},formData:{type:Object},workItemQuery:{type:String},detailsOpen:{type:Object},expandedItemGroups:{state:!0},inputStringError:{type:String},addressSuggestions:{state:!0},addressActiveIndex:{state:!0}};static get styles(){return nt}constructor(){super(),this.formMode="Nintex Cloud Form",this.addressProvider=dt,this.apiKey="",this.osPlacesApiKey="",this.inputstr="",this.inputobj=null,this.outputobj={jobs:[],subtotal:0,count:0},this.contracts="",this.workItems={items:[]},this.currency="£",this.readOnly=!1,this.reset=!1,this.jobs=[],this.showModal=!1,this.editingIndex=-1,this.formData=this.getEmptyForm(),this.workItemQuery="",this.inputStringError="",this.addressSuggestions=[],this.addressActiveIndex=-1,this._placesSessionToken=null,this._addressLookupTimer=null,this._addressRequestSeq=0,this._addressAbort=null,this._warnedMissingAddressKey=!1,this.detailsOpen=new Set,this.expandedItemGroups=new Set,this._designerReadOnly=this.readOnly,this._sharePointForcedReadOnly=!1,this._resetInputSignature=null,this._resetApplying=!1}getEmptyForm(){return{id:"",address:"",uprn:"",contract:"",notes:"",items:[]}}updated(t){if(t.has("showModal")&&!this.showModal&&this.clearAddressLookup(),t.has("addressActiveIndex")&&this.addressActiveIndex>=0){const t=this.renderRoot?.getElementById?.(`address-option-${this.addressActiveIndex}`);t&&t.scrollIntoView({block:"nearest"})}if((t.has("addressProvider")||t.has("apiKey")||t.has("osPlacesApiKey"))&&(this.clearAddressLookup(),this._warnedMissingAddressKey=!1),t.has("readOnly")&&!this._sharePointForcedReadOnly&&(this._designerReadOnly=this.readOnly),t.has("formMode")&&(this.isSharePointForm?(this._sharePointForcedReadOnly||(this._designerReadOnly=this.readOnly),this._sharePointForcedReadOnly=!0,this.readOnly||(this.readOnly=!0)):this._sharePointForcedReadOnly&&(this._sharePointForcedReadOnly=!1,this.readOnly!==this._designerReadOnly&&(this.readOnly=!!this._designerReadOnly))),this._resetApplying)this._resetApplying=!1;else if(t.has("reset")&&this.reset)this.resetComponent();else if(t.has("formMode")||t.has("inputobj")||t.has("inputstr")){if(null!==this._resetInputSignature){if(!t.has("inputobj")&&!t.has("inputstr")||this.getInputSignature()===this._resetInputSignature)return;this._resetInputSignature=null}this.loadConfiguredJobs()}}getInputSignature(){try{return JSON.stringify({obj:null==this.inputobj?null:this.inputobj,str:"string"==typeof this.inputstr?this.inputstr.trim():""})}catch(t){return null}}resetComponent(){this._resetInputSignature=this.getInputSignature(),this._resetApplying=!0,this.reset=!1,this.showModal=!1,this.editingIndex=-1,this.formData=this.getEmptyForm(),this.workItemQuery="",this.detailsOpen=new Set,this.expandedItemGroups=new Set,this.inputStringError="",this.inputobj=null,this.inputstr="",this.jobs=[],this.clearAddressLookup(),this.recomputeAndDispatch()}get isSharePointForm(){return"nintex sharepoint form"===(this.formMode||"").toLowerCase()}get hasInputString(){return"string"==typeof this.inputstr&&this.inputstr.trim().length>0}loadConfiguredJobs(){if(this.hasInputString)return this.inputStringError="",void this.loadFromInputSource(this.parseInputString(this.inputstr));this.inputStringError="",this.loadFromInputSource(this.inputobj)}parseInputString(t){if(!t||"string"!=typeof t)return null;const e=t.trim();if(!e)return null;try{const t=JSON.parse(e);return"string"==typeof t?JSON.parse(t):t}catch(t){return this.inputStringError=t instanceof Error?t.message:"The value is not valid JSON.",null}}renderInputStringError(){return this.inputStringError?L`
      <div class="input-error" role="alert">
        <strong>Input string could not be loaded.</strong>
        <div>The nonempty Input string takes precedence over Input object, so the object value was not used.</div>
        <details>
          <summary>Show details and expected format</summary>
          <p><strong>JSON error:</strong> ${this.inputStringError}</p>
          <p>Provide a JSON object with a <code>jobs</code> array, or a JSON-encoded string containing that object.</p>
          <pre>{
  "jobs": [
    {
      "address": "10 Example Street",
      "items": []
    }
  ]
}</pre>
        </details>
      </div>
    `:null}loadFromInputSource(t){let e=[];t&&(Array.isArray(t.jobs)?e=t.jobs:Array.isArray(t)?e=t:t.jobs&&Array.isArray(t.jobs)&&(e=t.jobs)),e.length>0?(this.jobs=e.map(t=>({id:t.id||at(),address:t.address||"",uprn:null==t.uprn?"":String(t.uprn).trim(),contract:t.contract||"",contracts:t.contracts||[],notes:t.notes||"",items:Array.isArray(t.items)?t.items.map(t=>({itemCode:t.itemCode||"",name:t.name||"",price:Number(t.price)||0,quantity:Number(t.quantity)||0,contract:t.contract||"",spid:t.spid||null,cost:t.cost||0})):[],totalCost:t.totalCost||0,totalItems:t.totalItems||0})),this.recomputeAndDispatch()):(this.jobs=[],this.recomputeAndDispatch())}itemTotal(t){return(Number(t.quantity)||0)*(Number(t.price)||0)}jobTotal(t){return(Array.isArray(t.items)?t.items:[]).reduce((t,e)=>t+this.itemTotal(e),0)}subtotal(){return this.jobs.reduce((t,e)=>t+this.jobTotal(e),0)}recomputeAndDispatch(){const t=this.jobs.map(t=>({...t,uprn:null==t.uprn?"":String(t.uprn),contracts:this.getJobContracts(t),items:(t.items||[]).map(t=>({...t,cost:this.itemTotal(t)})),totalCost:this.jobTotal(t),totalItems:(t.items||[]).length})),e=this.subtotal(),r={jobs:t,totalJobs:this.jobs.length,totalWorkItems:this.jobs.reduce((t,e)=>t+(e.items?.length||0),0),totalPrice:e};this.outputobj=r,this.dispatchEvent(new CustomEvent("ntx-value-change",{detail:this.outputobj,bubbles:!0,composed:!0}))}openAdd=()=>{this.readOnly||(this.formData={...this.getEmptyForm(),id:at()},this.editingIndex=-1,this.workItemQuery="",this.expandedItemGroups=new Set([lt(this.formData.contract)]),this.showModal=!0,this.prepareAddressLookup())};openEdit=t=>{if(this.readOnly)return;const e=this.jobs[t];e&&(this.formData={...this.getEmptyForm(),...e},this.editingIndex=t,this.workItemQuery="",this.expandedItemGroups=new Set([lt(this.formData.contract)]),this.showModal=!0,this.prepareAddressLookup())};closeModal=()=>{this.showModal=!1};onInput=(t,e)=>{const r=t.target?.value;this.formData={...this.formData,[e]:r}};onContractChange=t=>{const e=t.target.value;this.formData={...this.formData,contract:e},this.expandedItemGroups=new Set([lt(e)])};toggleItemGroup=t=>{const e=new Set(this.expandedItemGroups);e.has(t)?e.delete(t):e.add(t),this.expandedItemGroups=e};getContractOptions(){const t=this.contracts;let e=[];if(!t)return e;if(Array.isArray(t))e=t;else if("string"==typeof t){const r=t.trim();if(r.startsWith("[")&&r.endsWith("]")||r.startsWith("{")&&r.endsWith("}"))try{const t=JSON.parse(r);e=Array.isArray(t)?t:t&&"object"==typeof t?[t]:[]}catch{e=r.split(",")}else e=r.split(",")}else"object"==typeof t&&t&&(e=[t]);const r=e.map(t=>"string"==typeof t?t.trim():t&&"object"==typeof t?String(t.contract??t.name??t.value??"").trim():"").filter(Boolean),o=new Set;return r.filter(t=>!o.has(t)&&(o.add(t),!0))}getWorkItemKey(t){const e=String(t?.contract||this.formData.contract||"").trim(),r=String(t?.itemCode||"").trim(),o=String(t?.name||"").trim();return`${e}\0${r||o}`}getAvailableWorkItems(){const t=new Set((this.formData.items||[]).map(t=>this.getWorkItemKey(t))),e=lt(this.formData.contract),r=Array.isArray(this.workItems?.items)?this.workItems.items:[],o=new Set,s=[];r.forEach((e,r)=>{if(!e||!e.name)return;const i=this.getWorkItemKey(e);t.has(i)||o.has(i)||(o.add(i),s.push({w:e,order:r}))});const i=(this.workItemQuery||"").trim().toLowerCase();if(!i)return s.filter(({w:t})=>lt(t.contract)===e).map(({w:t})=>t);const n=i.split(/\s+/).filter(Boolean),a=t=>{const e=String(t.itemCode||"").toLowerCase(),r=String(t.name||"").toLowerCase(),o=lt(t.contract).toLowerCase();if(e&&e===i)return 0;if(e&&e.startsWith(i))return 1;if(e&&e.includes(i))return 2;const s=`${e} ${r} ${o}`;return n.every(t=>s.includes(t))?3:n.every(t=>((t,e)=>{let r=0;for(const o of t){if(r=e.indexOf(o,r),-1===r)return!1;r++}return!0})(t,r))?4:-1};let l=s.map(t=>({...t,score:a(t.w)})).filter(t=>t.score>=0);return l.some(t=>t.score<4)&&(l=l.filter(t=>t.score<4)),l.sort((t,r)=>t.score-r.score||(lt(t.w.contract)===e?0:1)-(lt(r.w.contract)===e?0:1)||lt(t.w.contract).localeCompare(lt(r.w.contract))||t.order-r.order).map(({w:t})=>t)}getSelectedItemGroups(){const t=lt(this.formData.contract),e=new Map;return(this.formData.items||[]).forEach((t,r)=>{const o=lt(t?.contract);e.has(o)||e.set(o,{contract:o,entries:[],total:0});const s=e.get(o);s.entries.push({item:t,index:r}),s.total+=this.itemTotal(t)}),Array.from(e.values()).sort((e,r)=>(e.contract===t?0:1)-(r.contract===t?0:1))}addSelectedWorkItems=t=>{const e=t.target,r=Array.from(e.selectedOptions||[]);if(0===r.length)return;const o=new Set(r.map(t=>t.value)),s=new Set((this.formData.items||[]).map(t=>this.getWorkItemKey(t))),i=[];for(const t of this.getAvailableWorkItems()){const e=this.getWorkItemKey(t);o.has(t.name)&&!s.has(e)&&(i.push({itemCode:t.itemCode||"",name:t.name,price:Number(t.price)||0,quantity:1,contract:t.contract||this.formData.contract||"",spid:t.spid||null}),s.add(e))}this.formData={...this.formData,items:[...this.formData.items||[],...i]},e.selectedIndex=-1};addWorkItem=t=>{if(!t)return;const e=this.getWorkItemKey(t),r=(this.formData.items||[]).some(t=>this.getWorkItemKey(t)===e);if(r)return;const o={itemCode:t.itemCode||"",name:t.name,price:Number(t.price)||0,quantity:1,contract:t.contract||this.formData.contract||"",spid:t.spid||null};this.formData={...this.formData,items:[...this.formData.items||[],o]}};getJobContracts(t){const e=new Set,r=t.contract;return Array.isArray(r)?r.forEach(t=>{t&&e.add(String(t).trim())}):"string"==typeof r&&r.split(",").map(t=>t.trim()).filter(Boolean).forEach(t=>e.add(t)),(t.items||[]).forEach(t=>{t&&t.contract&&e.add(String(t.contract).trim())}),Array.from(e).filter(Boolean)}toggleDetails=t=>{const e=new Set(this.detailsOpen||[]);e.has(t)?e.delete(t):e.add(t),this.detailsOpen=e};updateItemQty=(t,e)=>{const r=Math.max(0,Number(e.target.value||0)),o=[...this.formData.items||[]];o[t]&&(o[t]={...o[t],quantity:r},this.formData={...this.formData,items:o})};removeSelectedItem=t=>{const e=(this.formData.items||[]).filter((e,r)=>r!==t);this.formData={...this.formData,items:e}};save=()=>{const t={...this.formData};if(Array.isArray(t.items)&&0!==t.items.length){if(-1===this.editingIndex)this.jobs=[...this.jobs,t];else{const e=[...this.jobs];e[this.editingIndex]=t,this.jobs=e}this.showModal=!1,this.recomputeAndDispatch()}};removeJob=t=>{!Number.isInteger(t)||t<0||t>=this.jobs.length||(this.jobs=this.jobs.filter((e,r)=>r!==t),this.editingIndex=-1,this.showModal=!1,this.recomputeAndDispatch())};renderRow(t,e){const r=this.getJobContracts(t),o=!(!t.notes||!String(t.notes).trim()),s=t.items||[],i=s.length>0||o,n=this.readOnly||this.detailsOpen?.has(t.id);return L`
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div>
              <div class="field-line">
                <span class="inline-label">Address:</span>
                <span class="title">${t.address||"Untitled job"}</span>
              </div>
              ${r.length?L`
                <div class="field-line" style="margin-top:.25rem; display:flex; align-items:center; justify-content:space-between;">
                  <div style="display:flex; align-items:center; gap:.5rem;">
                    <span class="inline-label">Contracts:</span>
                    <span class="pill-group">
                      ${r.map(t=>L`<span class="pill">${t}</span>`)}
                    </span>
                  </div>
                  <div class="summary">${s.length} work item${1===s.length?"":"s"} - <strong>${this.currency}${this.jobTotal(t).toFixed(2)}</strong></div>
                </div>
              `:L`
                <div class="field-line" style="margin-top:.25rem;">
                  <div class="summary">${s.length} work item${1===s.length?"":"s"} - <strong>${this.currency}${this.jobTotal(t).toFixed(2)}</strong></div>
                </div>
              `}
            </div>
            <div class="right">
              <div class="right-actions">
                ${this.readOnly?"":L`
                  <button class="btn btn-light btn-compact" title="Edit" aria-label="Edit" @click=${()=>this.openEdit(e)} style="min-width: 90px; display:flex; justify-content:space-between; align-items:center;">
                    <span>Edit</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                `}
                ${i&&!this.readOnly?L`
                  <button class="btn btn-light btn-compact" title="${n?"Hide":"Show"} details" aria-label="${n?"Hide":"Show"} details" @click=${()=>this.toggleDetails(t.id)} style="min-width: 90px; display:flex; justify-content:space-between; align-items:center;">
                    <span>Details</span>
                    ${n?L`
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 15l6-6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    `:L`
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    `}
                  </button>
                `:""}
              </div>
            </div>
          </div>
          
          ${n&&i?L`
            <div class="job-details">
              ${s.length>0?L`
                <table class="items-table">
                  <thead>
                    <tr>
                      <th class="code-col">Code</th>
                      <th>Work Item</th>
                      <th class="contract-col">Contract</th>
                      <th class="qty-col">Qty</th>
                      <th class="price-col text-right">Unit Price</th>
                      <th class="cost-col text-right">Total Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${s.map(t=>L`
                      <tr>
                        <td class="code-col">${t.itemCode||""}</td>
                        <td>${t.name}</td>
                        <td class="contract-col">${t.contract||""}</td>
                        <td class="qty-col text-right">${t.quantity||0}</td>
                        <td class="price-col text-right">${this.currency}${(Number(t.price)||0).toFixed(2)}</td>
                        <td class="cost-col text-right"><strong>${this.currency}${this.itemTotal(t).toFixed(2)}</strong></td>
                      </tr>
                    `)}
                  </tbody>
                </table>
              `:""}
              
              ${o?L`
                <div class="job-notes">
                  <strong>Notes:</strong> ${t.notes}
                </div>
              `:""}
            </div>
          `:""}
        </div>
      </div>
    `}renderAvailableWorkItems(){const t=!!(this.workItemQuery||"").trim(),e=lt(this.formData.contract),r=this.getAvailableWorkItems(),o=t?r.slice(0,50):r;let s="";return r.length||(s=t?`No work items match "${this.workItemQuery.trim()}".`:e?`No more work items for ${e}. Search to add items from any contract.`:"Select a contract to see its work items, or search to find items from any contract."),L`
      ${s?L`<div class="avail-empty muted">${s}</div>`:L`
        <div class="avail-list" role="list" aria-label=${t?"Matching work items":`Work items for ${e||"no contract"}`}>
          ${o.map(t=>{const r=lt(t.contract);return L`
              <div class="avail-row" role="listitem">
                <div class="avail-main">
                  <div class="avail-title">${t.name}</div>
                  <div class="avail-meta">
                    <span class="avail-price">${this.currency}${Number(t.price).toFixed(2)}</span>
                    <span class="pill pill-sm ${r===e?"":"pill-muted"}">${r||"No contract"}</span>
                  </div>
                </div>
                <div class="avail-actions">
                  <button class="icon-btn success" @click=${()=>this.addWorkItem(t)}
                    aria-label=${`Add ${t.name}${r?` (${r})`:""}`} title="Add">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    </svg>
                  </button>
                </div>
              </div>
            `})}
        </div>
        ${t&&r.length>o.length?L`
          <div class="avail-note muted">Showing ${o.length} of ${r.length} matches. Keep typing to narrow the list.</div>
        `:""}
      `}
    `}renderSelectedItems(){const t=this.getSelectedItemGroups();return t.length?L`
      <div class="list-table">
        <div class="list-head sm">
          <div>Selected Work Item</div>
          <div class="center">Price</div>
          <div class="center">Qty</div>
          <div class="center">Cost</div>
          <div></div>
        </div>
        ${t.map((t,e)=>{const r=t.contract||"No contract",o=this.expandedItemGroups.has(t.contract),s=`item-group-${e}`;return L`
          <div class="item-group ${o?"expanded":"collapsed"}" role="group" aria-label=${`${r} work items`}>
            <button type="button" class="item-group-head" aria-expanded=${o?"true":"false"} aria-controls=${s}
              @click=${()=>this.toggleItemGroup(t.contract)}>
              <svg class="item-group-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span class="item-group-name">${r}</span>
              <span class="item-group-total">${t.entries.length} item${1===t.entries.length?"":"s"} · ${this.currency}${t.total.toFixed(2)}</span>
            </button>
            <div class="item-group-body" id=${s} ?hidden=${!o}>
            ${t.entries.map(({item:t,index:e})=>L`
              <div class="list-row">
                <div class="cell-name">
                  <div class="title">${t.name}</div>
                </div>
                <div class="cell-numbers">
                  <div class="cell-unit"><span class="cell-label">Price </span><span class="sm">${this.currency}${Number(t.price).toFixed(2)}</span></div>
                  <div class="cell-qty"><span class="cell-label">Qty </span><input class="qty-input" type="number" min="0" step="1" inputmode="numeric" aria-label=${`Quantity for ${t.name}`} .value=${String(t.quantity??0)} @input=${t=>this.updateItemQty(e,t)} /></div>
                  <div class="cell-cost"><span class="cell-label">Cost </span><span class="total">${this.currency}${this.itemTotal(t).toFixed(2)}</span></div>
                </div>
                <div class="cell-remove">
                  <button class="icon-btn" title="Remove" aria-label=${`Remove ${t.name}`} @click=${()=>this.removeSelectedItem(e)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="2"/>
                      <path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            `)}
            </div>
          </div>
        `})}
      </div>
    `:L`<div class="muted">No items selected yet.</div>`}renderModal(){if(!this.showModal)return null;const t=this.editingIndex>-1;return L`
      <div class="backdrop" @click=${t=>{t.target===t.currentTarget&&this.closeModal()}}>
        <div class="modal" role="dialog" aria-modal="true">
          <div class="modal-header">
            <div class="card-title">${t?"Edit Job":"Add Job"}</div>
            <button class="btn btn-light" @click=${this.closeModal}>Close</button>
          </div>
          <div class="modal-body">
            <div class="form-grid">
              <div class="form-group" style="grid-column: 1 / -1;">
                <label>Address</label>
                ${this.renderAddressField()}
              </div>
              <div class="form-group" style="grid-column: 1 / -1;">
                <label>Contract</label>
                <select .value=${this.formData.contract} @change=${this.onContractChange}>
                  <option value="">Select contract</option>
                  ${this.getContractOptions().map(t=>L`<option value="${t}">${t}</option>`)}
                </select>
              </div>
              <div class="form-group" style="grid-column: 1 / -1;">
                <label for="workItemSearch">Work Items</label>
                <input id="workItemSearch" type="search" placeholder="Search all contracts by code or name"
                  .value=${this.workItemQuery} autocomplete="off"
                  @input=${t=>{this.workItemQuery=t.target.value}} />
                ${this.renderAvailableWorkItems()}
              </div>
              <div class="form-group" style="grid-column: 1 / -1;">
                ${this.renderSelectedItems()}
              </div>
              <div class="form-group" style="grid-column: 1 / -1;">
                <label>Job Notes</label>
                <textarea .value=${this.formData.notes} @input=${t=>this.onInput(t,"notes")} placeholder="Add any notes about this job"></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <div class="muted">Job total: <strong>${this.currency}${this.jobTotal(this.formData).toFixed(2)}</strong></div>
            <div class="actions">
              ${t?L`<button class="btn btn-danger" @click=${()=>this.removeJob(this.editingIndex)}>Delete</button>`:""}
              <button class="btn btn-outline" @click=${this.closeModal}>Cancel</button>
              <button class="btn btn-primary" @click=${this.save} ?disabled=${!(this.formData.items?.length>0)}>Save</button>
            </div>
          </div>
        </div>
      </div>
    `}get addressLookupProvider(){return this.addressProvider===ct?"os":"google"}get addressLookupKey(){const t="os"===this.addressLookupProvider?this.osPlacesApiKey:this.apiKey;return"string"==typeof t?t.trim():""}prepareAddressLookup(){this.addressLookupKey?"google"===this.addressLookupProvider&&yt(this.addressLookupKey).catch(t=>{console.warn("neo-pricework: address suggestions unavailable:",t)}):this._warnedMissingAddressKey||(this._warnedMissingAddressKey=!0,console.info(`neo-pricework: no ${"os"===this.addressLookupProvider?"OS Places":"Google Maps"} API key set; address suggestions are off.`))}clearAddressLookup(){this.closeAddressSuggestions(),this._placesSessionToken=null}closeAddressSuggestions(){clearTimeout(this._addressLookupTimer),this._addressLookupTimer=null,this._addressRequestSeq++,this._addressAbort&&(this._addressAbort.abort(),this._addressAbort=null),this.addressSuggestions.length&&(this.addressSuggestions=[]),-1!==this.addressActiveIndex&&(this.addressActiveIndex=-1)}onAddressTyping=t=>{const e=t.target.value;this.formData={...this.formData,address:e,uprn:""},clearTimeout(this._addressLookupTimer),!this.addressLookupKey||e.trim().length<3?this.closeAddressSuggestions():this._addressLookupTimer=setTimeout(()=>this.fetchAddressSuggestions(e),250)};async fetchAddressSuggestions(t){const e=++this._addressRequestSeq;this._addressAbort&&this._addressAbort.abort();const r=new AbortController;this._addressAbort=r;try{const o="os"===this.addressLookupProvider?await this.fetchOsPlacesSuggestions(t,r.signal):await this.fetchGoogleSuggestions(t,e);if(!o||e!==this._addressRequestSeq||!this.showModal||this.formData.address!==t)return;this.addressSuggestions=o,this.addressActiveIndex=-1}catch(t){if("AbortError"===t?.name||e!==this._addressRequestSeq)return;this.addressSuggestions=[],console.warn("neo-pricework: address suggestions failed:",t)}finally{this._addressAbort===r&&(this._addressAbort=null)}}async fetchGoogleSuggestions(t,e){const r=await yt(this.addressLookupKey);if(e!==this._addressRequestSeq)return null;this._placesSessionToken||(this._placesSessionToken=new r.AutocompleteSessionToken);const{suggestions:o}=await r.AutocompleteSuggestion.fetchAutocompleteSuggestions({input:t,sessionToken:this._placesSessionToken,includedPrimaryTypes:ht,includedRegionCodes:pt});return(o||[]).filter(t=>t.placePrediction).slice(0,5).map(t=>({provider:"google",text:t.placePrediction.text.toString(),mainText:t.placePrediction.mainText?t.placePrediction.mainText.toString():"",secondaryText:t.placePrediction.secondaryText?t.placePrediction.secondaryText.toString():"",prediction:t.placePrediction}))}async fetchOsPlacesSuggestions(t,e){const r=t.trim(),o=mt.test(r),s=o?await ut("postcode",{postcode:r,maxresults:100},this.addressLookupKey,e):await ut("find",{query:r,maxresults:5},this.addressLookupKey,e),i=new Set;return s.map(gt).filter(t=>{const e=t.uprn||t.address;return!(!t.address||i.has(e)||(i.add(e),0))}).slice(0,o?100:5)}async selectAddressSuggestion(t){if(!t)return;const e=this.formData.id;if(this.closeAddressSuggestions(),"os"===t.provider)return void(this.formData={...this.formData,address:t.address,uprn:t.uprn});let r=t.text;try{const e=t.prediction.toPlace();await e.fetchFields({fields:["formattedAddress"]}),e.formattedAddress&&(r=e.formattedAddress)}catch(t){console.warn("neo-pricework: could not fetch the formatted address; using the suggestion text:",t)}this._placesSessionToken=null,this.showModal&&this.formData.id===e&&(this.formData={...this.formData,address:r,uprn:""})}onAddressKeydown=t=>{const e=this.addressSuggestions.length;e&&("ArrowDown"===t.key?(t.preventDefault(),this.addressActiveIndex=(this.addressActiveIndex+1)%e):"ArrowUp"===t.key?(t.preventDefault(),this.addressActiveIndex=this.addressActiveIndex<=0?e-1:this.addressActiveIndex-1):"Enter"===t.key&&this.addressActiveIndex>=0?(t.preventDefault(),this.selectAddressSuggestion(this.addressSuggestions[this.addressActiveIndex])):"Escape"===t.key&&(t.preventDefault(),t.stopPropagation(),this.closeAddressSuggestions()))};onAddressBlur=()=>{this.closeAddressSuggestions()};renderAddressAttribution(){return"os"===this.addressLookupProvider?`Contains OS data © Crown copyright and database rights ${(new Date).getFullYear()}`:"Google Maps"}renderAddressField(){const t=this.addressSuggestions||[],e=t.length>0,r=this.addressActiveIndex;return L`
      <div class="address-field">
        <input id="addressInput" type="text" .value=${this.formData.address||""}
          role="combobox" aria-autocomplete="list" aria-expanded=${e?"true":"false"}
          aria-controls="addressSuggestions"
          aria-activedescendant=${e&&r>=0?`address-option-${r}`:q}
          autocomplete="off"
          @input=${this.onAddressTyping}
          @keydown=${this.onAddressKeydown}
          @blur=${this.onAddressBlur}
          placeholder=${"os"===this.addressLookupProvider?"Search for an address or postcode":"Search for an address"} />
        ${e?L`
          <ul id="addressSuggestions" class="address-suggestions" role="listbox" aria-label="Address suggestions">
            ${t.map((t,e)=>L`
              <li id="address-option-${e}" role="option" aria-selected=${e===r?"true":"false"}
                class="address-option ${e===r?"active":""}"
                @mousedown=${t=>t.preventDefault()}
                @mouseenter=${()=>{this.addressActiveIndex=e}}
                @click=${()=>this.selectAddressSuggestion(t)}>
                <span class="address-main">${t.mainText||t.text}</span>
                ${t.secondaryText?L`<span class="address-secondary">${t.secondaryText}</span>`:""}
              </li>
            `)}
            <li class="address-attribution" role="presentation" aria-hidden="true">${this.renderAddressAttribution()}</li>
          </ul>
        `:""}
      </div>
    `}render(){const t=this.subtotal();return L`
      <div class="list-header">
        <div class="card-title">Jobs</div>
        <span class="badge">${this.jobs.length} item${1===this.jobs.length?"":"s"}</span>
      </div>

      ${this.renderInputStringError()}

      <div class="rows">
        ${0===this.jobs.length?L`<div class="empty">No jobs yet. Use the button below to add your first job.</div>`:this.jobs.map((t,e)=>this.renderRow(t,e))}
      </div>

      ${this.readOnly?L`
        <div class="footer" style="text-align: right; font-weight: 700; font-size: 16px;">
          <div>Total Jobs: ${this.jobs.length}</div>
          <div>Total Work Items: ${this.jobs.reduce((t,e)=>t+(e.items?.length||0),0)}</div>
          <div>Grand Total: ${this.currency}${t.toFixed(2)}</div>
        </div>
      `:L`
        <div class="footer">
          <div class="muted">Subtotal</div>
          <div class="total">${this.currency}${t.toFixed(2)}</div>
        </div>
      `}

      ${this.readOnly?"":L`
        <div style="margin-top:.5rem; display:flex; justify-content:flex-end;">
          <button class="btn btn-primary" @click=${this.openAdd}>Add Job</button>
        </div>
      `}

      ${this.renderModal()}
    `}}customElements.define("neo-pricework",xt)})();