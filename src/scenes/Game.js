import Phaser from '../lib/phaser.js'

export default class Game extends Phaser.Scene
{
    // define class properties
    map
    player
    cursors
    groundLayer
    coinLayer
    score
    text

    // define a unique key
    constructor()
    {
        super('game')
    }

    // set class properties
    init()
    {
        this.score = 0;
    }

    // specify images, audio, or other assets to load 
    // before starting the Scene
    preload()
    {
       // map made with Tiled in JSON format
       this.load.tilemapTiledJSON('map', 'assets/map.json');
       
       // tiles in spritesheet
       this.load.spritesheet('tiles', 'assets/tiles.png', {frameWidth: 70, frameHeight: 70});

       // simple coin image
       this.load.image('coin', 'assets/coinGold.png');

       // player animations
       this.load.atlas('player', 'assets/player.png', 'assets/player.json');
    }

    // is called once all the assets for the Scene have been 
    // loaded. Trying to use an asset that has not been loaded 
    // will result in an error
    create()
    {
       this.createWorld(); 
       this.createPlayer();
       this.adjustCameras();
       this.createBackground();
       this.createCoins();
       this.createScore();
       this.createTextureAtlasAnimation();
    }

    createWorld()
    {
        // Our map has two layers – one for the ground tiles, named ‘World’ 
        // and one that contains the coins with the name ‘Coins’

        // load the map
        this.map = this.make.tilemap({key: 'map'});

        // tiles for the ground layer
        const groundTiles = this.map.addTilesetImage('tiles');

        // create the ground layer
        this.groundLayer = this.map.createDynamicLayer('World', groundTiles, 0, 0);

        // the player will collide with this layer
        this.groundLayer.setCollisionByExclusion([-1]);

        // set the boundaries for our game world. This limits the movement 
        // of our player and the camera
        this.physics.world.bounds.width = this.groundLayer.width;
        this.physics.world.bounds.height = this.groundLayer.height;
    }

    createPlayer()
    {
        // create the player sprite
        this.player = this.physics.add.sprite(200, 200, 'player');

        // our player will bounce from items
        this.player.setBounce(0.2);

        // don't go out of the map
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.groundLayer, this.player);

        // get cursor keys for player movement
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    adjustCameras()
    {
        // set bounds so the camera won't go outside the game world
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        // make the camera follow the player
        this.cameras.main.startFollow(this.player);
    }

    createBackground()
    {
        // set background color, so the sky is not black
        this.cameras.main.setBackgroundColor('#ccccff');
    }

    createCoins()
    {
        // coin image used as tileset
        const coinTiles = this.map.addTilesetImage('coin');

        // add coins as tiles
        this.coinLayer = this.map.createDynamicLayer('Coins', coinTiles, 0, 0);

        // allow coins to be collected
        this.coinLayer.setTileIndexCallback(17, this.collectCoin, this); // the coin id is 17

        // when player overlaps with a tile with index 17, collectCoin is called
        this.physics.add.overlap(this.player, this.coinLayer);
    }

    collectCoin(sprite, tile)
    {
        // remove tile/coin
        this.coinLayer.removeTileAt(tile.x, tile.y);

        // increment the score
        this.score++;

        // set the text to show the score
        this.text.setText(this.score);
        return false;
    }

    createScore()
    {
        // create a Text Game Object with font size of 20 and white color
        this.text = this.add.text(20, 570, 'Coins: 0', {
            fontSize: '20px',
            fill: '#ffffff'
        });

        //  fix text to the screen
        this.text.setScrollFactor(0);
    }

    createTextureAtlasAnimation()
    {
        this.anims.create({
            
            // name of this animation
            key: 'walk',

            // add the frames for it
            frames: this.anims.generateFrameNames('player', { prefix: 'p1_walk', start: 1, end: 11, zeroPad: 2}),
            frameRate: 10,

            // set to -1 tells Phaser to loop this animation
            repeat: -1
        })
    }

    update(t,dt)
    {
        // check keys for player movement
        this.movePlayer();
    }

    movePlayer()
    {
        if (this.cursors.left.isDown)
        {
            // move left
            this.player.body.setVelocityX(-200); 

            // play walk animation
            this.player.anims.play('walk', true); 

            // flip the sprite to the left
            this.player.flipX = true;

        }
        else if (this.cursors.right.isDown)
        {
            // move right
            this.player.body.setVelocityX(200); 

            // play walk animation
            this.player.anims.play('walk', true);

            // use the original sprite looking to the right
            this.player.flipX = false;
        }else {
            // stop player from moving
            this.player.body.setVelocityX(0);

            // play idle animation
            this.player.anims.play('idle', true);
        }

        // jump up
        if ((this.cursors.space.isDown || this.cursors.up.isDown) 
            && this.player.body.onFloor())
        {
            this.player.body.setVelocityY(-500);
        }
    }

}