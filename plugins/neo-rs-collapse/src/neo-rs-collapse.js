import { LitElement } from 'lit';

class CollapseElement extends LitElement {
  static getMetaConfig() {
    return {
      controlName: 'neo-rs-collapse',
      fallbackDisableSubmit: false,
      description: 'Collapsible Repeating Sections',
      iconUrl: "",
      groupName: 'NEO',
      version: '1.2.0',
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
        animationSpeed: {
          title: 'Animation Speed (ms)',
          type: 'number',
          defaultValue: 200,
        }
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
    showName: { type: Boolean },
    animationSpeed: { type: Number }
  };

  constructor() {
    super();
    this.sectionName = 'Section';
    this.sectionCount = 0;
    this.targetClass = '';
    this.showIcon = true;
    this.showName = true;
    this.animationSpeed = 200;
    this.lastOpenIndex = -1;
    this.isInitializing = false;
    this.previousSectionCount = 0;
    this.clickHandlers = new WeakMap();
    this.contentSelectors = [
      '.nx-form-runtime-light',
      '.nx-form-runtime',
      '[data-form-content]',
      '.ng-star-inserted > div',
      '.nx-form-runtime-section'
    ];
    this.observer = null;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.cleanup();
  }

  cleanup() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    
    clearTimeout(this._initTimer);
    clearTimeout(this._observerTimer);
    
    // Remove event listeners
    const repeatingSection = document.querySelector(`.${this.targetClass}`);
    if (repeatingSection) {
      const sections = repeatingSection.querySelectorAll('.ntx-repeating-section-repeated-section');
      sections.forEach(section => {
        const overlay = section.querySelector('.ntx-repeating-section-overlay');
        if (overlay && this.clickHandlers.has(overlay)) {
          overlay.removeEventListener('click', this.clickHandlers.get(overlay));
          this.clickHandlers.delete(overlay);
        }
      });
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._initTimer = setTimeout(() => this.initialize(), 200);
  }

  initialize() {
    try {
      this.initCollapsibleSections();
      this.observeRepeatingSection();
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  }

  createChevronIcon(isExpanded) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('version', '1.1');
    svg.setAttribute('width', '34');
    svg.setAttribute('height', '34');
    svg.setAttribute('viewBox', '0 0 36 36');
    svg.classList.add('nx-icon--allow-events');
    svg.style.transition = `transform ${this.animationSpeed}ms ease-in-out`;

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

  findContentElement(section) {
    for (const selector of this.contentSelectors) {
      const content = section.querySelector(selector);
      if (content) return content;
    }
    return null;
  }

  handleSectionClick(overlay, index, sections) {
    // Prevent handling if this is a remove button click or if animation is in progress
    if (overlay.hasAttribute('data-processing')) return;
    
    // Mark as processing to prevent multiple rapid clicks
    overlay.setAttribute('data-processing', 'true');
    
    const allOverlays = sections.map(section => section.querySelector('.ntx-repeating-section-overlay'));
    
    // Update last open index
    this.lastOpenIndex = index;
    
    // Handle each section's visibility
    sections.forEach((section, sectionIndex) => {
      const content = this.findContentElement(section);
      const sectionOverlay = section.querySelector('.ntx-repeating-section-overlay');
      const chevron = sectionOverlay?.querySelector('svg');
      
      if (content && sectionOverlay) {
        const isExpanded = sectionIndex === index;
        
        // Apply styles immediately for responsive feel
        sectionOverlay.style.backgroundColor = isExpanded ? '#e0e0e0' : '#f0f0f0';
        
        // Update chevron immediately
        if (chevron) {
          this.updateChevronState(chevron, isExpanded);
        }
        
        // Use requestAnimationFrame for smoother transitions
        requestAnimationFrame(() => {
          // Set display with a small delay to ensure other changes are applied first
          setTimeout(() => {
            content.style.display = isExpanded ? 'block' : 'none';
            
            // Remove processing flag after animation completes
            setTimeout(() => {
              overlay.removeAttribute('data-processing');
            }, this.animationSpeed);
          }, 10);
        });
      }
    });
  }

  attachClickHandler(overlay, index, sections) {
    // Remove any existing handler
    if (this.clickHandlers.has(overlay)) {
      overlay.removeEventListener('click', this.clickHandlers.get(overlay));
    }
    
    // Create and store new handler
    const handler = (event) => {
      // Ignore clicks on remove button
      if (event.target.closest('.ntx-repeating-section-remove-button')) return;
      
      // Stop propagation to prevent multiple handlers
      event.stopPropagation();
      
      this.handleSectionClick(overlay, index, sections);
    };
    
    this.clickHandlers.set(overlay, handler);
    
    // Attach the handler - use capture phase to ensure we get first chance at the event
    overlay.addEventListener('click', handler, true);
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

      const sections = Array.from(repeatingSection.querySelectorAll('.ntx-repeating-section-repeated-section'));

      if (sections.length === 0) {
        console.error('No sections found to make collapsible');
        this.isInitializing = false;
        return;
      }

      // Determine if a new section was added
      const wasNewSectionAdded = sections.length > this.previousSectionCount;

      // If a new section was added, set last open index to the new section
      if (wasNewSectionAdded) {
        this.lastOpenIndex = sections.length - 1;
      } else if (this.lastOpenIndex >= sections.length || this.lastOpenIndex < -1) {
        this.lastOpenIndex = sections.length - 1;
      }

      // Determine the section to keep open
      const sectionToOpen = this.lastOpenIndex === -1 
        ? sections.length - 1 
        : Math.min(this.lastOpenIndex, sections.length - 1);

      sections.forEach((section, index) => {
        const contentToToggle = this.findContentElement(section);

        if (!contentToToggle) {
          console.error(`No content found to toggle for section ${index}`);
          return;
        }

        let overlay = section.querySelector('.ntx-repeating-section-overlay');

        if (!overlay) {
          console.error(`No overlay found for section ${index}`);
          return;
        }

        // Apply overlay styling
        Object.assign(overlay.style, {
          cursor: 'pointer',
          padding: '0px 0px 0px 10px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ddd',
          userSelect: 'none',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '10px',
          position: 'relative', // Ensure we can position elements inside
          zIndex: '1' // Ensure overlay is above content
        });

        // Clear existing overlay content
        overlay.innerHTML = '';

        // Create container for icon and label
        const contentContainer = document.createElement('div');
        contentContainer.style.display = 'flex';
        contentContainer.style.alignItems = 'center';
        contentContainer.style.gap = '10px';
        contentContainer.style.width = '100%';
        contentContainer.style.pointerEvents = 'none'; // Make children not capture clicks

        // Add chevron icon if enabled
        if (this.showIcon) {
          const isExpanded = index === sectionToOpen;
          const chevron = this.createChevronIcon(isExpanded);
          chevron.style.pointerEvents = 'none'; // Ensure icon doesn't capture clicks
          contentContainer.appendChild(chevron);
        }

        // Add section label if enabled
        if (this.showName) {
          const sectionLabel = document.createElement('span');
          sectionLabel.textContent = `${this.sectionName} ${index + 1}`;
          sectionLabel.style.fontWeight = 'bold';
          sectionLabel.style.marginRight = 'auto';
          sectionLabel.style.pointerEvents = 'none'; // Ensure label doesn't capture clicks
          contentContainer.appendChild(sectionLabel);
        }

        overlay.appendChild(contentContainer);

        // Set initial visibility
        const isVisible = index === sectionToOpen;
        contentToToggle.style.display = isVisible ? 'block' : 'none';
        overlay.style.backgroundColor = isVisible ? '#e0e0e0' : '#f0f0f0';
        
        // Attach click handler directly to this overlay
        this.attachClickHandler(overlay, index, sections);
      });

      // Update previous section count
      this.previousSectionCount = sections.length;
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

    // Clean up any existing observer
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new MutationObserver((mutations) => {
      // Filter mutations to reduce unnecessary processing
      const relevantChanges = mutations.some(mutation => {
        // Check for added/removed nodes
        if (mutation.type === 'childList' && 
            (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
          return true;
        }
        
        // Check for attribute changes on important elements
        if (mutation.type === 'attributes' && 
            (mutation.target.classList.contains('ntx-repeating-section-repeated-section') || 
             mutation.target.classList.contains('ntx-repeating-section-overlay'))) {
          return true;
        }
        
        return false;
      });
      
      if (!relevantChanges) return;
      
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

    this.observer.observe(repeatingSection, { 
      childList: true, 
      subtree: true, 
      attributes: true,
      attributeFilter: ['class', 'style']
    });
  }

  render() {
    return null;
  }
}

customElements.define('neo-rs-collapse', CollapseElement);

export default CollapseElement;