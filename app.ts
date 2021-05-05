import 'phaser';
import Ship from './src/game/Ship';
import Bullets from './src/game/Bullets';
import Preloader from './src/scene/Preloader';

let text: Phaser.GameObjects.Text;

export default class Game extends Phaser.Scene {
  g: Phaser.GameObjects.Graphics;
  player: Ship;
  enemy: Ship;
  bullets: Bullets;

  constructor() {
    super('game');
  }

  create() {
    this.cameras.main.setBounds(0, 0, 1000, 1000);
    this.physics.world.setBounds(0, 0, 1000, 1000);

    this.createMap(1000, 1000);
    // this.createEnemies(20, 2160, 2160);

    const x = Phaser.Math.Between(0, 1000);
    const y = Phaser.Math.Between(0, 1000);
    this.enemy = new Ship(this, x, y);
    this.add.existing(this.enemy);

    this.player = new Ship(this, 400, 300);
    this.add.existing(this.player);

    text = this.add.text(10, 10, '', {font: '16px Courier', color: '#fdfdfd'});
    this.bullets = new Bullets(this);

    this.physics.world.enable(this.player);
    this.physics.world.enable(this.enemy);
    this.physics.add.overlap(this.enemy, this.bullets, this.enemyDead);

    this.input.keyboard.on('keydown-W', () => this.player.moveUpper(), this);
    this.input.keyboard.on('keydown-S', () => this.player.moveDowner(), this);
    this.input.keyboard.on('keydown-A', () => this.player.moveLeft(), this);
    this.input.keyboard.on('keydown-D', () => this.player.moveRight(), this);
    this.input.keyboard.on('keyup', () => this.player.stop(), this);

    this.cameras.main.startFollow(this.player, true, 0.5, 0.5);

    this.input.on('pointerdown', () => {
      const pos = this.player.pos();
      const v = this.player.cood.directionToWorld(0, 500);
      this.bullets.fireBullet(pos.x, pos.y, v.x, v.y);
    });
  }

  enemyDead(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject,
    ) {
    const enemy = obj1 as Ship;
    enemy.setVisible(false);
    enemy.setActive(false);
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
    // arcade: {
    //   debug: true,
    // },
  },
  scene: [Preloader, Game],
};

new Phaser.Game(config);
