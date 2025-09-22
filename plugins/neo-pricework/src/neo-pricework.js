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
        inputobj: {
          type: 'object',
          title: 'Input object (optional)',
          description: 'Preload jobs array and meta',
          properties: {
            jobs: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string', title: 'Title' },
                  description: { type: 'string', title: 'Description' },
                  quantity: { type: 'number', title: 'Qty' },
                  rate: { type: 'number', title: 'Rate' },
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
          defaultValue: false
        },
        outputobj: {
          type: 'object',
          title: 'Output object (jobs + totals) - Do not use',
          isValueField: true,
          properties: {
            jobs: { type: 'array' },
            subtotal: { type: 'number' },
            count: { type: 'number' }
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
    inputobj: { type: Object },
    outputobj: { type: Object },
    currency: { type: String },
    readOnly: { type: Boolean, reflect: true },
    jobs: { type: Array },
    showModal: { type: Boolean },
    editingIndex: { type: Number },
    formData: { type: Object },
  };

  static get styles() {
    // Bootstrap-like with Nintex variables
    return css`
      :host { display:block; font-family: var(--ntx-form-theme-font-family, 'Open Sans', 'Helvetica', 'Arial', sans-serif); }

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
      .btn-light { background: var(--ntx-form-theme-color-form-background, #fff); border:1px solid var(--ntx-form-theme-color-border, #898f94); color: var(--ntx-form-theme-color-input-text, #161718); }

      .rows { display:flex; flex-direction:column; gap:.5rem; }
      .row { display:grid; grid-template-columns: 1fr auto; gap:.5rem; align-items:start; }
      .title { font-weight:600; }
      .actions { display:flex; gap:.5rem; }

      .footer { margin-top:.75rem; display:flex; justify-content:space-between; align-items:center; }
      .total { font-weight:700; }

      .empty { color: var(--ntx-form-theme-color-input-text-placeholder, #6c757d); text-align:center; padding: .75rem; border: 1px dashed var(--ntx-form-theme-color-border, #898f94); border-radius: var(--ntx-form-theme-border-radius, 4px); background: var(--ntx-form-theme-color-form-background-alternate-contrast, #0000000d); }

      /* Modal */
      .backdrop { position:fixed; inset:0; background: rgba(0,0,0,.45); display:flex; align-items:center; justify-content:center; padding: 1rem; z-index:10000; }
      .modal { width:min(720px, 100%); background: var(--ntx-form-theme-color-form-background, #fff); border: 1px solid var(--ntx-form-theme-color-border, #898f94); border-radius: var(--ntx-form-theme-border-radius, 4px); box-shadow: 0 10px 30px rgba(0,0,0,.25); }
      .modal-header, .modal-footer { padding:.75rem 1rem; border-bottom:1px solid var(--ntx-form-theme-color-border, #898f94); display:flex; align-items:center; justify-content:space-between; }
      .modal-footer { border-bottom:0; border-top:1px solid var(--ntx-form-theme-color-border, #898f94); }
      .modal-body { padding:1rem; }
      .form-grid { display:grid; grid-template-columns: 1fr; gap:.75rem; }
      @media (min-width: 600px) { .form-grid { grid-template-columns: 1fr 1fr; } }
      .form-group { display:flex; flex-direction:column; gap:.25rem; }
      label { font-size: var(--ntx-form-theme-text-label-size, 14px); color: var(--ntx-form-theme-color-input-text, #161718); }
      input, textarea { font-size: var(--ntx-form-theme-text-input-size, 14px); border:1px solid var(--ntx-form-theme-color-border, #898f94); border-radius: var(--ntx-form-theme-border-radius, 4px); padding:.45rem .6rem; background: var(--ntx-form-theme-color-input-background, #fff); color: var(--ntx-form-theme-color-input-text, #161718); }
      textarea { min-height: 72px; resize: vertical; }
      .right { text-align:right; }
      .pill { border-radius:999px; padding:.15rem .5rem; background: var(--ntx-form-theme-color-primary-light90, #e8f1f9); color: var(--ntx-form-theme-color-primary, #006bd6); font-weight:600; }
    `;
  }

  constructor() {
    super();
    this.inputobj = null;
    this.outputobj = { jobs: [], subtotal: 0, count: 0 };
    this.currency = '£';
    this.readOnly = false;
    this.jobs = [];
    this.showModal = false;
    this.editingIndex = -1;
    this.formData = this.getEmptyForm();
  }

  getEmptyForm() {
    return { id: '', title: '', description: '', quantity: 1, rate: 0 };
  }

  updated(changed) {
    if (changed.has('inputobj') && this.inputobj && Array.isArray(this.inputobj.jobs)) {
      // Load initial jobs from input
      this.jobs = [...this.inputobj.jobs].map(j => ({ id: j.id || uid(), title: j.title || '', description: j.description || '', quantity: Number(j.quantity) || 0, rate: Number(j.rate) || 0 }));
      this.recomputeAndDispatch();
    }
  }

  // Computed helpers
  lineTotal(job) { return (Number(job.quantity) || 0) * (Number(job.rate) || 0); }
  subtotal() { return this.jobs.reduce((sum, j) => sum + this.lineTotal(j), 0); }

  // Event dispatch to Nintex
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
  }

  openEdit = (index) => {
    if (this.readOnly) return;
    const j = this.jobs[index];
    if (!j) return;
    this.formData = { ...j };
    this.editingIndex = index;
    this.showModal = true;
  }

  closeModal = () => { this.showModal = false; }

  onInput = (e, field) => {
    const value = field === 'quantity' || field === 'rate' ? Number(e.target.value) : e.target.value;
    this.formData = { ...this.formData, [field]: value };
  }

  save = () => {
    const data = { ...this.formData };
    if (!data.title?.trim()) {
      // Basic guard for required title
      return;
    }
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
    return html`
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div>
              <div class="title">${job.title || 'Untitled job'}</div>
              ${job.description ? html`<div class="muted">${job.description}</div>` : ''}
              <div class="muted">Qty: <span class="pill">${job.quantity}</span> · Rate: <span class="pill">${this.currency}${Number(job.rate).toFixed(2)}</span></div>
            </div>
            <div class="right">
              <div class="total">${this.currency}${this.lineTotal(job).toFixed(2)}</div>
              ${!this.readOnly ? html`
                <div class="actions">
                  <button class="btn btn-light" @click=${() => this.openEdit(index)}>Edit</button>
                </div>
              `: ''}
            </div>
          </div>
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
                <label>Title</label>
                <input type="text" .value=${this.formData.title} @input=${(e)=>this.onInput(e,'title')} placeholder="e.g. Install unit" />
              </div>
              <div class="form-group" style="grid-column: 1 / -1;">
                <label>Description</label>
                <textarea .value=${this.formData.description} @input=${(e)=>this.onInput(e,'description')} placeholder="Notes or details"></textarea>
              </div>
              <div class="form-group">
                <label>Quantity</label>
                <input type="number" min="0" step="1" .value=${String(this.formData.quantity ?? 0)} @input=${(e)=>this.onInput(e,'quantity')} />
              </div>
              <div class="form-group">
                <label>Rate</label>
                <input type="number" min="0" step="0.01" .value=${String(this.formData.rate ?? 0)} @input=${(e)=>this.onInput(e,'rate')} />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <div class="muted">Line total: <strong>${this.currency}${this.lineTotal(this.formData).toFixed(2)}</strong></div>
            <div class="actions">
              ${editing ? html`<button class="btn btn-danger" @click=${()=>this.remove(this.editingIndex)}>Delete</button>` : ''}
              <button class="btn btn-outline" @click=${this.closeModal}>Cancel</button>
              <button class="btn btn-primary" @click=${this.save} ?disabled=${!this.formData.title?.trim()}>Save</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const subtotal = this.subtotal();
    return html`
      <div class="list-header">
        <div class="card-title">Jobs</div>
        <span class="badge">${this.jobs.length} item${this.jobs.length===1?'':'s'}</span>
      </div>

      <div class="rows">
        ${this.jobs.length === 0 ? html`<div class="empty">No jobs yet. Use the button below to add your first job.</div>` : this.jobs.map((j,i)=>this.renderRow(j,i))}
      </div>

      <div class="footer">
        <div class="muted">Subtotal</div>
        <div class="total">${this.currency}${subtotal.toFixed(2)}</div>
      </div>

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
