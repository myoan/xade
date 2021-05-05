import 'phaser';

import Game from './src/scene/Game';
import GameOver from './src/scene/GameOver';
import Preloader from './src/scene/Preloader';

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
  scene: [Preloader, Game, GameOver],
};

new Phaser.Game(config);
