const path = require('path');

module.exports = {
  // 多入口文件
  entry: ['./js/app2.js', './js/app1.js'],
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js'
  }
};