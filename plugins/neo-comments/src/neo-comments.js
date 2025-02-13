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
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    badge: { type: String },
    badgeStyle: { type: String },
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
  
      .comment-card {
        border: none;
        border-radius: 0;
        margin: 0;
        padding: 0;
        transition: background-color 0.3s ease, box-shadow 0.3s ease;
        border-bottom: 1px solid #ddd;
      }
  
      .comment-card:first-child {
        border-top: 1px solid #ddd;
      }
  
      .comment-card:hover {
        background-color: #f8f9fa; /* Light background on hover */
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Subtle shadow on hover */
      }
  
      .comment-card.selected {
        background-color: #e9ecef; /* Selected state color */
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); /* Slightly stronger shadow */
      }
  
      .card-body {
        padding: 1rem;
      }
  
      .d-flex {
        display: flex;
      }
  
      .flex-row {
        flex-direction: row;
      }
  
      .align-items-center {
        align-items: center;
      }
  
      .me-2 {
        margin-right: 0.5rem;
      }
  
      .ms-2 {
        margin-left: 0.5rem;
      }
  
      .fw-bold {
        font-weight: bold;
      }
  
      .text-muted {
        color: #6c757d;
      }
  
      .badge-default {
        background-color: var(--ntx-form-theme-color-primary-button-background, #e0e0e0);
        color: var(--ntx-form-theme-color-primary-button-font, #000);
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
  
      .comment-text {
        user-select: text;
      }
    `;
  }
  
  constructor() {
    super();
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.badge = 'Update';  // Default Badge
    this.badgeStyle = 'Default';  // Default Badge Style
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

    // Use the current standalone properties for the new comment
    const newEntry = {
      firstName: this.firstName || 'Anonymous',
      lastName: this.lastName || '',
      email: this.email || 'N/A',
      badge: this.badge || 'Update',  // Dynamically use the badge property
      badgeStyle: this.badgeStyle || 'Default',  // Dynamically use the badgeStyle property
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
                <div class="card comment-card mb-3">
                <div class="card-body">
                    <div class="d-flex flex-row align-items-center">
                      <h6 class="fw-bold mb-0 me-2">${item.firstName} ${item.lastName || ''}</h6>
                      <p class="mb-0 text-muted me-2">
                        ${new Date(item.timestamp).toLocaleString('en-GB', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false,
                        })}
                      </p>
                      <span class="badge ${this.getBadgeClass(item.badgeStyle) || 'Default'} ms-2">${item.badge || 'Update'}</span>
                    </div>
                    <div>
                    <p class="mb-0 p-1 comment-text">${item.comment}</p>
                  </div>
                </div>
              `
            )
          : html`<p>No comments available.</p>`}
      </div>
  
      <div class="mt-4">
        <h6>Add a Comment</h6>
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

  // Helper method to apply the correct class based on badge style
  getBadgeClass(style) {
    const badgeClasses = {
      Default: 'badge badge-default',
      Primary: 'badge bg-primary text-white',
      Secondary: 'badge bg-secondary text-white',
      Success: 'badge bg-success text-white',
      Danger: 'badge bg-danger text-white',
      Warning: 'badge bg-warning text-dark',
      Info: 'badge bg-info text-dark',
      Light: 'badge bg-light text-dark',
      Dark: 'badge bg-dark text-white',
    };

    return badgeClasses[style] || badgeClasses.Default;
  }
}

customElements.define('neo-comments', CommentsElement);
