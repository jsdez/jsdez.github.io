import { LitElement, html, css } from 'lit';

export class neoTable extends LitElement {

  static get properties() {
    return {
      errorMessage: { type: String },
    };
  }

  static getMetaConfig() {
    // plugin contract information
    return {
      controlName: 'neo-table-viewer',
      fallbackDisableSubmit: false,
      description: 'Display object as a table',
      iconUrl: "group-control",
      groupName: 'Visual Data',
      version: '1.6',
      properties: {
        dataobject: {
          type: 'string',
          title: 'Object',
          description: 'JSON or XML data variable'
        },
        datatype: {
          title: 'Object Data Type',
          type: 'string',
          enum: ['JSON', 'XML'],
          showAsRadio: true,
          verticalLayout: true,
          defaultValue: 'JSON',
        },
        removeKeys: {
            type: 'string',
            title: 'Remove keys JSON',
            description: 'Use key-values to remove columns e.g. {"keyName1": true,"keyName2": true}'
          },
        replaceKeys: {
          type: 'string',
          title: 'Rename keys JSON',
          description: 'Use key-value pairs to rename columns e.g. {"oldKey1":"newKey1","oldKey2":"newKey2"}'
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
    dataobject: '',
    datatype: '',
    removeKeys: '',
    replaceKeys: '',
    prefDateFormat: '',
    pageItemLimit: { type: Number },
    currentPage: { type: Number },
  };

  static get properties() {
    return {
      itemsPerPage: { type: Number },
      currentPage: { type: Number },
    };
  }

  constructor() {
    super();
    this.dataobject = '';
    this.removeKeys = '';
    this.replaceKeys = '';
    this.prefDateFormat = '';
    this.pageItemLimit = "5";
    this.currentPage = 1;
    this.errorMessage = '';
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

    if (!this.datatype) {
      this.errorMessage = "Object data type not configured, please update the plugin properties and specify the data type.";
      console.error(this.errorMessage);
      return null;
    }

    // Check if dataobject is empty or undefined
    if (!this.dataobject) {
      console.error("No JSON data provided.");
      return null;
    }

    if (this.datatype === 'JSON') {
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
    } else if (this.datatype === 'XML') {
      try {
        data = this.parseXmlDataObject();
      } catch (e) {
        this.errorMessage = "Error parsing XML data.";
        console.error(this.errorMessage, e);
        data = null;
      }
    } else {
      this.errorMessage = `Unsupported data type: ${this.datatype}.`;
      console.error(this.errorMessage);
      data = null;
    }

    // Apply removeKeys first, if provided
    if (this.removeKeys && data) {
        data = this.removeKeysFromData(data);
    }
  
    // Apply replaceKeys after removeKeys
    if (this.replaceKeys && data) {
        data = this.renameKeys(data);
    }

    return data;
  }

  removeKeysFromData(data) {
    // Ensure removeKeys is an object
    if (typeof this.removeKeys === 'string') {
      try {
        this.removeKeys = JSON.parse(this.removeKeys);
      } catch (e) {
        console.error("Error parsing removeKeys:", e);
        return data;
      }
    }

    const keysToRemove = Object.keys(this.removeKeys);

    const newData = data.map(obj => {
      const newObj = { ...obj };
      keysToRemove.forEach(key => {
        delete newObj[key];
      });
      return newObj;
    });

    return newData;
  }

  renameKeys(data) {
    // Ensure replaceKeys is an object
    if (typeof this.replaceKeys === 'string') {
      try {
        this.replaceKeys = JSON.parse(this.replaceKeys);
      } catch (e) {
        console.error("Error parsing replaceKeys:", e);
        return data;
      }
    }

    const newData = data.map(obj => {
      const newObj = {};
      for (const key in obj) {
        const newKey = this.replaceKeys[key] || key;  // Use new key if mapped, otherwise original key
        newObj[newKey] = obj[key];
      }
      return newObj;
    });

    return newData;
  }

  replaceUnicodeRegex(input) {
    const unicodeRegex = /_x([0-9A-F]{4})_/g;
    return JSON.parse(JSON.stringify(input).replace(unicodeRegex, (match, p1) => String.fromCharCode(parseInt(p1, 16))));
  }

  parseXmlDataObject() {
    let xmlString = this.dataobject.replace(/&quot;/g, '"').replace(/_x([\dA-F]{4})_/gi, (match, p1) => String.fromCharCode(parseInt(p1, 16)));

    // Remove XML declaration if present
    xmlString = xmlString.replace(/<\?xml.*?\?>/, '');

    const parser = new DOMParser();
    const xmlDocument = parser.parseFromString(xmlString, 'text/xml');
    const items = xmlDocument.querySelector('RepeaterData > Items').children;
    const data = [];

    for (let i = 0; i < items.length; i++) {
      const row = {};
      const fields = items[i].children;

      for (let j = 0; j < fields.length; j++) {
        const field = fields[j];
        const fieldName = field.nodeName;
        let fieldValue = field.textContent;
        fieldValue = fieldValue.replace(/_x([\dA-F]{4})_/gi, (match, p1) => String.fromCharCode(parseInt(p1, 16)));

        row[fieldName] = fieldValue;
      }

      data.push(row);
    }

    if (this.replaceKeys && data) {
      return this.renameKeys(data);
    }

    return data;
  }

  changePage(newPage) {
    if (newPage > 0 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.requestUpdate();
    }
  }

  renderField(field) {
    if (Array.isArray(field)) {
      return html`
        <table class="table mb-2 p-1">
          <tbody>
            ${field.map(item => html`
              <tr>
                <td>${this.renderField(item)}</td>
              </tr>
            `)}
          </tbody>
        </table>
      `;
    } else if (typeof field === 'object' && field !== null) {
      // Check if any value in the object is itself an object
      if (Object.values(field).some(value => typeof value === 'object' && value !== null)) {
        return html`
          <button @click="${() => this.toggleRow(field)}">Expand</button>
          <div class="nested-table" style="display: none;">
            ${Object.entries(field).map(([key, value]) => {
              if (typeof value === 'object' && value !== null) {
                return html`
                  <table class="table mb-2 p-1">
                    <caption>${key}</caption>
                    ${this.renderNestedTable(value)}
                  </table>
                `;
              } else {
                return html`
                  <ul class="nested-list">
                    <li>${key}: ${value !== null ? value : '-'}</li>
                  </ul>
                `;
              }
            })}
          </div>
        `;
      } else {
        // Render simple object
        return html`
          <ul class="nested-list">
            ${Object.entries(field).map(([key, value]) => html`
              <li>${key}: ${value !== null ? value : '-'}</li>
            `)}
          </ul>
        `;
      }
    } else {
      return field !== null ? field : '-';
    }
  }
  
  render() {
    const data = this.parseDataObject();

    // Display error message if present
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
    this.totalPages = totalPages; // Assign to component property

    // Calculate the range of pages to display
    const maxPagesToShow = 5;
    const pageRange = Math.min(totalPages, maxPagesToShow);
    let startPage = Math.max(1, this.currentPage - Math.floor(pageRange / 2));
    const endPage = Math.min(totalPages, startPage + pageRange - 1);

    // Adjust startPage if it exceeds the valid range
    if (endPage - startPage + 1 < pageRange) {
      startPage = Math.max(1, endPage - pageRange + 1);
    }

    return html`
      <style>
        .page-txt-link {
          width: 100px;
          text-align:center;
        }
        .page-num-link {
          width: 45px;
          text-align:center;
        }
        .neo-table {
          -moz-user-select: text;
          -khtml-user-select: text;
          -webkit-user-select: text;
          -ms-user-select: text;
          user-select: text;
        }
      </style>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
      <div class="table-responsive-md overflow-auto">
        <table class="neo-table table table-striped">
          <thead>
            <tr>
              ${Object.keys(data[0]).map(header => html`<th class="text-nowrap">${header}</th>`)}
            </tr>
          </thead>
          <tbody>
            ${paginatedData.map(row => html`
              <tr>
                ${Object.values(row).map(value => html`
                  <td>
                    ${this.renderField(value)}
                  </td>
                `)}
              </tr>
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
    `;
  }

}

customElements.define('neo-table-viewer', neoTable);
