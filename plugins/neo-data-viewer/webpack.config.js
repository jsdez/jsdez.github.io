const path = require('path');

module.exports = {
  entry: './src/neo-data-viewer.js',
  mode: 'production',
  output: {
    filename: 'neo-data-viewer.js',
    path: path.resolve(__dirname, 'dist'),
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
};