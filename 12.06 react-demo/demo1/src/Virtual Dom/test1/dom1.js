var ele = (
  <div className="content">
    <h1>Hello</h1>
    <p>Content 1</p>
    <p>Content 2</p>
  </div>
);

const eleJs = {
  type: 'div',
  props: {className: 'content'},
  children: [
    {
      type: 'h1',
      props: null,
      children: ['Hello']
    },
    {
      type: 'p',
      props: null,
      children: ['Content 1']
    },
    {
      type: 'p',
      props: null,
      children: ['Content 2']
    }
  ]
};

console.log(eleJs);