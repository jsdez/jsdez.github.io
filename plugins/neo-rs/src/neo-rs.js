"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lit_1 = require("lit");
const decorators_js_1 = require("lit/decorators.js");
// Define the contract information using @nintex/form-plugin-contract
const rsElementContract = {
    version: '1.0',
    fallbackDisableSubmit: false,
    controlName: 'neo-rs',
    description: 'Repeating section manipulator',
    iconUrl: 'repeating-section',
    groupName: 'NEO',
    properties: {
        rsnumber: {
            type: 'integer',
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
class rsElement extends lit_1.LitElement {
    constructor() {
        super();
        this.rstarget = '';
        this.rsnumber = 0;
        this.rstarget = '';
    // internal guards
    this._isRunning = false;
    this._lastApplied = null;
    }
    firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        this.runActions();
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('rsnumber') || changedProperties.has('rstarget')) {
            this.runActions();
        }
    }
    // Utility: wait for an element to appear in the main document
    async waitForElement(selector, timeout = 8000) {
        const root = this.ownerDocument || document;
        const existing = root.querySelector(selector);
        if (existing)
            return existing;
        return new Promise((resolve) => {
            const obs = new MutationObserver(() => {
                const el = root.querySelector(selector);
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
    findAddButton(rsHost) {
        var _a, _b, _c;
        const next = rsHost === null || rsHost === void 0 ? void 0 : rsHost.nextElementSibling;
        if (next) {
            const btn = next.querySelector('button.ntx-repeating-section-add-button, button[aria-label="Add"], button[title*="Add"]');
            if (btn)
                return btn;
        }
        let btn = (_a = rsHost) === null || _a === void 0 ? void 0 : _a.querySelector('button.ntx-repeating-section-add-button, button[aria-label="Add"], button[title*="Add"]');
        if (btn)
            return btn;
        if (rsHost === null || rsHost === void 0 ? void 0 : rsHost.shadowRoot) {
            btn = (_c = (_b = rsHost.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector('button.ntx-repeating-section-add-button, button[aria-label="Add"], button[title*="Add"]')) !== null && _c !== void 0 ? _c : null;
            if (btn)
                return btn;
        }
        return null;
    }
    // Find remove buttons scoped to this repeating section
    findRemoveButtons(rsHost) {
        var _a, _b, _c;
        const containers = [rsHost, rsHost === null || rsHost === void 0 ? void 0 : rsHost.nextElementSibling, rsHost === null || rsHost === void 0 ? void 0 : rsHost.shadowRoot].filter(Boolean);
        for (const scope of containers) {
            const btns = (_a = scope.querySelectorAll) === null || _a === void 0 ? void 0 : _a.call(scope, 'button.ntx-repeating-section-remove-button, button[aria-label="Remove"], button[title*="Remove"]');
            if (btns && btns.length)
                return Array.from(btns);
        }
        const root = this.ownerDocument || document;
        return Array.from((_c = (_b = root) === null || _b === void 0 ? void 0 : _b.querySelectorAll('button.ntx-repeating-section-remove-button, button[aria-label="Remove"], button[title*="Remove"]')) !== null && _c !== void 0 ? _c : []);
    }
    async runActions() {
        const targetClassName = (this.rstarget || '').trim();
        const desired = Math.max(1, Number(this.rsnumber) || 1);
        if (!targetClassName)
            return;
        if (this._isRunning)
            return;
        const safeClass = (typeof CSS !== 'undefined' && CSS.escape) ? CSS.escape(targetClassName) : targetClassName.replace(/([^a-zA-Z0-9_-])/g, '\\$1');
        const key = `${safeClass}:${desired}`;
        if (this._lastApplied === key)
            return;
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
        // Determine current count by counting remove buttons + 1 (first row usually has no remove)
        const currentCount = this.getCurrentRowCount(rsHost);
        const toAdd = Math.max(0, desired - currentCount);
        for (let i = 0; i < toAdd; i++) {
            try {
                addBtn.click();
            }
            catch (_a) { }
        }
        this._lastApplied = key;
        this._isRunning = false;
    }
    getCurrentRowCount(rsHost) {
        const removeButtons = this.findRemoveButtons(rsHost);
        // If there's at least one remove button, assume count = removes + 1; else at least 1 row exists
        const count = (removeButtons && removeButtons.length) ? removeButtons.length + 1 : 1;
        return count;
    }
    clearExistingRepeatingSections(rsHost) {
        const removeButtons = this.findRemoveButtons(rsHost);
        for (const btn of removeButtons) {
            try {
                btn.click();
            }
            catch (_a) { }
        }
    }
    render() {
        return (0, lit_1.html) `
      <div>rsNumber: ${this.rsnumber}</div>
    `;
    }
    // Include the contract information using @nintex/form-plugin-contract
    static getMetaConfig() {
        return rsElementContract;
    }
}
__decorate([
    (0, decorators_js_1.property)({ type: Number })
], rsElement.prototype, "rsnumber", void 0);
__decorate([
    (0, decorators_js_1.property)({ type: String })
], rsElement.prototype, "rstarget", void 0);
customElements.define('neo-rs', rsElement);
