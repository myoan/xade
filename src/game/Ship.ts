import 'phaser';
import Coordinate from '../lib/Coordinate';
import Vector from '../lib/Vector';
import TextureKey from '../enum/TextureKey';

export default class Ship extends Phaser.GameObjects.Container {
  scene: Phaser.Scene;
  cood: Coordinate;
  v: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.scene = scene;
    this.cood = new Coordinate(new Vector(x, y), 0);

    const obj = this.scene.physics.add.image(0, 0, TextureKey.Ship).setOrigin(0.5, 0.5);
    this.add(obj);

    // physicsにaddしないとsetVelocityなどが利用できない
    this.scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    this.setSize(40, 40);
    body.setCircle(20);
    body.setVelocity(0, 0);
    body.setCollideWorldBounds(true);
    body.setBounce(1, 1);
    this.rotation = this.radian(90);
  }

  pos() {
    return this.cood.convertToWorld(new Vector(0, 0));
  }

  rotate(x: number) {
    this.rotation += this.radian(x);
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
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(v.x, v.y);
    this.updatePos();
  }

  private updatePos() {
    this.cood.pos.x = this.x;
    this.cood.pos.y = this.y;
  }

  private radian(deg: number): number {
    return deg * Math.PI / 180;
  }
}
