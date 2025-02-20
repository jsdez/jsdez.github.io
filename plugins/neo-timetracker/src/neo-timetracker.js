import { LitElement, html, css } from 'lit';

class TimetrackerElement extends LitElement {
  static getMetaConfig() {
    return {
      controlName: 'neo-timetracker',
      fallbackDisableSubmit: false,
      description: '',
      iconUrl: "",
      groupName: '',
      version: 'NEO',
      properties: {
        address: { type: 'string', title: 'Address' },
        contract: { type: 'string', title: 'Contract' },
        work: { type: 'string', title: 'Work' },
        qty: { type: 'integer', title: 'Quantity' },
        price: { type: 'number', title: 'Price' },
        total: { type: 'number', title: 'Total' },
        comments: { type: 'string', title: 'Comments' },
        daydate: { type: 'string', format: 'date-time', description: 'Day Date', title: 'Day Date' },
        addItem: {
          type: 'boolean',
          title: 'Add Item',
          description: 'Set as true using rules to add an item',
          defaultValue: false,
        },
        outputobj: {
          title: 'Timesheet Output',
          type: 'object',
          description: 'Timesheet Output Do Not Use',
          isValueField: true,
          properties: {
            Comments: {
              type: 'object',
              description: 'Array of timesheets',
              items: {
                type: 'object',
                properties: {
                  address: { type: 'string', title: 'Address' },
                  contract: { type: 'string', title: 'Contract' },
                  work: { type: 'string', title: 'Work' },
                  qty: { type: 'integer', title: 'Quantity' },
                  price: { type: 'number', title: 'Price' },
                  total: { type: 'number', title: 'Total' },
                  comments: { type: 'string', title: 'Comments' },
                  daydate: { type: 'string', format: 'date-time', description: 'Day Date', title: 'Day Date' },
                },
              },
            },
            mostRecentTimesheet: {
              type: 'object',
              description: 'Latest Timesheet',
              properties: {
                address: { type: 'string', title: 'Address' },
                contract: { type: 'string', title: 'Contract' },
                work: { type: 'string', title: 'Work' },
                qty: { type: 'integer', title: 'Quantity' },
                price: { type: 'number', title: 'Price' },
                total: { type: 'number', title: 'Total' },
                comments: { type: 'string', title: 'Comments' },
                daydate: { type: 'string', format: 'date-time', description: 'Day Date', title: 'Day Date' },
              },
            },
            timesheethtml: { type: 'string', title: 'Timesheet HTML' },
          },
        },
      },
      events: ['ntx-value-change'],
      standardProperties: {
        fieldLabel: true,
        description: true,
      },
    };
  }

  static properties = {
    entries: { type: Array },
  };

  constructor() {
    super();
    this.entries = [];
  }

  updated(changedProperties) {
    if (changedProperties.has('addItem') && this.addItem) {
      this.addEntry();
    }
  }

  addEntry() {
    const newItem = {
      address: this.address || '',
      contract: this.contract || '',
      work: this.work || '',
      qty: this.qty || 0,
      price: this.price || 0,
      total: this.total || 0,
      comments: this.comments || '',
      daydate: this.daydate || new Date().toISOString(),
    };

    this.entries = [...this.entries, newItem];
    this.clearFields();
    this.dispatchUpdate();
  }

  clearFields() {
    this.address = '';
    this.contract = '';
    this.work = '';
    this.qty = 0;
    this.price = 0;
    this.total = 0;
    this.comments = '';
    this.daydate = '';
    this.addItem = false;
  }

  dispatchUpdate() {
    const timesheetHTML = `
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Address</th>
            <th>Contract</th>
            <th>Work</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
            <th>Comments</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${this.entries.map(entry => `
            <tr>
              <td>${entry.address}</td>
              <td>${entry.contract}</td>
              <td>${entry.work}</td>
              <td>${entry.qty}</td>
              <td>${entry.price}</td>
              <td>${entry.total}</td>
              <td>${entry.comments}</td>
              <td>${entry.daydate}</td>
            </tr>`).join('')}
        </tbody>
      </table>`;

    this.dispatchEvent(new CustomEvent('ntx-value-change', {
      detail: {
        outputobj: {
          Comments: this.entries,
          mostRecentTimesheet: this.entries[this.entries.length - 1],
          timesheethtml: timesheetHTML,
        },
      },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    return html`
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      ${this.entries.length > 0 ? html`${this.dispatchUpdate()}` : ''}
    `;
  }
}

customElements.define('neo-timetracker', TimetrackerElement);
