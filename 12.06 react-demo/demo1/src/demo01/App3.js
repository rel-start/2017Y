import React from 'react';
import ReactDOM from 'react-dom';

const el = <h1>app3</h1>

ReactDOM.render(
  el,
  document.getElementById('box'),
  function (){ alert(1) }
);

// render(nextElement, container, callback) { }