import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  TableController,
} from '@tanstack/lit-table';

class RSViewer extends LitElement {
  static getMetaConfig() {
    return {
      controlName: 'neo-rs-viewer',
      fallbackDisableSubmit: false,
      description: 'Repeating Section Table Viewer',
      iconUrl: 'repeating-section',
      groupName: 'NEO',
      version: '1.0',
      properties: {
        RSobject: {
          type: 'object',
          title: 'Repeating Section Object',
          description: 'Insert the repeating section object you wish to render'
        },
        removeKeys: {
            type: 'string',
            title: 'Remove Columns',
            description: 'Use a comma separated list of key names to exclude them from the table'
          },
        replaceKeys: {
          type: 'string',
          title: 'Rename Columns',
          description: 'Store the output of the rename generator as a variable and insert here'
        },
        pageItemLimit: {
          type: 'string',
          enum: ['5', '10', '15', '30', '50', '100'],
          title: 'Page Item Limit',
          description: 'Number of items to show per page',
          defaultValue: '5',
        }
      },
      events: ["ntx-value-change"],
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
    pageItemLimit: { type: String },
  };

  static get styles() {
    return css`
      :host {
        display: block;
      }
      table {
        border-collapse: collapse;
        width: 100%;
        border: 1px solid lightgray;
      }
      th, td {
        border: 1px solid lightgray;
        padding: 4px;
      }
      th {
        background-color: #f5f5f5;
      }
    `;
  }

  constructor() {
    super();
    // Initialize properties based on the meta config defaults or set to empty
    this.RSobject = null;
    this.removeKeys = '';
    this.replaceKeys = '';
    this.pageItemLimit = '5'; // Default value from meta config
    this.tableController = new TableController(this);
  }

  set RSobject(value) {
    this._RSobject = value;
    console.log('RSobject changed:', this._RSobject);  // Logs the object whenever it's updated
    this.requestUpdate();  // Ensures that the component re-renders if needed
  }

  get RSobject() {
    return this._RSobject;
  }

  getParsedData() {
    console.log('Raw data received:', this.RSobject);
    // Start processing the data recursively
    return this.recursiveParse(this.RSobject);
  }
  
  recursiveParse(data) {
    if (Array.isArray(data)) {
      // If it's an array, iterate over each item
      return data.map(item => this.recursiveParse(item));
    }
  
    if (typeof data === 'object' && data !== null) {
      // If it's an object, process each key recursively
      const result = {};
      for (const [key, value] of Object.entries(data)) {
        result[key] = this.recursiveParse(value);
      }
      return result;
    }
  
    // Return primitive values as is (string, number, etc.)
    return data;
  }
  
  render() {
    const data = this.getParsedData();
    if (!Array.isArray(data) || data.length === 0) {
      return html`<p>No data available</p>`;
    }

    const columnHelper = createColumnHelper();
    const columns = Object.keys(data[0]).map(key =>
      columnHelper.accessor(key, {
        header: () => html`<span>${key}</span>`,
        cell: info => info.getValue(),
      })
    );

    const table = this.tableController.table({
      columns,
      data,
      getCoreRowModel: getCoreRowModel(),
    });

    return html`
      <table>
        <thead>
          ${repeat(
            table.getHeaderGroups(),
            headerGroup => headerGroup.id,
            headerGroup => html`
              <tr>
                ${repeat(
                  headerGroup.headers,
                  header => header.id,
                  header => html`
                    <th>
                      ${flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  `
                )}
              </tr>
            `
          )}
        </thead>
        <tbody>
          ${repeat(
            table.getRowModel().rows,
            row => row.id,
            row => html`
              <tr>
                ${repeat(
                  row.getVisibleCells(),
                  cell => cell.id,
                  cell => html`
                    <td>
                      ${flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  `
                )}
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }

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
        console.error("Error parsing removeKeys:", error);
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
            if (newKey !== key) delete item[key]; // Remove old key if it was renamed
          }
        }
      } catch (error) {
        console.error("Error parsing replaceKeys:", error);
      }
    }

    return data;
  }

  renderNestedObject(obj, parentKey = '') {
    return html`
      ${Object.keys(obj).map(key => {
        const newKey = parentKey ? `${parentKey}.${key}` : key;
        const value = obj[key];
  
        // Check if the value is an array
        if (Array.isArray(value)) {
          if (value.length === 0) {
            return html`
              <tr>
                <td><strong>${newKey} (Empty Array)</strong></td>
                <td>No items in the array</td>
              </tr>
            `;
          }
          // If the value is an array and not empty, process it
          return html`
            <tr>
              <td colspan="2"><strong>${newKey} (Array)</strong></td>
            </tr>
            ${value.map((item, index) => {
              return html`
                <tr>
                  <td colspan="2"><strong>Item ${index + 1}</strong></td>
                </tr>
                ${this.renderNestedObject(item, `${newKey}[${index}]`)}
              `;
            })}
          `;
        }
  
        // Check if the value is an object (and not null or an array)
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          return html`
            <tr>
              <td colspan="2"><strong>${newKey}</strong></td>
            </tr>
            ${this.renderNestedObject(value, newKey)}
          `;
        }
  
        // If it's a primitive value (string, number, etc.), render it
        return html`
          <tr>
            <td><strong>${newKey}</strong></td>
            <td>${value || 'N/A'}</td>
          </tr>
        `;
      })}
    `;
  }
}

customElements.define('neo-rs-viewer', RSViewer);
