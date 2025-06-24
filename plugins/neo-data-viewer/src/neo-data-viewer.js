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

    // Dynamically find all address and repeating section keys
    const firstRow = data[0] || {};
    const addressKeys = Object.keys(firstRow).filter(k => k.startsWith('se_address'));
    const repeatingKeys = Object.keys(firstRow).filter(k => k.startsWith('se_repeating_section'));
    // All other top-level keys (not repeating section)
    let mainKeys = Object.keys(firstRow).filter(k => !k.startsWith('se_repeating_section'));
    // Use columnsSchema for order, visibility, and renaming
    const mainSchema = columnsSchema.filter(col => mainKeys.includes(col.key) && col.visible !== false && !col.parent);

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
                  if (addressKeys.includes(col.key)) {
                    return html`<td>${row[col.key]?.formatted_address ?? '-'}</td>`;
                  } else if (col.type === 'array' && Array.isArray(row[col.key])) {
                    // Render nested array as a table using col.items
                    const nestedSchema = (col.items && Array.isArray(col.items)) ? col.items.filter(nc => nc.visible !== false) : [];
                    return html`<td>
                      <table class="table table-bordered table-sm mb-0">
                        <thead>
                          <tr>
                            ${nestedSchema.length > 0
                              ? nestedSchema.map(nc => html`<th title="${nc.description || ''}">${nc.title || nc.key}</th>`)
                              : Object.keys(row[col.key][0] || {}).map(subKey => html`<th>${subKey}</th>`)}
                          </tr>
                        </thead>
                        <tbody>
                          ${row[col.key].map((item, idx) => html`
                            <tr>
                              ${nestedSchema.length > 0
                                ? nestedSchema.map(nc => html`<td>${item[nc.key] ?? '-'}</td>`)
                                : Object.values(item).map(val => html`<td>${val}</td>`)}
                            </tr>
                          `)}
                        </tbody>
                      </table>
                    </td>`;
                  } else {
                    // Optionally format by col.type/col.format here
                    return html`<td>${row[col.key] ?? '-'}</td>`;
                  }
                })}
              </tr>
              ${repeatingKeys.map(repeatKey => {
                // Find schema for this repeating section
                const nestedSchema = columnsSchema.filter(col => col.parent === repeatKey && col.visible !== false);
                return html`
                  <tr>
                    <td colspan="${mainSchema.length}">
                      ${Array.isArray(row[repeatKey]) ?
                        (row[repeatKey].length > 0 ? html`
                          <table class="table table-bordered table-sm mb-0">
                            <thead>
                              <tr>
                                ${nestedSchema.length > 0
                                  ? nestedSchema.map(col => html`<th title="${col.description || ''}">${col.title || col.key}</th>`)
                                  : Object.keys(row[repeatKey][0] || {}).map(subKey => html`<th>${subKey}</th>`)}
                              </tr>
                            </thead>
                            <tbody>
                              ${row[repeatKey].map((item, idx) => html`
                                <tr>
                                  ${nestedSchema.length > 0
                                    ? nestedSchema.map(col => html`<td>${item[col.key] ?? '-'}</td>`)
                                    : Object.values(item).map(val => html`<td>${val}</td>`)}
                                </tr>
                              `)}
                            </tbody>
                          </table>
                        ` : html`<span class="text-muted">No work items</span>`)
                      : html`<span class="text-muted">-</span>`}
                    </td>
                  </tr>
                `;
              })}
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
