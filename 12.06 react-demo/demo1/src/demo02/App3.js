import React from 'react';
import ReactDOM from 'react-dom';

import './App.css';

// 实例1：JSX表达式
// const content = 'hello world';
// const element = <h1>{content}</h1>; // {} 里面传入变量

// 实例2：react默认不会渲染html结构，为了防止 XSS(跨站脚本)
// const content = '<span>你好，react!</span>';
// var ct = { __html: content };
// const element = <h1>{content}</h1>;
// const element1 = <h2 dangerouslySetInnerHTML={ct}></h2>

// 实例3：使用三元表达式
// let user = 'ty';
// const element = <h1>当前登录状态：{user ? user + '已登录' : '未登录'}</h1>;

// 实例4：添加样式
const ts = ({
  fontSize: '30px'
});


// 在JSX中每个元素只能渲染一个节点
// 每个元素的属性遵循的是DOM的API，而不是HTML的规范
const element = <div>
  <h1 style={{fontSize: 60, color: 'red'}}>Hello</h1>
  {/* JSX的注释 */}
  <p style={ts} className="text-color" id="box">Welcom to use react!</p>
</div>;

ReactDOM.render(
  <div>
    {element}
    {/* {element1} */}
  </div>,
  document.getElementById('root')
);
