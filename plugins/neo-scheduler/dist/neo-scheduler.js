/*! For license information please see neo-scheduler.js.LICENSE.txt */
(()=>{"use strict";var t={d:(e,i)=>{for(var r in i)t.o(i,r)&&!t.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:i[r]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e),r:t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},e={};t.r(e),t.d(e,{NeoSchedulerElement:()=>pt});const i=window,r=i.ShadowRoot&&(void 0===i.ShadyCSS||i.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;class n{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(r&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(e,t))}return t}toString(){return this.cssText}}const a=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,r)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[r+1],t[0]);return new n(i,t,s)},l=r?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(e)})(t):t;var d;const c=window,h=c.trustedTypes,u=h?h.emptyScript:"",p=c.reactiveElementPolyfillSupport,v={toAttribute(t,e){switch(e){case Boolean:t=t?u:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},m=(t,e)=>e!==t&&(e==e||t==t),y={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:m},g="finalized";class $ extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach((e,i)=>{const r=this._$Ep(i,e);void 0!==r&&(this._$Ev.set(r,i),t.push(r))}),t}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,r=this.getPropertyDescriptor(t,i,e);void 0!==r&&Object.defineProperty(this.prototype,t,r)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(r){const s=this[t];this[e]=r,this.requestUpdate(t,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||y}static finalize(){if(this.hasOwnProperty(g))return!1;this[g]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(l(t))}else void 0!==t&&e.push(l(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach(t=>t(this))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])})}createRenderRoot(){var t;const e=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{r?t.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet):e.forEach(e=>{const r=document.createElement("style"),s=i.litNonce;void 0!==s&&r.setAttribute("nonce",s),r.textContent=e.cssText,t.appendChild(r)})})(e,this.constructor.elementStyles),e}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)})}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=y){var r;const s=this.constructor._$Ep(t,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==(null===(r=i.converter)||void 0===r?void 0:r.toAttribute)?i.converter:v).toAttribute(e,i.type);this._$El=t,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$El=null}}_$AK(t,e){var i;const r=this.constructor,s=r._$Ev.get(t);if(void 0!==s&&this._$El!==s){const t=r.getPropertyOptions(s),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:v;this._$El=s,this[s]=o.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let r=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||m)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):r=!1),!this.isUpdatePending&&r&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((t,e)=>this[e]=t),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)}),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach(t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach((t,e)=>this._$EO(e,this[e],t)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}var f;$[g]=!0,$.elementProperties=new Map,$.elementStyles=[],$.shadowRootOptions={mode:"open"},null==p||p({ReactiveElement:$}),(null!==(d=c.reactiveElementVersions)&&void 0!==d?d:c.reactiveElementVersions=[]).push("1.6.3");const _=window,b=_.trustedTypes,A=b?b.createPolicy("lit-html",{createHTML:t=>t}):void 0,w="$lit$",k=`lit$${(Math.random()+"").slice(9)}$`,S="?"+k,E=`<${S}>`,x=document,C=()=>x.createComment(""),P=t=>null===t||"object"!=typeof t&&"function"!=typeof t,D=Array.isArray,O="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,T=/-->/g,N=/>/g,W=RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,R=/"/g,M=/^(?:script|style|textarea|title)$/i,I=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),j=I(1),z=(I(2),Symbol.for("lit-noChange")),L=Symbol.for("lit-nothing"),B=new WeakMap,V=x.createTreeWalker(x,129,null,!1);function q(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const F=(t,e)=>{const i=t.length-1,r=[];let s,o=2===e?"<svg>":"",n=U;for(let e=0;e<i;e++){const i=t[e];let a,l,d=-1,c=0;for(;c<i.length&&(n.lastIndex=c,l=n.exec(i),null!==l);)c=n.lastIndex,n===U?"!--"===l[1]?n=T:void 0!==l[1]?n=N:void 0!==l[2]?(M.test(l[2])&&(s=RegExp("</"+l[2],"g")),n=W):void 0!==l[3]&&(n=W):n===W?">"===l[0]?(n=null!=s?s:U,d=-1):void 0===l[1]?d=-2:(d=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?W:'"'===l[3]?R:H):n===R||n===H?n=W:n===T||n===N?n=U:(n=W,s=void 0);const h=n===W&&t[e+1].startsWith("/>")?" ":"";o+=n===U?i+E:d>=0?(r.push(a),i.slice(0,d)+w+i.slice(d)+k+h):i+k+(-2===d?(r.push(void 0),e):h)}return[q(t,o+(t[i]||"<?>")+(2===e?"</svg>":"")),r]};class J{constructor({strings:t,_$litType$:e},i){let r;this.parts=[];let s=0,o=0;const n=t.length-1,a=this.parts,[l,d]=F(t,e);if(this.el=J.createElement(l,i),V.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(r=V.nextNode())&&a.length<n;){if(1===r.nodeType){if(r.hasAttributes()){const t=[];for(const e of r.getAttributeNames())if(e.endsWith(w)||e.startsWith(k)){const i=d[o++];if(t.push(e),void 0!==i){const t=r.getAttribute(i.toLowerCase()+w).split(k),e=/([.?@])?(.*)/.exec(i);a.push({type:1,index:s,name:e[2],strings:t,ctor:"."===e[1]?Q:"?"===e[1]?tt:"@"===e[1]?et:G})}else a.push({type:6,index:s})}for(const e of t)r.removeAttribute(e)}if(M.test(r.tagName)){const t=r.textContent.split(k),e=t.length-1;if(e>0){r.textContent=b?b.emptyScript:"";for(let i=0;i<e;i++)r.append(t[i],C()),V.nextNode(),a.push({type:2,index:++s});r.append(t[e],C())}}}else if(8===r.nodeType)if(r.data===S)a.push({type:2,index:s});else{let t=-1;for(;-1!==(t=r.data.indexOf(k,t+1));)a.push({type:7,index:s}),t+=k.length-1}s++}}static createElement(t,e){const i=x.createElement("template");return i.innerHTML=t,i}}function K(t,e,i=t,r){var s,o,n,a;if(e===z)return e;let l=void 0!==r?null===(s=i._$Co)||void 0===s?void 0:s[r]:i._$Cl;const d=P(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==d&&(null===(o=null==l?void 0:l._$AO)||void 0===o||o.call(l,!1),void 0===d?l=void 0:(l=new d(t),l._$AT(t,i,r)),void 0!==r?(null!==(n=(a=i)._$Co)&&void 0!==n?n:a._$Co=[])[r]=l:i._$Cl=l),void 0!==l&&(e=K(t,l._$AS(t,e.values),l,r)),e}class Y{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:r}=this._$AD,s=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:x).importNode(i,!0);V.currentNode=s;let o=V.nextNode(),n=0,a=0,l=r[0];for(;void 0!==l;){if(n===l.index){let e;2===l.type?e=new Z(o,o.nextSibling,this,t):1===l.type?e=new l.ctor(o,l.name,l.strings,this,t):6===l.type&&(e=new it(o,this,t)),this._$AV.push(e),l=r[++a]}n!==(null==l?void 0:l.index)&&(o=V.nextNode(),n++)}return V.currentNode=x,s}v(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Z{constructor(t,e,i,r){var s;this.type=2,this._$AH=L,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=r,this._$Cp=null===(s=null==r?void 0:r.isConnected)||void 0===s||s}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=K(this,t,e),P(t)?t===L||null==t||""===t?(this._$AH!==L&&this._$AR(),this._$AH=L):t!==this._$AH&&t!==z&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):(t=>D(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==L&&P(this._$AH)?this._$AA.nextSibling.data=t:this.$(x.createTextNode(t)),this._$AH=t}g(t){var e;const{values:i,_$litType$:r}=t,s="number"==typeof r?this._$AC(t):(void 0===r.el&&(r.el=J.createElement(q(r.h,r.h[0]),this.options)),r);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===s)this._$AH.v(i);else{const t=new Y(s,this),e=t.u(this.options);t.v(i),this.$(e),this._$AH=t}}_$AC(t){let e=B.get(t.strings);return void 0===e&&B.set(t.strings,e=new J(t)),e}T(t){D(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,r=0;for(const s of t)r===e.length?e.push(i=new Z(this.k(C()),this.k(C()),this,this.options)):i=e[r],i._$AI(s),r++;r<e.length&&(this._$AR(i&&i._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class G{constructor(t,e,i,r,s){this.type=1,this._$AH=L,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=L}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,r){const s=this.strings;let o=!1;if(void 0===s)t=K(this,t,e,0),o=!P(t)||t!==this._$AH&&t!==z,o&&(this._$AH=t);else{const r=t;let n,a;for(t=s[0],n=0;n<s.length-1;n++)a=K(this,r[i+n],e,n),a===z&&(a=this._$AH[n]),o||(o=!P(a)||a!==this._$AH[n]),a===L?t=L:t!==L&&(t+=(null!=a?a:"")+s[n+1]),this._$AH[n]=a}o&&!r&&this.j(t)}j(t){t===L?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class Q extends G{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===L?void 0:t}}const X=b?b.emptyScript:"";class tt extends G{constructor(){super(...arguments),this.type=4}j(t){t&&t!==L?this.element.setAttribute(this.name,X):this.element.removeAttribute(this.name)}}class et extends G{constructor(t,e,i,r,s){super(t,e,i,r,s),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=K(this,t,e,0))&&void 0!==i?i:L)===z)return;const r=this._$AH,s=t===L&&r!==L||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,o=t!==L&&(r===L||s);s&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){K(this,t)}}const rt=_.litHtmlPolyfillSupport;var st,ot;null==rt||rt(J,Z),(null!==(f=_.litHtmlVersions)&&void 0!==f?f:_.litHtmlVersions=[]).push("2.8.0");class nt extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var r,s;const o=null!==(r=null==i?void 0:i.renderBefore)&&void 0!==r?r:e;let n=o._$litPart$;if(void 0===n){const t=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:null;o._$litPart$=n=new Z(e.insertBefore(C(),t),t,void 0,null!=i?i:{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return z}}nt.finalized=!0,nt._$litElement$=!0,null===(st=globalThis.litElementHydrateSupport)||void 0===st||st.call(globalThis,{LitElement:nt});const at=globalThis.litElementPolyfillSupport;null==at||at({LitElement:nt}),(null!==(ot=globalThis.litElementVersions)&&void 0!==ot?ot:globalThis.litElementVersions=[]).push("3.3.3");const lt=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(i){i.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}};function dt(t){return(e,i)=>void 0!==i?((t,e,i)=>{e.constructor.createProperty(i,t)})(t,e,i):lt(t,e)}function ct(t){return dt({...t,state:!0})}var ht;null===(ht=window.HTMLSlotElement)||void 0===ht||ht.prototype.assignedElements;var ut=function(t,e,i,r){var s,o=arguments.length,n=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(o<3?s(n):o>3?s(e,i,n):s(e,i))||n);return o>3&&n&&Object.defineProperty(e,i,n),n};let pt=class extends nt{static getMetaConfig(){return{version:"1.0.5",controlName:"neo-scheduler",fallbackDisableSubmit:!1,description:"Schedule viewer control for displaying work items in a weekly calendar view",iconUrl:"schedule",groupName:"NEO",properties:{scheduleData:{type:"string",title:"Schedule Data",description:"JSON string containing schedule data with work items"},value:{type:"string",title:"Selected Items",description:"JSON string of selected work items",isValueField:!0}},standardProperties:{fieldLabel:!0,description:!0}}}static get styles(){return a`
      :host {
        display: block;
        font-family: var(--font-family, sans-serif);
        --primary-color: #007acc;
        --background-color: #f8f9fa;
        --border-color: #dee2e6;
        --text-color: #333;
        --hover-color: #e9ecef;
      }
      
      .scheduler-container {
        border: 1px solid var(--border-color);
        border-radius: 8px;
        background: white;
        overflow: hidden;
      }
      
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        background: var(--background-color);
        border-bottom: 1px solid var(--border-color);
      }
      
      .week-picker {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .week-picker button {
        background: none;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        padding: 0.25rem 0.5rem;
        cursor: pointer;
        font-size: 14px;
        color: var(--text-color);
        transition: background-color 0.2s;
      }
      
      .week-picker button:hover {
        background: var(--hover-color);
      }
      
      .week-picker button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .current-week {
        font-weight: 600;
        color: var(--text-color);
        min-width: 200px;
        text-align: center;
      }
      
      .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        border-top: 1px solid var(--border-color);
      }
      
      .day-header {
        padding: 0.75rem 0.5rem;
        text-align: center;
        font-weight: 600;
        background: var(--background-color);
        border-right: 1px solid var(--border-color);
        border-bottom: 1px solid var(--border-color);
        color: var(--text-color);
        font-size: 14px;
      }
      
      .day-header:last-child {
        border-right: none;
      }
      
      .day-column {
        border-right: 1px solid var(--border-color);
        min-height: 200px;
        padding: 0.5rem;
        background: white;
      }
      
      .day-column:last-child {
        border-right: none;
      }
      
      .work-item {
        background: var(--primary-color);
        color: white;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        line-height: 1.3;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      
      .work-item:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      
      .work-item.selected {
        background: #28a745;
        box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.3);
      }
      
      .work-item.priority-high {
        background: #dc3545;
      }
      
      .work-item.priority-medium {
        background: #ffc107;
        color: #000;
      }
      
      .work-item.priority-low {
        background: #6c757d;
      }
      
      .item-title {
        font-weight: 600;
        margin-bottom: 0.25rem;
      }
      
      .item-time {
        font-size: 11px;
        opacity: 0.9;
      }
      
      .item-duration {
        font-size: 11px;
        opacity: 0.8;
        margin-top: 0.25rem;
      }
      
      .empty-day {
        color: #6c757d;
        font-style: italic;
        text-align: center;
        padding: 2rem 0.5rem;
        font-size: 14px;
      }
      
      .stats {
        padding: 0.75rem 1rem;
        background: var(--background-color);
        border-top: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        color: var(--text-color);
      }
    `}constructor(){super(),this.value="",this.scheduleData="",this.currentWeek=new Date,this.workItems=[],this.currentWeek=this.getStartOfWeek(new Date),this.loadSampleData()}connectedCallback(){super.connectedCallback(),this.scheduleData&&this.parseScheduleData(this.scheduleData)}getStartOfWeek(t){const e=new Date(t),i=e.getDay(),r=e.getDate()-i+(0===i?-6:1);return new Date(e.setDate(r))}formatWeekRange(t){const e=new Date(t);e.setDate(t.getDate()+6);const i={month:"short",day:"numeric"};return`${t.toLocaleDateString("en-US",i)} - ${e.toLocaleDateString("en-US",i)}, ${t.getFullYear()}`}getDaysOfWeek(){return["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]}getItemsForDay(t){return this.workItems.filter(e=>e.day===t)}parseScheduleData(t){try{const e=JSON.parse(t);this.workItems=e.items||[],e.week&&(this.currentWeek=new Date(e.week)),this.requestUpdate()}catch(t){console.error("Error parsing schedule data:",t),this.workItems=[]}}loadSampleData(){this.currentWeek.toISOString().split("T")[0];this.workItems=[{id:1,title:"Project Review",description:"Review quarterly project status",day:"Monday",time:"09:00",duration:60,priority:"high",category:"meetings"},{id:2,title:"Client Meeting",description:"Discuss project requirements",day:"Tuesday",time:"14:00",duration:90,priority:"high",category:"meetings"},{id:3,title:"Code Review",description:"Review pull requests",day:"Wednesday",time:"10:30",duration:45,priority:"medium",category:"development"},{id:4,title:"Sprint Planning",description:"Plan next sprint activities",day:"Thursday",time:"15:00",duration:120,priority:"high",category:"planning"},{id:5,title:"Documentation",description:"Update project documentation",day:"Friday",time:"11:00",duration:180,priority:"low",category:"documentation"},{id:6,title:"Team Standup",description:"Daily team synchronization",day:"Monday",time:"09:30",duration:15,priority:"medium",category:"meetings"},{id:7,title:"Bug Fixes",description:"Fix reported issues",day:"Wednesday",time:"14:00",duration:90,priority:"high",category:"development"}]}render(){const t=this.formatWeekRange(this.currentWeek),e=this.getDaysOfWeek(),i=this.workItems.length,r=this.workItems.filter(t=>"high"===t.priority).length;return j`
      <div class="scheduler-container">
        <div class="header">
          <div class="week-picker">
            <button @click=${this.previousWeek} title="Previous Week">‹</button>
            <div class="current-week">${t}</div>
            <button @click=${this.nextWeek} title="Next Week">›</button>
          </div>
          <button @click=${this.goToCurrentWeek} title="Go to Current Week">Today</button>
        </div>
        
        <div class="calendar-grid">
          ${e.map(t=>j`
            <div class="day-header">${t}</div>
          `)}
          
          ${e.map(t=>this.renderDayColumn(t))}
        </div>
        
        <div class="stats">
          <span>Total Items: ${i}</span>
          <span>High Priority: ${r}</span>
        </div>
      </div>
    `}renderDayColumn(t){const e=this.getItemsForDay(t);return j`
      <div class="day-column">
        ${e.length>0?e.map(t=>this.renderWorkItem(t)):j`<div class="empty-day">No items</div>`}
      </div>
    `}renderWorkItem(t){const e=`${Math.floor(t.duration/60)}h ${t.duration%60}m`,i=t.priority?`priority-${t.priority}`:"";return j`
      <div 
        class="work-item ${i}"
        @click=${()=>this.selectItem(t)}
        title="${t.description||t.title}"
      >
        <div class="item-title">${t.title}</div>
        <div class="item-time">${t.time}</div>
        <div class="item-duration">${e}</div>
      </div>
    `}previousWeek(){const t=new Date(this.currentWeek);t.setDate(t.getDate()-7),this.currentWeek=t,this.requestUpdate()}nextWeek(){const t=new Date(this.currentWeek);t.setDate(t.getDate()+7),this.currentWeek=t,this.requestUpdate()}goToCurrentWeek(){this.currentWeek=this.getStartOfWeek(new Date),this.requestUpdate()}selectItem(t){const e={selectedItem:t,week:this.currentWeek.toISOString().split("T")[0],timestamp:(new Date).toISOString()};this._updateValue(JSON.stringify(e))}_updateValue(t){this.value=t;const e=new CustomEvent("ntx-value-change",{bubbles:!0,cancelable:!1,composed:!0,detail:t});this.dispatchEvent(e)}};var vt;ut([dt({type:String})],pt.prototype,"value",void 0),ut([dt({type:String})],pt.prototype,"scheduleData",void 0),ut([ct()],pt.prototype,"currentWeek",void 0),ut([ct()],pt.prototype,"workItems",void 0),pt=ut([(vt="neo-scheduler",t=>"function"==typeof t?((t,e)=>(customElements.define(t,e),e))(vt,t):((t,e)=>{const{kind:i,elements:r}=e;return{kind:i,elements:r,finisher(e){customElements.define(t,e)}}})(vt,t))],pt);var mt=window;for(var yt in e)mt[yt]=e[yt];e.__esModule&&Object.defineProperty(mt,"__esModule",{value:!0})})();