import { LitElement, html, nothing } from 'lit';
import { neoPriceworkStyles } from './neo-pricework.styles.js';

// Simple id generator for new jobs
const uid = () => Math.random().toString(36).slice(2, 10);

// Work item search results shown at once (keeps long lists quick on mobile).
const WORK_ITEM_SEARCH_LIMIT = 50;

const normaliseContract = (value) => String(value ?? '').trim();

// Address lookup providers (the "Address Lookup Provider" property). UK addresses only.
const ADDRESS_PROVIDERS = { GOOGLE: 'Google Maps', OS: 'OS Places' };
const ADDRESS_LOOKUP_DELAY_MS = 250; // wait for a pause in typing before requesting suggestions
const ADDRESS_LOOKUP_MIN_CHARS = 3;
const ADDRESS_MAX_SUGGESTIONS = 5;

// Google Maps: Places API (New).
// Place types that match addresses (the legacy 'address' type isn't supported by the new API).
const ADDRESS_PLACE_TYPES = ['street_address', 'premise', 'subpremise', 'route', 'postal_code'];
const GOOGLE_REGION_CODES = ['gb'];

// OS Places API (Ordnance Survey AddressBase Premium): returns the address and its UPRN.
const OS_PLACES_URL = 'https://api.os.uk/search/places/v1';
const OS_POSTCODE_MAX_RESULTS = 100; // every address at a postcode
// A full UK postcode, e.g. "G2 1DY" or "g21dy": looked up with the postcode search instead of find.
const UK_POSTCODE = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;

// Calls an OS Places API search and returns its address records (DPA, or LPI if requested).
// The key is sent in the "key" header (allowed by OS for browser requests) so it isn't in the URL.
async function fetchOsPlaces(path, params, key, signal) {
  const url = new URL(`${OS_PLACES_URL}/${path}`);
  Object.entries(params).forEach(([name, value]) => url.searchParams.set(name, value));
  const response = await fetch(url, { headers: { key }, signal });
  if (!response.ok) {
    let detail = '';
    try {
      const body = await response.json();
      detail = body?.error?.message || body?.fault?.faultstring || '';
    } catch (error) { /* no JSON body */ }
    throw new Error(`OS Places ${path} request failed (${response.status})${detail ? `: ${detail}` : ''}`);
  }
  const body = await response.json();
  return (body.results || []).map((result) => result.DPA || result.LPI).filter(Boolean);
}

// Turns an OS Places record into a suggestion: the full address and UPRN, shown as
// "address" with the postcode underneath.
function osSuggestion(record) {
  const address = record.ADDRESS || '';
  const postcode = record.POSTCODE || record.POSTCODE_LOCATOR || '';
  const suffix = postcode ? `, ${postcode}` : '';
  return {
    provider: 'os',
    text: address,
    mainText: suffix && address.endsWith(suffix) ? address.slice(0, -suffix.length) : address,
    secondaryText: postcode,
    address,
    uprn: record.UPRN == null ? '' : String(record.UPRN),
  };
}

// Loads the Maps JavaScript API once per page (shared by every instance on the form) and
// resolves with the Places library.
const MAPS_READY_CALLBACK = '__neoPriceworkMapsReady';
const MAPS_READY_TIMEOUT_MS = 15000;
let placesLibraryPromise = null;

// Resolves once google.maps.importLibrary exists. With loading=async it can appear a moment
// after the script's load event, so poll briefly rather than failing.
function whenImportLibraryReady() {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    (function check() {
      if (window.google?.maps?.importLibrary) { resolve(); return; }
      if (Date.now() - started > MAPS_READY_TIMEOUT_MS) {
        reject(new Error('Google Maps loaded without importLibrary support'));
        return;
      }
      setTimeout(check, 50);
    })();
  });
}

