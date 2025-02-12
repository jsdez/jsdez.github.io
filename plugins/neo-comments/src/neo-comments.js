import { LitElement, html, css } from 'lit';

class commentsElement extends LitElement {
  static getMetaConfig() {
    return {
      controlName: 'neo-comments',
      fallbackDisableSubmit: false,
      description: 'Notes and comments',
      iconUrl: "",
      groupName: 'NEO',
      version: '1.0',
      properties: {
        cname: {
          type: 'string',
          description: 'Full name',
          title: 'Full name',
        },
        cemail: {
          type: 'string',
          description: 'Email Address',
          title: 'Email Address',
        },
        ctask: {
          type: 'string',
          description: 'Task Name',
          title: 'Task Name',
        },
        inputobj: {
          type: 'object',
          title: 'Input Object',
          description: 'Enter the comments object from previous control here',
        },
        outputobj: {
          title: 'Comments',
          type: 'object',
          description: 'Workflow Comments',
          properties: {
            name: {
              type: 'string',
              description: 'Full name',
              title: 'Full name',
            },
            email: {
              type: 'string',
              description: 'Email Address',
              title: 'Email Address',
            },
            task: {
              type: 'string',
              description: 'Task Name',
              title: 'Task Name',
            },
            comment: {
              type: 'string',
              description: 'Comment',
              title: 'Comment',
            },
            timestamp: {
              type: 'string',
              title: 'Log time',
              description: 'Date and time when the item was last updated',
            },
          },
        },
      },
      events: ["ntx-value-change"],
      standardProperties: {
        fieldLabel: true,
        description: true,
        readOnly: true,
      },
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
        border: 1px solid #ccc;
        border-radius: 8px;
        max-width: 100%;
      }
      .comments-history {
        margin-bottom: 1.5rem;
      }
      .comment-item {
        padding: 0.5rem;
        border-bottom: 1px solid #ddd;
        margin-bottom: 0.5rem;
      }
      .comment-item:last-child {
        border-bottom: none;
      }
      .comment-item strong {
        display: block;
      }
      .comment-item p {
        font-size: 1rem;
      }
      .comment-item small {
        color: #777;
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
        display: inline-block;
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
    `;
  }

  constructor() {
    super();
    this.inputobj = null;
    this.workingComments = [];
    this.newComment = '';
  }

  updated(changedProperties) {
    // Initialize workingComments with inputobj.comments when inputobj changes
    if (changedProperties.has('inputobj') && this.inputobj?.comments) {
      this.workingComments = [...this.inputobj.comments];
    }
  }

  handleCommentChange(e) {
    this.newComment = e.target.value;
  }

  addComment() {
    const timestamp = new Date().toISOString();
    const newEntry = {
      name: this.inputobj?.name || 'Anonymous',
      email: this.inputobj?.email || 'N/A',
      comment: this.newComment,
      timestamp,
    };

    // Add the new comment to the working object
    this.workingComments = [...this.workingComments, newEntry];

    // Update outputobj and emit the ntx-value-change event
    const outputobj = { comments: this.workingComments };
    this.dispatchEvent(new CustomEvent('ntx-value-change', { detail: outputobj }));

    // Clear the comment box
    this.newComment = '';
  }

  render() {
    return html`
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
      
      <div class="comments-history">
        <h3>Comments History</h3>
        ${this.workingComments.length > 0
          ? this.workingComments.map(
              (item) => html`
                <div class="comment-item">
                  <strong>${item.name || 'Anonymous'}</strong>
                  <p>${item.comment}</p>
                  <small>${new Date(item.timestamp).toLocaleString()}</small>
                </div>
              `
            )
          : html`<p>No comments available.</p>`}
      </div>

      <div class="mt-4">
        <h3>Add a Comment</h3>
        <textarea
          .value=${this.newComment}
          @input=${this.handleCommentChange}
          placeholder="Write your comment here..."
        ></textarea>
        <button
          @click=${this.addComment}
          ?disabled=${!this.newComment.trim()}
          class="btn btn-primary"
        >
          Submit Comment
        </button>
      </div>
    `;
  }
}

customElements.define('neo-comments', commentsElement);
