// 1일차 (5/11)
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
