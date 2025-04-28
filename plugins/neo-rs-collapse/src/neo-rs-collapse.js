import { LitElement, html, css } from 'lit';

class CollapseElement extends LitElement {
  static getMetaConfig() {
    return {
      controlName: 'neo-rs-collapse',
      fallbackDisableSubmit: false,
      description: 'Collapsible Repeating Sections',
      iconUrl: "",
      groupName: 'NEO',
      version: '2.0.0',
      properties: {
        sectionName: {
          type: 'string',
          title: 'Section Name',
          description: 'Name of this section in the repeating section',
          defaultValue: 'Section'
        },
        sectionStatus: {
          title: 'Section Status',
          type: 'string',
          description: 'Status value for this specific section',
        },
        sectionTotal: {
          title: 'Section Total',
          type: 'string',
          description: 'Total value for this specific section',
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
        },
        sectionId: {
          title: 'Section ID',
          type: 'string',
          description: 'Unique ID for this section (auto-generated, do not modify)',
          visible: false,
        },
        value: {
          title: 'Value',
          type: 'object',
          isValueField: true,
          description: 'The component state including active section ID',
        }
      },
      standardProperties: {
        fieldLabel: true,
        description: true,
      }
    };
  }

  static styles = css`
    :host {
      display: block;
      margin: 0;
      padding: 0;
    }
    
    .collapse-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      border: 1px solid #ddd;
      cursor: pointer;
      user-select: none;
      background-color: #f0f0f0;
      transition: background-color 0.2s ease;
    }
    
    .collapse-header.active {
      background-color: #e0e0e0;
    }
    
    .chevron {
      transition: transform var(--animation-speed, 200ms) ease-in-out;
    }
    
    .chevron.expanded {
      transform: rotate(90deg);
    }
    
    .section-name {
      font-weight: bold;
      flex-grow: 1;
    }
    
    .section-status {
      background: #ddd;
      border-radius: 8px;
      padding: 2px 6px;
      font-size: 12px;
      margin-left: 8px;
    }
    
    .section-total {
      font-weight: bold;
      margin-left: auto;
    }
    
    .content-wrapper {
      overflow: hidden;
      transition: max-height var(--animation-speed, 200ms) ease, 
                  opacity var(--animation-speed, 200ms) ease;
      opacity: 1;
      max-height: 1000px; /* Default large value */
    }
    
    .content-wrapper.collapsed {
      max-height: 0 !important;
      opacity: 0;
    }
  `;

  static properties = {
    sectionName: { type: String },
    sectionStatus: { type: String },
    sectionTotal: { type: String },
    showIcon: { type: Boolean },
    showName: { type: Boolean },
    animationSpeed: { type: Number },
    sectionId: { type: String },
    isActive: { type: Boolean, state: true },
    contentHeight: { type: Number, state: true },
    value: { type: Object }
  };

