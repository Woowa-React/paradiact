const myApp = createElement(
  'div',
  {className: 'box'},
  createElement('h1', {id: 'title'}, '나의 미니 리액트 완성!'),
  createElement('p', null, '오늘 1일차와 2일차 목표를 달성했습니다.'),
  createElement(
    'ul',
    null,
    createElement('li', null, 'Virtual DOM 설계'),
    createElement('li', null, 'Recursive Rendering 구현')
  )
);

// 2. 실제 화면에 그리기
const rootElement = document.getElementById('root');
render(myApp, rootElement);

// 3. 성공 확인 콘솔
console.log('렌더링이 완료되었습니다!');
