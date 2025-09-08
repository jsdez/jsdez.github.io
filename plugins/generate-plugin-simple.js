#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function toPascalCase(str) {
  return str.replace(/(^|-)([a-z])/g, (match, dash, letter) => letter.toUpperCase());
}

function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function validatePluginName(name) {
  const validPattern = /^neo-[a-z]+(-[a-z]+)*$/;
  if (!validPattern.test(name)) {
    console.error('❌ Plugin name must follow the pattern "neo-[name]" using lowercase letters and hyphens only.');
    console.error('   Examples: neo-calculator, neo-data-viewer, neo-form-builder');
    return false;
  }
  return true;
}

function copyDirectory(src, dest, options = {}) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    // Skip node_modules, dist, and other build artifacts
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') {
      continue;
    }

    // Skip unwanted template files based on language choice
    if (options.excludeFiles && options.excludeFiles.includes(entry.name)) {
      continue;
    }

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath, options);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  for (const [search, replace] of Object.entries(replacements)) {
    content = content.replace(new RegExp(search, 'g'), replace);
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
}

function renameFiles(dir, oldName, newName) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      renameFiles(fullPath, oldName, newName);
    } else if (entry.name.includes(oldName)) {
      const newFileName = entry.name.replace(oldName, newName);
      const newPath = path.join(dir, newFileName);
      fs.renameSync(fullPath, newPath);
    }
  }
}

function generatePlugin(pluginName, description = '', language = 'js') {
  try {
    if (!validatePluginName(pluginName)) {
      process.exit(1);
    }

    // Validate language
    if (!['js', 'ts', 'javascript', 'typescript'].includes(language.toLowerCase())) {
      console.error('❌ Language must be "js", "ts", "javascript", or "typescript"');
      process.exit(1);
    }

    const isTypeScript = language.toLowerCase().startsWith('t');
    const templateDir = path.join(__dirname, 'neo-template');
    const newPluginDir = path.join(__dirname, pluginName);

    // Check if plugin already exists
    if (fs.existsSync(newPluginDir)) {
      console.error(`❌ Plugin "${pluginName}" already exists!`);
      process.exit(1);
    }

    // Check if template exists
    if (!fs.existsSync(templateDir)) {
      console.error('❌ Template directory "neo-template" not found!');
      process.exit(1);
    }

    console.log(`🚀 Generating ${isTypeScript ? 'TypeScript' : 'JavaScript'} plugin "${pluginName}"...`);

    // Prepare copy options to exclude unwanted template files
    const excludeFiles = [];
    if (isTypeScript) {
      excludeFiles.push('neo-template.js');
    } else {
      excludeFiles.push('neo-template.ts');
      excludeFiles.push('tsconfig.json');
      excludeFiles.push('webpack.config.ts.js');
    }

    // Copy template directory with exclusions
    copyDirectory(templateDir, newPluginDir, { excludeFiles });

    // Generate replacements
    const className = toPascalCase(pluginName) + 'Element';
    const camelName = toCamelCase(pluginName);
    
    const replacements = {
      'neo-template': pluginName,
      'templateElement': className,
      'TemplateElement': className,
      'template': camelName,
      '"description": ""': `"description": "${description}"`
    };

    // Choose the appropriate template file and webpack config
    const templateExtension = isTypeScript ? 'ts' : 'js';
    const sourceFile = `neo-template.${templateExtension}`;
    const targetFile = `${pluginName}.${templateExtension}`;
    
    // Rename files
    renameFiles(newPluginDir, 'neo-template', pluginName);
    
    // Handle the main source file specifically
    const templateSourcePath = path.join(newPluginDir, 'src', `neo-template.${templateExtension}`);
    const targetSourcePath = path.join(newPluginDir, 'src', targetFile);
    
    if (fs.existsSync(templateSourcePath)) {
      fs.renameSync(templateSourcePath, targetSourcePath);
    }

        // Update webpack config entry point
    const webpackConfigPath = path.join(newPluginDir, 'webpack.config.js');
    const webpackTsConfigPath = path.join(newPluginDir, 'webpack.config.ts.js');
    
    if (isTypeScript && fs.existsSync(webpackTsConfigPath)) {
      // Use TypeScript webpack config
      fs.renameSync(webpackTsConfigPath, webpackConfigPath);
      replacements['./src/neo-template.ts'] = `./src/${targetFile}`;
    } else {
      replacements['./src/neo-template.js'] = `./src/${targetFile}`;
    }

    // Replace content in files
    const filesToUpdate = [
      path.join(newPluginDir, 'package.json'),
      path.join(newPluginDir, 'webpack.config.js'),
      path.join(newPluginDir, 'src', targetFile)
    ];

    filesToUpdate.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        replaceInFile(filePath, replacements);
      }
    });

    console.log('✅ Plugin generated successfully!');
    console.log(`📁 Location: ${newPluginDir}`);
    console.log(`🔧 Language: ${isTypeScript ? 'TypeScript' : 'JavaScript'}`);
    console.log('');
    console.log('🔧 Next steps:');
    console.log(`   cd ${pluginName}`);
    console.log('   pnpm install');
    console.log('   pnpm build');
    console.log('');
    console.log('📝 Don\'t forget to:');
    console.log('   - Update the plugin properties in the getMetaConfig() method');
    console.log('   - Implement your plugin logic in the render() method');
    console.log('   - Add any required dependencies to package.json');
    if (isTypeScript) {
      console.log('   - Leverage TypeScript features for better type safety');
    }

  } catch (error) {
    console.error('❌ Error generating plugin:', error.message);
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  console.log('🔧 NEO Plugin Generator');
  console.log('');
  console.log('Usage: pnpm new <plugin-name> [description] [language]');
  console.log('   or: node generate-plugin-simple.js <plugin-name> [description] [language]');
  console.log('');
  console.log('This tool creates a new plugin from the neo-template.');
  console.log('Plugin names must follow the pattern "neo-[name]" using lowercase letters and hyphens.');
  console.log('');
  console.log('Parameters:');
  console.log('  plugin-name   Plugin name (required) - must start with "neo-"');
  console.log('  description   Plugin description (optional)');
  console.log('  language      "js" or "ts" (optional, defaults to "js")');
  console.log('');
  console.log('Examples:');
  console.log('  pnpm new neo-calculator "A simple calculator plugin"');
  console.log('  pnpm new neo-data-viewer');
  console.log('  pnpm new neo-form-builder "Advanced form building tool" ts');
  console.log('  pnpm new neo-chart-widget "Chart visualization" typescript');
  process.exit(0);
}

const pluginName = args[0];
const description = args[1] || '';
const language = args[2] || 'js';

generatePlugin(pluginName, description, language);
