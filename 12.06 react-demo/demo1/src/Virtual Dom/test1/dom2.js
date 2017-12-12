function ce(type, props, ...children){
  return {type, props, children};
}

const ele = (
  ce(
    'div',
    {className: 'content'},
    ce('h1', null, 'Hello'),
    ce('p', null, 'Content 1'),
    ce('p', null, 'Content 2')
  )
);

console.log(ele);