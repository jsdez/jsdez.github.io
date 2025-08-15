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
    primaryFiller: {
      type: 'boolean',
      title: 'Primary Filler',
      description: 'When true, this component manages row count (add/remove). When false, only fills data in existing rows.',
      defaultValue: true,
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
  @property({ type: String }) rsfieldtype: string = 'string';
  @property({ type: Boolean }) primaryFiller: boolean = true;

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
      rsfieldtype: this.rsfieldtype,
      primaryFiller: this.primaryFiller
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

    // Only adjust row count if this is the primary filler
    if (this.primaryFiller) {
      console.log('[neo-rs-filler] This is the primary filler - managing row count');
      
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
          // Add rows with DOM observation
          const toAdd = desiredRowCount - currentCount;
          console.log('[neo-rs-filler] Adding', toAdd, 'rows');
          
          for (let i = 0; i < toAdd; i++) {
            try { 
              const targetRowIndex = currentCount + i;
              console.log(`[neo-rs-filler] Adding row ${targetRowIndex + 1}`);
              
              addBtn.click();
              
              // Wait for the new row to actually appear instead of using fixed delay
              const ntxRepeatingSection = rsHost.closest('ntx-repeating-section');
              if (ntxRepeatingSection) {
                await this.waitForRowToExist(ntxRepeatingSection, targetRowIndex);
              }
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
              // Small delay for row removal to process
              await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
              console.error('[neo-rs-filler] Error removing row:', error);
            }
          }
        }
        
        // Brief pause to let any final DOM changes settle
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } else {
      console.log('[neo-rs-filler] This is a secondary filler - skipping row count management');
      console.log('[neo-rs-filler] Will fill data in existing', currentCount, 'rows with', valuesArray.length, 'values');
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

    const safeFieldClass = (typeof (window as any).CSS !== 'undefined' && typeof (CSS as any).escape === 'function')
      ? (CSS as any).escape(fieldTargetClassName)
      : fieldTargetClassName.replace(/([^a-zA-Z0-9_-])/g, '\\$1');

    // Get current row count to determine how many rows to fill
    const currentRows = ntxRepeatingSection.querySelectorAll('.ntx-repeating-section-repeated-section');
    const rowsToFill = Math.min(valuesArray.length, currentRows.length);
    
    if (this.primaryFiller) {
      console.log('[neo-rs-filler] Primary filler - will fill', valuesArray.length, 'values in', valuesArray.length, 'rows');
    } else {
      console.log('[neo-rs-filler] Secondary filler - will fill', rowsToFill, 'values in', currentRows.length, 'existing rows');
      if (valuesArray.length > currentRows.length) {
        console.warn('[neo-rs-filler] More values than existing rows - some values will be skipped');
      }
    }

    // Fill each row with corresponding value, waiting for each row to exist
    for (let i = 0; i < rowsToFill; i++) {
      const value = valuesArray[i];
      console.log(`[neo-rs-filler] Processing row ${i + 1} with value:`, value);
      
      // For primary fillers, wait for rows to exist (they might be newly created)
      // For secondary fillers, rows should already exist
      if (this.primaryFiller) {
        const rowExists = await this.waitForRowToExist(ntxRepeatingSection, i);
        if (!rowExists) {
          console.warn(`[neo-rs-filler] Row ${i + 1} did not appear in DOM, skipping`);
          continue;
        }
      }

      // Get the most current row list (refresh each time)
      const currentRows = ntxRepeatingSection.querySelectorAll('.ntx-repeating-section-repeated-section');
      const row = currentRows[i];
      
      if (!row) {
        console.warn(`[neo-rs-filler] Row ${i + 1} not found after waiting`);
        continue;
      }
      
      // Wait for the target field to exist within the row
      const targetField = await this.waitForFieldInRow(row, safeFieldClass);
      if (!targetField) {
        console.warn(`[neo-rs-filler] Target field not found in row ${i + 1}:`, fieldTargetClassName);
        continue;
      }

      console.log(`[neo-rs-filler] Found target field in row ${i + 1}:`, targetField);
      
      // Fill the field based on its type
      await this.setFieldValue(targetField, value, this.rsfieldtype);
      
      console.log(`[neo-rs-filler] Successfully filled row ${i + 1}`);
      
      // No delay needed since we wait properly for DOM changes
    }
    
    console.log('[neo-rs-filler] Completed filling all rows');
  }

  /**
   * Wait for a specific row index to exist in the repeating section using MutationObserver
   */
  private async waitForRowToExist(ntxRepeatingSection: Element, rowIndex: number): Promise<boolean> {
    // First check if it already exists
    const existingRows = ntxRepeatingSection.querySelectorAll('.ntx-repeating-section-repeated-section');
    if (existingRows.length > rowIndex && existingRows[rowIndex]) {
      console.log(`[neo-rs-filler] Row ${rowIndex + 1} already exists`);
      return true;
    }

    console.log(`[neo-rs-filler] Waiting for row ${rowIndex + 1} to appear in DOM...`);
    
    return new Promise<boolean>((resolve) => {
      const observer = new MutationObserver((mutations) => {
        // Check if the row now exists
        const currentRows = ntxRepeatingSection.querySelectorAll('.ntx-repeating-section-repeated-section');
        if (currentRows.length > rowIndex && currentRows[rowIndex]) {
          console.log(`[neo-rs-filler] Row ${rowIndex + 1} appeared in DOM`);
          observer.disconnect();
          resolve(true);
          return;
        }
        
        // Also check if any mutations added the row we're looking for
        for (const mutation of mutations) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            for (const node of Array.from(mutation.addedNodes)) {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                // Check if this node or its descendants contain our target row
                if (element.classList?.contains('ntx-repeating-section-repeated-section') ||
                    element.querySelector?.('.ntx-repeating-section-repeated-section')) {
                  const updatedRows = ntxRepeatingSection.querySelectorAll('.ntx-repeating-section-repeated-section');
                  if (updatedRows.length > rowIndex && updatedRows[rowIndex]) {
                    console.log(`[neo-rs-filler] Row ${rowIndex + 1} detected via mutation`);
                    observer.disconnect();
                    resolve(true);
                    return;
                  }
                }
              }
            }
          }
        }
      });

      // Observe changes in the repeating section
      observer.observe(ntxRepeatingSection, {
        childList: true,
        subtree: true
      });

      // Timeout fallback after 5 seconds
      setTimeout(() => {
        observer.disconnect();
        console.warn(`[neo-rs-filler] Timeout waiting for row ${rowIndex + 1}`);
        resolve(false);
      }, 5000);
    });
  }

  /**
   * Wait for the target field to exist within a specific row using MutationObserver
   */
  private async waitForFieldInRow(row: Element, safeFieldClass: string): Promise<HTMLElement | null> {
    // First check if it already exists
    const existingField = row.querySelector(`.${safeFieldClass}`) as HTMLElement;
    if (existingField) {
      console.log(`[neo-rs-filler] Field already exists in row`);
      return existingField;
    }

    console.log(`[neo-rs-filler] Waiting for field .${safeFieldClass} to appear in row...`);
    
    return new Promise<HTMLElement | null>((resolve) => {
      const observer = new MutationObserver((mutations) => {
        // Check if the field now exists
        const field = row.querySelector(`.${safeFieldClass}`) as HTMLElement;
        if (field) {
          console.log(`[neo-rs-filler] Field appeared in row`);
          observer.disconnect();
          resolve(field);
          return;
        }

        // Also check mutations for the specific field
        for (const mutation of mutations) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            for (const node of Array.from(mutation.addedNodes)) {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                // Check if this node is our target or contains our target
                if (element.classList?.contains(safeFieldClass.replace(/\\/g, '')) ||
                    element.querySelector?.(`.${safeFieldClass}`)) {
                  const foundField = row.querySelector(`.${safeFieldClass}`) as HTMLElement;
                  if (foundField) {
                    console.log(`[neo-rs-filler] Field detected via mutation`);
                    observer.disconnect();
                    resolve(foundField);
                    return;
                  }
                }
              }
            }
          }
          // Also check for attribute changes that might make the field visible
          else if (mutation.type === 'attributes' && mutation.target.nodeType === Node.ELEMENT_NODE) {
            const target = mutation.target as Element;
            if (target.classList?.contains(safeFieldClass.replace(/\\/g, '')) ||
                target.querySelector?.(`.${safeFieldClass}`)) {
              const foundField = row.querySelector(`.${safeFieldClass}`) as HTMLElement;
              if (foundField) {
                console.log(`[neo-rs-filler] Field became available via attribute change`);
                observer.disconnect();
                resolve(foundField);
                return;
              }
            }
          }
        }
      });

      // Observe changes in the row
      observer.observe(row, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
      });

      // Timeout fallback after 3 seconds
      setTimeout(() => {
        observer.disconnect();
        console.warn(`[neo-rs-filler] Timeout waiting for field in row`);
        resolve(null);
      }, 3000);
    });
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