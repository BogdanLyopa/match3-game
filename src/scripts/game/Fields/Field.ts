import { Graphics } from 'pixi.js';
import { App } from '../../system/App';
import { Tile } from '../Tiles/Tile';

export class Field extends Graphics {
  row: number;
  col: number;
  gap: number;
  tile: Tile | null;
  #color = 0x408c1f;

  constructor(row: number, col: number) {
    super();
    this.row = row;
    this.col = col;
    this.gap = 5;
    this.tile = null;
    this.draw();
  }

  get width(): number {
    return App.config.board.WIDTH / App.config.board.COLS - this.gap;
  }

  get height(): number {
    return App.config.board.HEIGHT / App.config.board.ROWS - this.gap;
  }

  get fieldPosition() {
    return {
      x: this.width * this.col + this.gap * (this.col + 0.5) + this.width * 0.5,
      y: this.height * this.row + this.gap * (this.row + 0.5) + this.height * 0.5,
    };
  }

  draw() {
    this.beginFill(this.#color);
    this.drawRoundedRect(this.fieldPosition.x, this.fieldPosition.y, this.width, this.height, 16);
    this.endFill();
    this.pivot.set(this.width * 0.5, this.height * 0.5);
  }

  setTile(tile: Tile) {
    this.tile = tile;
    tile.field = this;
    tile.setPosition(this.fieldPosition);
    this.name = tile.name;
  }
}
