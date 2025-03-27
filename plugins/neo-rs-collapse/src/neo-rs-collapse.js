import { LitElement } from 'lit';

class CollapseElement extends LitElement {
  static getMetaConfig() {
    return {
      controlName: 'neo-rs-collapse',
      fallbackDisableSubmit: false,
      description: 'Collapsible Repeating Sections',
      iconUrl: "",
      groupName: 'Visual Data',
      version: '1.0',
      properties: {
        sectionName: {
          type: 'string',
          title: 'Section Name',
          description: 'If you wish to name each section, enter it here, the name will be used followed by a number, e.g. entering Item will result in Item 1, Item 2,...'
        },
        sectionCount: {
          title: 'Section Count',
          type: 'number',
          description: 'Please enter a formula which counts the repeating section using the count() function e.g. count([Form].[Repeating section 1])',
        },
        targetClass: {
          type: 'string',
          title: 'Repeating Section CSS Class',
          description: 'Please enter the class used to target the repeating section'
        },
        showIcon: {
          title: 'Show Icon',
          type: 'boolean',
          defaultValue: true,
        },
        showName: {
          title: 'Show Name',
          type: 'boolean',
          defaultValue: true,
        },
      },
      standardProperties: {
        fieldLabel: true,
        description: true,
      }
    };
  }

  static properties = {
    sectionName: { type: String },
    sectionCount: { type: Number },
    targetClass: { type: String },
    showIcon: { type: Boolean },
    showName: { type: Boolean }
  };

  constructor() {
    super();
    this.sectionName = 'Section';
    this.sectionCount = 0;
    this.targetClass = '';
    this.showIcon = true;
    this.showName = true;
  }

  connectedCallback() {
    super.connectedCallback();
    // Use setTimeout to ensure the form is fully loaded
    setTimeout(() => this.initCollapsibleSections(), 100);
  }

  initCollapsibleSections() {
    const repeatingSection = document.querySelector(`.${this.targetClass}`);
  
    if (!repeatingSection) {
      console.error(`No repeating section found with class: ${this.targetClass}`);
      return;
    }
  
    const sections = repeatingSection.querySelectorAll('.ntx-repeating-section-repeated-section');
  
    if (sections.length === 0) {
      console.error('No sections found to make collapsible');
      return;
    }
  
    sections.forEach((section, index) => {
      const contentSelectors = [
        '.nx-form-runtime-light',
        '.nx-form-runtime',
        '[data-form-content]',
        '.ng-star-inserted > div',
        '.nx-form-runtime-section'
      ];
  
      let contentToToggle = null;
      for (const selector of contentSelectors) {
        contentToToggle = section.querySelector(selector);
        if (contentToToggle) break;
      }
  
      if (!contentToToggle) {
        console.error(`No content found to toggle for section ${index}`);
        return;
      }
  
      const overlay = section.querySelector('.ntx-repeating-section-overlay');
  
      if (!overlay) {
        console.error(`No overlay found for section ${index}`);
        return;
      }
  
      // **FIX: Prevent duplicate section labels**
      const existingLabel = overlay.querySelector('.section-label');
      if (existingLabel) {
        existingLabel.remove(); // Remove old label before adding a new one
      }
  
      // Add section number text
      const sectionLabel = document.createElement('span');
      sectionLabel.textContent = `${this.sectionName} ${index + 1}`;
      sectionLabel.classList.add('section-label'); // Add a class for easy identification
      sectionLabel.style.fontWeight = 'bold';
      sectionLabel.style.marginRight = 'auto';
  
      overlay.insertBefore(sectionLabel, overlay.firstChild);
  
      if (index > 0) {
        contentToToggle.style.display = 'none';
      }
  
      overlay.addEventListener('click', (event) => {
        if (event.target.closest('.ntx-repeating-section-remove-button')) {
          return;
        }
  
        sections.forEach((s, i) => {
          let content = null;
          for (const selector of contentSelectors) {
            content = s.querySelector(selector);
            if (content) break;
          }
  
          const sectionOverlay = s.querySelector('.ntx-repeating-section-overlay');
  
          if (content && sectionOverlay) {
            content.style.display = i === index ? 'block' : 'none';
            sectionOverlay.style.backgroundColor = i === index ? '#e0e0e0' : '#f0f0f0';
          }
        });
      });
    });
  }
  
  // Minimal render method (no-op)
  render() {
    return null;
  }
}

customElements.define('neo-rs-collapse', CollapseElement);

export default CollapseElement;