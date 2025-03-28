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
        pageItemLimit: {
          type: 'string',
          enum: ['5', '10', '15', '30', '50', '100'],
          title: 'Page Item Limit',
          description: 'Number of items to show per page',
          defaultValue: '5',
        },
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
      th,
      td {
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
    this._processedData = null;
    this.removeKeys = '';
    this.replaceKeys = '';
    this.pageItemLimit = '5';
    this.tableController = new TableController(this);
  }

  set RSobject(value) {
    // Only update if the new value is different from the previous processed data
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

  render() {
    const data = this._processedData;
    if (!Array.isArray(data) || data.length === 0) {
      return html`<p>No data available</p>`;
    }

    const columnHelper = createColumnHelper();
    const columns = Object.keys(data[0]).map(key =>
      columnHelper.accessor(key, {
        header: () => html`<span>${key}</span>`,
        cell: info => {
          const value = info.getValue();
          return typeof value === 'object' 
            ? JSON.stringify(value) 
            : value;
        },
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
}

customElements.define('neo-rs-viewer', RSViewer);