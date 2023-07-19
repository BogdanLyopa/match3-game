import { Graphics } from 'pixi.js';
import { App } from '../system/App';
import { FieldFactory } from './Fields/FieldFactory';
import { TileFactory } from './Tiles/TileFactory';
import { Field } from './Fields/Field';

export class Board extends Graphics {
  #borderWidth = 15;
  #borderColor = 0x54e223;
  #boardColor = 0x97d23f;
  rows: number;
  cols: number;
  boardMask: Graphics;

  constructor() {
    super();

    this.rows = App.config.board.ROWS;
    this.cols = App.config.board.COLS;

    const fields = FieldFactory.createFields();
    const tiles = TileFactory.createTiles();
    this.y = 50;
    this.boardMask = new Graphics();
    this.createMask();

    this.draw();
    this.addChild(...fields, ...tiles);
  }

  draw(): void {
    this.lineStyle(this.#borderWidth, this.#borderColor);
    this.beginFill(this.#boardColor);
    this.drawRoundedRect(0, 0, App.config.board.WIDTH, App.config.board.HEIGHT, 16);
    this.endFill();
    this.pivot.set(App.config.board.WIDTH / 2, App.config.board.HEIGHT / 2);
  }

  addNewTile(field: Field) {
    const tile = TileFactory.createTile(field);
    this.addChild(tile);
    return tile;
  }

  createMask() {
    this.boardMask.beginFill(this.#boardColor);
    this.boardMask.drawRoundedRect(
      this.#borderWidth / -2,
      this.#borderWidth / -2,
      App.config.board.WIDTH + this.#borderWidth,
      App.config.board.HEIGHT + this.#borderWidth,
      16,
    );
    this.boardMask.endFill();
  }

  addMask() {
    this.mask = this.boardMask;
    this.addChild(this.boardMask);
    this.setChildIndex(this.boardMask, 0);
  }

  deleteMask() {
    if (this.boardMask) this.removeChild(this.boardMask);
    this.mask = null;
  }
}
