import { LitElement, html, css } from 'lit';

class NeoAccordionElement extends LitElement {
  static getMetaConfig() {
    return {
      controlName: 'neo-accordion',
      fallbackDisableSubmit: false,
      description: '',
      iconUrl: "group-control",
      groupName: 'NEO',
      version: '1.0',
      properties: {
        targetClass: {
          type: 'string',
          title: 'Target Class',
          description: 'Please enter the class used to identify the accordion element, this class is applied to each group in the accordion',
        },
        reload: {
          type: 'boolean',
          title: 'Reload',
          description: 'Set to true to reinitialize the accordion after external updates. The control resets this value to false when reloading is complete.',
        },
      },
      standardProperties: {
        fieldLabel: true,
        description: true,
      }
    };
  }

  static properties = {
    targetClass: { type: String },
    reload: { type: Boolean }
  };

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  constructor() {
    super();
    this.targetClass = '';
    this.reload = false;
    this.lastOpenedItem = null;
    this.accordionObserver = null;
    this.accordionClickHandler = null;
    this.reconcileAnimationFrame = null;
    this.reloadAnimationFrame = null;
  }

  render() {
    return html``;
  }

  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => {
      this.initAccordionLogic();
    }, 300);
  }

  updated(changedProperties) {
    if (changedProperties.has('reload') && this.reload) {
      this.reloadAccordionLogic();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.disposeAccordionLogic();
    this.lastOpenedItem = null;

    if (this.reloadAnimationFrame !== null) {
      cancelAnimationFrame(this.reloadAnimationFrame);
      this.reloadAnimationFrame = null;
    }
  }

  disposeAccordionLogic() {
    this.accordionObserver?.disconnect();
    this.accordionObserver = null;

    if (this.accordionClickHandler) {
      document.body.removeEventListener('click', this.accordionClickHandler);
      this.accordionClickHandler = null;
    }

    if (this.reconcileAnimationFrame !== null) {
      cancelAnimationFrame(this.reconcileAnimationFrame);
      this.reconcileAnimationFrame = null;
    }
  }

  reloadAccordionLogic() {
    if (this.reloadAnimationFrame !== null) return;

    this.disposeAccordionLogic();
    this.requestUpdate();
    this.reloadAnimationFrame = requestAnimationFrame(() => {
      this.reloadAnimationFrame = null;

      if (this.isConnected) {
        this.initAccordionLogic();
      }

      // Reset the trigger only after the reinitialization attempt is complete.
      this.reload = false;
    });
  }

  initAccordionLogic() {
    if (!this.targetClass || this.accordionObserver) return;

    const getAccordionItems = () => Array.from(document.querySelectorAll(`.${this.targetClass}`));
    const getHeader = (item) => item.querySelector('.nx-group-control-header');
    const isCollapsed = (item) => item.classList.contains('nx-group-control-is-collapsed');

    const collapseAllExcept = (current) => {
      getAccordionItems().forEach(item => {
        if (item !== current && !isCollapsed(item)) {
          getHeader(item)?.click();
        }
      });
    };

    const collapseAllExceptPreferred = () => {
      this.reconcileAnimationFrame = null;
      const expandedItems = getAccordionItems().filter(item => !isCollapsed(item));
      const preferredItem = expandedItems.includes(this.lastOpenedItem)
        ? this.lastOpenedItem
        : expandedItems[0];

      expandedItems.forEach(item => {
        if (item !== preferredItem) {
          getHeader(item)?.click();
        }
      });
    };

    const scheduleAccordionReconciliation = () => {
      if (this.reconcileAnimationFrame !== null) return;
      this.reconcileAnimationFrame = requestAnimationFrame(collapseAllExceptPreferred);
    };

    // Keep the initial state to a single expanded group.
    collapseAllExceptPreferred();

    this.accordionClickHandler = (event) => {
      const header = event.target.closest(`.${this.targetClass} .nx-group-control-header`);
      if (!header) return;

      const item = header.closest(`.${this.targetClass}`);
      if (!item) return;

      // Header handlers run before this delegated listener, so this detects a newly expanded group.
      if (!isCollapsed(item)) {
        this.lastOpenedItem = item;
        collapseAllExcept(item);
      }
    };
    document.body.addEventListener('click', this.accordionClickHandler);

    // Mass updates can alter group classes without a header click. Reconcile after the batch finishes.
    this.accordionObserver = new MutationObserver(scheduleAccordionReconciliation);
    this.accordionObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
      childList: true,
      subtree: true
    });
  }
}

customElements.define('neo-accordion', NeoAccordionElement);
