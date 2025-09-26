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
let cone;
let house;
let obstacles = [];

function preload(){
    //exec avant le chargement du jeu
    this.load.image("player","assets/player/henri.png");
    this.load.image("background","assets/bg/bg1.png");
    this.load.image("ground", "assets/bg/sol.png");
    this.load.image("cone", "assets/objects/conev2.png");
    

    this.load.spritesheet("player_walking", "assets/player/henriwalkingv2.png",{
        frameWidth: 42,
        frameHeight: 90,
    })
    this.load.spritesheet("player_static", "assets/player/henristaticv2.png",{
        frameWidth: 42,
        frameHeight: 90,
    })
    this.load.spritesheet("player_jumping", "assets/player/henrijumping.png", {
        frameWidth: 54,
        frameHeight: 90,
    })
}

function create(){
    // exec quand le jeu est chargé une premiere fois
    this.house = this.add.tileSprite(-40, 290, 10000, 512, 'background').setOrigin(0, 0);
    player = this.physics.add.sprite(100,757,"player");
    //player.setSize(144, 90);
    player.setSize(42, 90);
    player.setOffset(0,0);
    player.body.gravity.y = 500;

    this.cone = this.physics.add.staticImage(30, 770, 'cone');

    // visuel qui répète l’image
    this.ground = this.add.tileSprite(-40, 802, 10000, 32, 'ground').setOrigin(0, 0);
    
    // collider invisible (rectangle physique)
    let groundCollider = this.physics.add.staticImage(600, 818, null) // sans texture
        .setSize(10000, 32)
        .setVisible(false);

    this.physics.add.collider(player, groundCollider);
    this.physics.add.collider(player, this.cone);

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
    this.anims.create({
        key:'jumping',
        frames: this.anims.generateFrameNumbers('player_jumping', {
            start: 0,
            end: 2,
        }),
        frameRate: 6,
        repeat: 0
    })

    this.cameras.main.startFollow(player, true, 0.1, 0, -497, 340);

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.world.createDebugGraphic();

}

function update() {
    player.setVelocityX(0);

    // Saut
    if (Phaser.Input.Keyboard.JustDown(cursors.up) && player.body.onFloor()) { // dire à Phaser de ne que permettre le saut une fois et que quand le personnage touche le sol
        player.setVelocityY(-200);
        player.anims.play('jumping');
    }

    // Déplacement horizontal (au sol ou en l'air)
    if (cursors.left.isDown) {
        player.setVelocityX(-200);
        player.setFlipX(true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(200);
        player.setFlipX(false);
    }

    // Animation
    if (!player.body.onFloor()) {
        if (!player.anims.isPlaying || player.anims.currentAnim.key !== 'jumping') { // si la condition isPlaying est pas existant est faux ou que 'jumping' n'est pas réel non plus
        player.setTexture('player_jumping'); // faire en sorte que l'image du joueur soit mis sur bras levé
        player.setFrame(2);}
    } else if (player.body.velocity.x !== 0) {
        player.anims.play('walking', true);
    } else {
        player.anims.play('static', true);
    }

    // Empêcher de sortir de l'écran à gauche
    if (player.x < 0) {
        player.x = 0;
    }
}

