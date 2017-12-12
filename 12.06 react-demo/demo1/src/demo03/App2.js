import React from 'react';
import ReactDOM from 'react-dom';

// React 使用的是 Virtual Dom，当页面元素某个地方发生改变的时候
// 只会重新渲染变化的那个部分，所以性能是非常高的

function newTime(){
  console.log(11);
  return new Date().toLocaleTimeString();
}

function tick(){
  const element = (
    <div>
      <h1 style={{fontSize: 60}}>Hello!</h1>
      <p style={{color: 'red'}}>现在的时间：{newTime()}</p>
    </div>
  );

  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

tick();
setInterval(tick, 1000);