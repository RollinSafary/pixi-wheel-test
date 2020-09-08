import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';
import 'pixi.js';
import './utils/extenstions';
import Wheel from './views/Wheel';
import WheelExtended from './views/WheelExtended';

declare global {
  interface Window {
    createWheelNormal: () => void;
    createWheelExtended: () => void;
  }
}

window.createWheelNormal = createWheelNormal;
window.createWheelExtended = createWheelExtended;
document.addEventListener('DOMContentLoaded', start, false);

let game: PIXI.Application;
let wheel_normal: Wheel;
let wheel_extended: WheelExtended;

function start(): void {
  gsap.registerPlugin(PixiPlugin);
  PixiPlugin.registerPIXI(PIXI);
  game = new PIXI.Application({
    autoStart: true,
    width: 600,
    height: 600,
    resizeTo: window,
    backgroundColor: 0x000000,
  });
  document.body.appendChild(game.view);
  game.ticker.stop();
  gsap.ticker.add(() => game.ticker.update());
  wheel_normal = new Wheel(game);
  game.stage.addChild(wheel_normal);
}

function createWheelNormal(): void {
  if (!wheel_extended) {
    return;
  }
  wheel_extended.destroy();
  wheel_extended = null;
  wheel_normal = new Wheel(game);
  game.stage.addChild(wheel_normal);
}
function createWheelExtended(): void {
  if (!wheel_normal) {
    return;
  }
  wheel_normal.destroy();
  wheel_normal = null;
  wheel_extended = new WheelExtended(game);
  game.stage.addChild(wheel_extended);
}
