import { LitElement } from 'lit';

class CollapseElement extends LitElement {
  static getMetaConfig() {
    return {
      controlName: 'neo-rs-collapse',
      fallbackDisableSubmit: false,
      description: 'Collapsible Repeating Sections',
      iconUrl: "",
      groupName: 'NEO',
      version: '1.45.0',
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
        totalInputClass: {
          title: 'Total Amount CSS Class',
          type: 'number',
          description: 'If you wish to display a total value from each section, Please enter the class used to target input inside the section containing the total value',
        },
        statusInputClass: {
          title: 'Total Amount CSS Class',
          type: 'number',
          description: 'If you wish to display a status value from each section, Please enter the class used to target input inside the section containing the status value',
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
    this.sectionHeights = new Map(); // Store section heights for smooth transitions
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.cleanup();
  }

  // Helper to get section data: name, total, status
  getSectionData(section, index) {
    let name = `${this.sectionName} ${index + 1}`;
    let total = null;
    let status = null;

    if (this.nameInputClass) {
      const inputWrapper = section.querySelector(`.${this.nameInputClass}`);
      const input = inputWrapper?.querySelector('input');
      if (input && input.value.trim() !== '') {
        name = input.value.trim();
      }
    }

    if (this.totalInputClass) {
      const inputWrapper = section.querySelector(`.${this.totalInputClass}`);
      const input = inputWrapper?.querySelector('input');
      total = input && input.value.trim() !== '' ? input.value.trim() : '0';
    }

    if (this.statusInputClass) {
      const inputWrapper = section.querySelector(`.${this.statusInputClass}`);
      const input = inputWrapper?.querySelector('input');
      status = input && input.value.trim() !== '' ? input.value.trim() : 'n/a';
    }

    return { name, total, status };
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
    
    // Clean up style elements
    document.querySelectorAll('.neo-rs-collapse-styles').forEach(el => el.remove());
  }

  connectedCallback() {
    super.connectedCallback();
    this.injectStyles();
    this._initTimer = setTimeout(() => this.initialize(), 200);
  }

  // Helper to get section title (dynamic or fallback)
  getSectionTitle(section, index) {
    if (this.nameInputClass) {
      const inputWrapper = section.querySelector(`.${this.nameInputClass}`);
      if (inputWrapper) {
        const input = inputWrapper.querySelector('input');
        if (input && input.value.trim() !== '') {
          return input.value.trim();
        }
      }
    }
    return `${this.sectionName} ${index + 1}`;
  }

  injectStyles() {
    // Remove any existing style element
    document.querySelectorAll('.neo-rs-collapse-styles').forEach(el => el.remove());
    
    // Create and inject style element
    const style = document.createElement('style');
    style.className = 'neo-rs-collapse-styles';
    style.textContent = `
      .neo-rs-section-content {
        overflow: hidden;
        transition: max-height ${this.animationSpeed}ms ease, opacity ${this.animationSpeed}ms ease;
        opacity: 1;
      }
      
      .neo-rs-section-content.collapsed {
        max-height: 0px !important;
        opacity: 0;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        margin-top: 0 !important;
        margin-bottom: 0 !important;
      }
      
      .neo-rs-section-wrapper {
        position: relative;
      }
      
      .neo-rs-chevron {
        transition: transform ${this.animationSpeed}ms ease-in-out;
      }
      
      .neo-rs-chevron.expanded {
        transform: rotate(90deg);
      }
      
      .neo-rs-overlay-active {
        background-color: #e0e0e0 !important;
      }
      
      .neo-rs-overlay-inactive {
        background-color: #f0f0f0 !important;
      }
      
      .neo-rs-section-height-container {
        transition: height ${this.animationSpeed}ms ease;
      }
    `;
    document.head.appendChild(style);
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
    svg.classList.add('nx-icon--allow-events', 'neo-rs-chevron');
    
    if (isExpanded) {
      svg.classList.add('expanded');
    }

    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#chevron-right');
    svg.appendChild(use);

    return svg;
  }

  updateChevronState(chevron, isExpanded) {
    if (!chevron) return;
    
    if (isExpanded) {
      chevron.classList.add('expanded');
    } else {
      chevron.classList.remove('expanded');
    }
  }

  findContentElement(section) {
    for (const selector of this.contentSelectors) {
      const content = section.querySelector(selector);
      if (content) return content;
    }
    return null;
  }

  prepareContentForAnimations(section, content) {
    if (!content) return;
    
    // If content isn't already wrapped for animation
    if (!content.parentElement.classList.contains('neo-rs-section-wrapper')) {
      // Create wrapper for height transitions
      const wrapper = document.createElement('div');
      wrapper.classList.add('neo-rs-section-wrapper');
      
      // Move the content into our wrapper
      content.parentNode.insertBefore(wrapper, content);
      wrapper.appendChild(content);
      
      // Add animation class to content
      content.classList.add('neo-rs-section-content');
    }
    
    return content.parentElement; // Return the wrapper
  }

  measureSectionHeight(section, content) {
    if (!content) return 0;
    
    // Temporarily make visible to measure
    const originalDisplay = content.style.display;
    const originalHeight = content.style.height;
    const originalMaxHeight = content.style.maxHeight;
    const originalOverflow = content.style.overflow;
    
    // Show but hide visually
    content.style.display = 'block';
    content.style.height = 'auto';
    content.style.maxHeight = 'none';
    content.style.overflow = 'hidden';
    content.style.position = 'absolute';
    content.style.visibility = 'hidden';
    
    // Measure
    const height = content.scrollHeight;
    
    // Restore
    content.style.display = originalDisplay;
    content.style.height = originalHeight;
    content.style.maxHeight = originalMaxHeight;
    content.style.overflow = originalOverflow;
    content.style.position = '';
    content.style.visibility = '';
    
    // Store height
    this.sectionHeights.set(section, height);
    
    return height;
  }

  async handleSectionClick(overlay, clickedIndex, sections) {
    // Prevent handling if this is a remove button click or if animation is in progress
    if (overlay.hasAttribute('data-processing')) return;
    
    // Mark as processing to prevent multiple rapid clicks
    overlay.setAttribute('data-processing', 'true');
    
    const previousOpenIndex = this.lastOpenIndex;
    this.lastOpenIndex = clickedIndex;
    
    // First handle all section updates
    const transitions = [];
    
    sections.forEach((section, index) => {
      const content = this.findContentElement(section);
      const sectionOverlay = section.querySelector('.ntx-repeating-section-overlay');
      const chevron = sectionOverlay?.querySelector('.neo-rs-chevron');
      
      if (!content || !sectionOverlay) return;
      
      const isExpanding = index === clickedIndex;
      const isCurrentlyExpanded = index === previousOpenIndex;
      
      // Prepare content for animation if needed
      const wrapper = this.prepareContentForAnimations(section, content);
      
      // Update overlay appearance immediately
      if (isExpanding) {
        sectionOverlay.classList.add('neo-rs-overlay-active');
        sectionOverlay.classList.remove('neo-rs-overlay-inactive');
      } else {
        sectionOverlay.classList.remove('neo-rs-overlay-active');
        sectionOverlay.classList.add('neo-rs-overlay-inactive');
      }
      
      // Update chevron state
      if (chevron) {
        this.updateChevronState(chevron, isExpanding);
      }
      
      // Handle content transitions
      if (isExpanding && !isCurrentlyExpanded) {
        // Expanding a collapsed section
        
        // Measure the height first if we don't have it
        if (!this.sectionHeights.has(section)) {
          this.measureSectionHeight(section, content);
        }
        
        const contentHeight = this.sectionHeights.get(section) || 'auto';
        
        // Make sure the content is in a collapsed state first
        content.classList.add('collapsed');
        content.style.display = 'block';
        
        // Schedule the transition to expanded state
        const expandPromise = new Promise(resolve => {
          requestAnimationFrame(() => {
            // Force a reflow to ensure the collapsed state was applied
            content.offsetHeight;
            
            // Set max-height to enable transition
            content.style.maxHeight = `${contentHeight}px`;
            content.classList.remove('collapsed');
            
            // Resolve after animation completes
            setTimeout(resolve, this.animationSpeed);
          });
        });
        
        transitions.push(expandPromise);
      } 
      else if (!isExpanding && isCurrentlyExpanded) {
        // Collapsing the currently expanded section
        
        // Measure the height first if we don't have it
        if (!this.sectionHeights.has(section)) {
          this.measureSectionHeight(section, content);
        }
        
        const contentHeight = this.sectionHeights.get(section) || 'auto';
        
        // Set explicit height to start transition
        content.style.maxHeight = `${contentHeight}px`;
        
        // Schedule the transition to collapsed state
        const collapsePromise = new Promise(resolve => {
          requestAnimationFrame(() => {
            // Force a reflow
            content.offsetHeight;
            
            // Trigger collapse animation
            content.classList.add('collapsed');
            
            // Set display none after animation completes
            setTimeout(() => {
              if (!content.classList.contains('collapsed')) return;
              content.style.display = 'none';
              resolve();
            }, this.animationSpeed);
          });
        });
        
        transitions.push(collapsePromise);
      }
      else if (!isExpanding && !isCurrentlyExpanded) {
        // Section that was already collapsed
        content.style.display = 'none';
        content.classList.add('collapsed');
      }
    });
    
    // Wait for all transitions to complete
    await Promise.all(transitions);
    
    // Remove processing attribute
    overlay.removeAttribute('data-processing');
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
        const content = this.findContentElement(section);

        if (!content) {
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

        // Add section label, status, and total using getSectionData
        if (this.showName) {
          const { name, total, status } = this.getSectionData(section, index);

          const sectionLabel = document.createElement('span');
          sectionLabel.textContent = name;
          sectionLabel.style.fontWeight = 'bold';
          sectionLabel.style.pointerEvents = 'none';
          contentContainer.appendChild(sectionLabel);

          if (status !== null) {
            const statusBadge = document.createElement('span');
            statusBadge.textContent = status;
            statusBadge.style.background = '#ddd';
            statusBadge.style.borderRadius = '8px';
            statusBadge.style.padding = '2px 6px';
            statusBadge.style.fontSize = '12px';
            statusBadge.style.marginLeft = '8px';
            statusBadge.style.pointerEvents = 'none';
            contentContainer.appendChild(statusBadge);
          }

          if (total !== null) {
            const totalSpan = document.createElement('span');
            totalSpan.textContent = total;
            totalSpan.style.marginLeft = 'auto';
            totalSpan.style.fontWeight = 'bold';
            totalSpan.style.pointerEvents = 'none';
            contentContainer.appendChild(totalSpan);
          }
        }

        overlay.appendChild(contentContainer);

        // No live update listener for sectionLabel, as all three are rendered together now

        // Set active/inactive state
        const isVisible = index === sectionToOpen;
        if (isVisible) {
          overlay.classList.add('neo-rs-overlay-active');
          overlay.classList.remove('neo-rs-overlay-inactive');
        } else {
          overlay.classList.remove('neo-rs-overlay-active');
          overlay.classList.add('neo-rs-overlay-inactive');
        }

        // Prepare content for animations
        this.prepareContentForAnimations(section, content);

        // Measure section height for animations
        this.measureSectionHeight(section, content);

        // Set initial state
        if (isVisible) {
          content.style.display = 'block';
          content.classList.remove('collapsed');
          // Set the max-height for proper animation later
          content.style.maxHeight = `${this.sectionHeights.get(section) || 'none'}px`;
        } else {
          content.style.display = 'none';
          content.classList.add('collapsed');
        }

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