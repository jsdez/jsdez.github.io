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
    rscontroltype: {
      type: 'string',
      enum: ['text-short', 'text-long', 'choice-single', 'choice-multiple', 'currency', 'datetime', 'email', 'number', 'yes-no'],
      title: 'Control type in the Repeating Section',
      description: 'Type of control in the repeating section',
      defaultValue: 'text-short',
    },
    rsinputtarget: {
      type: 'string',
      title: 'CSS selector for input control (optional)',
      description: 'When specified, waits for this input control to lose focus before updating the repeating section. Useful for multi-choice controls to prevent dropdown collapse during selection.',
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
  @property({ type: String }) rscontroltype: string = 'text-short';
  @property({ type: String }) rsinputtarget: string = '';
  @property({ type: Boolean }) primaryFiller: boolean = false;

  // internal guards
  private _isRunning = false;
  private _lastApplied: string | null = null;
  private _inputFocusListener?: EventListener;
  private _inputBlurListener?: EventListener;
  private _delayedExecutionTimer?: number;
  private _pendingExecution = false;

  constructor() {
    super();
    this.rsvalues = '';
    this.rstarget = '';
    this.rsfieldtarget = '';
    this.rscontroltype = 'text-short';
    this.primaryFiller = false;
  }

  firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    this.setupInputMonitoring();
    this.runActions();
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('rsvalues') || changedProperties.has('rstarget') || changedProperties.has('rsfieldtarget') || changedProperties.has('rsinputtarget') || changedProperties.has('primaryFiller')) {
      this.setupInputMonitoring();
      this.runActions();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.cleanupInputMonitoring();
  }

  /**
   * Set up input focus monitoring if rsinputtarget is specified
   */
  private setupInputMonitoring() {
    // Clean up existing listeners
    this.cleanupInputMonitoring();

    if (!this.rsinputtarget) {
      console.log('[neo-rs-filler] No rsinputtarget specified, using immediate execution mode');
      return;
    }

    console.log('[neo-rs-filler] Setting up input monitoring for:', this.rsinputtarget);
    
    // Find the input control element
    const inputElement = document.querySelector(this.rsinputtarget) as HTMLElement;
    if (!inputElement) {
      console.warn('[neo-rs-filler] Input target not found:', this.rsinputtarget);
      return;
    }

    console.log('[neo-rs-filler] Found input element:', inputElement);

    // Set up focus event listeners
    this._inputFocusListener = () => {
      console.log('[neo-rs-filler] Input focused, clearing any pending execution');
      this._pendingExecution = false;
      if (this._delayedExecutionTimer) {
        clearTimeout(this._delayedExecutionTimer);
        this._delayedExecutionTimer = undefined;
      }
    };

    this._inputBlurListener = () => {
      console.log('[neo-rs-filler] Input lost focus, scheduling delayed execution');
      this._pendingExecution = true;
      
      // Clear any existing timer
      if (this._delayedExecutionTimer) {
        clearTimeout(this._delayedExecutionTimer);
      }
      
      // Schedule execution after a short delay to allow for quick refocus
      this._delayedExecutionTimer = window.setTimeout(() => {
        if (this._pendingExecution) {
          console.log('[neo-rs-filler] Executing delayed update after input focus lost');
          this.executeRepeatingUpdate();
        }
      }, 500); // 500ms delay to allow for quick refocus scenarios
    };

    // Add listeners to the input and its relevant child elements
    inputElement.addEventListener('focus', this._inputFocusListener, true);
    inputElement.addEventListener('blur', this._inputBlurListener, true);

    // Also listen for focus/blur on dropdowns within the input control
    const dropdownElements = inputElement.querySelectorAll('ng-select, select, input');
    dropdownElements.forEach(element => {
      element.addEventListener('focus', this._inputFocusListener!, true);
      element.addEventListener('blur', this._inputBlurListener!, true);
    });
  }

  /**
   * Clean up input monitoring listeners
   */
  private cleanupInputMonitoring() {
    if (this._delayedExecutionTimer) {
      clearTimeout(this._delayedExecutionTimer);
      this._delayedExecutionTimer = undefined;
    }

    if (this.rsinputtarget && (this._inputFocusListener || this._inputBlurListener)) {
      const inputElement = document.querySelector(this.rsinputtarget) as HTMLElement;
      if (inputElement) {
        if (this._inputFocusListener) {
          inputElement.removeEventListener('focus', this._inputFocusListener, true);
        }
        if (this._inputBlurListener) {
          inputElement.removeEventListener('blur', this._inputBlurListener, true);
        }

        // Also remove from dropdown elements
        const dropdownElements = inputElement.querySelectorAll('ng-select, select, input');
        dropdownElements.forEach(element => {
          if (this._inputFocusListener) {
            element.removeEventListener('focus', this._inputFocusListener, true);
          }
          if (this._inputBlurListener) {
            element.removeEventListener('blur', this._inputBlurListener, true);
          }
        });
      }
    }

    this._inputFocusListener = undefined;
    this._inputBlurListener = undefined;
    this._pendingExecution = false;
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
      rsinputtarget: this.rsinputtarget,
      rsvalues: this.rsvalues,
      rscontroltype: this.rscontroltype,
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

    // If input monitoring is enabled, don't execute immediately
    if (this.rsinputtarget) {
      console.log('[neo-rs-filler] Input monitoring enabled, deferring execution until input loses focus');
      return;
    }

    // Execute immediately if no input monitoring
    await this.executeRepeatingUpdate();
  }

  /**
   * Execute the repeating section update logic
   */
  private async executeRepeatingUpdate() {
    console.log('[neo-rs-filler] executeRepeatingUpdate called');
    
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
      await this.setFieldValue(targetField, value, this.rscontroltype);
      
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

  private async setFieldValue(fieldElement: HTMLElement, value: any, controlType: string) {
    console.log('[neo-rs-filler] Setting field value:', { fieldElement, value, controlType });
    
    try {
      switch (controlType) {
        case 'text-short':
          await this.setTextShortValue(fieldElement, value);
          break;
        case 'text-long':
          await this.setTextLongValue(fieldElement, value);
          break;
        case 'choice-single':
          await this.setChoiceSingleValue(fieldElement, value);
          break;
        case 'choice-multiple':
          await this.setChoiceMultipleValue(fieldElement, value);
          break;
        case 'currency':
          await this.setCurrencyValue(fieldElement, value);
          break;
        case 'datetime':
          await this.setDateTimeValue(fieldElement, value);
          break;
        case 'email':
          await this.setEmailValue(fieldElement, value);
          break;
        case 'number':
          await this.setNumberValue(fieldElement, value);
          break;
        case 'yes-no':
          await this.setYesNoValue(fieldElement, value);
          break;
        default:
          console.warn('[neo-rs-filler] Unknown control type, defaulting to text-short:', controlType);
          await this.setTextShortValue(fieldElement, value);
      }
    } catch (error) {
      console.error('[neo-rs-filler] Error setting field value:', error);
    }
  }

  /**
   * Set value for Text - Short control
   */
  private async setTextShortValue(fieldElement: HTMLElement, value: any) {
    const input = fieldElement.querySelector('input[type="text"], input:not([type])') as HTMLInputElement;
    if (input) {
      const stringValue = String(value);
      input.value = stringValue;
      this.triggerInputEvents(input);
      console.log('[neo-rs-filler] Set text-short value:', stringValue);
    } else {
      console.warn('[neo-rs-filler] Text input not found in text-short field');
    }
  }

  /**
   * Set value for Text - Long control (textarea)
   */
  private async setTextLongValue(fieldElement: HTMLElement, value: any) {
    const textarea = fieldElement.querySelector('textarea') as HTMLTextAreaElement;
    if (textarea) {
      const stringValue = String(value);
      textarea.value = stringValue;
      this.triggerInputEvents(textarea);
      console.log('[neo-rs-filler] Set text-long value:', stringValue);
    } else {
      console.warn('[neo-rs-filler] Textarea not found in text-long field');
    }
  }

  /**
   * Set value for Choice - Single control (Nintex ng-select dropdown or radio buttons)
   */
  private async setChoiceSingleValue(fieldElement: HTMLElement, value: any) {
    const stringValue = String(value);
    console.log('[neo-rs-filler] Setting choice-single value:', stringValue);
    
    // First, look for Nintex ng-select dropdown
    const ngSelect = fieldElement.querySelector('ng-select') as any;
    const ntxSimpleSelect = fieldElement.querySelector('ntx-simple-select-single') as HTMLElement;
    
    if (ngSelect || ntxSimpleSelect) {
      console.log('[neo-rs-filler] Found Nintex ng-select dropdown');
      await this.setNintexDropdownValue(fieldElement, stringValue);
      return;
    }
    
    // Fallback: look for standard HTML select (less likely in Nintex)
    const select = fieldElement.querySelector('select') as HTMLSelectElement;
    if (select) {
      console.log('[neo-rs-filler] Found standard dropdown');
      await this.setSelectValue(select, stringValue);
      return;
    }
    
    // If no dropdown, look for radio buttons
    const radioButtons = fieldElement.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;
    if (radioButtons.length > 0) {
      console.log('[neo-rs-filler] Found radio buttons, attempting to select one');
      await this.setRadioValue(radioButtons, stringValue);
      return;
    }
    
    console.warn('[neo-rs-filler] No dropdown or radio buttons found in choice-single field');
  }

  /**
   * Handle Nintex ng-select dropdown values with read-only bypass and focus management
   */
  private async setNintexDropdownValue(fieldElement: HTMLElement, targetValue: string) {
    console.log('[neo-rs-filler] Setting Nintex dropdown value:', targetValue);
    
    // Look for the ng-select container and input element
    const ngSelect = fieldElement.querySelector('ng-select') as HTMLElement;
    const input = fieldElement.querySelector('ng-select input, ntx-simple-select-single input') as HTMLInputElement;
    
    if (!input || !ngSelect) {
      console.warn('[neo-rs-filler] No input or ng-select found in Nintex dropdown');
      return;
    }
    
    console.log('[neo-rs-filler] Found dropdown input:', input);
    
    // Store original states for restoration
    const wasInputDisabled = input.disabled;
    const wasNgSelectDisabled = ngSelect.classList.contains('ng-select-disabled');
    const previouslyFocused = document.activeElement;
    
    try {
      // Temporarily enable the dropdown if it's read-only/disabled
      if (wasInputDisabled) {
        input.disabled = false;
        console.log('[neo-rs-filler] Temporarily enabled disabled input');
      }
      if (wasNgSelectDisabled) {
        ngSelect.classList.remove('ng-select-disabled');
        console.log('[neo-rs-filler] Temporarily removed ng-select-disabled class');
      }
      
      // Clear existing value and set new value to trigger filtering
      input.value = '';
      this.triggerInputEvents(input);
      
      input.value = targetValue;
      this.triggerInputEvents(input);
      
      // Open dropdown using keyboard navigation to avoid focus issues
      input.focus();
      const arrowDownEvent = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        code: 'ArrowDown',
        keyCode: 40,
        bubbles: true,
        cancelable: true
      });
      input.dispatchEvent(arrowDownEvent);
      
      // Wait for dropdown options to appear
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Try to find and select the matching option using keyboard navigation
      const dropdownOptions = document.querySelectorAll('ng-option, .ng-option');
      console.log('[neo-rs-filler] Available dropdown options:', dropdownOptions.length);
      
      let optionFound = false;
      const lowerTargetValue = targetValue.toLowerCase();
      
      // First try exact match
      for (const option of Array.from(dropdownOptions)) {
        const optionText = option.textContent?.trim() || '';
        const lowerOptionText = optionText.toLowerCase();
        
        if (optionText === targetValue || lowerOptionText === lowerTargetValue) {
          console.log('[neo-rs-filler] Found exact match, selecting via Enter key:', optionText);
          
          // Use Enter key instead of click to maintain focus control
          const enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            bubbles: true,
            cancelable: true
          });
          input.dispatchEvent(enterEvent);
          optionFound = true;
          break;
        }
      }
      
      // If no exact match, try partial match
      if (!optionFound) {
        for (const option of Array.from(dropdownOptions)) {
          const optionText = option.textContent?.trim() || '';
          const lowerOptionText = optionText.toLowerCase();
          
          if (lowerOptionText.includes(lowerTargetValue)) {
            console.log('[neo-rs-filler] Found partial match, selecting via Enter key:', optionText);
            
            const enterEvent = new KeyboardEvent('keydown', {
              key: 'Enter',
              code: 'Enter',
              keyCode: 13,
              bubbles: true,
              cancelable: true
            });
            input.dispatchEvent(enterEvent);
            optionFound = true;
            break;
          }
        }
      }
      
      if (!optionFound) {
        console.warn('[neo-rs-filler] No matching option found for value:', targetValue);
      }
      
      // Close dropdown with Escape key to maintain control
      const escapeEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        code: 'Escape',
        keyCode: 27,
        bubbles: true,
        cancelable: true
      });
      input.dispatchEvent(escapeEvent);
      
    } finally {
      // Always restore original states
      if (wasInputDisabled) {
        input.disabled = true;
        console.log('[neo-rs-filler] Restored disabled state to input');
      }
      if (wasNgSelectDisabled) {
        ngSelect.classList.add('ng-select-disabled');
        console.log('[neo-rs-filler] Restored ng-select-disabled class');
      }
      
      // Restore focus to prevent dropdown collapse issues
      if (previouslyFocused && previouslyFocused !== input) {
        (previouslyFocused as HTMLElement).focus();
        console.log('[neo-rs-filler] Restored focus to previous element');
      }
      
      // Final trigger of change events
      this.triggerInputEvents(input);
    }
  }

  /**
   * Set value for Choice - Multiple control (Nintex multi-select dropdown or checkboxes)
   */
  private async setChoiceMultipleValue(fieldElement: HTMLElement, value: any) {
    // Handle array of values for multiple selection
    let values: string[];
    if (Array.isArray(value)) {
      values = value.map(v => String(v));
    } else {
      // Try to parse as comma-separated values
      values = String(value).split(',').map(v => v.trim());
    }
    
    console.log('[neo-rs-filler] Setting choice-multiple values:', values);
    
    // First, look for Nintex multi-select dropdown
    const ntxMultiSelect = fieldElement.querySelector('ntx-simple-select-multi') as HTMLElement;
    const ngSelect = fieldElement.querySelector('ng-select') as any;
    
    if (ntxMultiSelect || ngSelect) {
      console.log('[neo-rs-filler] Found Nintex multi-select dropdown');
      await this.setNintexMultiSelectValue(fieldElement, values);
      return;
    }
    
    // Fallback: look for standard multi-select dropdown
    const multiSelect = fieldElement.querySelector('select[multiple]') as HTMLSelectElement;
    if (multiSelect) {
      console.log('[neo-rs-filler] Found standard multi-select dropdown');
      await this.setMultiSelectValue(multiSelect, values);
      return;
    }
    
    // If no multi-select, look for checkboxes
    const checkboxes = fieldElement.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    if (checkboxes.length > 0) {
      console.log('[neo-rs-filler] Found checkboxes');
      await this.setCheckboxValues(checkboxes, values, fieldElement);
      return;
    }
    
    console.warn('[neo-rs-filler] No multi-select or checkboxes found in choice-multiple field');
  }

  /**
   * Handle Nintex ng-select multi-select dropdown values
   */
  private async setNintexMultiSelectValue(fieldElement: HTMLElement, values: string[]) {
    console.log('[neo-rs-filler] Setting Nintex multi-select values:', values);
    
    // Look for the ng-select container and input element
    const ngSelect = fieldElement.querySelector('ng-select') as HTMLElement;
    const input = fieldElement.querySelector('ng-select input, ntx-simple-select-multi input') as HTMLInputElement;
    
    if (!input || !ngSelect) {
      console.warn('[neo-rs-filler] No input or ng-select found in Nintex multi-select');
      return;
    }
    
    console.log('[neo-rs-filler] Found multi-select input:', input);
    
    // Store original states for restoration
    const wasInputDisabled = input.disabled;
    const wasNgSelectDisabled = ngSelect.classList.contains('ng-select-disabled');
    const previouslyFocused = document.activeElement;
    
    try {
      // Temporarily enable the dropdown if it's read-only/disabled
      if (wasInputDisabled) {
        input.disabled = false;
        console.log('[neo-rs-filler] Temporarily enabled disabled multi-select input');
      }
      if (wasNgSelectDisabled) {
        ngSelect.classList.remove('ng-select-disabled');
        console.log('[neo-rs-filler] Temporarily removed ng-select-disabled class from multi-select');
      }
      
      // Process each value
      for (let i = 0; i < values.length; i++) {
        const targetValue = values[i];
        console.log(`[neo-rs-filler] Processing value ${i + 1}/${values.length}:`, targetValue);
        
        // Clear and set the input value to filter options
        input.value = '';
        this.triggerInputEvents(input);
        
        input.value = targetValue;
        this.triggerInputEvents(input);
        
        // Open dropdown using keyboard navigation
        input.focus();
        const arrowDownEvent = new KeyboardEvent('keydown', {
          key: 'ArrowDown',
          code: 'ArrowDown',
          keyCode: 40,
          bubbles: true,
          cancelable: true
        });
        input.dispatchEvent(arrowDownEvent);
        
        // Wait for dropdown options to appear
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Find and select the matching option using keyboard navigation
        const dropdownOptions = document.querySelectorAll('ng-option, .ng-option');
        let optionFound = false;
        const lowerTargetValue = targetValue.toLowerCase();
        
        for (const option of Array.from(dropdownOptions)) {
          const optionText = option.textContent?.trim() || '';
          const lowerOptionText = optionText.toLowerCase();
          
          if (optionText === targetValue || lowerOptionText === lowerTargetValue || 
              lowerOptionText.includes(lowerTargetValue)) {
            console.log('[neo-rs-filler] Selecting multi-select option via Enter key:', optionText);
            
            // Use Enter key instead of click to maintain focus control
            const enterEvent = new KeyboardEvent('keydown', {
              key: 'Enter',
              code: 'Enter',
              keyCode: 13,
              bubbles: true,
              cancelable: true
            });
            input.dispatchEvent(enterEvent);
            optionFound = true;
            break;
          }
        }
        
        if (!optionFound) {
          console.warn('[neo-rs-filler] No matching option found for value:', targetValue);
        }
        
        // Clear input for next value but don't close dropdown yet
        input.value = '';
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Close dropdown with Escape key
      const escapeEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        code: 'Escape',
        keyCode: 27,
        bubbles: true,
        cancelable: true
      });
      input.dispatchEvent(escapeEvent);
      
    } finally {
      // Always restore original states
      if (wasInputDisabled) {
        input.disabled = true;
        console.log('[neo-rs-filler] Restored disabled state to multi-select input');
      }
      if (wasNgSelectDisabled) {
        ngSelect.classList.add('ng-select-disabled');
        console.log('[neo-rs-filler] Restored ng-select-disabled class to multi-select');
      }
      
      // Restore focus to prevent dropdown issues
      if (previouslyFocused && previouslyFocused !== input) {
        (previouslyFocused as HTMLElement).focus();
        console.log('[neo-rs-filler] Restored focus to previous element');
      }
      
      // Final trigger of change events
      this.triggerInputEvents(input);
    }
  }

  /**
   * Set value for Yes/No control (checkbox, toggle, or radio buttons)
   */
  private async setYesNoValue(fieldElement: HTMLElement, value: any) {
    console.log('[neo-rs-filler] Setting yes-no value:', value);
    
    // Convert value to boolean
    let booleanValue: boolean;
    if (typeof value === 'boolean') {
      booleanValue = value;
    } else if (typeof value === 'string') {
      const lowerValue = value.toLowerCase().trim();
      booleanValue = lowerValue === 'true' || lowerValue === 'yes' || lowerValue === '1' || lowerValue === 'on';
    } else if (typeof value === 'number') {
      booleanValue = value !== 0;
    } else {
      booleanValue = Boolean(value);
    }
    
    console.log('[neo-rs-filler] Converted to boolean:', booleanValue);
    
    // Look for checkbox (single checkbox for yes/no)
    const checkbox = fieldElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = booleanValue;
      this.triggerInputEvents(checkbox);
      console.log('[neo-rs-filler] Set checkbox value:', booleanValue);
      return;
    }
    
    // Look for toggle switch (often implemented as checkbox with special styling)
    const toggle = fieldElement.querySelector('input[role="switch"], input.toggle, .toggle input') as HTMLInputElement;
    if (toggle) {
      toggle.checked = booleanValue;
      this.triggerInputEvents(toggle);
      console.log('[neo-rs-filler] Set toggle value:', booleanValue);
      return;
    }
    
    // Look for radio buttons (Yes/No pair)
    const radioButtons = fieldElement.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;
    if (radioButtons.length > 0) {
      const targetValue = booleanValue ? 'yes' : 'no';
      await this.setRadioValue(radioButtons, targetValue);
      return;
    }
    
    // Look for select dropdown with Yes/No options
    const select = fieldElement.querySelector('select') as HTMLSelectElement;
    if (select) {
      const targetValue = booleanValue ? 'yes' : 'no';
      await this.setSelectValue(select, targetValue);
      return;
    }
    
    console.warn('[neo-rs-filler] No checkbox, toggle, radio buttons, or select found in yes-no field');
  }

  /**
   * Helper method to set dropdown/select value with multiple matching strategies
   */
  private async setSelectValue(select: HTMLSelectElement, targetValue: string) {
    console.log('[neo-rs-filler] Looking for option with value:', targetValue);
    
    // Try to find exact value match first
    let optionFound = false;
    for (let i = 0; i < select.options.length; i++) {
      const option = select.options[i];
      if (option.value === targetValue || option.text === targetValue) {
        select.selectedIndex = i;
        optionFound = true;
        console.log('[neo-rs-filler] Found exact match, selected option:', option.text, 'at index', i);
        break;
      }
    }
    
    // If no exact match, try case-insensitive match
    if (!optionFound) {
      const lowerValue = targetValue.toLowerCase();
      for (let i = 0; i < select.options.length; i++) {
        const option = select.options[i];
        if (option.value.toLowerCase() === lowerValue || option.text.toLowerCase() === lowerValue) {
          select.selectedIndex = i;
          optionFound = true;
          console.log('[neo-rs-filler] Found case-insensitive match, selected option:', option.text, 'at index', i);
          break;
        }
      }
    }
    
    // If still no match, try partial match
    if (!optionFound) {
      const lowerValue = targetValue.toLowerCase();
      for (let i = 0; i < select.options.length; i++) {
        const option = select.options[i];
        if (option.text.toLowerCase().includes(lowerValue) || option.value.toLowerCase().includes(lowerValue)) {
          select.selectedIndex = i;
          optionFound = true;
          console.log('[neo-rs-filler] Found partial match, selected option:', option.text, 'at index', i);
          break;
        }
      }
    }
    
    if (optionFound) {
      this.triggerInputEvents(select);
    } else {
      console.warn('[neo-rs-filler] No matching option found for value:', targetValue);
      console.log('[neo-rs-filler] Available options:', Array.from(select.options).map(opt => ({ value: opt.value, text: opt.text })));
    }
  }

  /**
   * Helper method to set radio button value
   */
  private async setRadioValue(radioButtons: NodeListOf<HTMLInputElement>, targetValue: string) {
    console.log('[neo-rs-filler] Looking for radio button with value:', targetValue);
    
    let radioFound = false;
    const lowerTargetValue = targetValue.toLowerCase();
    
    radioButtons.forEach(radio => {
      // Get label text for this radio button
      const label = radio.closest('label') || document.querySelector(`label[for="${radio.id}"]`);
      const labelText = label?.textContent?.trim() || '';
      
      // Check value, label text, and common boolean variations
      const radioValue = radio.value.toLowerCase();
      const radioLabel = labelText.toLowerCase();
      
      if (radioValue === lowerTargetValue || 
          radioLabel === lowerTargetValue ||
          (lowerTargetValue === 'yes' && (radioValue === 'true' || radioLabel === 'true')) ||
          (lowerTargetValue === 'no' && (radioValue === 'false' || radioLabel === 'false'))) {
        radio.checked = true;
        this.triggerInputEvents(radio);
        radioFound = true;
        console.log('[neo-rs-filler] Selected radio button:', labelText || radio.value);
      } else {
        radio.checked = false; // Uncheck other radios in the group
      }
    });
    
    if (!radioFound) {
      console.warn('[neo-rs-filler] No matching radio button found for value:', targetValue);
      console.log('[neo-rs-filler] Available radio options:', Array.from(radioButtons).map(radio => {
        const label = radio.closest('label') || document.querySelector(`label[for="${radio.id}"]`);
        return { value: radio.value, text: label?.textContent?.trim() || '' };
      }));
    }
  }

  /**
   * Helper method to set multi-select dropdown values
   */
  private async setMultiSelectValue(multiSelect: HTMLSelectElement, values: string[]) {
    // Clear all selections first
    for (let i = 0; i < multiSelect.options.length; i++) {
      multiSelect.options[i].selected = false;
    }
    
    // Select matching options
    values.forEach(val => {
      for (let i = 0; i < multiSelect.options.length; i++) {
        const option = multiSelect.options[i];
        if (option.value === val || option.text === val || 
            option.value.toLowerCase() === val.toLowerCase() || 
            option.text.toLowerCase() === val.toLowerCase()) {
          option.selected = true;
          console.log('[neo-rs-filler] Selected multi-select option:', option.text);
        }
      }
    });
    
    this.triggerInputEvents(multiSelect);
  }

  /**
   * Helper method to set checkbox values for multiple choice
   */
  private async setCheckboxValues(checkboxes: NodeListOf<HTMLInputElement>, values: string[], fieldElement: HTMLElement) {
    // Uncheck all first
    checkboxes.forEach(cb => cb.checked = false);
    
    // Check matching ones
    values.forEach(val => {
      const lowerVal = val.toLowerCase();
      checkboxes.forEach(checkbox => {
        const label = checkbox.closest('label') || fieldElement.querySelector(`label[for="${checkbox.id}"]`);
        const labelText = label?.textContent?.trim() || '';
        
        if (checkbox.value === val || labelText === val ||
            checkbox.value.toLowerCase() === lowerVal ||
            labelText.toLowerCase() === lowerVal) {
          checkbox.checked = true;
          this.triggerInputEvents(checkbox);
          console.log('[neo-rs-filler] Checked checkbox:', labelText || checkbox.value);
        }
      });
    });
  }

  /**
   * Set value for Currency control
   */
  private async setCurrencyValue(fieldElement: HTMLElement, value: any) {
    const input = fieldElement.querySelector('input[type="number"], input[type="text"]') as HTMLInputElement;
    if (input) {
      // Convert to number and format appropriately
      const numericValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]/g, ''));
      const formattedValue = isNaN(numericValue) ? '0' : String(numericValue);
      input.value = formattedValue;
      this.triggerInputEvents(input);
      console.log('[neo-rs-filler] Set currency value:', formattedValue);
    } else {
      console.warn('[neo-rs-filler] Input not found in currency field');
    }
  }

  /**
   * Set value for Date/Time control
   */
  private async setDateTimeValue(fieldElement: HTMLElement, value: any) {
    const input = fieldElement.querySelector('input[type="date"], input[type="datetime-local"], input[type="time"], input[type="text"]') as HTMLInputElement;
    if (input) {
      let formattedValue: string;
      
      if (value instanceof Date) {
        // Format based on input type
        if (input.type === 'date') {
          formattedValue = value.toISOString().split('T')[0];
        } else if (input.type === 'datetime-local') {
          formattedValue = value.toISOString().slice(0, 16);
        } else if (input.type === 'time') {
          formattedValue = value.toTimeString().slice(0, 5);
        } else {
          formattedValue = value.toISOString();
        }
      } else {
        formattedValue = String(value);
      }
      
      input.value = formattedValue;
      this.triggerInputEvents(input);
      console.log('[neo-rs-filler] Set datetime value:', formattedValue);
    } else {
      console.warn('[neo-rs-filler] Date input not found in datetime field');
    }
  }

  /**
   * Set value for Email control
   */
  private async setEmailValue(fieldElement: HTMLElement, value: any) {
    const input = fieldElement.querySelector('input[type="email"], input[type="text"]') as HTMLInputElement;
    if (input) {
      const emailValue = String(value);
      input.value = emailValue;
      this.triggerInputEvents(input);
      console.log('[neo-rs-filler] Set email value:', emailValue);
    } else {
      console.warn('[neo-rs-filler] Email input not found in email field');
    }
  }

  /**
   * Set value for Number control
   */
  private async setNumberValue(fieldElement: HTMLElement, value: any) {
    const input = fieldElement.querySelector('input[type="number"], input[type="text"]') as HTMLInputElement;
    if (input) {
      const numericValue = typeof value === 'number' ? value : parseFloat(String(value));
      const formattedValue = isNaN(numericValue) ? '0' : String(numericValue);
      input.value = formattedValue;
      this.triggerInputEvents(input);
      console.log('[neo-rs-filler] Set number value:', formattedValue);
    } else {
      console.warn('[neo-rs-filler] Number input not found in number field');
    }
  }

  /**
   * Trigger input events to notify the form system of changes
   */
  private triggerInputEvents(element: HTMLElement) {
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new Event('blur', { bubbles: true }));
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