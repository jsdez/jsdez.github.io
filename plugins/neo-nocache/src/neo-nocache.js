import { LitElement, html, css } from 'lit';

const CACHE_BUSTER_PARAMETER = '_neo_nocache';
const PAGE_STATE_KEY = '__neoNoCachePageState';
const SESSION_STORAGE_PREFIX = 'neo-nocache:';

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
          defaultValue: true,
          description: 'When enabled, runtime pages are loaded once through a verified cache-busting URL.',
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
    this.forceNoCache = true;
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
      this._forceFreshLoad({ fromBackForwardCache: true });
    }
  }

  _forceFreshLoad({ fromBackForwardCache = false } = {}) {
    const pageState = this._getPageState();
    const stateProperty = fromBackForwardCache
      ? 'backForwardRefreshScheduled'
      : 'initialLoadHandled';

    if (pageState[stateProperty]) {
      return;
    }

    pageState[stateProperty] = true;

    const currentUrl = new URL(window.location.href);
    const storageKey = this._getStorageKey(currentUrl);
    const currentMarker = currentUrl.searchParams.get(CACHE_BUSTER_PARAMETER);
    const sessionMarker = this._readSessionMarker(storageKey);

    // Only a marker created by this tab for this exact form URL is trusted. An
    // arbitrary or shared _neo_nocache parameter is replaced with a new nonce.
    // If session storage is unavailable, accept an existing marker after one
    // redirect so privacy-restricted browsers cannot enter a reload loop.
    if (
      !fromBackForwardCache
      && currentMarker
      && (!sessionMarker.available || currentMarker === sessionMarker.value)
    ) {
      this._removeSessionMarker(storageKey);
      return;
    }

    const nextMarker = this._createCacheBuster();
    this._writeSessionMarker(storageKey, nextMarker);
    currentUrl.searchParams.set(CACHE_BUSTER_PARAMETER, nextMarker);
    window.location.replace(currentUrl.toString());
  }

  _getPageState() {
    if (!window[PAGE_STATE_KEY]) {
      window[PAGE_STATE_KEY] = {
        initialLoadHandled: false,
        backForwardRefreshScheduled: false,
      };
    }

    return window[PAGE_STATE_KEY];
  }

  _getStorageKey(url) {
    const stableUrl = new URL(url.toString());
    stableUrl.searchParams.delete(CACHE_BUSTER_PARAMETER);
    stableUrl.hash = '';
    return `${SESSION_STORAGE_PREFIX}${stableUrl.toString()}`;
  }

  _createCacheBuster() {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  _readSessionMarker(key) {
    try {
      return {
        available: true,
        value: window.sessionStorage.getItem(key),
      };
    } catch (error) {
      return {
        available: false,
        value: null,
      };
    }
  }

  _writeSessionMarker(key, value) {
    try {
      window.sessionStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }

  _removeSessionMarker(key) {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      // Cache busting still works when session storage is unavailable; the
      // browser simply cannot remember that a generated marker was verified.
    }
  }
}

customElements.define('neo-nocache', NeoNocacheElement);
