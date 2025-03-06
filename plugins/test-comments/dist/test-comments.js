/*! For license information please see test-comments.js.LICENSE.txt */
(()=>{"use strict";const t=window,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;class r{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}}const o=(t,...e)=>{const s=1===t.length?t[0]:e.reduce(((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1]),t[0]);return new r(s,t,i)},n=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,i))(e)})(t):t;var a;const l=window,d=l.trustedTypes,h=d?d.emptyScript:"",c=l.reactiveElementPolyfillSupport,m={toAttribute(t,e){switch(e){case Boolean:t=t?h:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},p=(t,e)=>e!==t&&(e==e||t==t),u={attribute:!0,type:String,converter:m,reflect:!1,hasChanged:p};class g extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,i)=>{const s=this._$Ep(i,e);void 0!==s&&(this._$Ev.set(s,i),t.push(s))})),t}static createProperty(t,e=u){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,i,e);void 0!==s&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){const r=this[t];this[e]=s,this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||u}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var i;const s=null!==(i=this.shadowRoot)&&void 0!==i?i:this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{e?i.adoptedStyleSheets=s.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):s.forEach((e=>{const s=document.createElement("style"),r=t.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}))})(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=u){var s;const r=this.constructor._$Ep(t,i);if(void 0!==r&&!0===i.reflect){const o=(void 0!==(null===(s=i.converter)||void 0===s?void 0:s.toAttribute)?i.converter:m).toAttribute(e,i.type);this._$El=t,null==o?this.removeAttribute(r):this.setAttribute(r,o),this._$El=null}}_$AK(t,e){var i;const s=this.constructor,r=s._$Ev.get(t);if(void 0!==r&&this._$El!==r){const t=s.getPropertyOptions(r),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:m;this._$El=r,this[r]=o.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let s=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||p)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,e)=>this[e]=t)),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,e)=>this._$EO(e,this[e],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}var v;g.finalized=!0,g.elementProperties=new Map,g.elementStyles=[],g.shadowRootOptions={mode:"open"},null==c||c({ReactiveElement:g}),(null!==(a=l.reactiveElementVersions)&&void 0!==a?a:l.reactiveElementVersions=[]).push("1.6.1");const f=window,y=f.trustedTypes,b=y?y.createPolicy("lit-html",{createHTML:t=>t}):void 0,$=`lit$${(Math.random()+"").slice(9)}$`,_="?"+$,A=`<${_}>`,S=document,x=(t="")=>S.createComment(t),w=t=>null===t||"object"!=typeof t&&"function"!=typeof t,C=Array.isArray,E=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,k=/>/g,U=RegExp(">|[ \t\n\f\r](?:([^\\s\"'>=/]+)([ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r\"'`<>=]|(\"|')|))|$)","g"),O=/'/g,P=/"/g,H=/^(?:script|style|textarea|title)$/i,L=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),R=L(1),T=(L(2),Symbol.for("lit-noChange")),j=Symbol.for("lit-nothing"),B=new WeakMap,D=S.createTreeWalker(S,129,null,!1),M=(t,e)=>{const i=t.length-1,s=[];let r,o=2===e?"<svg>":"",n=E;for(let e=0;e<i;e++){const i=t[e];let a,l,d=-1,h=0;for(;h<i.length&&(n.lastIndex=h,l=n.exec(i),null!==l);)h=n.lastIndex,n===E?"!--"===l[1]?n=N:void 0!==l[1]?n=k:void 0!==l[2]?(H.test(l[2])&&(r=RegExp("</"+l[2],"g")),n=U):void 0!==l[3]&&(n=U):n===U?">"===l[0]?(n=null!=r?r:E,d=-1):void 0===l[1]?d=-2:(d=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?U:'"'===l[3]?P:O):n===P||n===O?n=U:n===N||n===k?n=E:(n=U,r=void 0);const c=n===U&&t[e+1].startsWith("/>")?" ":"";o+=n===E?i+A:d>=0?(s.push(a),i.slice(0,d)+"$lit$"+i.slice(d)+$+c):i+$+(-2===d?(s.push(void 0),e):c)}const a=o+(t[i]||"<?>")+(2===e?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==b?b.createHTML(a):a,s]};class z{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,o=0;const n=t.length-1,a=this.parts,[l,d]=M(t,e);if(this.el=z.createElement(l,i),D.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(s=D.nextNode())&&a.length<n;){if(1===s.nodeType){if(s.hasAttributes()){const t=[];for(const e of s.getAttributeNames())if(e.endsWith("$lit$")||e.startsWith($)){const i=d[o++];if(t.push(e),void 0!==i){const t=s.getAttribute(i.toLowerCase()+"$lit$").split($),e=/([.?@])?(.*)/.exec(i);a.push({type:1,index:r,name:e[2],strings:t,ctor:"."===e[1]?q:"?"===e[1]?J:"@"===e[1]?K:F})}else a.push({type:6,index:r})}for(const e of t)s.removeAttribute(e)}if(H.test(s.tagName)){const t=s.textContent.split($),e=t.length-1;if(e>0){s.textContent=y?y.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],x()),D.nextNode(),a.push({type:2,index:++r});s.append(t[e],x())}}}else if(8===s.nodeType)if(s.data===_)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf($,t+1));)a.push({type:7,index:r}),t+=$.length-1}r++}}static createElement(t,e){const i=S.createElement("template");return i.innerHTML=t,i}}function I(t,e,i=t,s){var r,o,n,a;if(e===T)return e;let l=void 0!==s?null===(r=i._$Co)||void 0===r?void 0:r[s]:i._$Cl;const d=w(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==d&&(null===(o=null==l?void 0:l._$AO)||void 0===o||o.call(l,!1),void 0===d?l=void 0:(l=new d(t),l._$AT(t,i,s)),void 0!==s?(null!==(n=(a=i)._$Co)&&void 0!==n?n:a._$Co=[])[s]=l:i._$Cl=l),void 0!==l&&(e=I(t,l._$AS(t,e.values),l,s)),e}class W{constructor(t,e){this.u=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}v(t){var e;const{el:{content:i},parts:s}=this._$AD,r=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:S).importNode(i,!0);D.currentNode=r;let o=D.nextNode(),n=0,a=0,l=s[0];for(;void 0!==l;){if(n===l.index){let e;2===l.type?e=new V(o,o.nextSibling,this,t):1===l.type?e=new l.ctor(o,l.name,l.strings,this,t):6===l.type&&(e=new G(o,this,t)),this.u.push(e),l=s[++a]}n!==(null==l?void 0:l.index)&&(o=D.nextNode(),n++)}return r}p(t){let e=0;for(const i of this.u)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class V{constructor(t,e,i,s){var r;this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cm=null===(r=null==s?void 0:s.isConnected)||void 0===r||r}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cm}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=I(this,t,e),w(t)?t===j||null==t||""===t?(this._$AH!==j&&this._$AR(),this._$AH=j):t!==this._$AH&&t!==T&&this.g(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>C(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.k(t):this.g(t)}O(t,e=this._$AB){return this._$AA.parentNode.insertBefore(t,e)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}g(t){this._$AH!==j&&w(this._$AH)?this._$AA.nextSibling.data=t:this.T(S.createTextNode(t)),this._$AH=t}$(t){var e;const{values:i,_$litType$:s}=t,r="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=z.createElement(s.h,this.options)),s);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===r)this._$AH.p(i);else{const t=new W(r,this),e=t.v(this.options);t.p(i),this.T(e),this._$AH=t}}_$AC(t){let e=B.get(t.strings);return void 0===e&&B.set(t.strings,e=new z(t)),e}k(t){C(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new V(this.O(x()),this.O(x()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cm=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class F{constructor(t,e,i,s,r){this.type=1,this._$AH=j,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=j}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,s){const r=this.strings;let o=!1;if(void 0===r)t=I(this,t,e,0),o=!w(t)||t!==this._$AH&&t!==T,o&&(this._$AH=t);else{const s=t;let n,a;for(t=r[0],n=0;n<r.length-1;n++)a=I(this,s[i+n],e,n),a===T&&(a=this._$AH[n]),o||(o=!w(a)||a!==this._$AH[n]),a===j?t=j:t!==j&&(t+=(null!=a?a:"")+r[n+1]),this._$AH[n]=a}o&&!s&&this.j(t)}j(t){t===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class q extends F{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===j?void 0:t}}const Z=y?y.emptyScript:"";class J extends F{constructor(){super(...arguments),this.type=4}j(t){t&&t!==j?this.element.setAttribute(this.name,Z):this.element.removeAttribute(this.name)}}class K extends F{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=I(this,t,e,0))&&void 0!==i?i:j)===T)return;const s=this._$AH,r=t===j&&s!==j||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==j&&(s===j||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class G{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){I(this,t)}}const Q=f.litHtmlPolyfillSupport;var X,Y;null==Q||Q(z,V),(null!==(v=f.litHtmlVersions)&&void 0!==v?v:f.litHtmlVersions=[]).push("2.6.1");class tt extends g{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var s,r;const o=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:e;let n=o._$litPart$;if(void 0===n){const t=null!==(r=null==i?void 0:i.renderBefore)&&void 0!==r?r:null;o._$litPart$=n=new V(e.insertBefore(x(),t),t,void 0,null!=i?i:{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return T}}tt.finalized=!0,tt._$litElement$=!0,null===(X=globalThis.litElementHydrateSupport)||void 0===X||X.call(globalThis,{LitElement:tt});const et=globalThis.litElementPolyfillSupport;null==et||et({LitElement:tt}),(null!==(Y=globalThis.litElementVersions)&&void 0!==Y?Y:globalThis.litElementVersions=[]).push("3.2.2");class it extends tt{static get styles(){return o`
      :host {
        display: block;
        max-width: 100%;
      }
  
      .comments-history {
        display: flex;
        flex-direction: column;
      }
  
      .comment-card {
        border: none;
        border-radius: 0;
        margin: 0;
        padding: 0;
        transition: background-color 0.3s ease, box-shadow 0.3s ease;
        border-bottom: 1px solid #ddd;
      }
  
      .comment-card:first-child {
        border-top: 1px solid #ddd;
        margin-top: 1rem;
      }
  
      .comment-card:hover {
        background-color: #f8f9fa; /* Light background on hover */
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Subtle shadow on hover */
      }
  
      .comment-card.selected {
        background-color: #e9ecef; /* Selected state color */
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); /* Slightly stronger shadow */
      }
  
      .card-body {
        padding: 1rem;
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
        padding: 0.5rem;
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
      }

      .btn-default:disabled {
        background-color: var(--ntx-form-theme-color-primary-button-disabled);
        border-color: var(--ntx-form-theme-color-primary-button-disabled);
        color: var(--ntx-form-theme-color-primary-button-font);
      }
  
    `}static getMetaConfig(){return{controlName:"test-comments",fallbackDisableSubmit:!1,description:"Notes and comments",iconUrl:"",groupName:"NEO",version:"1.0",properties:{firstName:{type:"string",title:"First name"},lastName:{type:"string",title:"Last name"},email:{type:"string",title:"Email Address"},badge:{type:"string",description:"Label for status badge e.g. Rejected, Approved, Return etc. Default blank value is Update",title:"Badge"},badgeStyle:{type:"string",description:"Select the style for the badge from the dropdown based on Bootstrap 5 badge",title:"Badge Style",enum:["Default","Primary","Secondary","Success","Danger","Warning","Info","Light","Dark"],defaultValue:"Default"},inputobj:{type:"object",title:"Input Object",description:"Enter the comments object from previous control here"},outputobj:{title:"Comments Output",type:"object",description:"Workflow Comments Output - Do Not Use",isValueField:!0,properties:{Comments:{type:"object",description:"Array of comments",items:{type:"array",properties:{firstName:{type:"string",description:"First Name",title:"First Name"},lastName:{type:"string",description:"Last Name",title:"Last Name"},email:{type:"string",description:"Email Address",title:"Email Address"},badge:{type:"string",description:"Badge Status",title:"Badge Status"},badgeStyle:{type:"string",description:"Badge Style",title:"Badge Style"},comment:{type:"string",description:"Comment",title:"Comment"},timestamp:{type:"string",format:"date-time",description:"Log time",title:"Log time"}}}},mostRecentComment:{type:"object",description:"Latest comment",properties:{firstName:{type:"string",description:"First Name",title:"First Name"},lastName:{type:"string",description:"Last Name",title:"Last Name"},email:{type:"string",description:"Email Address",title:"Email Address"},badge:{type:"string",description:"Badge Status",title:"Badge Status"},badgeStyle:{type:"string",description:"Badge Style",title:"Badge Style"},comment:{type:"string",description:"Comment",title:"Comment"},timestamp:{type:"string",format:"date-time",description:"Log time",title:"Log time"}}}}}},events:["ntx-value-change"],standardProperties:{fieldLabel:!0,description:!0,readOnly:!0}}}static properties={firstName:{type:String},lastName:{type:String},email:{type:String},badge:{type:String},badgeStyle:{type:String},inputobj:{type:Object},workingComments:{type:Array},newComment:{type:String},readOnly:{type:Boolean}};constructor(){super(),this.firstName="",this.lastName="",this.email="",this.badge="Update",this.badgeStyle="Default",this.inputobj=null,this.workingComments=[],this.newComment=""}updated(t){t.has("inputobj")&&Array.isArray(this.inputobj?.comments)&&(this.workingComments=[...this.inputobj.comments]),t.has("readOnly")&&this.requestUpdate()}handleCommentChange(t){this.newComment=t.target.value}addComment(){const t=(new Date).toISOString(),e={firstName:this.firstName||"Anonymous",lastName:this.lastName||"",email:this.email||"N/A",badge:this.badge||"Update",badgeStyle:this.badgeStyle||"Default",comment:this.newComment,timestamp:t};this.workingComments=[...this.workingComments,e];const i=e,s={comments:this.workingComments,mostRecentComment:i};this.dispatchEvent(new CustomEvent("ntx-value-change",{detail:s})),this.newComment=""}render(){return R`
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  
      <div class="comments-history">
        ${this.workingComments.length>0?this.workingComments.map((t=>R`
                <div class="card comment-card">
                  <div class="card-body">
                    <div class="d-flex flex-row align-items-center">
                      <h6 class="fw-bold mb-0 me-2">${t.firstName} ${t.lastName||""}</h6>
                      <p class="mb-0 text-muted me-2">
                        ${new Date(t.timestamp).toLocaleString("en-GB",{weekday:"short",year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!1})}
                      </p>
                      <span class="badge ${this.getBadgeClass(t.badgeStyle)||"Default"} ms-2">${t.badge||"Update"}</span>
                    </div>
                    <div>
                      <p class="mb-0 py-3 comment-text">${t.comment}</p>
                    </div>
                  </div>
                </div>
              `)):R``}
      </div>
  
      ${this.readOnly?"":R`
        <div class="mt-4">
          <textarea
            class="form-control comment-textarea"
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
            Add Comment
          </button>
        </div>
      `}
    `}getBadgeClass(t){const e={Default:"badge badge-default",Primary:"badge bg-primary text-white",Secondary:"badge bg-secondary text-white",Success:"badge bg-success text-white",Danger:"badge bg-danger text-white",Warning:"badge bg-warning text-dark",Info:"badge bg-info text-dark",Light:"badge bg-light text-dark",Dark:"badge bg-dark text-white"};return e[t]||e.Default}}customElements.define("test-comments",it)})();