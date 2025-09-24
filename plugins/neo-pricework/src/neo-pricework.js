import { LitElement, html, css } from 'lit';

// Simple id generator for new jobs
const uid = () => Math.random().toString(36).slice(2, 10);

class NeoPriceworkElement extends LitElement {
  static getMetaConfig() {
    // plugin contract information
    return {
      controlName: 'neo-pricework',
      fallbackDisableSubmit: false,
      description: 'Create, list and edit job line items with totals',
      iconUrl: '',
      groupName: 'NEO',
      version: '1.0',
      properties: {
        apiKey: {
          type: 'string',
          title: 'Google Maps API key',
          description: 'API key used for address autocomplete'
        },
        inputobj: {
          type: 'object',
          title: 'Input object',
          description: 'Preload jobs array and meta',
          properties: {
            jobs: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  address: { type: 'string', title: 'Address' },
                  contract: { type: 'string', title: 'Contract' },
                  notes: { type: 'string', title: 'Job Notes' },
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        itemCode: { type: 'string' },
                        name: { type: 'string' },
                        price: { type: 'number' },
                        quantity: { type: 'number' },
                        contract: { type: 'string' },
                        spid: { type: 'integer' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        contracts: {
          type: 'string',
          title: 'Contracts (comma-separated)',
          description: 'Provide the list of available contracts separated by commas',
          defaultValue: ''
        },
        workItems: {
          type: 'object',
          title: 'Work Items Catalog',
          description: 'Provide work items to choose from grouped by contract',
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', title: 'Display Name' },
                  contract: { type: 'string', title: 'Contract key' },
                  itemCode: { type: 'string', title: 'Item code' },
                  price: { type: 'number', title: 'Unit price' },
                }
              }
            }
          }
        },

        readOnly: {
          type: 'boolean',
          title: 'Read only',
          defaultValue: false
        },
        readOnlyDisplayStyle: {
          type: 'string',
          title: 'Read-only display style',
          description: 'How to display jobs in read-only mode',
          enum: ['Simple', 'Complex'],
          defaultValue: 'Simple'
        },
        outputobj: {
          type: 'object',
          title: 'Output object',
          isValueField: true,
          description: 'Complete job pricing data with summary totals',
          properties: {
            jobs: {
              type: 'array',
              title: 'Jobs',
              description: 'Array of all jobs with complete details',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', title: 'Job ID', description: 'Unique job identifier' },
                  address: { type: 'string', title: 'Address', description: 'Job address' },
                  contract: { type: 'string', title: 'Contract', description: 'Contract identifier' },
                  contracts: { type: 'array', title: 'Contracts', description: 'Array of all contracts for this job', items: { type: 'string' } },
                  notes: { type: 'string', title: 'Notes', description: 'Job notes' },
                  items: {
                    type: 'array',
                    title: 'Work Items',
                    description: 'Work items for this job',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string', title: 'Item Name', description: 'Work item name' },
                        itemCode: { type: 'string', title: 'Item Code', description: 'Work item code' },
                        price: { type: 'number', title: 'Unit Price', description: 'Unit price' },
                        quantity: { type: 'number', title: 'Quantity', description: 'Quantity selected' },
                        cost: { type: 'number', title: 'Total Cost', description: 'Total cost (price × quantity)' },
                        contract: { type: 'string', title: 'Contract', description: 'Associated contract' },
                        spid: { type: 'integer', title: 'SharePoint ID', description: 'SharePoint list item ID for traceability' }
                      }
                    }
                  },
                  totalCost: { type: 'number', title: 'Job Total Cost', description: 'Total cost for this job' },
                  totalItems: { type: 'number', title: 'Total Items', description: 'Total number of work items in this job' }
                }
              }
            },
            totalJobs: { type: 'number', title: 'Total Jobs', description: 'Total number of jobs' },
            totalWorkItems: { type: 'number', title: 'Total Work Items', description: 'Total work items across all jobs' },
            totalPrice: { type: 'number', title: 'Total Price', description: 'Total price of all work across all jobs' }
          }
        }
      },
      events: ['ntx-value-change'],
      standardProperties: {
        fieldLabel: true,
        description: true,
        readOnly: true,
        visibility: true
      }
    };
  }

  static properties = {
  apiKey: { type: String },
    inputobj: { type: Object },
    outputobj: { type: Object },
  contracts: { type: String },
  workItems: { type: Object },
    readOnly: { type: Boolean, reflect: true },
    readOnlyDisplayStyle: { type: String },
    jobs: { type: Array },
    showModal: { type: Boolean },
    editingIndex: { type: Number },
    formData: { type: Object },
  workItemQuery: { type: String },
  noteOpen: { type: Object },
  };

  static get styles() {
    // Bootstrap-like with Nintex variables
    return css`
  :host { display:block; font-family: var(--ntx-form-theme-font-family, 'Open Sans', 'Helvetica', 'Arial', sans-serif); }
  :host, :host *, :host *::before, :host *::after { box-sizing: border-box; }

      .card { background: var(--ntx-form-theme-color-form-background, #fff); border: 1px solid var(--ntx-form-theme-color-border, #898f94); border-radius: var(--ntx-form-theme-border-radius, 4px); box-shadow: var(--ntx-form-theme-popover-box-shadow, none); }
      .card + .card { margin-top: .75rem; }
      .card-body { padding: .75rem 1rem; }
      .card-title { margin: 0; font-weight: 600; color: var(--ntx-form-theme-color-input-text, #161718); }
      .muted { color: var(--ntx-form-theme-color-input-text-placeholder, #6c757d); }

      .list-header{ display:flex; justify-content:space-between; align-items:center; margin-bottom:.5rem; }
      .badge { display:inline-block; padding:.25rem .5rem; border-radius:999px; background: var(--ntx-form-theme-color-secondary-button-background, #fff); color: var(--ntx-form-theme-color-secondary, #575c61); border:1px solid var(--ntx-form-theme-color-border, #898f94); font-size:12px; }

      .btn { cursor:pointer; display:inline-flex; align-items:center; gap:.35rem; font-weight:600; border-radius: var(--ntx-form-theme-border-radius, 4px); border:1px solid transparent; padding:.45rem .75rem; line-height:1.25; }
      .btn:disabled { opacity:.65; cursor:not-allowed; }
      .btn-primary { background: var(--ntx-form-theme-color-primary-button-background, #006bd6); color: var(--ntx-form-theme-color-primary-button-font, #fff); }
      .btn-primary:hover { background: var(--ntx-form-theme-color-primary-button-hover, #2d83dc); }
      .btn-outline { background: transparent; color: var(--ntx-form-theme-color-primary, #006bd6); border-color: var(--ntx-form-theme-color-primary, #006bd6); }
      .btn-outline:hover { background: color-mix(in srgb, var(--ntx-form-theme-color-primary, #006bd6), #fff 85%); }
      .btn-danger { background: var(--ntx-form-theme-color-error, #e60000); color:#fff; }
  .icon-btn { display:inline-flex; align-items:center; justify-content:center; width:34px; height:34px; padding:0; border:1px solid var(--ntx-form-theme-color-border, #898f94); border-radius: var(--ntx-form-theme-border-radius, 4px); background: var(--ntx-form-theme-color-form-background, #fff); color: var(--ntx-form-theme-color-error, #e60000); }
  .icon-btn:hover { background: color-mix(in srgb, var(--ntx-form-theme-color-error, #e60000), #fff 90%); }
  .icon-btn.success { background: var(--ntx-form-theme-color-success, #2e7d32); color: #fff; border-color: var(--ntx-form-theme-color-success, #2e7d32); }
  .icon-btn.success:hover { background: color-mix(in srgb, var(--ntx-form-theme-color-success, #2e7d32), #000 10%); }
      .btn-light { background: var(--ntx-form-theme-color-form-background, #fff); border:1px solid var(--ntx-form-theme-color-border, #898f94); color: var(--ntx-form-theme-color-input-text, #161718); }

      .rows { display:flex; flex-direction:column; gap:.5rem; }
      .row { display:grid; grid-template-columns: 1fr auto; gap:.5rem; align-items:start; }
      .title { font-weight:600; }
      .actions { display:flex; gap:.5rem; }
    .actions-inline { display:flex; align-items:center; gap:.5rem; }
    .pill-group { display:flex; flex-wrap:wrap; gap:.35rem; margin-top:.25rem; }
    .notes { margin-top:.5rem; padding:.5rem .75rem; background: var(--ntx-form-theme-color-form-background-alternate-contrast, #0000000d); border-left:3px solid var(--ntx-form-theme-color-primary, #006bd6); border-radius: var(--ntx-form-theme-border-radius, 4px); }
  .icon-btn.neutral { color: var(--ntx-form-theme-color-input-text, #161718); }
  .icon-btn.primary { color: var(--ntx-form-theme-color-primary, #006bd6); }

  /* Field lines and labels in list rows */
  .field-line { display:flex; align-items:center; flex-wrap:wrap; gap:.5rem; }
  .inline-label { font-weight:600; color: var(--ntx-form-theme-color-input-text, #161718); }
  .right .summary { text-align:right; margin-bottom:.35rem; color: var(--ntx-form-theme-color-input-text, #161718); }
  .right-actions { display:flex; flex-direction:column; gap:.35rem; align-items:flex-end; }
  .btn-compact { padding:.3rem .5rem; line-height:1.1; }

      .footer { margin-top:.75rem; display:flex; justify-content:space-between; align-items:center; }
      .total { font-weight:700; }

      .empty { color: var(--ntx-form-theme-color-input-text-placeholder, #6c757d); text-align:center; padding: .75rem; border: 1px dashed var(--ntx-form-theme-color-border, #898f94); border-radius: var(--ntx-form-theme-border-radius, 4px); background: var(--ntx-form-theme-color-form-background-alternate-contrast, #0000000d); }

      /* Modal */
      .backdrop { position:fixed; inset:0; background: rgba(0,0,0,.45); display:flex; align-items:center; justify-content:center; padding: 10px; z-index:10000; }
  .modal { width: min(720px, calc(100vw - 20px)); max-width: 100%; max-height: 90vh; display:flex; flex-direction:column; background: var(--ntx-form-theme-color-form-background, #fff); border: 1px solid var(--ntx-form-theme-color-border, #898f94); border-radius: var(--ntx-form-theme-border-radius, 4px); box-shadow: 0 10px 30px rgba(0,0,0,.25); box-sizing: border-box; }
  .modal-header, .modal-footer { flex: 0 0 auto; padding:.75rem 1rem; border-bottom:1px solid var(--ntx-form-theme-color-border, #898f94); display:flex; align-items:center; justify-content:space-between; }
      .modal-footer { border-bottom:0; border-top:1px solid var(--ntx-form-theme-color-border, #898f94); }
  .modal-body { flex: 1 1 auto; overflow:auto; padding:1rem; }
      .form-grid { display:grid; grid-template-columns: 1fr; gap:.75rem; }
      @media (min-width: 600px) { .form-grid { grid-template-columns: 1fr 1fr; } }
      .form-group { display:flex; flex-direction:column; gap:.25rem; }
      label { font-size: var(--ntx-form-theme-text-label-size, 14px); color: var(--ntx-form-theme-color-input-text, #161718); }
  input, textarea, select { display:block; width: 100%; max-width: 100%; font-size: var(--ntx-form-theme-text-input-size, 14px); border:1px solid var(--ntx-form-theme-color-border, #898f94); border-radius: var(--ntx-form-theme-border-radius, 4px); padding:.45rem .6rem; background: var(--ntx-form-theme-color-input-background, #fff); color: var(--ntx-form-theme-color-input-text, #161718); }
      textarea { min-height: 72px; resize: vertical; }
      .right { text-align:right; }
  .pill { border-radius:999px; padding:.15rem .5rem; background: var(--ntx-form-theme-color-primary-light90, #e8f1f9); color: var(--ntx-form-theme-color-primary, #006bd6); font-weight:600; }

  /* Available work items (touch-friendly) */
  .avail-list { display:flex; flex-direction:column; gap:.5rem; max-height: 260px; font-size: 14px; overflow:auto; border:1px solid var(--ntx-form-theme-color-border, #898f94); border-radius: var(--ntx-form-theme-border-radius, 4px); padding:.5rem; background: var(--ntx-form-theme-color-form-background, #fff); width: 100%; max-width: 100%; }
  .avail-row { display:flex; align-items:center; justify-content:space-between; gap:.75rem; padding:.6rem .6rem; border:1px solid var(--ntx-form-theme-color-border, #898f94); border-radius: var(--ntx-form-theme-border-radius, 4px); min-height:44px; width: 100%; box-sizing: border-box; }
  .avail-main { display:flex; align-items:center; gap:.5rem; min-width:0; flex:1 1 auto; }
  .avail-title { font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .avail-price { color: var(--ntx-form-theme-color-input-text-placeholder, #6c757d); white-space:nowrap; }
  .avail-actions { flex:0 0 auto; }

      /* Selected items list styling */
      .list-table { display:flex; flex-direction:column; gap:.5rem; font-size:14px; }
  /* Requested fixed column widths */
  :host { --neo-col-unit: 50px; --neo-col-qty: 75px; --neo-col-cost: 50px; --neo-col-remove: 30px; }
      .list-row { padding:.5rem .75rem; background: var(--ntx-form-theme-color-form-background-alternate-contrast, #0000000d); border:1px solid var(--ntx-form-theme-color-border, #898f94); border-radius: var(--ntx-form-theme-border-radius, 4px); }
      .cell-name { min-width: 0; }
      .cell-name .title { font-weight:600; word-break: break-word; }
      .cell-unit { text-align: right; white-space: nowrap; }
      .cell-qty { text-align:right; }
      .cell-cost { white-space: nowrap; text-align:right; }
  .qty-input { width: var(--neo-col-qty); max-width: var(--neo-col-qty); }
      .cell-label { display: none; margin-right: .25rem; color: var(--ntx-form-theme-color-input-text-placeholder, #6c757d); font-size: 12px; }

      /* Large screens: one-line grid with header */
      @media (min-width: 576px) {
        .list-head { display:grid; grid-template-columns: 1fr var(--neo-col-unit) var(--neo-col-qty) var(--neo-col-cost) var(--neo-col-remove); gap:.75rem; align-items:center; padding:.25rem .75rem; }
        .list-row { display:grid; grid-template-columns: 1fr var(--neo-col-unit) var(--neo-col-qty) var(--neo-col-cost) var(--neo-col-remove); gap:.75rem; align-items:center; }
        .cell-numbers { display: contents; }
        .cell-remove { justify-self: end; }
        .cell-label { display: none; }
  .list-head .center { text-align: center; }
  .qty-input { width: var(--neo-col-qty); max-width: var(--neo-col-qty); }
      }

      /* Small screens: two-line layout, inline labels for numeric cells */
      @media (max-width: 575.98px) {
        .list-head { display:none; }
        .list-row { display:grid; grid-template-columns: 1fr var(--neo-col-remove); grid-template-rows: auto auto; row-gap:.25rem; }
        .cell-name { grid-column: 1 / 2; grid-row: 1; }
        .cell-remove { grid-column: 2 / 3; grid-row: 1; justify-self:end; display:flex; }
        .cell-numbers { grid-column: 1 / -1; grid-row: 2; display:flex; justify-content: space-evenly; align-items:center; gap:.75rem; }
        .cell-unit, .cell-qty, .cell-cost { width: auto; text-align:center; }
        .cell-qty { display:flex; align-items:center; gap:.25rem; }
  :host { --neo-col-qty: 100px; }
  .qty-input { width: var(--neo-col-qty); max-width: var(--neo-col-qty); }
        .cell-label { display: inline; }
  .avail-title { white-space: normal; overflow-wrap: anywhere; word-break: break-word; }
      }

      /* Complex read-only view styles */
      .complex-view { font-size: 12px; }
      .complex-view .card { margin-bottom: .5rem; break-inside: avoid; }
      .complex-view .card-body { padding: .5rem .75rem; }
      .complex-view .job-header { display: grid; grid-template-columns: 1fr auto; gap: .5rem; align-items: start; margin-bottom: .5rem; }
      .complex-view .job-info { min-width: 0; }
      .complex-view .job-address { font-weight: 600; margin-bottom: .25rem; }
      .complex-view .job-contracts { margin-bottom: .25rem; }
      .complex-view .job-summary { text-align: right; font-weight: 600; }
      .complex-view .job-notes { margin-top: .5rem; padding: .25rem .5rem; background: var(--ntx-form-theme-color-form-background-alternate-contrast, #0000000d); border-left: 2px solid var(--ntx-form-theme-color-primary, #006bd6); font-size: 11px; }
      .complex-view .items-table { width: 100%; border-collapse: collapse; margin-top: .5rem; }
      .complex-view .items-table th, .complex-view .items-table td { padding: .25rem .5rem; text-align: left; border-bottom: 1px solid var(--ntx-form-theme-color-border, #898f94); font-size: 11px; }
      .complex-view .items-table th { background: var(--ntx-form-theme-color-form-background-alternate-contrast, #0000000d); font-weight: 600; }
      .complex-view .items-table .text-right { text-align: right; }
      .complex-view .items-table .code-col { width: 80px; }
      .complex-view .items-table .qty-col { width: 50px; text-align: center; }
      .complex-view .items-table .price-col { width: 70px; }
      .complex-view .items-table .cost-col { width: 70px; }
      .complex-view .pill { font-size: 10px; padding: .1rem .35rem; }
      .complex-view .total-summary { margin-top: .75rem; text-align: right; font-weight: 700; font-size: 14px; }

      /* Print-specific styles for complex view */
      @media print {
        .complex-view { font-size: 10px; }
        .complex-view .card { margin-bottom: .25rem; box-shadow: none; border: 1px solid #000; }
        .complex-view .card-body { padding: .25rem .5rem; }
        .complex-view .job-header { margin-bottom: .25rem; }
        .complex-view .items-table th, .complex-view .items-table td { padding: .15rem .25rem; font-size: 9px; }
        .complex-view .job-notes { font-size: 9px; padding: .15rem .25rem; }
        .complex-view .pill { font-size: 8px; }
        .complex-view .total-summary { font-size: 12px; margin-top: .5rem; }
        
        /* Hide interactive elements in print */
        .btn, .icon-btn, .modal, .backdrop { display: none !important; }
        
        /* Ensure good page breaks */
        .complex-view .card { page-break-inside: avoid; }
        .complex-view .items-table { page-break-inside: avoid; }
      }
    `;
  }

  constructor() {
    super();
  this.apiKey = '';
    this.inputobj = null;
    this.outputobj = { jobs: [], subtotal: 0, count: 0 };
    this.contracts = '';
    this.workItems = { items: [] };
    this.currency = '£';
    this.readOnly = false;
    this.readOnlyDisplayStyle = 'Simple';
    this.jobs = [];
    this.showModal = false;
    this.editingIndex = -1;
    this.formData = this.getEmptyForm();
  this.workItemQuery = '';

  // Address autocomplete state
  this._gmapsLoaded = false;
  this._autocomplete = null;
  this._placesService = null;
  this._addressIsUserInput = false;
  this._addressPreviousValue = '';
  this._addressLastResolved = '';
  this.noteOpen = new Set();
  }

  getEmptyForm() {
    return { id: '', address: '', contract: '', notes: '', items: [] };
  }

  updated(changed) {
    if (changed.has('inputobj')) {
      this.loadFromInputObject();
    }
  }

  loadFromInputObject() {
    // Handle both direct jobs array and full output object structure
    let jobsToLoad = [];
    
    if (this.inputobj) {
      // If inputobj has a jobs property (output from another neo-pricework control)
      if (Array.isArray(this.inputobj.jobs)) {
        jobsToLoad = this.inputobj.jobs;
      }
      // If inputobj is directly a jobs array
      else if (Array.isArray(this.inputobj)) {
        jobsToLoad = this.inputobj;
      }
      // If inputobj has jobs at root level (legacy format)
      else if (this.inputobj.jobs && Array.isArray(this.inputobj.jobs)) {
        jobsToLoad = this.inputobj.jobs;
      }
    }

    if (jobsToLoad.length > 0) {
      // Load jobs with all properties preserved
      this.jobs = jobsToLoad.map(j => ({
        id: j.id || uid(),
        address: j.address || '',
        contract: j.contract || '',
        contracts: j.contracts || [], // Preserve computed contracts if present
        notes: j.notes || '',
        items: Array.isArray(j.items) ? j.items.map(it => ({
          itemCode: it.itemCode || '',
          name: it.name || '',
          price: Number(it.price) || 0,
          quantity: Number(it.quantity) || 0,
          contract: it.contract || '',
          spid: it.spid || null,
          cost: it.cost || 0 // Preserve computed cost if present
        })) : [],
        totalCost: j.totalCost || 0, // Preserve computed totals if present
        totalItems: j.totalItems || 0
      }));
      
      this.recomputeAndDispatch();
    } else {
      // Clear jobs if no valid input
      this.jobs = [];
      this.recomputeAndDispatch();
    }
  }

  // Computed helpers
  itemTotal(item) { return (Number(item.quantity) || 0) * (Number(item.price) || 0); }
  jobTotal(job) { return (Array.isArray(job.items) ? job.items : []).reduce((s, it) => s + this.itemTotal(it), 0); }
  subtotal() { return this.jobs.reduce((sum, j) => sum + this.jobTotal(j), 0); }

  // Event dispatch to Nintex
  recomputeAndDispatch() {
    const enrichedJobs = this.jobs.map(job => ({
      ...job,
      contracts: this.getJobContracts(job),
      items: (job.items || []).map(item => ({
        ...item,
        cost: this.itemTotal(item)
      })),
      totalCost: this.jobTotal(job),
      totalItems: (job.items || []).length
    }));

    const totalPrice = this.subtotal();
    const totalJobs = this.jobs.length;
    const totalWorkItems = this.jobs.reduce((sum, job) => sum + (job.items?.length || 0), 0);

    this.outputobj = {
      jobs: enrichedJobs,
      totalJobs,
      totalWorkItems,
      totalPrice
    };

    this.dispatchEvent(new CustomEvent('ntx-value-change', { detail: this.outputobj, bubbles: true, composed: true }));
  }

  // UI handlers
  openAdd = () => {
    if (this.readOnly) return;
    this.formData = { ...this.getEmptyForm(), id: uid() };
    this.editingIndex = -1;
    this.showModal = true;
  this.updateComplete.then(()=>this.ensureGoogleMapsLoadedAndInit());
  }

  openEdit = (index) => {
    if (this.readOnly) return;
    const j = this.jobs[index];
    if (!j) return;
    this.formData = { ...j };
    this.editingIndex = index;
    this.showModal = true;
  this.updateComplete.then(()=>this.ensureGoogleMapsLoadedAndInit());
  }

  closeModal = () => { this.showModal = false; }

  onInput = (e, field) => {
    const value = e.target?.value;
    this.formData = { ...this.formData, [field]: value };
  }

  onContractChange = (e) => {
    const contract = e.target.value;
  // Preserve selected items and filter when contract changes
  this.formData = { ...this.formData, contract };
  }

  getContractOptions() {
    const raw = this.contracts;
    let list = [];
    if (!raw) return list;
    // If already an array (designer might bind array), normalize
    if (Array.isArray(raw)) {
      list = raw;
    } else if (typeof raw === 'string') {
      const trimmed = raw.trim();
      // Try JSON parse when it looks like JSON
      if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) list = parsed;
          else if (parsed && typeof parsed === 'object') list = [parsed];
          else list = [];
        } catch {
          // Fallback to CSV
          list = trimmed.split(',');
        }
      } else {
        // CSV or single value
        list = trimmed.split(',');
      }
    } else if (typeof raw === 'object' && raw) {
      list = [raw];
    }

    // Normalize to string values (handle objects like {contract:"X"})
    const values = list.map(v => {
      if (typeof v === 'string') return v.trim();
      if (v && typeof v === 'object') return String(v.contract ?? v.name ?? v.value ?? '').trim();
      return '';
    }).filter(Boolean);

    // Deduplicate while preserving order
    const seen = new Set();
    return values.filter(v => (seen.has(v) ? false : (seen.add(v), true)));
  }

  getAvailableWorkItems() {
    const selectedNames = new Set((this.formData.items || []).map(i => i.name));
    const all = Array.isArray(this.workItems?.items) ? this.workItems.items : [];
    // Contract filter
    let pool = all.filter(w => (!this.formData.contract || w.contract === this.formData.contract) && !selectedNames.has(w.name));
    // Query filter: prefer itemCode containment; fallback to fuzzy name
    const q = (this.workItemQuery || '').trim().toLowerCase();
    if (!q) return pool;
    const words = q.split(/\s+/).filter(Boolean);
    const itemCodeMatches = [];
    const others = [];
    for (const w of pool) {
      const code = (w.itemCode || '').toLowerCase();
      if (code && code.includes(q)) {
        itemCodeMatches.push(w);
        continue;
      }
      others.push(w);
    }
    if (itemCodeMatches.length > 0) return itemCodeMatches;
    // Fallback fuzzy by name
    const fuzzy = others.filter(w => {
      const hay = (w.name || '').toLowerCase();
      return words.every(word => {
        if (hay.includes(word)) return true;
        let i = 0;
        for (const ch of word) {
          i = hay.indexOf(ch, i);
          if (i === -1) return false;
          i++;
        }
        return true;
      });
    });
    return fuzzy;
  }

  addSelectedWorkItems = (e) => {
    const select = e.target;
    const options = Array.from(select.selectedOptions || []);
    if (options.length === 0) return;
    const available = this.getAvailableWorkItems();
    const toAddNames = new Set(options.map(o => o.value));
    const adds = available
      .filter(w => toAddNames.has(w.name))
      .map(w => ({ itemCode: w.itemCode || '', name: w.name, price: Number(w.price) || 0, quantity: 1 }));
    const next = [ ...(this.formData.items || []), ...adds ];
    this.formData = { ...this.formData, items: next };
    // Clear selection for better UX
    select.selectedIndex = -1;
  }

  addWorkItem = (w) => {
    if (!w) return;
    const exists = (this.formData.items || []).some(i => i.name === w.name);
    if (exists) return;
    const next = [ ...(this.formData.items || []), { itemCode: w.itemCode || '', name: w.name, price: Number(w.price) || 0, quantity: 1, contract: w.contract || this.formData.contract || '', spid: w.spid || null } ];
    this.formData = { ...this.formData, items: next };
  }

  getJobContracts(job) {
    const set = new Set();
    // From job.contract (string, csv, or array)
    const raw = job.contract;
    if (Array.isArray(raw)) raw.forEach(v=>{ if (v) set.add(String(v).trim()); });
    else if (typeof raw === 'string') raw.split(',').map(s=>s.trim()).filter(Boolean).forEach(v=>set.add(v));
    // From items
    (job.items||[]).forEach(it=>{ if (it && it.contract) set.add(String(it.contract).trim()); });
    return Array.from(set).filter(Boolean);
  }

  toggleNotes = (id) => {
    const next = new Set(this.noteOpen || []);
    if (next.has(id)) next.delete(id); else next.add(id);
    this.noteOpen = next;
  }

  updateItemQty = (index, e) => {
    const qty = Math.max(0, Number(e.target.value || 0));
    const items = [...(this.formData.items || [])];
    if (!items[index]) return;
    items[index] = { ...items[index], quantity: qty };
    this.formData = { ...this.formData, items };
  }

  removeSelectedItem = (index) => {
    const items = (this.formData.items || []).filter((_, i) => i !== index);
    this.formData = { ...this.formData, items };
  }

  save = () => {
    const data = { ...this.formData };
    // Minimal validation: require at least one item; address optional
    if (!Array.isArray(data.items) || data.items.length === 0) return;
    if (this.editingIndex === -1) {
      this.jobs = [...this.jobs, data];
    } else {
      const next = [...this.jobs];
      next[this.editingIndex] = data;
      this.jobs = next;
    }
    this.showModal = false;
    this.recomputeAndDispatch();
  }

  remove = (index) => {
    const next = this.jobs.filter((_, i) => i !== index);
    this.jobs = next;
    this.showModal = false;
    this.recomputeAndDispatch();
  }

  renderRow(job, index) {
    const contracts = this.getJobContracts(job);
    const hasNotes = !!(job.notes && String(job.notes).trim());
    const open = this.noteOpen?.has(job.id);
    return html`
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div>
              <div class="field-line">
                <span class="inline-label">Address:</span>
                <span class="title">${job.address || 'Untitled job'}</span>
              </div>
              ${contracts.length ? html`
                <div class="field-line" style="margin-top:.25rem; display:flex; align-items:center; justify-content:space-between;">
                  <div style="display:flex; align-items:center; gap:.5rem;">
                    <span class="inline-label">Contracts:</span>
                    <span class="pill-group">
                      ${contracts.map(c => html`<span class="pill">${c}</span>`)}
                    </span>
                  </div>
                  <div class="summary">${(job.items?.length||0)} work item${(job.items?.length||0)===1?'':'s'} - <strong>${this.currency}${this.jobTotal(job).toFixed(2)}</strong></div>
                </div>
              `: html`
                <div class="field-line" style="margin-top:.25rem;">
                  <div class="summary">${(job.items?.length||0)} work item${(job.items?.length||0)===1?'':'s'} - <strong>${this.currency}${this.jobTotal(job).toFixed(2)}</strong></div>
                </div>
              `}
            </div>
            <div class="right">
              <div class="right-actions">
                ${!this.readOnly ? html`
                  <button class="btn btn-light btn-compact" title="Edit" aria-label="Edit" @click=${() => this.openEdit(index)} style="min-width: 90px; display:flex; justify-content:space-between; align-items:center;">
                    <span>Edit</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                `: ''}
                ${hasNotes ? html`
                  <button class="btn btn-light btn-compact" title="${open?'Hide':'Show'} notes" aria-label="${open?'Hide':'Show'} notes" @click=${() => this.toggleNotes(job.id)} style="min-width: 90px; display:flex; justify-content:space-between; align-items:center;">
                    <span>Notes</span>
                    ${open ? html`
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 15l6-6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    ` : html`
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    `}
                  </button>
                `: ''}
              </div>
            </div>
          </div>
          ${open && hasNotes ? html`<div class="notes">${job.notes}</div>`: ''}
        </div>
      </div>
    `;
  }

  renderComplexRow(job, index) {
    const contracts = this.getJobContracts(job);
    const hasNotes = !!(job.notes && String(job.notes).trim());
    const items = job.items || [];
    
    return html`
      <div class="card">
        <div class="card-body">
          <div class="job-header">
            <div class="job-info">
              <div class="job-address">${job.address || 'Untitled job'}</div>
              ${contracts.length ? html`
                <div class="job-contracts">
                  <strong>Contracts:</strong>
                  ${contracts.map(c => html`<span class="pill">${c}</span>`)}
                </div>
              ` : ''}
            </div>
            <div class="job-summary">
              ${items.length} item${items.length === 1 ? '' : 's'}<br>
              <strong>${this.currency}${this.jobTotal(job).toFixed(2)}</strong>
            </div>
          </div>
          
          ${items.length > 0 ? html`
            <table class="items-table">
              <thead>
                <tr>
                  <th class="code-col">Code</th>
                  <th>Work Item</th>
                  <th class="qty-col">Qty</th>
                  <th class="price-col text-right">Unit Price</th>
                  <th class="cost-col text-right">Total Cost</th>
                </tr>
              </thead>
              <tbody>
                ${items.map(item => html`
                  <tr>
                    <td class="code-col">${item.itemCode || ''}</td>
                    <td>${item.name}</td>
                    <td class="qty-col text-right">${item.quantity || 0}</td>
                    <td class="price-col text-right">${this.currency}${(Number(item.price) || 0).toFixed(2)}</td>
                    <td class="cost-col text-right"><strong>${this.currency}${this.itemTotal(item).toFixed(2)}</strong></td>
                  </tr>
                `)}
              </tbody>
            </table>
          ` : html`
            <div class="muted" style="text-align: center; padding: .5rem;">No work items</div>
          `}
          
          ${hasNotes ? html`
            <div class="job-notes">
              <strong>Notes:</strong> ${job.notes}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  renderModal() {
    if (!this.showModal) return null;
    const editing = this.editingIndex > -1;
    return html`
      <div class="backdrop" @click=${(e)=>{ if (e.target === e.currentTarget) this.closeModal(); }}>
        <div class="modal" role="dialog" aria-modal="true">
          <div class="modal-header">
            <div class="card-title">${editing ? 'Edit Job' : 'Add Job'}</div>
            <button class="btn btn-light" @click=${this.closeModal}>Close</button>
          </div>
          <div class="modal-body">
            <div class="form-grid">
              <div class="form-group" style="grid-column: 1 / -1;">
                <label>Address</label>
                <input id="addressInput" type="text" .value=${this.formData.address}
                  @input=${this.onAddressTyping}
                  @blur=${this.onAddressBlur}
                  @change=${this.onAddressBlur}
                  placeholder="Search for an address" />
              </div>
              <div class="form-group" style="grid-column: 1 / -1;">
                <label>Contract</label>
                <select .value=${this.formData.contract} @change=${this.onContractChange}>
                  <option value="">Select contract</option>
                  ${this.getContractOptions().map(c => html`<option value="${c}">${c}</option>`)}
                </select>
              </div>
              <div class="form-group" style="grid-column: 1 / -1;">
                <label>Work Items</label>
                <input type="text" placeholder="Search work items" .value=${this.workItemQuery}
                  @input=${(e)=>{ this.workItemQuery = e.target.value; }} />
                <div class="avail-list" role="list">
                  ${this.getAvailableWorkItems().map(w => html`
                    <div class="avail-row" role="listitem">
                      <div class="avail-main">
                        <div class="avail-title">${w.name}</div>
                        <div class="avail-price">${this.currency}${Number(w.price).toFixed(2)}</div>
                      </div>
                      <div class="avail-actions">
                        <button class="icon-btn success" @click=${()=>this.addWorkItem(w)} aria-label=${`Add ${w.name}`} title="Add">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  `)}
                </div>
              </div>
              <div class="form-group" style="grid-column: 1 / -1;">
                ${Array.isArray(this.formData.items) && this.formData.items.length>0 ? html`
                  <div class="list-table">
                    <div class="list-head sm">
                      <div>Selected Work Item</div>
                      <div class="center">Price</div>
                      <div class="center">Qty</div>
                      <div class="center">Cost</div>
                      <div></div>
                    </div>
                    ${this.formData.items.map((it, idx)=> html`
                      <div class="list-row">
                        <div class="cell-name">
                          <div class="title">${it.name}</div>
                        </div>
                        <div class="cell-numbers">
                          <div class="cell-unit"><span class="cell-label">Price </span><span class="sm">${this.currency}${Number(it.price).toFixed(2)}</span></div>
                          <div class="cell-qty"><span class="cell-label">Qty </span><input class="qty-input" type="number" min="0" step="1" .value=${String(it.quantity ?? 0)} @input=${(e)=>this.updateItemQty(idx, e)} /></div>
                          <div class="cell-cost"><span class="cell-label">Cost </span><span class="total">${this.currency}${this.itemTotal(it).toFixed(2)}</span></div>
                        </div>
                        <div class="cell-remove">
                          <button class="icon-btn" title="Remove" aria-label="Remove" @click=${()=>this.removeSelectedItem(idx)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3 6h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2"/>
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="2"/>
                              <path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    `)}
                  </div>
                ` : html`<div class="muted">No items selected yet.</div>`}
              </div>
              <div class="form-group" style="grid-column: 1 / -1;">
                <label>Job Notes</label>
                <textarea .value=${this.formData.notes} @input=${(e)=>this.onInput(e,'notes')} placeholder="Add any notes about this job"></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <div class="muted">Job total: <strong>${this.currency}${this.jobTotal(this.formData).toFixed(2)}</strong></div>
            <div class="actions">
              ${editing ? html`<button class="btn btn-danger" @click=${()=>this.remove(this.editingIndex)}>Delete</button>` : ''}
              <button class="btn btn-outline" @click=${this.closeModal}>Cancel</button>
              <button class="btn btn-primary" @click=${this.save} ?disabled=${!(this.formData.items?.length>0)}>Save</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ======== Embedded neo-address capabilities (lite) ========
  ensureGoogleMapsLoadedAndInit() {
    // If field isn't in DOM yet, bail; updateComplete callers handle sequencing.
    const input = this.shadowRoot?.getElementById('addressInput');
    if (!input) return;

    if (this._gmapsLoaded && window.google && window.google.maps) {
      this.initAutocomplete(input);
      return;
    }

    if (!this.apiKey) {
      // API key missing; fallback to plain text input behavior
      return;
    }

    // If already loading/loaded script exists, hook into onload
    if (window.google && window.google.maps) {
      this._gmapsLoaded = true;
      this.initAutocomplete(input);
      return;
    }

    const existing = document.querySelector('script[data-neo-pricework-gmaps]');
    if (existing) {
      existing.addEventListener('load', () => {
        this._gmapsLoaded = true;
        this.initAutocomplete(input);
      }, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.dataset.neoPriceworkGmaps = '1';
    script.addEventListener('load', () => {
      this._gmapsLoaded = true;
      this.initAutocomplete(input);
    }, { once: true });
    script.addEventListener('error', () => {
      // Swallow errors; input remains plain text
      // eslint-disable-next-line no-console
      console.error('Failed to load Google Maps API');
    }, { once: true });
    document.head.appendChild(script);
  }

  initAutocomplete(inputEl) {
    if (!window.google || !window.google.maps) return;
    if (!inputEl) return;
    // Create once per modal lifecycle
    this._autocomplete = new google.maps.places.Autocomplete(inputEl, { types: ['address'] });
    this._autocomplete.addListener('place_changed', () => {
      const place = this._autocomplete.getPlace();
      if (!place || !place.formatted_address) return;
      
      // Mark as NOT user input since this is an autocomplete selection
      this._addressIsUserInput = false;
      this.formData = { ...this.formData, address: place.formatted_address };
      this._addressPreviousValue = place.formatted_address;
      this._addressLastResolved = place.formatted_address;
      
      // Reset the flag after a brief delay to handle future user input
      setTimeout(() => {
        this._addressIsUserInput = true;
      }, 100);
    });
    // Prepare Places Service for programmatic resolution
    this._placesService = new google.maps.places.PlacesService(document.createElement('div'));
  }

  onAddressTyping = (e) => {
    this._addressIsUserInput = true;
    const value = e.target.value;
    this.formData = { ...this.formData, address: value };
    this._addressPreviousValue = value;
    // Reset the resolved flag when user types - they're changing the selection
    this._addressLastResolved = '';
  }

  onAddressBlur = () => {
    // Skip resolution if address was just set by autocomplete selection
    if (!this._addressIsUserInput) return;
    
    const text = this.formData.address || '';
    if (!text.trim()) return;
    
    // Don't resolve if we don't have Google Maps or if this address was already resolved
    if (!this._gmapsLoaded || !this._placesService || !window.google || !window.google.maps) return;
    if (text === this._addressLastResolved) return;
    
    // Don't resolve if the text hasn't changed since the last input event
    if (text === this._addressPreviousValue && this._addressLastResolved) return;

    const request = { query: text, fields: ['formatted_address', 'geometry', 'name'] };
    this._placesService.findPlaceFromQuery(request, (results, status) => {
      // Only update if the component still has focus on this address and hasn't changed
      if (this.formData.address !== text) return;
      
      if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
        const place = results[0];
        if (place.formatted_address && place.formatted_address !== this.formData.address) {
          this._addressIsUserInput = false; // Prevent recursive resolution
          this.formData = { ...this.formData, address: place.formatted_address };
          this._addressIsUserInput = true; // Reset for next interaction
        }
        this._addressLastResolved = this.formData.address;
      } else {
        // Keep user text; mark as attempted
        this._addressLastResolved = text;
      }
    });
  }

  render() {
    const subtotal = this.subtotal();
    const isComplexReadOnly = this.readOnly && this.readOnlyDisplayStyle === 'Complex';
    
    return html`
      <div class="${isComplexReadOnly ? 'complex-view' : ''}">
        <div class="list-header">
          <div class="card-title">Jobs</div>
          <span class="badge">${this.jobs.length} item${this.jobs.length===1?'':'s'}</span>
        </div>

        <div class="rows">
          ${this.jobs.length === 0 ? html`<div class="empty">No jobs yet. Use the button below to add your first job.</div>` : this.jobs.map((j,i) => isComplexReadOnly ? this.renderComplexRow(j,i) : this.renderRow(j,i))}
        </div>

        ${isComplexReadOnly ? html`
          <div class="total-summary">
            <div>Total Jobs: ${this.jobs.length}</div>
            <div>Total Work Items: ${this.jobs.reduce((sum, job) => sum + (job.items?.length || 0), 0)}</div>
            <div>Grand Total: ${this.currency}${subtotal.toFixed(2)}</div>
          </div>
        ` : html`
          <div class="footer">
            <div class="muted">Subtotal</div>
            <div class="total">${this.currency}${subtotal.toFixed(2)}</div>
          </div>
        `}

        ${!this.readOnly ? html`
          <div style="margin-top:.5rem; display:flex; justify-content:flex-end;">
            <button class="btn btn-primary" @click=${this.openAdd}>Add Job</button>
          </div>
        `: ''}

        ${this.renderModal()}
      </div>
    `;
  }
}

customElements.define('neo-pricework', NeoPriceworkElement);
