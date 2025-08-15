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
    const next = (rsHost as HTMLElement).nextElementSibling as HTMLElement | null;
    if (next) {
      const btn = next.querySelector<HTMLButtonElement>('button.ntx-repeating-section-add-button, button[aria-label="Add"], button[title*="Add"]');
      if (btn) return btn;
    }
    let btn = rsHost.querySelector<HTMLButtonElement>('button.ntx-repeating-section-add-button, button[aria-label="Add"], button[title*="Add"]');
    if (btn) return btn;
    const sr = (rsHost as any).shadowRoot as ShadowRoot | undefined;
    if (sr) {
      btn = sr.querySelector<HTMLButtonElement>('button.ntx-repeating-section-add-button, button[aria-label="Add"], button[title*="Add"]');
      if (btn) return btn;
    }
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
    // If there's at least one remove button, assume count = removes + 1; else at least 1 row exists
    const count = removeButtons && removeButtons.length ? removeButtons.length + 1 : 1;
    return count;
  }

  private async runActions() {
    const targetClassName = (this.rstarget || '').trim();
    const desired = Math.max(1, Number(this.rsnumber) || 1);
    if (!targetClassName) return;
    if (this._isRunning) return;

    const hasEscape = typeof (window as any).CSS !== 'undefined' && typeof (CSS as any).escape === 'function';
    const safeClass = hasEscape
      ? (CSS as any).escape(targetClassName)
      : targetClassName.replace(/([^a-zA-Z0-9_-])/g, '\\$1');

    const key = `${safeClass}:${desired}`;
    if (this._lastApplied === key) return;

    this._isRunning = true;

    const rsHost = await this.waitForElement(`.${safeClass}`);
    if (!rsHost) {
      console.warn('[neo-rs] Repeating section not found:', targetClassName);
      this._isRunning = false;
      return;
    }

    const addBtn = this.findAddButton(rsHost);
    if (!addBtn) {
      console.warn('[neo-rs] Add button not found near repeating section:', targetClassName);
      this._isRunning = false;
      return;
    }

    const currentCount = this.getCurrentRowCount(rsHost);
    const toAdd = Math.max(0, desired - currentCount);
    for (let i = 0; i < toAdd; i++) {
      try { addBtn.click(); } catch {}
    }

    this._lastApplied = key;
    this._isRunning = false;
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