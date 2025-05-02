import { LitElement, html, css } from 'lit';
import { componentStyles } from './styles.js';
import { sendIcon, deleteIcon, expandIcon } from './icons.js';

class CommentsElement extends LitElement {

  static get styles() {
    return componentStyles;
  }

  static getMetaConfig() {
    return {
      controlName: 'dfs-workflow-comments',
      fallbackDisableSubmit: false,
      description: 'Notes and comments',
      iconUrl:'https://jsdez.github.io/plugins/dfs-workflow-comments/dist/icon.svg',
      groupName: 'DFS',
      version: '1.0',
      properties: {
        commentsBorder: {
          title: 'Show Border on comments',
          type: 'boolean',
          defaultValue: true,
        },
        commentsStriped: {
          title: 'Striped comments',
          type: 'boolean',
          defaultValue: true,
        },
        firstName: { type: 'string', title: 'First name' },
        lastName: { type: 'string', title: 'Last name' },
        email: { type: 'string', title: 'Email Address' },
        taskowner: { type: 'string', title: 'Task Owner' },
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
        historyLimit: { 
          type: 'integer', 
          title: 'Comment history display limit', 
          description: 'Enter a number value of how many comments should be shown, older comments are hidden, entering 0 will show all comments, default is 5.',
          defaultValue: 5,
        },
        outputobj: {
          title: 'Comments Output',
          type: 'object',
          description: 'Workflow Comments Output Do Not Use',
          isValueField: true,
          properties: {
            comments: {
              type: 'array', //change to object to deploy
              description: 'Array of comments',
              items: {
                type: 'object',
                properties: {
                  firstName: { type: 'string', description: 'First Name', title: 'First Name' },
                  lastName: { type: 'string', description: 'Last Name', title: 'Last Name' },
                  email: { type: 'string', description: 'Email Address', title: 'Email Address' },
                  taskowner: { type: 'string',description: 'Task Owner', title: 'Task Owner' },
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
                taskowner: { type: 'string',description: 'Task Owner', title: 'Task Owner' },
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
      standardProperties: { fieldLabel: true, description: true, readOnly: true, visibility: true},
    };
  }

  static properties = {
    commentsBorder: { type: Boolean },
    commentsStriped: { type: Boolean },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    taskowner: { type: String },
    badge: { type: String },
    badgeStyle: { type: String },
    inputobj: { type: Object },
    workingComments: { type: Array },
    newComment: { type: String },
    readOnly: { type: Boolean },
    deletableIndices: { type: Array },
    historyLimit: { type: Number },
    showAll: { type: Boolean },
    outputobj: { type: Object },
  };

  constructor() {
    super();
    this.commentsBorder = true;
    this.commentsStriped = true;
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.taskowner = '';
    this.badge = 'Update';  // Default Badge
    this.badgeStyle = 'Default';  // Default Badge Style
    this.inputobj = null;
    this.workingComments = [];
    this.newComment = '';
    this.deletableIndices = [];
    this.historyLimit = 5;
    this.showAll = false;
  }

  toggleShowAll() {
    this.showAll = !this.showAll;
  }

  // Adjust the comments array based on the historyLimit and showAll
  get displayedComments() {
    if (this.showAll) {
      return this.workingComments; // Display all comments when 'show all' is active
    }
    return this.workingComments.slice(-this.historyLimit); // Display only the latest `historyLimit` comments
  }

  updated(changedProperties) {
    if (changedProperties.has('inputobj') && Array.isArray(this.inputobj?.comments)) {
      this.workingComments = [...this.inputobj.comments];
      this.deletableIndices = []; // Reset deletable indices when inputobj changes
    }
  
    // Check for changes to commentsBorder or commentsStriped and trigger re-render
    if (changedProperties.has('commentsBorder') || changedProperties.has('commentsStriped')) {
      this.requestUpdate();
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
      taskowner: this.taskowner || '',
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

  render() {
    const showAllComments = this.historyLimit === 0 || this.showAll;
    const displayedComments = showAllComments ? this.workingComments : this.workingComments.slice(-this.historyLimit);
  
    // Conditionally adding classes for commentsBorder and commentsStriped
    const commentsHistoryClasses = [
      this.commentsBorder ? 'comments-border' : '',
      this.commentsStriped ? 'comments-striped' : ''
    ].filter(Boolean).join(' ');
  
    return html`
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      
      <!-- Show "Show All Comments" button if there are more comments than the limit -->
      ${this.historyLimit > 0 && this.workingComments.length > this.historyLimit ? html`
        <div class="d-flex justify-content-center mb-3">
          <button 
            class="btn btn-default rounded-pill d-flex align-items-center"
            type="button"
            @click=${this.toggleShowAll}
          >
            ${expandIcon} 
            <div class="ms-1">
            ${this.showAll ? ' Hide All Comments' : ' Show All Comments'}
            </div>
          </button>
        </div>
      ` : ''}
  
      <!-- Display the comments with applied styles -->
      ${displayedComments.length > 0 ? html`
        <div class="comments-history ${commentsHistoryClasses}">
          ${displayedComments.map((item, index) => html`
            <div class="card comment-card">
              <div class="card-body">
                <div class="d-flex flex-row align-items-center">
                  <h6 class="fw-bold mb-0">${item.firstName} ${item.lastName || ''}</h6>
                  ${item.taskowner ? html`
                    <span class="badge bg-secondary rounded-pill text-dark ms-2">${item.taskowner}</span>
                  ` : ''}
                  <span class="badge ${this.getBadgeClass(item.badgeStyle) || 'Default'} rounded-pill ms-2">
                    ${item.badge || 'Update'}
                  </span>
                  ${this.deletableIndices.includes(index) && !this.readOnly ? html`
                    <button class="btn btn-sm btn-danger ms-auto" @click=${() => this.deleteComment(index)}>
                      ${deleteIcon}
                    </button>
                  ` : ''}
                </div>
                <div class="d-flex flex-row align-items-center">
                  <p class="mb-0 text-muted comment-date">
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
                </div>
                <div>
                  <p class="mb-0 py-3 comment-text">${item.comment}</p>
                </div>
              </div>
            </div>
          `)}
        </div>
      ` : html``}
  
      ${!this.readOnly ? html`
        <div class="mt-4">
          <textarea
            class="comment-textarea"
            .value=${this.newComment}
            @input=${this.handleCommentChange}
            placeholder="Write your comment here..."
          ></textarea>
          <button
            class="btn btn-default d-flex align-items-center"
            type="button"
            @click=${this.addComment}
            ?disabled=${!this.newComment.trim()}
          >
            ${sendIcon} Add Comment
          </button>
        </div>
      ` : ''}
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

customElements.define('dfs-workflow-comments', CommentsElement);
