import App from './components/app';
import Menu from './components/menu';
import './styles/main.css';

const menu = new Menu(document.body);
menu.render();

const app = new App(document.body);
app.playground.renderHomeCards();
app.initLocalStorage();
