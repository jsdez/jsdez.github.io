/*! For license information please see neo-comments.js.LICENSE.txt */
(()=>{"use strict";const t=window,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;class o{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}}const n=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,i))(e)})(t):t;var r;const l=window,a=l.trustedTypes,h=a?a.emptyScript:"",d=l.reactiveElementPolyfillSupport,c={toAttribute(t,e){switch(e){case Boolean:t=t?h:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},m=(t,e)=>e!==t&&(e==e||t==t),p={attribute:!0,type:String,converter:c,reflect:!1,hasChanged:m};class u extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,i)=>{const s=this._$Ep(i,e);void 0!==s&&(this._$Ev.set(s,i),t.push(s))})),t}static createProperty(t,e=p){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,i,e);void 0!==s&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){const o=this[t];this[e]=s,this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||p}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var i;const s=null!==(i=this.shadowRoot)&&void 0!==i?i:this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{e?i.adoptedStyleSheets=s.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):s.forEach((e=>{const s=document.createElement("style"),o=t.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=e.cssText,i.appendChild(s)}))})(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=p){var s;const o=this.constructor._$Ep(t,i);if(void 0!==o&&!0===i.reflect){const n=(void 0!==(null===(s=i.converter)||void 0===s?void 0:s.toAttribute)?i.converter:c).toAttribute(e,i.type);this._$El=t,null==n?this.removeAttribute(o):this.setAttribute(o,n),this._$El=null}}_$AK(t,e){var i;const s=this.constructor,o=s._$Ev.get(t);if(void 0!==o&&this._$El!==o){const t=s.getPropertyOptions(o),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:c;this._$El=o,this[o]=n.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let s=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||m)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,e)=>this[e]=t)),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,e)=>this._$EO(e,this[e],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}var g;u.finalized=!0,u.elementProperties=new Map,u.elementStyles=[],u.shadowRootOptions={mode:"open"},null==d||d({ReactiveElement:u}),(null!==(r=l.reactiveElementVersions)&&void 0!==r?r:l.reactiveElementVersions=[]).push("1.6.1");const v=window,f=v.trustedTypes,b=f?f.createPolicy("lit-html",{createHTML:t=>t}):void 0,y=`lit$${(Math.random()+"").slice(9)}$`,$="?"+y,_=`<${$}>`,A=document,w=(t="")=>A.createComment(t),x=t=>null===t||"object"!=typeof t&&"function"!=typeof t,C=Array.isArray,S=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,E=/-->/g,k=/>/g,N=RegExp(">|[ \t\n\f\r](?:([^\\s\"'>=/]+)([ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r\"'`<>=]|(\"|')|))|$)","g"),L=/'/g,U=/"/g,O=/^(?:script|style|textarea|title)$/i,P=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),H=P(1),M=(P(2),Symbol.for("lit-noChange")),B=Symbol.for("lit-nothing"),R=new WeakMap,j=A.createTreeWalker(A,129,null,!1),T=(t,e)=>{const i=t.length-1,s=[];let o,n=2===e?"<svg>":"",r=S;for(let e=0;e<i;e++){const i=t[e];let l,a,h=-1,d=0;for(;d<i.length&&(r.lastIndex=d,a=r.exec(i),null!==a);)d=r.lastIndex,r===S?"!--"===a[1]?r=E:void 0!==a[1]?r=k:void 0!==a[2]?(O.test(a[2])&&(o=RegExp("</"+a[2],"g")),r=N):void 0!==a[3]&&(r=N):r===N?">"===a[0]?(r=null!=o?o:S,h=-1):void 0===a[1]?h=-2:(h=r.lastIndex-a[2].length,l=a[1],r=void 0===a[3]?N:'"'===a[3]?U:L):r===U||r===L?r=N:r===E||r===k?r=S:(r=N,o=void 0);const c=r===N&&t[e+1].startsWith("/>")?" ":"";n+=r===S?i+_:h>=0?(s.push(l),i.slice(0,h)+"$lit$"+i.slice(h)+y+c):i+y+(-2===h?(s.push(void 0),e):c)}const l=n+(t[i]||"<?>")+(2===e?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==b?b.createHTML(l):l,s]};class D{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,n=0;const r=t.length-1,l=this.parts,[a,h]=T(t,e);if(this.el=D.createElement(a,i),j.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(s=j.nextNode())&&l.length<r;){if(1===s.nodeType){if(s.hasAttributes()){const t=[];for(const e of s.getAttributeNames())if(e.endsWith("$lit$")||e.startsWith(y)){const i=h[n++];if(t.push(e),void 0!==i){const t=s.getAttribute(i.toLowerCase()+"$lit$").split(y),e=/([.?@])?(.*)/.exec(i);l.push({type:1,index:o,name:e[2],strings:t,ctor:"."===e[1]?F:"?"===e[1]?q:"@"===e[1]?J:W})}else l.push({type:6,index:o})}for(const e of t)s.removeAttribute(e)}if(O.test(s.tagName)){const t=s.textContent.split(y),e=t.length-1;if(e>0){s.textContent=f?f.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],w()),j.nextNode(),l.push({type:2,index:++o});s.append(t[e],w())}}}else if(8===s.nodeType)if(s.data===$)l.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(y,t+1));)l.push({type:7,index:o}),t+=y.length-1}o++}}static createElement(t,e){const i=A.createElement("template");return i.innerHTML=t,i}}function I(t,e,i=t,s){var o,n,r,l;if(e===M)return e;let a=void 0!==s?null===(o=i._$Co)||void 0===o?void 0:o[s]:i._$Cl;const h=x(e)?void 0:e._$litDirective$;return(null==a?void 0:a.constructor)!==h&&(null===(n=null==a?void 0:a._$AO)||void 0===n||n.call(a,!1),void 0===h?a=void 0:(a=new h(t),a._$AT(t,i,s)),void 0!==s?(null!==(r=(l=i)._$Co)&&void 0!==r?r:l._$Co=[])[s]=a:i._$Cl=a),void 0!==a&&(e=I(t,a._$AS(t,e.values),a,s)),e}class z{constructor(t,e){this.u=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}v(t){var e;const{el:{content:i},parts:s}=this._$AD,o=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:A).importNode(i,!0);j.currentNode=o;let n=j.nextNode(),r=0,l=0,a=s[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new V(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new K(n,this,t)),this.u.push(e),a=s[++l]}r!==(null==a?void 0:a.index)&&(n=j.nextNode(),r++)}return o}p(t){let e=0;for(const i of this.u)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class V{constructor(t,e,i,s){var o;this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cm=null===(o=null==s?void 0:s.isConnected)||void 0===o||o}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cm}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=I(this,t,e),x(t)?t===B||null==t||""===t?(this._$AH!==B&&this._$AR(),this._$AH=B):t!==this._$AH&&t!==M&&this.g(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>C(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.k(t):this.g(t)}O(t,e=this._$AB){return this._$AA.parentNode.insertBefore(t,e)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}g(t){this._$AH!==B&&x(this._$AH)?this._$AA.nextSibling.data=t:this.T(A.createTextNode(t)),this._$AH=t}$(t){var e;const{values:i,_$litType$:s}=t,o="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=D.createElement(s.h,this.options)),s);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===o)this._$AH.p(i);else{const t=new z(o,this),e=t.v(this.options);t.p(i),this.T(e),this._$AH=t}}_$AC(t){let e=R.get(t.strings);return void 0===e&&R.set(t.strings,e=new D(t)),e}k(t){C(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new V(this.O(w()),this.O(w()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cm=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class W{constructor(t,e,i,s,o){this.type=1,this._$AH=B,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=B}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,s){const o=this.strings;let n=!1;if(void 0===o)t=I(this,t,e,0),n=!x(t)||t!==this._$AH&&t!==M,n&&(this._$AH=t);else{const s=t;let r,l;for(t=o[0],r=0;r<o.length-1;r++)l=I(this,s[i+r],e,r),l===M&&(l=this._$AH[r]),n||(n=!x(l)||l!==this._$AH[r]),l===B?t=B:t!==B&&(t+=(null!=l?l:"")+o[r+1]),this._$AH[r]=l}n&&!s&&this.j(t)}j(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class F extends W{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===B?void 0:t}}const Z=f?f.emptyScript:"";class q extends W{constructor(){super(...arguments),this.type=4}j(t){t&&t!==B?this.element.setAttribute(this.name,Z):this.element.removeAttribute(this.name)}}class J extends W{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=I(this,t,e,0))&&void 0!==i?i:B)===M)return;const s=this._$AH,o=t===B&&s!==B||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==B&&(s===B||o);o&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class K{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){I(this,t)}}const G=v.litHtmlPolyfillSupport;var Q,X;null==G||G(D,V),(null!==(g=v.litHtmlVersions)&&void 0!==g?g:v.litHtmlVersions=[]).push("2.6.1");class Y extends u{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var s,o;const n=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:e;let r=n._$litPart$;if(void 0===r){const t=null!==(o=null==i?void 0:i.renderBefore)&&void 0!==o?o:null;n._$litPart$=r=new V(e.insertBefore(w(),t),t,void 0,null!=i?i:{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return M}}Y.finalized=!0,Y._$litElement$=!0,null===(Q=globalThis.litElementHydrateSupport)||void 0===Q||Q.call(globalThis,{LitElement:Y});const tt=globalThis.litElementPolyfillSupport;null==tt||tt({LitElement:Y}),(null!==(X=globalThis.litElementVersions)&&void 0!==X?X:globalThis.litElementVersions=[]).push("3.2.2");const et=((t,...e)=>{const s=1===t.length?t[0]:e.reduce(((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1]),t[0]);return new o(s,t,i)})`
  :host {
    display: block;
    max-width: 100%;
    font-family: var(--ntx-form-theme-font-family);
  }

  .comments-history {
    display: flex;
    flex-direction: column;
    position: relative;
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
    padding: .4375rem .75rem;
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
`,it=H`
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
`,st=H`
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
`,ot=(H`
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
`,H`
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrows-expand" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10"/>
svg></svg>
`);class nt extends Y{static get styles(){return et}static getMetaConfig(){return{controlName:"neo-comments",fallbackDisableSubmit:!1,description:"Notes and comments",iconUrl:"https://jsdez.github.io/plugins/neo-comments/dist/icon.svg",groupName:"NEO",version:"1.0",properties:{firstName:{type:"string",title:"First name"},lastName:{type:"string",title:"Last name"},email:{type:"string",title:"Email Address"},badge:{type:"string",description:"Label for status badge e.g. Rejected, Approved, Return etc. Default blank value is Update",title:"Badge"},badgeStyle:{type:"string",description:"Select the style for the badge from the dropdown based on Bootstrap 5 badge",title:"Badge Style",enum:["Default","Primary","Secondary","Success","Danger","Warning","Info","Light","Dark"],defaultValue:"Default"},inputobj:{type:"object",title:"Input Object",description:"Enter the comments object from previous control here"},historyLimit:{type:"integer",title:"Comment history display limit",description:"Enter a number value of how many comments should be shown, older comments are hidden, entering 0 will show all comments, default is 5.",defaultValue:5},outputobj:{title:"Comments Output",type:"object",description:"Workflow Comments Output Do Not Use",isValueField:!0,properties:{Comments:{type:"array",description:"Array of comments",items:{type:"object",properties:{firstName:{type:"string",description:"First Name",title:"First Name"},lastName:{type:"string",description:"Last Name",title:"Last Name"},email:{type:"string",description:"Email Address",title:"Email Address"},badge:{type:"string",description:"Badge Status",title:"Badge Status"},badgeStyle:{type:"string",description:"Badge Style",title:"Badge Style"},comment:{type:"string",description:"Comment",title:"Comment"},timestamp:{type:"string",format:"date-time",description:"Log time",title:"Log time"}}}},mostRecentComment:{type:"object",description:"Latest comment",properties:{firstName:{type:"string",description:"First Name",title:"First Name"},lastName:{type:"string",description:"Last Name",title:"Last Name"},email:{type:"string",description:"Email Address",title:"Email Address"},badge:{type:"string",description:"Badge Status",title:"Badge Status"},badgeStyle:{type:"string",description:"Badge Style",title:"Badge Style"},comment:{type:"string",description:"Comment",title:"Comment"},timestamp:{type:"string",format:"date-time",description:"Log time",title:"Log time"}}}}}},events:["ntx-value-change"],standardProperties:{fieldLabel:!0,description:!0,readOnly:!0,visibility:!0}}}static properties={firstName:{type:String},lastName:{type:String},email:{type:String},badge:{type:String},badgeStyle:{type:String},inputobj:{type:Object},workingComments:{type:Array},newComment:{type:String},readOnly:{type:Boolean},deletableIndices:{type:Array},historyLimit:{type:Number},showAll:{type:Boolean}};constructor(){super(),this.firstName="",this.lastName="",this.email="",this.badge="Update",this.badgeStyle="Default",this.inputobj=null,this.workingComments=[],this.newComment="",this.deletableIndices=[],this.historyLimit=5,this.showAll=!1}toggleShowAll(){this.showAll=!this.showAll}get displayedComments(){return this.showAll?this.workingComments:this.workingComments.slice(-this.historyLimit)}updated(t){t.has("inputobj")&&Array.isArray(this.inputobj?.comments)&&(this.workingComments=[...this.inputobj.comments],this.deletableIndices=[]),t.has("readOnly")&&this.requestUpdate()}addComment(){const t=(new Date).toISOString(),e={firstName:this.firstName||"Anonymous",lastName:this.lastName||"",email:this.email||"N/A",badge:this.badge||"Update",badgeStyle:this.badgeStyle||"Default",comment:this.newComment,timestamp:t};this.workingComments=[...this.workingComments,e],this.deletableIndices=[...this.deletableIndices,this.workingComments.length-1];const i=e,s={comments:this.workingComments,mostRecentComment:i};this.dispatchEvent(new CustomEvent("ntx-value-change",{detail:s})),this.newComment=""}deleteComment(t){this.workingComments=this.workingComments.filter(((e,i)=>i!==t)),this.deletableIndices=this.deletableIndices.filter((e=>e!==t)).map((e=>e>t?e-1:e));const e=this.workingComments[this.workingComments.length-1]||null,i={comments:this.workingComments,mostRecentComment:e};this.dispatchEvent(new CustomEvent("ntx-value-change",{detail:i}))}handleCommentChange(t){this.newComment=t.target.value}render(){return 0===this.historyLimit||this.showAll?this.workingComments:this.workingComments.slice(-this.historyLimit),H`
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  
      <!-- Show "Show All Comments" button if there are more comments than the limit -->
       ${0!==this.historyLimit&&this.workingComments.length>this.historyLimit?H`
        <div class="d-flex justify-content-center mb-3">
          <button 
            class="btn btn-default d-flex align-items-center"
            type="button"
            @click=${this.toggleShowAll}
          >
            ${ot} 
            ${this.showAll?" Hide All Comments":" Show All Comments"}
          </button>
        </div>
      `:""}

      <div class="comments-history">
        ${this.displayedComments.length>0?this.displayedComments.map(((t,e)=>H`
                <div class="card comment-card">
                  <div class="card-body">
                    <div class="d-flex flex-row align-items-center">
                      <h6 class="fw-bold mb-0 me-2">${t.firstName} ${t.lastName||""}</h6>
                      <p class="mb-0 text-muted me-2">
                        ${new Date(t.timestamp).toLocaleString("en-GB",{weekday:"short",year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!1})}
                      </p>
                      <span class="badge ${this.getBadgeClass(t.badgeStyle)||"Default"} ms-2">${t.badge||"Update"}</span>
                      ${this.deletableIndices.includes(e)&&!this.readOnly?H`
                          <button
                            class="btn btn-sm btn-danger ms-auto"
                            @click=${()=>this.deleteComment(e)}
                          >
                            ${st}
                          </button>
                        `:""}
                    </div>
                    <div>
                      <p class="mb-0 py-3 comment-text">${t.comment}</p>
                    </div>
                  </div>
                </div>
              `)):H``}
      </div>
  
      ${this.readOnly?"":H`
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
            ${it} Add Comment
          </button>
        </div>
      `}
    `}getBadgeClass(t){const e={Default:"badge badge-default",Primary:"badge bg-primary text-white",Secondary:"badge bg-secondary text-white",Success:"badge bg-success text-white",Danger:"badge bg-danger text-white",Warning:"badge bg-warning text-dark",Info:"badge bg-info",Light:"badge bg-light text-dark",Dark:"badge bg-dark text-white"};return e[t]||e.Default}}customElements.define("neo-comments",nt)})();