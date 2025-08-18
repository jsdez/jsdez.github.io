import { LitElement, html, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import { PluginContract } from '@nintex/form-plugin-contract';

// Define the contract information using @nintex/form-plugin-contract
const rsElementContract: PluginContract = {
  version: '1.0',
  fallbackDisableSubmit: false,
  controlName: 'neo-rs-filler',
  description: 'Repeating section manipulator',
  iconUrl: 'repeating-section',
  groupName: 'NEO',
  properties: {
    rsvalues: {
      type: 'string',
      title: 'Control values',
      description: 'Please ensure you first store the array as text in a form variable',
    },
    rstarget: {
      type: 'string',
      title: 'CSS class of the Repeating Section',
      description: 'Class name used to target repeating section',
    },
    rsfieldtarget: {
      type: 'string',
      title: 'CSS class of the field',
      description: 'Class name used to target the text field in the repeating section',
    },
    primaryFiller: {
      type: 'boolean',
      title: 'Primary Filler',
      description: 'When true, this component manages row count (add/remove). When false, only fills data in existing rows.',
      defaultValue: false,
    },
  },
  standardProperties: {
    fieldLabel: false,
    description: false,
    visibility: true,
  },
};

class rsElement extends LitElement {
  @property({ type: String }) rsvalues: string = '';
  @property({ type: String }) rstarget: string = '';
  @property({ type: String }) rsfieldtarget: string = '';
  @property({ type: Boolean }) primaryFiller: boolean = false;

  // internal guards
  private _isRunning = false;
  private _lastApplied: string | null = null;

  constructor() {
    super();
    this.rsvalues = '';
    this.rstarget = '';
    this.rsfieldtarget = '';
    this.primaryFiller = false;
  }

  firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    this.runActions();
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('rsvalues') || changedProperties.has('rstarget') || changedProperties.has('rsfieldtarget') || changedProperties.has('primaryFiller')) {
      this.runActions();
    }
  }

  // Utility: wait for an element to appear in the main document
  private async waitForElement<T extends Element = Element>(selector: string, timeout = 8000): Promise<T | null> {
    const root = this.ownerDocument || document;
    const existing = root.querySelector(selector) as T | null;
    if (existing) return existing;
    return new Promise<T | null>((resolve) => {
      const obs = new MutationObserver(() => {
        const el = root.querySelector(selector) as T | null;
        if (el) {
          obs.disconnect();
          resolve(el);
        }
      });
      obs.observe(root.documentElement, { childList: true, subtree: true });
      setTimeout(() => {
        obs.disconnect();
        resolve(null);
      }, timeout);
    });
  }

  // Function to detect the format of the input data
  private detectInputFormat(input: string): { format: string; confidence: number; details: string } {
    const trimmed = input.trim();

    if (!trimmed) {
      return { format: 'empty', confidence: 1.0, details: 'No input provided' };
    }

    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return { 
            format: 'json-array', 
            confidence: 0.95, 
            details: `Valid JSON array with ${parsed.length} items` 
          };
        }
      } catch (e) {
        return { 
          format: 'malformed-json', 
          confidence: 0.8, 
          details: 'Looks like JSON array but has syntax errors' 
        };
      }
    }

    if (trimmed.includes(',') && !trimmed.includes('[') && !trimmed.includes('{')) {
      const commaCount = (trimmed.match(/,/g) || []).length;
      return { 
        format: 'csv', 
        confidence: 0.8, 
        details: `Comma-separated values (${commaCount + 1} items)` 
      };
    }

    return { 
      format: 'single-value', 
      confidence: 0.9, 
      details: 'Single text value' 
    };
  }

  // Function to parse input data based on detected format
  private parseInputData(input: string): any[] {
    const detection = this.detectInputFormat(input);
    const trimmed = input.trim();

    switch (detection.format) {
      case 'empty':
        return [];

      case 'json-array':
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        } catch (e) {
          console.error('[neo-rs-filler] Failed to parse JSON array:', e);
        }
        return [];

      case 'csv':
        return trimmed.split(',').map(item => item.trim());

      case 'single-value':
        return [trimmed];

      default:
        console.warn('[neo-rs-filler] Unsupported input format:', detection);
        return [];
    }
  }

  private async runActions() {
    console.log('[neo-rs-filler] runActions called', {
      rstarget: this.rstarget,
      rsfieldtarget: this.rsfieldtarget,
      rsvalues: this.rsvalues,
      primaryFiller: this.primaryFiller,
    });

    const targetClassName = (this.rstarget || '').trim();
    const fieldTargetClassName = (this.rsfieldtarget || '').trim();
    const valuesString = (this.rsvalues || '').trim();

    if (!targetClassName) {
      console.warn('[neo-rs-filler] No target class specified');
      return;
    }

    if (!fieldTargetClassName) {
      console.warn('[neo-rs-filler] No field target class specified');
      return;
    }

    if (!valuesString) {
      console.warn('[neo-rs-filler] No values specified');
      return;
    }

    if (this._isRunning) {
      console.log('[neo-rs-filler] Already running, skipping');
      return;
    }

    this._isRunning = true;

    try {
      const rsHost = await this.waitForElement(`.${targetClassName}`);
      if (!rsHost) {
        console.warn('[neo-rs-filler] Repeating section not found:', targetClassName);
        return;
      }

      console.log('[neo-rs-filler] Found RS host:', rsHost);

      const valuesArray = this.parseInputData(valuesString);
      console.log('[neo-rs-filler] Parsed values array:', valuesArray);

      const currentRows = rsHost.querySelectorAll('.ntx-repeating-section-repeated-section');
      const rowsToFill = Math.min(valuesArray.length, currentRows.length);

      for (let i = 0; i < rowsToFill; i++) {
        const row = currentRows[i];
        const inputField = row.querySelector(`.${fieldTargetClassName}`);
        if (inputField) {
          (inputField as HTMLInputElement).value = valuesArray[i];
          inputField.dispatchEvent(new Event('input', { bubbles: true }));
          inputField.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    } catch (error) {
      console.error('[neo-rs-filler] Error during runActions:', error);
    } finally {
      this._isRunning = false;
    }
  }

  render() {
    return html`
      <div>
        <div>Raw rsvalues: ${this.rsvalues || '(empty)'}</div>
        <div>Mode: ${this.primaryFiller ? 'Primary (manages rows)' : 'Secondary (fills only)'}</div>
      </div>
    `;
  }

  // Include the contract information using @nintex/form-plugin-contract
  static getMetaConfig(): PluginContract {
    return rsElementContract;
  }
}

customElements.define('neo-rs-filler', rsElement);