#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

async function generatePlugin() {
  try {
    const pluginName = await new Promise((resolve) => {
      rl.question('📝 Enter the new plugin name (e.g., neo-calculator): ', (answer) => {
        resolve(answer.trim());
      });
    });

    if (!validatePluginName(pluginName)) {
      rl.close();
      process.exit(1);
    }

    const description = await new Promise((resolve) => {
      rl.question('📄 Enter a description for the plugin (optional): ', (answer) => {
        resolve(answer.trim());
      });
    });

    const language = await new Promise((resolve) => {
      rl.question('💻 Choose language (js/ts) [default: js]: ', (answer) => {
        const lang = answer.trim().toLowerCase() || 'js';
        resolve(lang);
      });
    });

    // Validate language
    if (!['js', 'ts', 'javascript', 'typescript'].includes(language)) {
      console.error('❌ Language must be "js", "ts", "javascript", or "typescript"');
      rl.close();
      process.exit(1);
    }

    const isTypeScript = language.startsWith('t');
    const templateDir = path.join(__dirname, 'neo-template');
    const newPluginDir = path.join(__dirname, pluginName);

    // Check if plugin already exists
    if (fs.existsSync(newPluginDir)) {
      console.error(`❌ Plugin "${pluginName}" already exists!`);
      rl.close();
      process.exit(1);
    }

    // Check if template exists
    if (!fs.existsSync(templateDir)) {
      console.error('❌ Template directory "neo-template" not found!');
      rl.close();
      process.exit(1);
    }

    console.log(`🚀 Generating ${isTypeScript ? 'TypeScript' : 'JavaScript'} plugin "${pluginName}"...`);

    // Copy template directory
    copyDirectory(templateDir, newPluginDir);

    // Generate replacements
    const className = toPascalCase(pluginName) + 'Element';
    const camelName = toCamelCase(pluginName);
    
    const replacements = {
      'neo-template': pluginName,
      'templateElement': className,
      'TemplateElement': className,
      'template': camelName,
      '"description": ""': `"description": "${description}"`,
      "'Input value'": "'Input value'", // Keep as placeholder
      "'Output value'": "'Output value'", // Keep as placeholder
      "'Please provide the input value'": "'Please provide the input value'", // Keep as placeholder
      "'The processed output value'": "'The processed output value'" // Keep as placeholder
    };

    // Choose the appropriate template file and webpack config
    const templateExtension = isTypeScript ? 'ts' : 'js';
    const sourceFile = `neo-template.${templateExtension}`;
    const targetFile = `${pluginName}.${templateExtension}`;
    
    // Rename files
    renameFiles(newPluginDir, 'neo-template', pluginName);
    
    // Handle the main source file specifically
    const oldJsSourcePath = path.join(newPluginDir, 'src', 'neo-template.js');
    const oldTsSourcePath = path.join(newPluginDir, 'src', 'neo-template.ts');
    const newSourcePath = path.join(newPluginDir, 'src', targetFile);
    
    if (isTypeScript) {
      // Use TypeScript template, remove JS template
      if (fs.existsSync(oldTsSourcePath)) {
        fs.renameSync(oldTsSourcePath, newSourcePath);
      }
      if (fs.existsSync(oldJsSourcePath)) {
        fs.unlinkSync(oldJsSourcePath);
      }
    } else {
      // Use JavaScript template, remove TS template
      if (fs.existsSync(oldJsSourcePath)) {
        fs.renameSync(oldJsSourcePath, newSourcePath);
      }
      if (fs.existsSync(oldTsSourcePath)) {
        fs.unlinkSync(oldTsSourcePath);
      }
    }

    // Update webpack config entry point
    const webpackConfigPath = path.join(newPluginDir, 'webpack.config.js');
    const webpackTsConfigPath = path.join(newPluginDir, 'webpack.config.ts.js');
    
    if (isTypeScript && fs.existsSync(webpackTsConfigPath)) {
      // Use TypeScript webpack config
      fs.renameSync(webpackTsConfigPath, webpackConfigPath);
      replacements['./src/neo-template.ts'] = `./src/${targetFile}`;
    } else {
      // Remove TypeScript webpack config if using JS
      if (fs.existsSync(webpackTsConfigPath)) {
        fs.unlinkSync(webpackTsConfigPath);
      }
      replacements['./src/neo-template.js'] = `./src/${targetFile}`;
    }

    // Remove tsconfig.json if not using TypeScript
    if (!isTypeScript) {
      const tsconfigPath = path.join(newPluginDir, 'tsconfig.json');
      if (fs.existsSync(tsconfigPath)) {
        fs.unlinkSync(tsconfigPath);
      }
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

    rl.close();

  } catch (error) {
    console.error('❌ Error generating plugin:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.length > 0 && (args[0] === '--help' || args[0] === '-h')) {
  console.log('🔧 NEO Plugin Generator');
  console.log('');
  console.log('Usage: pnpm generate');
  console.log('');
  console.log('This tool will interactively create a new plugin from the neo-template.');
  console.log('Plugin names must follow the pattern "neo-[name]" using lowercase letters and hyphens.');
  console.log('');
  console.log('Examples:');
  console.log('  - neo-calculator');
  console.log('  - neo-data-viewer');
  console.log('  - neo-form-builder');
  process.exit(0);
}

generatePlugin();
