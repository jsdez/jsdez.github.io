import { LitElement, html, css } from 'lit';

class CommentsElement extends LitElement {
  static getMetaConfig() {
    return {
      controlName: 'neo-comments',
      fallbackDisableSubmit: false,
      description: 'Notes and comments',
      iconUrl: '',
      groupName: 'NEO',
      version: '1.0',
      properties: {
        firstName: { type: 'string', title: 'First name' },
        lastName: { type: 'string', title: 'Last name' },
        email: { type: 'string', title: 'Email Address' },
        badge: {
          type: 'string',
          description: 'Label for status badge e.g. Rejected, Approved, Return etc. Default blank value is Update',
          title: 'Badge',
        },
        badgeStyle: {
          type: 'string',
          description: 'Select the style for the badge from the dropdown based on Bootstrap 5 badge',
          title: 'Badge Style',
          enum: [
            'Default', 'Primary', 'Secondary', 'Success',
            'Danger', 'Warning', 'Info', 'Light', 'Dark',
          ],
          defaultValue: 'Default',
        },
        inputobj: {
          type: 'object',
          title: 'Input Object',
          description: 'Enter the comments object from previous control here',
        },
        outputobj: {
          title: 'Comments Output',
          type: 'object',
          description: 'Workflow Comments Output - Do Not Use',
          isValueField: true,
          properties: {
            Comments: {
              type: 'array',
              description: 'Array of comments',
              items: {
                type: 'object',
                properties: {
                  firstName: { type: 'string', description: 'First Name', title: 'First Name' },
                  lastName: { type: 'string', description: 'Last Name', title: 'Last Name' },
                  email: { type: 'string', description: 'Email Address', title: 'Email Address' },
                  badge: { type: 'string', description: 'Badge Status', title: 'Badge Status' },
                  badgeStyle: { type: 'string', description: 'Badge Style', title: 'Badge Style' },
                  comment: { type: 'string', description: 'Comment', title: 'Comment' },
                  timestamp: { type: 'string', format: 'date-time', description: 'Log time', title: 'Log time' },
                },
              },
            },
            mostRecentComment: {
              type: 'object',
              description: 'Latest comment',
              properties: {
                firstName: { type: 'string', description: 'First Name', title: 'First Name' },
                lastName: { type: 'string', description: 'Last Name', title: 'Last Name' },
                email: { type: 'string', description: 'Email Address', title: 'Email Address' },
                badge: { type: 'string', description: 'Badge Status', title: 'Badge Status' },
                badgeStyle: { type: 'string', description: 'Badge Style', title: 'Badge Style' },
                comment: { type: 'string', description: 'Comment', title: 'Comment' },
                timestamp: { type: 'string', format: 'date-time', description: 'Log time', title: 'Log time' },
              },
            },
          },
        },
      },
      events: ['ntx-value-change'],
      standardProperties: { fieldLabel: true, description: true, readOnly: true },
    };
  }

  static properties = {
    inputobj: { type: Object },
    workingComments: { type: Array },
    newComment: { type: String },
  };

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 1rem;
        max-width: 100%;
      }

      .comments-history {
        display: flex;
        flex-direction: column;
      }

      .card {
        border: none;
        border-radius: 0;
        margin: 0;
        padding: 0;
        border-bottom: 1px solid #ddd;
      }

      .card:first-child {
        border-top: 1px solid #ddd;
      }

      .card-body {
        padding: 1rem;
      }

      textarea {
        width: 100%;
        height: 100px;
        padding: 0.5rem;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        margin-bottom: 1rem;
      }

      button {
        padding: 0.5rem 1rem;
        font-size: 1rem;
        color: white;
        background-color: #007bff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }

      .badge-default {
        background-color: var(--ntx-form-theme-color-primary-button-background, #e0e0e0);
        color: var(--ntx-form-theme-color-primary-button-font, #000);
      }
    `;
  }

  constructor() {
    super();
    this.inputobj = null;
    this.workingComments = [];
    this.newComment = '';
  }

  updated(changedProperties) {
    if (changedProperties.has('inputobj') && Array.isArray(this.inputobj?.comments)) {
      this.workingComments = [...this.inputobj.comments];
    }
  }

  handleCommentChange(e) {
    this.newComment = e.target.value;
  }

  addComment() {
    const timestamp = new Date().toISOString();

    const newEntry = {
      firstName: this.inputobj?.firstName || 'Anonymous',
      lastName: this.inputobj?.lastName || '',
      email: this.inputobj?.email || 'N/A',
      badge: this.inputobj?.badge?.trim() || 'Update',
      badgeStyle: this.inputobj?.badgeStyle || 'Default',
      comment: this.newComment,
      timestamp,
    };

    this.workingComments = [...this.workingComments, newEntry];

    const mostRecentComment = newEntry;

    const outputobj = {
      comments: this.workingComments,
      mostRecentComment,
    };

    this.dispatchEvent(new CustomEvent('ntx-value-change', { detail: outputobj }));

    this.newComment = '';
  }

  render() {
    return html`
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" />

      <div class="comments-history">
        ${this.workingComments.length > 0
          ? this.workingComments.map(
              (item) => html`
                <div class="card">
                  <div class="card-body">
                    <div class="d-flex flex-start">
                      <div>
                        <h6 class="fw-bold mb-1">${item.firstName} ${item.lastName || ''}</h6>
                        <div class="d-flex align-items-center mb-3">
                          <p class="mb-0 text-muted">
                            ${new Date(item.timestamp).toLocaleDateString('en-GB', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                            <span class="badge ${item.badgeStyle === 'Default' ? 'badge-default' : `bg-${item.badgeStyle.toLowerCase()}`} ms-2">
                              ${item.badge || 'Update'}
                            </span>
                          </p>
                        </div>
                        <p class="mb-0">${item.comment}</p>
                      </div>
                    </div>
                  </div>
                </div>
              `
            )
          : html`<p>No comments available.</p>`}
      </div>

      <div class="mt-4">
        <h3>Add a Comment</h3>
        <textarea
          class="form-control"
          .value=${this.newComment}
          @input=${this.handleCommentChange}
          placeholder="Write your comment here..."
        ></textarea>
        <button
          class="btn btn-primary"
          @click=${this.addComment}
          ?disabled=${!this.newComment.trim()}
        >
          Submit Comment
        </button>
      </div>
    `;
  }
}

customElements.define('neo-comments', CommentsElement);
