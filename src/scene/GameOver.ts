import 'phaser';

export default class GameOver extends Phaser.Scene {
  constructor() {
    super('game-over');
  }

  create() {
    const {width, height} = this.scale;

    const x = width / 2;
    const y = height / 2;

    this.add.text(x, y, 'Press SPACE to Play Again', {
      fontSize: '32px',
      color: '#00fd00',
      backgroundColor: '000000',
      padding: {left: 15, right: 15, top: 10, bottom: 10},
    }).setOrigin(0.5);

    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.stop('game-over');
      this.scene.stop('game');
      this.scene.start('game');
    });
  }
};
