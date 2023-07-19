import gsap from 'gsap';
import { Container, Sprite } from 'pixi.js';
import { AdjustmentFilter, GlowFilter } from 'pixi-filters';
import { Emitter, upgradeConfig } from '@pixi/particle-emitter';
import { App } from '../../system/App';
import { Field } from '../Fields/Field';
import { ScoreFactory } from '../Score/ScoreFactory';
import { Score } from '../Score/Score';

export class Tile extends Container {
  field: Field | null;
  color: string;
  emitter?: Emitter;
  elapsed: number;
  name: string;
  requestId?: number;
  sprite: Sprite;

  constructor(name: string) {
    super();
    this.name = name;
    this.sprite = App.sprite(this.name);
    this.sprite.anchor.set(0.5);
    this.addChild(this.sprite);

    this.color = App.config.tilesColors[this.name];
    this.elapsed = 0;
    this.field = null;
  }

  setPosition(position: { x: number; y: number }) {
    this.x = position.x;
    this.y = position.y;
  }

  filterOn() {
    const glowFilter = new GlowFilter();
    const adjustmentFilter = new AdjustmentFilter({
      gamma: 1.4,
      saturation: 1.4,
      contrast: 1.2,
    });

    this.filters = [glowFilter, adjustmentFilter];

    return gsap.to(this, {
      duration: 0.5,
      ease: 'bounce.out',
      keyframes: [
        { pixi: { scaleX: '+=0.1', scaleY: '-=0.1' } },
        { pixi: { scaleX: '-=0.2', scaleY: '+=0.2' } },
        { pixi: { scaleX: '+=0.1', scaleY: '-=0.1' } },
      ],
    });
  }

  filterOff() {
    this.alpha = 1;
    this.filters = [];
  }

  moveTo(position: { x: number; y: number }, duration: number, delay: number, ease: string) {
    return gsap.to(this, {
      duration,
      delay,
      ease,
      pixi: {
        x: position.x,
        y: position.y,
      },
    });
  }

  async fallDownTo(position: { x: number; y: number }, delay: number) {
    this.moveTo(position, 0.5, delay, 'bounce.out');
    return gsap.to(this, {
      duration: 0.4,
      keyframes: [
        { pixi: { scaleX: 1, scaleY: 0.8 } },
        { pixi: { scaleX: 0.8, scaleY: 1 } },
        { pixi: { scaleX: 1, scaleY: 1 } },
      ],
    });
  }

  isNeighbour(tile: Tile) {
    if (!this.field || !tile.field) return false;

    const rowDiff = Math.abs(this.field.row - tile.field.row);
    const colDiff = Math.abs(this.field.col - tile.field.col);

    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1) || (rowDiff === 1 && colDiff === 1);
  }

  remove() {
    this.destroy();

    if (this.field) {
      this.field.tile = null;
      this.field = null;
    }
  }

  disappeareWithParticles() {
    const particleConfig = upgradeConfig(
      {
        alpha: {
          start: 0.8,
          end: 0.25,
        },
        scale: {
          start: 0.71,
          end: 0.2,
          minimumScaleMultiplier: 2.05,
        },
        color: {
          start: this.color,
          end: this.color,
        },
        speed: {
          start: 200,
          end: 45,
          minimumSpeedMultiplier: 1.06,
        },
        acceleration: {
          x: 0,
          y: 0,
        },
        maxSpeed: 0,
        startRotation: {
          min: 0,
          max: 360,
        },
        noRotation: false,
        rotationSpeed: {
          min: 0,
          max: 0,
        },
        lifetime: {
          min: 0.2,
          max: 0.3,
        },
        blendMode: 'color',
        frequency: 0.001,
        emitterLifetime: 0.04,
        maxParticles: 2000,
        pos: {
          x: this.sprite.x,
          y: this.sprite.y,
        },
        addAtBack: false,
        spawnType: 'circle',
        spawnCircle: {
          x: 0,
          y: 0,
          r: 0,
        },
      },
      [App.getTexture('particle')],
    );

    this.emitter = new Emitter(this, particleConfig);
    this.elapsed = Date.now();
    this.emitter.emit = true;
    this.update();
  }

  stopParticlesAnim() {
    if (this.emitter && this.requestId) {
      this.emitter.emit = false;
      cancelAnimationFrame(this.requestId);
    }
  }

  private update = () => {
    this.requestId = requestAnimationFrame(this.update);
    const now = Date.now();
    const deltaTime = (now - this.elapsed) * 0.001;
    this.emitter?.update(deltaTime);
    this.elapsed = now;
  };

  animateToScoreIcon(index: number) {
    const score = ScoreFactory.get(this.name) as Score;
    const { x: x1, y: y1 } = score.getBounds();
    const { x: x2, y: y2 } = this.getBounds();
    const x = x1 - x2;
    const y = y1 - y2;

    return gsap
      .timeline()
      .to(this.sprite, {
        x: x,
        y: y,
        delay: index * 0.05,

        onStart: () => {
          this.disappeareWithParticles();
        },

        onComplete: () => {
          this.stopParticlesAnim();
        },
      })
      .to(score.tileIcon, {
        duration: 0.2,
        ease: 'bounce.out',
        keyframes: [{ pixi: { scale: 1.2 } }, { pixi: { scale: 1 } }],
        onStart: () => {
          score.increase();
        },
      });
  }
}
