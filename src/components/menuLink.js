import Playground from './playground';
import MarkupElement from './markupElement';
import global from '../data/global';

class MenuLink extends MarkupElement {
  constructor(parent, category, categoryId, test) {
    super(parent, 'div', `${categoryId === 0 ? 'main-link' : 'menu-link'}`);
    this.name = new MarkupElement(this.node, 'div', '', category);
    if (categoryId > 0) {
      this.icon = document.createElement('img');
      this.icon.setAttribute('src', `./assets/img/${category}.svg`);
      this.icon.setAttribute('alt', category);
      this.icon.classList.add('menu-icon');
      this.node.insertBefore(this.icon, this.node.firstChild);
    }
    this.id = categoryId;
    this.node.onclick = () => this.handleClick();
    this.togglePlayMode = test;
  }

  handleClick() {
    global.selectedId = this.id;
    if (global.playMode && global.gameArr.length > 0) {
      this.togglePlayMode();
    }
    if (document.querySelector('.active-link') !== null) {
      document.querySelector('.active-link').classList.remove('active-link');
    }
    if (this.id > 0) {
      // prettier-ignore
      document.querySelectorAll('.menu-link')[this.id - 1].classList.add('active-link');
    }
    document.querySelector('main').innerHTML = '';
    document.querySelector('nav').classList.toggle('show');
    document.querySelector('.menu-btn').classList.toggle('close');

    const home = new Playground();

    return this.id === 0
      ? home.renderHomeCards()
      : home.renderCategoryCards(this.id);
  }
}

export default MenuLink;
