import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';

class RSViewer extends LitElement {
  static getMetaConfig() {
    return {
      controlName: 'neo-rs-viewer',
      fallbackDisableSubmit: false,
      description: 'Repeating Section Detailed Viewer',
      iconUrl: 'repeating-section',
      groupName: 'NEO',
      version: '1.1',
      properties: {
        RSobject: {
          type: 'object',
          title: 'Repeating Section Object',
          description: 'Insert the repeating section object you wish to render',
        },
        removeKeys: {
          type: 'string',
          title: 'Remove Columns',
          description: 'Use a comma separated list of key names to exclude them from the table',
        },
        replaceKeys: {
          type: 'string',
          title: 'Rename Columns',
          description: 'Store the output of the rename generator as a variable and insert here',
        },
        displayMode: {
          type: 'string',
          title: 'Display Mode',
          description: 'Choose how to display complex data',
          enum: ['detailed', 'compact'],
          defaultValue: 'detailed'
        }
      },
      events: ['ntx-value-change'],
      standardProperties: {
        fieldLabel: true,
        readOnly: true,
        required: true,
        description: true,
      },
    };
  }

  static properties = {
    RSobject: { type: Object },
    removeKeys: { type: String },
    replaceKeys: { type: String },
    displayMode: { type: String }
  };

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: Arial, sans-serif;
      }
      .data-container {
        border: 1px solid #e0e0e0;
        margin-bottom: 10px;
        padding: 10px;
      }
      .nested-section {
        margin-left: 20px;
        border-left: 2px solid #f0f0f0;
        padding-left: 10px;
      }
      .key {
        font-weight: bold;
        color: #333;
        margin-right: 10px;
      }
      .primitive-value {
        color: #666;
      }
      .array-marker {
        color: #999;
        font-style: italic;
      }
      .section-header {
        background-color: #f5f5f5;
        padding: 5px;
        font-weight: bold;
        border-bottom: 1px solid #e0e0e0;
      }
    `;
  }

  constructor() {
    super();
    this._processedData = null;
    this.removeKeys = '';
    this.replaceKeys = '';
    this.displayMode = 'detailed';
  }

  set RSobject(value) {
    if (!this.isDeepEqual(value, this._processedData)) {
      this._processedData = this.preprocessData(this.recursiveParse(value));
      this.requestUpdate();
    }
  }

  get RSobject() {
    return this._processedData;
  }

  // Deep equality check to prevent unnecessary updates
  isDeepEqual(obj1, obj2) {
    if (obj1 === obj2) return true;
    
    if (typeof obj1 !== 'object' || obj1 === null ||
        typeof obj2 !== 'object' || obj2 === null) {
      return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
      if (!keys2.includes(key)) return false;
      
      if (!this.isDeepEqual(obj1[key], obj2[key])) return false;
    }

    return true;
  }

  // Recursively parse data to handle nested objects and arrays
  recursiveParse(data) {
    if (Array.isArray(data)) {
      return data.map(item => this.recursiveParse(item));
    }

    if (typeof data === 'object' && data !== null) {
      const result = {};
      for (const [key, value] of Object.entries(data)) {
        result[key] = this.recursiveParse(value);
      }
      return result;
    }

    return data;
  }

  // Preprocess data to handle key removal and replacement
  preprocessData(data) {
    // Remove keys if removeKeys is defined
    if (this.removeKeys) {
      try {
        const keysToRemove = JSON.parse(this.removeKeys);
        for (const item of data) {
          for (const key of keysToRemove) {
            delete item[key];
          }
        }
      } catch (error) {
        console.error('Error parsing removeKeys:', error);
      }
    }

    // Replace keys if replaceKeys is defined
    if (this.replaceKeys) {
      try {
        const keysToReplace = JSON.parse(this.replaceKeys);
        for (const item of data) {
          for (const key of Object.keys(item)) {
            const newKey = keysToReplace[key] || key;
            item[newKey] = item[key];
            if (newKey !== key) delete item[key];
          }
        }
      } catch (error) {
        console.error('Error parsing replaceKeys:', error);
      }
    }

    return data;
  }

  // Render individual data value
  renderValue(value, key = '') {
    if (value === null || value === undefined) {
      return html`<span class="primitive-value">N/A</span>`;
    }

    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return html`
          <div class="array-marker">[Array with ${value.length} item(s)]</div>
          <div class="nested-section">
            ${value.map((item, index) => html`
              <div class="data-container">
                <div class="section-header">Item ${index + 1}</div>
                ${this.renderComplexObject(item)}
              </div>
            `)}
          </div>
        `;
      }
      return this.renderComplexObject(value);
    }

    return html`<span class="primitive-value">${value}</span>`;
  }

  // Render complex object recursively
  renderComplexObject(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return this.renderValue(obj);
    }

    return html`
      ${Object.entries(obj).map(([key, value]) => html`
        <div>
          <span class="key">${key}:</span>
          ${this.renderValue(value, key)}
        </div>
      `)}
    `;
  }

  render() {
    const data = this._processedData;
    if (!Array.isArray(data) || data.length === 0) {
      return html`<p>No data available</p>`;
    }

    return html`
      <div>
        ${data.map((item, index) => html`
          <div class="data-container">
            <div class="section-header">Record ${index + 1}</div>
            ${this.renderComplexObject(item)}
          </div>
        `)}
      </div>
    `;
  }
}

customElements.define('neo-rs-viewer', RSViewer);