import "phaser";

const config = {
    type: Phaser.AUTO,
    width: 1194,
    height: 834,
    scene: {
        preload,
        create,
        update
    },
    physics: {
        default: 'arcade',
        arcade: {gravity :{y: 0}},
        debug: true
    }
}

const game = new Phaser.Game(config);
let player;
let cursors;
let ground = [];
let house;
// let obstacles = [];

function preload(){
    //exec avant le chargement du jeu
    this.load.image("player","assets/player/henri.png");
    this.load.image("background","assets/bg/bg1.png");
    this.load.image("ground", "assets/bg/sol.png");
    

    this.load.spritesheet("player_walking", "assets/player/henriwalking.png",{
        frameWidth: 144,
        frameHeight: 90,
    })
    this.load.spritesheet("player_static", "assets/player/henristatic.png",{
        frameWidth: 144,
        frameHeight: 90,
    })
}

function create(){
    //exec quand le jeu est chargé une premiere fois
    //house = this.add.image(800, 258, "background").setOrigin(0.67, 0.6);
    //house.setDisplaySize(1194, 670);
    player = this.physics.add.sprite(100,100,"player");
    player.setSize(144, 90);
    player.setOffset(0,0);

    // visuel qui répète l’image
    this.ground = this.add.tileSprite(0, 802, 1194, 32, 'ground').setOrigin(0, 0);

    // collider invisible (rectangle physique)
    let groundCollider = this.physics.add.staticImage(600, 818, null) // sans texture
        .setSize(1194, 32)
        .setVisible(false);

    this.physics.add.collider(player, groundCollider);


    this.anims.create({
        key:'walking',
        frames: this.anims.generateFrameNumbers('player_walking', {
            start: 0,
            end: 5,
        }),
        frameRate: 24,
        repeat: -1
    })
    this.anims.create({
        key:'static',
        frames: this.anims.generateFrameNumbers('player_static', {
            start: 0,
            end: 1,
        }),
        frameRate: 3,
        repeat: -1
    })

    cursors = this.input.keyboard.createCursorKeys();
    this.physics.world.createDebugGraphic();

}

function update(){
    //exec frame par frame

    player.setVelocity(0);

    if (cursors.left.isDown){
        player.setVelocityX(-200);
        player.anims.play('walking', true);
        player.setFlipX(true); 
    }
    else if(cursors.right.isDown){
        player.setVelocityX(200);
        player.anims.play('walking',true);
        player.setFlipX(false); 
    } 
    else if(cursors.up.isDown){
        player.setVelocityY(-200);
    }
    else if(cursors.down.isDown){
        player.setVelocityY(200);
    }
    else {
        player.anims.play('static',true);  
    }
}
