import { Game, Heap } from '../js/game.js'
import { homeDef } from './home.js';
import { menuDef } from './menu.js';

Game.initialize('canvas')
Game.start(30);

// * 定义家
homeDef()

// * 定义主菜单
Game.createGame('menu')
Game.switch('menu')
menuDef()
