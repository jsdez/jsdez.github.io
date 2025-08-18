import { LitElement, html, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import { PluginContract, PropType as PluginProperty } from '@nintex/form-plugin-contract';

// Define the contract information using @nintex/form-plugin-contract
const rsElementContract: PluginContract = {
  version: '1.0',
  fallbackDisableSubmit: false,
  controlName: 'neo-rs-filler',
  description: 'Simplified repeating section row manager',
  iconUrl: 'repeating-section',
  groupName: 'Form Tools',
  properties: {
    rsvalues: {
      type: 'string', // Changed from 'object' to 'string'
      title: 'Control values',
      description: 'String data to determine row count',
      isValueField: true,
    },
    rstarget: {
      type: 'string',
      title: 'CSS class of the Repeating Section',
      description: 'Class name used to target repeating section',
    },
    rsinputtarget: {
      type: 'string',
      title: 'CSS selector for input control',
      description: 'When specified, waits for this input control to lose focus before updating the repeating section. Useful for multi-choice controls to prevent dropdown collapse during selection.',
    },
    primaryFiller: {
      type: 'boolean',
      title: 'Primary Filler',
      description: 'When true, this component manages row count (add/remove). When false, only tracks data changes.',
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
  @property({ type: String }) rsvalues: string = ''; // Changed from any[] | string to string
  @property({ type: String }) rstarget: string = '';
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
    this.rsinputtarget = '';
    this.primaryFiller = false;
  }

  firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    this.setupInputMonitoring();
    this.runActions();
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('rsvalues') || changedProperties.has('rstarget') || changedProperties.has('rsinputtarget') || changedProperties.has('primaryFiller')) {
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
      obs.observe(root, { childList: true, subtree: true });
      setTimeout(() => {
        obs.disconnect();
        resolve(null);
      }, timeout);
    });
  }

  private async runActions() {
    console.log('[neo-rs-filler] runActions called', { 
      rstarget: this.rstarget, 
      rsinputtarget: this.rsinputtarget,
      rsvalues: this.rsvalues,
      primaryFiller: this.primaryFiller
    });

    const targetClassName = (this.rstarget || '').trim();

    if (!this.rsvalues.trim()) {
      console.warn('[neo-rs-filler] No values specified');
      return;
    }

    if (!targetClassName) {
      console.warn('[neo-rs-filler] No target class specified');
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

    if (!this.rsvalues.trim() || !targetClassName) {
      console.warn('[neo-rs-filler] Missing target class or values');
      return;
    }

    if (this._isRunning) {
      console.log('[neo-rs-filler] Already running, skipping');
      return;
    }

    console.log('[neo-rs-filler] Using values string:', this.rsvalues);

    const desiredRowCount = this.rsvalues.split(',').length; // Assuming comma-separated values
    console.log('[neo-rs-filler] Desired row count based on string length:', desiredRowCount);

    const hasEscape = typeof (window as any).CSS !== 'undefined' && typeof (CSS as any).escape === 'function';
    const safeClass = hasEscape
      ? (CSS as any).escape(targetClassName)
      : targetClassName.replace(/([^a-zA-Z0-9_-])/g, '\\$1');

    const key = `${safeClass}:${this.rsvalues}`;
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

              // Click add button and wait for new row to appear
              addBtn.click();
              await this.waitForRowToExist(rsHost, targetRowIndex + 1);
              console.log(`[neo-rs-filler] Successfully added row ${targetRowIndex + 1}`);
            } catch (error) {
              console.error(`[neo-rs-filler] Failed to add row ${currentCount + i + 1}:`, error);
              break;
            }
          }
        } else if (currentCount > desiredRowCount) {
          console.log('[neo-rs-filler] Need to remove', currentCount - desiredRowCount, 'rows');
          console.warn('[neo-rs-filler] Row removal not implemented - only supports adding rows');
        }
      }
    } else {
      console.log('[neo-rs-filler] This is a secondary filler - skipping row count management');
      console.log('[neo-rs-filler] Current row count:', currentCount, 'String length:', this.rsvalues.split(',').length);
    }

    // Row management complete - the form's rule engine will handle field values
    console.log('[neo-rs-filler] Row management completed, form rule engine can now populate field values');

    this._lastApplied = key;
    this._isRunning = false;
    console.log('[neo-rs-filler] executeRepeatingUpdate completed');
  }

  /**
   * Parse input data from various formats into an array
   */
  private parseInputData(input: string): any[] {
    const detection = this.detectInputFormat(input);
    const trimmed = input.trim();
    
    console.log('[neo-rs-filler] Input format detection:', detection);

    switch (detection.format) {
      case 'json':
        try {
          return JSON.parse(trimmed);
        } catch (error) {
          console.error('[neo-rs-filler] JSON parsing failed:', error);
          return [];
        }
      
      case 'csv':
        // Simple CSV parsing - split by commas and trim
        return trimmed.split(',').map(item => item.trim()).filter(item => item);
      
      case 'pipe':
        // Pipe-separated values
        return trimmed.split('|').map(item => item.trim()).filter(item => item);
      
      case 'newline':
        // Line-separated values
        return trimmed.split(/\r?\n/).map(item => item.trim()).filter(item => item);
      
      case 'tab':
        // Tab-separated values
        return trimmed.split('\t').map(item => item.trim()).filter(item => item);
      
      case 'semicolon':
        // Semicolon-separated values
        return trimmed.split(';').map(item => item.trim()).filter(item => item);
      
      case 'space':
        // Space-separated values
        return trimmed.split(/\s+/).filter(item => item);
      
      case 'single':
        // Single value - wrap in array
        return [trimmed];
      
      case 'empty':
      default:
        return [];
    }
  }

  /**
   * Detect input format
   */
  private detectInputFormat(input: string): { format: string; confidence: number; details: string } {
    const trimmed = input.trim();
    
    if (!trimmed) {
      return { format: 'empty', confidence: 1.0, details: 'No input provided' };
    }

    // JSON Array check
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return { format: 'json', confidence: 0.95, details: `JSON array with ${parsed.length} items` };
        }
      } catch {
        // Fall through to other checks
      }
    }

    // Count different separators
    const commaCount = (trimmed.match(/,/g) || []).length;
    const pipeCount = (trimmed.match(/\|/g) || []).length;
    const newlineCount = (trimmed.match(/\r?\n/g) || []).length;
    const tabCount = (trimmed.match(/\t/g) || []).length;
    const semicolonCount = (trimmed.match(/;/g) || []).length;
    const spaceCount = (trimmed.match(/\s+/g) || []).length;

    // Find the separator with the highest count
    const separators = [
      { type: 'pipe', count: pipeCount },
      { type: 'comma', count: commaCount },
      { type: 'newline', count: newlineCount },
      { type: 'tab', count: tabCount },
      { type: 'semicolon', count: semicolonCount },
      { type: 'space', count: spaceCount }
    ];

    const maxSeparator = separators.reduce((max, curr) => curr.count > max.count ? curr : max);

    if (maxSeparator.count > 0) {
      const format = maxSeparator.type === 'comma' ? 'csv' : maxSeparator.type;
      return {
        format,
        confidence: Math.min(0.9, maxSeparator.count * 0.1),
        details: `${maxSeparator.count} ${maxSeparator.type} separators found`
      };
    }

    // Single value fallback
    return { format: 'single', confidence: 0.5, details: 'Single value, no separators found' };
  }

  // Row management utilities
  private getCurrentRowCount(rsHost: Element): number {
    const ntxRepeatingSection = rsHost.closest('ntx-repeating-section');
    if (!ntxRepeatingSection) return 0;
    
    const rows = ntxRepeatingSection.querySelectorAll('.ntx-repeating-section-repeated-section');
    return rows.length;
  }

  private findAddButton(rsHost: Element): HTMLElement | null {
    const ntxRepeatingSection = rsHost.closest('ntx-repeating-section');
    if (!ntxRepeatingSection) return null;
    
    const addBtn = ntxRepeatingSection.querySelector('.btn-repeating-section-new-row') as HTMLElement;
    return addBtn;
  }

  private async waitForRowToExist(rsHost: Element, rowIndex: number, timeout: number = 5000): Promise<boolean> {
    const ntxRepeatingSection = rsHost.closest('ntx-repeating-section');
    if (!ntxRepeatingSection) return false;
    
    return new Promise((resolve) => {
      const checkRow = () => {
        const rows = ntxRepeatingSection.querySelectorAll('.ntx-repeating-section-repeated-section');
        return rows.length >= rowIndex;
      };
      
      if (checkRow()) {
        resolve(true);
        return;
      }
      
      const observer = new MutationObserver(() => {
        if (checkRow()) {
          observer.disconnect();
          resolve(true);
        }
      });
      
      observer.observe(ntxRepeatingSection, {
        childList: true,
        subtree: true
      });
      
      setTimeout(() => {
        observer.disconnect();
        resolve(false);
      }, timeout);
    });
  }

  render() {
    return html`<div style="display: none;"></div>`;
  }

  // Include the contract information using @nintex/form-plugin-contract
  static getMetaConfig(): PluginContract {
    return rsElementContract;
  }
}

// Register the element
customElements.define('neo-rs-filler', rsElement);

// Export the contract in the expected format
export default rsElementContract;