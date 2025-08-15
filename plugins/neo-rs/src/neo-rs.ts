import { LitElement, html, css, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import { PluginContract, PropType as PluginProperty } from '@nintex/form-plugin-contract';

// Define the contract information using @nintex/form-plugin-contract
const rsElementContract: PluginContract = {
  version: '1.0',
  fallbackDisableSubmit: false,
  controlName: 'neo-rs',
  description: 'Repeating section manipulator',
  iconUrl: 'repeating-section',
  groupName: 'Form Tools',
  properties: {
    rsnumber: {
      type: 'number',
      title: 'Number of sections by default',
      description: 'Please ensure the default value of sections is not changed from 1',
    },
    rstarget: {
      type: 'string',
      title: 'Target class',
      description: 'Class name used to target repeating section',
    },
  },
  standardProperties: {
    fieldLabel: true,
    description: true,
  },
};

class rsElement extends LitElement {
  @property({ type: Number }) rsnumber: number;
  @property({ type: String }) rstarget: string = '';

  // internal guards
  private _isRunning = false;
  private _lastApplied: string | null = null;

  constructor() {
    super();
    this.rsnumber = 0;
    this.rstarget = '';
  }

  firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    this.runActions();
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('rsnumber') || changedProperties.has('rstarget')) {
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
    console.log('[neo-rs] Looking for add button in/near:', rsHost);
    
    // The button is actually a sibling of the ntx-repeating-section parent
    const ntxRepeatingSection = rsHost.closest('ntx-repeating-section');
    console.log('[neo-rs] Parent ntx-repeating-section:', ntxRepeatingSection);
    
    if (ntxRepeatingSection) {
      // Look for the button as next sibling of ntx-repeating-section
      const next = ntxRepeatingSection.nextElementSibling as HTMLElement | null;
      console.log('[neo-rs] Next sibling of ntx-repeating-section:', next);
      
      if (next && next.classList.contains('btn-repeating-section-new-row')) {
        console.log('[neo-rs] Found add button as next sibling:', next);
        return next as HTMLButtonElement;
      }
      
      // Also check if the button is inside the ntx-repeating-section
      const btn = ntxRepeatingSection.querySelector<HTMLButtonElement>('.btn-repeating-section-new-row');
      if (btn) {
        console.log('[neo-rs] Found add button inside ntx-repeating-section:', btn);
        return btn;
      }
    }
    
    // Fallback: look for button anywhere in the document near our target
    const allAddButtons = document.querySelectorAll('.btn-repeating-section-new-row');
    console.log('[neo-rs] All add buttons in document:', allAddButtons.length, allAddButtons);
    
    // If there's only one, use it
    if (allAddButtons.length === 1) {
      console.log('[neo-rs] Using the only add button found:', allAddButtons[0]);
      return allAddButtons[0] as HTMLButtonElement;
    }
    
    // Original fallback logic
    const next = (rsHost as HTMLElement).nextElementSibling as HTMLElement | null;
    console.log('[neo-rs] Next sibling of rsHost:', next);
    
    if (next) {
      const btn = next.querySelector<HTMLButtonElement>('button.ntx-repeating-section-add-button, button[aria-label="Add"], button[title*="Add"], .btn-repeating-section-new-row');
      if (btn) {
        console.log('[neo-rs] Found add button in next sibling:', btn);
        return btn;
      }
    }
    
    let btn = rsHost.querySelector<HTMLButtonElement>('button.ntx-repeating-section-add-button, button[aria-label="Add"], button[title*="Add"], .btn-repeating-section-new-row');
    if (btn) {
      console.log('[neo-rs] Found add button in RS host:', btn);
      return btn;
    }
    
    const sr = (rsHost as any).shadowRoot as ShadowRoot | undefined;
    if (sr) {
      btn = sr.querySelector<HTMLButtonElement>('button.ntx-repeating-section-add-button, button[aria-label="Add"], button[title*="Add"], .btn-repeating-section-new-row');
      if (btn) {
        console.log('[neo-rs] Found add button in shadow root:', btn);
        return btn;
      }
    }
    
    // Let's also try some broader searches
    const allButtons = document.querySelectorAll('button');
    console.log('[neo-rs] Total buttons in document:', allButtons.length);
    
    const addButtons = document.querySelectorAll('button[title*="Add"], button[aria-label*="Add"]');
    console.log('[neo-rs] Potential add buttons by attributes:', addButtons.length, addButtons);
    
    // Check buttons by text content (since :contains() isn't valid CSS)
    const buttonsByText = Array.from(allButtons).filter(btn => 
      btn.textContent && btn.textContent.toLowerCase().includes('add')
    );
    console.log('[neo-rs] Buttons with "add" in text:', buttonsByText.length, buttonsByText);
    
    return null;
  }

  // Find remove buttons scoped to this repeating section
  private findRemoveButtons(rsHost: Element): HTMLButtonElement[] {
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
    const removeButtons = this.findRemoveButtons(rsHost);
    console.log('[neo-rs] Remove buttons found:', removeButtons.length, removeButtons);
    
    // If there's at least one remove button, assume count = removes + 1; else at least 1 row exists
    const count = removeButtons && removeButtons.length ? removeButtons.length + 1 : 1;
    console.log('[neo-rs] Calculated current row count:', count);
    return count;
  }

  private async runActions() {
    console.log('[neo-rs] runActions called', { rstarget: this.rstarget, rsnumber: this.rsnumber });
    
    const targetClassName = (this.rstarget || '').trim();
    const desired = Math.max(1, Number(this.rsnumber) || 1);
    
    console.log('[neo-rs] Parsed values', { targetClassName, desired });
    
    if (!targetClassName) {
      console.warn('[neo-rs] No target class specified');
      return;
    }
    if (this._isRunning) {
      console.log('[neo-rs] Already running, skipping');
      return;
    }

    const hasEscape = typeof (window as any).CSS !== 'undefined' && typeof (CSS as any).escape === 'function';
    const safeClass = hasEscape
      ? (CSS as any).escape(targetClassName)
      : targetClassName.replace(/([^a-zA-Z0-9_-])/g, '\\$1');

    const key = `${safeClass}:${desired}`;
    if (this._lastApplied === key) {
      console.log('[neo-rs] Already applied this configuration, skipping');
      return;
    }

    console.log('[neo-rs] Looking for selector:', `.${safeClass}`);
    this._isRunning = true;

    // First, let's see what elements exist in the document
    const allElements = document.querySelectorAll('*');
    console.log('[neo-rs] Total elements in document:', allElements.length);
    
    // Look for elements with our target class
    const elementsWithClass = document.querySelectorAll(`.${safeClass}`);
    console.log('[neo-rs] Elements with target class:', elementsWithClass.length, elementsWithClass);

    // Look for any repeating section elements
    const repeatingSections = document.querySelectorAll('ntx-repeating-section, [class*="repeating"], [class*="section"]');
    console.log('[neo-rs] Possible repeating sections:', repeatingSections.length, repeatingSections);

    const rsHost = await this.waitForElement(`.${safeClass}`);
    if (!rsHost) {
      console.warn('[neo-rs] Repeating section not found:', targetClassName);
      this._isRunning = false;
      return;
    }

    console.log('[neo-rs] Found RS host:', rsHost);

    const addBtn = this.findAddButton(rsHost);
    if (!addBtn) {
      console.warn('[neo-rs] Add button not found near repeating section:', targetClassName);
      console.log('[neo-rs] RS host HTML:', rsHost.outerHTML.substring(0, 500));
      console.log('[neo-rs] Next sibling:', rsHost.nextElementSibling);
      this._isRunning = false;
      return;
    }

    console.log('[neo-rs] Found add button:', addBtn);

    const currentCount = this.getCurrentRowCount(rsHost);
    const toAdd = Math.max(0, desired - currentCount);
    
    console.log('[neo-rs] Row calculation', { currentCount, desired, toAdd });

    if (toAdd > 0) {
      console.log('[neo-rs] Adding', toAdd, 'rows');
      for (let i = 0; i < toAdd; i++) {
        console.log('[neo-rs] Clicking add button, iteration:', i + 1);
        try { 
          addBtn.click(); 
          // Small delay between clicks
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error('[neo-rs] Error clicking add button:', error);
        }
      }
    } else {
      console.log('[neo-rs] No rows to add');
    }

    this._lastApplied = key;
    this._isRunning = false;
    console.log('[neo-rs] runActions completed');
  }
  
  render() {
    return html`
      <div>rsNumber: ${this.rsnumber}</div>
    `;
  }

  // Include the contract information using @nintex/form-plugin-contract
  static getMetaConfig(): PluginContract {
    return rsElementContract;
  }
}

customElements.define('neo-rs', rsElement);