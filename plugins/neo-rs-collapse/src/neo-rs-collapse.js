import { LitElement } from 'lit';

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
    this.nameInputClass = '';
    this.sectionCount = 0;
    this.targetClass = '';
    this.showIcon = true;
    this.showName = true;
    this.lastOpenIndex = -1;
    this.isInitializing = false;
    this.previousSectionCount = 0;
    this.nameInputObservers = new Map();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Clean up all observers when component is disconnected
    this.nameInputObservers.forEach(observer => observer.disconnect());
    this.nameInputObservers.clear();
  }

  getSectionName(section, index) {
    // If nameInputClass is specified, try to find the input with that class
    if (this.nameInputClass) {
      // First try to find a direct input element with the class
      const nameInput = section.querySelector(`.${this.nameInputClass} input`);
      if (nameInput && nameInput.value) {
        return nameInput.value;
      }
      
      // Try to find any element with the class that might contain the value
      const nameElement = section.querySelector(`.${this.nameInputClass}`);
      if (nameElement) {
        // Check various ways the value might be stored
        if (nameElement.value) return nameElement.value;
        if (nameElement.textContent && nameElement.textContent.trim()) return nameElement.textContent.trim();
        if (nameElement.innerText && nameElement.innerText.trim()) return nameElement.innerText.trim();
      }
    }
    
    // Fall back to sectionName with numbering if specified
    if (this.sectionName) {
      return `${this.sectionName} ${index + 1}`;
    }
    
    // Default to generic "Section" with numbering
    return `Section ${index + 1}`;
  }

  setupNameInputObserver(section, index) {
    if (!this.nameInputClass) return;

    // Find the name input element
    const nameInput = section.querySelector(`.${this.nameInputClass} input`) || 
                     section.querySelector(`.${this.nameInputClass}`);
    if (!nameInput) return;

    // Clean up any existing observer for this section
    if (this.nameInputObservers.has(section)) {
      this.nameInputObservers.get(section).disconnect();
      this.nameInputObservers.delete(section);
    }

    const updateSectionName = () => {
      const overlay = section.querySelector('.ntx-repeating-section-overlay');
      if (!overlay) return;
      
      const label = overlay.querySelector('.section-label');
      if (label) {
        label.textContent = this.getSectionName(section, index);
      }
    };

    // Create a new observer for this input
    const observer = new MutationObserver(updateSectionName);
    
    // Observe both value changes and character data (for contenteditable)
    observer.observe(nameInput, {
      attributes: true,
      attributeFilter: ['value'],
      childList: true,
      subtree: true,
      characterData: true
    });

    // Also listen for input events (for immediate feedback)
    const inputHandler = () => updateSectionName();
    nameInput.addEventListener('input', inputHandler);
    
    // Store the observer and handler for cleanup
    this.nameInputObservers.set(section, {
      observer,
      inputHandler,
      element: nameInput
    });

    // Initial update
    updateSectionName();
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

      const wasNewSectionAdded = sections.length > this.previousSectionCount;
      if (wasNewSectionAdded) {
        this.lastOpenIndex = sections.length - 1;
      } else if (this.lastOpenIndex >= sections.length || this.lastOpenIndex < -1) {
        this.lastOpenIndex = sections.length - 1;
      }

      const sectionToOpen = this.lastOpenIndex === -1 
        ? sections.length - 1 
        : Math.min(this.lastOpenIndex, sections.length - 1);

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

        overlay.innerHTML = '';
        const contentContainer = document.createElement('div');
        contentContainer.style.display = 'flex';
        contentContainer.style.alignItems = 'center';
        contentContainer.style.gap = '10px';
        contentContainer.style.width = '100%';

        if (this.showIcon) {
          const isExpanded = index === sectionToOpen;
          const chevron = this.createChevronIcon(isExpanded);
          contentContainer.appendChild(chevron);
        }

        if (this.showName) {
          const sectionLabel = document.createElement('span');
          sectionLabel.textContent = this.getSectionName(section, index);
          sectionLabel.classList.add('section-label');
          sectionLabel.style.fontWeight = 'bold';
          sectionLabel.style.marginRight = 'auto';
          contentContainer.appendChild(sectionLabel);
        }

        overlay.appendChild(contentContainer);

        const isVisible = index === sectionToOpen;
        contentToToggle.style.display = isVisible ? 'block' : 'none';
        overlay.style.backgroundColor = isVisible ? '#e0e0e0' : '#f0f0f0';

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

        // Set up observation for name input changes
        this.setupNameInputObserver(section, index);
      });

      this.lastOpenIndex = sectionToOpen;
      this.previousSectionCount = sections.length;
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

  render() {
    return null;
  }
}

customElements.define('neo-rs-collapse', CollapseElement);

export default CollapseElement;