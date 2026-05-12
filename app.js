const firstApp = createElement(
  'div',
  {className: 'box'},
  createElement('h1', {id: 'title'}, '안녕'),
  createElement('p', null, '첫 번째 렌더링입니다.'),
  createElement(
    'ul',
    null,
    createElement('li', null, 'Virtual DOM 설계'),
    createElement('li', null, 'Recursive Rendering 구현'),
    createElement('li', null, 'Reconciliation 준비')
  )
);

const secondApp = createElement(
  'div',
  {className: 'box'},
  createElement('h1', {id: 'title'}, '반가워'),
  createElement('p', null, '두 번째 렌더링입니다.'),
  createElement(
    'ul',
    null,
    createElement('li', null, 'Virtual DOM 설계'),
    createElement('li', null, 'Recursive Rendering 구현'),
    createElement('li', null, 'Reconciliation 준비 완료')
  )
);

const rootElement = document.getElementById('root');
render(firstApp, rootElement);

console.log('첫 번째 렌더링이 완료되었습니다!', rootElement._prevVNode);

setTimeout(() => {
  render(secondApp, rootElement);
  console.log('두 번째 렌더링이 완료되었습니다!', rootElement._prevVNode);
}, 2000);
