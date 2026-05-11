// 2일차 (5/11)

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

function render(reactElement, root) {
  root.appendChild(createDomTree(reactElement));
}
