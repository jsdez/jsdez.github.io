# Copilot Instructions for Nintex Forms Web Components Repository

## Repository Overview
This repository (`jsdez.github.io`) is a specialized collection of custom web components designed for Nintex Forms. It serves as a centralized workspace for developing, building, and distributing plugins that extend Nintex Forms functionality.

## Project Structure

### Root Directory Organization
- **`/plugins/`** - Main development workspace containing all web component plugins
- **`/assets/`** - Shared resources (images, CSS, media files)
  - `/branding/` - Brand assets and logos
  - `/css/` - Shared stylesheets
  - `/img/` - Image resources
  - `/media/` - Video and multimedia files

### Plugin Architecture
Each plugin follows a standardized structure:
```
plugins/[plugin-name]/
├── package.json          # Plugin-specific dependencies and metadata
├── webpack.config.js     # Build configuration
├── src/                  # Source code directory
│   └── [plugin-name].js  # Main plugin implementation
└── dist/                 # Built output (generated)
```

## Technology Stack

### Core Technologies
- **Lit Element** - Primary web component framework
- **JavaScript ES6+** - Modern JavaScript features
- **CSS3** - Styling with CSS custom properties
- **Webpack** - Module bundling and build process
- **Babel** - JavaScript transpilation

### Build System
- **pnpm** - Package manager with workspace support
- **Webpack 5** - Module bundler with CSS and JS loaders
- **Babel Loader** - ES6+ transpilation
- **CSS/Style Loaders** - CSS processing and injection

## Plugin Development Standards

### Naming Conventions
- **Plugin Names**: Follow `neo-[functionality]` pattern (e.g., `neo-accordion`, `neo-charts`)
- **Element Names**: Use kebab-case matching the plugin name
- **Class Names**: Use PascalCase with "Element" suffix (e.g., `NeoAccordionElement`)

### Plugin Structure Requirements
Each Nintex plugin must implement:

1. **Static getMetaConfig() Method**:
   ```javascript
   static getMetaConfig() {
     return {
       controlName: 'plugin-name',
       fallbackDisableSubmit: false,
       description: 'Plugin description',
       iconUrl: 'icon-identifier',
       groupName: 'NEO',
       version: '1.0',
       properties: {
         // Custom properties configuration
       },
       standardProperties: {
         fieldLabel: true,
         description: true,
       }
     };
   }
   ```

2. **LitElement Base Class**: All components extend `LitElement`
3. **Properties Declaration**: Use static properties with proper typing
4. **Render Method**: Return Lit HTML templates
5. **Lifecycle Methods**: Implement connectedCallback for initialization

### Property Configuration
- **String Properties**: Text inputs, dropdowns
- **Boolean Properties**: Checkboxes, toggles
- **Object Properties**: Complex configurations
- **Standard Properties**: Built-in Nintex form properties (fieldLabel, description, etc.)

### File Organization
- **Source Files**: Place in `/src/` directory
- **Entry Point**: Main JS file named after the plugin
- **Assets**: Reference shared assets from `/assets/` directory
- **Styling**: Use CSS-in-JS with Lit's `css` template literal

## Build and Development Workflow

### Development Commands
```bash
# Install all dependencies
pnpm install:all

# Build specific plugin
cd plugins/[plugin-name] && pnpm build

# Build all plugins
pnpm build:all

# Clean all build outputs
pnpm clean
```

### Plugin Creation Process
1. Create new directory in `/plugins/` following naming convention
2. Set up `package.json` with webpack and babel dependencies
3. Configure `webpack.config.js` with entry point and output settings
4. Implement main plugin file extending LitElement
5. Define `getMetaConfig()` method with Nintex plugin metadata
6. Test locally and build for distribution

## Integration Guidelines

### Nintex Forms Integration
- Plugins are loaded as custom elements in Nintex Forms
- Configuration properties appear in the Nintex Forms designer
- Events and form interactions follow Nintex plugin API
- Support for form validation and submission workflows

### Browser Compatibility
- Modern browsers with ES6+ support
- Web Components v1 specification
- Shadow DOM support
- Custom Elements support

### Performance Considerations
- Lazy loading of plugin logic
- Efficient DOM manipulation
- Minimal bundle sizes through tree shaking
- CSS scoping via Shadow DOM

## Plugin Categories

