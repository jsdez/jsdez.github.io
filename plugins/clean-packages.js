#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = '/Users/jake/Documents/GitHub/jsdez.github.io/plugins';
const COMMON_DEPS = [
  'css-loader',
  'lit',
  'style-loader', 
  'webpack',
  'webpack-cli',
  'babel-loader',
  'fuse.js'
];

function cleanPackageJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const packageJson = JSON.parse(content);
    
    let modified = false;
    
    // Clean dependencies
    if (packageJson.dependencies) {
      for (const dep of COMMON_DEPS) {
        if (dep in packageJson.dependencies) {
          delete packageJson.dependencies[dep];
          modified = true;
        }
      }
    }
    
    // Clean devDependencies  
    if (packageJson.devDependencies) {
      for (const dep of COMMON_DEPS) {
        if (dep in packageJson.devDependencies) {
          delete packageJson.devDependencies[dep];
          modified = true;
        }
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2) + '\n');
      console.log(`✓ Cleaned: ${path.relative(WORKSPACE_DIR, filePath)}`);
    }
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
    cleanPackageJson(packageJsonPath);
  }
}

console.log('\nCleanup complete! 🎉');
