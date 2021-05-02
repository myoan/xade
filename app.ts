import 'phaser';
import Vector from './src/vector';
import Coordinate from './src/coordinate';

class Player {
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

var player: Player;
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
    player = new Player(graphics, gamesize.width / 2, gamesize.height / 2);
    player.draw();

    this.input.keyboard.on('keydown-W', () => player.moveUp(), this);
    this.input.keyboard.on('keydown-S', () => player.moveDown(), this);
    this.input.keyboard.on('keydown-A', () => player.moveLeft(), this);
    this.input.keyboard.on('keydown-D', () => player.moveRight(), this);
    this.input.keyboard.on('keydown-UP', () => player.rotate(5), this);
    this.input.keyboard.on('keydown-DOWN', () => player.rotate(-5), this);

    text = this.add.text(10, 10, '', {font: '16px Courier', color: '#0d0d0d'});
  }

  update() {
    player.redraw();

    const local = player.cood.convertToLocal(new Vector(this.input.mousePointer.x, this.input.mousePointer.y));

    text.setText([
      '(' + player.pos().x + ', ' + player.pos().y + '): ' + player.cood.theta,
      'X: ' + this.input.mousePointer.x,
      'Y: ' + this.input.mousePointer.y,
      'lX: ' + local.x,
      'lY: ' + local.y,
      // 'theta: ' + theta,
    ]);

    if (local.y > 0) {
      if (local.y < 5) {
        player.cood.rotate(1);
      } else {
        player.cood.rotate(5);
      }
    } else {
      if (local.y > -5) {
        player.cood.rotate(-1);
      } else {
        player.cood.rotate(-5);
      }
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 1200,
  physics: {
    default: 'arcade',
  },
  backgroundColor: '#eff0f3',
  scene: Demo,
};

new Phaser.Game(config);
