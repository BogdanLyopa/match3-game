import { App } from '../../system/App';

import { Tools } from '../../system/Tools';
import { Field } from '../Fields/Field';
import { Tile } from './Tile';
import { FieldFactory } from '../Fields/FieldFactory';

export class TileFactory {
  static tiles: Tile[] = [];

  static createTile(field: Field): Tile {
    const name = App.config.tileNames[Tools.randomNumber(0, App.config.tileNames.length - 1)];
    const tile = new Tile(name);
    tile.interactive = true;
    field.setTile(tile);
    this.tiles.push(tile);
    return tile;
  }

  static createTiles() {
    return FieldFactory.fields.map(field => this.createTile(field));
  }
}
