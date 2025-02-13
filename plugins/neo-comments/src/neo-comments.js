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
          description: 'Workflow Comments Output - Do Not Use',
          isValueField: true,
          properties: {
            comments: {
              type: 'object',
              description: 'Comments object with indexed keys',
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
    workingComments: { type: Object },
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
    this.workingComments = {};
    this.newComment = '';
  }

  updated(changedProperties) {
    if (changedProperties.has('inputobj') && this.inputobj?.comments) {
      this.workingComments = { ...this.inputobj.comments };
    }
  }

  handleCommentChange(e) {
    this.newComment = e.target.value;
  }

  addComment() {
    const timestamp = new Date().toISOString();
    const newEntry = {
      name: this.inputobj?.cname || 'Anonymous',
      email: this.inputobj?.cemail || 'N/A',
      task: this.inputobj?.ctask || 'No Task',
      comment: this.newComment,
      timestamp,
    };

    const nextIndex = Object.keys(this.workingComments).length
      ? Math.max(...Object.keys(this.workingComments).map(Number)) + 1
      : 0;

    this.workingComments = {
      ...this.workingComments,
      [nextIndex]: newEntry,
    };

    const outputobj = { comments: this.workingComments };
    this.dispatchEvent(new CustomEvent('ntx-value-change', { detail: outputobj }));

    this.newComment = '';
  }

  render() {
    return html`
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
      
      <div class="comments-history">
        ${Object.keys(this.workingComments).length > 0
          ? Object.values(this.workingComments).map(
              (item) => html`
                <div class="card">
                  <div class="card-body p-4">
                    <div class="d-flex flex-start">
                      <div>
                        <h6 class="fw-bold text-white mb-1">${item.name || 'Anonymous'}</h6>
                        <div class="d-flex align-items-center mb-3">
                          <p class="mb-0 text-muted">
                            ${new Date(item.timestamp).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                            <span class="badge bg-primary ms-2">${item.task || 'No Task'}</span>
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
