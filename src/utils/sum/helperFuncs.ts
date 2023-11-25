export const appendChildern = (parent:HTMLElement, ...children:HTMLElement[]) => {
  for (const child of children) {
    parent.appendChild(child);
  }
};

export const createElement = (type = 'div', cssClass = '', jsonIdentifierClass = ''): HTMLElement => {
  const element = document.createElement(type);
  element.className = cssClass;
  if (jsonIdentifierClass.length) element.classList.add(jsonIdentifierClass);
  return element;
};
