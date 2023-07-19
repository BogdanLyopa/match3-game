import { Container, Text, Sprite, TextStyle } from 'pixi.js';
import { App } from './../../system/App';

const scoreTxtStyle = new TextStyle({
  fontSize: 36,
  fill: 'white',
});

export class Score extends Container {
  scoreCount: number;
  score: Text;
  tileIcon: Sprite;

  constructor(name: string) {
    super();

    this.name = name;
    this.scoreCount = 0;

    this.score = new Text(this.scoreCount, scoreTxtStyle);

    this.score.position.y = 60;
    this.score.anchor.set(0.5);

    this.tileIcon = App.sprite(this.name);
    this.interactive = false;

    this.addChild(this.score, this.tileIcon);
  }

  increase() {
    this.scoreCount++;
    this.score.text = this.scoreCount;
  }
}
