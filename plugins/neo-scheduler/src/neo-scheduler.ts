import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { PluginContract } from '@nintex/form-plugin-contract';

interface WorkItem {
  id: number;
  title: string;
  description?: string;
  day: string; // Monday, Tuesday, etc.
  time: string; // HH:MM format
  duration: number; // in minutes
  priority?: 'low' | 'medium' | 'high';
  category?: string;
}

interface ScheduleData {
  week: string; // ISO date string for Monday of the week
  items: WorkItem[];
}

@customElement('neo-scheduler')
export class NeoSchedulerElement extends LitElement {
  @property({ type: String })
  value: string = '';

  @property({ type: String })
  scheduleData: string = '';

  @state()
  private currentWeek: Date = new Date();

  @state()
  private workItems: WorkItem[] = [];

  static getMetaConfig(): PluginContract {
    return {
      version: '1.0.5',
      controlName: 'neo-scheduler',
      fallbackDisableSubmit: false,
      description: 'Schedule viewer control for displaying work items in a weekly calendar view',
      iconUrl: "schedule",
      groupName: 'NEO',
      properties: {
        scheduleData: {
          type: 'string',
          title: 'Schedule Data',
          description: 'JSON string containing schedule data with work items'
        },
        value: {
          type: 'string',
          title: 'Selected Items',
          description: 'JSON string of selected work items',
          isValueField: true,
        }
      },
      standardProperties: {
        fieldLabel: true,
        description: true,
      }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: var(--font-family, sans-serif);
        --primary-color: #007acc;
        --background-color: #f8f9fa;
        --border-color: #dee2e6;
        --text-color: #333;
        --hover-color: #e9ecef;
      }
      
      .scheduler-container {
        border: 1px solid var(--border-color);
        border-radius: 8px;
        background: white;
        overflow: hidden;
      }
      
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        background: var(--background-color);
        border-bottom: 1px solid var(--border-color);
      }
      
      .week-picker {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .week-picker button {
        background: none;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        padding: 0.25rem 0.5rem;
        cursor: pointer;
        font-size: 14px;
        color: var(--text-color);
        transition: background-color 0.2s;
      }
      
      .week-picker button:hover {
        background: var(--hover-color);
      }
      
      .week-picker button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .current-week {
        font-weight: 600;
        color: var(--text-color);
        min-width: 200px;
        text-align: center;
      }
      
      .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        border-top: 1px solid var(--border-color);
      }
      
      .day-header {
        padding: 0.75rem 0.5rem;
        text-align: center;
        font-weight: 600;
        background: var(--background-color);
        border-right: 1px solid var(--border-color);
        border-bottom: 1px solid var(--border-color);
        color: var(--text-color);
        font-size: 14px;
      }
      
      .day-header:last-child {
        border-right: none;
      }
      
      .day-column {
        border-right: 1px solid var(--border-color);
        min-height: 200px;
        padding: 0.5rem;
        background: white;
      }
      
      .day-column:last-child {
        border-right: none;
      }
      
      .work-item {
        background: var(--primary-color);
        color: white;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        line-height: 1.3;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      
      .work-item:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      
      .work-item.selected {
        background: #28a745;
        box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.3);
      }
      
      .work-item.priority-high {
        background: #dc3545;
      }
      
      .work-item.priority-medium {
        background: #ffc107;
        color: #000;
      }
      
      .work-item.priority-low {
        background: #6c757d;
      }
      
      .item-title {
        font-weight: 600;
        margin-bottom: 0.25rem;
      }
      
      .item-time {
        font-size: 11px;
        opacity: 0.9;
      }
      
      .item-duration {
        font-size: 11px;
        opacity: 0.8;
        margin-top: 0.25rem;
      }
      
      .empty-day {
        color: #6c757d;
        font-style: italic;
        text-align: center;
        padding: 2rem 0.5rem;
        font-size: 14px;
      }
      
