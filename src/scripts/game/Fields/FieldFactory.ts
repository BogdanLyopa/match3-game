import { App } from '../../system/App';
import { Field } from './Field';

export class FieldFactory {
  static fields: Field[] = [];

  static createFields(): Field[] {
    for (let row = 0; row < App.config.board.ROWS; row++) {
      for (let col = 0; col < App.config.board.COLS; col++) {
        this.createField(row, col);
      }
    }
    return this.fields;
  }

  static createField(row: number, col: number): Field {
    const field = new Field(row, col);
    this.fields.push(field);
    return field;
  }

  static getField(row: number, col: number) {
    return this.fields.find(field => field.row === row && field.col === col);
  }
}
