import global from '../data/global';
import MarkupElement from './markupElement';

class Popup extends MarkupElement {
  constructor(parent, cancelGame, initGame) {
    super(parent, 'div', `popup ${global.selectedId === 0 ? 'hide' : ''}`);
    this.content = new MarkupElement(this.node, 'div', 'popup-content');
    this.confirmBtn = new MarkupElement(
      this.content.node,
      'button',
      'confirm-btn',
      '',
    );
    this.confirmBtn.node.onclick = () => initGame();
    this.triangle = new MarkupElement(this.confirmBtn.node, 'div', 'triangle');
    this.message = new MarkupElement(
      this.confirmBtn.node,
      'div',
      'confirm-legend',
      'START THE GAME',
    );
    this.cancelBtn = new MarkupElement(
      this.content.node,
      'button',
      'cancel-btn',
      '',
    );
    this.cancelBtn.node.onclick = () => cancelGame();
  }
}

export default Popup;
