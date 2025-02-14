import { LitElement, html, css, reactive } from 'lit';
import { componentStyles } from './styles.js';
import { sendIcon, deleteIcon } from './icons.js';
class CommentsElement extends LitElement {

  static get styles() {
    return componentStyles;
  }

  static getMetaConfig() {
    return {
      controlName: 'neo-comments',
      fallbackDisableSubmit: false,
      description: 'Notes and comments',
      iconUrl:'https://jsdez.github.io/plugins/neo-comments/dist/icon.svg',
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
        allowDelete: { type: 'boolean', title: 'Allow Deleting' },
        enablePages: { type: 'number', title: 'Comments per page', description: 'No value or 0 will show all comments, entering a number here will show that many comments per page e.g. 10 will result in all comments split 10 per page.',},
        enableSorting: { type: 'boolean', title: 'Enable sorting by date' },
        inputobj: {
          type: 'object',
          title: 'Input Object',
          description: 'Enter the comments object from previous control here',
        },
        outputobj: {
          title: 'Comments Output',
          type: 'object',
          description: 'Workflow Comments Output Do Not Use',
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
      standardProperties: { fieldLabel: true, description: true, readOnly: true, visibility: true },
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
    readOnly: { type: Boolean },
    deletableIndices: { type: Array },
  };

  constructor() {
    super();
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.badge = 'Update';
    this.badgeStyle = 'Default';
    this.inputobj = null;
    this.workingComments = [];
    this.newComment = '';
    this.deletableIndices = [];
    this.currentPage = 1;
    this.pageSize = 5;
    this.enableSorting = true;
  }
  

  updated(changedProperties) {
    if (changedProperties.has('enablePages')) {
      this.pageSize = this.enablePages || 0;
    }
  
    if (changedProperties.has('inputobj') && Array.isArray(this.inputobj?.comments)) {
      this.workingComments = [...this.inputobj.comments];
      this.deletableIndices = []; // Reset deletable indices when inputobj changes
    }
  
    if (changedProperties.has('readOnly')) {
      this.requestUpdate();
    }
  }
  

  addComment() {
    const timestamp = new Date().toISOString();

    const newEntry = {
      firstName: this.firstName || 'Anonymous',
      lastName: this.lastName || '',
      email: this.email || 'N/A',
      badge: this.badge || 'Update',
      badgeStyle: this.badgeStyle || 'Default',
      comment: this.newComment,
      timestamp,
    };

    // Add the new comment to the workingComments array
    this.workingComments = [...this.workingComments, newEntry];

    // Mark the new comment as deletable
    this.deletableIndices = [...this.deletableIndices, this.workingComments.length - 1];

    // Dispatch the updated outputobj
    const mostRecentComment = newEntry;
    const outputobj = {
      comments: this.workingComments,
      mostRecentComment,
    };

    this.dispatchEvent(new CustomEvent('ntx-value-change', { detail: outputobj }));

    // Clear the newComment field
    this.newComment = '';
  }

  deleteComment(index) {
    // Remove the comment at the specified index
    this.workingComments = this.workingComments.filter((_, i) => i !== index);
  
    // Update the deletableIndices to reflect the shifted indices
    this.deletableIndices = this.deletableIndices
      .filter(i => i !== index) // Remove the deleted index
      .map(i => (i > index ? i - 1 : i)); // Shift indices down for remaining comments after the deleted index
  
    // Dispatch the updated outputobj
    const mostRecentComment = this.workingComments[this.workingComments.length - 1] || null;
    const outputobj = {
      comments: this.workingComments,
      mostRecentComment,
    };
  
    this.dispatchEvent(new CustomEvent('ntx-value-change', { detail: outputobj }));
  }
  
  handleCommentChange(e) {
    this.newComment = e.target.value;
  }


  sortComments(comments) {
    return comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  get paginatedComments() {
    const comments = this.enableSorting
      ? this.sortComments([...this.workingComments])
      : [...this.workingComments];
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return comments.slice(startIndex, endIndex);
  }

  changePage(direction) {
    const totalPages = Math.ceil(this.workingComments.length / this.pageSize);
    if (direction === 'next' && this.currentPage < totalPages) {
      this.currentPage++;
    } else if (direction === 'prev' && this.currentPage > 1) {
      this.currentPage--;
    }
  }

  updateCommentsDisplay() {
    const mostRecentComment = this.paginatedComments[this.paginatedComments.length - 1] || null;
    const outputobj = {
      comments: this.paginatedComments,
      mostRecentComment,
    };
    this.dispatchEvent(new CustomEvent('ntx-value-change', { detail: outputobj }));
  }

  render() {
    return html`
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" />

      <!-- Comments History Section -->
      <div class="comments-history">
        ${this.paginatedComments.length > 0
          ? this.paginatedComments.map(
              (item, index) => html`
                <div class="card comment-card mb-2">
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
                      <span class="badge ${this.getBadgeClass(item.badgeStyle)}">${item.badge}</span>
                    </div>
                    <p class="card-text">${item.comment}</p>
                    ${this.allowDelete &&
                    this.deletableIndices.includes(index) &&
                    !this.readOnly
                      ? html`
                          <button
                            class="btn btn-sm btn-danger"
                            @click="${() => this.deleteComment(index)}"
                          >
                            ${deleteIcon}
                          </button>
                        `
                      : ''}
                  </div>
                </div>
              `
            )
          : html`<p>No comments available.</p>`}

        <!-- Pagination -->
        ${this.pageSize > 0 && this.workingComments.length > this.pageSize
          ? html`
              <div class="pagination-controls d-flex justify-content-between mt-3">
                <button
                  class="btn btn-outline-primary"
                  ?disabled="${this.currentPage === 1}"
                  @click="${() => this.changePage('prev')}"
                >
                  Previous
                </button>
                <span>Page ${this.currentPage}</span>
                <button
                  class="btn btn-outline-primary"
                  ?disabled="${this.currentPage === Math.ceil(this.workingComments.length / this.pageSize)}"
                  @click="${() => this.changePage('next')}"
                >
                  Next
                </button>
              </div>
            `
          : ''}
      </div>

      <!-- New Comment Section -->
      <div class="new-comment">
        <textarea
          class="form-control"
          rows="3"
          .value="${this.newComment}"
          @input="${this.handleCommentChange}"
          placeholder="Enter your comment..."
          ?readonly="${this.readOnly}"
        ></textarea>
        <button
          class="btn btn-primary mt-2"
          @click="${this.addComment}"
          ?disabled="${!this.newComment || this.readOnly}"
        >
          ${sendIcon} Submit Comment
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
      Info: 'badge bg-info',
      Light: 'badge bg-light text-dark',
      Dark: 'badge bg-dark text-white',
    };

    return badgeClasses[style] || badgeClasses.Default;
  }
}

customElements.define('neo-comments', CommentsElement);
