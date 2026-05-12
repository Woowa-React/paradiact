function createNode({type, props}) {
  const dom = type === 'TEXT' ? document.createTextNode('') : document.createElement(type);

  Object.keys(props).forEach((key) => {
    if (key !== 'children') {
      dom[key] = props[key];
    }
  });

  return dom;
}

function createDomTree(reactElement) {
  const dom = createNode(reactElement);

  reactElement.props.children.forEach((child) => {
    dom.appendChild(createDomTree(child));
  });

  return dom;
}

function mount(reactElement, root) {
  root.appendChild(createDomTree(reactElement));
}

function render(newVNode, container) {
  const oldVNode = container._prevVNode;

  if (!oldVNode) {
    // 최초 reder 시에만 실행
    mount(newVNode, container);
  } else {
    // 2 번째부터는 항상 이 분기로 들어와서 patch 실행
    // patch(container, oldVNode, newVNode);
    console.log('비교를 시작합니다!', oldVNode, 'vs', newVNode);
  }

  container._prevVNode = newVNode;
}
