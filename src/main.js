import Phaser from './lib/phaser.js'

// import game scenes
import Game from './scenes/Game.js'

// create a Phaser game
export default new Phaser.Game({
    // type of rendering
    type: Phaser.AUTO,

    // game size
    width: 800,
    height: 600,

    // game scenes
    scene: Game, 

    // enable Arcade Physics
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            // see collision boxes
            debug: false
        }
    }
})