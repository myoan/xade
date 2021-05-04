import 'phaser';
import Vector from './src/vector';
import Coordinate from './src/coordinate';

class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'bullet');
  }

  fire(x: number, y: number, vx: number, vy: number) {
    this.body.reset(x, y);

    this.setActive(true);
    this.setVisible(true);

    this.setVelocity(vx, vy);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.y <= -32) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
}

class Bullets extends Phaser.Physics.Arcade.Group {
  constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 5,
      key: 'bullet',
      active: false,
      visible: false,
      classType: Bullet,
    });
  }

  fireBullet(x: number, y: number, vx: number, vy: number) {
    const bullet = this.getFirstDead(true);
    bullet.fire(x, y, vx, vy);
    // const bullet = this.getFirstDead(false);
    // if (bullet) {
    //   bullet.fire(x, y, vx, vy);
    // }
  }
}

class Player {
  scene: Phaser.Scene;
  graphics: Phaser.GameObjects.Graphics;
  obj: Phaser.Physics.Arcade.Image;
  cood: Coordinate;
  v: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.graphics = scene.add.graphics();
    this.cood = new Coordinate(new Vector(x, y), 0);

    this.drawObject();
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
    this.graphics.generateTexture('player', 60, 60);
    this.graphics.clear();

    this.obj = this.scene.physics.add.image(this.cood.pos.x, this.cood.pos.y, 'player');
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

  moveUp() {
    this.move(200, 0);
  }

  moveDown() {
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
    player.updatePos();
  }

  private updatePos() {
    this.cood.pos.x = this.obj.x;
    this.cood.pos.y = this.obj.y;
  }
}

let player: Player;
let text: Phaser.GameObjects.Text;

export default class Game extends Phaser.Scene {
  g: Phaser.GameObjects.Graphics;
  bullets: Bullets;

  constructor() {
    super('game');
  }

  create() {
    this.cameras.main.setBounds(0, 0, 1080 * 2, 1080 * 2);
    this.physics.world.setBounds(0, 0, 1080 * 2, 1080 * 2);

    this.createBullet();
    this.createMap(2160, 2160);

    this.input.keyboard.on('keydown-W', () => player.moveUp(), this);
    this.input.keyboard.on('keydown-S', () => player.moveDown(), this);
    this.input.keyboard.on('keydown-A', () => player.moveLeft(), this);
    this.input.keyboard.on('keydown-D', () => player.moveRight(), this);
    this.input.keyboard.on('keyup', () => player.stop(), this);

    player = new Player(this, 400, 300);
    text = this.add.text(10, 10, '', {font: '16px Courier', color: '#fdfdfd'});

    this.cameras.main.startFollow(player.obj, true, 0.5, 0.5);

    this.bullets = new Bullets(this);
    this.input.on('pointerdown', () => {
      const v = player.cood.directionToWorld(0, 500);
      this.bullets.fireBullet(player.pos().x, player.pos().y, v.x, v.y);
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
    const local = player.cood.convertToLocal(new Vector(this.input.mousePointer.worldX, this.input.mousePointer.worldY));

    text.setText([
      '(' + player.pos().x + ', ' + player.pos().y + '): ' + player.cood.theta,
      'X: ' + this.input.mousePointer.worldX,
      'Y: ' + this.input.mousePointer.worldY,
      'pX: ' + local.x,
      'pY: ' + local.y,
    ]);

    if (local.y > 0) {
      if (local.y < 5) {
        player.rotate(1);
      } else {
        player.rotate(5);
      }
    } else {
      if (local.y > -5) {
        player.rotate(-1);
      } else {
        player.rotate(-5);
      }
    }
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
  scene: Game,
};

new Phaser.Game(config);
