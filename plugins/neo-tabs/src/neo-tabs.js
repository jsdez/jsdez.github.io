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
    // New properties for processed arrays
    this.processedTabs = [];
    this.processedHideTabs = [];
    this.processedDisableTabs = [];
  }

  firstUpdated() {
    this.processProperties();
  }

  processProperties() {
    this.processedTabs = this.processValueToArray(this.tabs);
    this.processedHideTabs = this.processValueToArray(this.hidetabs);
    this.processedDisableTabs = this.processValueToArray(this.disabletabs);
    
    // Remove duplicates from processed arrays
    this.processedTabs = [...new Set(this.processedTabs)];
    this.processedHideTabs = [...new Set(this.processedHideTabs)];
    this.processedDisableTabs = [...new Set(this.processedDisableTabs)];

    if (this.defaulttab && this.processedTabs.includes(this.defaulttab)) {
      this.setCurrentTab(this.defaulttab);
    }
  }

  // Method to process value strings into arrays
  processValueToArray(value) {
    if (!value || typeof value !== 'string') return [];
    
    // Try JSON parsing first, handling different formats
    try {
      let parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(v => v.toString().trim());
    } catch (e) {
      // Fallback to manual splitting
      return value.includes(';') 
        ? value.split(';').map(v => v.trim())
        : value.split(',').map(v => v.trim());
    }
    return [];
  }

  setCurrentTab(tab) {
    if (this.currenttab !== tab) {
      this.currenttab = tab;
      this.dispatchEvent(new CustomEvent('ntx-value-change', { detail: { value: tab } }));
    }
  }

  render() {
    return html`
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      <ul class="nav nav-tabs">
        ${this.processedTabs.filter(tab => !this.processedHideTabs.includes(tab)).map(tab => html`
          <li class="nav-item">
            <button 
              class="nav-link ${this.currenttab === tab ? 'active' : ''}"
              ?disabled=${this.processedDisableTabs.includes(tab)}
              @click=${() => this.setCurrentTab(tab)}
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
