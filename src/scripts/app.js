import "phaser";

let player;
let cursors;
let obstacles = [];
let money = money ?? 5;
let bateau;
let bakeryTextShown = false;
let bakeryText = null;
let bakeryTextShown2 = false;
let bakeryText2 = null;
let keyObject;
//let insects;
let playerOnBoat;
let playerHasBread = false;


class MainWorld extends Phaser.Scene {
    constructor() {
        super('MainWorld');
    }
    preload(){
    
        //exec avant le chargement du jeu
        this.load.image("player","assets/player/henri.png");
        this.load.image("background","assets/bg/bg1.png");
        this.load.image("background2","assets/bg/bg2.png");
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
        this.load.image("cielleParc", "assets/bg/cielle_parc.png");
        this.load.image("cielleParc_se", "assets/bg/cielle_parc_se.png");

        //effects
        this.load.image("eau_vue", "assets/objects/vue_eau.png");
        
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
    /*
        //insectes
        this.load.spritesheet("insects", "assets/obstacles/insectes.png", {
            frameWidth: 56,
            frameHeight: 42,
        })
    */
    }
    
    create(data){
        keyObject = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        Phaser.Input.Keyboard.JustDown(keyObject);

        // chargement des cielles
        this.cielle1 = this.add.tileSprite(-140, -286, 4396, 1940, 'cielVille').setOrigin(0, 0);
        this.cielle2 = this.add.tileSprite(4056, -200, 2048, 924, 'cielleParc').setOrigin(0, 0);
        this.cielle3 = this.add.tileSprite(6090, -200, 880, 924, 'cielleParc_se').setOrigin(0, 0).setFlipX(1);

        // exec quand le jeu est chargé une premiere fois
        this.house = this.add.tileSprite(-40, 226, 4096, 512, 'background2').setOrigin(0, 0);
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
        bateau.prevX = bateau.x;

    /*
        let x = Phaser.Math.Between(3000, 10000);
        //insectes
        insects = this.physics.add.sprite(x, 715, 'insects');
        insects.setSize(56, 42);
        insects.setOffset(0, 0);
        insects.displayWidth = 48;
        insects.displayHeight = 36;
        insects.body.setImmovable(true);
        insects.body.allowGravity = false;
    */
        // player
        const spawnX = (data && data.playerX !== undefined) ? data.playerX : 100; // au début du jeu, le joueur arrive sur les coordonnées X = 100 et Y = 736
        const spawnY = (data && data.playerY !== undefined) ? data.playerY : 736;

        player = this.physics.add.sprite(spawnX, spawnY, "player"); // le joueur est placé aux coordonnées X et Y qui sont défini au moment du chargement (100, 736) ou porte magasin / boulangerie
        player.setOrigin(0.5, 1);
        player.setSize(42, 90);
        player.setOffset((144 - 42) / 2, 144 - 90); //modif symétrique
        player.body.gravity.y = 400;
        player.money = money;
    
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
        // base
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

        // pain
        this.anims.create({
            key:'walking_pain',
            frames: this.anims.generateFrameNumbers('player_bread_walking', {
                start: 0,
                end: 5,
            }),
            frameRate: 24,
            repeat: -1
        })
        this.anims.create({
            key:'static_pain',
            frames: this.anims.generateFrameNumbers('player_bread_static', {
                start: 0,
                end: 1,
            }),
            frameRate: 3,
            repeat: -1
        })
        this.anims.create({
            key:'jumping_pain',
            frames: this.anims.generateFrameNumbers('player_bread_jumping', {
                start: 0,
                end: 2,
            }),
            frameRate: 6,
            repeat: 0
        })

        // umbrella
        this.anims.create({
            key:'walking_umbrella',
            frames: this.anims.generateFrameNumbers('player_umbrella_walking', {
                start: 0,
                end: 5,
            }),
            frameRate: 24,
            repeat: -1
        })
        this.anims.create({
            key:'static_umbrella',
            frames: this.anims.generateFrameNumbers('player_umbrella_static', {
                start: 0,
                end: 1,
            }),
            frameRate: 3,
            repeat: -1
        })
        this.anims.create({
            key:'jumping_umbrella',
            frames: this.anims.generateFrameNumbers('player_umbrella_jumping', {
                start: 0,
                end: 2,
            }),
            frameRate: 6,
            repeat: 0
        })

        // brum
        this.anims.create({
            key:'walking_brum',
            frames: this.anims.generateFrameNumbers('player_brum_walking', {
                start: 0,
                end: 5,
            }),
            frameRate: 24,
            repeat: -1
        })
        this.anims.create({
            key:'static_brum',
            frames: this.anims.generateFrameNumbers('player_brum_static', {
                start: 0,
                end: 1,
            }),
            frameRate: 3,
            repeat: -1
        })
        this.anims.create({
            key:'jumping_brum',
            frames: this.anims.generateFrameNumbers('player_brum_jumping', {
                start: 0,
                end: 2,
            }),
            frameRate: 6,
            repeat: 0
        })
    /*
        this.anims.create({
            key:'fly',
            frames: this.anims.generateFrameNumbers('insects', {
                start: 0,
                end: 1,
            }),
            frameRate: 6,
            repeat: -1
        })*/
    
        this.cameras.main.setBounds(0, 0, 10000, 0); // -> zone de la caméra pour se déplacer
        this.cameras.main.startFollow(player, true, 0.1, 0.1, 0, 245); // modif, un seul starfollow, et setbounds.
    
    
        cursors = this.input.keyboard.createCursorKeys();
    
        // argent
        // argent (ne génère les pièces qu'une seule fois)
        if (obstacles.length === 0) {
            for (let i = 0; i < 5; i++) {
                let randomX = Phaser.Math.Between(100, 10000);
                let obstacle = this.physics.add.staticImage(randomX, 695, 'money');
                obstacles.push(obstacle);

                this.physics.add.overlap(player, obstacle, () => {
                    obstacle.destroy();
                    money += 1;
                    this.scoreText.setText('Argent : ' + money + "€");
                }, null, this);
            }
        }

    
        this.scoreText = this.add.text(10, 10, 'Argent : ' + money + '$', {fontSize: '28px'}); // initialisez le text
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
    /*
        // animation insectes
        this.tweens.add({
            targets: insects,
            x: -100, // position finale sur axe X
            duration: 14000, // durée (ms)
            yoyo: false // revient en arrière
        });
    */

        this.physics.add.collider(player, bateau, () => {
            // Regarde si le joueur est sur le bateau
            if (player.body.touching.down && bateau.body.touching.up) {
                playerOnBoat = true;
            }
        }, null, this);

        if (data && data.money !== undefined) {
            money = data.money;
        }

        let eau = this.physics.add.staticImage(306, 758, null)
            .setSize(92, 48)
            .setVisible(false);
/*
        this.physics.add.overlap(player, eau, () => {
            const overlay = this.add.image(0, 0, "eau_vue").setOrigin(0, 0);

            overlay.displayWidth = this.sys.game.config.width;
            overlay.displayHeight = this.sys.game.config.height;

            overlay.setScrollFactor(0);
        }, null, this);
*/
        let overlayVisible = false;
        let overlay2 = null;

        // Crée une zone invisible pour détecter le contact
        let eauRiviere = this.add.zone(4756, 790, 891, 10);
        this.physics.add.existing(eauRiviere, true); // true = static

        // Détection de l'entrée dans la zone
        this.physics.add.overlap(player, eauRiviere, () => {
            if (!overlayVisible) {
                overlayVisible = true;

                overlay2 = this.add.rectangle(
                    0,
                    0,
                    this.sys.game.config.width,
                    this.sys.game.config.height,
                    0x1A74CC
                ).setOrigin(0);

                overlay2.setScrollFactor(0);
                overlay2.setAlpha(0.9); // transparence
            }
        }, null, this);

        // Vérifie en continu si le joueur est encore dans la zone
        this.events.on('update', () => {
            const isTouching = Phaser.Geom.Intersects.RectangleToRectangle(
                player.getBounds(),
                eauRiviere.getBounds()
            );

            if (!isTouching && overlayVisible) {
                overlayVisible = false;
                if (overlay2) {
                    overlay2.destroy();
                    overlay2 = null;
                }
            }
        });

        this.physics.world.createDebugGraphic();
    
    }
    
