import React from 'react';
import ReactDOM from 'react-dom';

import './App.css';

function tick() {
  tick.off = !tick.off;

  const ele = (
    <div>
      <h1 style={{fontSize: 30}}>切换class</h1>
      <p className={tick.off ? 'show' : 'hide'} style={{ color: '#fff', width: 50, height: 20, backgroundColor: 'red' }}>ddd</p>
    </div>
  );

  ReactDOM.render(
    ele,
    document.getElementById('root')
  );
}


tick();
setInterval(tick, 500);