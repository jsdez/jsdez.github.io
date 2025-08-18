/*! For license information please see neo-data-viewer.js.LICENSE.txt */
(()=>{"use strict";const t=window,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;class r{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}}const o=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,i))(e)})(t):t;var n;const a=window,l=a.trustedTypes,h=l?l.emptyScript:"",d=a.reactiveElementPolyfillSupport,c={toAttribute(t,e){switch(e){case Boolean:t=t?h:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},p=(t,e)=>e!==t&&(e==e||t==t),u={attribute:!0,type:String,converter:c,reflect:!1,hasChanged:p},m="finalized";class v extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach((e,i)=>{const s=this._$Ep(i,e);void 0!==s&&(this._$Ev.set(s,i),t.push(s))}),t}static createProperty(t,e=u){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,i,e);void 0!==s&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){const r=this[t];this[e]=s,this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||u}static finalize(){if(this.hasOwnProperty(m))return!1;this[m]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach(t=>t(this))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])})}createRenderRoot(){var i;const s=null!==(i=this.shadowRoot)&&void 0!==i?i:this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{e?i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet):s.forEach(e=>{const s=document.createElement("style"),r=t.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)})})(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)})}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=u){var s;const r=this.constructor._$Ep(t,i);if(void 0!==r&&!0===i.reflect){const o=(void 0!==(null===(s=i.converter)||void 0===s?void 0:s.toAttribute)?i.converter:c).toAttribute(e,i.type);this._$El=t,null==o?this.removeAttribute(r):this.setAttribute(r,o),this._$El=null}}_$AK(t,e){var i;const s=this.constructor,r=s._$Ev.get(t);if(void 0!==r&&this._$El!==r){const t=s.getPropertyOptions(r),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:c;this._$El=r,this[r]=o.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let s=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||p)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((t,e)=>this[e]=t),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)}),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach(t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach((t,e)=>this._$EO(e,this[e],t)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}var b;v[m]=!0,v.elementProperties=new Map,v.elementStyles=[],v.shadowRootOptions={mode:"open"},null==d||d({ReactiveElement:v}),(null!==(n=a.reactiveElementVersions)&&void 0!==n?n:a.reactiveElementVersions=[]).push("1.6.3");const g=window,f=g.trustedTypes,$=f?f.createPolicy("lit-html",{createHTML:t=>t}):void 0,y="$lit$",_=`lit$${(Math.random()+"").slice(9)}$`,A="?"+_,S=`<${A}>`,x=document,E=()=>x.createComment(""),w=t=>null===t||"object"!=typeof t&&"function"!=typeof t,C=Array.isArray,k="[ \t\n\f\r]",P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,O=/>/g,M=RegExp(`>|${k}(?:([^\\s"'>=/]+)(${k}*=${k}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),U=/'/g,T=/"/g,R=/^(?:script|style|textarea|title)$/i,j=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),H=j(1),D=(j(2),Symbol.for("lit-noChange")),J=Symbol.for("lit-nothing"),I=new WeakMap,L=x.createTreeWalker(x,129,null,!1);function z(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==$?$.createHTML(e):e}const B=(t,e)=>{const i=t.length-1,s=[];let r,o=2===e?"<svg>":"",n=P;for(let e=0;e<i;e++){const i=t[e];let a,l,h=-1,d=0;for(;d<i.length&&(n.lastIndex=d,l=n.exec(i),null!==l);)d=n.lastIndex,n===P?"!--"===l[1]?n=N:void 0!==l[1]?n=O:void 0!==l[2]?(R.test(l[2])&&(r=RegExp("</"+l[2],"g")),n=M):void 0!==l[3]&&(n=M):n===M?">"===l[0]?(n=null!=r?r:P,h=-1):void 0===l[1]?h=-2:(h=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?M:'"'===l[3]?T:U):n===T||n===U?n=M:n===N||n===O?n=P:(n=M,r=void 0);const c=n===M&&t[e+1].startsWith("/>")?" ":"";o+=n===P?i+S:h>=0?(s.push(a),i.slice(0,h)+y+i.slice(h)+_+c):i+_+(-2===h?(s.push(void 0),e):c)}return[z(t,o+(t[i]||"<?>")+(2===e?"</svg>":"")),s]};class F{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,o=0;const n=t.length-1,a=this.parts,[l,h]=B(t,e);if(this.el=F.createElement(l,i),L.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(s=L.nextNode())&&a.length<n;){if(1===s.nodeType){if(s.hasAttributes()){const t=[];for(const e of s.getAttributeNames())if(e.endsWith(y)||e.startsWith(_)){const i=h[o++];if(t.push(e),void 0!==i){const t=s.getAttribute(i.toLowerCase()+y).split(_),e=/([.?@])?(.*)/.exec(i);a.push({type:1,index:r,name:e[2],strings:t,ctor:"."===e[1]?Z:"?"===e[1]?Q:"@"===e[1]?X:K})}else a.push({type:6,index:r})}for(const e of t)s.removeAttribute(e)}if(R.test(s.tagName)){const t=s.textContent.split(_),e=t.length-1;if(e>0){s.textContent=f?f.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],E()),L.nextNode(),a.push({type:2,index:++r});s.append(t[e],E())}}}else if(8===s.nodeType)if(s.data===A)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(_,t+1));)a.push({type:7,index:r}),t+=_.length-1}r++}}static createElement(t,e){const i=x.createElement("template");return i.innerHTML=t,i}}function V(t,e,i=t,s){var r,o,n,a;if(e===D)return e;let l=void 0!==s?null===(r=i._$Co)||void 0===r?void 0:r[s]:i._$Cl;const h=w(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==h&&(null===(o=null==l?void 0:l._$AO)||void 0===o||o.call(l,!1),void 0===h?l=void 0:(l=new h(t),l._$AT(t,i,s)),void 0!==s?(null!==(n=(a=i)._$Co)&&void 0!==n?n:a._$Co=[])[s]=l:i._$Cl=l),void 0!==l&&(e=V(t,l._$AS(t,e.values),l,s)),e}class q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:s}=this._$AD,r=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:x).importNode(i,!0);L.currentNode=r;let o=L.nextNode(),n=0,a=0,l=s[0];for(;void 0!==l;){if(n===l.index){let e;2===l.type?e=new W(o,o.nextSibling,this,t):1===l.type?e=new l.ctor(o,l.name,l.strings,this,t):6===l.type&&(e=new Y(o,this,t)),this._$AV.push(e),l=s[++a]}n!==(null==l?void 0:l.index)&&(o=L.nextNode(),n++)}return L.currentNode=x,r}v(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class W{constructor(t,e,i,s){var r;this.type=2,this._$AH=J,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cp=null===(r=null==s?void 0:s.isConnected)||void 0===r||r}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=V(this,t,e),w(t)?t===J||null==t||""===t?(this._$AH!==J&&this._$AR(),this._$AH=J):t!==this._$AH&&t!==D&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):(t=>C(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==J&&w(this._$AH)?this._$AA.nextSibling.data=t:this.$(x.createTextNode(t)),this._$AH=t}g(t){var e;const{values:i,_$litType$:s}=t,r="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=F.createElement(z(s.h,s.h[0]),this.options)),s);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===r)this._$AH.v(i);else{const t=new q(r,this),e=t.u(this.options);t.v(i),this.$(e),this._$AH=t}}_$AC(t){let e=I.get(t.strings);return void 0===e&&I.set(t.strings,e=new F(t)),e}T(t){C(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new W(this.k(E()),this.k(E()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class K{constructor(t,e,i,s,r){this.type=1,this._$AH=J,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=J}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,s){const r=this.strings;let o=!1;if(void 0===r)t=V(this,t,e,0),o=!w(t)||t!==this._$AH&&t!==D,o&&(this._$AH=t);else{const s=t;let n,a;for(t=r[0],n=0;n<r.length-1;n++)a=V(this,s[i+n],e,n),a===D&&(a=this._$AH[n]),o||(o=!w(a)||a!==this._$AH[n]),a===J?t=J:t!==J&&(t+=(null!=a?a:"")+r[n+1]),this._$AH[n]=a}o&&!s&&this.j(t)}j(t){t===J?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class Z extends K{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===J?void 0:t}}const G=f?f.emptyScript:"";class Q extends K{constructor(){super(...arguments),this.type=4}j(t){t&&t!==J?this.element.setAttribute(this.name,G):this.element.removeAttribute(this.name)}}class X extends K{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=V(this,t,e,0))&&void 0!==i?i:J)===D)return;const s=this._$AH,r=t===J&&s!==J||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==J&&(s===J||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class Y{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){V(this,t)}}const tt=g.litHtmlPolyfillSupport;var et,it;null==tt||tt(F,W),(null!==(b=g.litHtmlVersions)&&void 0!==b?b:g.litHtmlVersions=[]).push("2.8.0");class st extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var s,r;const o=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:e;let n=o._$litPart$;if(void 0===n){const t=null!==(r=null==i?void 0:i.renderBefore)&&void 0!==r?r:null;o._$litPart$=n=new W(e.insertBefore(E(),t),t,void 0,null!=i?i:{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return D}}st.finalized=!0,st._$litElement$=!0,null===(et=globalThis.litElementHydrateSupport)||void 0===et||et.call(globalThis,{LitElement:st});const rt=globalThis.litElementPolyfillSupport;null==rt||rt({LitElement:st}),(null!==(it=globalThis.litElementVersions)&&void 0!==it?it:globalThis.litElementVersions=[]).push("3.3.3"),customElements.define("neo-data-viewer",class extends st{static get properties(){return{errorMessage:{type:String},dataobject:"",columnsSchema:"",prefDateFormat:"",pageItemLimit:{type:Number},currentPage:{type:Number},itemsPerPage:{type:Number},debugMode:{type:Boolean}}}static getMetaConfig(){return{controlName:"neo-data-viewer",fallbackDisableSubmit:!1,description:"Display object as a table",iconUrl:"group-control",groupName:"Visual Data",version:"1.9",properties:{dataobject:{type:"string",title:"Object",description:"JSON data variable"},columnsSchema:{type:"string",title:"Columns Schema",description:"Array of objects to control order, visibility, renaming, and formatting."},pageItemLimit:{type:"string",enum:["5","10","15","30","50","100"],title:"Page Item Limit",description:"Number of items to show per page",defaultValue:"5"},debugMode:{type:"boolean",title:"Debug Mode",description:"Show or hide the JSON debug viewer",defaultValue:!1}},events:["ntx-value-change"],standardProperties:{fieldLabel:!0,readOnly:!0,required:!0,description:!0}}}constructor(){super(),this.dataobject="",this.columnsSchema="",this.prefDateFormat="",this.pageItemLimit="5",this.currentPage=1,this.errorMessage="",this._expandedMap=new Map,this._showDebug=!1,this._editedSchema=""}toggleDebugArea(){this._showDebug=!this._showDebug,this.requestUpdate()}preprocessDoubleEscapedJson(t){let e=t.replace(/\\\\/g,"\\");return e=e.replace(/&quot;/gi,'"'),e=e.replace(/:\\"/g,': \\"'),e}parseDataObject(){let t;if(this.errorMessage="",!this.dataobject)return console.error("No JSON data provided."),null;try{const e=this.preprocessDoubleEscapedJson(this.dataobject);t=JSON.parse(e),"string"==typeof t&&(t=JSON.parse(t)),t=this.replaceUnicodeRegex(t)}catch(e){this.errorMessage="Error parsing JSON data.",console.error(this.errorMessage,e),t=null}return t}parseColumnsSchema(){if(!this.columnsSchema)return[];try{const t="string"==typeof this.columnsSchema?JSON.parse(this.columnsSchema):this.columnsSchema;return Array.isArray(t)?t:[]}catch(t){return console.error("Invalid columnsSchema JSON:",t),[]}}replaceUnicodeRegex(t){return JSON.parse(JSON.stringify(t).replace(/_x([0-9A-F]{4})_/g,(t,e)=>String.fromCharCode(parseInt(e,16))))}changePage(t){t>0&&t<=this.totalPages&&(this.currentPage=t,this.requestUpdate())}toggleRow(t){const e=this._expandedMap.get(t)||!1;this._expandedMap.set(t,!e),this.requestUpdate()}renderField(t,e=""){if(Array.isArray(t)){const i=this._expandedMap.get(e)||!1;return H`
        <div>
          <button class="btn btn-sm btn-outline-secondary mb-1" @click="${()=>this.toggleRow(e)}" type="button">
            ${i?"−":"+"} Array [${t.length}]
          </button>
          ${i?H`
            <div class="ms-3">
              <table class="table table-bordered table-sm">
                <tbody>
                  ${t.map((t,i)=>H`
                    <tr>
                      <td>${this.renderField(t,e+"."+i)}</td>
                    </tr>
                  `)}
                </tbody>
              </table>
            </div>
          `:""}
        </div>
      `}if("object"==typeof t&&null!==t){const i=this._expandedMap.get(e)||!1;return H`
        <div>
          <button class="btn btn-sm btn-outline-secondary mb-1" @click="${()=>this.toggleRow(e)}" type="button">
            ${i?"−":"+"} Object
          </button>
          ${i?H`
            <div class="ms-3">
              <table class="table table-bordered table-sm">
                <tbody>
                  ${Object.entries(t).map(([t,i])=>H`
                    <tr>
                      <th class="text-nowrap">${t}</th>
                      <td>${this.renderField(i,e+"."+t)}</td>
                    </tr>
                  `)}
                </tbody>
              </table>
            </div>
          `:""}
        </div>
      `}return null!==t?t:"-"}groupColumnsByRow(t){const e=[];let i=[],s=0;for(const r of t){if(!1===r.visible)continue;let t=void 0===r.col||"auto"===r.col?0:Number(r.col);(t<1||t>12)&&(t=0),12!==t?(s+t>12&&(e.push(i),i=[],s=0),i.push(r),s+=t):(i.length&&e.push(i),e.push([r]),i=[],s=0)}return i.length&&e.push(i),e}copyToClipboard(t){const e=document.createElement("textarea");e.value=t,document.body.appendChild(e),e.select(),document.execCommand("copy"),document.body.removeChild(e)}handleSchemaEdit(t){this._editedSchema=t.target.value}buildSchemaFromJson(t){if(!t)return[];const e=Array.isArray(t)?t[0]:t;return e&&"object"==typeof e?Object.entries(e).map(([t,e])=>{let i="string";return Array.isArray(e)?i="array":"number"==typeof e?i="number":"boolean"==typeof e&&(i="boolean"),{key:t,title:t,type:i,visible:!0,..."array"===i?{items:this.buildSchemaFromJson(e)}:{}}}):[]}copySchemaToClipboard(){let t=this._editedSchema||JSON.stringify(this.buildSchemaFromJson(this.parseDataObject()),null,2);try{const e=`"${JSON.stringify(JSON.parse(t)).replace(/"/g,'\\"')}"`;this.copyToClipboard(e)}catch(e){this.copyToClipboard(t)}}render(){const t=this.parseDataObject(),e=this.parseColumnsSchema();if(this.errorMessage)return H`<p class="error-message">${this.errorMessage}</p>`;if(!t||0===t.length)return H`
        <div class="alert alert-secondary" role="alert">
          No Data Found
        </div>
      `;const i=(this.currentPage-1)*parseInt(this.pageItemLimit,10),s=i+parseInt(this.pageItemLimit,10),r=t.slice(i,s),o=Math.ceil(t.length/parseInt(this.pageItemLimit,10));this.totalPages=o;const n=Math.min(o,5);let a=Math.max(1,this.currentPage-Math.floor(n/2));const l=Math.min(o,a+n-1);l-a+1<n&&(a=Math.max(1,l-n+1));const h=e.filter(t=>!1!==t.visible&&"array"!==t.type),d=e.find(t=>!1!==t.visible&&"array"===t.type),c=this.groupColumnsByRow(h);return H`
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
            ${c.map(t=>H`<tr>${t.map(t=>H`<th title="${t.description||""}">${t.title||t.key}</th>`)}</tr>`)}
          </thead>
          <tbody>
            ${r.map((t,e)=>H`
              ${c.map(e=>H`<tr>
                ${e.map(e=>{let i="";if(e.col&&"auto"!==e.col?i=`width: ${e.col/12*100}%`:"auto"===e.col&&(i="width: auto"),"formatted_address"===e.format)return H`<td style="${i}">${t[e.key]?.formatted_address??"-"}</td>`;if("currency"===e.format&&e.prefix)return H`<td style="${i}">${e.prefix}${t[e.key]??"-"}</td>`;if("string"===e.type&&"longtext"===e.format){const s=t[e.key]??"-";return H`<td style="white-space:pre-line;${i}">${s}</td>`}return H`<td style="${i}">${t[e.key]??"-"}</td>`})}
              </tr>`)}
              ${d&&Array.isArray(t[d.key])&&!1!==d.visible?H`
                <tr>
                  <td colspan="12">
                    <div><b>${d.title||d.key}</b></div>
                    <table class="table table-bordered table-sm mb-0">
                      <thead>
                        ${(()=>this.groupColumnsByRow((d.items||[]).filter(t=>!1!==t.visible)).map(t=>H`<tr>${t.map(t=>{let e="";return t.col&&"auto"!==t.col?e=`width: ${t.col/12*100}%`:"auto"===t.col&&(e="width: auto"),H`<th style="${e}" title="${t.description||""}">${t.title||t.key}</th>`})}</tr>`))()}
                      </thead>
                      <tbody>
                        ${t[d.key].map((t,e)=>this.groupColumnsByRow((d.items||[]).filter(t=>!1!==t.visible)).map(e=>H`<tr>
                            ${e.map(e=>{let i="";return e.col&&"auto"!==e.col?i=`width: ${e.col/12*100}%`:"auto"===e.col&&(i="width: auto"),H`<td style="${i}">${t[e.key]??"-"}</td>`})}
                          </tr>`))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              `:""}
            `)}
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
              ${Array.from({length:l-a+1},(t,e)=>e+a).map(t=>H`
                <li class="page-item ${t===this.currentPage?"active":""}">
                  <a class="page-link page-num-link" href="#" @click="${()=>this.changePage(t)}">${t}</a>
                </li>
              `)}
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
        ${this.debugMode?H`
          <div class="json-debug-area" style="user-select:text;">
            <div class="d-flex mb-2 gap-2">
              <button class="btn btn-sm btn-outline-secondary" @click="${()=>this.copyToClipboard(JSON.stringify(t,null,2))}">Copy JSON</button>
            </div>
            <pre style="user-select:text;">${JSON.stringify(t,null,2)}</pre>
          </div>
          <div class="json-debug-area mt-2" style="user-select:text;">
            <div class="d-flex mb-2 gap-2">
              <button class="btn btn-sm btn-outline-secondary" @click="${()=>this.copySchemaToClipboard()}">Copy Schema</button>
            </div>
            <b>Edit Schema (auto-generated from input JSON):</b>
            <textarea style="width:100%;min-height:120px;font-family:monospace;" @input="${t=>this.handleSchemaEdit(t)}">${this._editedSchema||JSON.stringify(this.buildSchemaFromJson(t),null,2)}</textarea>
            <div class="mt-3">
              <b>Schema Property Reference:</b>
              <ul style="font-size:0.95em;line-height:1.5;">
                <li><b>key</b>: The JSON property name to display (required).</li>
                <li><b>title</b>: The column header/display name (optional).</li>
                <li><b>type</b>: Data type (string, number, integer, boolean, array) (optional, default: string).</li>
                <li><b>format</b>: Formatting hint (e.g., currency, longtext, formatted_address) (optional).</li>
                <li><b>description</b>: Tooltip or help text for the column (optional).</li>
                <li><b>visible</b>: true/false to show/hide the column (optional, default: true).</li>
                <li><b>col</b>: Column width (1-12 for percent, 'auto' for flexible, optional).</li>
                <li><b>prefix</b>: Text to prepend (e.g., £ for currency, optional).</li>
                <li><b>items</b>: For type 'array', an array of schema objects for nested columns (optional).</li>
                <li><b>parent</b>: For advanced/nested use, parent key for grouping (optional).</li>
              </ul>
            </div>
          </div>
        `:""}
      </div>
    `}})})();