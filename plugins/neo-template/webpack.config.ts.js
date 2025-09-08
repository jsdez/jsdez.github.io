const path = require('path');

module.exports = {
  entry: './src/neo-template.ts',
  mode: 'production',
  output: {
    filename: 'neo-template.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'window',
    },
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  optimization: {
    concatenateModules: true,
    usedExports: true,
    sideEffects: false,
  },
  externals: {
    // Don't bundle these - they should be available globally or not needed
  },
};
