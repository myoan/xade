import Ship from '../game/Ship';
import Player from '../game/Player';
import Enemy from '../game/Enemy';
import Bullets from '../game/Bullets';

const SCREEN_WIDTH = 3840;
const SCREEN_HEIGHT = 3840;
const PLAYER_NUM = 30;

let text: Phaser.GameObjects.Text;

export default class Game extends Phaser.Scene {
  g: Phaser.GameObjects.Graphics;
  player: Player;
  enemy: Ship;
  enemies: Array<Enemy>;
  bullets: Bullets;

  constructor() {
    super('game');
  }

  create() {
    this.cameras.main.setBounds(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    this.physics.world.setBounds(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    this.createMap(SCREEN_WIDTH, SCREEN_HEIGHT);

    this.player = new Player(this, 'player', 400, 300);
    this.player.setInputSources();
    this.player.setOverlap(new Array<Ship>(this.enemy));

    text = this.add.text(10, 10, '', {font: '16px Courier', color: '#fdfdfd'}).setScrollFactor(0);
    this.createEnemies(PLAYER_NUM - 1);

    this.cameras.main.startFollow(this.player, true, 0.5, 0.5);
  }

  createEnemies(n: number) {
    this.enemies = Array<Enemy>(n);
    for (let i = 0; i < n; i++) {
      const x = Phaser.Math.Between(0, SCREEN_WIDTH);
      const y = Phaser.Math.Between(0, SCREEN_HEIGHT);
      const enemy = new Enemy(this, `enemy-${i}`, x, y);
      this.add.existing(enemy);
      this.physics.world.enable(enemy);
      this.enemies[i] = enemy;
    }
    this.player.setOverlap(this.enemies);
    for (const enemy of this.enemies) {
      const other: Array<Ship> = this.enemies.filter((e) => e.id != enemy.id);
      other.push(this.player as Ship);
      enemy.setOverlap(other);
    }
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
    const alives = this.enemies.filter((e) => e.active);
    if (!this.player.active || alives.length == 0) {
      this.scene.stop('game');
      this.scene.run('game-over', {ranking: alives.length + 1});
    }

    text.setText([
      'Ranking: ' + (alives.length + 1),
    ]);

    for (const enemy of this.enemies) {
      enemy.randomWalk();
      enemy.randomShoot();
    }
  }
}
