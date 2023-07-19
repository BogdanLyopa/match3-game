import { Container } from 'pixi.js';
import { MainGame } from './MainGame';
import { ScoreFactory } from './Score/ScoreFactory';

export class Game extends Container {
  constructor() {
    super();

    const mainGame = new MainGame();

    this.addChild(mainGame);
    this.addScoreIcons();
  }

  addScoreIcons() {
    const scores = ScoreFactory.createScores();
    this.addChild(...scores);
  }
}
