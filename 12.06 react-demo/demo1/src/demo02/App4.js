import React from 'react';  // 'react'引用模块中, 导入默认的组件
import ReactDOM from 'react-dom';

import './App.css';   // 导入 css 文件

// 实例1：JSX表达式
// const content = 'hello world';
// const element = <h1>{content}</h1>; // {} 里面传入变量

// 实例2：react默认不会渲染html结构，为了防止 XSS(跨站脚本)
// const c = '<span>你好，react!</span>';
// const element = <h1>{c}</h1>;
// const element1 = <h2 dangerouslySetInnerHTML={{__html: c}}></h2>

// 实例3：使用三元表达式
// let user = 'ty';
// const element = <h1>当前登录状态：{user ? user+'已登录':'未登录'}</h1>


// 实例4：添加样式
const ts = {
  fontSize: 30,
  color: '#f60'
};

const element = (
  <div>
    <h1 style={ts} className='text-color'>汤烨</h1>
    {/* JSX的注释 */}
    <p style={{ fontSize: 60, textDecoration: 'underline' }} id="cc">Welcome to use react!</p>
  </div>
);

ReactDOM.render(
  <a>
    {element}
    {/* {element1} */}
  </a>,
  document.getElementById('root')
);