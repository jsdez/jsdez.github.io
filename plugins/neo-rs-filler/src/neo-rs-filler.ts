import { LitElement, html, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import { PluginContract, PropType as PluginProperty } from '@nintex/form-plugin-contract';

// Define the contract information using @nintex/form-plugin-contract
const rsElementContract: PluginContract = {
  version: '1.0',
  fallbackDisableSubmit: false,
  controlName: 'neo-rs-filler',
  description: 'Repeating section manipulator',
  iconUrl: 'repeating-section',
  groupName: 'Form Tools',
  properties: {
    rsvalues: {
      type: 'string',
      title: 'Control values',
      description: 'Please ensure you first store the array a form variable as text first',
    },
    rstarget: {
      type: 'string',
      title: 'CSS class of the Repeating Section',
      description: 'Class name used to target repeating section',
    },
    rsfieldtarget: {
      type: 'string',
      title: 'CSS class of the field',
      description: 'Class name used to target field in the repeating section',
    },
    rsfieldtype: {
      type: 'string',
      enum: ['string', 'number','integer','boolean','object','array','datetime'],
      title: 'Field type in the Repeating Section',
      description: 'data type of the field in the repeating section',
      defaultValue: 'string',
    },
  },
  standardProperties: {
    fieldLabel: true,
    description: true,
  },
};

class rsElement extends LitElement {
  @property({ type: String }) rsvalues: string = '';
  @property({ type: String }) rstarget: string = '';
  @property({ type: String }) rsfieldtarget: string = '';
  @property({ type: String }) rsfieldtype: string = 'string';

  // internal guards
  private _isRunning = false;
  private _lastApplied: string | null = null;

  constructor() {
    super();
    this.rsvalues = '';
    this.rstarget = '';
    this.rsfieldtarget = '';
    this.rsfieldtype = 'string';
  }

  firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    this.runActions();
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('rsvalues') || changedProperties.has('rstarget') || changedProperties.has('rsfieldtarget')) {
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

  // Try to find the "Add" button for the targeted repeating section
  private findAddButton(rsHost: Element): HTMLButtonElement | null {
    console.log('[neo-rs-filler] Looking for add button in/near:', rsHost);
    
    // The button is actually a sibling of the ntx-repeating-section parent
    const ntxRepeatingSection = rsHost.closest('ntx-repeating-section');
    console.log('[neo-rs-filler] Parent ntx-repeating-section:', ntxRepeatingSection);
    
    if (ntxRepeatingSection) {
      // Look for the button as next sibling of ntx-repeating-section
      const next = ntxRepeatingSection.nextElementSibling as HTMLElement | null;
      console.log('[neo-rs-filler] Next sibling of ntx-repeating-section:', next);
      
      if (next && next.classList.contains('btn-repeating-section-new-row')) {
        console.log('[neo-rs-filler] Found add button as next sibling:', next);
        return next as HTMLButtonElement;
      }
      
      // Also check if the button is inside the ntx-repeating-section
      const btn = ntxRepeatingSection.querySelector<HTMLButtonElement>('.btn-repeating-section-new-row');
      if (btn) {
        console.log('[neo-rs-filler] Found add button inside ntx-repeating-section:', btn);
        return btn;
      }
    }
    
    // Fallback: look for button anywhere in the document near our target
    const allAddButtons = document.querySelectorAll('.btn-repeating-section-new-row');
    console.log('[neo-rs-filler] All add buttons in document:', allAddButtons.length, allAddButtons);
    
    // If there's only one, use it
    if (allAddButtons.length === 1) {
      console.log('[neo-rs-filler] Using the only add button found:', allAddButtons[0]);
      return allAddButtons[0] as HTMLButtonElement;
    }
    
    // Original fallback logic
    const next = (rsHost as HTMLElement).nextElementSibling as HTMLElement | null;
    console.log('[neo-rs-filler] Next sibling of rsHost:', next);
    
    if (next) {
      const btn = next.querySelector<HTMLButtonElement>('button.ntx-repeating-section-add-button, button[aria-label="Add"], button[title*="Add"], .btn-repeating-section-new-row');
      if (btn) {
        console.log('[neo-rs-filler] Found add button in next sibling:', btn);
        return btn;
      }
    }
    
    let btn = rsHost.querySelector<HTMLButtonElement>('button.ntx-repeating-section-add-button, button[aria-label="Add"], button[title*="Add"], .btn-repeating-section-new-row');
    if (btn) {
      console.log('[neo-rs-filler] Found add button in RS host:', btn);
      return btn;
    }
    
    const sr = (rsHost as any).shadowRoot as ShadowRoot | undefined;
    if (sr) {
      btn = sr.querySelector<HTMLButtonElement>('button.ntx-repeating-section-add-button, button[aria-label="Add"], button[title*="Add"], .btn-repeating-section-new-row');
      if (btn) {
        console.log('[neo-rs-filler] Found add button in shadow root:', btn);
        return btn;
      }
    }
    
    // Let's also try some broader searches
    const allButtons = document.querySelectorAll('button');
    console.log('[neo-rs-filler] Total buttons in document:', allButtons.length);
    
    const addButtons = document.querySelectorAll('button[title*="Add"], button[aria-label*="Add"]');
    console.log('[neo-rs-filler] Potential add buttons by attributes:', addButtons.length, addButtons);
    
    // Check buttons by text content (since :contains() isn't valid CSS)
    const buttonsByText = Array.from(allButtons).filter(btn => 
      btn.textContent && btn.textContent.toLowerCase().includes('add')
    );
    console.log('[neo-rs-filler] Buttons with "add" in text:', buttonsByText.length, buttonsByText);
    
    return null;
  }

  // Find remove buttons scoped to this repeating section
  private findRemoveButtons(rsHost: Element): HTMLButtonElement[] {
    const ntxRepeatingSection = rsHost.closest('ntx-repeating-section');
    
    if (ntxRepeatingSection) {
      // Look for remove buttons within this specific repeating section
      const removeButtons = ntxRepeatingSection.querySelectorAll('.ntx-repeating-section-remove-button') as NodeListOf<HTMLButtonElement>;
      console.log('[neo-rs-filler] Remove buttons in ntx-repeating-section:', removeButtons.length, removeButtons);
      
      // Filter out disabled buttons (typically the first row can't be removed)
      const enabledButtons = Array.from(removeButtons).filter(btn => !btn.disabled);
      console.log('[neo-rs-filler] Enabled remove buttons:', enabledButtons.length, enabledButtons);
      
      return enabledButtons;
    }
    
    // Fallback to original logic
    const scopes: Array<Element | ShadowRoot> = [
      rsHost,
      (rsHost as HTMLElement).nextElementSibling as HTMLElement | null,
      (rsHost as any).shadowRoot as ShadowRoot | undefined,
    ].filter(Boolean) as Array<Element | ShadowRoot>;

    for (const scope of scopes) {
      const btns = (scope as Element).querySelectorAll?.('button.ntx-repeating-section-remove-button, button[aria-label="Remove"], button[title*="Remove"]') as NodeListOf<HTMLButtonElement> | undefined;
      if (btns && btns.length) return Array.from(btns);
    }

    const root = this.ownerDocument || document;
    const fallback = root.querySelectorAll('button.ntx-repeating-section-remove-button, button[aria-label="Remove"], button[title*="Remove"]') as NodeListOf<HTMLButtonElement>;
    return Array.from(fallback ?? []);
  }

  private getCurrentRowCount(rsHost: Element): number {
    // In Nintex, each row has a remove button (even if disabled), so count the actual rows
    const ntxRepeatingSection = rsHost.closest('ntx-repeating-section');
    
    if (ntxRepeatingSection) {
      // Count the actual repeated sections
      const repeatedRows = ntxRepeatingSection.querySelectorAll('.ntx-repeating-section-repeated-section');
      console.log('[neo-rs-filler] Repeated rows found:', repeatedRows.length, repeatedRows);
      
      if (repeatedRows.length > 0) {
        console.log('[neo-rs-filler] Using repeated rows count:', repeatedRows.length);
        return repeatedRows.length;
      }
    }
    
    // Fallback: count remove buttons 
    const removeButtons = this.findRemoveButtons(rsHost);
    console.log('[neo-rs-filler] Remove buttons found:', removeButtons.length, removeButtons);
    
    // In Nintex, each row typically has a remove button, so the count should be equal to buttons
    const count = removeButtons && removeButtons.length ? removeButtons.length : 1;
    console.log('[neo-rs-filler] Calculated current row count:', count);
    return count;
  }

  private async runActions() {
    console.log('[neo-rs-filler] runActions called', { 
      rstarget: this.rstarget, 
      rsfieldtarget: this.rsfieldtarget,
      rsvalues: this.rsvalues,
      rsfieldtype: this.rsfieldtype 
    });
    
    console.log('[neo-rs-filler] Raw rsvalues value:', this.rsvalues);
    console.log('[neo-rs-filler] rsvalues type:', typeof this.rsvalues);
    console.log('[neo-rs-filler] rsvalues length:', this.rsvalues?.length);
    
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

    // Parse the array values using smart format detection
    let valuesArray: any[] = [];
    try {
      valuesArray = this.parseInputData(valuesString);
      if (!Array.isArray(valuesArray)) {
        console.error('[neo-rs-filler] Parsed data is not an array:', valuesArray);
        return;
      }
      console.log('[neo-rs-filler] Successfully parsed input data:', valuesArray);
    } catch (error) {
      console.error('[neo-rs-filler] Failed to parse input data:', error, valuesString);
      return;
    }
    
    console.log('[neo-rs-filler] Parsed values array:', valuesArray);
    
    const desiredRowCount = valuesArray.length;
    console.log('[neo-rs-filler] Desired row count based on array length:', desiredRowCount);

    const hasEscape = typeof (window as any).CSS !== 'undefined' && typeof (CSS as any).escape === 'function';
    const safeClass = hasEscape
      ? (CSS as any).escape(targetClassName)
      : targetClassName.replace(/([^a-zA-Z0-9_-])/g, '\\$1');

    const key = `${safeClass}:${fieldTargetClassName}:${valuesString}`;
    if (this._lastApplied === key) {
      console.log('[neo-rs-filler] Already applied this configuration, skipping');
      return;
    }

    console.log('[neo-rs-filler] Looking for repeating section:', `.${safeClass}`);
    this._isRunning = true;

    const rsHost = await this.waitForElement(`.${safeClass}`);
    if (!rsHost) {
      console.warn('[neo-rs-filler] Repeating section not found:', targetClassName);
      this._isRunning = false;
      return;
    }

    console.log('[neo-rs-filler] Found RS host:', rsHost);

    // Get current row count
    const currentCount = this.getCurrentRowCount(rsHost);
    console.log('[neo-rs-filler] Current row count:', currentCount);

    // Ensure we have the right number of rows
    if (currentCount !== desiredRowCount) {
      console.log('[neo-rs-filler] Adjusting row count from', currentCount, 'to', desiredRowCount);
      
      const addBtn = this.findAddButton(rsHost);
      if (!addBtn) {
        console.warn('[neo-rs-filler] Add button not found, cannot adjust rows');
        this._isRunning = false;
        return;
      }

      if (currentCount < desiredRowCount) {
        // Add rows
        const toAdd = desiredRowCount - currentCount;
        console.log('[neo-rs-filler] Adding', toAdd, 'rows');
        
        for (let i = 0; i < toAdd; i++) {
          try { 
            addBtn.click(); 
            await new Promise(resolve => setTimeout(resolve, 200));
          } catch (error) {
            console.error('[neo-rs-filler] Error adding row:', error);
          }
        }
      } else if (currentCount > desiredRowCount) {
        // Remove excess rows
        const toRemove = currentCount - desiredRowCount;
        console.log('[neo-rs-filler] Removing', toRemove, 'excess rows');
        
        const removeButtons = this.findRemoveButtons(rsHost);
        const buttonsToClick = removeButtons.slice(-toRemove);
        
        for (let i = 0; i < buttonsToClick.length; i++) {
          try { 
            buttonsToClick[i].click(); 
            await new Promise(resolve => setTimeout(resolve, 200));
          } catch (error) {
            console.error('[neo-rs-filler] Error removing row:', error);
          }
        }
      }
      
      // Wait for DOM to update after row changes
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Now fill the values in each row
    await this.fillRowValues(rsHost, fieldTargetClassName, valuesArray);

    this._lastApplied = key;
    this._isRunning = false;
    console.log('[neo-rs-filler] runActions completed');
  }

  private async fillRowValues(rsHost: Element, fieldTargetClassName: string, valuesArray: any[]) {
    console.log('[neo-rs-filler] Starting to fill row values');
    
    const ntxRepeatingSection = rsHost.closest('ntx-repeating-section');
    if (!ntxRepeatingSection) {
      console.error('[neo-rs-filler] Could not find ntx-repeating-section parent');
      return;
    }

    // Get all the repeated row sections
    const repeatedRows = ntxRepeatingSection.querySelectorAll('.ntx-repeating-section-repeated-section');
    console.log('[neo-rs-filler] Found repeated rows for filling:', repeatedRows.length);

    if (repeatedRows.length !== valuesArray.length) {
      console.warn('[neo-rs-filler] Row count mismatch - rows:', repeatedRows.length, 'values:', valuesArray.length);
    }

    const safeFieldClass = (typeof (window as any).CSS !== 'undefined' && typeof (CSS as any).escape === 'function')
      ? (CSS as any).escape(fieldTargetClassName)
      : fieldTargetClassName.replace(/([^a-zA-Z0-9_-])/g, '\\$1');

    // Fill each row with corresponding value
    for (let i = 0; i < Math.min(repeatedRows.length, valuesArray.length); i++) {
      const row = repeatedRows[i];
      const value = valuesArray[i];
      
      console.log(`[neo-rs-filler] Filling row ${i + 1} with value:`, value);
      
      // Find the target field within this row
      const targetField = row.querySelector(`.${safeFieldClass}`) as HTMLElement;
      if (!targetField) {
        console.warn(`[neo-rs-filler] Target field not found in row ${i + 1}:`, fieldTargetClassName);
        continue;
      }

      console.log(`[neo-rs-filler] Found target field in row ${i + 1}:`, targetField);
      
      // Fill the field based on its type
      await this.setFieldValue(targetField, value, this.rsfieldtype);
      
      // Small delay between filling each row
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  private async setFieldValue(fieldElement: HTMLElement, value: any, fieldType: string) {
    console.log('[neo-rs-filler] Setting field value:', { fieldElement, value, fieldType });
    
    // Look for different types of input elements within the field
    const input = fieldElement.querySelector('input') as HTMLInputElement;
    const textarea = fieldElement.querySelector('textarea') as HTMLTextAreaElement;
    const select = fieldElement.querySelector('select') as HTMLSelectElement;
    
    let targetElement = input || textarea || select;
    
    if (!targetElement) {
      console.warn('[neo-rs-filler] No input element found in field:', fieldElement);
      return;
    }

    // Convert value based on field type
    let convertedValue: string;
    try {
      switch (fieldType) {
        case 'string':
          convertedValue = String(value);
          break;
        case 'number':
        case 'integer':
          convertedValue = String(Number(value));
          break;
        case 'boolean':
          convertedValue = Boolean(value) ? 'true' : 'false';
          break;
        case 'object':
        case 'array':
          convertedValue = JSON.stringify(value);
          break;
        case 'datetime':
          convertedValue = value instanceof Date ? value.toISOString() : String(value);
          break;
        default:
          convertedValue = String(value);
      }
    } catch (error) {
      console.error('[neo-rs-filler] Error converting value:', error);
      convertedValue = String(value);
    }

    console.log('[neo-rs-filler] Setting converted value:', convertedValue);

    // Set the value and trigger events
    targetElement.value = convertedValue;
    
    // Trigger input events to notify the form system
    targetElement.dispatchEvent(new Event('input', { bubbles: true }));
    targetElement.dispatchEvent(new Event('change', { bubbles: true }));
    targetElement.dispatchEvent(new Event('blur', { bubbles: true }));
  }

  /**
   * Detects the format of the input data
   */
  private detectInputFormat(input: string): { format: string; confidence: number; details: string } {
    const trimmed = input.trim();
    
    // Empty check
    if (!trimmed) {
      return { format: 'empty', confidence: 1.0, details: 'No input provided' };
    }

    // JSON Array check
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

    // JSON Object check
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed);
        return { 
          format: 'json-object', 
          confidence: 0.9, 
          details: 'Valid JSON object' 
        };
      } catch (e) {
        return { 
          format: 'malformed-json', 
          confidence: 0.7, 
          details: 'Looks like JSON object but has syntax errors' 
        };
      }
    }

    // CSV check (contains commas, no brackets)
    if (trimmed.includes(',') && !trimmed.includes('[') && !trimmed.includes('{')) {
      const commaCount = (trimmed.match(/,/g) || []).length;
      return { 
        format: 'csv', 
        confidence: 0.8, 
        details: `Comma-separated values (${commaCount + 1} items)` 
      };
    }

    // Pipe-separated check
    if (trimmed.includes('|')) {
      const pipeCount = (trimmed.match(/\|/g) || []).length;
      return { 
        format: 'pipe-separated', 
        confidence: 0.7, 
        details: `Pipe-separated values (${pipeCount + 1} items)` 
      };
    }

    // Newline-separated check
    if (trimmed.includes('\n')) {
      const lines = trimmed.split('\n').filter(line => line.trim());
      return { 
        format: 'newline-separated', 
        confidence: 0.8, 
        details: `Newline-separated values (${lines.length} items)` 
      };
    }

    // Single value
    return { 
      format: 'single-value', 
      confidence: 0.9, 
      details: 'Single text value' 
    };
  }

  /**
   * Parses input data based on detected format
   */
  private parseInputData(input: string): any[] {
    const detection = this.detectInputFormat(input);
    const trimmed = input.trim();
    
    console.log('[neo-rs-filler] Input format detection:', detection);

    switch (detection.format) {
      case 'empty':
        return [];

      case 'json-array':
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) {
            return parsed;
          }
          throw new Error('Parsed JSON is not an array');
        } catch (e) {
          throw new Error(`JSON parsing failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
        }

      case 'json-object':
        try {
          const parsed = JSON.parse(trimmed);
          // Convert single object to array
          return [parsed];
        } catch (e) {
          throw new Error(`JSON parsing failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
        }

      case 'csv':
        // Split by comma and clean up values
        return trimmed.split(',').map(item => {
          const cleaned = item.trim();
          // Try to parse as number if it looks like one
          if (/^\d+(\.\d+)?$/.test(cleaned)) {
            return Number(cleaned);
          }
          // Try to parse as boolean
          if (cleaned.toLowerCase() === 'true') return true;
          if (cleaned.toLowerCase() === 'false') return false;
          // Remove quotes if present
          if ((cleaned.startsWith('"') && cleaned.endsWith('"')) ||
              (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
            return cleaned.slice(1, -1);
          }
          return cleaned;
        });

      case 'pipe-separated':
        return trimmed.split('|').map(item => item.trim());

      case 'newline-separated':
        return trimmed.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);

      case 'single-value':
        // Try to parse as number or boolean, otherwise keep as string
        if (/^\d+(\.\d+)?$/.test(trimmed)) {
          return [Number(trimmed)];
        }
        if (trimmed.toLowerCase() === 'true') return [true];
        if (trimmed.toLowerCase() === 'false') return [false];
        return [trimmed];

      case 'malformed-json':
        // Try to fix common JSON issues
        try {
          // Fix common issues like single quotes, missing quotes
          let fixed = trimmed
            .replace(/'/g, '"')  // Replace single quotes with double
            .replace(/(\w+):/g, '"$1":')  // Add quotes around keys
            .replace(/,(\s*[}\]])/g, '$1');  // Remove trailing commas
          
          const parsed = JSON.parse(fixed);
          if (Array.isArray(parsed)) {
            console.log('[neo-rs-filler] Successfully fixed malformed JSON');
            return parsed;
          }
          return [parsed];
        } catch (e) {
          console.warn('[neo-rs-filler] Could not fix malformed JSON, treating as CSV');
          // Fallback to CSV parsing
          return trimmed.split(',').map(item => item.trim());
        }

      default:
        throw new Error(`Unsupported format: ${detection.format}`);
    }
  }
  
  render() {
    console.log('[neo-rs-filler] Raw rsvalues in render:', this.rsvalues);
    
    let displayInfo = 'none';
    let formatInfo = 'unknown';
    
    if (this.rsvalues) {
      const detection = this.detectInputFormat(this.rsvalues);
      formatInfo = detection.format;
      
      try {
        const parsed = this.parseInputData(this.rsvalues);
        displayInfo = `${parsed.length} items`;
      } catch (e) {
        displayInfo = `parsing error: ${e instanceof Error ? e.message : 'Unknown error'}`;
      }
    }
    
    return html`
      <div>
        <div>Raw rsvalues: ${this.rsvalues || '(empty)'}</div>
        <div>Format: ${formatInfo}</div>
        <div>Parsed: ${displayInfo}</div>
      </div>
    `;
  }

  // Include the contract information using @nintex/form-plugin-contract
  static getMetaConfig(): PluginContract {
    return rsElementContract;
  }
}

customElements.define('neo-rs-filler', rsElement);