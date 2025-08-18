#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = '/Users/jake/Documents/GitHub/jsdez.github.io/plugins';

function fixPackageJson(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix trailing commas in objects and arrays
    content = content
      .replace(/,(\s*})/g, '$1')  // Remove trailing comma before }
      .replace(/,(\s*])/g, '$1'); // Remove trailing comma before ]
    
    // Try to parse to validate JSON
    const packageJson = JSON.parse(content);
    
    // Write back with proper formatting
    fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log(`✓ Fixed: ${path.relative(WORKSPACE_DIR, filePath)}`);
    
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
}

// Find all package.json files in direct subdirectories only
const subdirs = fs.readdirSync(WORKSPACE_DIR, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && dirent.name !== 'node_modules')
  .map(dirent => dirent.name);

for (const subdir of subdirs) {
  const packageJsonPath = path.join(WORKSPACE_DIR, subdir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    fixPackageJson(packageJsonPath);
  }
}

console.log('\nJSON fix complete! 🎉');
