import { LitElement, html, css } from 'lit';

class AddressControl extends LitElement {
  static getMetaConfig() {
    // plugin contract information
    return {
      controlName: 'neo-address',
      fallbackDisableSubmit: false,
      description: 'Google Maps address lookup control',
      iconUrl: "",
      groupName: 'NEO',
      version: '1.0',
      properties: {
        apiKey: {
          type: 'string',
          title: 'Enter the Google Maps API key',
          description: 'Please provide your Google Maps API key'
        },
        defaultAddress: {
          type: 'string',
          title: 'Default Address',
          description: 'Enter the address to be displayed by default',
        },
      },
      standardProperties: {
        fieldLabel: true,
        description: true,
        value: true,
        readOnly: true,
        required: true,
        visibility: true
      }
    };
  }

  static properties = {
    apiKey: { type: String },
    defaultAddress: { type: String },
    value: { type: String },
    readOnly: { type: Boolean },
    required: { type: Boolean },
    fieldLabel: { type: String },
    description: { type: String },
    loaded: { type: Boolean, state: true },
    placesService: { type: Object, state: true },
    autocomplete: { type: Object, state: true },
  };

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: Arial, sans-serif;
      }
      
      .address-container {
        width: 100%;
        margin-bottom: 16px;
      }
      
      .address-input {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 16px;
        box-sizing: border-box;
      }
      
      .address-input:focus {
        border-color: #4285f4;
        outline: none;
        box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.25);
      }
      
      .required-marker {
        color: red;
        margin-left: 4px;
      }
      
      .field-label {
        display: block;
        font-weight: bold;
        margin-bottom: 5px;
      }
      
      .field-description {
        display: block;
        color: #666;
        font-size: 14px;
        margin-bottom: 5px;
      }
      
      .error-text {
        color: red;
        font-size: 14px;
        margin-top: 5px;
        display: none;
      }
      
      .error-text.visible {
        display: block;
      }
    `;
  }
  
  constructor() {
    super();
    this.apiKey = '';
    this.defaultAddress = '';
    this.value = '';
    this.readOnly = false;
    this.required = false;
    this.fieldLabel = 'Address';
    this.description = '';
    this.loaded = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadGoogleMapsAPI();
    
    if (this.defaultAddress) {
      this.value = this.defaultAddress;
    }
  }
  
  loadGoogleMapsAPI() {
    if (!this.apiKey) {
      console.error('Google Maps API key is missing');
      return;
    }
    
    if (window.google && window.google.maps) {
      this.initializeAddressAutocomplete();
      return;
    }
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      this.loaded = true;
      this.initializeAddressAutocomplete();
    };
    
    script.onerror = () => {
      console.error('Failed to load Google Maps API');
    };
    
    document.head.appendChild(script);
  }
  
  initializeAddressAutocomplete() {
    // We need to wait for the DOM to be updated and the input element to be available
    setTimeout(() => {
      const inputElement = this.shadowRoot.querySelector('#addressInput');
      if (!inputElement) return;
      
      this.autocomplete = new google.maps.places.Autocomplete(inputElement, {
        types: ['address']
      });
      
      this.autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete.getPlace();
        if (!place.formatted_address) {
          console.warn('No formatted address found for this place');
          return;
        }
        
        this.value = place.formatted_address;
        this.dispatchValueChangedEvent();
      });
    }, 100);
  }
  
  dispatchValueChangedEvent() {
    const customEvent = new CustomEvent('valueChanged', {
      bubbles: true,
      composed: true,
      detail: {
        value: this.value
      }
    });
    this.dispatchEvent(customEvent);
  }
  
  handleInput(e) {
    this.value = e.target.value;
    this.dispatchValueChangedEvent();
  }
  
  validateInput() {
    const errorElement = this.shadowRoot.querySelector('.error-text');
    if (this.required && !this.value) {
      errorElement.classList.add('visible');
      return false;
    } else {
      errorElement.classList.remove('visible');
      return true;
    }
  }

  render() {
    return html`
      ${this.fieldLabel ? html`
        <label class="field-label">
          ${this.fieldLabel}
          ${this.required ? html`<span class="required-marker">*</span>` : ''}
        </label>
      ` : ''}
      
      ${this.description ? html`
        <span class="field-description">${this.description}</span>
      ` : ''}
      
      <div class="address-container">
        <input
          id="addressInput"
          class="address-input"
          type="text"
          placeholder="Search for an address"
          .value="${this.value}"
          ?disabled="${this.readOnly}"
          @input="${this.handleInput}"
          @blur="${this.validateInput}"
        />
        <div class="error-text">This field is required</div>
      </div>
    `;
  }
}

customElements.define('neo-address', AddressControl);