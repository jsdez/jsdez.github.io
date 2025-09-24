import { LitElement, html, css, unsafeCSS } from 'lit';
import componentStyles from './neo-pricework.css';

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
        currency: {
          type: 'string',
          title: 'Currency symbol',
          description: 'Displayed before amounts',
          defaultValue: '£'
        },
        readOnly: {
          type: 'boolean',
          title: 'Read only',
          description: 'Whether this control should be read-only',
          defaultValue: false
        },
        outputobj: {
          type: 'object',
          title: 'Output object',
          description: 'Form-bound output',
          isValueField: true
        }
      },
      standardProperties: {
        fieldLabel: true,
        description: true,
      }
    };
  }

  static get properties() {
    return {
      apiKey: { type: String },
      inputobj: { type: Object },
      outputobj: { type: Object },
      contracts: { type: String },
      workItems: { type: Object },
      currency: { type: String },
      readOnly: { type: Boolean },
      jobs: { type: Array, state: true },
      showModal: { type: Boolean, state: true },
      editingIndex: { type: Number, state: true },
      formData: { type: Object, state: true },
      workItemQuery: { type: String, state: true },
      noteOpen: { type: Object, state: true },
    };
  }

  static get styles() {
    return css`${unsafeCSS(componentStyles)}`;
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
    return { id: '', address: '', contract: '', items: [], notes: '' };
  }

  updated(changedProperties) {
    if (changedProperties.has('inputobj') && this.inputobj) {
      const jobs = Array.isArray(this.inputobj.jobs) ? this.inputobj.jobs : [];
      this.jobs = jobs.map(j => ({ ...j, id: j.id || uid() }));
      this.recomputeAndDispatch();
    }
  }

  // Totals helpers
  itemTotal(item) {
    return Number(item.price || 0) * Number(item.quantity || 0);
  }

  jobTotal(job) {
    return (job.items || []).reduce((sum, it) => sum + this.itemTotal(it), 0);
  }

  subtotal() {
    return this.jobs.reduce((sum, j) => sum + this.jobTotal(j), 0);
  }

  recomputeAndDispatch() {
    this.outputobj = { jobs: this.jobs, subtotal: this.subtotal(), count: this.jobs.length };
    this.dispatchEvent(new CustomEvent('ntx-value-change', { detail: this.outputobj, bubbles: true, composed: true }));
  }

  // UI handlers
  openAdd = () => {
    if (this.readOnly) return;
    this.formData = { ...this.getEmptyForm(), id: uid() };
    this.editingIndex = -1;
    this.showModal = true;
    this.updateComplete.then(() => this.ensureGoogleMapsLoadedAndInit());
  }

  openEdit = (index) => {
    if (this.readOnly) return;
    const j = this.jobs[index];
    if (!j) return;
    this.formData = { ...j };
    this.editingIndex = index;
    this.showModal = true;
    this.updateComplete.then(() => this.ensureGoogleMapsLoadedAndInit());
  }

  closeModal = () => {
    this.showModal = false;
  }

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
    const next = [...(this.formData.items || []), ...adds];
    this.formData = { ...this.formData, items: next };
    // Clear selection for better UX
    select.selectedIndex = -1;
  }

  addWorkItem = (w) => {
    if (!w) return;
    const exists = (this.formData.items || []).some(i => i.name === w.name);
    if (exists) return;
    const next = [...(this.formData.items || []), { itemCode: w.itemCode || '', name: w.name, price: Number(w.price) || 0, quantity: 1, contract: w.contract || this.formData.contract || '' }];
    this.formData = { ...this.formData, items: next };
  }

  getJobContracts(job) {
    const set = new Set();
    // From job.contract (string, csv, or array)
    const raw = job.contract;
    if (Array.isArray(raw)) raw.forEach(v => { if (v) set.add(String(v).trim()); });
    else if (typeof raw === 'string') raw.split(',').map(s => s.trim()).filter(Boolean).forEach(v => set.add(v));
    // From items
    (job.items || []).forEach(it => { if (it && it.contract) set.add(String(it.contract).trim()); });
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
          <div class="row" style="display: grid; grid-template-columns: 1fr auto; gap: .5rem .75rem; align-items: start;">
            <!-- Row 1: Address (left) -->
            <div class="field-line">
              <span class="inline-label">Address:</span>
              <span class="title">${job.address || 'Untitled job'}</span>
            </div>
            <div></div>

            <!-- Row 2: Contracts (left) + Summary (right) -->
            <div class="field-line" style="margin-top:.25rem;">
              <span class="inline-label">Contracts:</span>
              ${contracts.length ? html`
                <span class="pill-group">
                  ${contracts.map(c => html`<span class="pill">${c}</span>`)}
                </span>
              ` : html`<span class="muted">None</span>`}
            </div>
            <div class="right">
              <div class="summary">${(job.items?.length || 0)} work item${(job.items?.length || 0) === 1 ? '' : 's'} - ${this.currency}${this.jobTotal(job).toFixed(2)}</div>
            </div>

            <!-- Row 3: Actions (right) -->
            <div></div>
            <div class="right-actions">
              ${!this.readOnly ? html`
                <button class="btn btn-light btn-compact" title="Edit" aria-label="Edit" @click=${() => this.openEdit(index)}>
                  <span>Edit</span>
                  <!-- refined pencil icon -->
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 21l1.5-.5L18.5 6.5a2.12 2.12 0 10-3-3L1.5 17.5 3 21z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M14.5 4.5l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              ` : ''}
              ${hasNotes ? html`
                <button class="btn btn-light btn-compact" title="${open ? 'Hide' : 'Show'} notes" aria-label="${open ? 'Hide' : 'Show'} notes" @click=${() => this.toggleNotes(job.id)}>
                  <span>Notes</span>
                  ${open ? html`
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 15l6-6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  ` : html`
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  `}
                </button>
              ` : ''}
            </div>
          </div>
          ${open && hasNotes ? html`<div class="notes">${job.notes}</div>` : ''}
        </div>
      </div>
    `;
  }

  renderModal() {
    if (!this.showModal) return null;
    const editing = this.editingIndex > -1;
    return html`
      <div class="backdrop" @click=${(e) => { if (e.target === e.currentTarget) this.closeModal(); }}>
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
                  @input=${(e) => { this.workItemQuery = e.target.value; }} />
                <div class="avail-list" role="list">
                  ${this.getAvailableWorkItems().map(w => html`
                    <div class="avail-row" role="listitem">
                      <div class="avail-main">
                        <div class="avail-title">${w.name}</div>
                        <div class="avail-price">${this.currency}${Number(w.price).toFixed(2)}</div>
                      </div>
                      <div class="avail-actions">
                        <button class="icon-btn success" @click=${() => this.addWorkItem(w)} aria-label=${`Add ${w.name}`} title="Add">
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
                ${Array.isArray(this.formData.items) && this.formData.items.length > 0 ? html`
                  <div class="list-table">
                    <div class="list-head sm">
                      <div>Selected Work Item</div>
                      <div class="center">Price</div>
                      <div class="center">Qty</div>
                      <div class="center">Cost</div>
                      <div></div>
                    </div>
                    ${this.formData.items.map((it, idx) => html`
                      <div class="list-row">
                        <div class="cell-name">
                          <div class="title">${it.name}</div>
                        </div>
                        <div class="cell-numbers">
                          <div class="cell-unit"><span class="cell-label">Price </span><span class="sm">${this.currency}${Number(it.price).toFixed(2)}</span></div>
                          <div class="cell-qty"><span class="cell-label">Qty </span><input class="qty-input" type="number" min="0" step="1" .value=${String(it.quantity ?? 0)} @input=${(e) => this.updateItemQty(idx, e)} /></div>
                          <div class="cell-cost"><span class="cell-label">Cost </span><span class="total">${this.currency}${this.itemTotal(it).toFixed(2)}</span></div>
                        </div>
                        <div class="cell-remove">
                          <button class="icon-btn" title="Remove" aria-label="Remove" @click=${() => this.removeSelectedItem(idx)}>
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
                <textarea .value=${this.formData.notes} @input=${(e) => this.onInput(e, 'notes')} placeholder="Add any notes about this job"></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <div class="muted">Job total: <strong>${this.currency}${this.jobTotal(this.formData).toFixed(2)}</strong></div>
            <div class="actions">
              ${editing ? html`<button class="btn btn-danger" @click=${() => this.remove(this.editingIndex)}>Delete</button>` : ''}
              <button class="btn btn-outline" @click=${this.closeModal}>Cancel</button>
              <button class="btn btn-primary" @click=${this.save} ?disabled=${!(this.formData.items?.length > 0)}>Save</button>
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
      this._addressIsUserInput = true;
      this.formData = { ...this.formData, address: place.formatted_address };
      this._addressPreviousValue = this.formData.address;
      this._addressLastResolved = this.formData.address;
    });
    // Prepare Places Service for programmatic resolution
    this._placesService = new google.maps.places.PlacesService(document.createElement('div'));
  }

  onAddressTyping = (e) => {
    this._addressIsUserInput = true;
    const value = e.target.value;
    this.formData = { ...this.formData, address: value };
    this._addressPreviousValue = value;
  }

  onAddressBlur = () => {
    // Resolve only if gmaps ready and user typed text different from last resolved
    const text = this.formData.address || '';
    if (!text.trim()) return;
    if (!this._gmapsLoaded || !this._placesService || !window.google || !window.google.maps) return;
    if (text === this._addressLastResolved) return;

    const request = { query: text, fields: ['formatted_address', 'geometry', 'name'] };
    this._placesService.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
        const place = results[0];
        if (place.formatted_address && place.formatted_address !== this.formData.address) {
          this.formData = { ...this.formData, address: place.formatted_address };
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
        <span class="badge">${this.jobs.length} item${this.jobs.length === 1 ? '' : 's'}</span>
      </div>

      <div class="rows">
        ${this.jobs.length === 0 ? html`<div class="empty">No jobs yet. Use the button below to add your first job.</div>` : this.jobs.map((j, i) => this.renderRow(j, i))}
      </div>

      <div class="footer">
        <div class="muted">Subtotal</div>
        <div class="total">${this.currency}${subtotal.toFixed(2)}</div>
      </div>

      ${!this.readOnly ? html`
        <div style="margin-top:.5rem; display:flex; justify-content:flex-end;">
          <button class="btn btn-primary" @click=${this.openAdd}>Add Job</button>
        </div>
      ` : ''}

      ${this.renderModal()}
    `;
  }
}

customElements.define('neo-pricework', NeoPriceworkElement);
