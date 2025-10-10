import "phaser";

let player;
let cursors;
let obstacles = [];
let money = 7; // valeur par défaut
let bateau;
let bakeryTextShown = false;
let bakeryText = null;
let bakeryTextShown2 = false;
let bakeryText2 = null;
let painPrisShown = false;
let painPris = null;
let keyObject;
let keyObjectE;
let overlay = null;
let mouchoirs = 1;
//let insects;
let playerOnBoat;
let playerHasBread = false;

class MainWorld extends Phaser.Scene {
    constructor() {
        super('MainWorld');
    }
    preload(){
        // assets
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
        this.load.image("mouchoirs", "assets/objects/bac_mouchoir.png")

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

        // ciel + décors
        this.cielle1 = this.add.tileSprite(-140, -286, 4396, 1940, 'cielVille').setOrigin(0, 0);
        this.cielle2 = this.add.tileSprite(4056, -200, 2048, 924, 'cielleParc').setOrigin(0, 0);
        this.cielle3 = this.add.tileSprite(6090, -200, 880, 924, 'cielleParc_se').setOrigin(0, 0).setFlipX(1);
        this.cielle2 = this.add.tileSprite(4056, -286, 2048, 1024, 'cielleParc').setOrigin(0, 0);
        this.cielle3 = this.add.tileSprite(6090, -286, 880, 1024, 'cielleParc_se').setOrigin(0, 0).setFlipX(1);

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

        // player
        const spawnX = (data && data.playerX !== undefined) ? data.playerX : 100;
        const spawnY = (data && data.playerY !== undefined) ? data.playerY : 736;

        player = this.physics.add.sprite(spawnX, spawnY, "player");
        player.setOrigin(0.5, 1);
        player.setSize(42, 90);
        player.setOffset((144 - 42) / 2, 144 - 90);
        player.body.gravity.y = 400;
        player.money = money;
    
        this.cone = this.physics.add.staticImage(30, 692, 'cone');
        this.physics.add.collider(player, bateau);

        // sols visuels
        this.ground = this.add.tileSprite(-40, 738, 4096, 100, 'ground').setOrigin(0, 0);
        this.ground2 = this.add.tileSprite(6104, 738, 4096, 100, 'ground').setOrigin(0, 0);
        this.parcGround = this.add.tileSprite(4056, 738, 2048, 100, 'groundParc').setOrigin(0, 0);
        this.flaqueEau = this.add.tileSprite(1000, 736, 92, 48, 'flaqueEau').setOrigin(0, 0);
        
        // colliders invisibles
        let groundCollider = this.physics.add.staticImage(600, 788, null).setSize(7422, 100).setVisible(false);
        let waterGroundCollider = this.physics.add.staticImage(4756, 814, null).setSize(891, 26).setVisible(false);
        let groundCollider2 = this.physics.add.staticImage(8912, 788, null).setSize(7422, 100).setVisible(false);
        let groundColliderExtra1 = this.physics.add.staticImage(4327, 786, null).setSize(34, 30).setVisible(false);
        let groundColliderExtra2 = this.physics.add.staticImage(5185, 786, null).setSize(32, 30).setVisible(false);
        let enterBakery = this.physics.add.staticImage(7036, 699, null).setSize(51, 79).setVisible(false);
    
        this.physics.add.collider(player, groundCollider);
        this.physics.add.collider(player, this.cone);
        this.physics.add.collider(player, waterGroundCollider);
        this.physics.add.collider(player, groundCollider2);
        this.physics.add.collider(player, groundColliderExtra1);
        this.physics.add.collider(player, groundColliderExtra2);
        
        // entrer dans la boulangerie (message)
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
    
        // animations
        // base
        this.anims.create({
            key:'walking',
            frames: this.anims.generateFrameNumbers('player_walking', { start: 0, end: 5 }),
            frameRate: 24,
            repeat: -1
        })
        this.anims.create({
            key:'static',
            frames: this.anims.generateFrameNumbers('player_static', { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        })
        this.anims.create({
            key:'jumping',
            frames: this.anims.generateFrameNumbers('player_jumping', { start: 0, end: 2 }),
            frameRate: 6,
            repeat: 0
        })

        // pain
        this.anims.create({
            key:'walking_pain',
            frames: this.anims.generateFrameNumbers('player_bread_walking', { start: 0, end: 5 }),
            frameRate: 24,
            repeat: -1
        })
        this.anims.create({
            key:'static_pain',
            frames: this.anims.generateFrameNumbers('player_bread_static', { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        })
        this.anims.create({
            key:'jumping_pain',
            frames: this.anims.generateFrameNumbers('player_bread_jumping', { start: 0, end: 2 }),
            frameRate: 6,
            repeat: 0
        })

        // umbrella
        this.anims.create({
            key:'walking_umbrella',
            frames: this.anims.generateFrameNumbers('player_umbrella_walking', { start: 0, end: 5 }),
            frameRate: 24,
            repeat: -1
        })
        this.anims.create({
            key:'static_umbrella',
            frames: this.anims.generateFrameNumbers('player_umbrella_static', { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        })
        this.anims.create({
            key:'jumping_umbrella',
            frames: this.anims.generateFrameNumbers('player_umbrella_jumping', { start: 0, end: 2 }),
            frameRate: 6,
            repeat: 0
        })

        // brum
        this.anims.create({
            key:'walking_brum',
            frames: this.anims.generateFrameNumbers('player_brum_walking', { start: 0, end: 5 }),
            frameRate: 24,
            repeat: -1
        })
        this.anims.create({
            key:'static_brum',
            frames: this.anims.generateFrameNumbers('player_brum_static', { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        })
        this.anims.create({
            key:'jumping_brum',
            frames: this.anims.generateFrameNumbers('player_brum_jumping', { start: 0, end: 2 }),
            frameRate: 6,
            repeat: 0
        })
    /*
        this.anims.create({
            key:'fly',
            frames: this.anims.generateFrameNumbers('insects', { start: 0, end: 1 }),
            frameRate: 6,
            repeat: -1
        })
    */
        // caméra
        this.cameras.main.setBounds(0, 0, 10000, 0);
        this.cameras.main.startFollow(player, true, 0.1, 0.1, 0, 245);
    
        cursors = this.input.keyboard.createCursorKeys();
    
        // argent
        // argent (ne génère les pièces qu'une seule fois)
        if (obstacles.length === 0) {
            for (let i = 0; i < 5; i++) {
                let randomX = Phaser.Math.Between(1200, 10000);
                let obstacle = this.physics.add.staticImage(randomX, 695, 'money');
                obstacles.push(obstacle);

                this.physics.add.overlap(player, obstacle, () => {
                    obstacle.destroy();
                    money += 1;
                    this.scoreText.setText('Argent : ' + money + "$");
                }, null, this);
            }
        }

    
        // HUD argent
        this.scoreText = this.add.text(10, 10, 'Argent : ' + money + '$', {fontSize: '28px'});
        this.scoreText.setScrollFactor(0);
    
        // animation bateau
        this.tweens.add({
            targets: bateau,
            x: 5058,
            duration: 3250,
            yoyo: true,
            repeat: -1,
            onYoyo: () => bateau.flipX = !bateau.flipX,
            onRepeat: () => bateau.flipX = !bateau.flipX,
        });

        this.physics.add.collider(player, bateau, () => {
            if (player.body.touching.down && bateau.body.touching.up) {
                playerOnBoat = true;
            }
        }, null, this);

        // récupère l'argent passé depuis la boulangerie
        if (data && data.money !== undefined) {
            money = data.money;
            this.scoreText.setText('Argent : ' + money + '$');
        }

        let eau = this.physics.add.staticImage(1046, 758, null)
            .setSize(90, 48)
            .setVisible(false);

        this.physics.add.overlap(player, eau, () => {
            if (!overlay) {
                overlay = this.add.image(0, 0, "eau_vue").setOrigin(0, 0);
                overlay.displayWidth = this.sys.game.config.width;
                overlay.displayHeight = this.sys.game.config.height;
                overlay.setScrollFactor(0);
            }
        }, null, this);

        let overlayVisible = false;
        let overlay2 = null;

        // Crée une zone invisible pour détecter le contact
        let eauRiviere = this.add.zone(4756, 790, 891, 10);
        this.physics.add.existing(eauRiviere, true);

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

        keyObjectE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        this.input.keyboard.on('keydown-E', () => {
            if (overlay && mouchoirs > 0) {
                overlay.destroy();
                overlay = null;
                mouchoirs -= 1;
                this.mouchoirText.setText('Mouchoirs : ' + mouchoirs);
            }
        });

        // text mouchoirs
        this.mouchoirText = this.add.text(400, 10, 'Mouchoirs : ' + mouchoirs, {fontSize: '28px'});
        this.mouchoirText.setScrollFactor(0);

        this.physics.world.createDebugGraphic();
    }
    
    update() {
        player.setVelocityX(0);

        // Saut
        if (Phaser.Input.Keyboard.JustDown(cursors.up) && player.body.onFloor()) {
            player.setVelocityY(-200);
        }
    
        // Déplacements
        if (cursors.left.isDown) {
            player.setVelocityX(-230);
            player.setFlipX(true);
        } else if (cursors.right.isDown) {
            player.setVelocityX(800);
            player.setFlipX(false);
        }
    
        // Animations selon possession du pain
        const prefix = playerHasBread ? '_pain' : '';
        if (!player.body.onFloor()) {
            player.anims.play('jumping' + prefix, true);
            player.setFrame(2);
        } else if (player.body.velocity.x !== 0) {
            player.anims.play('walking' + prefix, true);
        } else {
            player.anims.play('static' + prefix, true);
        }
    
        if (player.x < 0) player.x = 0;

        // texte "entrer"
        if (bakeryTextShown) {
            const distance = Phaser.Math.Distance.Between(player.x, player.y, 7036, 699);
            if (distance > 100) {
                if (bakeryText) {
                    bakeryText.destroy();
                    bakeryText = null;
                    bakeryTextShown = false;
                }
            }
        }

        if (playerHasBread && bakeryText) {
            bakeryText.destroy();
            bakeryText = null;
            bakeryTextShown = false;
        }

        if (playerHasBread) {
            const distance2 = Phaser.Math.Distance.Between(player.x, player.y, 7036, 699);

            if (!painPrisShown && distance2 <= 100) {
                painPris = this.add.text(10, 50, 'Vous avez déjà un pain...', {
                    fontSize: '28px',
                    fill: '#fff'
                });
                painPris.setScrollFactor(0);
                painPrisShown = true;
            } else if (painPrisShown && distance2 > 100) {
                if (painPris) {
                    painPris.destroy();
                    painPris = null;
                }
                painPrisShown = false;
            }
        }

        // touche A pour entrer
        if (keyObject.isDown && bakeryTextShown && !playerHasBread){
            this.scene.start('BakeryScene', {
                returnX: player.x,
                returnY: player.y,
            });  
        }

        // bateau: suivi du mouvement
        playerOnBoat = (
            player.body.touching.down &&
            bateau.body.touching.up &&
            Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), bateau.getBounds())
        );
        if (playerOnBoat) {
            const deltaX = bateau.x - bateau.prevX;
            player.x += deltaX;
        }
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
        
        this.returnX = data.returnX;
        this.returnY = data.returnY;
        
        this.interiorBakery = this.add.tileSprite(0, -190, 1194, 1024, 'interieur_bakery').setOrigin(0, 0);
        player = this.physics.add.sprite(100, 736, "player");
        player.setOrigin(0.5, 1);
        player.setSize(42, 90);
        player.setOffset((144 - 42) / 2, 144 - 90);
        player.body.gravity.y = 400;

        // HUD argent dans la boulangerie
        this.moneyText = this.add.text(10, 10, 'Argent : ' + money + '$', { fontSize: '28px' });
        this.moneyText.setScrollFactor(0);

        let exitBakery = this.physics.add.staticImage(183, 685, null).setSize(70, 100).setVisible(false);

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

        let groundColliderBakery = this.physics.add.staticImage(600, 784, null).setSize(1200, 100).setVisible(false);
        this.physics.add.collider(player, groundColliderBakery);

        this.canExit = false;
        this.time.delayedCall(500, () => { this.canExit = true; });
        
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        this.pain = this.physics.add.image(945, 648, 'pain');

        // Achat du pain: -5 pièces si possible, MAJ HUD
        this.physics.add.overlap(player, this.pain, () => {
            if (!playerHasBread && money >= 5) {
                playerHasBread = true;
                this.pain.disableBody(true, true);
                money -= 5;

                // MAJ texte argent
                if (this.moneyText) this.moneyText.setText('Argent : ' + money + '$');

                // Achat -> -5$ +texte pour user
                const txt = this.add.text(10, 50, '-5$', { fontSize: '28px', fill: '#ff5555' });
                txt.setScrollFactor(0);
                this.time.delayedCall(1200, () => txt.destroy());
            } else if (money < 5) { //Alerte argent pas suffisant (pas 5$ dispo)
                const warn = this.add.text(10, 50, 'Pas assez d\'argent !', { fontSize: '28px', fill: '#ff0000' });
                warn.setScrollFactor(0);
                this.time.delayedCall(1500, () => warn.destroy());
            }
        });

    }

    update() {
        // sortir de la boulangerie
        if (Phaser.Input.Keyboard.JustDown(this.keyA) && bakeryTextShown2) {
            this.scene.start('MainWorld', {
                playerX: this.returnX,
                playerY: this.returnY,
                money: money,
                playerHasBread
            });
        }

        if (bakeryTextShown2) {
            const distance = Phaser.Math.Distance.Between(player.x, player.y, 183, 685);
            if (distance > 80) {
                if (bakeryText2) bakeryText2.destroy();
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

        // Animation (avec ou sans pain)
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
        arcade: { gravity: { y: 0 }, debug: true } // mettre false pour enlever les lignes de debug
    },
    scene: [MainWorld, BakeryScene]
};

const game = new Phaser.Game(config);
