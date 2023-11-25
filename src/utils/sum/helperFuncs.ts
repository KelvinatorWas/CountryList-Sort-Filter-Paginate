export const appendChildern = (parent:HTMLElement, ...children:HTMLElement[]) => {
  for (const child of children) {
    parent.appendChild(child);
  }
};

export const createElement = (type = 'div', cssClass = '', jsonIdentifierClass = '', id = ''): HTMLElement => {
  const element = document.createElement(type);

  if (cssClass.length) element.className = cssClass;
  if (jsonIdentifierClass.length) element.classList.add(jsonIdentifierClass);
  if (id.length) element.id = id;

  return element;
};
