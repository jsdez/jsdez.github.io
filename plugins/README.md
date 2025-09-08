# NEO Plugin Generator

This workspace includes tools to automatically generate new plugins from the `neo-template` template with support for both **JavaScript** and **TypeScript**.

## Quick Start

### Method 1: Command Line (Recommended)
```bash
cd plugins
pnpm new <plugin-name> [description] [language]
```

**Examples:**
```bash
# JavaScript (default)
pnpm new neo-calculator "A simple calculator plugin"
pnpm new neo-data-viewer

# TypeScript
pnpm new neo-form-builder "Advanced form building tool" ts
pnpm new neo-chart-widget "Chart visualization" typescript
```

### Method 2: Interactive
```bash
cd plugins
pnpm generate
```
This will prompt you for the plugin name, description, and language choice.

## Language Support

### JavaScript (Default)
- Uses ES6+ syntax with Lit Element
- Babel compilation via webpack
- **Single-file output** - all dependencies bundled into one file
- Standard JavaScript template with Nintex Form Plugin Contract v1.0.5

### TypeScript
- Full TypeScript support with **official Nintex Form Plugin Contract types**
- Lit decorators (`@customElement`, `@property`) 
- Type-safe plugin interfaces using `PluginContract` from `@nintex/form-plugin-contract`
- **Single-file output** - all dependencies bundled into one JavaScript file
- TypeScript compilation via `ts-loader`
- No separate declaration files generated (single file requirement)

## Plugin Naming Rules

Plugin names **must** follow the pattern `neo-[name]` using:
- Lowercase letters only
- Hyphens to separate words
- No spaces, underscores, or special characters

✅ **Valid Examples:**
- `neo-calculator`
- `neo-data-viewer`
- `neo-form-builder`
- `neo-image-carousel`

❌ **Invalid Examples:**
- `calculator` (missing neo- prefix)
- `neo_calculator` (underscores not allowed)
- `neo-Calculator` (uppercase letters not allowed)
- `neo calculator` (spaces not allowed)

## Parameters

1. **plugin-name** (required): Must start with "neo-"
2. **description** (optional): Plugin description for package.json
3. **language** (optional): "js", "ts", "javascript", or "typescript" (defaults to "js")

## What Gets Generated

The generator will:

1. **Copy the appropriate template**: Chooses JS or TS template based on language parameter
2. **Rename files**: Changes template files to match your plugin name
3. **Update content**: Replaces all template references with proper naming:
   - `neo-template` → `neo-your-plugin`
   - `templateElement` → `NeoYourPluginElement` (PascalCase)
   - `TemplateElement` → `NeoYourPluginElement` (for TypeScript)
4. **Configure build**: Sets up webpack for **single-file output** with all dependencies bundled
5. **Add Nintex contracts**: TypeScript templates include proper `@nintex/form-plugin-contract` imports
6. **Clean up**: Removes unused template files and configs

## Build Output

Both JavaScript and TypeScript plugins compile to a **single JavaScript file** with all dependencies bundled. This ensures compatibility with Nintex Forms which requires single-file plugins for most deployment scenarios.

**Generated files:**
- `dist/neo-your-plugin.js` - Single bundled JavaScript file
- `dist/neo-your-plugin.js.LICENSE.txt` - License information file

## Generated File Structure

### JavaScript Plugin
```
neo-your-plugin/
├── package.json
├── webpack.config.js     # Configured for single-file bundling
├── src/
│   └── neo-your-plugin.js # Main plugin file
└── dist/ (after build)
    ├── neo-your-plugin.js # Single bundled file
    └── neo-your-plugin.js.LICENSE.txt
```

### TypeScript Plugin
```
neo-your-plugin/
├── package.json
├── webpack.config.js     # TypeScript config with single-file bundling
├── tsconfig.json         # TypeScript configuration
├── src/
│   └── neo-your-plugin.ts # Main plugin file with Nintex contracts
└── dist/ (after build)
    ├── neo-your-plugin.js # Single bundled file
    └── neo-your-plugin.js.LICENSE.txt
```

## After Generation

1. **Navigate to your plugin**:
   ```bash
   cd neo-your-plugin
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Build the plugin**:
   ```bash
   pnpm build
   ```

4. **Customize your plugin**:
   - Update the `getMetaConfig()` method with your plugin's properties
   - Implement your plugin logic in the `render()` method
   - Add any required dependencies to `package.json`
   - For TypeScript: Leverage type safety and interfaces

## TypeScript Features

When using TypeScript templates, you get:

- **Official Nintex Contracts**: Import and use `PluginContract` from `@nintex/form-plugin-contract`
- **Type Safety**: Full TypeScript compilation with strict type checking
- **Lit Decorators**: Modern `@customElement` and `@property` decorators
- **Interface Definitions**: Type-safe configuration using official Nintex interfaces
- **Global Type Declarations**: Proper HTMLElementTagNameMap extensions
- **Single File Output**: All dependencies bundled into one JavaScript file
- **IDE Support**: Enhanced IntelliSense and error detection

## Template Structure

The generator uses two template files in the `neo-template` directory:

- `src/neo-template.js` - JavaScript template with Nintex contract v1.0.5
- `src/neo-template.ts` - TypeScript template with `@nintex/form-plugin-contract` imports
- `webpack.config.js` - JavaScript build configuration for single-file output
- `webpack.config.ts.js` - TypeScript build configuration for single-file output
- `tsconfig.json` - TypeScript compiler options (no declaration files)

Both templates are configured to produce single JavaScript files with all dependencies bundled, meeting Nintex Forms' deployment requirements.

## Troubleshooting

### "Plugin already exists" error
If you see this error, a directory with that name already exists. Choose a different name or remove the existing directory.

### Build errors after generation
Make sure you've run `pnpm install` in the generated plugin directory before running `pnpm build`.

### TypeScript compilation errors
Ensure all TypeScript dependencies are installed at the workspace level. The generator should handle this automatically.

### Template not found
Ensure both `neo-template.js` and `neo-template.ts` exist in the `neo-template/src/` directory.

## Available Scripts

- `pnpm new <name> [description] [language]` - Generate a new plugin (command line)
- `pnpm generate` - Generate a new plugin (interactive)
- `pnpm build:all` - Build all plugins in the workspace
- `pnpm install:all` - Install dependencies for all plugins
- `pnpm clean` - Clean all dist directories

## Script Files

- `generate-plugin-simple.js` - Command line generator
- `generate-plugin.js` - Interactive generator

Both scripts support JavaScript and TypeScript generation with intelligent template selection and file management.
