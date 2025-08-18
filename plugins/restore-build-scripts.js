#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = '/Users/jake/Documents/GitHub/jsdez.github.io/plugins';

function addBuildScript(filePath, hasWebpack) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const packageJson = JSON.parse(content);
    
    if (hasWebpack && (!packageJson.scripts || !packageJson.scripts.build)) {
      if (!packageJson.scripts) {
        packageJson.scripts = {};
      }
      packageJson.scripts.build = "webpack";
      
      fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2) + '\n');
      console.log(`✓ Added build script: ${path.relative(WORKSPACE_DIR, filePath)}`);
    }
    
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
}

// Find all subdirectories
const subdirs = fs.readdirSync(WORKSPACE_DIR, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && dirent.name !== 'node_modules')
  .map(dirent => dirent.name);

for (const subdir of subdirs) {
  const packageJsonPath = path.join(WORKSPACE_DIR, subdir, 'package.json');
  const webpackConfigPath = path.join(WORKSPACE_DIR, subdir, 'webpack.config.js');
  
  if (fs.existsSync(packageJsonPath)) {
    const hasWebpack = fs.existsSync(webpackConfigPath);
    addBuildScript(packageJsonPath, hasWebpack);
  }
}

console.log('\nBuild scripts restoration complete! 🎉');