### Current Plugin Types
- **Layout Components**: Accordions, tabs, carousels
- **Data Visualization**: Charts, tables, data viewers
- **Form Controls**: Custom inputs, date filters, password fields
- **Business Logic**: Price calculators, workflow components
- **Integration Tools**: PDF viewers, calendar components
- **Utility Components**: Translation tools, regex validators

### Specialized Plugins
- **Saltire Integration**: Business-specific workflow components
- **DFS Integration**: Document and form system plugins
- **KBR Components**: Budget calculation tools

## Best Practices

### Code Quality
- Use TypeScript definitions where available (see `nintex-plugin.ts`)
- Implement proper error handling and validation
- Follow accessibility guidelines (ARIA labels, keyboard navigation)
- Use semantic HTML structure

### Documentation
- Document plugin properties and their purposes
- Include usage examples and configuration guides
- Maintain changelog for version updates
- Document any external dependencies

### Testing
- Test plugin integration within Nintex Forms environment
- Validate cross-browser compatibility
- Test responsive behavior on different screen sizes
- Verify form submission and validation workflows

## Deployment

### Distribution
- Built plugins are distributed as single JS files
- Include necessary CSS within the JS bundle
- Ensure all assets are properly bundled or referenced
- Version plugins appropriately for tracking

### GitHub Pages Hosting
- Repository serves plugins via GitHub Pages
- Assets are publicly accessible for Nintex Forms integration
- Maintain clean URLs for plugin loading

## Official Nintex Documentation References

### Core Plugin Development Resources
- **[Nintex Forms Plugin Development Guide](https://help.nintex.com/en-US/formplugins/Home.htm)** - Primary documentation for creating Nintex Forms plugins
- **[Plugin API Reference](https://help.nintex.com/en-US/formplugins/Reference/PluginAPI.htm)** - Complete API documentation for plugin development
- **[Plugin Configuration Properties](https://help.nintex.com/en-US/formplugins/Reference/PluginProperties.htm)** - Details on property types and configuration options
- **[Plugin Lifecycle Methods](https://help.nintex.com/en-US/formplugins/Reference/PluginLifecycle.htm)** - Understanding plugin initialization and event handling

### Integration and Deployment
- **[Publishing Plugins](https://help.nintex.com/en-US/formplugins/Tasks/PublishPlugin.htm)** - Guidelines for deploying plugins to Nintex Forms
- **[Plugin Security Guidelines](https://help.nintex.com/en-US/formplugins/Tasks/PluginSecurity.htm)** - Security best practices and requirements
- **[Testing Plugins](https://help.nintex.com/en-US/formplugins/Tasks/TestPlugin.htm)** - Testing strategies and validation methods

### Advanced Topics
- **[Custom Property Types](https://help.nintex.com/en-US/formplugins/Reference/CustomProperties.htm)** - Creating complex configuration interfaces
- **[Form Event Handling](https://help.nintex.com/en-US/formplugins/Reference/FormEvents.htm)** - Integrating with form submission and validation
- **[Plugin Localization](https://help.nintex.com/en-US/formplugins/Tasks/PluginLocalization.htm)** - Supporting multiple languages

### Troubleshooting and Support
- **[Common Issues and Solutions](https://help.nintex.com/en-US/formplugins/Troubleshooting/CommonIssues.htm)** - Debugging and resolving plugin problems
- **[Plugin Performance Optimization](https://help.nintex.com/en-US/formplugins/Tasks/PerformanceOptimization.htm)** - Best practices for efficient plugins
- **[Nintex Community Forums](https://community.nintex.com/)** - Community support and discussions

### Technical Specifications
- **[Browser Compatibility Requirements](https://help.nintex.com/en-US/formplugins/Reference/BrowserSupport.htm)** - Supported browsers and versions
- **[Plugin File Structure](https://help.nintex.com/en-US/formplugins/Reference/FileStructure.htm)** - Required files and organization
- **[Metadata Schema](https://help.nintex.com/en-US/formplugins/Reference/MetadataSchema.htm)** - Complete getMetaConfig() specification

## Contributing Guidelines

### Development Workflow
1. Create feature branch for new plugins or updates
2. Follow established naming conventions and structure
3. Test thoroughly in Nintex Forms environment
4. Update documentation as needed
5. Submit pull request with clear description

### Code Review
- Ensure plugin follows established patterns
- Verify proper Nintex plugin metadata
- Check for security considerations
- Validate build process and output

This repository represents a comprehensive ecosystem for extending Nintex Forms capabilities through custom web components, maintaining consistency and quality across all plugin implementations.
