import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PluginContract } from '@nintex/form-plugin-contract';

@customElement('neo-template')
export class TemplateElement extends LitElement {
  @property({ type: String })
  value: string = '';

  @property({ type: String })
  inputValue: string = '';

  static getMetaConfig(): PluginContract {
    // plugin contract information
    return {
      version: '1.0.5',
      controlName: 'neo-template',
      fallbackDisableSubmit: false,
      description: '',
      iconUrl: "",
      groupName: 'NEO',
      properties: {
        inputValue: {
          type: 'string',
          title: 'Input value',
          description: 'Please provide the input value'
        },
        value: {
          type: 'string',
          title: 'Value',
          description: 'The processed output value',
          isValueField: true,
        }
      },
      standardProperties: {
        fieldLabel: true,
        description: true,
      }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: var(--font-family, sans-serif);
      }
      
      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }
      
      input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1rem;
        box-sizing: border-box;
      }
      
      input:focus {
        outline: none;
        border-color: #007acc;
        box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
      }
      
      .output {
        margin-top: 1rem;
        padding: 0.75rem;
        background-color: #f5f5f5;
        border-radius: 4px;
        border-left: 4px solid #007acc;
      }
      
      .output strong {
        color: #333;
      }
    `;
  }
  
  constructor() {
    super();
  }

  render(): TemplateResult {
    return html`
      <div>
        <label for="input">Enter text:</label>
        <input 
          id="input"
          type="text" 
          .value=${this.inputValue} 
          @input=${this._onInput}
          placeholder="Type something..."
        />
        <div class="output">
          <strong>Processed value:</strong> ${this.value}
        </div>
      </div>
    `;
  }

  private _onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.inputValue = target.value;
    
    // Process the input value (example: convert to uppercase)
    const processedValue = this.inputValue.toUpperCase();
    
    // Update the plugin's stored value
    this._updateValue(processedValue);
  }

  private _updateValue(newValue: string): void {
    this.value = newValue;
    
    // Emit the ntx-value-change event to notify the form
    const args = {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: newValue,
    };
    const event = new CustomEvent('ntx-value-change', args);
    this.dispatchEvent(event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'neo-template': TemplateElement;
  }
}
