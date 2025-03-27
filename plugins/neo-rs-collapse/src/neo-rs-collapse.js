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
    // Find the repeating section container using the provided target class
    const repeatingSection = document.querySelector(`.${this.targetClass}`);

    if (!repeatingSection) {
      console.error(`No repeating section found with class: ${this.targetClass}`);
      return;
    }

    // Find all repeated sections
    const sections = repeatingSection.querySelectorAll('.ntx-repeating-section-repeated-section');

    if (sections.length === 0) {
      console.error('No sections found to make collapsible');
      return;
    }

    // Process each section
    sections.forEach((section, index) => {
      // Expanded content selectors
      const contentSelectors = [
        '.nx-form-runtime-light',
        '.nx-form-runtime',
        '[data-form-content]',
        '.ng-star-inserted > div',
        '.nx-form-runtime-section'
      ];

      // Find the content to toggle
      let contentToToggle = null;
      for (let selector of contentSelectors) {
        contentToToggle = section.querySelector(selector);
        if (contentToToggle) break;
      }

      if (!contentToToggle) {
        console.error(`No content found to toggle for section ${index}`);
        return;
      }

      // Find the overlay
      const overlay = section.querySelector('.ntx-repeating-section-overlay');

      if (!overlay) {
        console.error(`No overlay found for section ${index}`);
        return;
      }

      // Style the overlay as clickable
      Object.assign(overlay.style, {
        cursor: 'pointer',
        padding: '10px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ddd',
        marginBottom: '5px',
        userSelect: 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      });

      // Add section number text
      const sectionLabel = document.createElement('span');
      sectionLabel.textContent = `${this.sectionName} ${index + 1}`;
      sectionLabel.style.fontWeight = 'bold';
      
      // Prepend section label to the overlay
      overlay.insertBefore(sectionLabel, overlay.firstChild);

      // Initial state - hide all but first section
      if (index > 0) {
        contentToToggle.style.display = 'none';
      }

      // Add click event to toggle
      overlay.addEventListener('click', (event) => {
        // Prevent conflict with existing remove button
        if (event.target.closest('.ntx-repeating-section-remove-button')) {
          return;
        }

        // Hide all sections
        sections.forEach((s, i) => {
          // Reuse the content selection logic
          let content = null;
          for (let selector of contentSelectors) {
            content = s.querySelector(selector);
            if (content) break;
          }

          const sectionOverlay = s.querySelector('.ntx-repeating-section-overlay');
          
          if (content && sectionOverlay) {
            content.style.display = i === index ? 'block' : 'none';
            
            // Add visual indication of active section
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