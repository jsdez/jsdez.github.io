/*! For license information please see neo-pricework.js.LICENSE.txt */
(()=>{"use strict";const t=window,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),r=new WeakMap;class o{constructor(t,e,r){if(this._$cssResult$=!0,r!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=r.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&r.set(i,t))}return t}toString(){return this.cssText}}const s=(t,...e)=>{const r=1===t.length?t[0]:e.reduce((e,i,r)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[r+1],t[0]);return new o(r,t,i)},n=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,i))(e)})(t):t;var a;const l=window,d=l.trustedTypes,c=d?d.emptyScript:"",h=l.reactiveElementPolyfillSupport,p={toAttribute(t,e){switch(e){case Boolean:t=t?c:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},m=(t,e)=>e!==t&&(e==e||t==t),u={attribute:!0,type:String,converter:p,reflect:!1,hasChanged:m},v="finalized";class f extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach((e,i)=>{const r=this._$Ep(i,e);void 0!==r&&(this._$Ev.set(r,i),t.push(r))}),t}static createProperty(t,e=u){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,r=this.getPropertyDescriptor(t,i,e);void 0!==r&&Object.defineProperty(this.prototype,t,r)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(r){const o=this[t];this[e]=r,this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||u}static finalize(){if(this.hasOwnProperty(v))return!1;this[v]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach(t=>t(this))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])})}createRenderRoot(){var i;const r=null!==(i=this.shadowRoot)&&void 0!==i?i:this.attachShadow(this.constructor.shadowRootOptions);return((i,r)=>{e?i.adoptedStyleSheets=r.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet):r.forEach(e=>{const r=document.createElement("style"),o=t.litNonce;void 0!==o&&r.setAttribute("nonce",o),r.textContent=e.cssText,i.appendChild(r)})})(r,this.constructor.elementStyles),r}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)})}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=u){var r;const o=this.constructor._$Ep(t,i);if(void 0!==o&&!0===i.reflect){const s=(void 0!==(null===(r=i.converter)||void 0===r?void 0:r.toAttribute)?i.converter:p).toAttribute(e,i.type);this._$El=t,null==s?this.removeAttribute(o):this.setAttribute(o,s),this._$El=null}}_$AK(t,e){var i;const r=this.constructor,o=r._$Ev.get(t);if(void 0!==o&&this._$El!==o){const t=r.getPropertyOptions(o),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:p;this._$El=o,this[o]=s.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let r=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||m)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):r=!1),!this.isUpdatePending&&r&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((t,e)=>this[e]=t),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)}),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach(t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach((t,e)=>this._$EO(e,this[e],t)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}var g;f[v]=!0,f.elementProperties=new Map,f.elementStyles=[],f.shadowRootOptions={mode:"open"},null==h||h({ReactiveElement:f}),(null!==(a=l.reactiveElementVersions)&&void 0!==a?a:l.reactiveElementVersions=[]).push("1.6.3");const b=window,y=b.trustedTypes,x=y?y.createPolicy("lit-html",{createHTML:t=>t}):void 0,$="$lit$",w=`lit$${(Math.random()+"").slice(9)}$`,_="?"+w,A=`<${_}>`,k=document,S=()=>k.createComment(""),C=t=>null===t||"object"!=typeof t&&"function"!=typeof t,j=Array.isArray,E="[ \t\n\f\r]",I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,D=/-->/g,P=/>/g,M=RegExp(`>|${E}(?:([^\\s"'>=/]+)(${E}*=${E}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),O=/'/g,N=/"/g,T=/^(?:script|style|textarea|title)$/i,U=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),H=U(1),L=(U(2),Symbol.for("lit-noChange")),R=Symbol.for("lit-nothing"),q=new WeakMap,B=k.createTreeWalker(k,129,null,!1);function z(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==x?x.createHTML(e):e}const W=(t,e)=>{const i=t.length-1,r=[];let o,s=2===e?"<svg>":"",n=I;for(let e=0;e<i;e++){const i=t[e];let a,l,d=-1,c=0;for(;c<i.length&&(n.lastIndex=c,l=n.exec(i),null!==l);)c=n.lastIndex,n===I?"!--"===l[1]?n=D:void 0!==l[1]?n=P:void 0!==l[2]?(T.test(l[2])&&(o=RegExp("</"+l[2],"g")),n=M):void 0!==l[3]&&(n=M):n===M?">"===l[0]?(n=null!=o?o:I,d=-1):void 0===l[1]?d=-2:(d=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?M:'"'===l[3]?N:O):n===N||n===O?n=M:n===D||n===P?n=I:(n=M,o=void 0);const h=n===M&&t[e+1].startsWith("/>")?" ":"";s+=n===I?i+A:d>=0?(r.push(a),i.slice(0,d)+$+i.slice(d)+w+h):i+w+(-2===d?(r.push(void 0),e):h)}return[z(t,s+(t[i]||"<?>")+(2===e?"</svg>":"")),r]};class J{constructor({strings:t,_$litType$:e},i){let r;this.parts=[];let o=0,s=0;const n=t.length-1,a=this.parts,[l,d]=W(t,e);if(this.el=J.createElement(l,i),B.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(r=B.nextNode())&&a.length<n;){if(1===r.nodeType){if(r.hasAttributes()){const t=[];for(const e of r.getAttributeNames())if(e.endsWith($)||e.startsWith(w)){const i=d[s++];if(t.push(e),void 0!==i){const t=r.getAttribute(i.toLowerCase()+$).split(w),e=/([.?@])?(.*)/.exec(i);a.push({type:1,index:o,name:e[2],strings:t,ctor:"."===e[1]?G:"?"===e[1]?X:"@"===e[1]?Y:K})}else a.push({type:6,index:o})}for(const e of t)r.removeAttribute(e)}if(T.test(r.tagName)){const t=r.textContent.split(w),e=t.length-1;if(e>0){r.textContent=y?y.emptyScript:"";for(let i=0;i<e;i++)r.append(t[i],S()),B.nextNode(),a.push({type:2,index:++o});r.append(t[e],S())}}}else if(8===r.nodeType)if(r.data===_)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=r.data.indexOf(w,t+1));)a.push({type:7,index:o}),t+=w.length-1}o++}}static createElement(t,e){const i=k.createElement("template");return i.innerHTML=t,i}}function V(t,e,i=t,r){var o,s,n,a;if(e===L)return e;let l=void 0!==r?null===(o=i._$Co)||void 0===o?void 0:o[r]:i._$Cl;const d=C(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==d&&(null===(s=null==l?void 0:l._$AO)||void 0===s||s.call(l,!1),void 0===d?l=void 0:(l=new d(t),l._$AT(t,i,r)),void 0!==r?(null!==(n=(a=i)._$Co)&&void 0!==n?n:a._$Co=[])[r]=l:i._$Cl=l),void 0!==l&&(e=V(t,l._$AS(t,e.values),l,r)),e}class F{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:r}=this._$AD,o=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:k).importNode(i,!0);B.currentNode=o;let s=B.nextNode(),n=0,a=0,l=r[0];for(;void 0!==l;){if(n===l.index){let e;2===l.type?e=new Q(s,s.nextSibling,this,t):1===l.type?e=new l.ctor(s,l.name,l.strings,this,t):6===l.type&&(e=new tt(s,this,t)),this._$AV.push(e),l=r[++a]}n!==(null==l?void 0:l.index)&&(s=B.nextNode(),n++)}return B.currentNode=k,o}v(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Q{constructor(t,e,i,r){var o;this.type=2,this._$AH=R,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=r,this._$Cp=null===(o=null==r?void 0:r.isConnected)||void 0===o||o}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=V(this,t,e),C(t)?t===R||null==t||""===t?(this._$AH!==R&&this._$AR(),this._$AH=R):t!==this._$AH&&t!==L&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):(t=>j(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==R&&C(this._$AH)?this._$AA.nextSibling.data=t:this.$(k.createTextNode(t)),this._$AH=t}g(t){var e;const{values:i,_$litType$:r}=t,o="number"==typeof r?this._$AC(t):(void 0===r.el&&(r.el=J.createElement(z(r.h,r.h[0]),this.options)),r);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===o)this._$AH.v(i);else{const t=new F(o,this),e=t.u(this.options);t.v(i),this.$(e),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new J(t)),e}T(t){j(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,r=0;for(const o of t)r===e.length?e.push(i=new Q(this.k(S()),this.k(S()),this,this.options)):i=e[r],i._$AI(o),r++;r<e.length&&(this._$AR(i&&i._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class K{constructor(t,e,i,r,o){this.type=1,this._$AH=R,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=R}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,r){const o=this.strings;let s=!1;if(void 0===o)t=V(this,t,e,0),s=!C(t)||t!==this._$AH&&t!==L,s&&(this._$AH=t);else{const r=t;let n,a;for(t=o[0],n=0;n<o.length-1;n++)a=V(this,r[i+n],e,n),a===L&&(a=this._$AH[n]),s||(s=!C(a)||a!==this._$AH[n]),a===R?t=R:t!==R&&(t+=(null!=a?a:"")+o[n+1]),this._$AH[n]=a}s&&!r&&this.j(t)}j(t){t===R?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class G extends K{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===R?void 0:t}}const Z=y?y.emptyScript:"";class X extends K{constructor(){super(...arguments),this.type=4}j(t){t&&t!==R?this.element.setAttribute(this.name,Z):this.element.removeAttribute(this.name)}}class Y extends K{constructor(t,e,i,r,o){super(t,e,i,r,o),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=V(this,t,e,0))&&void 0!==i?i:R)===L)return;const r=this._$AH,o=t===R&&r!==R||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,s=t!==R&&(r===R||o);o&&this.element.removeEventListener(this.name,this,r),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class tt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){V(this,t)}}const et=b.litHtmlPolyfillSupport;var it,rt;null==et||et(J,Q),(null!==(g=b.litHtmlVersions)&&void 0!==g?g:b.litHtmlVersions=[]).push("2.8.0");class ot extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var r,o;const s=null!==(r=null==i?void 0:i.renderBefore)&&void 0!==r?r:e;let n=s._$litPart$;if(void 0===n){const t=null!==(o=null==i?void 0:i.renderBefore)&&void 0!==o?o:null;s._$litPart$=n=new Q(e.insertBefore(S(),t),t,void 0,null!=i?i:{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return L}}ot.finalized=!0,ot._$litElement$=!0,null===(it=globalThis.litElementHydrateSupport)||void 0===it||it.call(globalThis,{LitElement:ot});const st=globalThis.litElementPolyfillSupport;null==st||st({LitElement:ot}),(null!==(rt=globalThis.litElementVersions)&&void 0!==rt?rt:globalThis.litElementVersions=[]).push("3.3.3");const nt=()=>Math.random().toString(36).slice(2,10);class at extends ot{static getMetaConfig(){return{controlName:"neo-pricework",fallbackDisableSubmit:!1,description:"Create, list and edit job line items with totals",iconUrl:"",groupName:"NEO",version:"1.0",properties:{apiKey:{type:"string",title:"Google Maps API key",description:"API key used for address autocomplete"},inputobj:{type:"object",title:"Input object",description:"Preload jobs array and meta",properties:{jobs:{type:"array",items:{type:"object",properties:{id:{type:"string"},address:{type:"string",title:"Address"},contract:{type:"string",title:"Contract"},notes:{type:"string",title:"Job Notes"},items:{type:"array",items:{type:"object",properties:{itemCode:{type:"string"},name:{type:"string"},price:{type:"number"},quantity:{type:"number"}}}}}}}}},contracts:{type:"string",title:"Contracts (comma-separated)",description:"Provide the list of available contracts separated by commas",defaultValue:""},workItems:{type:"object",title:"Work Items Catalog",description:"Provide work items to choose from grouped by contract",properties:{items:{type:"array",items:{type:"object",properties:{name:{type:"string",title:"Display Name"},contract:{type:"string",title:"Contract key"},itemCode:{type:"string",title:"Item code"},price:{type:"number",title:"Unit price"}}}}}},readOnly:{type:"boolean",title:"Read only",defaultValue:!1},outputobj:{type:"object",title:"Output object",isValueField:!0,description:"Complete job pricing data with summary totals",properties:{jobs:{type:"array",title:"Jobs",description:"Array of all jobs with complete details",items:{type:"object",properties:{id:{type:"string",title:"Job ID",description:"Unique job identifier"},address:{type:"string",title:"Address",description:"Job address"},contract:{type:"string",title:"Contract",description:"Contract identifier"},contracts:{type:"array",title:"Contracts",description:"Array of all contracts for this job",items:{type:"string"}},notes:{type:"string",title:"Notes",description:"Job notes"},items:{type:"array",title:"Work Items",description:"Work items for this job",items:{type:"object",properties:{name:{type:"string",title:"Item Name",description:"Work item name"},itemCode:{type:"string",title:"Item Code",description:"Work item code"},price:{type:"number",title:"Unit Price",description:"Unit price"},quantity:{type:"number",title:"Quantity",description:"Quantity selected"},cost:{type:"number",title:"Total Cost",description:"Total cost (price × quantity)"},contract:{type:"string",title:"Contract",description:"Associated contract"},spid:{type:"integer",title:"SharePoint ID",description:"SharePoint list item ID for traceability"}}}},totalCost:{type:"number",title:"Job Total Cost",description:"Total cost for this job"},totalItems:{type:"number",title:"Total Items",description:"Total number of work items in this job"}}}},totalJobs:{type:"number",title:"Total Jobs",description:"Total number of jobs"},totalWorkItems:{type:"number",title:"Total Work Items",description:"Total work items across all jobs"},totalPrice:{type:"number",title:"Total Price",description:"Total price of all work across all jobs"}}}},events:["ntx-value-change"],standardProperties:{fieldLabel:!0,description:!0,readOnly:!0,visibility:!0}}}static properties={apiKey:{type:String},inputobj:{type:Object},outputobj:{type:Object},contracts:{type:String},workItems:{type:Object},readOnly:{type:Boolean,reflect:!0},jobs:{type:Array},showModal:{type:Boolean},editingIndex:{type:Number},formData:{type:Object},workItemQuery:{type:String},noteOpen:{type:Object}};static get styles(){return s`
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

  /* Available work items (touch-friendly) */
  .avail-list { display:flex; flex-direction:column; gap:.5rem; max-height: 260px; font-size: 14px; overflow:auto; border:1px solid var(--ntx-form-theme-color-border, #898f94); border-radius: var(--ntx-form-theme-border-radius, 4px); padding:.5rem; background: var(--ntx-form-theme-color-form-background, #fff); width: 100%; max-width: 100%; }
  .avail-row { display:flex; align-items:center; justify-content:space-between; gap:.75rem; padding:.6rem .6rem; border:1px solid var(--ntx-form-theme-color-border, #898f94); border-radius: var(--ntx-form-theme-border-radius, 4px); min-height:44px; width: 100%; box-sizing: border-box; }
  .avail-main { display:flex; align-items:center; gap:.5rem; min-width:0; flex:1 1 auto; }
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
  .qty-input { width: var(--neo-col-qty); max-width: var(--neo-col-qty); }
      }

      /* Small screens: two-line layout, inline labels for numeric cells */
      @media (max-width: 575.98px) {
        .list-head { display:none; }
        .list-row { display:grid; grid-template-columns: 1fr var(--neo-col-remove); grid-template-rows: auto auto; row-gap:.25rem; }
        .cell-name { grid-column: 1 / 2; grid-row: 1; }
        .cell-remove { grid-column: 2 / 3; grid-row: 1; justify-self:end; display:flex; }
        .cell-numbers { grid-column: 1 / -1; grid-row: 2; display:flex; justify-content: space-evenly; align-items:center; gap:.75rem; }
        .cell-unit, .cell-qty, .cell-cost { width: auto; text-align:center; }
        .cell-qty { display:flex; align-items:center; gap:.25rem; }
  :host { --neo-col-qty: 100px; }
  .qty-input { width: var(--neo-col-qty); max-width: var(--neo-col-qty); }
        .cell-label { display: inline; }
  .avail-title { white-space: normal; overflow-wrap: anywhere; word-break: break-word; }
      }
    `}constructor(){super(),this.apiKey="",this.inputobj=null,this.outputobj={jobs:[],subtotal:0,count:0},this.contracts="",this.workItems={items:[]},this.currency="£",this.readOnly=!1,this.jobs=[],this.showModal=!1,this.editingIndex=-1,this.formData=this.getEmptyForm(),this.workItemQuery="",this._gmapsLoaded=!1,this._autocomplete=null,this._placesService=null,this._addressIsUserInput=!1,this._addressPreviousValue="",this._addressLastResolved="",this.noteOpen=new Set}getEmptyForm(){return{id:"",address:"",contract:"",notes:"",items:[]}}updated(t){t.has("inputobj")&&this.inputobj&&Array.isArray(this.inputobj.jobs)&&(this.jobs=[...this.inputobj.jobs].map(t=>({id:t.id||nt(),address:t.address||"",contract:t.contract||"",notes:t.notes||"",items:Array.isArray(t.items)?t.items.map(t=>({itemCode:t.itemCode||"",name:t.name,price:Number(t.price)||0,quantity:Number(t.quantity)||0,contract:t.contract||"",spid:t.spid||null})):[]})),this.recomputeAndDispatch())}itemTotal(t){return(Number(t.quantity)||0)*(Number(t.price)||0)}jobTotal(t){return(Array.isArray(t.items)?t.items:[]).reduce((t,e)=>t+this.itemTotal(e),0)}subtotal(){return this.jobs.reduce((t,e)=>t+this.jobTotal(e),0)}recomputeAndDispatch(){const t=this.jobs.map(t=>({...t,contracts:this.getJobContracts(t),items:(t.items||[]).map(t=>({...t,cost:this.itemTotal(t)})),totalCost:this.jobTotal(t),totalItems:(t.items||[]).length})),e=this.subtotal(),i=this.jobs.length,r=this.jobs.reduce((t,e)=>t+(e.items?.length||0),0);this.outputobj={jobs:t,totalJobs:i,totalWorkItems:r,totalPrice:e},this.dispatchEvent(new CustomEvent("ntx-value-change",{detail:this.outputobj,bubbles:!0,composed:!0}))}openAdd=()=>{this.readOnly||(this.formData={...this.getEmptyForm(),id:nt()},this.editingIndex=-1,this.showModal=!0,this.updateComplete.then(()=>this.ensureGoogleMapsLoadedAndInit()))};openEdit=t=>{if(this.readOnly)return;const e=this.jobs[t];e&&(this.formData={...e},this.editingIndex=t,this.showModal=!0,this.updateComplete.then(()=>this.ensureGoogleMapsLoadedAndInit()))};closeModal=()=>{this.showModal=!1};onInput=(t,e)=>{const i=t.target?.value;this.formData={...this.formData,[e]:i}};onContractChange=t=>{const e=t.target.value;this.formData={...this.formData,contract:e}};getContractOptions(){const t=this.contracts;let e=[];if(!t)return e;if(Array.isArray(t))e=t;else if("string"==typeof t){const i=t.trim();if(i.startsWith("[")&&i.endsWith("]")||i.startsWith("{")&&i.endsWith("}"))try{const t=JSON.parse(i);e=Array.isArray(t)?t:t&&"object"==typeof t?[t]:[]}catch{e=i.split(",")}else e=i.split(",")}else"object"==typeof t&&t&&(e=[t]);const i=e.map(t=>"string"==typeof t?t.trim():t&&"object"==typeof t?String(t.contract??t.name??t.value??"").trim():"").filter(Boolean),r=new Set;return i.filter(t=>!r.has(t)&&(r.add(t),!0))}getAvailableWorkItems(){const t=new Set((this.formData.items||[]).map(t=>t.name));let e=(Array.isArray(this.workItems?.items)?this.workItems.items:[]).filter(e=>!(this.formData.contract&&e.contract!==this.formData.contract||t.has(e.name)));const i=(this.workItemQuery||"").trim().toLowerCase();if(!i)return e;const r=i.split(/\s+/).filter(Boolean),o=[],s=[];for(const t of e){const e=(t.itemCode||"").toLowerCase();e&&e.includes(i)?o.push(t):s.push(t)}if(o.length>0)return o;const n=s.filter(t=>{const e=(t.name||"").toLowerCase();return r.every(t=>{if(e.includes(t))return!0;let i=0;for(const r of t){if(i=e.indexOf(r,i),-1===i)return!1;i++}return!0})});return n}addSelectedWorkItems=t=>{const e=t.target,i=Array.from(e.selectedOptions||[]);if(0===i.length)return;const r=this.getAvailableWorkItems(),o=new Set(i.map(t=>t.value)),s=r.filter(t=>o.has(t.name)).map(t=>({itemCode:t.itemCode||"",name:t.name,price:Number(t.price)||0,quantity:1})),n=[...this.formData.items||[],...s];this.formData={...this.formData,items:n},e.selectedIndex=-1};addWorkItem=t=>{if(!t)return;const e=(this.formData.items||[]).some(e=>e.name===t.name);if(e)return;const i=[...this.formData.items||[],{itemCode:t.itemCode||"",name:t.name,price:Number(t.price)||0,quantity:1,contract:t.contract||this.formData.contract||"",spid:t.spid||null}];this.formData={...this.formData,items:i}};getJobContracts(t){const e=new Set,i=t.contract;return Array.isArray(i)?i.forEach(t=>{t&&e.add(String(t).trim())}):"string"==typeof i&&i.split(",").map(t=>t.trim()).filter(Boolean).forEach(t=>e.add(t)),(t.items||[]).forEach(t=>{t&&t.contract&&e.add(String(t.contract).trim())}),Array.from(e).filter(Boolean)}toggleNotes=t=>{const e=new Set(this.noteOpen||[]);e.has(t)?e.delete(t):e.add(t),this.noteOpen=e};updateItemQty=(t,e)=>{const i=Math.max(0,Number(e.target.value||0)),r=[...this.formData.items||[]];r[t]&&(r[t]={...r[t],quantity:i},this.formData={...this.formData,items:r})};removeSelectedItem=t=>{const e=(this.formData.items||[]).filter((e,i)=>i!==t);this.formData={...this.formData,items:e}};save=()=>{const t={...this.formData};if(Array.isArray(t.items)&&0!==t.items.length){if(-1===this.editingIndex)this.jobs=[...this.jobs,t];else{const e=[...this.jobs];e[this.editingIndex]=t,this.jobs=e}this.showModal=!1,this.recomputeAndDispatch()}};remove=t=>{const e=this.jobs.filter((e,i)=>i!==t);this.jobs=e,this.showModal=!1,this.recomputeAndDispatch()};renderRow(t,e){const i=this.getJobContracts(t),r=!(!t.notes||!String(t.notes).trim()),o=this.noteOpen?.has(t.id);return H`
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div>
              <div class="field-line">
                <span class="inline-label">Address:</span>
                <span class="title">${t.address||"Untitled job"}</span>
              </div>
              ${i.length?H`
                <div class="field-line" style="margin-top:.25rem; display:flex; align-items:center; justify-content:space-between;">
                  <div style="display:flex; align-items:center; gap:.5rem;">
                    <span class="inline-label">Contracts:</span>
                    <span class="pill-group">
                      ${i.map(t=>H`<span class="pill">${t}</span>`)}
                    </span>
                  </div>
                  <div class="summary">${t.items?.length||0} work item${1===(t.items?.length||0)?"":"s"} - <strong>${this.currency}${this.jobTotal(t).toFixed(2)}</strong></div>
                </div>
              `:H`
                <div class="field-line" style="margin-top:.25rem;">
                  <div class="summary">${t.items?.length||0} work item${1===(t.items?.length||0)?"":"s"} - <strong>${this.currency}${this.jobTotal(t).toFixed(2)}</strong></div>
                </div>
              `}
            </div>
            <div class="right">
              <div class="right-actions">
                ${this.readOnly?"":H`
                  <button class="btn btn-light btn-compact" title="Edit" aria-label="Edit" @click=${()=>this.openEdit(e)} style="min-width: 90px; display:flex; justify-content:space-between; align-items:center;">
                    <span>Edit</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                `}
                ${r?H`
                  <button class="btn btn-light btn-compact" title="${o?"Hide":"Show"} notes" aria-label="${o?"Hide":"Show"} notes" @click=${()=>this.toggleNotes(t.id)} style="min-width: 90px; display:flex; justify-content:space-between; align-items:center;">
                    <span>Notes</span>
                    ${o?H`
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 15l6-6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    `:H`
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    `}
                  </button>
                `:""}
              </div>
            </div>
          </div>
          ${o&&r?H`<div class="notes">${t.notes}</div>`:""}
        </div>
      </div>
    `}renderModal(){if(!this.showModal)return null;const t=this.editingIndex>-1;return H`
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
                <input id="addressInput" type="text" .value=${this.formData.address}
                  @input=${this.onAddressTyping}
                  @blur=${this.onAddressBlur}
                  @change=${this.onAddressBlur}
                  placeholder="Search for an address" />
              </div>
              <div class="form-group" style="grid-column: 1 / -1;">
                <label>Contract</label>
                <select .value=${this.formData.contract} @change=${this.onContractChange}>
                  <option value="">Select contract</option>
                  ${this.getContractOptions().map(t=>H`<option value="${t}">${t}</option>`)}
                </select>
              </div>
              <div class="form-group" style="grid-column: 1 / -1;">
                <label>Work Items</label>
                <input type="text" placeholder="Search work items" .value=${this.workItemQuery}
                  @input=${t=>{this.workItemQuery=t.target.value}} />
                <div class="avail-list" role="list">
                  ${this.getAvailableWorkItems().map(t=>H`
                    <div class="avail-row" role="listitem">
                      <div class="avail-main">
                        <div class="avail-title">${t.name}</div>
                        <div class="avail-price">${this.currency}${Number(t.price).toFixed(2)}</div>
                      </div>
                      <div class="avail-actions">
                        <button class="icon-btn success" @click=${()=>this.addWorkItem(t)} aria-label=${`Add ${t.name}`} title="Add">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  `)}
                </div>
              </div>
              <div class="form-group" style="grid-column: 1 / -1;">
                ${Array.isArray(this.formData.items)&&this.formData.items.length>0?H`
                  <div class="list-table">
                    <div class="list-head sm">
                      <div>Selected Work Item</div>
                      <div class="center">Price</div>
                      <div class="center">Qty</div>
                      <div class="center">Cost</div>
                      <div></div>
                    </div>
                    ${this.formData.items.map((t,e)=>H`
                      <div class="list-row">
                        <div class="cell-name">
                          <div class="title">${t.name}</div>
                        </div>
                        <div class="cell-numbers">
                          <div class="cell-unit"><span class="cell-label">Price </span><span class="sm">${this.currency}${Number(t.price).toFixed(2)}</span></div>
                          <div class="cell-qty"><span class="cell-label">Qty </span><input class="qty-input" type="number" min="0" step="1" .value=${String(t.quantity??0)} @input=${t=>this.updateItemQty(e,t)} /></div>
                          <div class="cell-cost"><span class="cell-label">Cost </span><span class="total">${this.currency}${this.itemTotal(t).toFixed(2)}</span></div>
                        </div>
                        <div class="cell-remove">
                          <button class="icon-btn" title="Remove" aria-label="Remove" @click=${()=>this.removeSelectedItem(e)}>
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
                `:H`<div class="muted">No items selected yet.</div>`}
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
              ${t?H`<button class="btn btn-danger" @click=${()=>this.remove(this.editingIndex)}>Delete</button>`:""}
              <button class="btn btn-outline" @click=${this.closeModal}>Cancel</button>
              <button class="btn btn-primary" @click=${this.save} ?disabled=${!(this.formData.items?.length>0)}>Save</button>
            </div>
          </div>
        </div>
      </div>
    `}ensureGoogleMapsLoadedAndInit(){const t=this.shadowRoot?.getElementById("addressInput");if(!t)return;if(this._gmapsLoaded&&window.google&&window.google.maps)return void this.initAutocomplete(t);if(!this.apiKey)return;if(window.google&&window.google.maps)return this._gmapsLoaded=!0,void this.initAutocomplete(t);const e=document.querySelector("script[data-neo-pricework-gmaps]");if(e)return void e.addEventListener("load",()=>{this._gmapsLoaded=!0,this.initAutocomplete(t)},{once:!0});const i=document.createElement("script");i.src=`https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places`,i.async=!0,i.defer=!0,i.dataset.neoPriceworkGmaps="1",i.addEventListener("load",()=>{this._gmapsLoaded=!0,this.initAutocomplete(t)},{once:!0}),i.addEventListener("error",()=>{console.error("Failed to load Google Maps API")},{once:!0}),document.head.appendChild(i)}initAutocomplete(t){window.google&&window.google.maps&&t&&(this._autocomplete=new google.maps.places.Autocomplete(t,{types:["address"]}),this._autocomplete.addListener("place_changed",()=>{const t=this._autocomplete.getPlace();t&&t.formatted_address&&(this._addressIsUserInput=!0,this.formData={...this.formData,address:t.formatted_address},this._addressPreviousValue=this.formData.address,this._addressLastResolved=this.formData.address)}),this._placesService=new google.maps.places.PlacesService(document.createElement("div")))}onAddressTyping=t=>{this._addressIsUserInput=!0;const e=t.target.value;this.formData={...this.formData,address:e},this._addressPreviousValue=e};onAddressBlur=()=>{const t=this.formData.address||"";if(!t.trim())return;if(!(this._gmapsLoaded&&this._placesService&&window.google&&window.google.maps))return;if(t===this._addressLastResolved)return;const e={query:t,fields:["formatted_address","geometry","name"]};this._placesService.findPlaceFromQuery(e,(e,i)=>{if(i===google.maps.places.PlacesServiceStatus.OK&&e&&e.length>0){const t=e[0];t.formatted_address&&t.formatted_address!==this.formData.address&&(this.formData={...this.formData,address:t.formatted_address}),this._addressLastResolved=this.formData.address}else this._addressLastResolved=t})};render(){const t=this.subtotal();return H`
      <div class="list-header">
        <div class="card-title">Jobs</div>
        <span class="badge">${this.jobs.length} item${1===this.jobs.length?"":"s"}</span>
      </div>

      <div class="rows">
        ${0===this.jobs.length?H`<div class="empty">No jobs yet. Use the button below to add your first job.</div>`:this.jobs.map((t,e)=>this.renderRow(t,e))}
      </div>

      <div class="footer">
        <div class="muted">Subtotal</div>
        <div class="total">${this.currency}${t.toFixed(2)}</div>
      </div>

      ${this.readOnly?"":H`
        <div style="margin-top:.5rem; display:flex; justify-content:flex-end;">
          <button class="btn btn-primary" @click=${this.openAdd}>Add Job</button>
        </div>
      `}

      ${this.renderModal()}
    `}}customElements.define("neo-pricework",at)})();