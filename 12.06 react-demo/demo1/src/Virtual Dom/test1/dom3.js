function ce(type, props, ...children) {
  return { type, props, children };
}

const ele = (
  ce(
    'div',
    { className: 'content' },
    ce('h1', null, 'Hello'),
    ce('p', null, 'Content 1'),
    ce('p', null, 'Content 2')
  )
);

function createElement(node) {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }

  const _el = document.createElement(node.type);

  if (node.props) {
    for (let type in node.props) {
      _el[type] = node.props[type];
    }
  }

  // debugger;
  // 用于在父节点里面追加子节点
  // console.log(node.children.map(createElement));
  // node.children.map(createElement).forEach(item => {
  //   _el.appendChild(item)
  // });

  node.children
    .map(createElement)
    .forEach(_el.appendChild.bind(_el));

  return _el;
}

const root = document.getElementById('root');
root.appendChild(createElement(ele));


list.querySelectorAll('li').forEach(list.removeChild.bind(list));
// list.querySelectorAll('li').forEach(list2.removeChild.bind(list2));  // 出错

// ------------------------------------------

var numbers = [1, 4, 9];
var roots = numbers.map(Math.sqrt).forEach(aa);
// console.log(roots);


function aa(aa){
  console.log(aa);
}