import { LitElement, html } from 'lit';

class CollapseElement extends LitElement {
  static getMetaConfig() {
    return {
      controlName: 'neo-rs-collapse',
      fallbackDisableSubmit: false,
      description: 'Collapsible Repeating Sections',
      iconUrl: "",
      groupName: 'NEO',
      version: '1.0',
      properties: {
        targetClass: {
          type: 'string',
          title: 'Repeating Section CSS Class',
          description: 'Please enter the class used to target the repeating section'
        },
        nameInputClass: {
          type: 'string',
          title: 'Input Name CSS Class',
          description: 'If you wish to have a dynamic section name, Please enter the class used to target input inside the section containing the section name'
        },
        sectionName: {
          type: 'string',
          title: 'Manual Section Name',
          description: 'If you wish to name each section the same, enter it here, the name will be used followed by a number, e.g. entering Item will result in Item 1, Item 2,...'
        },
        sectionCount: {
          title: 'Section Count',
          type: 'number',
          description: 'Please enter a formula which counts the repeating section using the count() function e.g. count([Form].[Repeating section 1])',
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
    nameInputClass: { type: String },
    sectionCount: { type: Number },
    targetClass: { type: String },
    showIcon: { type: Boolean },
    showName: { type: Boolean }
  };

  constructor() {
    super();
    this.sectionName = 'Section';
    this.nameInputClass = 'section-name';
    this.sectionCount = 0;
    this.targetClass = '';
    this.showIcon = true;
    this.showName = true;
    this.lastOpenIndex = -1;
    this.isInitializing = false;
    this.previousSectionCount = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    this._initTimer = setTimeout(() => {
      this.initCollapsibleSections();
      this.observeRepeatingSection();
    }, 200);
  }

  createChevronIcon(isExpanded) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('version', '1.1');
    svg.setAttribute('width', '34');
    svg.setAttribute('height', '34');
    svg.setAttribute('viewBox', '0 0 36 36');
    svg.classList.add('nx-icon--allow-events');
    svg.style.transition = 'transform 0.2s ease-in-out';

    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', isExpanded ? '#chevron-down' : '#chevron-right');
    svg.appendChild(use);

    return svg;
  }

  updateChevronState(chevron, isExpanded) {
    if (!chevron) return;
    const use = chevron.querySelector('use');
    if (use) {
      use.setAttribute('href', isExpanded ? '#chevron-down' : '#chevron-right');
    }
  }

  initCollapsibleSections() {
    if (this.isInitializing) return;
    this.isInitializing = true;
  
    try {
      const repeatingSection = document.querySelector(`.${this.targetClass}`);
  
      if (!repeatingSection) {
        console.error(`No repeating section found with class: ${this.targetClass}`);
        this.isInitializing = false;
        return;
      }
  
      const sections = repeatingSection.querySelectorAll('.ntx-repeating-section-repeated-section');
  
      if (sections.length === 0) {
        console.error('No sections found to make collapsible');
        this.isInitializing = false;
        return;
      }
  
      // Loop over each section
      for (const [index, section] of sections.entries()) {
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
          continue;
        }
  
        const overlay = section.querySelector('.ntx-repeating-section-overlay');
  
        if (!overlay) {
          console.error(`No overlay found for section ${index}`);
          continue;
        }
  
        // Styling and labeling logic
        Object.assign(overlay.style, {
          cursor: 'pointer',
          padding: '0px 0px 0px 10px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ddd',
          userSelect: 'none',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '10px'
        });
  
        // Clear existing overlay content
        overlay.innerHTML = '';
  
        // Create container for icon and label
        const contentContainer = document.createElement('div');
        contentContainer.style.display = 'flex';
        contentContainer.style.alignItems = 'center';
        contentContainer.style.gap = '10px';
        contentContainer.style.width = '100%';
  
        // Add chevron icon if enabled
        if (this.showIcon) {
          const isExpanded = index === this.lastOpenIndex;
          const chevron = this.createChevronIcon(isExpanded);
          contentContainer.appendChild(chevron);
        }
  
        // Add section label if enabled
        let sectionLabel = '';
        if (this.nameInputClass) {
          const input = section.querySelector(`input.${this.nameInputClass}`);
          if (input && input.value) {
            sectionLabel = input.value;
          }
        }
  
        if (!sectionLabel) {
          sectionLabel = this.sectionName || 'Section';
        }
  
        const sectionLabelElement = document.createElement('span');
        sectionLabelElement.textContent = `${sectionLabel} ${index + 1}`;
        sectionLabelElement.style.fontWeight = 'bold';
        sectionLabelElement.style.marginRight = 'auto';
        contentContainer.appendChild(sectionLabelElement);
  
        overlay.appendChild(contentContainer);
  
        // Set initial visibility
        const isVisible = index === this.lastOpenIndex;
        contentToToggle.style.display = isVisible ? 'block' : 'none';
        overlay.style.backgroundColor = isVisible ? '#e0e0e0' : '#f0f0f0';
  
        // Toggle event listener
        overlay.onclick = (event) => {
          if (event.target.closest('.ntx-repeating-section-remove-button')) return;
  
          this.lastOpenIndex = index;
  
          sections.forEach((s, i) => {
            let content = null;
            for (const selector of contentSelectors) {
              content = s.querySelector(selector);
              if (content) break;
            }
  
            const sectionOverlay = s.querySelector('.ntx-repeating-section-overlay');
            const chevron = sectionOverlay?.querySelector('svg');
  
            if (content && sectionOverlay) {
              const isExpanded = i === index;
              content.style.display = isExpanded ? 'block' : 'none';
              sectionOverlay.style.backgroundColor = isExpanded ? '#e0e0e0' : '#f0f0f0';
  
              if (chevron) {
                this.updateChevronState(chevron, isExpanded);
              }
            }
          });
        };
      }
  
      // Update last open index
      this.lastOpenIndex = this.lastOpenIndex === -1 ? sections.length - 1 : Math.min(this.lastOpenIndex, sections.length - 1);
  
    } catch (error) {
      console.error('Error in initCollapsibleSections:', error);
    } finally {
      this.isInitializing = false;
    }
  }  
  
  observeRepeatingSection() {
    const repeatingSection = document.querySelector(`.${this.targetClass}`);

    if (!repeatingSection) return;

    const observer = new MutationObserver(() => {
      // Debounce the initialization
      clearTimeout(this._observerTimer);
      this._observerTimer = setTimeout(() => {
        const updatedSections = repeatingSection.querySelectorAll('.ntx-repeating-section-repeated-section');

        if (updatedSections.length === 0) {
          this.lastOpenIndex = -1;
          this.previousSectionCount = 0;
        } else if (this.lastOpenIndex >= updatedSections.length) {
          this.lastOpenIndex = updatedSections.length - 1;
        }

        this.initCollapsibleSections();
      }, 100);
    });

    observer.observe(repeatingSection, { childList: true, subtree: true });
  }

  observeInputChanges() {
    const repeatingSection = document.querySelector(`.${this.targetClass}`);
    if (!repeatingSection) return;
  
    const inputs = repeatingSection.querySelectorAll(`input.${this.nameInputClass}`);
  
    // Replacing forEach with for...of loop
    for (const input of inputs) {
      input.addEventListener('input', (event) => {
        const section = event.target.closest('.ntx-repeating-section-repeated-section');
        if (!section) return;
  
        const sectionLabel = section.querySelector('.ntx-repeating-section-overlay span');
        if (sectionLabel) {
          // Update the label with the new input value
          sectionLabel.textContent = `${event.target.value} ${this.getSectionIndex(section) + 1}`;
        }
      });
    }
  }

  // Debugging function to render the values of the properties
  renderPropertiesPreview() {
    return html`
      <div style="padding: 10px; background-color: #f4f4f4; border: 1px solid #ddd;">
        <h3>Properties Debug Preview</h3>
        <ul>
          <li><strong>sectionName:</strong> ${this.sectionName}</li>
          <li><strong>nameInputClass:</strong> ${this.nameInputClass}</li>
          <li><strong>sectionCount:</strong> ${this.sectionCount}</li>
          <li><strong>targetClass:</strong> ${this.targetClass}</li>
          <li><strong>showIcon:</strong> ${this.showIcon}</li>
          <li><strong>showName:</strong> ${this.showName}</li>
        </ul>
      </div>
    `;
  }
  
  render() {
    return html`
      ${this.renderPropertiesPreview()}
    `;
  }
}

customElements.define('neo-rs-collapse', CollapseElement);

export default CollapseElement;