    update() {
        player.setVelocityX(0);

        // Saut
        if (Phaser.Input.Keyboard.JustDown(cursors.up) && player.body.onFloor()) {
            player.setVelocityY(-200);
        }
    
        if (cursors.left.isDown) { // modif on flip on modifie pas la caméra
            player.setVelocityX(-230);
            player.setFlipX(true);
        
        } else if (cursors.right.isDown) {
            player.setVelocityX(800);
            player.setFlipX(false);
        }
    
        const prefix = playerHasBread ? '_pain' : '';
        if (!player.body.onFloor()) {
            player.anims.play('jumping' + prefix, true);
            player.setFrame(2);
        } else if (player.body.velocity.x !== 0) {
            player.anims.play('walking' + prefix, true);
        } else {
            player.anims.play('static' + prefix, true);
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
            this.scene.start('BakeryScene', {
                returnX: player.x, // donne les coordonnées X et Y du joueur au BakeryScene que le joueur avait avant d'entrer dans la boulangerie
                returnY: player.y,
            });  
        }

        //insects.anims.play('fly', true);

        // Remet playerOnBoat sur false à chaque frame
        playerOnBoat = false;

        // Regarde si le joueur est sur le bateau
        playerOnBoat = (
            player.body.touching.down &&
            bateau.body.touching.up &&
            Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), bateau.getBounds())
        );

        if (playerOnBoat) {
            // Calcule de combien le bateau à bouger
            const deltaX = bateau.x - bateau.prevX;

            // Bouge le joueur du même nombre que le bateau
            player.x += deltaX;
        }

        // Update l'emplacement précédent du bateau
        bateau.prevX = bateau.x;    
    }
}

