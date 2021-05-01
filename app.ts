import 'phaser';
import Vector from './src/vector';
import Coordinate from './src/coordinate';

class User {
  graphics: Phaser.GameObjects.Graphics;
  cood: Coordinate;
  v: number;
  x: number;
  y: number;

  constructor(graphics: Phaser.GameObjects.Graphics, x: number, y: number) {
    this.graphics = graphics;

    this.cood = new Coordinate(new Vector(x, y), 0);
    this.v = 5;
  }

  draw() {
    const r = 20;

    const pos = this.cood.convertToWorld(new Vector(0, 0));
    const front = this.cood.convertToWorld(new Vector(25, 0));
    this.graphics.lineStyle(5, 0x0d0d0d, 1);
    this.graphics.beginPath();
    this.graphics.moveTo(pos.x, pos.y);
    this.graphics.lineTo(front.x, front.y);
    this.graphics.strokePath();
    this.graphics.fillStyle(0x0d0d0d, 1.0);
    this.graphics.fillCircle(pos.x, pos.y, r);
  }

  redraw() {
    this.graphics.clear();
    this.draw();
  }

  rotate(x: number) {
    this.cood.rotate(x);
  }

  moveUp() {
    this.cood.move(this.v);
  }

  moveDown() {
    this.cood.move(this.v, 180);
  }

  moveLeft() {
    this.cood.move(this.v, -90);
  }

  moveRight() {
    this.cood.move(this.v, 90);
  }

  pos(): Vector {
    return this.cood.convertToWorld(new Vector(0, 0));
  }
};

var user: User;
var text: Phaser.GameObjects.Text;

export default class Demo extends Phaser.Scene {
  worldGraphics: Phaser.GameObjects.Graphics;

  constructor() {
    super('demo');
  }

  create() {
    this.worldGraphics = this.add.graphics();
    const graphics = this.add.graphics();
    const gamesize = this.sys.game.scale.gameSize;
    user = new User(graphics, gamesize.width / 2, gamesize.height / 2);
    user.draw();

    this.input.keyboard.on('keydown-W', () => user.moveUp(), this);
    this.input.keyboard.on('keydown-S', () => user.moveDown(), this);
    this.input.keyboard.on('keydown-A', () => user.moveLeft(), this);
    this.input.keyboard.on('keydown-D', () => user.moveRight(), this);
    this.input.keyboard.on('keydown-UP', () => user.rotate(5), this);
    this.input.keyboard.on('keydown-DOWN', () => user.rotate(-5), this);

    text = this.add.text(10, 10, '', {font: '16px Courier', color: '#0d0d0d'});
  }

  update() {
    user.redraw();

    const local = user.cood.convertToLocal(new Vector(this.input.mousePointer.x, this.input.mousePointer.y));

    text.setText([
      '(' + user.pos().x + ', ' + user.pos().y + '): ' + user.cood.theta,
      'X: ' + this.input.mousePointer.x,
      'Y: ' + this.input.mousePointer.y,
      'lX: ' + local.x,
      'lY: ' + local.y,
      // 'theta: ' + theta,
    ]);

    if (local.y > 0) {
      if (local.y < 5) {
        user.cood.rotate(1);
      } else {
        user.cood.rotate(5);
      }
    } else {
      if (local.y > -5) {
        user.cood.rotate(-1);
      } else {
        user.cood.rotate(-5);
      }
    }
  }
}

const config = {
  type: Phaser.AUTO,
  phisics: 'arcade',
  backgroundColor: '#eff0f3',
  width: 800,
  height: 600,
  scene: Demo,
};

const game = new Phaser.Game(config);
