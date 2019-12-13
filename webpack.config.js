const path = require('path');
const entry = require('webpack-glob-entry');

module.exports = {
  entry: entry('./htdocs/js/es6/*.js'),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './htdocs/js/es5/'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
    ]
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'htdocs/'),
    }
  }
};
