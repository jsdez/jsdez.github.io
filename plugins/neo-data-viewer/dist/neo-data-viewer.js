/*! For license information please see neo-data-viewer.js.LICENSE.txt */
(()=>{"use strict";const t=window,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;class r{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}}const o=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,s))(e)})(t):t;var n;const a=window,l=a.trustedTypes,h=l?l.emptyScript:"",d=a.reactiveElementPolyfillSupport,c={toAttribute(t,e){switch(e){case Boolean:t=t?h:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},u=(t,e)=>e!==t&&(e==e||t==t),p={attribute:!0,type:String,converter:c,reflect:!1,hasChanged:u};class m extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,s)=>{const i=this._$Ep(s,e);void 0!==i&&(this._$Ev.set(i,s),t.push(i))})),t}static createProperty(t,e=p){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,i=this.getPropertyDescriptor(t,s,e);void 0!==i&&Object.defineProperty(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){return{get(){return this[e]},set(i){const r=this[t];this[e]=i,this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||p}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of e)this.createProperty(s,t[s])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Ep(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,s;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var s;const i=null!==(s=this.shadowRoot)&&void 0!==s?s:this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{e?s.adoptedStyleSheets=i.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):i.forEach((e=>{const i=document.createElement("style"),r=t.litNonce;void 0!==r&&i.setAttribute("nonce",r),i.textContent=e.cssText,s.appendChild(i)}))})(i,this.constructor.elementStyles),i}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EO(t,e,s=p){var i;const r=this.constructor._$Ep(t,s);if(void 0!==r&&!0===s.reflect){const o=(void 0!==(null===(i=s.converter)||void 0===i?void 0:i.toAttribute)?s.converter:c).toAttribute(e,s.type);this._$El=t,null==o?this.removeAttribute(r):this.setAttribute(r,o),this._$El=null}}_$AK(t,e){var s;const i=this.constructor,r=i._$Ev.get(t);if(void 0!==r&&this._$El!==r){const t=i.getPropertyOptions(r),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(s=t.converter)||void 0===s?void 0:s.fromAttribute)?t.converter:c;this._$El=r,this[r]=o.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,s){let i=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||u)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===s.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,s))):i=!1),!this.isUpdatePending&&i&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,e)=>this[e]=t)),this._$Ei=void 0);let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(s)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,e)=>this._$EO(e,this[e],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}var v;m.finalized=!0,m.elementProperties=new Map,m.elementStyles=[],m.shadowRootOptions={mode:"open"},null==d||d({ReactiveElement:m}),(null!==(n=a.reactiveElementVersions)&&void 0!==n?n:a.reactiveElementVersions=[]).push("1.6.1");const g=window,$=g.trustedTypes,f=$?$.createPolicy("lit-html",{createHTML:t=>t}):void 0,b=`lit$${(Math.random()+"").slice(9)}$`,y="?"+b,_=`<${y}>`,A=document,S=(t="")=>A.createComment(t),x=t=>null===t||"object"!=typeof t&&"function"!=typeof t,E=Array.isArray,w=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,C=/-->/g,P=/>/g,k=RegExp(">|[ \t\n\f\r](?:([^\\s\"'>=/]+)([ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r\"'`<>=]|(\"|')|))|$)","g"),N=/'/g,O=/"/g,U=/^(?:script|style|textarea|title)$/i,M=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),H=M(1),R=(M(2),Symbol.for("lit-noChange")),j=Symbol.for("lit-nothing"),D=new WeakMap,T=A.createTreeWalker(A,129,null,!1),I=(t,e)=>{const s=t.length-1,i=[];let r,o=2===e?"<svg>":"",n=w;for(let e=0;e<s;e++){const s=t[e];let a,l,h=-1,d=0;for(;d<s.length&&(n.lastIndex=d,l=n.exec(s),null!==l);)d=n.lastIndex,n===w?"!--"===l[1]?n=C:void 0!==l[1]?n=P:void 0!==l[2]?(U.test(l[2])&&(r=RegExp("</"+l[2],"g")),n=k):void 0!==l[3]&&(n=k):n===k?">"===l[0]?(n=null!=r?r:w,h=-1):void 0===l[1]?h=-2:(h=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?k:'"'===l[3]?O:N):n===O||n===N?n=k:n===C||n===P?n=w:(n=k,r=void 0);const c=n===k&&t[e+1].startsWith("/>")?" ":"";o+=n===w?s+_:h>=0?(i.push(a),s.slice(0,h)+"$lit$"+s.slice(h)+b+c):s+b+(-2===h?(i.push(void 0),e):c)}const a=o+(t[s]||"<?>")+(2===e?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==f?f.createHTML(a):a,i]};class L{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,o=0;const n=t.length-1,a=this.parts,[l,h]=I(t,e);if(this.el=L.createElement(l,s),T.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(i=T.nextNode())&&a.length<n;){if(1===i.nodeType){if(i.hasAttributes()){const t=[];for(const e of i.getAttributeNames())if(e.endsWith("$lit$")||e.startsWith(b)){const s=h[o++];if(t.push(e),void 0!==s){const t=i.getAttribute(s.toLowerCase()+"$lit$").split(b),e=/([.?@])?(.*)/.exec(s);a.push({type:1,index:r,name:e[2],strings:t,ctor:"."===e[1]?F:"?"===e[1]?W:"@"===e[1]?K:q})}else a.push({type:6,index:r})}for(const e of t)i.removeAttribute(e)}if(U.test(i.tagName)){const t=i.textContent.split(b),e=t.length-1;if(e>0){i.textContent=$?$.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],S()),T.nextNode(),a.push({type:2,index:++r});i.append(t[e],S())}}}else if(8===i.nodeType)if(i.data===y)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=i.data.indexOf(b,t+1));)a.push({type:7,index:r}),t+=b.length-1}r++}}static createElement(t,e){const s=A.createElement("template");return s.innerHTML=t,s}}function z(t,e,s=t,i){var r,o,n,a;if(e===R)return e;let l=void 0!==i?null===(r=s._$Co)||void 0===r?void 0:r[i]:s._$Cl;const h=x(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==h&&(null===(o=null==l?void 0:l._$AO)||void 0===o||o.call(l,!1),void 0===h?l=void 0:(l=new h(t),l._$AT(t,s,i)),void 0!==i?(null!==(n=(a=s)._$Co)&&void 0!==n?n:a._$Co=[])[i]=l:s._$Cl=l),void 0!==l&&(e=z(t,l._$AS(t,e.values),l,i)),e}class B{constructor(t,e){this.u=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}v(t){var e;const{el:{content:s},parts:i}=this._$AD,r=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:A).importNode(s,!0);T.currentNode=r;let o=T.nextNode(),n=0,a=0,l=i[0];for(;void 0!==l;){if(n===l.index){let e;2===l.type?e=new J(o,o.nextSibling,this,t):1===l.type?e=new l.ctor(o,l.name,l.strings,this,t):6===l.type&&(e=new Z(o,this,t)),this.u.push(e),l=i[++a]}n!==(null==l?void 0:l.index)&&(o=T.nextNode(),n++)}return r}p(t){let e=0;for(const s of this.u)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class J{constructor(t,e,s,i){var r;this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cm=null===(r=null==i?void 0:i.isConnected)||void 0===r||r}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cm}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=z(this,t,e),x(t)?t===j||null==t||""===t?(this._$AH!==j&&this._$AR(),this._$AH=j):t!==this._$AH&&t!==R&&this.g(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>E(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.k(t):this.g(t)}O(t,e=this._$AB){return this._$AA.parentNode.insertBefore(t,e)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}g(t){this._$AH!==j&&x(this._$AH)?this._$AA.nextSibling.data=t:this.T(A.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:i}=t,r="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=L.createElement(i.h,this.options)),i);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===r)this._$AH.p(s);else{const t=new B(r,this),e=t.v(this.options);t.p(s),this.T(e),this._$AH=t}}_$AC(t){let e=D.get(t.strings);return void 0===e&&D.set(t.strings,e=new L(t)),e}k(t){E(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const r of t)i===e.length?e.push(s=new J(this.O(S()),this.O(S()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cm=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class q{constructor(t,e,s,i,r){this.type=1,this._$AH=j,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=j}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,s,i){const r=this.strings;let o=!1;if(void 0===r)t=z(this,t,e,0),o=!x(t)||t!==this._$AH&&t!==R,o&&(this._$AH=t);else{const i=t;let n,a;for(t=r[0],n=0;n<r.length-1;n++)a=z(this,i[s+n],e,n),a===R&&(a=this._$AH[n]),o||(o=!x(a)||a!==this._$AH[n]),a===j?t=j:t!==j&&(t+=(null!=a?a:"")+r[n+1]),this._$AH[n]=a}o&&!i&&this.j(t)}j(t){t===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class F extends q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===j?void 0:t}}const V=$?$.emptyScript:"";class W extends q{constructor(){super(...arguments),this.type=4}j(t){t&&t!==j?this.element.setAttribute(this.name,V):this.element.removeAttribute(this.name)}}class K extends q{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){var s;if((t=null!==(s=z(this,t,e,0))&&void 0!==s?s:j)===R)return;const i=this._$AH,r=t===j&&i!==j||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==j&&(i===j||r);r&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t)}}class Z{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){z(this,t)}}const G=g.litHtmlPolyfillSupport;var Q,X;null==G||G(L,J),(null!==(v=g.litHtmlVersions)&&void 0!==v?v:g.litHtmlVersions=[]).push("2.6.1");class Y extends m{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const s=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=s.firstChild),s}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{var i,r;const o=null!==(i=null==s?void 0:s.renderBefore)&&void 0!==i?i:e;let n=o._$litPart$;if(void 0===n){const t=null!==(r=null==s?void 0:s.renderBefore)&&void 0!==r?r:null;o._$litPart$=n=new J(e.insertBefore(S(),t),t,void 0,null!=s?s:{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return R}}Y.finalized=!0,Y._$litElement$=!0,null===(Q=globalThis.litElementHydrateSupport)||void 0===Q||Q.call(globalThis,{LitElement:Y});const tt=globalThis.litElementPolyfillSupport;null==tt||tt({LitElement:Y}),(null!==(X=globalThis.litElementVersions)&&void 0!==X?X:globalThis.litElementVersions=[]).push("3.2.2"),customElements.define("neo-data-viewer",class extends Y{static get properties(){return{errorMessage:{type:String},dataobject:"",columnsSchema:"",prefDateFormat:"",pageItemLimit:{type:Number},currentPage:{type:Number},itemsPerPage:{type:Number}}}static getMetaConfig(){return{controlName:"neo-data-viewer",fallbackDisableSubmit:!1,description:"Display object as a table",iconUrl:"group-control",groupName:"Visual Data",version:"1.8",properties:{dataobject:{type:"string",title:"Object",description:"JSON data variable"},columnsSchema:{type:"string",title:"Columns Schema",description:'Array of objects to control order, visibility, renaming, and formatting. [{"key":"field","title":"Display Name","type":"string","format":"currency","description":"desc","visible":true}]'},pageItemLimit:{type:"string",enum:["5","10","15","30","50","100"],title:"Page Item Limit",description:"Number of items to show per page",defaultValue:"5"}},events:["ntx-value-change"],standardProperties:{fieldLabel:!0,readOnly:!0,required:!0,description:!0}}}constructor(){super(),this.dataobject="",this.columnsSchema="",this.prefDateFormat="",this.pageItemLimit="5",this.currentPage=1,this.errorMessage="",this._expandedMap=new Map,this._showDebug=!1}toggleDebugArea(){this._showDebug=!this._showDebug,this.requestUpdate()}preprocessDoubleEscapedJson(t){let e=t.replace(/\\\\/g,"\\");return e=e.replace(/&quot;/gi,'"'),e=e.replace(/:\\"/g,': \\"'),e}parseDataObject(){let t;if(this.errorMessage="",!this.dataobject)return console.error("No JSON data provided."),null;try{const e=this.preprocessDoubleEscapedJson(this.dataobject);t=JSON.parse(e),"string"==typeof t&&(t=JSON.parse(t)),t=this.replaceUnicodeRegex(t)}catch(e){this.errorMessage="Error parsing JSON data.",console.error(this.errorMessage,e),t=null}return t}parseColumnsSchema(){if(!this.columnsSchema)return[];try{const t="string"==typeof this.columnsSchema?JSON.parse(this.columnsSchema):this.columnsSchema;return Array.isArray(t)?t:[]}catch(t){return console.error("Invalid columnsSchema JSON:",t),[]}}replaceUnicodeRegex(t){return JSON.parse(JSON.stringify(t).replace(/_x([0-9A-F]{4})_/g,((t,e)=>String.fromCharCode(parseInt(e,16)))))}changePage(t){t>0&&t<=this.totalPages&&(this.currentPage=t,this.requestUpdate())}toggleRow(t){const e=this._expandedMap.get(t)||!1;this._expandedMap.set(t,!e),this.requestUpdate()}renderField(t,e=""){if(Array.isArray(t)){const s=this._expandedMap.get(e)||!1;return H`
        <div>
          <button class="btn btn-sm btn-outline-secondary mb-1" @click="${()=>this.toggleRow(e)}" type="button">
            ${s?"−":"+"} Array [${t.length}]
          </button>
          ${s?H`
            <div class="ms-3">
              <table class="table table-bordered table-sm">
                <tbody>
                  ${t.map(((t,s)=>H`
                    <tr>
                      <td>${this.renderField(t,e+"."+s)}</td>
                    </tr>
                  `))}
                </tbody>
              </table>
            </div>
          `:""}
        </div>
      `}if("object"==typeof t&&null!==t){const s=this._expandedMap.get(e)||!1;return H`
        <div>
          <button class="btn btn-sm btn-outline-secondary mb-1" @click="${()=>this.toggleRow(e)}" type="button">
            ${s?"−":"+"} Object
          </button>
          ${s?H`
            <div class="ms-3">
              <table class="table table-bordered table-sm">
                <tbody>
                  ${Object.entries(t).map((([t,s])=>H`
                    <tr>
                      <th class="text-nowrap">${t}</th>
                      <td>${this.renderField(s,e+"."+t)}</td>
                    </tr>
                  `))}
                </tbody>
              </table>
            </div>
          `:""}
        </div>
      `}return null!==t?t:"-"}groupColumnsByRow(t){const e=[];let s=[],i=0;for(const r of t){if(!1===r.visible)continue;let t=void 0===r.col||"auto"===r.col?0:Number(r.col);(t<1||t>12)&&(t=0),i+t>12&&(e.push(s),s=[],i=0),s.push(r),i+=t}return s.length&&e.push(s),e}render(){const t=this.parseDataObject(),e=this.parseColumnsSchema();if(this.errorMessage)return H`<p class="error-message">${this.errorMessage}</p>`;if(!t||0===t.length)return H`
        <div class="alert alert-secondary" role="alert">
          No Data Found
        </div>
      `;const s=(this.currentPage-1)*parseInt(this.pageItemLimit,10),i=s+parseInt(this.pageItemLimit,10),r=t.slice(s,i),o=Math.ceil(t.length/parseInt(this.pageItemLimit,10));this.totalPages=o;const n=Math.min(o,5);let a=Math.max(1,this.currentPage-Math.floor(n/2));const l=Math.min(o,a+n-1);l-a+1<n&&(a=Math.max(1,l-n+1));const h=e.filter((t=>!1!==t.visible&&"array"!==t.type)),d=e.find((t=>!1!==t.visible&&"array"===t.type)),c=this.groupColumnsByRow(h);return H`
      <style>
        .neo-table {
          border-radius: var(--ntx-form-theme-border-radius, 4px);
          background: var(--ntx-form-theme-color-form-background, #fff);
          color: var(--ntx-form-theme-color-input-text, #222);
          font-family: var(--ntx-form-theme-font-family, inherit);
          font-size: var(--ntx-form-theme-text-input-size, 1rem);
        }
        .neo-table th, .neo-table td {
          border: 1px solid var(--ntx-form-theme-color-border, #dee2e6);
          background: var(--ntx-form-theme-color-input-background, #f8f9fa);
          color: var(--ntx-form-theme-color-input-text, #222);
          padding: 0.5rem 0.75rem;
        }
        .neo-table th {
          background: var(--ntx-form-theme-color-page-background, #f4f4f4);
          color: var(--ntx-form-theme-color-secondary, #222);
          font-size: var(--ntx-form-theme-text-label-size, 1rem);
        }
        .neo-table tr {
          border-radius: var(--ntx-form-theme-border-radius, 4px);
        }
        .neo-table tbody tr:nth-child(even) td {
          background: var(--ntx-form-theme-color-form-background, #fff);
        }
        .neo-table tbody tr:nth-child(odd) td {
          background: var(--ntx-form-theme-color-input-background, #f8f9fa);
        }
        .neo-table .error-message {
          background: var(--ntx-form-theme-color-error, #ffe6e6);
          color: var(--ntx-form-theme-color-error, #b30000);
          border-radius: var(--ntx-form-theme-border-radius, 4px);
          padding: 0.5rem;
        }
        .json-debug-area {
          background: var(--ntx-form-theme-color-input-background, #f8f9fa);
          border: 1px solid var(--ntx-form-theme-color-border, #dee2e6);
          border-radius: var(--ntx-form-theme-border-radius, 4px);
          font-family: var(--ntx-form-theme-font-family, monospace);
          font-size: var(--ntx-form-theme-text-input-size, 0.95em);
          margin-top: 1em;
          padding: 1em;
          max-height: 300px;
          overflow: auto;
        }
        .neo-table b {
          color: var(--ntx-form-theme-color-secondary, #333);
        }
      </style>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
      <div class="table-responsive-md overflow-auto">
        <table class="neo-table table table-striped">
          <thead>
            ${c.map((t=>H`<tr>${t.map((t=>H`<th title="${t.description||""}">${t.title||t.key}</th>`))}</tr>`))}
          </thead>
          <tbody>
            ${r.map(((t,e)=>H`
              ${c.map((e=>H`<tr>
                ${e.map((e=>{let s="";if(e.col&&"auto"!==e.col?s=`width: ${e.col/12*100}%`:"auto"===e.col&&(s="width: auto"),"formatted_address"===e.format)return H`<td style="${s}">${t[e.key]?.formatted_address??"-"}</td>`;if("currency"===e.format&&e.prefix)return H`<td style="${s}">${e.prefix}${t[e.key]??"-"}</td>`;if("string"===e.type&&"longtext"===e.format){const i=t[e.key]??"-";return H`<td style="white-space:pre-line;${s}">${i}</td>`}return H`<td style="${s}">${t[e.key]??"-"}</td>`}))}
              </tr>`))}
              ${d&&Array.isArray(t[d.key])&&!1!==d.visible?H`
                <tr>
                  <td colspan="12">
                    <div><b>${d.title||d.key}</b></div>
                    <table class="table table-bordered table-sm mb-0">
                      <thead>
                        ${(()=>this.groupColumnsByRow((d.items||[]).filter((t=>!1!==t.visible))).map((t=>H`<tr>${t.map((t=>{let e="";return t.col&&"auto"!==t.col?e=`width: ${t.col/12*100}%`:"auto"===t.col&&(e="width: auto"),H`<th style="${e}" title="${t.description||""}">${t.title||t.key}</th>`}))}</tr>`)))()}
                      </thead>
                      <tbody>
                        ${t[d.key].map(((t,e)=>this.groupColumnsByRow((d.items||[]).filter((t=>!1!==t.visible))).map((e=>H`<tr>
                            ${e.map((e=>{let s="";return e.col&&"auto"!==e.col?s=`width: ${e.col/12*100}%`:"auto"===e.col&&(s="width: auto"),H`<td style="${s}">${t[e.key]??"-"}</td>`}))}
                          </tr>`))))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              `:""}
            `))}
          </tbody>
        </table>
      </div>
      <div class="row">
        ${o>1?H`
          <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
              <li class="page-item ${1===this.currentPage?"disabled":""}">
                <a class="page-link page-txt-link" href="#" @click="${()=>this.changePage(1)}">First</a>
              </li>
              <li class="page-item ${1===this.currentPage?"disabled":""}">
                <a class="page-link page-txt-link" href="#" @click="${()=>this.changePage(this.currentPage-1)}">Previous</a>
              </li>
              ${Array.from({length:l-a+1},((t,e)=>e+a)).map((t=>H`
                <li class="page-item ${t===this.currentPage?"active":""}">
                  <a class="page-link page-num-link" href="#" @click="${()=>this.changePage(t)}">${t}</a>
                </li>
              `))}
              <li class="page-item ${this.currentPage===o?"disabled":""}">
                <a class="page-link page-txt-link" href="#" @click="${()=>this.changePage(this.currentPage+1)}">Next</a>
              </li>
              <li class="page-item ${this.currentPage===o?"disabled":""}">
                <a class="page-link page-txt-link" href="#" @click="${()=>this.changePage(o)}">Last</a>
              </li>
            </ul>
          </nav>
        `:""}
      </div>
      <div class="mt-3">
        <button class="btn btn-sm btn-outline-info mb-2" type="button" @click="${()=>this.toggleDebugArea()}">
          ${this._showDebug?"Hide":"Show"} JSON Debug
        </button>
        ${this._showDebug?H`
          <div class="json-debug-area">
            <pre>${JSON.stringify(t,null,2)}</pre>
          </div>
        `:""}
      </div>
    `}})})();