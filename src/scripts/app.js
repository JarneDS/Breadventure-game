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
let bakeryTextShown = false;
let bakeryText = null;
let keyObject;
let insects;


 
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
    this.load.image("flaqueEau", "assets/obstacles/eau_flaque.png");
    this.load.image("parc_se", "assets/bg/parc_se.png");
    this.load.image("bakery", "assets/bg/bakery.png");
    this.load.image("cielVille", "assets/bg/cielle_ville.png");
    
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

    //insectes
    this.load.spritesheet("insects", "assets/obstacles/insectes.png", {
        frameWidth: 128,
        frameHeight: 128,
    })

}
 
function create(){
    keyObject = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

    // chargement des cielles
    this.cielle1 = this.add.tileSprite(-140, -286, 4396, 1940, 'cielVille').setOrigin(0, 0);

    // exec quand le jeu est chargé une premiere fois
    this.house = this.add.tileSprite(-40, 226, 4096, 512, 'background').setOrigin(0, 0);
    this.parc = this.add.tileSprite(4056, -185, 2048, 924, 'background1').setOrigin(0, 0);
    this.parc2 = this.add.tileSprite(6090, -285, 880, 1024, 'parc_se').setOrigin(0, 0).setFlipX(1);
    this.bakery = this.add.tileSprite(6970, -286, 2048, 1024, 'bakery').setOrigin(0, 0);
 
    // bateau
    bateau = this.physics.add.image(4456, 610, 'bateau');
    bateau.setSize(256, 40);
    bateau.setOffset(0, 216);
    bateau.flipX = true;
    bateau.body.setImmovable(true);
    bateau.body.allowGravity = false;

    let x = Phaser.Math.Between(3000, 10000);
    //insectes
    insects = this.physics.add.image(x, 700, 'insects');
    insects.setSize(64, 64);
    insects.setOffset(0, 0);
    insects.body.setImmovable(true);
    insects.body.allowGravity = false;
 
    // player
    player = this.physics.add.sprite(100, 736, "player");
    player.setOrigin(0.5, 1);
    player.setSize(42, 90);
    player.setOffset((144 - 42) / 2, 144 - 90); //modif symétrique
    player.body.gravity.y = 400;
 
 
 
    this.cone = this.physics.add.staticImage(30, 692, 'cone');
    this.physics.add.collider(player, bateau);

 
    // visuel qui répète l’image
    this.ground = this.add.tileSprite(-40, 738, 4096, 100, 'ground').setOrigin(0, 0);
    this.ground2 = this.add.tileSprite(6104, 738, 4096, 100, 'ground').setOrigin(0, 0);
    this.parcGround = this.add.tileSprite(4056, 738, 2048, 100, 'groundParc').setOrigin(0, 0);
    
    this.flaqueEau = this.add.tileSprite(260, 736, 92, 48, 'flaqueEau').setOrigin(0, 0);
    
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
    let enterBakery = this.physics.add.staticImage(7036, 699, null)
        .setSize(51, 79)
        .setVisible(false);
 
    this.physics.add.collider(player, groundCollider);
    this.physics.add.collider(player, this.cone);
    this.physics.add.collider(player, waterGroundCollider);
    this.physics.add.collider(player, groundCollider2);
    this.physics.add.collider(player, groundColliderExtra1);
    this.physics.add.collider(player, groundColliderExtra2);
    
    // entrer dans la boulangerie
    this.physics.add.overlap(player, enterBakery, () => {
        if (!bakeryTextShown) {
            bakeryText = this.add.text(10, 50, 'Appuyer sur A pour entrer', {
                fontSize: '28px',
                fill: '#fff'
            });
            bakeryText.setScrollFactor(0);
            bakeryTextShown = true;
        }
    }, null, this);
 
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
 
    this.cameras.main.setBounds(0, 0, 10000, 0); // -> zone de la caméra pour se déplacer
    this.cameras.main.startFollow(player, true, 0.1, 0.1, 0, 245); // modif, un seul starfollow, et setbounds.
 
 
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
        duration: 3250, // durée (ms)
        yoyo: true, // revient en arrière
        repeat: -1, // répète indéfiniment
        onYoyo: () => bateau.flipX = !bateau.flipX,
        onRepeat: () => bateau.flipX = !bateau.flipX,
    });
 
    // animation insectes
    this.tweens.add({
        targets: insects,
        x: -100, // position finale sur axe X
        duration: 14000, // durée (ms)
        yoyo: false // revient en arrière
    });
 
 
    this.physics.world.createDebugGraphic();
 
}
 
function update() {
    player.setVelocityX(0);

    // Saut
    if (Phaser.Input.Keyboard.JustDown(cursors.up) && player.body.onFloor()) {
        player.setVelocityY(-200);
    }
 
    if (cursors.left.isDown) { // modif on flip on modifie pas la caméra
        player.setVelocityX(-230);
        player.setFlipX(true);
    
    } else if (cursors.right.isDown) {
        player.setVelocityX(230);
        player.setFlipX(false);
    }
 
    if (!player.body.onFloor()) {
        if (player.anims.isPlaying) {
            player.anims.play('jumping', true);
            player.setFrame(2);
        }
    } else if (player.body.velocity.x !== 0) {
        player.anims.play('walking', true);
    } else {
        player.anims.play('static', true);
    }
 
    if (player.x < 0) {
        player.x = 0;
    }

    if (bakeryTextShown) {
        const distance = Phaser.Math.Distance.Between(player.x, player.y, 7036, 699); // coordonnées de enterBakery
        if (distance > 100) {
            bakeryText.destroy();
            bakeryText = null;
            bakeryTextShown = false;
        }
    }

    if (keyObject.isDown && bakeryTextShown) {
        console.log("Entrée dans la boulangerie !");
        // Exemple : this.scene.start('BakeryScene');
    }
}
 
 