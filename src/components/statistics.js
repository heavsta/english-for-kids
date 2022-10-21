/* eslint-disable no-new */
import cards from '../data/data';
import MarkupElement from './markupElement';
import Playground from './playground';
import helpers from './helpers';
import global from '../data/global';

const theads = [
  'N° ',
  'Word ',
  'Translation ',
  'Category ',
  'Trained ',
  'Correct ',
  'Incorrect ',
  '% ',
];

class Statistics extends MarkupElement {
  constructor(parent) {
    super(parent, 'div', 'statistics');
    this.resetBtn = new MarkupElement(
      this.node,
      'button',
      'reset-btn',
      'RESET',
    );
    this.resetBtn.node.onclick = () => this.reset();
    this.reviewBtn = new MarkupElement(
      this.node,
      'button',
      'review-btn',
      'Repeat difficult words',
    );
    this.reviewBtn.node.onclick = () => this.reviewHardWords();
    this.reviewIcon = new MarkupElement(
      this.reviewBtn.node,
      'img',
      'review-icon',
    );
    this.reviewIcon.node.setAttribute('src', './assets/img/dumbbell.png');
    this.reviewIcon.node.setAttribute('alt', 'dumbbell');
    this.tableDiv = new MarkupElement(this.node, 'div', 'table-container');
    this.table = new MarkupElement(this.tableDiv.node, 'table');
    this.header = this.generateHeader();
    this.rows = this.generateRows();
  }

  generateHeader() {
    const header = new MarkupElement(this.table.node, 'tr', 'table-header');
    theads.forEach((title, index) => {
      const head = new MarkupElement(
        header.node,
        'th',
        `${index === 0 ? 'desc' : ''}`,
        title,
      );
      head.node.onclick = (e) => this.sortTable(e.target, index);
    });
  }

  generateRows() {
    this.data = [];
    let num = 1;
    cards[0].forEach((category, i) => {
      cards[i + 1].forEach((card) => {
        const trained = +JSON.parse(localStorage[card.word]).trained;
        const correct = +JSON.parse(localStorage[card.word]).correct;
        const incorrect = +JSON.parse(localStorage[card.word]).incorrect;
        const percentage = helpers.percentage(correct, incorrect);
        const row = new MarkupElement(this.table.node, 'tr', 'row');
        new MarkupElement(row.node, 'td', 'cell', num);
        new MarkupElement(row.node, 'td', 'cell', card.word);
        new MarkupElement(row.node, 'td', 'cell', card.translation);
        new MarkupElement(row.node, 'td', 'cell', category);
        new MarkupElement(row.node, 'td', 'cell', trained);
        new MarkupElement(row.node, 'td', 'cell', correct);
        new MarkupElement(row.node, 'td', 'cell', incorrect);
        new MarkupElement(row.node, 'td', 'cell', `${percentage}%`);
        num += 1;
        // Storing words in arr
        this.data.push({
          word: card.word,
          translation: card.translation,
          image: card.image,
          audioSrc: card.audioSrc,
          category,
          trained,
          correct,
          incorrect,
          percentage,
        });
      });
    });
  }

  reset() {
    for (let i = 0; i < localStorage.length; i += 1) {
      localStorage.setItem(
        localStorage.key(i),
        JSON.stringify({
          trained: 0,
          correct: 0,
          incorrect: 0,
        }),
      );
    }

    // UI
    document.querySelectorAll('tr').forEach((row) => row.remove());
    this.generateHeader();
    this.generateRows();
  }

  reviewHardWords() {
    const hardWords = this.data
      .filter((word) => word.incorrect > 0)
      .sort((a, b) => a.percentage - b.percentage);

    // eslint-disable-next-line no-unused-expressions
    hardWords.length > 8
      ? (this.hardWords = hardWords.splice(0, 8))
      : (this.hardWords = hardWords);

    // Init REPEAT DIFFICULT WORDS
    global.selectedId = null;
    global.gameArr = this.hardWords;
    document.querySelector('main').innerHTML = '';
    const pg = new Playground();
    if (this.hardWords.length > 0) {
      document.querySelector('h1').innerText = 'Challenge Time!';
      pg.renderDifficultCards(this.hardWords);
    } else {
      document.querySelector('h1').innerText = 'No hard words found!';
    }
  }

  sortTable(th, n) {
    this.tableEl = document.querySelector('table');
    let rows;
    let i;
    let x;
    let y;
    let shouldSwitch;
    let dir = 'asc';
    let switching = true;
    let switchcount = 0;

    // Styling
    const heads = [...document.querySelectorAll('th')];
    heads.splice(n, 1);
    heads.forEach((head) => {
      head.classList.remove('asc');
      head.classList.remove('desc');
    });
    if (th.classList.contains('desc')) {
      th.classList.remove('desc');
      th.classList.add('asc');
    } else {
      th.classList.add('desc');
      th.classList.remove('asc');
    }

    // Sorting Logic
    while (switching) {
      switching = false;
      rows = this.tableEl.rows;

      for (i = 1; i < rows.length - 1; i += 1) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName('td')[n];
        y = rows[i + 1].getElementsByTagName('td')[n];

        if (dir === 'asc' && [1, 2, 3].includes(n)) {
          if (x.textContent.toLowerCase() > y.textContent.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        } else if (dir === 'desc' && [1, 2, 3].includes(n)) {
          if (x.textContent.toLowerCase() < y.textContent.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        } else if (dir === 'asc' && [0, 4, 5, 6, 7].includes(n)) {
          // prettier-ignore
          if (Number.parseInt(x.textContent, 10) > Number.parseInt(y.textContent, 10)) {
            shouldSwitch = true;
            break;
          }
        } else if (dir === 'desc' && [0, 4, 5, 6, 7].includes(n)) {
          // prettier-ignore
          if (Number.parseInt(x.textContent, 10) < Number.parseInt(y.textContent, 10)) {
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        switchcount += 1;
      } else if (switchcount === 0 && dir === 'asc') {
        dir = 'desc';
        switching = true;
      }
    }
  }
}

export default Statistics;
