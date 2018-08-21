const path = require('path');

module.exports = {
  context: __dirname,
  entry: './javascripts/evoke.js',
  output: {
    path: path.resolve('javascripts'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '*']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          query: {
            presets: ['env']
          }
        },
      }
    ]
  },
  devtool: 'source-map'
};
