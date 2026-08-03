import { LitElement, html, css } from 'lit';

class NeoNocacheElement extends LitElement {
  static getMetaConfig() {
    return {
      version: '1.0',
      controlName: 'neo-nocache',
      fallbackDisableSubmit: false,
      description: 'Forces a one-time cache-busting reload at runtime.',
      iconUrl: 'refresh',
      groupName: 'NEO',
      properties: {
        forceNoCache: {
          type: 'boolean',
          title: 'Force no cache',
          defaultValue: false,
          description: 'When enabled, runtime page reloads once with a cache-busting query parameter.',
        }
      },
      standardProperties: {
        fieldLabel: true,
        description: true,
      }
    };
  }

  static get properties() {
    return {
      forceNoCache: { type: Boolean },
      isDesignMode: { type: Boolean, state: true },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .design-hint {
        padding: 0.75rem;
        background-color: #f4f8ff;
        border: 1px solid #c6d8ff;
        border-radius: 4px;
        color: #1f3f83;
        font-size: 0.875rem;
      }
    `;
  }

  constructor() {
    super();
    this.forceNoCache = false;
    this.isDesignMode = false;
    this._onPageShow = this._onPageShow.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.isDesignMode = this._isDesignMode();

    if (this.isDesignMode || !this.forceNoCache) {
      return;
    }

    this._applyNoCacheMetaTags();
    this._addPageShowHandler();
    this._forceFreshLoad();
  }

  disconnectedCallback() {
    this._removePageShowHandler();
    super.disconnectedCallback();
  }

  updated(changedProperties) {
    if (changedProperties.has('forceNoCache') && this.forceNoCache && !this.isDesignMode) {
      this._applyNoCacheMetaTags();
      this._addPageShowHandler();
      this._forceFreshLoad();
    }
  }

  render() {
    if (!this.isDesignMode) {
      return html``;
    }

    return html`<div class="design-hint">No-cache reload is ${this.forceNoCache ? 'enabled' : 'disabled'}.</div>`;
  }

  _isDesignMode() {
    const currentUrl = window.location.href.toLowerCase();
    const isCloudRuntime = currentUrl.includes('/forms/');
    const isRuntime = isCloudRuntime || currentUrl.includes('ufruntime.aspx') || currentUrl.includes('/runtime');
    const isDesigner = currentUrl.includes('ufdesigner.aspx') || currentUrl.includes('/designer');

    return isDesigner && !isRuntime;
  }

  _applyNoCacheMetaTags() {
    this._upsertMetaTag('Cache-Control', 'no-cache, no-store, must-revalidate');
    this._upsertMetaTag('Pragma', 'no-cache');
    this._upsertMetaTag('Expires', '0');
  }

  _upsertMetaTag(httpEquiv, content) {
    let tag = document.querySelector(`meta[http-equiv="${httpEquiv}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('http-equiv', httpEquiv);
      document.head.appendChild(tag);
    }

    tag.setAttribute('content', content);
  }

  _addPageShowHandler() {
    if (this._pageShowHandlerAdded) {
      return;
    }

    window.addEventListener('pageshow', this._onPageShow);
    this._pageShowHandlerAdded = true;
  }

  _removePageShowHandler() {
    if (!this._pageShowHandlerAdded) {
      return;
    }

    window.removeEventListener('pageshow', this._onPageShow);
    this._pageShowHandlerAdded = false;
  }

  _onPageShow(event) {
    if (event.persisted && this.forceNoCache && !this.isDesignMode) {
      window.location.reload();
    }
  }

  _forceFreshLoad() {
    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.has('_neo_nocache')) {
      return;
    }

    currentUrl.searchParams.set('_neo_nocache', Date.now().toString());
    window.location.replace(currentUrl.toString());
  }
}

customElements.define('neo-nocache', NeoNocacheElement);
