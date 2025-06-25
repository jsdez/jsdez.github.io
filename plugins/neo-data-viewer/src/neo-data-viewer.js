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
      debugMode: { type: Boolean },
    };
  }

  static getMetaConfig() {
    return {
      controlName: 'neo-data-viewer',
      fallbackDisableSubmit: false,
      description: 'Display object as a table',
      iconUrl: "group-control",
      groupName: 'Visual Data',
      version: '1.9',
      properties: {
        dataobject: {
          type: 'string',
          title: 'Object',
          description: 'JSON data variable'
        },
        columnsSchema: {
          type: 'string',
          title: 'Columns Schema',
          description: 'Array of objects to control order, visibility, renaming, and formatting.'
        },
        pageItemLimit: {
          type: 'string',
          enum: ['5', '10', '15', '30', '50', '100'],
          title: 'Page Item Limit',
          description: 'Number of items to show per page',
          defaultValue: '5',
        },
        debugMode: {
          type: 'boolean',
          title: 'Debug Mode',
          description: 'Show or hide the JSON debug viewer',
          defaultValue: false
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
  
  // Helper to group columns into rows based on col sum (Bootstrap 12-grid)
  groupColumnsByRow(schema) {
    const rows = [];
    let currentRow = [];
    let currentSum = 0;
    for (const col of schema) {
      if (col.visible === false) continue;
      let colVal = col.col === undefined || col.col === 'auto' ? 0 : Number(col.col);
      if (colVal < 1 || colVal > 12) colVal = 0;
      if (currentSum + colVal > 12) {
        rows.push(currentRow);
        currentRow = [];
        currentSum = 0;
      }
      currentRow.push(col);
      currentSum += colVal;
    }
    if (currentRow.length) rows.push(currentRow);
    return rows;
  }

  copyToClipboard(text) {
    navigator.clipboard.writeText(text);
  }

  buildSchemaFromJson(json) {
    // Simple schema builder: only top-level keys, visible true, type string/array/number
    if (!json) return [];
    const row = Array.isArray(json) ? json[0] : json;
    if (!row || typeof row !== 'object') return [];
    return Object.entries(row).map(([key, value]) => {
      let type = 'string';
      if (Array.isArray(value)) type = 'array';
      else if (typeof value === 'number') type = 'number';
      else if (typeof value === 'boolean') type = 'boolean';
      return {
        key,
        title: key,
        type,
        visible: true,
        ...(type === 'array' ? { items: this.buildSchemaFromJson(value) } : {})
      };
    });
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
    const mainRows = this.groupColumnsByRow(mainSchema);

    return html`
      <style>
        .neo-table {
          border-radius: var(--ntx-form-theme-border-radius, 4px);
          background: var(--ntx-form-theme-color-form-background, #fff);
          color: var(--ntx-form-theme-color-input-text, #222);
          font-family: var(--ntx-form-theme-font-family, inherit);
          font-size: var(--ntx-form-theme-text-input-size, 1rem);
        }
        .neo-table th, .neo-table td {
          border: 1px solid var(--ntx-form-theme-color-border, #dee2e6);
          background: var(--ntx-form-theme-color-input-background, #f8f9fa);
          color: var(--ntx-form-theme-color-input-text, #222);
          padding: 0.5rem 0.75rem;
        }
        .neo-table th {
          background: var(--ntx-form-theme-color-page-background, #f4f4f4);
          color: var(--ntx-form-theme-color-secondary, #222);
          font-size: var(--ntx-form-theme-text-label-size, 1rem);
        }
        .neo-table tr {
          border-radius: var(--ntx-form-theme-border-radius, 4px);
        }
        .neo-table tbody tr:nth-child(even) td {
          background: var(--ntx-form-theme-color-form-background, #fff);
        }
        .neo-table tbody tr:nth-child(odd) td {
          background: var(--ntx-form-theme-color-input-background, #f8f9fa);
        }
        .neo-table .error-message {
          background: var(--ntx-form-theme-color-error, #ffe6e6);
          color: var(--ntx-form-theme-color-error, #b30000);
          border-radius: var(--ntx-form-theme-border-radius, 4px);
          padding: 0.5rem;
        }
        .json-debug-area {
          background: var(--ntx-form-theme-color-input-background, #f8f9fa);
          border: 1px solid var(--ntx-form-theme-color-border, #dee2e6);
          border-radius: var(--ntx-form-theme-border-radius, 4px);
          font-family: var(--ntx-form-theme-font-family, monospace);
          font-size: var(--ntx-form-theme-text-input-size, 0.95em);
          margin-top: 1em;
          padding: 1em;
          max-height: 300px;
          overflow: auto;
        }
        .neo-table b {
          color: var(--ntx-form-theme-color-secondary, #333);
        }
      </style>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
      <div class="table-responsive-md overflow-auto">
        <table class="neo-table table table-striped">
          <thead>
            ${mainRows.map(rowCols => html`<tr>${rowCols.map(col => html`<th title="${col.description || ''}">${col.title || col.key}</th>`)}</tr>`)}
          </thead>
          <tbody>
            ${paginatedData.map((row, rowIdx) => html`
              ${mainRows.map(rowCols => html`<tr>
                ${rowCols.map(col => {
                  let colStyle = '';
                  if (col.col && col.col !== 'auto') {
                    colStyle = `width: ${(col.col / 12) * 100}%`;
                  } else if (col.col === 'auto') {
                    colStyle = 'width: auto';
                  }
                  if (col.format === 'formatted_address') {
                    return html`<td style="${colStyle}">${row[col.key]?.formatted_address ?? '-'}</td>`;
                  }
                  if (col.format === 'currency' && col.prefix) {
                    return html`<td style="${colStyle}">${col.prefix}${row[col.key] ?? '-'}</td>`;
                  }
                  if (col.type === 'string' && col.format === 'longtext') {
                    const val = row[col.key] ?? '-';
                    return html`<td style="white-space:pre-line;${colStyle}">${val}</td>`;
                  }
                  return html`<td style="${colStyle}">${row[col.key] ?? '-'}</td>`;
                })}
              </tr>`)}
              ${arraySchema && Array.isArray(row[arraySchema.key]) && arraySchema.visible !== false ? html`
                <tr>
                  <td colspan="12">
                    <div><b>${arraySchema.title || arraySchema.key}</b></div>
                    <table class="table table-bordered table-sm mb-0">
                      <thead>
                        ${(() => {
                          const nestedRows = this.groupColumnsByRow((arraySchema.items || []).filter(item => item.visible !== false));
                          return nestedRows.map(rowCols => html`<tr>${rowCols.map(item => {
                            let colStyle = '';
                            if (item.col && item.col !== 'auto') {
                              colStyle = `width: ${(item.col / 12) * 100}%`;
                            } else if (item.col === 'auto') {
                              colStyle = 'width: auto';
                            }
                            return html`<th style="${colStyle}" title="${item.description || ''}">${item.title || item.key}</th>`;
                          })}</tr>`);
                        })()}
                      </thead>
                      <tbody>
                        ${row[arraySchema.key].map((item, idx) => {
                          const nestedRows = this.groupColumnsByRow((arraySchema.items || []).filter(col => col.visible !== false));
                          return nestedRows.map(rowCols => html`<tr>
                            ${rowCols.map(col => {
                              let colStyle = '';
                              if (col.col && col.col !== 'auto') {
                                colStyle = `width: ${(col.col / 12) * 100}%`;
                              } else if (col.col === 'auto') {
                                colStyle = 'width: auto';
                              }
                              return html`<td style="${colStyle}">${item[col.key] ?? '-'}</td>`;
                            })}
                          </tr>`);
                        })}
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
        ${this.debugMode ? html`
          <div class="json-debug-area" style="user-select:text;">
            <div class="d-flex mb-2 gap-2">
              <button class="btn btn-sm btn-outline-secondary" @click="${() => this.copyToClipboard(JSON.stringify(data, null, 2))}">Copy JSON</button>
              <button class="btn btn-sm btn-outline-secondary" @click="${() => this.copyToClipboard(JSON.stringify(this.buildSchemaFromJson(data)).replace(/"/g, '\\"'))}">Copy Schema</button>
            </div>
            <pre style="user-select:text;">${JSON.stringify(data, null, 2)}</pre>
            <div class="mt-2">
              <b>Edit Schema (auto-generated from input JSON):</b>
              <textarea style="width:100%;min-height:120px;font-family:monospace;" readonly>${JSON.stringify(this.buildSchemaFromJson(data), null, 2)}</textarea>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

}

customElements.define('neo-data-viewer', neoTable);
