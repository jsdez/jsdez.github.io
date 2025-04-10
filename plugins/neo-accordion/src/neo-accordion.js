import { LitElement, html, css } from 'lit';

class NeoAccordionElement extends LitElement {
  static getMetaConfig() {
    return {
      controlName: 'neo-accordion',
      fallbackDisableSubmit: false,
      description: '',
      iconUrl: "",
      groupName: 'NEO',
      version: '1.0',
      properties: {
        targetClass: {
          type: 'string',
          title: 'Target Class',
          description: 'Please enter the class used to identify the accordion element, this class is applied to each group in the accordion',
        },
      },
      standardProperties: {
        fieldLabel: true,
        description: true,
      }
    };
  }

  static properties = {
    targetClass: { type: String }
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

  initAccordionLogic() {
    if (!this.targetClass) return;

    const ACCORDION_ITEMS = document.querySelectorAll(`.${this.targetClass}`);

    const collapseAllExcept = (current) => {
      ACCORDION_ITEMS.forEach(item => {
        if (item !== current && !item.classList.contains('nx-group-control-is-collapsed')) {
          const header = item.querySelector(`.${this.targetClass} .nx-group-control-header`);
          header?.click();
        }
      });
    };

    // Initial collapse logic to enforce only one expanded at start
    let firstExpandedFound = false;
    ACCORDION_ITEMS.forEach(item => {
      const isCollapsed = item.classList.contains('nx-group-control-is-collapsed');
      if (!isCollapsed) {
        if (!firstExpandedFound) {
          firstExpandedFound = true;
        } else {
          const header = item.querySelector(`.${this.targetClass} .nx-group-control-header`);
          header?.click();
        }
      }
    });

    document.body.addEventListener('click', (event) => {
      const header = event.target.closest(`.${this.targetClass} .nx-group-control-header`);
      if (!header) return;

      const item = header.closest(`.${this.targetClass}`);
      if (!item) return;

      const isCollapsed = item.classList.contains('nx-group-control-is-collapsed');
      if (!isCollapsed) {
        collapseAllExcept(item);
      }
    });
  }
}

customElements.define('neo-accordion', NeoAccordionElement);
