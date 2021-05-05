import Ship from '../game/Ship';
import Player from '../game/Player';
import Enemy from '../game/Enemy';
import Bullets from '../game/Bullets';

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
    this.cameras.main.setBounds(0, 0, 3840, 3840);
    this.physics.world.setBounds(0, 0, 3840, 3840);

    this.createMap(3840, 3840);

    this.player = new Player(this, 'player', 400, 300);
    this.player.setInputSources();
    this.player.setOverlap(new Array<Ship>(this.enemy));

    text = this.add.text(10, 10, '', {font: '16px Courier', color: '#fdfdfd'});
    this.createEnemies(20);

    this.cameras.main.startFollow(this.player, true, 0.5, 0.5);
  }

  createEnemies(n: number) {
    this.enemies = Array<Enemy>(n);
    for (let i = 0; i < n; i++) {
      const x = Phaser.Math.Between(0, 3840);
      const y = Phaser.Math.Between(0, 3840);
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
    if (!this.player.active) {
      this.scene.run('game-over');
    }
    text.setText([
      'X: ' + this.input.mousePointer.worldX,
      'Y: ' + this.input.mousePointer.worldY,
    ]);

    for (const enemy of this.enemies) {
      enemy.randomWalk();
      enemy.randomShoot();
    }
  }
}
