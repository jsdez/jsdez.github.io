#!/bin/bash

# Script to clean up package.json files by removing common dependencies
# that are now managed at the workspace level

WORKSPACE_DIR="/Users/jake/Documents/GitHub/jsdez.github.io/plugins"

# Common dependencies to remove (these are now in the root package.json)
COMMON_DEPS=(
  "css-loader"
  "lit"
  "style-loader"
  "webpack"
  "webpack-cli"
  "babel-loader"
  "fuse.js"
)

# Find all package.json files in subdirectories (excluding root)
find "$WORKSPACE_DIR" -name "package.json" -not -path "$WORKSPACE_DIR/package.json" | while read package_file; do
  echo "Processing: $package_file"
  
  # Create a backup
  cp "$package_file" "$package_file.backup"
  
  # For each common dependency, remove it from both dependencies and devDependencies
  for dep in "${COMMON_DEPS[@]}"; do
    # Remove from dependencies section
    sed -i '' "/$dep/d" "$package_file"
  done
  
  # Clean up any trailing commas in JSON
  sed -i '' 's/,\s*}/}/g' "$package_file"
  sed -i '' 's/,\s*]/]/g' "$package_file"
  
done

echo "Cleanup complete!"
echo "You can now run 'pnpm install' in the workspace root to verify everything works."
