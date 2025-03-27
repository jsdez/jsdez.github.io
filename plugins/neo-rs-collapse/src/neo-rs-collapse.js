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
    this.lastOpenIndex = -1;
    this.isInitializing = false;
  }

  connectedCallback() {
    super.connectedCallback();
    // Debounce initialization
    this._initTimer = setTimeout(() => {
      this.initCollapsibleSections();
      this.observeRepeatingSection();
    }, 200);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Clear any pending timers
    if (this._initTimer) {
      clearTimeout(this._initTimer);
    }
  }

  initCollapsibleSections() {
    // Prevent recursive calls
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

      // Adjust last open index if it's out of bounds
      if (this.lastOpenIndex >= sections.length || this.lastOpenIndex < -1) {
        this.lastOpenIndex = sections.length - 1;
      }

      // Determine the section to keep open
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

        // Styling and labeling logic remains the same as previous version
        Object.assign(overlay.style, {
          cursor: 'pointer',
          padding: '10px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ddd',
          userSelect: 'none',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '10px'
        });

        // Remove existing label
        const existingLabel = overlay.querySelector('.section-label');
        if (existingLabel) existingLabel.remove();

        // Create section label
        const sectionLabel = document.createElement('span');
        sectionLabel.textContent = `${this.sectionName} ${index + 1}`;
        sectionLabel.classList.add('section-label');
        sectionLabel.style.fontWeight = 'bold';
        sectionLabel.style.marginRight = 'auto';

        overlay.insertBefore(sectionLabel, overlay.firstChild);

        // Determine visibility
        const isVisible = index === sectionToOpen;
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

            if (content && sectionOverlay) {
              content.style.display = i === index ? 'block' : 'none';
              sectionOverlay.style.backgroundColor = i === index ? '#e0e0e0' : '#f0f0f0';
            }
          });
        };
      });

      // Update last open index
      this.lastOpenIndex = sectionToOpen;
    } catch (error) {
      console.error('Error in initCollapsibleSections:', error);
    } finally {
      // Always reset initialization flag
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