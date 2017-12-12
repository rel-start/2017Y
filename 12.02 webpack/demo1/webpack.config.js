/**
 * webpack 配置最核心的4个概念
 * 
 * - entry
 * - output
 * - loader
 * - plugin
 */

const path = require('path');

module.exports = {
  entry: './js/app.js', // 指定入口文件
  output: {
    // 指定输出文件的目录
    path: path.resolve('dist'),
    // 指定输入文件的名字
    filename: 'bundle.js'
  }
};