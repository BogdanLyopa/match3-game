import { Container, Graphics } from 'pixi.js';
import { GlowFilter } from 'pixi-filters';
import { Board } from './Board';
import { Tile } from './Tiles/Tile';
import { TileFactory } from './Tiles/TileFactory';
import { FieldFactory } from './Fields/FieldFactory';
import { Field } from './Fields/Field';

export class MainGame extends Container {
  board: Board;
  selectedTile: Tile | null;
  selectedTiles: Tile[];
  line: Graphics;

  constructor() {
    super();
    this.selectedTile = null;

    this.selectedTiles = [];

    this.board = new Board();
    this.line = new Graphics();

    this.addChild(this.board);
    this.board.addChild(this.line);

    this.setupInteractivity();
  }

  pointerDownHandler() {
    this.on('pointermove', this.moveHandler);
  }

  pointerUpHandler() {
    this.clearSelection();
    this.off('pointermove', this.moveHandler);
  }

  setupInteractivity() {
    this.interactive = true;
    this.on('pointerdown', this.pointerDownHandler);
    this.on('pointerup', this.pointerUpHandler);
  }

  moveHandler(e) {
    if (!e.target.name) return;

    const tile = e.target;

    if (!this.isNewTileToSelect(tile)) return;

    if (this.selectedTile) {
      if (this.isInvalidToSelectTile(tile)) {
        return;
      }
      this.drawLineBetweenTiles(this.selectedTile, tile);
    }

    this.selectTile(tile);
    this.highlightSuitableTiles();
  }

  selectTile(tile: Tile) {
    this.selectedTile = tile;
    this.selectedTiles.push(tile);
    this.selectedTile.filterOn();
  }

  isNewTileToSelect(tile: Tile) {
    return !this.selectedTiles.includes(tile);
  }

  isInvalidToSelectTile(tile: Tile) {
    return !this.selectedTile?.isNeighbour(tile) || this.selectedTile.name !== tile.name;
  }

  highlightSuitableTiles() {
    TileFactory.tiles.forEach(tile => {
      if (tile.name !== this.selectedTile?.name) {
        tile.alpha = 0.5;
      }
    });
  }

  async clearSelection() {
    TileFactory.tiles.forEach(tile => tile.filterOff());
    this.line.destroy();

    if (this.selectedTiles.length > 2) {
      this.interactive = false;
      this.board.deleteMask();

      const tilesAnimationsPromises = this.selectedTiles.reverse().map((tile, index) => {
        this.board.setChildIndex(tile, this.board.children.length - 1);

        return tile.animateToScoreIcon(index).then(() => {
          TileFactory.tiles = TileFactory.tiles.filter(item => item !== tile);
          tile.remove();
        });
      });

      await Promise.all(tilesAnimationsPromises);

      this.board.addMask();
      this.processFallDown();
      await this.addNewTiles();
      this.interactive = true;
    }

    this.resetSelection();
  }

  resetSelection() {
    this.line = new Graphics();
    this.board.addChild(this.line);

    this.selectedTiles = [];
    this.selectedTile = null;
  }

  processFallDown() {
    return new Promise<void>((resolve, reject) => {
      let completed = 0;
      let started = 0;
      for (let row = this.board.rows - 1; row >= 0; row--) {
        for (let col = this.board.cols - 1; col >= 0; col--) {
          const field = FieldFactory.getField(row, col);

          if (!field?.tile) {
            ++started;

            if (!field) return reject();
            this.fallDownTo(field).then(() => {
              ++completed;

              if (completed >= started) {
                resolve();
              }
            });
          }
        }
      }
    });
  }

  fallDownTo(emptyField: Field) {
    for (let row = emptyField.row - 1; row >= 0; row--) {
      const fallingField = FieldFactory.getField(row, emptyField.col);

      if (fallingField?.tile) {
        const fallingTile = fallingField.tile;
        fallingTile.field = emptyField;
        emptyField.tile = fallingTile;
        fallingField.tile = null;
        return fallingTile.fallDownTo(emptyField.fieldPosition, 0);
      }
    }
    return Promise.resolve();
  }

  addNewTiles() {
    const fields = FieldFactory.fields.filter(field => !field.tile);

    const newTilePromises = fields.map(field => {
      const tile = this.board.addNewTile(field);
      tile.y = -300;
      return tile.fallDownTo(field.fieldPosition, 0);
    });

    return Promise.all(newTilePromises);
  }

  drawLineBetweenTiles(selectedTile: Tile, nextTile: Tile) {
    const { x: x1, y: y1 } = selectedTile.position;
    const { x: x2, y: y2 } = nextTile.position;

    this.board.setChildIndex(this.line, Math.floor(this.board.children.length / 2));

    const outlineFilterRed = new GlowFilter();
    this.line.filters = [outlineFilterRed];

    this.line.lineStyle(10, selectedTile.color, 0.7);
    this.line.moveTo(x1, y1);
    this.line.lineTo(x2, y2);
  }
}