      .stats {
        padding: 0.75rem 1rem;
        background: var(--background-color);
        border-top: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        color: var(--text-color);
      }
    `;
  }
  
  constructor() {
    super();
    this.currentWeek = this.getStartOfWeek(new Date());
    this.loadSampleData(); // For initial testing
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Watch for schedule data changes
    if (this.scheduleData) {
      this.parseScheduleData(this.scheduleData);
    }
  }

  // Utility methods
  private getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  }

  private formatWeekRange(startDate: Date): string {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric' 
    };
    
    return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}, ${startDate.getFullYear()}`;
  }

  private getDaysOfWeek(): string[] {
    return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  }

  private getItemsForDay(day: string): WorkItem[] {
    return this.workItems.filter(item => item.day === day);
  }

  private parseScheduleData(data: string): void {
    try {
      const scheduleData: ScheduleData = JSON.parse(data);
      this.workItems = scheduleData.items || [];
      if (scheduleData.week) {
        this.currentWeek = new Date(scheduleData.week);
      }
      this.requestUpdate();
    } catch (error) {
      console.error('Error parsing schedule data:', error);
      this.workItems = [];
    }
  }

  private loadSampleData(): void {
    // Load sample data for testing
    const sampleData: ScheduleData = {
      week: this.currentWeek.toISOString().split('T')[0],
      items: [
        {
          id: 1,
          title: 'Project Review',
          description: 'Review quarterly project status',
          day: 'Monday',
          time: '09:00',
          duration: 60,
          priority: 'high',
          category: 'meetings'
        },
        {
          id: 2,
          title: 'Client Meeting',
          description: 'Discuss project requirements',
          day: 'Tuesday',
          time: '14:00',
          duration: 90,
          priority: 'high',
          category: 'meetings'
        },
        {
          id: 3,
          title: 'Code Review',
          description: 'Review pull requests',
          day: 'Wednesday',
          time: '10:30',
          duration: 45,
          priority: 'medium',
          category: 'development'
        },
        {
          id: 4,
          title: 'Sprint Planning',
          description: 'Plan next sprint activities',
          day: 'Thursday',
          time: '15:00',
          duration: 120,
          priority: 'high',
          category: 'planning'
        },
        {
          id: 5,
          title: 'Documentation',
          description: 'Update project documentation',
          day: 'Friday',
          time: '11:00',
          duration: 180,
          priority: 'low',
          category: 'documentation'
        },
        {
          id: 6,
          title: 'Team Standup',
          description: 'Daily team synchronization',
          day: 'Monday',
          time: '09:30',
          duration: 15,
          priority: 'medium',
          category: 'meetings'
        },
        {
          id: 7,
          title: 'Bug Fixes',
          description: 'Fix reported issues',
          day: 'Wednesday',
          time: '14:00',
          duration: 90,
          priority: 'high',
          category: 'development'
        }
      ]
    };
    
    this.workItems = sampleData.items;
  }

  render(): TemplateResult {
    const weekRange = this.formatWeekRange(this.currentWeek);
    const days = this.getDaysOfWeek();
    const totalItems = this.workItems.length;
    const selectedItems = this.workItems.filter(item => item.priority === 'high').length; // Example selection logic

    return html`
      <div class="scheduler-container">
        <div class="header">
          <div class="week-picker">
            <button @click=${this.previousWeek} title="Previous Week">‹</button>
            <div class="current-week">${weekRange}</div>
            <button @click=${this.nextWeek} title="Next Week">›</button>
          </div>
          <button @click=${this.goToCurrentWeek} title="Go to Current Week">Today</button>
        </div>
        
        <div class="calendar-grid">
          ${days.map(day => html`
            <div class="day-header">${day}</div>
          `)}
          
          ${days.map(day => this.renderDayColumn(day))}
        </div>
        
        <div class="stats">
          <span>Total Items: ${totalItems}</span>
          <span>High Priority: ${selectedItems}</span>
        </div>
      </div>
    `;
  }

  private renderDayColumn(day: string): TemplateResult {
    const items = this.getItemsForDay(day);
    
    return html`
      <div class="day-column">
        ${items.length > 0 
          ? items.map(item => this.renderWorkItem(item))
          : html`<div class="empty-day">No items</div>`
        }
      </div>
    `;
  }

  private renderWorkItem(item: WorkItem): TemplateResult {
    const durationText = `${Math.floor(item.duration / 60)}h ${item.duration % 60}m`;
    const priorityClass = item.priority ? `priority-${item.priority}` : '';
    
    return html`
      <div 
        class="work-item ${priorityClass}"
        @click=${() => this.selectItem(item)}
        title="${item.description || item.title}"
      >
        <div class="item-title">${item.title}</div>
        <div class="item-time">${item.time}</div>
        <div class="item-duration">${durationText}</div>
      </div>
    `;
  }

  // Event handlers
  private previousWeek(): void {
    const newWeek = new Date(this.currentWeek);
    newWeek.setDate(newWeek.getDate() - 7);
    this.currentWeek = newWeek;
    this.requestUpdate();
  }

  private nextWeek(): void {
    const newWeek = new Date(this.currentWeek);
    newWeek.setDate(newWeek.getDate() + 7);
    this.currentWeek = newWeek;
    this.requestUpdate();
  }

  private goToCurrentWeek(): void {
    this.currentWeek = this.getStartOfWeek(new Date());
    this.requestUpdate();
  }

  private selectItem(item: WorkItem): void {
    // Toggle selection logic - for now just update the value
    const selectedData = {
      selectedItem: item,
      week: this.currentWeek.toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };
    
    this._updateValue(JSON.stringify(selectedData));
  }

  private _updateValue(newValue: string): void {
    this.value = newValue;
    
    // Emit the ntx-value-change event to notify the form
    const args = {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: newValue,
    };
    const event = new CustomEvent('ntx-value-change', args);
    this.dispatchEvent(event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'neo-scheduler': NeoSchedulerElement;
  }
}
