import 'phaser';
import Ship from './src/game/Ship';
import Player from './src/game/Player';
import Bullets from './src/game/Bullets';
import Preloader from './src/scene/Preloader';

let text: Phaser.GameObjects.Text;

export default class Game extends Phaser.Scene {
  g: Phaser.GameObjects.Graphics;
  player: Player;
  enemy: Ship;
  bullets: Bullets;

  constructor() {
    super('game');
  }

  create() {
    this.cameras.main.setBounds(0, 0, 1000, 1000);
    this.physics.world.setBounds(0, 0, 1000, 1000);

    this.createMap(1000, 1000);

    this.player = new Player(this, 400, 300);
    this.player.setInputSources();
    this.player.setOverlap(new Array<Ship>(this.enemy));

    text = this.add.text(10, 10, '', {font: '16px Courier', color: '#fdfdfd'});
    this.createEnemies(20);

    this.cameras.main.startFollow(this.player, true, 0.5, 0.5);
  }

  createEnemies(n: number) {
    const enemies = Array<Ship>(n);
    for (let i = 0; i < n; i++) {
      const x = Phaser.Math.Between(0, 1000);
      const y = Phaser.Math.Between(0, 1000);
      const enemy = new Ship(this, x, y);
      this.add.existing(enemy);
      this.physics.world.enable(enemy);
      enemies[i] = enemy;
    }
    this.player.setOverlap(enemies);
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
    text.setText([
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
  scene: [Preloader, Game],
};

new Phaser.Game(config);
