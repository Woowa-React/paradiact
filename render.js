const PATCH_TYPE = {
  INSERT: 'INSERT',
  REMOVE: 'REMOVE',
  REPLACE: 'REPLACE',
  TEXT_UPDATE: 'TEXT_UPDATE',
};

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
    mount(newVNode, container);
  } else {
    const patches = diff(container, oldVNode, newVNode);
    commit(patches);
  }

  container._prevVNode = newVNode;
}

function diff(parentDom, oldVNode, newVNode, index = 0, patches = []) {
  const currentDom = parentDom.childNodes[index];

  if (!oldVNode) {
    patches.push({
      type: PATCH_TYPE.INSERT,
      parentDom,
      newVNode,
      index,
    });

    return patches;
  }

  if (!newVNode) {
    patches.push({
      type: PATCH_TYPE.REMOVE,
      parentDom,
      dom: currentDom,
    });

    return patches;
  }

  if (oldVNode.type !== newVNode.type) {
    patches.push({
      type: PATCH_TYPE.REPLACE,
      parentDom,
      oldDom: currentDom,
      newVNode,
    });

    return patches;
  }

  if (newVNode.type === 'TEXT') {
    if (oldVNode.props.nodeValue !== newVNode.props.nodeValue) {
      patches.push({
        type: PATCH_TYPE.TEXT_UPDATE,
        dom: currentDom,
        value: newVNode.props.nodeValue,
      });
    }

    return patches;
  }

  const maxLength = Math.max(oldVNode.props.children.length, newVNode.props.children.length);

  for (let i = 0; i < maxLength; i++) {
    diff(currentDom, oldVNode.props.children[i], newVNode.props.children[i], i, patches);
  }

  return patches;
}

function commit(patches) {
  patches.forEach((patch) => {
    if (patch.type === PATCH_TYPE.TEXT_UPDATE) {
      patch.dom.nodeValue = patch.value;
    }

    if (patch.type === PATCH_TYPE.INSERT) {
      const newDom = createDomTree(patch.newVNode);
      const nextDom = patch.parentDom.childNodes[patch.index];

      if (nextDom) {
        patch.parentDom.insertBefore(newDom, nextDom);
      } else {
        patch.parentDom.appendChild(newDom);
      }
    }

    if (patch.type === PATCH_TYPE.REMOVE) {
      patch.parentDom.removeChild(patch.dom);
    }

    if (patch.type === PATCH_TYPE.REPLACE) {
      patch.parentDom.replaceChild(createDomTree(patch.newVNode), patch.oldDom);
    }
  });
}
