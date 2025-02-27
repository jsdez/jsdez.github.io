// styles.js
import { css } from 'lit';

export const componentStyles = css`
  :host {
    display: block;
    max-width: 100%;
    font-family: var(--ntx-form-theme-font-family);
  }

  .comments-history {
    display: flex;
    flex-direction: column;
    position: relative;
  }

  /* Shadow Effect */
  .comments-history::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 20px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), transparent);
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    pointer-events: none;
  }

  .comments-history.scrolled::before {
    opacity: 1;
  }

  .comment-card {
    border: none; /* Remove borders */
    border-radius: 0;
    margin: 0;
    padding: 0;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
  }

  /* Apply alternating row colors using the theme variable */
  .comment-card:nth-child(odd) {
    background-color: var(--ntx-form-theme-color-form-background); /* Default form background */
  }

  .comment-card:nth-child(even) {
    background-color: var(--ntx-form-theme-color-form-background-alternate-contrast); /* Alternate contrast color */
  }

  /* Hover effect */
  .comment-card:hover {
    background-color: var(--ntx-form-theme-color-input-background); /* Use input background for hover effect */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  /* Selected state */
  .comment-card.selected {
    background-color: var(--ntx-form-theme-color-border); /* Slightly darker contrast */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
  
  .comment-date {
    font-size: 14px;
  }

  .card-body {
    padding: .5rem;
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
  
  .comment-textarea {
    width: 100%;
    height: 100px;
    min-height: 72px;
    padding: .4375rem .75rem;
    background: var(--ntx-form-theme-color-input-background);
    border-color: var(--ntx-form-theme-color-border);
    border-radius: var(--ntx-form-theme-border-radius);
    caret-color: var(--ntx-form-theme-color-input-text);
    color: var(--ntx-form-theme-color-input-text);
    font-family: var(--ntx-form-theme-font-family);
    font-size: var(--ntx-form-theme-text-input-size);
    margin-bottom: 1rem;
  }

  .comment-textarea:focus {
    border-color: var(--ntx-form-theme-color-primary);
    outline: 0;
  }

  .comment-text {
    user-select: text;
  }

  .btn-default {
    background-color: var(--ntx-form-theme-color-primary-button-background);
    border-color: var(--ntx-form-theme-color-primary-button-background);
    border-radius: var(--ntx-form-theme-border-radius);
    color: var(--ntx-form-theme-color-primary-button-font);
    font-family: var(--ntx-form-theme-font-family);
    font-size: var(--ntx-form-theme-text-label-size);
  }
  
  .btn-default:hover {
    background-color: var(--ntx-form-theme-color-primary-button-hover);
    color: var(--ntx-form-theme-color-primary-button-font);
  }

  .btn-default:disabled {
    background-color: var(--ntx-form-theme-color-primary-button-disabled);
    border-color: var(--ntx-form-theme-color-primary-button-disabled);
    color: var(--ntx-form-theme-color-primary-button-font);
  }
`;
