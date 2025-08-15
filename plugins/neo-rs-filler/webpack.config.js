const path = require('path');

module.exports = {
  entry: './src/neo-rs-filler.ts', // Update the entry point to your TypeScript file
  mode: 'production',
  output: {
    filename: 'neo-rs-filler.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Match TypeScript files
        exclude: /node_modules/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'], // Add '.tsx' and '.ts' extensions
  },
};
