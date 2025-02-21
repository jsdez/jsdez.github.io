import { LitElement, html, css } from 'lit';

class TabsElement extends LitElement {
  static getMetaConfig() {
    return {
      controlName: 'neo-tabs',
      fallbackDisableSubmit: false,
      description: '',
      iconUrl: "",
      groupName: 'NEO',
      version: '1.0',
      properties: {
        tabs: { type: 'string', title: 'All Tabs', description: 'Insert a list of tabs to display' },
        hidetabs: { type: 'string', title: 'Hide Tabs', description: 'List of tabs to hide' },
        disabletabs: { type: 'string', title: 'Disable Tabs', description: 'List of tabs to disable' },
        defaulttab: { type: 'string', title: 'Default Tab', description: 'Default selected tab' },
        currenttab: { type: 'string', title: 'Current Tab', description: 'Currently active tab', isValueField: true },
      },
      events: ['ntx-value-change'],
      standardProperties: { fieldLabel: true, description: true },
    };
  }

  static properties = {
    tabs: { type: Array },
    hidetabs: { type: Array },
    disabletabs: { type: Array },
    defaulttab: { type: String },
    currenttab: { type: String },
  };

  constructor() {
    super();
    this.tabs = [];
    this.hidetabs = [];
    this.disabletabs = [];
    this.defaulttab = '';
    this.currenttab = '';
  }

  firstUpdated() {
    this.processProperties();
  }

  updated(changedProperties) {
    if (['tabs', 'hidetabs', 'disabletabs', 'defaulttab'].some(prop => changedProperties.has(prop))) {
      this.processProperties();
    }
  }

  processProperties() {
    this.tabs = this.parseList(this.tabs);
    this.hidetabs = this.parseList(this.hidetabs);
    this.disabletabs = this.parseList(this.disabletabs);

    // Remove duplicates
    this.tabs = [...new Set(this.tabs)];
    this.hidetabs = [...new Set(this.hidetabs)];
    this.disabletabs = [...new Set(this.disabletabs)];

    if (this.defaulttab && this.tabs.includes(this.defaulttab)) {
      this.setCurrentTab(this.defaulttab);
    }
  }

  parseList(value) {
    if (!value) return [];

    let str = String(value).trim();
    try {
      if (str.startsWith("[") && str.endsWith("]")) {
        const parsedArray = JSON.parse(str.replace(/'/g, '"'));
        if (Array.isArray(parsedArray)) {
          return [...new Set(parsedArray.map(item => item.trim()))];
        }
      }
    } catch (error) {
      console.warn("Failed to parse JSON-like array:", error);
    }

    const separators = [",", ";"];
    for (let separator of separators) {
      if (str.includes(separator)) {
        return [...new Set(str.split(separator).map(item => item.trim()))];
      }
    }

    return [str];
  }

  setCurrentTab(tab) {
    this.currenttab = tab;
    this.dispatchEvent(new CustomEvent('ntx-value-change', { detail: { value: tab } }));
  }

  render() {
    return html`
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      <ul class="nav nav-tabs">
        ${this.tabs.filter(tab => !this.hidetabs.includes(tab)).map(tab => html`
          <li class="nav-item">
            <button 
              class="nav-link ${this.currenttab === tab ? 'active' : ''}"
              ?disabled="${this.disabletabs.includes(tab)}"
              @click="${() => this.setCurrentTab(tab)}"
            >
              ${tab}
            </button>
          </li>
        `)}
      </ul>
      <div class="tab-content">
        ${this.currenttab ? html`<div class="tab-pane active">${this.currenttab} Content</div>` : ''}
      </div>
    `;
  }
}

customElements.define('neo-tabs', TabsElement);
