import React, { Component } from 'react';
import ReactDOM from 'react-dom';


function Goto(props){
  return <h2>名字：{props.test}</h2>
}


// 子组件通过 this.props 来接收父组件传递过来的数据
// 注意 这个 this 必须保证指向 当前实例化出来的组件
class Welcome extends Component {
  render() {
    return (
      <div>{this.props.text}</div>
    );
  }
};

// 在react中一个组件就是一个类
// 父组件给子组件传递数据，就是在子组件的行间加上对应的属性和值
class App extends Component {
  render() {
    return (
      <div>
        <div>hello!</div>
        <Welcome text="宁波" />
        <Welcome text="上海" />
        <Goto test="杭州" />
      </div>
    );
  }
};

ReactDOM.render(
  <App />,
  document.getElementById('root')
);