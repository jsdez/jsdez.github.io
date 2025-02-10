import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('form-plugin-comments-section')
export class NintexCommentsSection extends LitElement {
  // Scoped styles
  static styles = css`
    .form-control {
      color: var(--ntx-form-theme-color-secondary);
      background-color: var(--ntx-form-theme-color-input-background, transparent);
      font-size: var(--ntx-form-theme-text-input-size);
      font-family: var(--ntx-form-theme-font-family);
      border: 1px solid var(--ntx-form-theme-color-border);
      border-radius: var(--ntx-form-theme-border-radius);
    }

    .form-control:focus {
      outline: none;
      border-color: var(--ntx-form-theme-color-primary);
    }

    .comment-history {
      margin-top: 20px;
      padding: 10px;
      border: 1px solid var(--ntx-form-theme-color-border);
      border-radius: var(--ntx-form-theme-border-radius);
      background-color: var(--ntx-form-theme-color-background);
    }

    .comment-item {
      margin-bottom: 10px;
      padding: 5px;
      border: 1px solid var(--ntx-form-theme-color-border);
      border-radius: var(--ntx-form-theme-border-radius);
      background-color: var(--ntx-form-theme-color-input-background);
    }
  `;

  // Define properties
  @property()
  value = '';

  @property({ type: Boolean })
  readOnly = false;

  @property({ type: Array })
  comments = [];

  static getMetaConfig() {
    return {
      controlName: 'Comments Section',
      fallbackDisableSubmit: false,
      iconUrl: 'one-line-text',
      version: '1',
      properties: {
        value: {
          type: 'string',
          title: 'Value',
          isValueField: true,
          defaultValue: 'Enter comment here',
        },
      },
      standardProperties: {
        fieldLabel: true,
        defaultValue: true,
        readOnly: true,
      },
    };
  }

  // Render the UI
  render() {
    return html`
      <div>
        <input
          class="form-control"
          ?disabled="${this.readOnly}"
          .value="${this.value}"
          @input="${this.onInputChange}"
        />
        <button
          ?disabled="${this.readOnly || !this.value}"
          @click="${this.addComment}"
        >
          Add Comment
        </button>

        <!-- Comment History Section -->
        <div class="comment-history">
          ${this.comments.map(
            (comment) => html`<div class="comment-item">${comment}</div>`
          )}
        </div>
      </div>
    `;
  }

  // Handle input change
  onInputChange(e) {
    this.value = e.target.value;
  }

  // Add comment to history
  addComment() {
    if (this.value) {
      this.comments = [...this.comments, this.value];
      this.value = ''; // Clear the input field after adding comment

      // Dispatch the custom event with the updated comments history
      const args = {
        bubbles: true,
        cancelable: false,
        composed: true,
        detail: this.comments,
      };
      const event = new CustomEvent('ntx-value-change', args);
      this.dispatchEvent(event);
    }
  }
}
