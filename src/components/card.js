import MarkupElement from './markupElement';
import global from '../data/global';
import Menu from './menu';
import App from './app';

class Card extends MarkupElement {
  flipped = false;

  constructor(parent, cardData, index, categoryName) {
    super(parent, 'div', `card game-card ${categoryName.toLowerCase()}`);
    this.id = index;
    this.LSKey = cardData.word;
    this.word = cardData.word;
    this.translation = cardData.translation;

    // Front-Side
    this.frontSide = new MarkupElement(this.node, 'div', 'front');
    this.frontGradient = new MarkupElement(
      this.frontSide.node,
      'div',
      'gradient',
    );
    this.frontImg = new MarkupElement(
      this.frontGradient.node,
      'div',
      `word-img ${global.playMode ? 'full' : ''}`,
    );
    this.frontImg.node.style.backgroundImage = `url(./assets/${cardData.image})`;
    this.legend = new MarkupElement(this.frontSide.node, 'div', 'card-legend');
    if (global.playMode) this.legend.node.classList.add('hide');
    this.wordEl = new MarkupElement(
      this.legend.node,
      'h2',
      'word',
      this.word.charAt(0).toUpperCase() + this.word.slice(1),
    );
    this.rotateBtn = new MarkupElement(this.legend.node, 'div', 'rotate');
    this.rotateImg = new MarkupElement(
      this.rotateBtn.node,
      'img',
      'rotate-img',
    );
    this.rotateImg.node.setAttribute('src', './assets/img/rotate.svg');

    // Back-Side
    this.backSide = new MarkupElement(this.node, 'div', 'back');
    this.backGradient = new MarkupElement(
      this.backSide.node,
      'div',
      'gradient',
    );
    this.backImg = new MarkupElement(this.backGradient.node, 'div', 'word-img');
    this.backImg.node.style.backgroundImage = `url(./assets/${cardData.image})`;
    this.translationEl = new MarkupElement(
      this.backSide.node,
      'h2',
      'translation',
      this.translation.charAt(0).toUpperCase() + this.translation.slice(1),
    );

    // Audio
    this.audio = new Audio(`./assets/${cardData.audioSrc}`);

    // Events
    this.frontSide.node.onclick = (e) => this.handleClick(e);
    this.node.onmouseleave = () => this.flipBack();
  }

  flipBack() {
    if (this.flipped) {
      this.flipped = false;
      this.rotate();
    }
  }

  handleClick(e) {
    // Training Mode
    if (!global.playMode) {
      if (this.rotateImg.node.contains(e.target)) {
        this.flipped = true;
        this.rotate();
      } else {
        this.audio.play();
        // Local Storage
        const obj = JSON.parse(localStorage.getItem(this.LSKey));
        obj.trained += 1;
        localStorage.setItem(this.LSKey, JSON.stringify(obj));
      }
    }
    // Game Mode
    if (global.playMode) {
      if (global.gameArr[global.currentIndex].word === this.word) {
        new Audio('./assets/audio/correct.mp3').play();
        const heart = document.createElement('div');
        heart.classList.add('heart-win');
        document
          .querySelector('.health-meter')
          .insertBefore(
            heart,
            document.querySelector('.health-meter').firstChild,
          );
        this.clone = this.node.cloneNode(true);
        this.node.parentNode.replaceChild(this.clone, this.node);
        this.clone.classList.add('blur');
        global.currentIndex += 1;
        // Local Storage
        const obj = JSON.parse(localStorage.getItem(this.LSKey));
        obj.correct += 1;
        localStorage.setItem(this.LSKey, JSON.stringify(obj));

        if (global.currentIndex < global.gameArr.length) {
          setTimeout(() => {
            new Audio(
              `./assets/${global.gameArr[global.currentIndex].audioSrc}`,
            ).play();
          }, 700);
        } else {
          setTimeout(() => {
            const main = document.querySelector('main');
            if (document.querySelector('.heart-lose') === null) {
              main.innerHTML = '';
              // eslint-disable-next-line no-new
              new MarkupElement(main, 'div', 'success');
              new Audio('./assets/audio/success.mp3').play();
            } else {
              const fails = document.querySelectorAll('.heart-lose').length;
              main.innerHTML = '';
              const failureImg = new MarkupElement(main, 'div', 'failure');
              // eslint-disable-next-line no-new
              new MarkupElement(
                failureImg.node,
                'div',
                'mistakes',
                `${fails} Mistake(s)!`,
              );
              new Audio('./assets/audio/failure.mp3').play();
            }
          }, 1000);
          setTimeout(() => {
            global.playMode = false;
            global.selectedId = 0;
            global.currentIndex = 0;
            global.gameArr = [];
            document.body.innerHTML = '';
            const menu = new Menu(document.body);
            menu.render();
            const app = new App(document.body);
            app.playground.renderHomeCards();
          }, 5000);
        }
      } else {
        new Audio('./assets/audio/error.mp3').play();
        const heart = document.createElement('div');
        heart.classList.add('heart-lose');
        document
          .querySelector('.health-meter')
          .insertBefore(
            heart,
            document.querySelector('.health-meter').firstChild,
          );
        // Local Storage
        const obj = JSON.parse(localStorage.getItem(this.LSKey));
        obj.incorrect += 1;
        localStorage.setItem(this.LSKey, JSON.stringify(obj));
      }
    }
  }

  rotate() {
    this.node.classList.toggle('rotate');
    this.node.childNodes.forEach((child) => child.classList.toggle('rotate'));
  }
}

export default Card;
