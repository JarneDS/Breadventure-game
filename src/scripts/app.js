import "phaser";

const config = {
    type: Phaser.AUTO,
    width: 800,
    Height: 600,
    scene: {
        preload,
        create,
        update
    },
    physics: {
        default: 'arcade',
        arcade: {gravity :{y: 0}}
    }
}

const game = new Phaser.Game(config);
let player;
let cursors;
let obstacles = [];

function preload(){
    //exec avant le chargement du jeu
    this.load.image("player","assets/player/henri.png");
    this.load.image("obstacles","assets/images/obstacle.png");

    this.load.spritesheet("player_walking", "assets/player/henriwalking.png",{
        frameWidth: 144,
        frameHeight: 144,
    })
    this.load.spritesheet("player_static", "assets/player/henristatic.png",{
        frameWidth: 144,
        frameHeight: 144,
    })
}

function create(){
    //exec quand le jeu est chargé une premiere fois
    player = this.physics.add.sprite(100,100,"player");

    for (let i = 0; i<10;i++){
        obstacles[i] = this.physics.add.sprite(i*50,200,"obstacles");
        obstacles[i].setImmovable(true)
        this.physics.add.collider(player, obstacles[i]);
    }

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
