var fs = require("fs");
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackOnBuildPlugin = require('on-build-webpack');
var buildDir = './dist/';

module.exports = {
  entry: {
    app: path.resolve('./src/app.js'),
  },
  output: {
    filename: '[name]-[hash].js',
    path: path.resolve('dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('layout.html'),
      filename: 'index.html',
      collapseWhitespace: true
    }),
    new WebpackOnBuildPlugin(function (stats) {
      const newlyCreatedAssets = stats.compilation.assets;
      const unlinked = [];
      fs.readdir(path.resolve(buildDir), (err, files) => {
        files.forEach(file => {
          if (!newlyCreatedAssets[file]) {
            fs.unlink(path.resolve(buildDir + file));
            unlinked.push(file);
          }
        });
        if (unlinked.length > 0) {
          console.log('删除文件: ', unlinked);
        }
      });
    })
  ]
};