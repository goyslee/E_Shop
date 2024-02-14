const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  target: 'web',
  entry: './view/src/index.js', // Path to your main client JS file
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'view/public/dist'),
    filename: 'client-bundle.js'
  },
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      // Moved the HTML loader inside the rules array
      {
        test: /\.html$/,
        use: ['html-loader']
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './view/public/index.html',
      filename: 'index.html',
    }),
    // Consider removing if not required
    new NodePolyfillPlugin(),
  ],
};
