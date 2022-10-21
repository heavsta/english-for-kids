import cards from '../data/data';
import global from '../data/global';
import helpers from './helpers';
import MarkupElement from './markupElement';
import MenuLink from './menuLink';
import Popup from './popup';
import Statistics from './statistics';

class Menu extends MarkupElement {
  constructor(parent) {
    super(parent, 'header');
    this.links = ['Main page', ...cards[0]];
    this.menuBtn = new MarkupElement(this.node, 'div', 'menu-btn');
    for (let i = 1; i <= 3; i += 1) {
      const bar = new MarkupElement(this.menuBtn.node, 'div', 'bar');
      bar.node.id = `bar${i}`;
    }
    this.menuBtn.node.onclick = () => this.closeMenu();
    this.nav = new MarkupElement(this.node, 'nav', 'menu');
    this.buttons = new MarkupElement(this.node, 'div', 'menu-btns');
    this.switchBtn = new MarkupElement(this.buttons.node, 'div', 'switch-btn');
    this.trainBtn = new MarkupElement(
      this.switchBtn.node,
      'div',
      'train-btn active-mode',
      'TRAIN',
    );
    this.playBtn = new MarkupElement(
      this.switchBtn.node,
      'div',
      'play-btn',
      'PLAY',
    );
    this.switchBtn.node.onclick = () => this.togglePlayMode(true);
    this.statsBtn = new MarkupElement(
      this.buttons.node,
      'button',
      'stats-btn',
      'STATS',
    );
    this.statsBtn.node.onclick = () => {
      global.selectedId = 0;
      document.querySelector('main').innerHTML = '';
      if (document.querySelector('.active-link') !== null) {
        document.querySelector('.active-link').classList.remove('active-link');
      }
      // eslint-disable-next-line no-new
      new Statistics(document.querySelector('main'));
    };
  }

  closeMenu() {
    this.menuBtn.node.classList.toggle('close');
    this.nav.node.classList.toggle('show');
    // Body Event
    window.onclick = (e) => {
      // prettier-ignore
      if (this.menuBtn.node.classList.contains('close') && this.nav.node.classList.contains('show')) {
        if (!this.menuBtn.node.contains(e.target) && !this.nav.node.contains(e.target)) {
          this.closeMenu();
        }
      }
    };
  }

  render() {
    this.links.forEach((link, index) => {
      if (index === 1) {
        // eslint-disable-next-line no-new
        new MarkupElement(this.nav.node, 'div', 'menu-legend', 'Categories');
      }
      return new MenuLink(
        this.nav.node,
        link,
        index,
        this.togglePlayMode.bind(this),
      );
    });
  }

  togglePlayMode(setPopup = false) {
    // Update UI
    this.playBtn.node.classList.toggle('active-mode');
    this.trainBtn.node.classList.toggle('active-mode');
    document
      .querySelectorAll('.card-legend')
      .forEach((card) => card.classList.toggle('play'));
    const frontCards = document.querySelectorAll('.front');
    frontCards.forEach((front) => {
      front.querySelector('.card-legend').classList.toggle('hide');
      front.querySelector('.word-img').classList.toggle('full');
    });
    if (document.querySelector('.repeat-btn')) {
      document.querySelector('.repeat-btn').remove();
    }
    if (document.querySelector('.blur')) {
      document
        .querySelectorAll('.blur')
        .forEach((card) => card.classList.remove('blur'));
    }
    if (document.querySelector('.health-meter')) {
      document.querySelector('.health-meter').innerHTML = '';
    }
    // Popup
    if (document.querySelector('.popup') !== null) {
      document.querySelector('.popup').remove();
    }
    if (setPopup && !global.playMode) {
      this.popup = new Popup(
        document.body,
        this.cancelGame.bind(this),
        this.initGame.bind(this),
      );
    }
    // Toggle global var
    global.playMode = !global.playMode;
    global.currentIndex = 0;
  }

  cancelGame() {
    this.togglePlayMode();
    this.popup.selfRemove();
  }

  initGame() {
    this.popup.selfRemove();
    // GAME
    global.currentIndex = 0;
    // eslint-disable-next-line no-unused-expressions
    global.selectedId
      ? (global.gameArr = helpers.shuffleArray(cards[global.selectedId]))
      : (global.gameArr = helpers.shuffleArray(global.gameArr));
    new Audio(`./assets/${global.gameArr[0].audioSrc}`).play();
    // UI
    this.repeatBtn = new MarkupElement(
      document.querySelector('main'),
      'div',
      'repeat-btn',
    );
    this.repeatBtn.node.onclick = () => {
      new Audio(
        `./assets/${global.gameArr[global.currentIndex].audioSrc}`,
      ).play();
    };
    this.healthMeter = new MarkupElement(
      document.querySelector('main'),
      'div',
      'health-meter',
    );
  }
}

export default Menu;
