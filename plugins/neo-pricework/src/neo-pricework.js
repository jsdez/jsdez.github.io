import { LitElement, html } from 'lit';
import { neoPriceworkStyles } from './neo-pricework.styles.js';

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
        formMode: {
          type: 'string',
          title: 'Form mode',
          description: 'Choose the Nintex Forms host environment for this control.',
          enum: ['Nintex Cloud Form', 'Nintex SharePoint Form'],
          defaultValue: 'Nintex Cloud Form'
        },
        apiKey: {
          type: 'string',
          title: 'Google Maps API key',
          description: 'API key used for address autocomplete'
        },
        inputstr: {
          type: 'string',
          title: 'Input string',
          description: 'JSON string representation of the jobs payload. When nonempty, this takes precedence over Input object.'
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
    formMode: { type: String },
    apiKey: { type: String },
    inputstr: { type: String },
    inputobj: { type: Object },
    outputobj: { type: Object },
    contracts: { type: String },
    workItems: { type: Object },
    readOnly: { type: Boolean, reflect: true },
    jobs: { type: Array },
    showModal: { type: Boolean },
    editingIndex: { type: Number },
    formData: { type: Object },
    workItemQuery: { type: String },
    detailsOpen: { type: Object },
    inputStringError: { type: String },
  };

  static get styles() { return neoPriceworkStyles; }

  constructor() {
    super();
    this.formMode = 'Nintex Cloud Form';
    this.apiKey = '';
    this.inputstr = '';
    this.inputobj = null;
    this.outputobj = { jobs: [], subtotal: 0, count: 0 };
    this.contracts = '';
    this.workItems = { items: [] };
    this.currency = '£';
    this.readOnly = false;
    this.jobs = [];
    this.showModal = false;
    this.editingIndex = -1;
    this.formData = this.getEmptyForm();
    this.workItemQuery = '';
    this.inputStringError = '';

    // Address autocomplete state
    this._gmapsLoaded = false;
    this._autocomplete = null;
    this._placesService = null;
    this._addressIsUserInput = false;
    this._addressPreviousValue = '';
    this._addressLastResolved = '';
    this.detailsOpen = new Set();
    this._designerReadOnly = this.readOnly;
    this._sharePointForcedReadOnly = false;
  }

  getEmptyForm() {
    return { id: '', address: '', contract: '', notes: '', items: [] };
  }

  updated(changed) {
    if (changed.has('readOnly') && !this._sharePointForcedReadOnly) {
      this._designerReadOnly = this.readOnly;
    }

    if (changed.has('formMode')) {
      if (this.isSharePointForm) {
        if (!this._sharePointForcedReadOnly) {
          this._designerReadOnly = this.readOnly;
        }
        this._sharePointForcedReadOnly = true;
        if (!this.readOnly) {
          this.readOnly = true;
        }
      } else if (this._sharePointForcedReadOnly) {
        this._sharePointForcedReadOnly = false;
        if (this.readOnly !== this._designerReadOnly) {
          this.readOnly = !!this._designerReadOnly;
        }
      }
    }

    if (changed.has('formMode') || changed.has('inputobj') || changed.has('inputstr')) {
      this.loadConfiguredJobs();
    }
  }

  get isSharePointForm() {
    return (this.formMode || '').toLowerCase() === 'nintex sharepoint form';
  }

  get hasInputString() {
    return typeof this.inputstr === 'string' && this.inputstr.trim().length > 0;
  }

  get hasInputObject() {
    if (this.inputobj === null || this.inputobj === undefined) return false;
    if (Array.isArray(this.inputobj)) return this.inputobj.length > 0;
    if (typeof this.inputobj === 'object') return Object.keys(this.inputobj).length > 0;
    return Boolean(this.inputobj);
  }

  loadConfiguredJobs() {
    const hasInputString = this.hasInputString;
    const hasInputObject = this.hasInputObject;

    // A populated string input always wins. Use the object input only when the string is blank.
    if (hasInputString) {
      this.inputStringError = '';
      const parsedInput = this.parseInputString(this.inputstr);

      if (this.inputStringError) {
        console.error('[neo-pricework] input detected - inputstr contains invalid JSON; inputobj was not used.', {
          inputstr: this.inputstr,
          parseError: this.inputStringError
        });
      } else if (hasInputObject) {
        console.log('[neo-pricework] input detected - both inputstr and inputobj are populated; pricework loaded from inputstr.');
        console.log('[neo-pricework] raw inputstr payload:', this.inputstr);
        console.log('[neo-pricework] parsed inputstr payload used for loading:', parsedInput);
        console.log('[neo-pricework] inputobj payload present but not used:', this.inputobj);
      } else {
        console.log('[neo-pricework] input detected - pricework loaded from inputstr.');
        console.log('[neo-pricework] raw inputstr payload:', this.inputstr);
        console.log('[neo-pricework] parsed inputstr payload used for loading:', parsedInput);
      }

      this.loadFromInputSource(parsedInput);
      console.log('[neo-pricework] normalized outputobj after input load:', this.outputobj);
      return;
    }

    this.inputStringError = '';
    if (hasInputObject) {
      console.log('[neo-pricework] input detected - pricework loaded from inputobj.');
      console.log('[neo-pricework] inputobj payload used for loading:', this.inputobj);
    } else {
      console.log('[neo-pricework] no input detected - new pricework.');
    }
    this.loadFromInputSource(this.inputobj);
    console.log('[neo-pricework] normalized outputobj after input load:', this.outputobj);
  }

  parseInputString(raw) {
    if (!raw || typeof raw !== 'string') return null;
    const trimmed = raw.trim();
    if (!trimmed) return null;

    try {
      const parsed = JSON.parse(trimmed);
      // External systems can serialize an already JSON-serialized payload one additional time.
      return typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
    } catch (error) {
      this.inputStringError = error instanceof Error ? error.message : 'The value is not valid JSON.';
      return null;
    }
  }

  renderInputStringError() {
    if (!this.inputStringError) return null;

    return html`
      <div class="input-error" role="alert">
        <strong>Input string could not be loaded.</strong>
        <div>The nonempty Input string takes precedence over Input object, so the object value was not used.</div>
        <details>
          <summary>Show details and expected format</summary>
          <p><strong>JSON error:</strong> ${this.inputStringError}</p>
          <p>Provide a JSON object with a <code>jobs</code> array, or a JSON-encoded string containing that object.</p>
          <pre>{
  "jobs": [
    {
      "address": "10 Example Street",
      "items": []
    }
  ]
}</pre>
        </details>
      </div>
    `;
  }

  loadFromInputSource(data) {
    // Handle both direct jobs array and full output object structure
    let jobsToLoad = [];
    
    if (data) {
      // If inputobj has a jobs property (output from another neo-pricework control)
      if (Array.isArray(data.jobs)) {
        jobsToLoad = data.jobs;
      }
      // If inputobj is directly a jobs array
      else if (Array.isArray(data)) {
        jobsToLoad = data;
      }
      // If inputobj has jobs at root level (legacy format)
      else if (data.jobs && Array.isArray(data.jobs)) {
        jobsToLoad = data.jobs;
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

    const payload = {
      jobs: enrichedJobs,
      totalJobs,
      totalWorkItems,
      totalPrice
    };

    this.outputobj = payload;
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

  getWorkItemKey(item) {
    const contract = String(item?.contract || this.formData.contract || '').trim();
    const itemCode = String(item?.itemCode || '').trim();
    const name = String(item?.name || '').trim();
    return `${contract}\u0000${itemCode || name}`;
  }

  getAvailableWorkItems() {
    const selectedKeys = new Set((this.formData.items || []).map(item => this.getWorkItemKey(item)));
    const all = Array.isArray(this.workItems?.items) ? this.workItems.items : [];
    // Contract filter - ensure we have valid objects with properties
    let pool = all.filter(w => w && w.name && (!this.formData.contract || w.contract === this.formData.contract) && !selectedKeys.has(this.getWorkItemKey(w)));
    // Query filter: prefer itemCode containment; fallback to fuzzy name
    const q = (this.workItemQuery || '').trim().toLowerCase();
    if (!q) return pool;
    const words = q.split(/\s+/).filter(Boolean);
    const itemCodeMatches = [];
    const others = [];
    for (const w of pool) {
      if (!w || !w.name) continue; // Skip invalid items
      const code = String(w.itemCode || '').toLowerCase();
      if (code && code.includes(q)) {
        itemCodeMatches.push(w);
        continue;
      }
      others.push(w);
    }
    if (itemCodeMatches.length > 0) return itemCodeMatches;
    // Fallback fuzzy by name
    const fuzzy = others.filter(w => {
      if (!w || !w.name) return false; // Skip invalid items
      const hay = String(w.name || '').toLowerCase();
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

    const selectedNames = new Set(options.map(option => option.value));
    const existingKeys = new Set((this.formData.items || []).map(item => this.getWorkItemKey(item)));
    const adds = [];

    for (const workItem of this.getAvailableWorkItems()) {
      const key = this.getWorkItemKey(workItem);
      if (!selectedNames.has(workItem.name) || existingKeys.has(key)) continue;

      adds.push({
        itemCode: workItem.itemCode || '',
        name: workItem.name,
        price: Number(workItem.price) || 0,
        quantity: 1,
        contract: workItem.contract || this.formData.contract || '',
        spid: workItem.spid || null
      });
      existingKeys.add(key);
    }

    this.formData = { ...this.formData, items: [...(this.formData.items || []), ...adds] };
    select.selectedIndex = -1;
  }

  addWorkItem = (workItem) => {
    if (!workItem) return;
    const key = this.getWorkItemKey(workItem);
    const exists = (this.formData.items || []).some(item => this.getWorkItemKey(item) === key);
    if (exists) return;

    const item = {
      itemCode: workItem.itemCode || '',
      name: workItem.name,
      price: Number(workItem.price) || 0,
      quantity: 1,
      contract: workItem.contract || this.formData.contract || '',
      spid: workItem.spid || null
    };
    this.formData = { ...this.formData, items: [...(this.formData.items || []), item] };
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

  toggleDetails = (id) => {
    const next = new Set(this.detailsOpen || []);
    if (next.has(id)) next.delete(id); else next.add(id);
    this.detailsOpen = next;
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
    const items = job.items || [];
    const hasDetails = items.length > 0 || hasNotes;
    const detailsVisible = this.readOnly || this.detailsOpen?.has(job.id);
    
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
                  <div class="summary">${items.length} work item${items.length===1?'':'s'} - <strong>${this.currency}${this.jobTotal(job).toFixed(2)}</strong></div>
                </div>
              `: html`
                <div class="field-line" style="margin-top:.25rem;">
                  <div class="summary">${items.length} work item${items.length===1?'':'s'} - <strong>${this.currency}${this.jobTotal(job).toFixed(2)}</strong></div>
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
                ${hasDetails && !this.readOnly ? html`
                  <button class="btn btn-light btn-compact" title="${detailsVisible?'Hide':'Show'} details" aria-label="${detailsVisible?'Hide':'Show'} details" @click=${() => this.toggleDetails(job.id)} style="min-width: 90px; display:flex; justify-content:space-between; align-items:center;">
                    <span>Details</span>
                    ${detailsVisible ? html`
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 15l6-6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    ` : html`
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    `}
                  </button>
                `: ''}
              </div>
            </div>
          </div>
          
          ${detailsVisible && hasDetails ? html`
            <div class="job-details">
              ${items.length > 0 ? html`
                <table class="items-table">
                  <thead>
                    <tr>
                      <th class="code-col">Code</th>
                      <th>Work Item</th>
                      <th class="contract-col">Contract</th>
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
                        <td class="contract-col">${item.contract || ''}</td>
                        <td class="qty-col text-right">${item.quantity || 0}</td>
                        <td class="price-col text-right">${this.currency}${(Number(item.price) || 0).toFixed(2)}</td>
                        <td class="cost-col text-right"><strong>${this.currency}${this.itemTotal(item).toFixed(2)}</strong></td>
                      </tr>
                    `)}
                  </tbody>
                </table>
              ` : ''}
              
              ${hasNotes ? html`
                <div class="job-notes">
                  <strong>Notes:</strong> ${job.notes}
                </div>
              ` : ''}
            </div>
          `: ''}
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
    
    return html`
      <div class="list-header">
        <div class="card-title">Jobs</div>
        <span class="badge">${this.jobs.length} item${this.jobs.length===1?'':'s'}</span>
      </div>

      ${this.renderInputStringError()}

      <div class="rows">
        ${this.jobs.length === 0 ? html`<div class="empty">No jobs yet. Use the button below to add your first job.</div>` : this.jobs.map((j,i) => this.renderRow(j,i))}
      </div>

      ${this.readOnly ? html`
        <div class="footer" style="text-align: right; font-weight: 700; font-size: 16px;">
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
    `;
  }
}

customElements.define('neo-pricework', NeoPriceworkElement);