class BakeryScene extends Phaser.Scene {
    constructor() {
        super('BakeryScene');
    }

    preload() {
        this.load.image("interieur_bakery", "assets/bg/interieur_bakery.png");
        this.load.image("pain", "assets/objects/pain.png")
    }

    create(data) {
        cursors = this.input.keyboard.createCursorKeys();
        
        this.returnX = data.returnX; // reprend les coordonnées X et Y du player avant d'entrer dans la boulangerie pour pouvoir les utilisé plus tard
        this.returnY = data.returnY;
        player.money = data.returnMoney;

        this.interiorBakery = this.add.tileSprite(0, -190, 1194, 1024, 'interieur_bakery').setOrigin(0, 0);
        player = this.physics.add.sprite(100, 736, "player");
        player.setOrigin(0.5, 1);
        player.setSize(42, 90);
        player.setOffset((144 - 42) / 2, 144 - 90); //modif symétrique
        player.body.gravity.y = 400;

        let exitBakery = this.physics.add.staticImage(183, 685, null)
            .setSize(70, 100)
            .setVisible(false);

        this.physics.add.overlap(player, exitBakery, () => {
            if (!bakeryTextShown2) {
                bakeryText2 = this.add.text(10, 50, 'Appuyer sur A pour sortir', {
                    fontSize: '28px',
                    fill: '#fff'
                });
                bakeryText2.setScrollFactor(0);
                bakeryTextShown2 = true;
            }
        }, null, this);

        let groundColliderBakery = this.physics.add.staticImage(600, 784, null) // sans texture
            .setSize(1200, 100)
            .setVisible(false);

        this.physics.add.collider(player, groundColliderBakery);


        this.canExit = false;
        this.time.delayedCall(500, () => {
            this.canExit = true;
        });
        
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        this.pain = this.physics.add.image(945, 648, 'pain');

        this.physics.add.overlap(player, this.pain, () => {
            playerHasBread = true;
            this.pain.disableBody(true, true);
        });

    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keyA) && bakeryTextShown2) {
            this.scene.start('MainWorld', {
                playerX: this.returnX, // donne les coordonnées X et Y du joueur au MainWorld que le joueur avait avant d'entrer dans la boulangerie
                playerY: this.returnY,
                money: money,
                playerHasBread
            });
        }

        if (bakeryTextShown2) {
            const distance = Phaser.Math.Distance.Between(player.x, player.y, 183, 685); // coordonnées de exitBakery
            if (distance > 80) {
                bakeryText2.destroy();
                bakeryText2 = null;
                bakeryTextShown2 = false;
            }
        }

        // Mouvement
        player.setVelocityX(0);

        // Saut
        if (Phaser.Input.Keyboard.JustDown(cursors.up) && player.body.onFloor()) {
            player.setVelocityY(-200);
        }

        // Gauche / Droite
        if (cursors.left.isDown) {
            player.setVelocityX(-230);
            player.setFlipX(true);
        } else if (cursors.right.isDown) {
            player.setVelocityX(230);
            player.setFlipX(false);
        }

        // Animation
        const prefix = playerHasBread ? '_pain' : '';
        if (!player.body.onFloor()) {
            player.anims.play('jumping' + prefix, true);
            player.setFrame(2);
        } else if (player.body.velocity.x !== 0) {
            player.anims.play('walking' + prefix, true);
        } else {
            player.anims.play('static' + prefix, true);
        }

        // Murs gauche et droite
        player.x = Phaser.Math.Clamp(player.x, 0, 1194);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 1194,
    height: 834,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: true } // debug a mettre sur false pour enlever les lignes
    },
    scene: [MainWorld, BakeryScene]
};

const game = new Phaser.Game(config);
 