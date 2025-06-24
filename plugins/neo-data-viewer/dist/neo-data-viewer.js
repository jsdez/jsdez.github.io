/*! For license information please see neo-data-viewer.js.LICENSE.txt */
(()=>{"use strict";const t=window,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;class r{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}}const n=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,s))(e)})(t):t;var o;const a=window,l=a.trustedTypes,h=l?l.emptyScript:"",c=a.reactiveElementPolyfillSupport,d={toAttribute(t,e){switch(e){case Boolean:t=t?h:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},p=(t,e)=>e!==t&&(e==e||t==t),u={attribute:!0,type:String,converter:d,reflect:!1,hasChanged:p};class v extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,s)=>{const i=this._$Ep(s,e);void 0!==i&&(this._$Ev.set(i,s),t.push(i))})),t}static createProperty(t,e=u){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,i=this.getPropertyDescriptor(t,s,e);void 0!==i&&Object.defineProperty(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){return{get(){return this[e]},set(i){const r=this[t];this[e]=i,this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||u}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of e)this.createProperty(s,t[s])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Ep(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,s;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var s;const i=null!==(s=this.shadowRoot)&&void 0!==s?s:this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{e?s.adoptedStyleSheets=i.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):i.forEach((e=>{const i=document.createElement("style"),r=t.litNonce;void 0!==r&&i.setAttribute("nonce",r),i.textContent=e.cssText,s.appendChild(i)}))})(i,this.constructor.elementStyles),i}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EO(t,e,s=u){var i;const r=this.constructor._$Ep(t,s);if(void 0!==r&&!0===s.reflect){const n=(void 0!==(null===(i=s.converter)||void 0===i?void 0:i.toAttribute)?s.converter:d).toAttribute(e,s.type);this._$El=t,null==n?this.removeAttribute(r):this.setAttribute(r,n),this._$El=null}}_$AK(t,e){var s;const i=this.constructor,r=i._$Ev.get(t);if(void 0!==r&&this._$El!==r){const t=i.getPropertyOptions(r),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(s=t.converter)||void 0===s?void 0:s.fromAttribute)?t.converter:d;this._$El=r,this[r]=n.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,s){let i=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||p)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===s.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,s))):i=!1),!this.isUpdatePending&&i&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,e)=>this[e]=t)),this._$Ei=void 0);let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(s)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,e)=>this._$EO(e,this[e],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}var g;v.finalized=!0,v.elementProperties=new Map,v.elementStyles=[],v.shadowRootOptions={mode:"open"},null==c||c({ReactiveElement:v}),(null!==(o=a.reactiveElementVersions)&&void 0!==o?o:a.reactiveElementVersions=[]).push("1.6.1");const $=window,m=$.trustedTypes,y=m?m.createPolicy("lit-html",{createHTML:t=>t}):void 0,_=`lit$${(Math.random()+"").slice(9)}$`,f="?"+_,b=`<${f}>`,A=document,S=(t="")=>A.createComment(t),E=t=>null===t||"object"!=typeof t&&"function"!=typeof t,x=Array.isArray,w=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,P=/-->/g,C=/>/g,O=RegExp(">|[ \t\n\f\r](?:([^\\s\"'>=/]+)([ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r\"'`<>=]|(\"|')|))|$)","g"),N=/'/g,k=/"/g,M=/^(?:script|style|textarea|title)$/i,U=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),H=U(1),j=(U(2),Symbol.for("lit-noChange")),R=Symbol.for("lit-nothing"),T=new WeakMap,D=A.createTreeWalker(A,129,null,!1),K=(t,e)=>{const s=t.length-1,i=[];let r,n=2===e?"<svg>":"",o=w;for(let e=0;e<s;e++){const s=t[e];let a,l,h=-1,c=0;for(;c<s.length&&(o.lastIndex=c,l=o.exec(s),null!==l);)c=o.lastIndex,o===w?"!--"===l[1]?o=P:void 0!==l[1]?o=C:void 0!==l[2]?(M.test(l[2])&&(r=RegExp("</"+l[2],"g")),o=O):void 0!==l[3]&&(o=O):o===O?">"===l[0]?(o=null!=r?r:w,h=-1):void 0===l[1]?h=-2:(h=o.lastIndex-l[2].length,a=l[1],o=void 0===l[3]?O:'"'===l[3]?k:N):o===k||o===N?o=O:o===P||o===C?o=w:(o=O,r=void 0);const d=o===O&&t[e+1].startsWith("/>")?" ":"";n+=o===w?s+b:h>=0?(i.push(a),s.slice(0,h)+"$lit$"+s.slice(h)+_+d):s+_+(-2===h?(i.push(void 0),e):d)}const a=n+(t[s]||"<?>")+(2===e?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==y?y.createHTML(a):a,i]};class L{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,n=0;const o=t.length-1,a=this.parts,[l,h]=K(t,e);if(this.el=L.createElement(l,s),D.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(i=D.nextNode())&&a.length<o;){if(1===i.nodeType){if(i.hasAttributes()){const t=[];for(const e of i.getAttributeNames())if(e.endsWith("$lit$")||e.startsWith(_)){const s=h[n++];if(t.push(e),void 0!==s){const t=i.getAttribute(s.toLowerCase()+"$lit$").split(_),e=/([.?@])?(.*)/.exec(s);a.push({type:1,index:r,name:e[2],strings:t,ctor:"."===e[1]?F:"?"===e[1]?q:"@"===e[1]?W:B})}else a.push({type:6,index:r})}for(const e of t)i.removeAttribute(e)}if(M.test(i.tagName)){const t=i.textContent.split(_),e=t.length-1;if(e>0){i.textContent=m?m.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],S()),D.nextNode(),a.push({type:2,index:++r});i.append(t[e],S())}}}else if(8===i.nodeType)if(i.data===f)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=i.data.indexOf(_,t+1));)a.push({type:7,index:r}),t+=_.length-1}r++}}static createElement(t,e){const s=A.createElement("template");return s.innerHTML=t,s}}function I(t,e,s=t,i){var r,n,o,a;if(e===j)return e;let l=void 0!==i?null===(r=s._$Co)||void 0===r?void 0:r[i]:s._$Cl;const h=E(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==h&&(null===(n=null==l?void 0:l._$AO)||void 0===n||n.call(l,!1),void 0===h?l=void 0:(l=new h(t),l._$AT(t,s,i)),void 0!==i?(null!==(o=(a=s)._$Co)&&void 0!==o?o:a._$Co=[])[i]=l:s._$Cl=l),void 0!==l&&(e=I(t,l._$AS(t,e.values),l,i)),e}class J{constructor(t,e){this.u=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}v(t){var e;const{el:{content:s},parts:i}=this._$AD,r=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:A).importNode(s,!0);D.currentNode=r;let n=D.nextNode(),o=0,a=0,l=i[0];for(;void 0!==l;){if(o===l.index){let e;2===l.type?e=new z(n,n.nextSibling,this,t):1===l.type?e=new l.ctor(n,l.name,l.strings,this,t):6===l.type&&(e=new Z(n,this,t)),this.u.push(e),l=i[++a]}o!==(null==l?void 0:l.index)&&(n=D.nextNode(),o++)}return r}p(t){let e=0;for(const s of this.u)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class z{constructor(t,e,s,i){var r;this.type=2,this._$AH=R,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cm=null===(r=null==i?void 0:i.isConnected)||void 0===r||r}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cm}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=I(this,t,e),E(t)?t===R||null==t||""===t?(this._$AH!==R&&this._$AR(),this._$AH=R):t!==this._$AH&&t!==j&&this.g(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>x(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.k(t):this.g(t)}O(t,e=this._$AB){return this._$AA.parentNode.insertBefore(t,e)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}g(t){this._$AH!==R&&E(this._$AH)?this._$AA.nextSibling.data=t:this.T(A.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:i}=t,r="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=L.createElement(i.h,this.options)),i);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===r)this._$AH.p(s);else{const t=new J(r,this),e=t.v(this.options);t.p(s),this.T(e),this._$AH=t}}_$AC(t){let e=T.get(t.strings);return void 0===e&&T.set(t.strings,e=new L(t)),e}k(t){x(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const r of t)i===e.length?e.push(s=new z(this.O(S()),this.O(S()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cm=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class B{constructor(t,e,s,i,r){this.type=1,this._$AH=R,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=R}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,s,i){const r=this.strings;let n=!1;if(void 0===r)t=I(this,t,e,0),n=!E(t)||t!==this._$AH&&t!==j,n&&(this._$AH=t);else{const i=t;let o,a;for(t=r[0],o=0;o<r.length-1;o++)a=I(this,i[s+o],e,o),a===j&&(a=this._$AH[o]),n||(n=!E(a)||a!==this._$AH[o]),a===R?t=R:t!==R&&(t+=(null!=a?a:"")+r[o+1]),this._$AH[o]=a}n&&!i&&this.j(t)}j(t){t===R?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class F extends B{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===R?void 0:t}}const V=m?m.emptyScript:"";class q extends B{constructor(){super(...arguments),this.type=4}j(t){t&&t!==R?this.element.setAttribute(this.name,V):this.element.removeAttribute(this.name)}}class W extends B{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){var s;if((t=null!==(s=I(this,t,e,0))&&void 0!==s?s:R)===j)return;const i=this._$AH,r=t===R&&i!==R||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==R&&(i===R||r);r&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t)}}class Z{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){I(this,t)}}const G=$.litHtmlPolyfillSupport;var Q,X;null==G||G(L,z),(null!==(g=$.litHtmlVersions)&&void 0!==g?g:$.litHtmlVersions=[]).push("2.6.1");class Y extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const s=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=s.firstChild),s}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{var i,r;const n=null!==(i=null==s?void 0:s.renderBefore)&&void 0!==i?i:e;let o=n._$litPart$;if(void 0===o){const t=null!==(r=null==s?void 0:s.renderBefore)&&void 0!==r?r:null;n._$litPart$=o=new z(e.insertBefore(S(),t),t,void 0,null!=s?s:{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return j}}Y.finalized=!0,Y._$litElement$=!0,null===(Q=globalThis.litElementHydrateSupport)||void 0===Q||Q.call(globalThis,{LitElement:Y});const tt=globalThis.litElementPolyfillSupport;null==tt||tt({LitElement:Y}),(null!==(X=globalThis.litElementVersions)&&void 0!==X?X:globalThis.litElementVersions=[]).push("3.2.2"),customElements.define("neo-data-viewer",class extends Y{static get properties(){return{errorMessage:{type:String},dataobject:"",removeKeys:"",replaceKeys:"",prefDateFormat:"",pageItemLimit:{type:Number},currentPage:{type:Number},itemsPerPage:{type:Number}}}static getMetaConfig(){return{controlName:"neo-data-viewer",fallbackDisableSubmit:!1,description:"Display object as a table",iconUrl:"group-control",groupName:"Visual Data",version:"1.6",properties:{dataobject:{type:"string",title:"Object",description:"JSON data variable"},removeKeys:{type:"string",title:"Remove keys JSON",description:'Use key-values to remove columns e.g. {"keyName1": true,"keyName2": true}'},replaceKeys:{type:"string",title:"Rename keys JSON",description:'Use key-value pairs to rename columns e.g. {"oldKey1":"newKey1","oldKey2":"newKey2"}'},pageItemLimit:{type:"string",enum:["5","10","15","30","50","100"],title:"Page Item Limit",description:"Number of items to show per page",defaultValue:"5"}},events:["ntx-value-change"],standardProperties:{fieldLabel:!0,readOnly:!0,required:!0,description:!0}}}constructor(){super(),this.dataobject="",this.removeKeys="",this.replaceKeys="",this.prefDateFormat="",this.pageItemLimit="5",this.currentPage=1,this.errorMessage="",this._expandedMap=new WeakMap}preprocessDoubleEscapedJson(t){let e=t.replace(/\\\\/g,"\\");return e=e.replace(/&quot;/gi,'"'),e=e.replace(/:\\"/g,': \\"'),e}parseDataObject(){let t;if(this.errorMessage="",!this.dataobject)return console.error("No JSON data provided."),null;try{const e=this.preprocessDoubleEscapedJson(this.dataobject);t=JSON.parse(e),"string"==typeof t&&(t=JSON.parse(t)),t=this.replaceUnicodeRegex(t)}catch(e){this.errorMessage="Error parsing JSON data.",console.error(this.errorMessage,e),t=null}return this.removeKeys&&t&&(t=this.removeKeysFromData(t)),this.replaceKeys&&t&&(t=this.renameKeys(t)),t}removeKeysFromData(t){if("string"==typeof this.removeKeys)try{this.removeKeys=JSON.parse(this.removeKeys)}catch(e){return console.error("Error parsing removeKeys:",e),t}const e=Object.keys(this.removeKeys);return t.map((t=>{const s={...t};return e.forEach((t=>{delete s[t]})),s}))}renameKeys(t){if("string"==typeof this.replaceKeys)try{this.replaceKeys=JSON.parse(this.replaceKeys)}catch(e){return console.error("Error parsing replaceKeys:",e),t}return t.map((t=>{const e={};for(const s in t)e[this.replaceKeys[s]||s]=t[s];return e}))}replaceUnicodeRegex(t){return JSON.parse(JSON.stringify(t).replace(/_x([0-9A-F]{4})_/g,((t,e)=>String.fromCharCode(parseInt(e,16)))))}changePage(t){t>0&&t<=this.totalPages&&(this.currentPage=t,this.requestUpdate())}toggleRow(t){this._expandedMap.has(t)?this._expandedMap.set(t,!this._expandedMap.get(t)):this._expandedMap.set(t,!0),this.requestUpdate()}renderField(t){if(Array.isArray(t)){const e=this._expandedMap.get(t)||!1;return H`
        <div>
          <button class="btn btn-sm btn-outline-secondary mb-1" @click="${()=>this.toggleRow(t)}">
            ${e?"−":"+"} Array [${t.length}]
          </button>
          ${e?H`
            <div class="ms-3">
              <table class="table table-bordered table-sm">
                <tbody>
                  ${t.map(((t,e)=>H`
                    <tr>
                      <td>${this.renderField(t)}</td>
                    </tr>
                  `))}
                </tbody>
              </table>
            </div>
          `:""}
        </div>
      `}if("object"==typeof t&&null!==t){const e=this._expandedMap.get(t)||!1;return H`
        <div>
          <button class="btn btn-sm btn-outline-secondary mb-1" @click="${()=>this.toggleRow(t)}">
            ${e?"−":"+"} Object
          </button>
          ${e?H`
            <div class="ms-3">
              <table class="table table-bordered table-sm">
                <tbody>
                  ${Object.entries(t).map((([t,e])=>H`
                    <tr>
                      <th class="text-nowrap">${t}</th>
                      <td>${this.renderField(e)}</td>
                    </tr>
                  `))}
                </tbody>
              </table>
            </div>
          `:""}
        </div>
      `}return null!==t?t:"-"}render(){const t=this.parseDataObject();if(this.errorMessage)return H`<p class="error-message">${this.errorMessage}</p>`;if(!t||0===t.length)return H`
        <div class="alert alert-secondary" role="alert">
          No Data Found
        </div>
      `;const e=(this.currentPage-1)*parseInt(this.pageItemLimit,10),s=e+parseInt(this.pageItemLimit,10),i=t.slice(e,s),r=Math.ceil(t.length/parseInt(this.pageItemLimit,10));this.totalPages=r;const n=Math.min(r,5);let o=Math.max(1,this.currentPage-Math.floor(n/2));const a=Math.min(r,o+n-1);return a-o+1<n&&(o=Math.max(1,a-n+1)),H`
      <style>
        .page-txt-link {
          width: 100px;
          text-align:center;
        }
        .page-num-link {
          width: 45px;
          text-align:center;
        }
        .neo-table {
          -moz-user-select: text;
          -khtml-user-select: text;
          -webkit-user-select: text;
          -ms-user-select: text;
          user-select: text;
        }
        .json-debug-area {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.95em;
          margin-top: 1em;
          padding: 1em;
          max-height: 300px;
          overflow: auto;
        }
      </style>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
      <div class="table-responsive-md overflow-auto">
        <table class="neo-table table table-striped">
          <thead>
            <tr>
              ${Object.keys(t[0]).map((t=>H`<th class="text-nowrap">${t}</th>`))}
            </tr>
          </thead>
          <tbody>
            ${i.map((t=>H`
              <tr>
                ${Object.values(t).map((t=>H`
                  <td>
                    ${this.renderField(t)}
                  </td>
                `))}
              </tr>
            `))}
          </tbody>
        </table>
      </div>
      <div class="row">
        ${r>1?H`
          <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
              <li class="page-item ${1===this.currentPage?"disabled":""}">
                <a class="page-link page-txt-link" href="#" @click="${()=>this.changePage(1)}">First</a>
              </li>
              <li class="page-item ${1===this.currentPage?"disabled":""}">
                <a class="page-link page-txt-link" href="#" @click="${()=>this.changePage(this.currentPage-1)}">Previous</a>
              </li>
              ${Array.from({length:a-o+1},((t,e)=>e+o)).map((t=>H`
                <li class="page-item ${t===this.currentPage?"active":""}">
                  <a class="page-link page-num-link" href="#" @click="${()=>this.changePage(t)}">${t}</a>
                </li>
              `))}
              <li class="page-item ${this.currentPage===r?"disabled":""}">
                <a class="page-link page-txt-link" href="#" @click="${()=>this.changePage(this.currentPage+1)}">Next</a>
              </li>
              <li class="page-item ${this.currentPage===r?"disabled":""}">
                <a class="page-link page-txt-link" href="#" @click="${()=>this.changePage(r)}">Last</a>
              </li>
            </ul>
          </nav>
        `:""}
      </div>
      <div class="mt-3">
        <button class="btn btn-sm btn-outline-info mb-2" type="button" data-bs-toggle="collapse" data-bs-target="#jsonDebugArea" aria-expanded="false" aria-controls="jsonDebugArea">
          Show/Hide JSON Debug
        </button>
        <div class="collapse" id="jsonDebugArea">
          <div class="json-debug-area">
            <pre>${JSON.stringify(t,null,2)}</pre>
          </div>
        </div>
      </div>
    `}})})();