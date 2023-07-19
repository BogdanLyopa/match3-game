import { App } from './../../system/App';
import { Score } from './Score';

export class ScoreFactory {
  static scores: Score[] = [];

  static createScore(name: string, position: { x: number; y: number }) {
    const score = new Score(name);
    score.position.copyFrom(position);
    this.scores.push(score);
    return score;
  }

  static createScores() {
    return App.config.scoresSettings.map(score => this.createScore(score.name, score.position));
  }

  static get(name: string) {
    return this.scores.find(score => score.name === name);
  }
}
