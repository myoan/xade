import 'phaser';
import Player from './src/game/player';
import Bullets from './src/game/bullets';

let text: Phaser.GameObjects.Text;

export default class Game extends Phaser.Scene {
  g: Phaser.GameObjects.Graphics;
  player: Player;
  bullets: Bullets;

  constructor() {
    super('game');
  }

  create() {
    this.cameras.main.setBounds(0, 0, 1080 * 2, 1080 * 2);
    this.physics.world.setBounds(0, 0, 1080 * 2, 1080 * 2);

    this.createBullet();
    this.createMap(2160, 2160);

    this.player = new Player(this, 400, 300);
    text = this.add.text(10, 10, '', {font: '16px Courier', color: '#fdfdfd'});
    this.bullets = new Bullets(this);

    this.input.keyboard.on('keydown-W', () => this.player.moveUp(), this);
    this.input.keyboard.on('keydown-S', () => this.player.moveDown(), this);
    this.input.keyboard.on('keydown-A', () => this.player.moveLeft(), this);
    this.input.keyboard.on('keydown-D', () => this.player.moveRight(), this);
    this.input.keyboard.on('keyup', () => this.player.stop(), this);

    this.cameras.main.startFollow(this.player.obj, true, 0.5, 0.5);

    this.input.on('pointerdown', () => {
      const pos = this.player.pos();
      const v = this.player.cood.directionToWorld(0, 500);
      this.bullets.fireBullet(pos.x, pos.y, v.x, v.y);
    });
  }

  createBullet() {
    const graphics = this.add.graphics();

    graphics.fillStyle(0x00fd00, 1.0);
    graphics.fillCircle(2, 2, 2);
    graphics.generateTexture('bullet', 4, 4);
    graphics.clear();
  }

  createMap(width: number, height: number) {
    const graphics = this.add.graphics();

    // draw Outline
    graphics.lineStyle(5, 0x00fd00, 1);
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(0, height);
    graphics.lineTo(width, height);
    graphics.lineTo(width, 0);
    graphics.closePath();
    graphics.strokePath();

    // draw Mesh
    graphics.lineStyle(1, 0x00fd00, 1);
    graphics.beginPath();

    for (let i = 1; i <= 10; i++) {
      graphics.moveTo(width * i / 10, 0);
      graphics.lineTo(width * i / 10, height);
    }
    for (let i = 1; i <= 10; i++) {
      graphics.moveTo(0, height * i / 10);
      graphics.lineTo(width, height * i / 10);
    }
    graphics.strokePath();
  }

  update() {
    this.player.setDirection(this.input.mousePointer.worldX, this.input.mousePointer.worldY);

    text.setText([
      '(' + this.player.pos().x + ', ' + this.player.pos().y + '): ' + this.player.cood.theta,
      'X: ' + this.input.mousePointer.worldX,
      'Y: ' + this.input.mousePointer.worldY,
    ]);
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'phaser-example',
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
  scene: Game,
};

new Phaser.Game(config);
