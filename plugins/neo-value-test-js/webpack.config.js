const path = require('path');

module.exports = {
  entry: './src/neo-value-test-js.js',
  mode: 'production',
  output: {
    filename: 'neo-value-test-js.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'window',
    },
  },
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
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