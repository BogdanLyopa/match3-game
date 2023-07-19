import * as PIXI from 'pixi.js';
import { Application, Assets, Sprite } from 'pixi.js';
import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/all';
import { Game } from './../game/Game';
import { Config } from './../game/Config';
import { CustomLoader } from './Loader';

class MyApplication {
  app: Application;
  loader: CustomLoader;
  config: typeof Config;

  constructor(config: typeof Config) {
    this.config = config;

    this.app = new Application({
      view: <HTMLCanvasElement>document.querySelector('#canvas'),
      backgroundColor: 0x000,
      antialias: false,
      resizeTo: window,
    });

    this.loader = new CustomLoader(Assets, this.config);

    globalThis.__PIXI_APP__ = this.app; //FOR PIXI DEV TOOLS
  }

  run() {
    gsap.registerPlugin(PixiPlugin);
    PixiPlugin.registerPIXI(PIXI);
    this.loader.preload().then(() => this.start());
  }

  start() {
    this.app.stage.position.set(this.app.view.width / 2, this.app.view.height / 2);
    const game = new Game();
    this.app.stage.addChild(game);
  }

  getTexture(textureName: string) {
    return this.loader.assets.cache.get(textureName);
  }

  sprite(textureName: string, position = { x: 0, y: 0 }, anchor = { x: 0.5, y: 0.5 }) {
    const sprite = Sprite.from(this.getTexture(textureName));
    sprite.position.copyFrom(position);
    sprite.anchor.copyFrom(anchor);
    return sprite;
  }
}

export const App = new MyApplication(Config);
