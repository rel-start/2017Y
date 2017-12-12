const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 多入口文件
  entry: {
    app1: './js/app2.js',
    app2: './js/app1.js'
  },
  output: {
    path: path.resolve('dist'),
    filename: 'js/[name]-[chunkhash].js'
  },
  plugins: [new HtmlWebpackPlugin({
    filename: 'html/abc.html',
    template: 'index.html',
    inject: 'head',
    minify: {
      collapseWhitespace: true
    }
  })]
};