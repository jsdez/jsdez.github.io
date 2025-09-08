import { LitElement, html, css } from 'lit';

class AddressControl extends LitElement {
  static getMetaConfig() {
    // plugin contract information
    return {
      controlName: 'neo-address',
      fallbackDisableSubmit: false,
      description: 'Google Maps address lookup control',
      iconUrl: "address-finder",
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
        value: {
          type: 'string',
          title: 'Address',
          description: 'The address selected by the user',
          isValueField: true,
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
    isUserInput: { type: Boolean, state: true },
  };

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: var(--ntx-form-theme-font-family, Arial, sans-serif);
      }
      
      .address-container {
        width: 100%;
        margin-bottom: 16px;
      }
      
      .address-input {
        width: 100%;
        padding: 10px;
        border: 1px solid var(--ntx-form-theme-color-border, #ccc);
        border-radius: var(--ntx-form-theme-border-radius, 4px);
        font-size: var(--ntx-form-theme-text-input-size, 16px);
        box-sizing: border-box;
        color: var(--ntx-form-theme-color-input-text, #000);
        background-color: var(--ntx-form-theme-color-input-background, #fff);
        height: var(--ntx-form-theme-control-height, auto);
      }
      
      .address-input:focus {
        border-color: var(--ntx-form-theme-color-primary, #4285f4);
        outline: none;
        box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.25);
      }
      
      .required-marker {
        color: var(--ntx-form-theme-color-error, red);
        margin-left: 4px;
      }
      
      .field-label {
        display: block;
        font-weight: bold;
        margin-bottom: 5px;
        font-size: var(--ntx-form-theme-text-label-size, 14px);
      }
      
      .field-description {
        display: block;
        color: var(--ntx-form-theme-color-text-secondary, #666);
        font-size: var(--ntx-form-theme-text-label-size, 14px);
        margin-bottom: 5px;
      }
      
      .error-text {
        color: var(--ntx-form-theme-color-error, red);
        font-size: var(--ntx-form-theme-text-label-size, 14px);
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
    this.isUserInput = false;
    this.previousValue = '';
    this.lastResolvedValue = ''; // Track the last value we resolved to avoid re-resolving
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadGoogleMapsAPI();
    
    if (this.defaultAddress) {
      this.value = this.defaultAddress;
    }
    
    // Store initial value to track changes
    this.previousValue = this.value;
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    
    // Check if value was changed programmatically (not by user input)
    if (changedProperties.has('value') && !this.isUserInput) {
      const newValue = this.value;
      const oldValue = this.previousValue;
      
      // Only attempt resolution if value actually changed and it's not empty
      if (newValue !== oldValue && newValue && newValue.trim()) {
        this.resolveAddressProgrammatically(newValue);
      }
      
      this.previousValue = newValue;
    }
    
    // Reset user input flag after processing
    this.isUserInput = false;
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
        
        this.isUserInput = true;
        this.value = place.formatted_address;
        this.previousValue = this.value;
        this.lastResolvedValue = this.value; // Mark this as already resolved
        this.dispatchNintexValueChange();
      });

      // Initialize Places Service for programmatic address resolution
      this.placesService = new google.maps.places.PlacesService(document.createElement('div'));
    }, 100);
  }

  resolveAddressProgrammatically(addressText) {
    // Only attempt resolution if Google Maps is loaded and we have a PlacesService
    if (!this.loaded || !window.google || !window.google.maps || !this.placesService) {
      console.log('Google Maps not ready, keeping address as text:', addressText);
      return;
    }

    const request = {
      query: addressText,
      fields: ['formatted_address', 'geometry', 'name']
    };

    this.placesService.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
        const place = results[0];
        if (place.formatted_address) {
          // Only update if the formatted address is different from what we have
          if (place.formatted_address !== this.value) {
            this.value = place.formatted_address;
            this.previousValue = this.value;
            this.lastResolvedValue = this.value; // Mark as resolved
            console.log('Resolved address programmatically:', place.formatted_address);
            this.dispatchNintexValueChange();
            this.requestUpdate(); // Force re-render to update input field
          }
        }
      } else {
        // If we can't resolve the address, keep it as text
        console.log('Could not resolve address via API, keeping as text:', addressText);
        // No need to update anything, the value stays as provided
      }
    });
  }
  
  dispatchNintexValueChange() {
    // This is the correct event format for Nintex integration
    const event = new CustomEvent('ntx-value-change', {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: this.value
    });
    this.dispatchEvent(event);
  }
  
  handleInput(e) {
    // Mark this as user input and update the internal value
    this.isUserInput = true;
    this.value = e.target.value;
    this.previousValue = this.value;
  }
  
  validateInput() {
    const errorElement = this.shadowRoot.querySelector('.error-text');
    if (this.required && !this.value) {
      errorElement.classList.add('visible');
      return false;
    } else {
      errorElement.classList.remove('visible');
    }
    
    // Attempt to resolve the address if user typed something and moved away
    if (this.value && this.value.trim() && this.isUserInput) {
      this.resolveUserTypedAddress(this.value);
    }
    
    // Trigger the Nintex value change event when focus leaves the field
    this.dispatchNintexValueChange();
    return true;
  }

  resolveUserTypedAddress(addressText) {
    // Only attempt resolution if Google Maps is loaded and we have a PlacesService
    if (!this.loaded || !window.google || !window.google.maps || !this.placesService) {
      console.log('Google Maps not ready, keeping user typed address as text:', addressText);
      return;
    }

    // Don't resolve if we already resolved this exact text
    if (addressText === this.lastResolvedValue) {
      console.log('Address already resolved, skipping:', addressText);
      return;
    }

    const request = {
      query: addressText,
      fields: ['formatted_address', 'geometry', 'name']
    };

    this.placesService.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
        const place = results[0];
        if (place.formatted_address) {
          // Update to the formatted address from Google
          this.value = place.formatted_address;
          this.previousValue = this.value;
          this.lastResolvedValue = this.value; // Mark as resolved
          console.log('Resolved user typed address:', place.formatted_address);
          this.dispatchNintexValueChange();
          this.requestUpdate(); // Force re-render to update input field
        }
      } else {
        // If we can't resolve the address, keep the user's input as-is
        console.log('Could not resolve user typed address via API, keeping as text:', addressText);
        // Mark the current text as "attempted to resolve" to avoid repeated attempts
        this.lastResolvedValue = addressText;
      }
    });
  }

  render() {
    return html`
      <div class="address-container" part="address-container">
        <input
          id="addressInput"
          class="address-input"
          part="address-input"
          type="text"
          placeholder="Search for an address"
          .value="${this.value}"
          ?disabled="${this.readOnly}"
          @input="${this.handleInput}"
          @blur="${this.validateInput}"
          @change="${this.validateInput}"
        />
        <div class="error-text" part="error-text">This field is required</div>
      </div>
    `;
  }
}

customElements.define('neo-address', AddressControl);