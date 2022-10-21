class MarkupElement {
  node = null;

  constructor(parent, tag = 'div', className = '', content = '') {
    const element = document.createElement(tag);
    element.classList = className;
    element.textContent = content;
    parent.append(element);
    this.node = element;
  }

  selfRemove() {
    this.node.remove();
  }

  removeParent() {
    this.node.parentNode.remove();
  }
}

export default MarkupElement;
