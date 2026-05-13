/* exported createElement, render */

const PATCH_TYPE = {
  INSERT: 'INSERT',
  REMOVE: 'REMOVE',
  REPLACE: 'REPLACE',
  TEXT_UPDATE: 'TEXT_UPDATE',
};

function createTextElement(text) {
  return {
    type: 'TEXT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

/**
 * JSX를 객체(Virtual DOM)로 변환하는 함수
 * @param {string|Function} type - 태그 이름 또는 컴포넌트 함수
 * @param {Object|null} props - 속성 객체
 * @param {...any} children - 자식 요소들
 */
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...(props || {}),
      children: children
        .flat()
        .map((child) => (typeof child === 'object' && child !== null ? child : createTextElement(child))),
    },
  };
}

// VNode를 받아 실제 DOM 트리를 생성하는 함수
function createDomTree(vNode) {
  const dom =
    vNode.type === 'TEXT' ? document.createTextNode(vNode.props.nodeValue) : document.createElement(vNode.type);

  // VNode가 자신과 연결된 실제 DOM을 기억하게 함
  vNode.dom = dom;

  // children을 제외한 props를 실제 DOM에 반영
  Object.keys(vNode.props)
    .filter((key) => key !== 'children')
    .forEach((key) => {
      dom[key] = vNode.props[key];
    });

  // 자식 VNode들도 실제 DOM으로 만들어서 붙임
  vNode.props.children.forEach((child) => {
    dom.appendChild(createDomTree(child));
  });

  return dom;
}

// 최초 렌더링: 만든 DOM 트리를 container에 붙임
function mount(vNode, container) {
  container.appendChild(createDomTree(vNode));
}

// 이전 VNode와 새로운 VNode를 비교해서 변경사항 목록을 만듦
function diff(parentDom, oldVNode, newVNode, patches = []) {
  // 이전 노드는 없고 새 노드만 있으면 추가
  if (!oldVNode) {
    patches.push({
      type: PATCH_TYPE.INSERT,
      parentDom,
      newVNode,
    });

    return patches;
  }

  // 이전 노드는 있고 새 노드가 없으면 삭제
  if (!newVNode) {
    patches.push({
      type: PATCH_TYPE.REMOVE,
      parentDom,
      dom: oldVNode.dom,
    });

    return patches;
  }

  // 타입이 다르면 통째로 교체
  if (oldVNode.type !== newVNode.type) {
    patches.push({
      type: PATCH_TYPE.REPLACE,
      parentDom,
      oldDom: oldVNode.dom,
      newVNode,
    });

    return patches;
  }

  // 타입이 같으면 실제 DOM은 재사용
  newVNode.dom = oldVNode.dom;

  // 텍스트 노드라면 텍스트 내용만 비교
  if (newVNode.type === 'TEXT') {
    if (oldVNode.props.nodeValue !== newVNode.props.nodeValue) {
      patches.push({
        type: PATCH_TYPE.TEXT_UPDATE,
        dom: oldVNode.dom,
        value: newVNode.props.nodeValue,
      });
    }

    return patches;
  }

  // 일반 태그라면 자식들을 순서대로 비교
  const oldChildren = oldVNode.props.children;
  const newChildren = newVNode.props.children;
  const maxLength = Math.max(oldChildren.length, newChildren.length);

  for (let i = 0; i < maxLength; i += 1) {
    diff(newVNode.dom, oldChildren[i], newChildren[i], patches);
  }

  return patches;
}

// diff가 만든 변경사항을 실제 DOM에 적용
function patch(patches) {
  patches.forEach((currentPatch) => {
    if (currentPatch.type === PATCH_TYPE.TEXT_UPDATE) {
      currentPatch.dom.nodeValue = currentPatch.value;
    }

    if (currentPatch.type === PATCH_TYPE.INSERT) {
      const newDom = createDomTree(currentPatch.newVNode);

      currentPatch.parentDom.appendChild(newDom);
    }

    if (currentPatch.type === PATCH_TYPE.REMOVE) {
      currentPatch.parentDom.removeChild(currentPatch.dom);
    }

    if (currentPatch.type === PATCH_TYPE.REPLACE) {
      const newDom = createDomTree(currentPatch.newVNode);

      currentPatch.parentDom.replaceChild(newDom, currentPatch.oldDom);
    }
  });
}

function render(newVNode, container) {
  const oldVNode = container._prevVNode;

  if (!oldVNode) {
    mount(newVNode, container);
  } else {
    const patches = diff(container, oldVNode, newVNode);

    console.log('patches', patches);

    patch(patches);
  }

  container._prevVNode = newVNode;
}

// 테스트 코드

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

function testRender(message, vNode) {
  render(vNode, rootElement);
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
