import cards from '../data/data';
import global from '../data/global';
import Card from './card';
import MarkupElement from './markupElement';

class CategoryCard extends MarkupElement {
  constructor(parent, categoryName, index) {
    super(parent, 'div', 'card home-card');
    this.parent = parent;
    this.id = index;
    this.name = categoryName;
    this.deck = cards[this.id];
    this.randCard = this.deck[Math.floor(Math.random() * this.deck.length)];

    this.gradient = new MarkupElement(this.node, 'div', 'gradient');
    this.img = new MarkupElement(this.gradient.node, 'div', 'word-img');
    this.img.node.style.backgroundImage = `url(./assets/${this.randCard.image})`;
    this.legend = new MarkupElement(this.node, 'div', 'card-legend');
    this.word = new MarkupElement(
      this.legend.node,
      'h2',
      'word',
      this.name.toUpperCase(),
    );

    this.node.onclick = () => this.handleClick();
  }

  handleClick() {
    this.parent.innerHTML = '';
    // eslint-disable-next-line no-new
    new MarkupElement(this.parent, 'h1', 'page-title', this.name);
    this.deck.forEach(
      (card, index) => new Card(this.parent, card, index, this.name),
    );
    if (global.playMode) {
      const popup = document.querySelector('.popup');
      if (popup) popup.classList.remove('hide');
    }
    global.selectedId = this.id;
    // Active Menu link
    if (document.querySelector('.active-link') !== null) {
      document.querySelector('.active-link').classList.remove('active-link');
    }
    // prettier-ignore
    document.querySelectorAll('.menu-link')[this.id - 1].classList.add('active-link');
  }
}

export default CategoryCard;
