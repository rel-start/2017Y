import React from 'react';
import ReactDOM from 'react-dom';

const show = {
  display: 'block'
};

const hide = {
  display: 'none'
};

function tick() {
  const ele = (
    <div>
      {shans()}
    </div>
  );



  ReactDOM.render(
    ele,
    document.getElementById('root')
  );
}

function shans() {
  shans.off = !shans.off;

  if (shans.off) {
    return <p style={Object.assign({ color: '#fff', width: 50, height: 20, backgroundColor: 'red' }, show)}>ddd</p>;
  }
  return <p style={Object.assign({ color: '#fff', width: 50, height: 20, backgroundColor: 'red' }, hide)}>ddd</p>;
}

tick();
setInterval(tick, 500);