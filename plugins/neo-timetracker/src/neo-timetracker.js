import { LitElement, html, css } from 'lit';

class timetrackerElement extends LitElement {
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
              type: 'array',
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
    src: '',
    items: { type: Array },
  };

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  constructor() {
    super();
    this.items = [];
    console.log('timetrackerElement initialized');
  }

  updated(changedProperties) {
    if (changedProperties.has('addItem') && this.addItem) {
      console.log('addItem changed to true');
      this.addNewItem();
    }
  }

  addNewItem() {
    console.log('Adding new item with properties:', {
      address: this.address,
      contract: this.contract,
      work: this.work,
      qty: this.qty,
      price: this.price,
      total: this.total,
      comments: this.comments,
      daydate: this.daydate,
    });

    const newItem = {
      address: this.address,
      contract: this.contract,
      work: this.work,
      qty: this.qty,
      price: this.price,
      total: this.total,
      comments: this.comments,
      daydate: this.daydate,
    };

    this.items = [...this.items, newItem];
    this.outputobj = {
      Comments: this.items,
      mostRecentTimesheet: newItem,
      timesheethtml: this.generateTableHTML(),
    };

    this.dispatchEvent(new CustomEvent('ntx-value-change', { detail: this.outputobj }));
    console.log('Dispatched ntx-value-change event', this.outputobj);
  }

  generateTableHTML() {
    if (!this.items.length) return '<div>No timesheet entries available.</div>';
    
    let htmlContent = '<table class="table table-striped"><thead><tr><th>Address</th><th>Contract</th><th>Work</th><th>Quantity</th><th>Price</th><th>Total</th><th>Comments</th><th>Day Date</th></tr></thead><tbody>';
    this.items.forEach(item => {
      htmlContent += `<tr><td>${item.address}</td><td>${item.contract}</td><td>${item.work}</td><td>${item.qty}</td><td>${item.price}</td><td>${item.total}</td><td>${item.comments}</td><td>${item.daydate}</td></tr>`;
    });
    htmlContent += '</tbody></table>';
    return htmlContent;
  }

  render() {
    return html`
    <div>${this.addItem}</div>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      <div>Timesheet Table Loading...</div>
      ${this.generateTableHTML()}
    `;
  }
}

customElements.define('neo-timetracker', timetrackerElement);
