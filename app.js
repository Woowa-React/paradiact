const rootElement = document.getElementById('root');

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

const textUpdatedApp = createElement(
  'div',
  {className: 'box'},
  createElement('h1', {id: 'title'}, '반가워'),
  createElement('p', null, 'TEXT_UPDATE 테스트입니다.'),
  createElement(
    'ul',
    null,
    createElement('li', null, 'Virtual DOM 설계'),
    createElement('li', null, 'Recursive Rendering 구현'),
    createElement('li', null, 'Reconciliation 준비')
  )
);

const insertedApp = createElement(
  'div',
  {className: 'box'},
  createElement('h1', {id: 'title'}, '반가워'),
  createElement('p', null, 'INSERT 테스트입니다.'),
  createElement(
    'ul',
    null,
    createElement('li', null, 'Virtual DOM 설계'),
    createElement('li', null, 'Recursive Rendering 구현'),
    createElement('li', null, 'Reconciliation 준비'),
    createElement('li', null, '새 항목 추가')
  )
);

const replacedApp = createElement(
  'div',
  {className: 'box'},
  createElement('h1', {id: 'title'}, '반가워'),
  createElement('strong', null, 'REPLACE 테스트입니다.'),
  createElement(
    'ul',
    null,
    createElement('li', null, 'Virtual DOM 설계'),
    createElement('li', null, 'Recursive Rendering 구현'),
    createElement('li', null, 'Reconciliation 준비'),
    createElement('li', null, '새 항목 추가')
  )
);

const removedApp = createElement(
  'div',
  {className: 'box'},
  createElement('h1', {id: 'title'}, '반가워'),
  createElement('strong', null, 'REMOVE 테스트입니다.'),
  createElement(
    'ul',
    null,
    createElement('li', null, 'Virtual DOM 설계'),
    createElement('li', null, 'Recursive Rendering 구현'),
    createElement('li', null, 'Reconciliation 준비')
  )
);

function testRender(message, vnode) {
  render(vnode, rootElement);
  console.log(message, rootElement._prevVNode);
}

testRender('1. 최초 렌더링: mount', firstApp);

setTimeout(() => {
  testRender('2. 텍스트 변경: TEXT_UPDATE', textUpdatedApp);
}, 2000);

setTimeout(() => {
  testRender('3. 자식 추가: INSERT', insertedApp);
}, 4000);

setTimeout(() => {
  testRender('4. 태그 변경: REPLACE', replacedApp);
}, 6000);

setTimeout(() => {
  testRender('5. 자식 제거: REMOVE', removedApp);
}, 8000);
