import "phaser";

let player;
let cursors;
let obstacles = [];
let money = 7; // valeur par défaut
let bateau;
let smallPlat;
let bigPlat;
let bakeryTextShown = false;
let bakeryText = null;
let bakeryTextShown2 = false;
let bakeryText2 = null;
let painPrisShown = false;
let painPris = null;
let keyObject;
let keyObjectE;

let overlayEau = null; //flaque eau
let overlayBoue = null; //flaque boue
let overlayCaca = null; //caca bird

let overlayStack = []; //pile des overlays -> utile pour effacer le denier apparu

let mouchoirs = 10; //valeur par défaut - valeur TEST -> à modifier
let shopTextShown = false;
let shopText = null;
//let insects;
let playerOnBoat;
let playerOnPlat
let playerHasBread = false;

class LoadingScene extends Phaser.Scene {
    constructor() {
        super('LoadingScene');
    }

    preload() {
        this.load.image("logo", "assets/logo/logo.png");
        this.load.image("intro", "assets/bg/intro.png");
        // assets
        this.load.image("player","assets/player/henri.png");
        this.load.image("background","assets/bg/bg1.png");
        this.load.image("background2","assets/bg/bg2.png");
        this.load.image("background1","assets/bg/bg_parc.png");
        this.load.image("chantier","assets/bg/chantier.png"); //chantier
        this.load.image("ground", "assets/bg/sol.png");
        this.load.image("cone", "assets/objects/travaux-panneau.png");
        this.load.image("money", "assets/objects/money.png");
        this.load.image("bateau", "assets/objects/bateau.png");
        this.load.image("smallPlat", "assets/objects/platformSmall.png"); //platformSmall
        this.load.image("bigPlat", "assets/objects/platformBig.png"); //platformBig
        this.load.image("groundParc", "assets/bg/sol_parc.png");
        this.load.image("flaqueEau", "assets/obstacles/eau_flaque.png");
        this.load.image("flaqueBoue", "assets/obstacles/boue_flaque.png");
        this.load.image("boueLong", "assets/obstacles/boueLong.png");
        this.load.image("parc_se", "assets/bg/parc_se.png");
        this.load.image("bakery", "assets/bg/bakery.png");
        this.load.image("cielVille", "assets/bg/cielle_ville.png");
        this.load.image("cielleParc", "assets/bg/cielle_parc.png");
        this.load.image("cielleParc_se", "assets/bg/cielle_parc_se.png");
        this.load.image("mouchoirs", "assets/objects/bac_mouchoir.png");
        this.load.image("shop", "assets/bg/shop.png");
        this.load.image("merde", "assets/objects/merde_ecran.png");
        this.load.image("bird", "assets/obstacles/bird.png");
        this.load.image("caca", "assets/obstacles/caca.png");

        //effects
        this.load.image("eau_vue", "assets/objects/vue_eau.png");
        this.load.image("boue_vue", "assets/objects/boue_vue.png");
        
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

    create() {
        this.bg = this.add.tileSprite(0, 0, 1194, 834, 'intro').setOrigin(0, 0);
        this.logo = this.add.tileSprite(597, 150, 875, 113, 'logo').setOrigin(0.5, 0.5);
        this.perso = this.add.sprite(100, 712, 'player_bread_static');
        const textExplication = this.add.text(10, 50, '', {
            fontSize: '28px',
            fill: '#000'
        });
        const appuyA = this.add.text(597, 700, 'Appuyer sur A pour commencer le jeu', {
            fontSize: '36px',
            fill: '#000'
        });

        appuyA.setOrigin(0.5, 0.5);

        this.anims.create({
            key:'static_pain',
            frames: this.anims.generateFrameNumbers('player_bread_static', { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        })

        this.perso.play('static_pain');

        // Ajout d'une touche A
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        // Attendre que l'utilisateur appuie sur A
        this.input.keyboard.on('keydown-A', () => {
            this.scene.start('MainWorld');
        });
    }
}

class MainWorld extends Phaser.Scene {
    constructor() {
        super('MainWorld');
    }
    preload(){
        
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
        this.chantier = this.add.tileSprite(7320, -285, 2048, 1024, 'chantier').setOrigin(0, 0); //chantier
        this.parc2 = this.add.tileSprite(6090, -285, 880, 1024, 'parc_se').setOrigin(0, 0).setFlipX(1);
        this.shop = this.add.tileSprite(6970, -286, 2048, 1024, 'shop').setOrigin(0, 0);
        this.house2 = this.add.tileSprite(9400, 226, 2048, 512, 'background2').setOrigin(0, 0);
        this.house3 = this.add.tileSprite(11448, 226, 2048, 512, 'background').setOrigin(0, 0);
        this.bakery = this.add.tileSprite(13496, -286, 2048, 1024, 'bakery').setOrigin(0, 0);
    
        // bateau
        bateau = this.physics.add.image(4456, 610, 'bateau');
        bateau.setSize(256, 40);
        bateau.setOffset(0, 216);
        bateau.flipX = true;
        bateau.body.setImmovable(true);
        bateau.body.allowGravity = false;
        bateau.prevX = bateau.x;

        // Small Platform
        smallPlat = this.physics.add.image(8832, 445, 'smallPlat');
        smallPlat.setSize(100, 26);
        smallPlat.setOffset(-2, 263)
        smallPlat.body.setImmovable(true);
        smallPlat.body.allowGravity = false;

        // Big Platform
        bigPlat = this.physics.add.image(8392, 365, 'bigPlat');
        bigPlat.setSize(100, 26);
        bigPlat.setOffset(-2, 470)
        bigPlat.body.setImmovable(true);
        bigPlat.body.allowGravity = false;

        // bird
        const leftEdge  = -300; //Negatif pour masquer demitour
        const rightEdge = 14050 + 300; //largeur map (plus large pour masquer demitour)
        const baseMs    = 30000; //durée base

        const bird = this.add.image(leftEdge, 210, 'bird');
        bird.setDepth(940);
        bird.setFlipX(true);

        this.tweens.add({
        targets: bird,
        x: rightEdge,
        duration: baseMs,
        yoyo: true,
        repeat: -1,
        // inverse direction + random temps
        onYoyo: (tween) => {
            bird.setFlipX(!bird.flipX);
            tween.timeScale = Phaser.Math.FloatBetween(0.95, 1.10);
        },
        // repetition à chaque boucle
        onRepeat: (tween) => {
            bird.setFlipX(!bird.flipX);
            tween.timeScale = Phaser.Math.FloatBetween(0.95, 1.10);
        }
        });

        //caca
        this.poops = this.physics.add.group({
            allowGravity: true
        });
        
        const dropPoop = () => {
            const p = this.poops.create(bird.x, bird.y + 10, "caca");
            p.setDepth(1200);
            p.setVelocityX(Phaser.Math.Between(-20, 20)); //drift x
            p.setVelocityY(Phaser.Math.Between(40, 120)); //chute verticale
            p.setGravityY(800);
            p.setCollideWorldBounds(false);

            // détruit si sort très bas de l’écran
            this.time.delayedCall(8000, () => p.active && p.y > 1000 && p.destroy());

            //chute goutte suiv. (random)
            this.time.delayedCall(Phaser.Math.Between(1000, 3000), dropPoop);
        };

        dropPoop();

        // player
        const spawnX = (data && data.playerX !== undefined) ? data.playerX : 100;
        const spawnY = (data && data.playerY !== undefined) ? data.playerY : 736;

        player = this.physics.add.sprite(spawnX, spawnY, "player");
        player.setOrigin(0.5, 1);
        player.setSize(42, 90);
        player.setOffset((144 - 42) / 2, 144 - 90);
        player.body.gravity.y = 400;
        player.money = money;

        //Overlay caca
        this.physics.add.overlap(player, this.poops, (_player, poop) => {
            poop.destroy();

            if (overlayCaca) {
                overlayCaca.destroy();
                overlayCaca = null;
            }

            overlayCaca = this.add.image(0, 0, "merde").setOrigin(0, 0);
            overlayCaca.setScrollFactor(0);
            overlayCaca.setDepth(2000);
            overlayCaca.setAlpha(0.99);

            overlayStack.push(overlayCaca);
        });
    
        this.cone = this.physics.add.staticImage(30, 692, 'cone');

        // sols visuels
        this.ground = this.add.tileSprite(-40, 738, 4096, 100, 'ground').setOrigin(0, 0);
        this.ground2 = this.add.tileSprite(6104, 738, 8192, 100, 'ground').setOrigin(0, 0);
        this.parcGround = this.add.tileSprite(4056, 738, 2048, 100, 'groundParc').setOrigin(0, 0);
        // this.flaqueEau = this.add.tileSprite(1000, 736, 92, 48, 'flaqueEau').setOrigin(0, 0); -> une seule flaque en x = 1000

        //flaques d'eau à différentes positions x
        const positionsFlaques = [ 
            { x: 1000, y: 736 },
            { x: 2500, y: 736 },
            { x: 3900, y: 736 },
            { x: 6200, y: 736 },
            { x: 11200, y: 736 },
            { x: 13000, y: 736 },
        ];
        this.flaquesEau = [];

        positionsFlaques.forEach(pos => {
            const flaque = this.add.image(pos.x, pos.y, 'flaqueEau').setOrigin(0, 0);
            this.flaquesEau.push(flaque);

            const zoneEau = this.physics.add.staticImage(pos.x + 46, pos.y + 22, null)
                .setSize(92, 48)
                .setVisible(false);

            this.physics.add.overlap(player, zoneEau, () => {
                if (!overlayEau) {
                    overlayEau = this.add.image(0, 0, "eau_vue").setOrigin(0, 0);
                    overlayEau.displayWidth  = this.sys.game.config.width;
                    overlayEau.displayHeight = this.sys.game.config.height;
                    overlayEau.setAlpha(0.6);
                    overlayEau.setScrollFactor(0);
                    overlayEau.setDepth(999);
                    overlayStack.push(overlayEau);
                }
            }, null, this);
        });

        //flaques de boue à différentes positions x
        const positionsFlaques2 = [ 
            { x: 1500, y: 736 },
            { x: 3000, y: 736 },
            { x: 3500, y: 736 },
            { x: 6550, y: 736 },
            { x: 10680, y: 736 },
            { x: 12600, y: 736 },
        ];
        this.flaquesBoue = [];

        positionsFlaques2.forEach(pos => {
            const flaque = this.add.image(pos.x, pos.y, 'flaqueBoue').setOrigin(0, 0);
            this.flaquesBoue.push(flaque);

            const zoneBoue = this.physics.add.staticImage(pos.x + 46, pos.y + 22, null)
                .setSize(92, 48)
                .setVisible(false);

            this.physics.add.overlap(player, zoneBoue, () => {
                if (!overlayBoue) {
                    overlayBoue = this.add.image(0, 0, "boue_vue").setOrigin(0, 0);
                    overlayBoue.displayWidth  = this.sys.game.config.width;
                    overlayBoue.displayHeight = this.sys.game.config.height;
                    overlayBoue.setAlpha(0.9);
                    overlayBoue.setScrollFactor(0);
                    overlayBoue.setDepth(999);
                    overlayStack.push(overlayBoue);
                }
            }, null, this);
        });

        // Boue chantier
        this.boueLong = this.add.tileSprite(8346, 738, 718, 44, 'boueLong').setOrigin(0, 0);
        
        // colliders invisibles
        let groundCollider = this.physics.add.staticImage(600, 788, null).setSize(7422, 100).setVisible(false);
        let waterGroundCollider = this.physics.add.staticImage(4756, 814, null).setSize(891, 26).setVisible(false);
        let groundCollider2 = this.physics.add.staticImage(9701, 788, null).setSize(9000, 100).setVisible(false);
        let groundColliderExtra1 = this.physics.add.staticImage(4327, 786, null).setSize(34, 30).setVisible(false);
        let groundColliderExtra2 = this.physics.add.staticImage(5185, 786, null).setSize(32, 30).setVisible(false);
        let enterBakery = this.physics.add.staticImage(13564, 699, null).setSize(52, 79).setVisible(false); //entrée boulangerie
        let enterShop = this.physics.add.staticImage(7036, 699, null).setSize(51, 79).setVisible(false); //entrée shop
        let bac = this.physics.add.staticImage(7955, 716, null).setSize(150, 50).setVisible(false); //chantier - bac camion
        let truck = this.physics.add.staticImage(8155, 718, null).setSize(148, 48).setVisible(false); //chantier - camion 
        let bar1 = this.physics.add.staticImage(7868, 718, null).setSize(20, 20).setVisible(false); //chantier - bar gauche 
        let bar2 = this.physics.add.staticImage(8039, 718, null).setSize(20, 18).setVisible(false); //chantier - bar droite
        let cabh = this.physics.add.staticImage(8262, 628, null).setSize(54, 18).setVisible(false); //chantier - camion cabine haut
        let cabg = this.physics.add.staticImage(8222, 670, null).setSize(20, 40).setVisible(false); //chantier - camion cabine gauche
        let camiona = this.physics.add.staticImage(8298, 694, null).setSize(20, 60).setVisible(false); //chantier - camion avant
        let plot1 = this.physics.add.staticImage(8331, 704, null).setSize(28, 45).setVisible(false); //chantier - plot devant camion
        let plot2 = this.physics.add.staticImage(9087, 704, null).setSize(28, 45).setVisible(false); //chantier - plot gauche container
        let plot3 = this.physics.add.staticImage(9223, 704, null).setSize(28, 45).setVisible(false); //chantier - plot droite container
        let container = this.physics.add.staticImage(9156, 672, null).setSize(106, 100).setVisible(false); //chantier - container
    
        // colliders
        this.physics.add.collider(player, groundCollider);
        this.physics.add.collider(player, this.cone);
        this.physics.add.collider(player, waterGroundCollider);//sol riviere
        this.physics.add.collider(player, groundCollider2);
        this.physics.add.collider(player, groundColliderExtra1);
        this.physics.add.collider(player, groundColliderExtra2);
        this.physics.add.collider(player, bac); //chantier - bac camion 
        this.physics.add.collider(player, truck); //chantier - bac camion 
        this.physics.add.collider(player, bar1); //chantier - bar gauche
        this.physics.add.collider(player, bar2); //chantier - bar droite
        this.physics.add.collider(player, cabh); //chantier - camion cabine haut
        this.physics.add.collider(player, cabg); //chantier - camion cabine gauche
        this.physics.add.collider(player, camiona); //chantier - camion avant
        this.physics.add.collider(player, plot1); //chantier - plot camion
        this.physics.add.collider(player, plot2); //chantier - plot gauche container
        this.physics.add.collider(player, plot3); //chantier - plot droite container
        this.physics.add.collider(player, container); //chantier - container
        this.physics.add.collider(player, bateau);
        this.physics.add.collider(player, smallPlat); //Chantier plat petite grue
        this.physics.add.collider(player, bigPlat); //Chantier plat grande grue
        
        // entrer dans la boulangerie (message)
        this.physics.add.overlap(player, enterBakery, () => {
            if (!bakeryTextShown) {
                bakeryText = this.add.text(10, 50, 'Appuyer sur A pour entrer dans la boulangerie', {
                    fontSize: '28px',
                    fill: '#fff'
                });
                bakeryText.setScrollFactor(0);
                bakeryTextShown = true;
            }
        }, null, this);

        // entrer dans le shop (message)
        this.physics.add.overlap(player, enterShop, () => {
            if (!shopTextShown) {
                shopText = this.add.text(10, 50, 'Appuyer sur A pour entrer dans la boutique', {
                    fontSize: '28px',
                    fill: '#fff'
                });
                shopText.setScrollFactor(0);
                shopTextShown = true;
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
        // insecte
        this.anims.create({
            key:'fly',
            frames: this.anims.generateFrameNumbers('insects', { start: 0, end: 1 }),
            frameRate: 6,
            repeat: -1
        })
    */
        // caméra
        this.cameras.main.setBounds(0, 0, 14050, 0);
        this.cameras.main.startFollow(player, true, 0.1, 0.1, 0, 245);
    
        cursors = this.input.keyboard.createCursorKeys();
    
        // argent
        // argent (ne génère qu'une pièce à la fois)
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

        this.mouchoirText = this.add.text(400, 10, 'Mouchoirs : ' + mouchoirs, { fontSize: '28px' });
        this.mouchoirText.setScrollFactor(0);
    
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

        // animation small platform
        this.tweens.add({
            targets: smallPlat,
            x: 9036,
            duration: 3250,
            yoyo: true,
            repeat: -1,
        });

        this.physics.add.collider(player, smallPlat, () => {
            if (player.body.touching.down && smallPlat.body.touching.up) {
                playerOnPlat = true;
            }
        }, null, this);

        // animation big platform
        this.tweens.add({
            targets: bigPlat,
            x: 8678,
            duration: 3550,
            yoyo: true,
            repeat: -1,
            delay: 1625, // = duration / 2
        });

        this.physics.add.collider(player, bigPlat, () => {
            if (player.body.touching.down && bigPlat.body.touching.up) {
                playerOnPlat = true;
            }
        }, null, this);

        // récupère l'argent passé depuis la boulangerie
        if (data && data.money !== undefined) {
            money = data.money;
            this.scoreText.setText('Argent : ' + money + '$');
        }

        // Collider flaque eau
        let eau = this.physics.add.staticImage(1046, 758, null)
            .setSize(90, 48)
            .setVisible(false);

        this.physics.add.overlap(player, eau, () => {
            if (!overlayEau) {
                overlayEau = this.add.image(0, 0, "eau_vue").setOrigin(0, 0);
                overlayEau.displayWidth  = this.sys.game.config.width;
                overlayEau.displayHeight = this.sys.game.config.height;
                overlayEau.setAlpha(0.6);
                overlayEau.setScrollFactor(0);
                overlayEau.setDepth(999);

                overlayStack.push(overlayEau);
            }
        }, null, this);

        // Collider flaque boue
        let boue = this.physics.add.staticImage(8705, 758, null)
            .setSize(718, 48)
            .setVisible(false);

        this.physics.add.overlap(player, boue, () => {
            if (!overlayBoue) {
                overlayBoue = this.add.image(0, 0, "boue_vue").setOrigin(0, 0);
                overlayBoue.displayWidth  = this.sys.game.config.width;
                overlayBoue.displayHeight = this.sys.game.config.height;
                overlayBoue.setAlpha(0.8);
                overlayBoue.setScrollFactor(0);
                overlayBoue.setDepth(1000);

                overlayStack.push(overlayBoue);
            }
        }, null, this);

        //Collider rivière
        let overlayVisible = false;
        let overlay2 = null;

        // Détection contact eau
        let eauRiviere = this.add.zone(4756, 790, 891, 10);
        this.physics.add.existing(eauRiviere, true);

        this.physics.add.overlap(player, eauRiviere, () => {
        if (!overlayVisible) {
            overlayVisible = true;

            if (!overlay2) {
            overlay2 = this.add.rectangle(
                0, 0,
                this.sys.game.config.width,
                this.sys.game.config.height,
                0x1A74CC
            ).setOrigin(0);

            overlay2.setScrollFactor(0);
            overlay2.setAlpha(0.9);
            overlay2.setDepth(950);
            }

            if (overlayEau) {
                overlayEau.destroy();
                overlayEau = null;
            }
        }
        }, null, this);

        this.events.on('update', () => {
        const isTouching = Phaser.Geom.Intersects.RectangleToRectangle(
            player.getBounds(),
            eauRiviere.getBounds()
        );

        // Sortie de l'eau
        if (!isTouching && overlayVisible) {
            overlayVisible = false;

            // Masque fond bleu (quand hors de l'eau)
            if (overlay2) {
            overlay2.destroy();
            overlay2 = null;
            }

            // Affichage flaque que à sortie
            if (!overlayEau) {
            overlayEau = this.add.image(0, 0, "eau_vue").setOrigin(0, 0);
            overlayEau.displayWidth  = this.sys.game.config.width;
            overlayEau.displayHeight = this.sys.game.config.height;
            overlayEau.setAlpha(0.6);
            overlayEau.setScrollFactor(0);
            overlayEau.setDepth(999);
            overlayStack.push(overlayEau);
            }
        }
        });
        
        this.physics.add.overlap(player, this.poops, (_player, poop) => {
            poop.destroy();
            const splash = this.add.image(0, 0, "merde").setOrigin(0, 0);
            splash.setScrollFactor(0);
            splash.setDepth(2000);
            splash.setAlpha(0.95);
        });

        //effacer overlays avec E
        keyObjectE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        this.input.keyboard.on("keydown-E", () => {
        if (mouchoirs <= 0) return;
        if (overlayStack.length === 0) return;

        const lastOverlay = overlayStack.pop();

        if (lastOverlay) {
            lastOverlay.destroy();
            if (lastOverlay === overlayEau) overlayEau = null;
            if (lastOverlay === overlayBoue) overlayBoue = null;
            if (lastOverlay === overlayCaca) overlayCaca = null;
        }

        mouchoirs -= 1;
        this.mouchoirText.setText("Mouchoirs : " + mouchoirs);
        });
        // this.physics.world.createDebugGraphic();

    }
    
    update() {
        player.setVelocityX(0);
        // Saut
        if (Phaser.Input.Keyboard.JustDown(cursors.up) && player.body.onFloor()) {
            player.setVelocityY(-230);
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
        if (player.x > 14040) player.x = 14040;

        // texte "entrer"
        if (bakeryTextShown) {
            const distance = Phaser.Math.Distance.Between(player.x, player.y, 13564, 699);
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
            const distance2 = Phaser.Math.Distance.Between(player.x, player.y, 13564, 699);

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

        if (shopTextShown) {
            const distance = Phaser.Math.Distance.Between(player.x, player.y, 7036, 699);
            if (distance > 100) {
                if (shopText) {
                    shopText.destroy();
                    shopText = null;
                    shopTextShown = false;
                }
            }
        }

        // touche A pour entrer dans la boulangerie
        if (keyObject.isDown && bakeryTextShown && !playerHasBread){
            this.scene.start('BakeryScene', {
                returnX: player.x,
                returnY: player.y,
                money: money,
                playerHasBread
            });  
        }

        // touche A pour entrer dans le shop
        if (keyObject.isDown && shopTextShown){
            this.scene.start('ShopScene', {
                returnX: player.x,
                returnY: player.y,
                money: money,
                playerHasBread
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

        // Small PLatform
        let onSmallPlat =
            player.body.touching.down &&
            smallPlat.body.touching.up &&
            Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), smallPlat.getBounds());

        if (onSmallPlat) {
            const deltaX = smallPlat.x - (smallPlat.prevX || smallPlat.x);
            player.x += deltaX;
        }
        smallPlat.prevX = smallPlat.x;

        // Big Platform
        let onBigPlat =
            player.body.touching.down &&
            bigPlat.body.touching.up &&
            Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), bigPlat.getBounds());

        if (onBigPlat) {
            const deltaX = bigPlat.x - (bigPlat.prevX || bigPlat.x);
            player.x += deltaX;
        }
        bigPlat.prevX = bigPlat.x;
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
        player = this.physics.add.sprite(184, 736, "player");
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

class ShopScene extends Phaser.Scene {
    constructor() {
        super('ShopScene');
    }

    preload() {

    }

    create(data) {
        this.returnX = data.returnX;
        this.returnY = data.returnY;

        player = this.physics.add.sprite(100, 736, "player");
        player.setOrigin(0.5, 1);
        player.setSize(42, 90);
        player.setOffset((144 - 42) / 2, 144 - 90);
        player.body.gravity.y = 400;

        let groundColliderShop = this.physics.add.staticImage(600, 784, null).setSize(1200, 100).setVisible(false);
        this.physics.add.collider(player, groundColliderShop);
        
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        this.canExit = false;
        this.time.delayedCall(500, () => { this.canExit = true; });
    }

    update() {
        // sortir du shop
        if (Phaser.Input.Keyboard.JustDown(this.keyA)) {
            this.scene.start('MainWorld', {
                playerX: this.returnX,
                playerY: this.returnY,
                money: money,
                playerHasBread
            });
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 1194,
    height: 834,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: true }
    },
    render: { pixelArt: true, antialias: false }, // ajout pour une image nette (eau)
    scene: [LoadingScene, MainWorld, BakeryScene, ShopScene]
};

const game = new Phaser.Game(config);
