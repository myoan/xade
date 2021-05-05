import 'phaser';
import Ship from './Ship';

export default class Enemy extends Ship {
  scene: Phaser.Scene;
  i: number;

  constructor(scene: Phaser.Scene, id: string, x: number, y: number) {
    super(scene, id, x, y);

    this.scene = scene;
    scene.add.existing(this);
    scene.physics.world.enable(this);
    this.i = -1;
  }

  randomWalk() {
    if (!this.active) return;

    const x = Phaser.Math.Between(0, 1000);
    const y = Phaser.Math.Between(0, 1000);
    this.setDirection(x, y);
    this.moveUpper();
  }

  randomShoot() {
    if (this.i == -1) {
      this.i = Phaser.Math.Between(0, 100);
    }
    this.i--;
    if (this.i < 0) {
      this.fire();
    }
  }

  setOverlap(enemies: Ship[]) {
    this.scene.physics.add.overlap(enemies, this.bullets, this.dead);
  }
}