  constructor() {
    super();
    this.sectionName = 'Section';
    this.sectionStatus = '';
    this.sectionTotal = '';
    this.showIcon = true;
    this.showName = true;
    this.animationSpeed = 200;
    this.sectionId = `section-${Math.random().toString(36).substr(2, 9)}`;
    this.isActive = false;
    this.contentHeight = 0;
    this.value = { activeSectionId: null, isExpanded: false };
    
    // Listen for global activation events
    this.handleActivationEvent = this.handleActivationEvent.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Set CSS variable for animation speed
    this.style.setProperty('--animation-speed', `${this.animationSpeed}ms`);
    
    // Listen for activation events from other sections
    document.addEventListener('neo-section-activated', this.handleActivationEvent);
    
    // Auto-expand the first section created on the page if none is active
    if (!document.querySelector('.neo-rs-section-active')) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const allSections = document.querySelectorAll('neo-rs-collapse');
        if (allSections[0] === this) {
          this.toggleSection();
        }
      }, 50);
    }
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    
    // Remove global event listener
    document.removeEventListener('neo-section-activated', this.handleActivationEvent);
  }
  
  handleActivationEvent(event) {
    // Check if this is our own event
    if (event.detail.sectionId === this.sectionId) {
      return;
    }
    
    // Another section was activated, collapse this one
    if (this.isActive) {
      this.isActive = false;
      this.value = { 
        ...this.value, 
        isExpanded: false 
      };
      this.updateContentState();
      this.notifyValueChange();
    }
  }
  
  notifyValueChange() {
    // Create and dispatch the ntx-value-change event
    const event = new CustomEvent('ntx-value-change', {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: this.value
    });
    
    this.dispatchEvent(event);
  }
  
  updated(changedProps) {
    super.updated(changedProps);
    
    if (changedProps.has('isActive')) {
      this.updateContentState();
      
      // Update value when isActive changes
      this.value = { 
        activeSectionId: this.isActive ? this.sectionId : null,
        isExpanded: this.isActive
      };
      
      // Update class for external queryability
      if (this.isActive) {
        this.classList.add('neo-rs-section-active');
      } else {
        this.classList.remove('neo-rs-section-active');
      }
    }
  }
  
  firstUpdated() {
    this.measureContentHeight();
    
    // Set up a resize observer to handle content changes
    this.resizeObserver = new ResizeObserver(() => {
      this.measureContentHeight();
    });
    
    const contentSlot = this.shadowRoot.querySelector('slot');
    if (contentSlot) {
      contentSlot.assignedElements().forEach(el => {
        this.resizeObserver.observe(el);
      });
    }
  }
  
  measureContentHeight() {
    const content = this.shadowRoot.querySelector('#content');
    if (!content) return;
    
    // Get all content children
    const slot = content.querySelector('slot');
    if (!slot) return;
    
    // Get slotted content
    const elements = slot.assignedElements();
    if (elements.length === 0) return;
    
    // Measure combined height of all slotted elements
    let totalHeight = 0;
    elements.forEach(el => {
      // Get computed style
      const style = window.getComputedStyle(el);
      
      // Calculate full height including margins
      const height = el.offsetHeight;
      const marginTop = parseInt(style.marginTop, 10) || 0;
      const marginBottom = parseInt(style.marginBottom, 10) || 0;
      
      totalHeight += height + marginTop + marginBottom;
    });
    
    // Add padding for the wrapper itself
    totalHeight += 20; // Some extra buffer
    
    this.contentHeight = totalHeight;
    this.updateContentState();
  }
  
  updateContentState() {
    const wrapper = this.shadowRoot.querySelector('.content-wrapper');
    if (!wrapper) return;
    
    if (this.isActive) {
      wrapper.classList.remove('collapsed');
      wrapper.style.maxHeight = `${this.contentHeight}px`;
    } else {
      wrapper.classList.add('collapsed');
    }
  }
  
  toggleSection() {
    // Toggle active state
    const newState = !this.isActive;
    this.isActive = newState;
    
    // Update the value object
    this.value = {
      activeSectionId: newState ? this.sectionId : null,
      isExpanded: newState
    };
    
    // Notify value change for form system
    this.notifyValueChange();
    
    // If newly activated, notify others
    if (newState) {
      // Create and dispatch a custom event for other sections
      const activationEvent = new CustomEvent('neo-section-activated', {
        bubbles: true,
        composed: true,
        detail: {
          sectionId: this.sectionId,
          timestamp: Date.now()
        }
      });
      
      document.dispatchEvent(activationEvent);
    }
  }

  render() {
    return html`
      <div class="collapse-container">
        <div 
          class="collapse-header ${this.isActive ? 'active' : ''}" 
          @click=${this.toggleSection}
        >
          ${this.showIcon ? html`
            <svg 
              class="chevron ${this.isActive ? 'expanded' : ''}" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24"
            >
              <path 
                fill="currentColor" 
                d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"
              />
            </svg>
          ` : ''}
          
          ${this.showName ? html`
            <span class="section-name">${this.sectionName}</span>
            
            ${this.sectionStatus ? html`
              <span class="section-status">${this.sectionStatus}</span>
            ` : ''}
            
            ${this.sectionTotal ? html`
              <span class="section-total">${this.sectionTotal}</span>
            ` : ''}
          ` : ''}
        </div>
        
        <div 
          class="content-wrapper ${this.isActive ? '' : 'collapsed'}" 
          id="content"
          style="max-height: ${this.isActive ? `${this.contentHeight}px` : '0'}"
        >
          <slot></slot>
        </div>
      </div>
    `;
  }
}

customElements.define('neo-rs-collapse', CollapseElement);

export default CollapseElement;