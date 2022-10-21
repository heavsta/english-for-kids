import cards from '../data/data';
import global from '../data/global';
import Card from './card';
import CategoryCard from './categoryCard';
import MarkupElement from './markupElement';

class Playground extends MarkupElement {
  constructor() {
    super(document.querySelector('main'), 'div', 'playground');
    this.title = new MarkupElement(
      this.node,
      'h1',
      'page-title',
      'English for Kids',
    );
    this.cards = cards;
  }

  renderHomeCards() {
    this.cards[0].forEach(
      (category, index) => new CategoryCard(this.node, category, index + 1),
    );
  }

  renderCategoryCards(i) {
    this.title.node.innerText = this.cards[0][i - 1];
    this.cards[i].forEach(
      (card, index) => new Card(this.node, card, index, cards[0][i - 1]),
    );
    if (global.playMode) {
      const popup = document.querySelector('.popup');
      if (popup) popup.classList.remove('hide');
    }
  }

  renderDifficultCards(deck) {
    deck.forEach(
      (card, index) => new Card(this.node, card, index, card.category),
    );
    if (global.playMode) {
      const popup = document.querySelector('.popup');
      if (popup) popup.classList.remove('hide');
    }
  }
}

export default Playground;
