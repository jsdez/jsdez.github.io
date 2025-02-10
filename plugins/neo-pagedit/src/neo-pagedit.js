import { LitElement, html, css } from 'lit';

class templateElement extends LitElement {
  static getMetaConfig() {
    // plugin contract information
    return {
      controlName: 'neo-pagedit',
      fallbackDisableSubmit: false,
      description: 'Allow for showing and hiding pages',
      iconUrl: "image",
      groupName: 'Visual Data',
      version: '1.0',
      properties: {
        src: {
          type: 'string',
          title: '3D Object source',
          description: 'Please provide a link to the 3d object (.glt or .gltf)'
        },
      },
      standardProperties: {
        fieldLabel: true,
        description: true,
      }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
  
      .container {
        width: 100%;
        height: 600px;
      }
    `;
  }
  
  static get properties() {
    return {
      modelLoaded: { type: Boolean },
      error: { type: String },
      container: { type: Object },
    };
  }

  constructor() {
    super();
    this.src = '';
    this.container = document.createElement('div');
  }

  firstUpdated() {
    super.firstUpdated();
    this.initScene();
    window.dispatchEvent(new Event('resize'));
  }
  

  disconnectedCallback() {
    super.disconnectedCallback();
    this.disposeScene();
  }

  initScene() {
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(this.clientWidth, 600);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.style.width = '100%';
    this.container.appendChild(renderer.domElement);
  
    const camera = new PerspectiveCamera(75, this.clientWidth / 600, 0.1, 1000);
    camera.position.set(0, 0, 2);
    camera.rotation.x = -Math.PI / 6; // set camera pitch to look down slightly
  
    const controls = new OrbitControls(camera, renderer.domElement);
  
    const scene = new Scene();
    scene.background = new Color(0xffffff);
  
    const ambientLight = new AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);
  
    const directionalLight = new DirectionalLight(0xffffff, 0.75);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
  
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://jsdenintex.github.io/plugins/neo-pagedit/dist/draco/js/');
    loader.setDRACOLoader(dracoLoader);
    loader.load(this.src, (gltf) => {
      scene.add(gltf.scene);
      this.modelLoaded = true;
    }, undefined, (error) => {
      console.error('An error occurred:', error);
      this.error = 'Failed to load the model';
    });
  
    const resize = () => {
      const { clientWidth } = this;
      camera.aspect = clientWidth / 600;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, 600);
    };
  
    window.addEventListener('resize', resize);
  
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
  
    animate();
  }
  
  
  disposeScene() {
    // Dispose of the Three.js resources here when the component is disconnected from the DOM
  }

  render() {
    if (!this.src) {
      return html`<p>No model source provided</p>`;
    }
    if (!this.modelLoaded) {
      return html`<p>Loading model...</p>`;
    }
    if (this.error) {
      return html`<p>${this.error}</p>`;
    }
    return html`
      <div class="container" id="model-container">
        ${this.container}
        <slot></slot>
      </div>
  `;
  }
}

customElements.define('neo-pagedit', templateElement);
