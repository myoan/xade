import 'phaser';
import Coordinate from '../lib/coordinate';
import Vector from '../lib/vector';
import TextureKey from '../enum/textureKey';

export default class Enemy extends Phaser.GameObjects.Container {
  scene: Phaser.Scene;
  graphics: Phaser.GameObjects.Graphics;
  obj: Phaser.Physics.Arcade.Image;
  cood: Coordinate;
  v: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.scene = scene;
    this.graphics = scene.add.graphics();
    this.cood = new Coordinate(new Vector(x, y), 0);

    this.drawObject();
    this.add(this.obj);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
  }

  private drawObject() {
    this.graphics.fillStyle(0x00fd00, 1.0);
    this.graphics.fillCircle(30, 30, 20);

    this.graphics.lineStyle(1, 0x00fd00, 1);
    this.graphics.beginPath();
    this.graphics.moveTo(30, 0);
    this.graphics.lineTo(24, 6);
    this.graphics.lineTo(36, 6);
    this.graphics.closePath();
    this.graphics.fillPath();
    this.graphics.generateTexture(TextureKey.Player, 60, 60);
    this.graphics.clear();

    this.obj = this.scene.physics.add.image(0, 0, TextureKey.Player);
    this.obj.setSize(40, 40);
    this.obj.setVelocity(0, 0);
    this.obj.setCollideWorldBounds(true);
    this.obj.setBounce(1, 1);
    this.obj.angle = 90;
  }

  pos() {
    return this.cood.convertToWorld(new Vector(0, 0));
  }

  rotate(x: number) {
    this.obj.angle += x;
    this.cood.rotate(x);
  }

  setDirection(x: number, y: number) {
    const local = this.cood.convertToLocal(new Vector(x, y));

    if (local.y > 0) {
      if (local.y < 5) {
        this.rotate(1);
      } else {
        this.rotate(5);
      }
    } else {
      if (local.y > -5) {
        this.rotate(-1);
      } else {
        this.rotate(-5);
      }
    }
  }

  moveUpper() {
    this.move(200, 0);
  }

  moveDowner() {
    this.move(200, -180);
  }

  moveLeft() {
    this.move(200, -90);
  }

  moveRight() {
    this.move(200, 90);
  }

  stop() {
    this.move(0, 0);
  }

  private move(r: number, phai: number) {
    const v = this.cood.directionToWorld(phai, r);
    this.obj.setVelocity(v.x, v.y);
    this.updatePos();
  }

  private updatePos() {
    this.cood.pos.x = this.obj.x;
    this.cood.pos.y = this.obj.y;
  }
}
