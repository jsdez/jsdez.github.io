import { html, LitElement, css } from 'lit';
import { FrameMarker, MarkerArea } from 'markerjs2';

class AnnoElement extends LitElement {
  static getMetaConfig() {
    return {
      controlName: 'neo-anno',
      fallbackDisableSubmit: false,
      description: 'Display image for annotation',
      iconUrl: "image",
      groupName: 'Visual Data',
      version: '1.3',
      properties: {
        src: {
          type: 'string',
          title: 'Source of image',
          description: '',
        },
        image: {
          type: 'string',
          title: 'Output Image as base 64 value',
          description: 'Base64 of output image',
          isValueField: true,
        },
      },
      standardProperties: {
        fieldLabel: true,
        readOnly: true,
        required: true,
        description: true,
      }
    };
  }

  static properties = {
    src: { type: String },
    image: { type: String },
  };

  static get styles() {
    return css`
      .image-container {
        position: relative;
        display: inline-block;
        border: 2px dashed #888;
        padding: 5px;
        cursor: pointer;
        transition: border-color 0.3s;
        width: calc(100% - 15px); /* Subtract 30px from the full width */
      }
      .image-container:hover {
        border-color: #333;
      }
      img, .placeholder {
        width: 100%; /* Ensure the image and SVG take up the full width of the container */
        height: auto;
        display: block;
      }
      .tooltip {
        text-align: center;
        color: #888;
        font-size: 14px;
        margin-top: 5px;
      }
    `;
  }

  constructor() {
    super();
    this.src = '';
  }

  firstUpdated() {
    const imageContainer = this.shadowRoot.querySelector('.image-container');
    imageContainer.addEventListener('click', () => this.setupMarker());
  }

  setupMarker() {
    const img = this.shadowRoot.querySelector('img') || this.shadowRoot.querySelector('.placeholder');
    const markerArea = new MarkerArea(img);

    markerArea.addEventListener('render', (event) => {
      const dataUrl = event.dataUrl;
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, ''); // Remove the prefix
      this.image = base64Data;
      this.requestUpdate();
      this.dispatchEvent(new CustomEvent('ntx-value-change', {
        detail: base64Data,
        bubbles: true,
        cancelable: false,
        composed: true,
      }));
    });

    markerArea.settings.displayMode = 'popup';
    markerArea.settings.defaultMarkerTypeName = 'FrameMarker';
    markerArea.show();
  }

  render() {
    const imgSrc = this.image ? `data:image/png;base64,${this.image}` : this.src;

    return html`
      <div class="image-container">
        ${imgSrc
          ? html`<img src="${imgSrc}" alt="Annotatable image" crossorigin="anonymous" />`
          : html`
            <svg class="placeholder" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
              <rect width="100%" height="100%" fill="#ccc" />
              <text x="50%" y="50%" text-anchor="middle" fill="#666" font-size="20" font-family="Arial" dy=".3em">No Image</text>
            </svg>
          `}
      </div>
      <div class="tooltip">Click the image to start annotation</div>
    `;
  }
}

customElements.define('neo-anno', AnnoElement);
