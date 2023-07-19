import { Tools } from './../system/Tools';

export const Config = {
  assets: Tools.massiveRequire(require['context']('../../images/', true, /\.(png|jpe?g)$/)),

  board: {
    ROWS: 7,
    COLS: 6,
    WIDTH: 500,
    HEIGHT: 660,
  },

  tileNames: ['green', 'orange', 'pink', 'red', 'yellow'],

  tilesColors: {
    green: '#00ff00',
    orange: '#ffa500',
    pink: '#ffc0cb',
    red: '#ff0000',
    yellow: '#ffff00',
  },

  scoresSettings: [
    {
      name: 'green',
      position: {
        x: -200,
        y: -400,
      },
    },
    {
      name: 'orange',
      position: {
        x: -100,
        y: -400,
      },
    },
    {
      name: 'pink',
      position: {
        x: 0,
        y: -400,
      },
    },
    {
      name: 'red',
      position: {
        x: 100,
        y: -400,
      },
    },
    {
      name: 'yellow',
      position: {
        x: 200,
        y: -400,
      },
    },
  ],
};
