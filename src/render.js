const renderElem = ({ tagName, attrs, children }) => {
  const $el = document.createElement(tagName);

  // set attributes
  for (const [key, value] of Object.entries(attrs)) {
    $el.setAttribute(key, value);
  }

  // set children
  for (const child of children) {
    const $child = render(child);
    $el.appendChild($child);
  }

  return $el;
};

const render = (virtualNode) => {
  if (typeof virtualNode === "string") {
    return document.createTextNode(virtualNode);
  }

  return renderElem(virtualNode);
};

export default render;
