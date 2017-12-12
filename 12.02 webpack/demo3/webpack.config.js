const path = require('path');

module.exports = {
  // 多入口文件
  entry: {
    app1: './js/app2.js',
    app2: './js/app1.js'
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].js'
  }
};