function loadPlacesLibrary(apiKey) {
  if (window.google?.maps?.importLibrary) return window.google.maps.importLibrary('places');
  if (!placesLibraryPromise) {
    placesLibraryPromise = new Promise((resolve, reject) => {
      const failed = () => reject(new Error('Failed to load Google Maps API'));
      // Reuse a Maps script already on the page (e.g. from another control) rather than
      // loading it twice, which Google reports as an error.
      const existing = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
      if (existing) {
        existing.addEventListener('error', failed, { once: true });
        whenImportLibraryReady().then(resolve, reject);
        return;
      }
      // Google calls this once the API is ready (the recommended pattern with loading=async).
      window[MAPS_READY_CALLBACK] = () => {
        delete window[MAPS_READY_CALLBACK];
        whenImportLibraryReady().then(resolve, reject);
      };
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}` +
        `&loading=async&v=weekly&callback=${MAPS_READY_CALLBACK}`;
      script.async = true;
      script.dataset.neoPriceworkGmaps = '1';
      script.addEventListener('error', () => {
        // Remove the failed script so a later attempt (e.g. after signal returns) can retry.
        script.remove();
        delete window[MAPS_READY_CALLBACK];
        failed();
      }, { once: true });
      document.head.appendChild(script);
    }).then(() => window.google.maps.importLibrary('places'));
    // Allow a later retry if loading failed.
    placesLibraryPromise.catch(() => { placesLibraryPromise = null; });
  }
  return placesLibraryPromise;
}

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
        addressProvider: {
          type: 'string',
          title: 'Address Lookup Provider',
          description: 'Service that suggests UK addresses as the engineer types. Google Maps returns the formatted address; OS Places returns the address and its UPRN.',
          enum: [ADDRESS_PROVIDERS.GOOGLE, ADDRESS_PROVIDERS.OS],
          defaultValue: ADDRESS_PROVIDERS.GOOGLE
        },
        apiKey: {
          type: 'string',
          title: 'Google Maps API Key',
          description: 'Browser API key with the Maps JavaScript API and Places API (New) enabled. Used when the Address Lookup Provider is Google Maps.'
        },
        osPlacesApiKey: {
          type: 'string',
          title: 'OS Places API Key',
          description: 'OS Data Hub API key for a project with the OS Places API. Used when the Address Lookup Provider is OS Places.'
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
                  uprn: { type: 'string', title: 'UPRN' },
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
        reset: {
          type: 'boolean',
          title: 'Reset',
          description: 'Works like a button: set to true to clear all jobs, the loaded Input object and Input string, and the output value, as if the control had loaded with blank inputs. Reset then switches itself back to false. If the same Input object/string is sent again afterwards it is ignored; a different input loads normally.',
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
                  uprn: { type: 'string', title: 'UPRN', description: 'Unique Property Reference Number for the address, when known (empty otherwise)' },
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
    addressProvider: { type: String },
    apiKey: { type: String },
    osPlacesApiKey: { type: String },
    inputstr: { type: String },
    inputobj: { type: Object },
    outputobj: { type: Object },
    contracts: { type: String },
    workItems: { type: Object },
    readOnly: { type: Boolean, reflect: true },
    reset: { type: Boolean },
    jobs: { type: Array },
    showModal: { type: Boolean },
    editingIndex: { type: Number },
    formData: { type: Object },
    workItemQuery: { type: String },
    detailsOpen: { type: Object },
    expandedItemGroups: { state: true },
    inputStringError: { type: String },
    addressSuggestions: { state: true },
    addressActiveIndex: { state: true },
  };

  static get styles() { return neoPriceworkStyles; }

  constructor() {
    super();
    this.formMode = 'Nintex Cloud Form';
    this.addressProvider = ADDRESS_PROVIDERS.GOOGLE;
    this.apiKey = '';
    this.osPlacesApiKey = '';
    this.inputstr = '';
    this.inputobj = null;
    this.outputobj = { jobs: [], subtotal: 0, count: 0 };
    this.contracts = '';
    this.workItems = { items: [] };
    this.currency = '£';
    this.readOnly = false;
    this.reset = false;
    this.jobs = [];
    this.showModal = false;
    this.editingIndex = -1;
    this.formData = this.getEmptyForm();
    this.workItemQuery = '';
    this.inputStringError = '';

    // Address suggestions (Places API (New))
    this.addressSuggestions = [];
    this.addressActiveIndex = -1;
    this._placesSessionToken = null; // groups one engineer's search into one billed session
    this._addressLookupTimer = null;
    this._addressRequestSeq = 0; // ignores responses that arrive after newer typing
    this._addressAbort = null; // cancels an in-flight OS Places request
    this._warnedMissingAddressKey = false;
    this.detailsOpen = new Set();
    // Contracts whose selected-item group is expanded in the editor (the selected contract's by default).
    this.expandedItemGroups = new Set();
    this._designerReadOnly = this.readOnly;
    this._sharePointForcedReadOnly = false;

    // Reset state: the inputs that were cleared by the last reset (so the same input
    // re-sent by the host is not reloaded), and a flag for the update caused by the reset.
    this._resetInputSignature = null;
    this._resetApplying = false;
  }

  getEmptyForm() {
    return { id: '', address: '', uprn: '', contract: '', notes: '', items: [] };
  }

  updated(changed) {
    // However the editor closed (Close, Cancel, Save, Delete, Reset), stop any address lookup.
    if (changed.has('showModal') && !this.showModal) {
      this.clearAddressLookup();
    }
    // Keep the highlighted suggestion visible when moving through a long list (e.g. a postcode).
    if (changed.has('addressActiveIndex') && this.addressActiveIndex >= 0) {
      const option = this.renderRoot?.getElementById?.(`address-option-${this.addressActiveIndex}`);
      if (option) option.scrollIntoView({ block: 'nearest' });
    }
    // Switching provider or key while the editor is open: drop any suggestions from the old one.
    if (changed.has('addressProvider') || changed.has('apiKey') || changed.has('osPlacesApiKey')) {
      this.clearAddressLookup();
      this._warnedMissingAddressKey = false;
    }

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

    // This update was caused by resetComponent() clearing the inputs and switching Reset off.
    if (this._resetApplying) {
      this._resetApplying = false;
      return;
    }

    // Reset works like a button: act on true (including at first render), then switch off.
    if (changed.has('reset') && this.reset) {
      this.resetComponent();
      return;
    }

    if (changed.has('formMode') || changed.has('inputobj') || changed.has('inputstr')) {
      if (this._resetInputSignature !== null) {
        // After a reset, ignore the host re-sending the input that was just cleared, and
        // keep the reset state if only the form mode changed.
        const inputChanged = changed.has('inputobj') || changed.has('inputstr');
        if (!inputChanged || this.getInputSignature() === this._resetInputSignature) return;
        this._resetInputSignature = null;
      }
      this.loadConfiguredJobs();
    }
  }

  getInputSignature() {
    try {
      return JSON.stringify({
        obj: this.inputobj == null ? null : this.inputobj,
        str: typeof this.inputstr === 'string' ? this.inputstr.trim() : '',
      });
    } catch (error) {
      return null;
    }
  }

  // Return the component to the state it has on first load with blank inputs, then switch
  // Reset back off.
  resetComponent() {
    this._resetInputSignature = this.getInputSignature();
    this._resetApplying = true;
    this.reset = false;

    this.showModal = false;
    this.editingIndex = -1;
    this.formData = this.getEmptyForm();
    this.workItemQuery = '';
    this.detailsOpen = new Set();
    this.expandedItemGroups = new Set();
    this.inputStringError = '';
    this.inputobj = null;
    this.inputstr = '';
    this.jobs = [];

    this.clearAddressLookup();

    this.recomputeAndDispatch();
  }

  get isSharePointForm() {
    return (this.formMode || '').toLowerCase() === 'nintex sharepoint form';
  }

  get hasInputString() {
    return typeof this.inputstr === 'string' && this.inputstr.trim().length > 0;
  }

  loadConfiguredJobs() {
    // A populated string input always wins. Use the object input only when the string is blank.
    if (this.hasInputString) {
      this.inputStringError = '';
      this.loadFromInputSource(this.parseInputString(this.inputstr));
      return;
    }

    this.inputStringError = '';
    this.loadFromInputSource(this.inputobj);
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
        uprn: j.uprn == null ? '' : String(j.uprn).trim(),
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
      uprn: job.uprn == null ? '' : String(job.uprn),
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
    this.workItemQuery = '';
    this.expandedItemGroups = new Set([normaliseContract(this.formData.contract)]);
    this.showModal = true;
    this.prepareAddressLookup();
  }

  openEdit = (index) => {
    if (this.readOnly) return;
    const j = this.jobs[index];
    if (!j) return;
    this.formData = { ...this.getEmptyForm(), ...j };
    this.editingIndex = index;
    this.workItemQuery = '';
    this.expandedItemGroups = new Set([normaliseContract(this.formData.contract)]);
    this.showModal = true;
    this.prepareAddressLookup();
  }

  closeModal = () => { this.showModal = false; }

  onInput = (e, field) => {
    const value = e.target?.value;
    this.formData = { ...this.formData, [field]: value };
  }

  onContractChange = (e) => {
    const contract = e.target.value;
    // Selected items are kept; only the new contract's group is expanded (others can still be
    // opened by hand).
    this.formData = { ...this.formData, contract };
    this.expandedItemGroups = new Set([normaliseContract(contract)]);
  }

  toggleItemGroup = (contract) => {
    const next = new Set(this.expandedItemGroups);
    if (next.has(contract)) next.delete(contract); else next.add(contract);
    this.expandedItemGroups = next;
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

  // Work items that can be added to the job being edited (already-selected items and exact
  // duplicates are left out).
  // - Browsing (search box empty): only the selected contract's items, or only items without a
  //   contract when no contract is selected.
  // - Searching: items from every contract, best matches first, the selected contract's first
  //   among equal matches.
  getAvailableWorkItems() {
    const selectedKeys = new Set((this.formData.items || []).map(item => this.getWorkItemKey(item)));
    const selectedContract = normaliseContract(this.formData.contract);
    const all = Array.isArray(this.workItems?.items) ? this.workItems.items : [];
    const seen = new Set();
    const pool = [];
    all.forEach((w, order) => {
      if (!w || !w.name) return; // skip invalid items
      const key = this.getWorkItemKey(w);
      if (selectedKeys.has(key) || seen.has(key)) return;
      seen.add(key);
      pool.push({ w, order });
    });

    const q = (this.workItemQuery || '').trim().toLowerCase();
    if (!q) {
      return pool.filter(({ w }) => normaliseContract(w.contract) === selectedContract).map(({ w }) => w);
    }

    const words = q.split(/\s+/).filter(Boolean);
    const isSubsequence = (word, hay) => {
      let i = 0;
      for (const ch of word) {
        i = hay.indexOf(ch, i);
        if (i === -1) return false;
        i++;
      }
      return true;
    };
    // Lower score = better match.
    const scoreOf = (w) => {
      const code = String(w.itemCode || '').toLowerCase();
      const name = String(w.name || '').toLowerCase();
      const contract = normaliseContract(w.contract).toLowerCase();
      if (code && code === q) return 0;
      if (code && code.startsWith(q)) return 1;
      if (code && code.includes(q)) return 2;
      // Every word found in the code, name or contract, e.g. "eicr falkirk".
      const hay = `${code} ${name} ${contract}`;
      if (words.every(word => hay.includes(word))) return 3;
      // Loose fallback on the name (letters in order), used only when nothing better matches.
      if (words.every(word => isSubsequence(word, name))) return 4;
      return -1;
    };

    let matches = pool
      .map(entry => ({ ...entry, score: scoreOf(entry.w) }))
      .filter(entry => entry.score >= 0);
    if (matches.some(entry => entry.score < 4)) matches = matches.filter(entry => entry.score < 4);

    return matches
      .sort((a, b) =>
        a.score - b.score ||
        (normaliseContract(a.w.contract) === selectedContract ? 0 : 1) -
          (normaliseContract(b.w.contract) === selectedContract ? 0 : 1) ||
        normaliseContract(a.w.contract).localeCompare(normaliseContract(b.w.contract)) ||
        a.order - b.order)
      .map(({ w }) => w);
  }

  // Selected items grouped by contract for the editor: the selected contract's group first, then
  // groups in the order their first item was added. Each entry keeps the item's index in
  // formData.items so quantity changes and removal still target the right item.
  getSelectedItemGroups() {
    const selectedContract = normaliseContract(this.formData.contract);
    const groups = new Map();
    (this.formData.items || []).forEach((item, index) => {
      const contract = normaliseContract(item?.contract);
      if (!groups.has(contract)) groups.set(contract, { contract, entries: [], total: 0 });
      const group = groups.get(contract);
      group.entries.push({ item, index });
      group.total += this.itemTotal(item);
    });
    return Array.from(groups.values()).sort((a, b) =>
      (a.contract === selectedContract ? 0 : 1) - (b.contract === selectedContract ? 0 : 1));
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

  // Named removeJob (not remove) so it doesn't replace the built-in Element.remove(),
  // which the page or host may use to take the control out of the page.
  removeJob = (index) => {
    if (!Number.isInteger(index) || index < 0 || index >= this.jobs.length) return;
    this.jobs = this.jobs.filter((_, i) => i !== index);
    this.editingIndex = -1;
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

  // The list of work items to add (see getAvailableWorkItems for what is shown when).
  renderAvailableWorkItems() {
    const searching = !!(this.workItemQuery || '').trim();
    const selectedContract = normaliseContract(this.formData.contract);
    const matches = this.getAvailableWorkItems();
    const shown = searching ? matches.slice(0, WORK_ITEM_SEARCH_LIMIT) : matches;

    let empty = '';
    if (!matches.length) {
      if (searching) empty = `No work items match "${this.workItemQuery.trim()}".`;
      else if (selectedContract) empty = `No more work items for ${selectedContract}. Search to add items from any contract.`;
      else empty = 'Select a contract to see its work items, or search to find items from any contract.';
    }

    return html`
      ${empty ? html`<div class="avail-empty muted">${empty}</div>` : html`
        <div class="avail-list" role="list" aria-label=${searching ? 'Matching work items' : `Work items for ${selectedContract || 'no contract'}`}>
          ${shown.map(w => {
            const contract = normaliseContract(w.contract);
            return html`
              <div class="avail-row" role="listitem">
                <div class="avail-main">
                  <div class="avail-title">${w.name}</div>
                  <div class="avail-meta">
                    <span class="avail-price">${this.currency}${Number(w.price).toFixed(2)}</span>
                    <span class="pill pill-sm ${contract === selectedContract ? '' : 'pill-muted'}">${contract || 'No contract'}</span>
                  </div>
                </div>
                <div class="avail-actions">
                  <button class="icon-btn success" @click=${()=>this.addWorkItem(w)}
                    aria-label=${`Add ${w.name}${contract ? ` (${contract})` : ''}`} title="Add">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    </svg>
                  </button>
                </div>
              </div>
            `;
          })}
        </div>
        ${searching && matches.length > shown.length ? html`
          <div class="avail-note muted">Showing ${shown.length} of ${matches.length} matches. Keep typing to narrow the list.</div>
        ` : ''}
      `}
    `;
  }

  // Selected work items, grouped by contract with a subtotal per contract.
  renderSelectedItems() {
    const groups = this.getSelectedItemGroups();
    if (!groups.length) return html`<div class="muted">No items selected yet.</div>`;
    return html`
      <div class="list-table">
        <div class="list-head sm">
          <div>Selected Work Item</div>
          <div class="center">Price</div>
          <div class="center">Qty</div>
          <div class="center">Cost</div>
          <div></div>
        </div>
        ${groups.map((group, groupIndex) => {
          const name = group.contract || 'No contract';
          const expanded = this.expandedItemGroups.has(group.contract);
          const bodyId = `item-group-${groupIndex}`;
          return html`
          <div class="item-group ${expanded ? 'expanded' : 'collapsed'}" role="group" aria-label=${`${name} work items`}>
            <button type="button" class="item-group-head" aria-expanded=${expanded ? 'true' : 'false'} aria-controls=${bodyId}
              @click=${() => this.toggleItemGroup(group.contract)}>
              <svg class="item-group-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span class="item-group-name">${name}</span>
              <span class="item-group-total">${group.entries.length} item${group.entries.length === 1 ? '' : 's'} · ${this.currency}${group.total.toFixed(2)}</span>
            </button>
            <div class="item-group-body" id=${bodyId} ?hidden=${!expanded}>
            ${group.entries.map(({ item: it, index: idx }) => html`
              <div class="list-row">
                <div class="cell-name">
                  <div class="title">${it.name}</div>
                </div>
                <div class="cell-numbers">
                  <div class="cell-unit"><span class="cell-label">Price </span><span class="sm">${this.currency}${Number(it.price).toFixed(2)}</span></div>
                  <div class="cell-qty"><span class="cell-label">Qty </span><input class="qty-input" type="number" min="0" step="1" inputmode="numeric" aria-label=${`Quantity for ${it.name}`} .value=${String(it.quantity ?? 0)} @input=${(e)=>this.updateItemQty(idx, e)} /></div>
                  <div class="cell-cost"><span class="cell-label">Cost </span><span class="total">${this.currency}${this.itemTotal(it).toFixed(2)}</span></div>
                </div>
                <div class="cell-remove">
                  <button class="icon-btn" title="Remove" aria-label=${`Remove ${it.name}`} @click=${()=>this.removeSelectedItem(idx)}>
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
          </div>
        `;
        })}
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
                ${this.renderAddressField()}
              </div>
              <div class="form-group" style="grid-column: 1 / -1;">
                <label>Contract</label>
                <select .value=${this.formData.contract} @change=${this.onContractChange}>
                  <option value="">Select contract</option>
                  ${this.getContractOptions().map(c => html`<option value="${c}">${c}</option>`)}
                </select>
              </div>
              <div class="form-group" style="grid-column: 1 / -1;">
                <label for="workItemSearch">Work Items</label>
                <input id="workItemSearch" type="search" placeholder="Search all contracts by code or name"
                  .value=${this.workItemQuery} autocomplete="off"
                  @input=${(e)=>{ this.workItemQuery = e.target.value; }} />
                ${this.renderAvailableWorkItems()}
              </div>
              <div class="form-group" style="grid-column: 1 / -1;">
                ${this.renderSelectedItems()}
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
              ${editing ? html`<button class="btn btn-danger" @click=${()=>this.removeJob(this.editingIndex)}>Delete</button>` : ''}
              <button class="btn btn-outline" @click=${this.closeModal}>Cancel</button>
              <button class="btn btn-primary" @click=${this.save} ?disabled=${!(this.formData.items?.length>0)}>Save</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ======== Address suggestions (Google Maps or OS Places) ========
  // Suggestions are requested as the engineer types and shown under the address box. Picking
  // one fills in the address (and, with OS Places, its UPRN); typed text is otherwise kept
  // exactly as typed. The provider is chosen by the "Address Lookup Provider" property.
  //
  // Billing:
  // - Google Maps: all requests for one search share a session token, and picking a suggestion
  //   makes one Place Details request for formattedAddress only (the Essentials level), which
  //   ends the session.
  // - OS Places: each search request is billed as an OS Data Hub transaction; picking a result
  //   makes no further request (the address and UPRN are already in the results).

  get addressLookupProvider() {
    return this.addressProvider === ADDRESS_PROVIDERS.OS ? 'os' : 'google';
  }

  get addressLookupKey() {
    const key = this.addressLookupProvider === 'os' ? this.osPlacesApiKey : this.apiKey;
    return typeof key === 'string' ? key.trim() : '';
  }

  // Called when the editor opens. Google: start loading the Places library so the first
  // suggestions are quick. OS Places needs nothing loaded.
  prepareAddressLookup() {
    if (!this.addressLookupKey) {
      if (!this._warnedMissingAddressKey) {
        this._warnedMissingAddressKey = true;
        // eslint-disable-next-line no-console
        console.info(`neo-pricework: no ${this.addressLookupProvider === 'os' ? 'OS Places' : 'Google Maps'} API key set; address suggestions are off.`);
      }
      return;
    }
    if (this.addressLookupProvider === 'google') {
      loadPlacesLibrary(this.addressLookupKey).catch((error) => {
        // eslint-disable-next-line no-console
        console.warn('neo-pricework: address suggestions unavailable:', error);
      });
    }
  }

  // Stop any pending lookup and close the suggestions. An unfinished Google session is simply
  // billed per suggestion request; the next search starts a new session.
  clearAddressLookup() {
    this.closeAddressSuggestions();
    this._placesSessionToken = null;
  }

  closeAddressSuggestions() {
    clearTimeout(this._addressLookupTimer);
    this._addressLookupTimer = null;
    this._addressRequestSeq++;
    if (this._addressAbort) {
      this._addressAbort.abort();
      this._addressAbort = null;
    }
    if (this.addressSuggestions.length) this.addressSuggestions = [];
    if (this.addressActiveIndex !== -1) this.addressActiveIndex = -1;
  }

  onAddressTyping = (e) => {
    const value = e.target.value;
    // A typed change means any UPRN for the previous address no longer applies.
    this.formData = { ...this.formData, address: value, uprn: '' };

    clearTimeout(this._addressLookupTimer);
    if (!this.addressLookupKey || value.trim().length < ADDRESS_LOOKUP_MIN_CHARS) {
      this.closeAddressSuggestions();
      return;
    }
    this._addressLookupTimer = setTimeout(() => this.fetchAddressSuggestions(value), ADDRESS_LOOKUP_DELAY_MS);
  }

  async fetchAddressSuggestions(text) {
    const seq = ++this._addressRequestSeq;
    if (this._addressAbort) this._addressAbort.abort();
    const abort = new AbortController();
    this._addressAbort = abort;
    try {
      const suggestions = this.addressLookupProvider === 'os'
        ? await this.fetchOsPlacesSuggestions(text, abort.signal)
        : await this.fetchGoogleSuggestions(text, seq);
      // Ignore the response if the engineer has typed more, picked something or closed the editor.
      if (!suggestions || seq !== this._addressRequestSeq || !this.showModal || this.formData.address !== text) return;
      this.addressSuggestions = suggestions;
      this.addressActiveIndex = -1;
    } catch (error) {
      if (error?.name === 'AbortError' || seq !== this._addressRequestSeq) return;
      this.addressSuggestions = [];
      // eslint-disable-next-line no-console
      console.warn('neo-pricework: address suggestions failed:', error);
    } finally {
      if (this._addressAbort === abort) this._addressAbort = null;
    }
  }

  // Google Maps (Places API (New)), UK addresses only. Returns null if superseded.
  async fetchGoogleSuggestions(text, seq) {
    const places = await loadPlacesLibrary(this.addressLookupKey);
    if (seq !== this._addressRequestSeq) return null;
    if (!this._placesSessionToken) this._placesSessionToken = new places.AutocompleteSessionToken();
    const { suggestions } = await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
      input: text,
      sessionToken: this._placesSessionToken,
      includedPrimaryTypes: ADDRESS_PLACE_TYPES,
      includedRegionCodes: GOOGLE_REGION_CODES,
    });
    return (suggestions || [])
      .filter((s) => s.placePrediction)
      .slice(0, ADDRESS_MAX_SUGGESTIONS)
      .map((s) => ({
        provider: 'google',
        text: s.placePrediction.text.toString(),
        mainText: s.placePrediction.mainText ? s.placePrediction.mainText.toString() : '',
        secondaryText: s.placePrediction.secondaryText ? s.placePrediction.secondaryText.toString() : '',
        prediction: s.placePrediction,
      }));
  }

  // OS Places API. A full postcode lists every address at it; anything else is a free-text
  // search for the best matches.
  async fetchOsPlacesSuggestions(text, signal) {
    const query = text.trim();
    const isPostcode = UK_POSTCODE.test(query);
    const records = isPostcode
      ? await fetchOsPlaces('postcode', { postcode: query, maxresults: OS_POSTCODE_MAX_RESULTS }, this.addressLookupKey, signal)
      : await fetchOsPlaces('find', { query, maxresults: ADDRESS_MAX_SUGGESTIONS }, this.addressLookupKey, signal);
    const seen = new Set();
    return records
      .map(osSuggestion)
      .filter((s) => {
        const id = s.uprn || s.address;
        if (!s.address || seen.has(id)) return false;
        seen.add(id);
        return true;
      })
      .slice(0, isPostcode ? OS_POSTCODE_MAX_RESULTS : ADDRESS_MAX_SUGGESTIONS);
  }

  async selectAddressSuggestion(suggestion) {
    if (!suggestion) return;
    const editingId = this.formData.id;
    this.closeAddressSuggestions();

    if (suggestion.provider === 'os') {
      // The OS result already has the address and UPRN; no further request.
      this.formData = { ...this.formData, address: suggestion.address, uprn: suggestion.uprn };
      return;
    }

    let address = suggestion.text;
    try {
      // Ends the Google session: one Place Details request for the formatted address only.
      const place = suggestion.prediction.toPlace();
      await place.fetchFields({ fields: ['formattedAddress'] });
      if (place.formattedAddress) address = place.formattedAddress;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('neo-pricework: could not fetch the formatted address; using the suggestion text:', error);
    }
    this._placesSessionToken = null; // the next search is a new session
    // Only apply if the same job is still being edited.
    if (!this.showModal || this.formData.id !== editingId) return;
    this.formData = { ...this.formData, address, uprn: '' };
  }

  onAddressKeydown = (e) => {
    const count = this.addressSuggestions.length;
    if (!count) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.addressActiveIndex = (this.addressActiveIndex + 1) % count;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.addressActiveIndex = this.addressActiveIndex <= 0 ? count - 1 : this.addressActiveIndex - 1;
    } else if (e.key === 'Enter' && this.addressActiveIndex >= 0) {
      e.preventDefault();
      this.selectAddressSuggestion(this.addressSuggestions[this.addressActiveIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      this.closeAddressSuggestions();
    }
  }

  onAddressBlur = () => {
    // Keep whatever was typed; just close the suggestions. (Picking a suggestion doesn't blur
    // the box because the options cancel mousedown.)
    this.closeAddressSuggestions();
  }

  // Attribution each provider requires alongside its results.
  renderAddressAttribution() {
    return this.addressLookupProvider === 'os'
      ? `Contains OS data © Crown copyright and database rights ${new Date().getFullYear()}`
      : 'Google Maps';
  }

  renderAddressField() {
    const suggestions = this.addressSuggestions || [];
    const open = suggestions.length > 0;
    const active = this.addressActiveIndex;
    return html`
      <div class="address-field">
        <input id="addressInput" type="text" .value=${this.formData.address || ''}
          role="combobox" aria-autocomplete="list" aria-expanded=${open ? 'true' : 'false'}
          aria-controls="addressSuggestions"
          aria-activedescendant=${open && active >= 0 ? `address-option-${active}` : nothing}
          autocomplete="off"
          @input=${this.onAddressTyping}
          @keydown=${this.onAddressKeydown}
          @blur=${this.onAddressBlur}
          placeholder=${this.addressLookupProvider === 'os' ? 'Search for an address or postcode' : 'Search for an address'} />
        ${open ? html`
          <ul id="addressSuggestions" class="address-suggestions" role="listbox" aria-label="Address suggestions">
            ${suggestions.map((s, i) => html`
              <li id="address-option-${i}" role="option" aria-selected=${i === active ? 'true' : 'false'}
                class="address-option ${i === active ? 'active' : ''}"
                @mousedown=${(e) => e.preventDefault()}
                @mouseenter=${() => { this.addressActiveIndex = i; }}
                @click=${() => this.selectAddressSuggestion(s)}>
                <span class="address-main">${s.mainText || s.text}</span>
                ${s.secondaryText ? html`<span class="address-secondary">${s.secondaryText}</span>` : ''}
              </li>
            `)}
            <li class="address-attribution" role="presentation" aria-hidden="true">${this.renderAddressAttribution()}</li>
          </ul>
        ` : ''}
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
