import Playground from './playground';
import MarkupElement from './markupElement';
import cards from '../data/data';

class App extends MarkupElement {
  constructor(parent) {
    super(parent, 'main');
    this.playground = new Playground(this.node, cards[0]);
    this.words = [];
  }

  initLocalStorage() {
    for (let i = 1; i < cards.length; i += 1) {
      cards[i].forEach((obj) => this.words.push(obj.word));
    }
    this.words.forEach((word) => {
      if (localStorage.getItem(word) === null) {
        localStorage[word] = JSON.stringify({
          trained: 0,
          correct: 0,
          incorrect: 0,
        });
      }
    });
  }
}

export default App;
