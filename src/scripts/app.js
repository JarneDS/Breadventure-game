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
let house;
let obstacles = [];

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
    // exec quand le jeu est chargé une premiere fois
    
    player = this.physics.add.sprite(100,757,"player");
    player.setSize(144, 90);
    player.setOffset(0,0);
    player.body.gravity.y = 500;

    // visuel qui répète l’image
    this.ground = this.add.tileSprite(-40, 802, 10000, 32, 'ground').setOrigin(0, 0);
    this.house = this.add.tileSprite(-40, 400, 10000, 256, 'background').setOrigin(0, 0);
    // collider invisible (rectangle physique)
    let groundCollider = this.physics.add.staticImage(600, 818, null) // sans texture
        .setSize(10000, 32)
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

    this.cameras.main.startFollow(player, true, 0.1, 0, -497, 340);

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.world.createDebugGraphic();

}

function update(){
    //exec frame par frame

    player.setVelocityX(0);

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
    else if(Phaser.Input.Keyboard.JustDown(cursors.up) && player.body.onFloor()){
        player.setVelocityY(-200);
    }
    else {
        player.anims.play('static',true);  
    }

    if (player.positionX >= 0) {
        
    } else {
        player.setPosition = 0
    }
}
