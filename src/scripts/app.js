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
let obstacles = [];
let money = 5;
let bateau;

function preload(){

    //exec avant le chargement du jeu
    this.load.image("player","assets/player/henri.png");
    this.load.image("background","assets/bg/bg1.png");
    this.load.image("background1","assets/bg/bg_parc.png");
    this.load.image("ground", "assets/bg/sol.png");
    this.load.image("cone", "assets/objects/travaux-panneau.png");
    this.load.image("money", "assets/objects/money.png");
    this.load.image("bateau", "assets/objects/bateau.png");
    this.load.image("groundParc", "assets/bg/sol_parc.png");
    
    // walking
    this.load.spritesheet("player_walking", "assets/player/henriwalking.png",{
        frameWidth: 144,
        frameHeight: 144,
    })

    this.load.spritesheet("player_umbrella_walking", "assets/player/henriumbrellawalking.png", {
        frameWidth: 144,
        frameHeight: 144,
    })

    this.load.spritesheet("player_bread_walking", "assets/player/henribreadwalking.png", {
        frameWidth: 144,
        frameHeight: 144,
    })

    this.load.spritesheet("player_brum_walking", "assets/player/henribrumwalking.png", {
        frameWidth: 144,
        frameHeight: 144,
    })

    // static
    this.load.spritesheet("player_static", "assets/player/henristatic.png",{
        frameWidth: 144,
        frameHeight: 144,
    })
    
    this.load.spritesheet("player_umbrella_static", "assets/player/henriumbrella.png", {
        frameWidth: 144,
        frameHeight: 144,
    })

    this.load.spritesheet("player_bread_static", "assets/player/henribread.png", {
        frameWidth: 144,
        frameHeight: 144,
    })

    this.load.spritesheet("player_brum_static", "assets/player/henribrum.png", {
        frameWidth: 144,
        frameHeight: 144,
    })

    // jumping
    this.load.spritesheet("player_jumping", "assets/player/henrijumping.png", {
        frameWidth: 144,
        frameHeight: 144,
    })
    
    this.load.spritesheet("player_umbrella_jumping", "assets/player/henriumbrellajumping.png", {
        frameWidth: 144,
        frameHeight: 144,
    })

    this.load.spritesheet("player_bread_jumping", "assets/player/henribreadjumping.png", {
        frameWidth: 144,
        frameHeight: 144,
    })

    this.load.spritesheet("player_brum_jumping", "assets/player/henribrumjumping.png", {
        frameWidth: 144,
        frameHeight: 144,
    })
}

function create(){

    // exec quand le jeu est chargé une premiere fois
    this.house = this.add.tileSprite(-40, 226, 4096, 512, 'background').setOrigin(0, 0);
    this.parc = this.add.tileSprite(4056, -185, 2048, 924, 'background1').setOrigin(0, 0);


    // bateau
    bateau = this.physics.add.image(4456, 610, 'bateau');
    bateau.setSize(256, 40);
    bateau.setOffset(0, 216);
    bateau.flipX = true;
    bateau.body.setImmovable(true);
    bateau.body.allowGravity = false;

    // player
    player = this.physics.add.sprite(100, 666, "player");
    player.setSize(42, 90);
    player.setOffset(50,54);
    player.body.gravity.y = 400;

    this.cone = this.physics.add.staticImage(30, 692, 'cone');
    this.physics.add.collider(player, bateau);

    // visuel qui répète l’image
    this.ground = this.add.tileSprite(-40, 738, 4096, 100, 'ground').setOrigin(0, 0);
    this.parcGround = this.add.tileSprite(4056, 738, 2048, 100, 'groundParc').setOrigin(0, 0);
    
    // collider invisible (rectangle physique)
    let groundCollider = this.physics.add.staticImage(600, 788, null) // sans texture
        .setSize(7422, 100)
        .setVisible(false);
    
    let waterGroundCollider = this.physics.add.staticImage(4756, 814, null)
        .setSize(891, 26)
        .setVisible(false);

    let groundCollider2 = this.physics.add.staticImage(8912, 788, null)
        .setSize(7422, 100)
        .setVisible(false);

    let groundColliderExtra1 = this.physics.add.staticImage(4325, 786, null)
        .setSize(30, 30)
        .setVisible(false);
    let groundColliderExtra2 = this.physics.add.staticImage(5185, 786, null)
        .setSize(30, 30)
        .setVisible(false);

    this.physics.add.collider(player, groundCollider);
    this.physics.add.collider(player, this.cone);
    this.physics.add.collider(player, waterGroundCollider);
    this.physics.add.collider(player, groundCollider2);
    this.physics.add.collider(player, groundColliderExtra1);
    this.physics.add.collider(player, groundColliderExtra2);

    // animations avec spritesheet
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

    this.cameras.main.setBounds(0, 0, 10000, 0); 
    this.cameras.main.startFollow(player, true, 0.1, 0.1, -497, 245); // suivre le perso

    cursors = this.input.keyboard.createCursorKeys();

    // argent
    for (let i = 0; i < 5; i++) {
        let randomX = Phaser.Math.Between(100, 10000); // emplacement pièces (random)
        let obstacle = this.physics.add.staticImage(randomX, 695, 'money'); // emplacement random pièces sur axe X
        obstacles.push(obstacle); // ajouter obstacle à la liste obstacles

        this.physics.add.overlap(player, obstacle, () => { // collision entre sprite (player) et les pièces de monnaie
            obstacle.destroy(); // détruire la pièce touchée
            money += 1; // ajouter 1 à chaque pièce touchée à money
            this.scoreText.setText('Argent : ' + money + "€"); // mettre à jour le texte
        }, null, this);
    };

    this.scoreText = this.add.text(10, 10, 'Argent : 5€', {fontSize: '28px'}); // initialisez le text
    this.scoreText.setScrollFactor(0); // Empêche la text de défiler avec le fond

    // animation bateau
    this.tweens.add({
        targets: bateau,
        x: 5058, // position finale sur axe X
        duration: 3000, // durée (ms)
        yoyo: true, // revient en arrière
        repeat: -1, // répète indéfiniment
        onYoyo: () => bateau.flipX = !bateau.flipX,
        onRepeat: () => bateau.flipX = !bateau.flipX,
    });


    this.physics.world.createDebugGraphic();

}

function update() {
    player.setVelocityX(0);

    // Saut
    if (Phaser.Input.Keyboard.JustDown(cursors.up) && player.body.onFloor()) { // dire à Phaser de ne que permettre le saut une fois et que quand le personnage touche le sol
        player.setVelocityY(-200);
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
        if (player.anims.isPlaying) { // si isPlaying est en cours
        player.anims.play('jumping', true); 
        player.setFrame(2);} // faire en sorte que l'image du joueur soit mis sur bras levé
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
