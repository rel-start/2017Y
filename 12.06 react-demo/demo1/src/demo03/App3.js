import React from 'react';
import ReactDOM from 'react-dom';

function tick(){
  const el = (
    <div>
      <h1 style={{fontSize: 60}}>hello</h1>
      <p style={{color: 'blue', fontSize: 40}}>累加：{acc()}</p>
    </div>
  );

  ReactDOM.render(
    el,
    document.getElementById('root')
  );
}

acc.num = 1;
function acc(){
  return acc.num++;
}

tick();
setInterval(tick, 1000);