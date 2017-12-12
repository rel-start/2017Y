/**
 * redux 核心的概念：
 *  - stroe (部门)
 *  - reducer (经理)
 *  - dispatch (请求)
 *  - subscribe (监听处理结果)
 *  - getState (查询结果)
 * 
 * redux 是用来做状态管理的
 */



import { createStore } from 'redux';

// 2.定义 action (动作)
var INCREMENT = 'INCREMENT';
var DECREMENT = 'DECREMENT';

// 1.新建一个store
const reducer = (state = 0, action) => {
  if (action.type === INCREMENT) return state + 1;
  if (action.type === DECREMENT) return state - 1;

  return state;
};

const store = createStore(reducer);

const add = document.querySelector('.add');
const cut = document.querySelector('.cut');
const num = document.querySelector('.num');

add.onclick = () => (
  store.dispatch({type: INCREMENT})
);

cut.onclick = () => (
  store.dispatch({type: DECREMENT})
);

store.subscribe(() => (
  num.innerHTML = store.getState()
));