function _createElement(type, props, ...children) {
  return { type, props, children };
}

function createElement(node) {
  if (typeof node === 'string') return document.createTextNode(node);

  const _el = document.createElement(node.type);

  if (node.props) {
    for (let type in node.props) {
      _el[type] = node.props[type];
    }
  }

  node.children
    .map(createElement)
    .forEach(_el.appendChild.bind(_el));

  return _el;
}

function diff(node1, node2) {
  return typeof node1 !== typeof node2 || node1.type !== node2.type || typeof node1 === 'string' && node1 !== node2;
}

function virtualDom(_parent, newNode, oldNode, key = 0) {
  if (!oldNode) {
    _parent.appendChild(
      createElement(newNode)
    );
    return true;
  }
  if (!newNode) {
    _parent.removeChild(
      _parent.childNodes[key]
    );
    return true;
  }
  if (diff(newNode, oldNode)) {
    _parent.replaceChild(
      createElement(newNode),
      _parent.childNodes[key]
    );
    return true;
  }
  
  debugger;
  if (newNode.type) {
    const newLen = newNode.children.length;
    const oldLen = oldNode.children.length;

    for (let i = 0; i < Math.max(newLen, oldLen); i++) {
      virtualDom(
        _parent.childNodes[key],
        newNode.children[i],
        oldNode.children[i],
        i
      );
    }

    return true;
  }
  return false; // 文本节点会走这里
}




// -------------------------------------------------
// 实现
const root = document.getElementById('root');

let current = null, old = null;

function tick() {
  current = (
    _createElement(
      'div',
      { className: 'content' },
      _createElement('h1', null, 'Hello'),
      _createElement('p', null, 'Content 1 ', new Date().toLocaleTimeString()),
      _createElement('p', null, 'Content 2')
    )
  );

  virtualDom(root, current, old);

  old = current;
}

tick();

setInterval(tick, 1000);


























