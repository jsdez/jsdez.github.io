import { LitElement, html, css } from 'lit';

export class neoTable extends LitElement {

  static get properties() {
    return {
      errorMessage: { type: String },
      dataobject: '',
      columnsSchema: '',
      prefDateFormat: '',
      pageItemLimit: { type: Number },
      currentPage: { type: Number },
      itemsPerPage: { type: Number },
    };
  }

  static getMetaConfig() {
    return {
      controlName: 'neo-data-viewer',
      fallbackDisableSubmit: false,
      description: 'Display object as a table',
      iconUrl: "group-control",
      groupName: 'Visual Data',
      version: '1.8',
      properties: {
        dataobject: {
          type: 'string',
          title: 'Object',
          description: 'JSON data variable'
        },
        columnsSchema: {
          type: 'string',
          title: 'Columns Schema',
          description: 'Array of objects to control order, visibility, renaming, and formatting. [{"key":"field","title":"Display Name","type":"string","format":"currency","description":"desc","visible":true}]'
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

  constructor() {
    super();
    this.dataobject = '';
    this.columnsSchema = '';
    this.prefDateFormat = '';
    this.pageItemLimit = "5";
    this.currentPage = 1;
    this.errorMessage = '';
    this._expandedMap = new Map(); // Use Map with path keys
    this._showDebug = false; // Track debug area toggle
  }

  toggleDebugArea() {
    this._showDebug = !this._showDebug;
    this.requestUpdate();
  }

  preprocessDoubleEscapedJson(jsonString) {
    // Replace double-escaped sequences with single-escaped sequences
    let normalizedJsonString = jsonString.replace(/\\\\/g, '\\');
    normalizedJsonString = normalizedJsonString.replace(/&quot;/ig, '"');

    // Normalize the key names by removing extra spaces after colons in the keys
    normalizedJsonString = normalizedJsonString.replace(/:\\"/g, ': \\"');

    return normalizedJsonString;
  }

  parseDataObject() {
    let data;
    this.errorMessage = '';

    // Check if dataobject is empty or undefined
    if (!this.dataobject) {
      console.error("No JSON data provided.");
      return null;
    }

    try {
      // Preprocess the JSON string to handle double escaping and normalize key names
      const processedData = this.preprocessDoubleEscapedJson(this.dataobject);
      data = JSON.parse(processedData);

      // Additional check if data is still a string indicating further encoding
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }

      data = this.replaceUnicodeRegex(data); // Apply Unicode replacements
    } catch (e) {
      this.errorMessage = "Error parsing JSON data.";
      console.error(this.errorMessage, e);
      data = null;
    }

    return data;
  }

  parseColumnsSchema() {
    if (!this.columnsSchema) return [];
    try {
      const arr = typeof this.columnsSchema === 'string' ? JSON.parse(this.columnsSchema) : this.columnsSchema;
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      console.error('Invalid columnsSchema JSON:', e);
      return [];
    }
  }

  replaceUnicodeRegex(input) {
    const unicodeRegex = /_x([0-9A-F]{4})_/g;
    return JSON.parse(JSON.stringify(input).replace(unicodeRegex, (match, p1) => String.fromCharCode(parseInt(p1, 16))));
  }

  changePage(newPage) {
    if (newPage > 0 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.requestUpdate();
    }
  }

  toggleRow(path) {
    const current = this._expandedMap.get(path) || false;
    this._expandedMap.set(path, !current);
    this.requestUpdate();
  }

  renderField(field, path = '') {
    if (Array.isArray(field)) {
      const expanded = this._expandedMap.get(path) || false;
      return html`
        <div>
          <button class="btn btn-sm btn-outline-secondary mb-1" @click="${() => this.toggleRow(path)}" type="button">
            ${expanded ? '−' : '+'} Array [${field.length}]
          </button>
          ${expanded ? html`
            <div class="ms-3">
              <table class="table table-bordered table-sm">
                <tbody>
                  ${field.map((item, idx) => html`
                    <tr>
                      <td>${this.renderField(item, path + '.' + idx)}</td>
                    </tr>
                  `)}
                </tbody>
              </table>
            </div>
          ` : ''}
        </div>
      `;
    } else if (typeof field === 'object' && field !== null) {
      const expanded = this._expandedMap.get(path) || false;
      return html`
        <div>
          <button class="btn btn-sm btn-outline-secondary mb-1" @click="${() => this.toggleRow(path)}" type="button">
            ${expanded ? '−' : '+'} Object
          </button>
          ${expanded ? html`
            <div class="ms-3">
              <table class="table table-bordered table-sm">
                <tbody>
                  ${Object.entries(field).map(([key, value]) => html`
                    <tr>
                      <th class="text-nowrap">${key}</th>
                      <td>${this.renderField(value, path + '.' + key)}</td>
                    </tr>
                  `)}
                </tbody>
              </table>
            </div>
          ` : ''}
        </div>
      `;
    } else {
      return field !== null ? field : '-';
    }
  }
  
  render() {
    const data = this.parseDataObject();
    const columnsSchema = this.parseColumnsSchema();
    if (this.errorMessage) {
      return html`<p class="error-message">${this.errorMessage}</p>`;
    }
    if (!data || data.length === 0) {
      return html`
        <div class="alert alert-secondary" role="alert">
          No Data Found
        </div>
      `;
    }
    const startIndex = (this.currentPage - 1) * parseInt(this.pageItemLimit, 10);
    const endIndex = startIndex + parseInt(this.pageItemLimit, 10);
    const paginatedData = data.slice(startIndex, endIndex);
    const totalPages = Math.ceil(data.length / parseInt(this.pageItemLimit, 10));
    this.totalPages = totalPages;
    const maxPagesToShow = 5;
    const pageRange = Math.min(totalPages, maxPagesToShow);
    let startPage = Math.max(1, this.currentPage - Math.floor(pageRange / 2));
    const endPage = Math.min(totalPages, startPage + pageRange - 1);
    if (endPage - startPage + 1 < pageRange) {
      startPage = Math.max(1, endPage - pageRange + 1);
    }

    // Only render top-level keys in schema, in order, and visible
    const mainSchema = columnsSchema.filter(col => col.visible !== false && col.type !== 'array');
    const arraySchema = columnsSchema.find(col => col.visible !== false && col.type === 'array');

    return html`
      <style>
        .json-debug-area {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.95em;
          margin-top: 1em;
          padding: 1em;
          max-height: 300px;
          overflow: auto;
        }
      </style>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
      <div class="table-responsive-md overflow-auto">
        <table class="neo-table table table-striped">
          <thead>
            <tr>
              ${mainSchema.map(col => html`<th title="${col.description || ''}">${col.title || col.key}</th>`)}
            </tr>
          </thead>
          <tbody>
            ${paginatedData.map((row, rowIdx) => html`
              <tr>
                ${mainSchema.map(col => {
                  // Address special format
                  if (col.format === 'formatted_address') {
                    return html`<td>${row[col.key]?.formatted_address ?? '-'}</td>`;
                  }
                  // Currency prefix
                  if (col.format === 'currency' && col.prefix) {
                    return html`<td>${col.prefix}${row[col.key] ?? '-'}</td>`;
                  }
                  return html`<td>${row[col.key] ?? '-'}</td>`;
                })}
              </tr>
              ${arraySchema && Array.isArray(row[arraySchema.key]) && arraySchema.visible !== false ? html`
                <tr>
                  <td colspan="${mainSchema.length}">
                    <div><b>${arraySchema.title || arraySchema.key}</b></div>
                    <table class="table table-bordered table-sm mb-0">
                      <thead>
                        <tr>
                          ${(arraySchema.items || []).filter(item => item.visible !== false).map(item => html`<th title="${item.description || ''}">${item.title || item.key}</th>`)}
                        </tr>
                      </thead>
                      <tbody>
                        ${row[arraySchema.key].map((item, idx) => html`
                          <tr>
                            ${(arraySchema.items || []).filter(col => col.visible !== false).map(col => html`<td>${item[col.key] ?? '-'}</td>`)}
                          </tr>
                        `)}
                      </tbody>
                    </table>
                  </td>
                </tr>
              ` : ''}
            `)}
          </tbody>
        </table>
      </div>
      <div class="row">
        ${totalPages > 1 ? html`
          <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
              <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link page-txt-link" href="#" @click="${() => this.changePage(1)}">First</a>
              </li>
              <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link page-txt-link" href="#" @click="${() => this.changePage(this.currentPage - 1)}">Previous</a>
              </li>
              ${Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage).map(page => html`
                <li class="page-item ${page === this.currentPage ? 'active' : ''}">
                  <a class="page-link page-num-link" href="#" @click="${() => this.changePage(page)}">${page}</a>
                </li>
              `)}
              <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link page-txt-link" href="#" @click="${() => this.changePage(this.currentPage + 1)}">Next</a>
              </li>
              <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link page-txt-link" href="#" @click="${() => this.changePage(totalPages)}">Last</a>
              </li>
            </ul>
          </nav>
        ` : ''}
      </div>
      <div class="mt-3">
        <button class="btn btn-sm btn-outline-info mb-2" type="button" @click="${() => this.toggleDebugArea()}">
          ${this._showDebug ? 'Hide' : 'Show'} JSON Debug
        </button>
        ${this._showDebug ? html`
          <div class="json-debug-area">
            <pre>${JSON.stringify(data, null, 2)}</pre>
          </div>
        ` : ''}
      </div>
    `;
  }

}

customElements.define('neo-data-viewer', neoTable);
