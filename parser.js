const createTextElement = (text) => {
  return {
    type: 'TEXT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
};

const createElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children: children.flat().map((child) => (typeof child === 'object' ? child : createTextElement(child))),
    },
  };
};

// ---------------------------------------------------------
// 테스트 실행 함수
// ---------------------------------------------------------
function assert(description, condition) {
  if (condition) {
    console.log(`✅ [PASS] ${description}`);
  } else {
    console.error(`❌ [FAIL] ${description}`);
  }
}

console.log('--- 1일차: createElement 테스트 시작 ---');

// Case 1: 가장 기본적인 엘리먼트 생성
const simpleEl = createElement('div', {id: 'test'}, '안녕');
assert('텍스트 자식이 객체(TEXT)로 자동 변환되는가?', simpleEl.props.children[0].type === 'TEXT');
assert('속성이 제대로 주입되었는가?', simpleEl.props.id === 'test');

// Case 2: 중첩된 엘리먼트 생성
const nestedEl = createElement('ul', null, createElement('li', null, '1번'), createElement('li', null, '2번'));
assert('자식 엘리먼트가 2개 생성되었는가?', nestedEl.props.children.length === 2);
assert('자식의 자식 텍스트가 정상인가?', nestedEl.props.children[0].props.children[0].props.nodeValue === '1번');

// Case 3: 배열로 자식을 넘겼을 때 (평탄화 테스트)
const list = ['A', 'B'];
const arrayEl = createElement(
  'div',
  null,
  list.map((item) => createElement('span', null, item))
);
assert('배열을 넘겨도 2개의 자식이 생기는가? (flat 테스트)', arrayEl.props.children.length === 2);

console.log('--- 테스트 종료 ---');

// 구조가 궁금할 땐 다시 console.dir!
console.dir(nestedEl, {depth: null});
