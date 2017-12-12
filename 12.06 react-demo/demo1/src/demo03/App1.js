import React from 'react';
import reactdom from 'react-dom';

// React 使用的是 Vitual Dom，当页面元素某个
function tick(){
  const element = (
    <div>
      <h1 style={{fontSize: 60}}>hello2</h1>
      <p style={{fontSize: 40}}>现在的时间：{new Date().toLocaleTimeString()}</p>
    </div>
  );

  reactdom.render(
    element,
    document.getElementById('root')
  );
}

tick();

setInterval(tick, 1000);