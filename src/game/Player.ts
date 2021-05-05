import 'phaser';
import Ship from './Ship';

export default class Player extends Phaser.GameObjects.Container {
  scene: Phaser.Scene;
  ship: Ship;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.scene = scene;
    this.ship = new Ship(scene, x, y);
    scene.add.existing(this.ship);
    scene.physics.world.enable(this.ship);
  }

  setInputSources() {
    this.scene.input.keyboard.on('keydown-W', () => this.ship.moveUpper(), this.scene);
    this.scene.input.keyboard.on('keydown-S', () => this.ship.moveDowner(), this.scene);
    this.scene.input.keyboard.on('keydown-A', () => this.ship.moveLeft(), this.scene);
    this.scene.input.keyboard.on('keydown-D', () => this.ship.moveRight(), this.scene);
    this.scene.input.keyboard.on('keyup', () => this.ship.stop(), this.scene);
    this.scene.input.on('pointerdown', () => this.ship.fire() );
    this.scene.input.on('pointermove', (ptr: Phaser.Input.Pointer) => {
      this.ship.setDirection(ptr.worldX, ptr.worldY);
    });
  }

  setOverlap(enemies: Ship[]) {
    this.scene.physics.add.overlap(enemies, this.ship.bullets, this.ship.dead);
  }
}
