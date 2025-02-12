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
        ccomment: {
          type: 'string',
          description: 'Comment',
          title: 'Comment',
        },
        ctimestamp: {
          type: 'string',
          title: 'Log time',
          description: 'Date and time when the item was last updated',
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
      standardProperties: {
        fieldLabel: true,
        description: true,
      },
    };
  }

  static properties = {
    inputobj: { type: Object },
    outputobj: { type: Object },
    newComment: { type: String },
  };

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        max-width: 500px;
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
    this.outputobj = {};
    this.newComment = '';
  }

  handleCommentChange(e) {
    this.newComment = e.target.value;
  }

  addComment() {
    const timestamp = new Date().toISOString();
    this.outputobj = {
      comment: this.newComment,
      timestamp,
    };

    // Clear the comment box
    this.newComment = '';
    this.dispatchEvent(new CustomEvent('comment-added', { detail: this.outputobj }));
  }

  render() {
    return html`
      <div class="comments-history">
        <h3>Comments History</h3>
        ${this.inputobj && this.inputobj.comments
          ? this.inputobj.comments.map(
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

      <div>
        <h3>Add a Comment</h3>
        <textarea
          .value=${this.newComment}
          @input=${this.handleCommentChange}
          placeholder="Write your comment here..."
        ></textarea>
        <button
          @click=${this.addComment}
          ?disabled=${!this.newComment.trim()}
        >
          Submit Comment
        </button>
      </div>
    `;
  }
}

customElements.define('neo-comments', commentsElement);
