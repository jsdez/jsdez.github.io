// styles.js
import { css } from 'lit';

export const componentStyles = css`
  :host {
    display: block;
    max-width: 100%;
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
    border: none;
    border-radius: 0;
    margin: 0;
    padding: 0;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    border-bottom: 1px solid #ddd;
  }

  .comment-card:first-child {
    border-top: 1px solid #ddd;
    margin-top: 1rem;
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
  
  .comment-textarea {
    width: 100%;
    height: 100px;
    padding: 0.5rem;
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
