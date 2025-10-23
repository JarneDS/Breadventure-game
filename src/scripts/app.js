import "phaser";

// code de Front Face Observer par Bram Stein https://github.com/bramstein/fontfaceobserver
var FontFaceObserver = require('fontfaceobserver');

var font = new FontFaceObserver('Fira Sans Condensed');

font.load().then(function () {});

let cursors;
let money = 2; // valeur par défaut
let bakeryTextShown = false;
let houseTextShown = false; //texte maison
let bakeryText = null;
let bakeryTextShown2 = false;
let bakeryText2 = null;
let shopTextShown2 = false;
let shopText2 = null;
let painPrisShown = false;
let painPris = null;
let keyObject;
let keyObjectE;

//timer
let runTimerText = null;
let lastRunTimeMs = 0;
let runTimerActive = false;
let runTimerStart = 0;

function formatElapsed(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const millis  = ms % 1000;
    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");
    const mmm = String(millis).padStart(3, "0");
    return `${mm}:${ss}.${mmm}`;
}

let overlayEau = null; //flaque eau
let overlayBoue = null; //flaque boue
let overlayCaca = null; //caca bird
let glassesRain = null; //overlay pluie
let blurRain = null; //pluie blur lunettes

let overlayStack = []; //pile des overlays -> utile pour effacer le denier apparu

let mouchoirs = 10; //valeur par défaut - valeur TEST -> à modifier
let shopTextShown = false; //affichage texte shop
let shopText = null; //texte shop
let houseText = null; //affichage texte maison

//let insects;
let playerOnBoat;
let playerOnPlat;
let playerHasBread = false;

let playerHasUmbrella = false;
let playerHasMouchoirs = false;


let playerHasBrum = false;

let selectedCharacter = 'henri';
let character;
let perso;
let gameSpritesLayers;

let hasJumped = false;

function loadCharacterSprites(character) {
    // walking
    this.load.spritesheet(`player_walking_${character}`, `assets/player/${character}walking.png`,{
        frameWidth: 144,
        frameHeight: 144,
    })
    this.load.spritesheet(`player_umbrella_walking_${character}`, `assets/player/${character}umbrellawalking.png`, {
        frameWidth: 144,
        frameHeight: 144,
    })
    this.load.spritesheet(`player_bread_walking_${character}`, `assets/player/${character}breadwalking.png`, {
        frameWidth: 144,
        frameHeight: 144,
    })
    this.load.spritesheet(`player_brum_walking_${character}`, `assets/player/${character}brumwalking.png`, {
        frameWidth: 144,
        frameHeight: 144,
    })

    // static
    this.load.spritesheet(`player_static_${character}`, `assets/player/${character}static.png`,{
        frameWidth: 144,
        frameHeight: 144,
    })
    this.load.spritesheet(`player_umbrella_static_${character}`, `assets/player/${character}umbrella.png`, {
        frameWidth: 144,
        frameHeight: 144,
    })
    this.load.spritesheet(`player_bread_static_${character}`, `assets/player/${character}bread.png`, {
        frameWidth: 144,
        frameHeight: 144,
    })
    this.load.spritesheet(`player_brum_static_${character}`, `assets/player/${character}brum.png`, {
        frameWidth: 144,
        frameHeight: 144,
    })

    // jumping
    this.load.spritesheet(`player_jumping_${character}`, `assets/player/${character}jumping.png`, {
        frameWidth: 144,
        frameHeight: 144,
    })
    this.load.spritesheet(`player_umbrella_jumping_${character}`, `assets/player/${character}umbrellajumping.png`, {
        frameWidth: 144,
        frameHeight: 144,
    })
    this.load.spritesheet(`player_bread_jumping_${character}`, `assets/player/${character}breadjumping.png`, {
        frameWidth: 144,
        frameHeight: 144,
    })
    this.load.spritesheet(`player_brum_jumping_${character}`, `assets/player/${character}brumjumping.png`, {
        frameWidth: 144,
        frameHeight: 144,
    })
    this.load.spritesheet(`player_receiveBread_${character}_sheet`, `assets/player/${character}obtentionPain.png`, {
        frameWidth: 144,
        frameHeight: 144,
    })
    this.load.spritesheet(`player_receiveUmbrella_${character}`, `assets/player/${character}obtentionParapluie.png`, {
        frameWidth: 144,
        frameHeight: 144,
    })
}
class LoadingScene extends Phaser.Scene {

    constructor() {
        super('LoadingScene');
        this.player;
    }

    preload() {
        this.load.image("logo", "assets/logo/logo.png");
        this.load.image("intro", "assets/bg/intro.png");
        // assets
        this.load.image("henri","assets/player/henri.png");
        this.load.image("juliette","assets/player/juliette.png");
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
        this.load.image("cielVille", "assets/bg/ciel_ville.png");
        this.load.image("cielVille2", "assets/bg/ciel_ville2.png");
        this.load.image("cielParc", "assets/bg/ciel_parc.png");
        this.load.image("cielParc_se", "assets/bg/ciel_parc_se.png");
        this.load.image("shop", "assets/bg/shop.png");
        this.load.image("merde", "assets/objects/merde_ecran.png");
        this.load.image("caca", "assets/obstacles/caca.png");

        //effects
        this.load.image("eau_vue", "assets/objects/vue_eau.png");
        this.load.image("boue_vue", "assets/objects/boue_vue.png");
        this.load.image("glassesRain", "assets/objects/pluie_lunettes.png")

        // bakery
        this.load.image("interieur_bakery", "assets/bg/interieur_bakery.png");
        this.load.image("pain", "assets/objects/pain.png");

         // shop
        this.load.image("interieur_shop", "assets/bg/interieur_shop.png");
        this.load.image("parapluie", "assets/objects/parapluie.png");
        this.load.image("mouchoirs", "assets/objects/mouchoirs.png");
 
        // pluie
        this.load.spritesheet("rain", "assets/objects/pluie.png", {
            frameWidth: 2048,
            frameHeight: 1024,
        })

        //bird
        this.load.spritesheet("bird", "assets/obstacles/bird.png", {
            frameWidth: 64,
            frameHeight: 64,
        });

        this.load.spritesheet("lunettes", "assets/objects/anim_lunette.png", {
            frameWidth: 1194,
            frameHeight: 1024,
        })
        this.load.spritesheet("arrow", "assets/objects/fleche.png", {
            frameWidth: 64,
            frameHeight: 64,
        })
        
    /*
        //insectes
        this.load.spritesheet("insects", "assets/obstacles/insectes.png", {
            frameWidth: 56,
            frameHeight: 42,
        })
    */

        // sons
        this.load.audio('bateau', 'assets/sounds/bateau.mp3');
        this.load.audio('boue', 'assets/sounds/boue.mp3');
        this.load.audio('construction', 'assets/sounds/construction.mp3');
        this.load.audio('eau', 'assets/sounds/eau.mp3');
        this.load.audio('insectes', 'assets/sounds/insecte.mp3');
        this.load.audio('jump', 'assets/sounds/jump.mp3');
        this.load.audio('loadingScene', 'assets/sounds/loading2.mp3');
        this.load.audio('marcheBoue', 'assets/sounds/marche_boue.mp3');
        this.load.audio('marcheEauFlaque', 'assets/sounds/marche_flaque.mp3');
        this.load.audio('marcheRiviere', 'assets/sounds/marcheRiviere.mp3');
        this.load.audio('merdePigeon', 'assets/sounds/merdePigeon.mp3');
        this.load.audio('money', 'assets/sounds/money.mp3');
        this.load.audio('parc', 'assets/sounds/parc.mp3');
        this.load.audio('pigeon', 'assets/sounds/pigeon.mp3');
        this.load.audio('pluie', 'assets/sounds/pluie.mp3');
        this.load.audio('porteOuvre', 'assets/sounds/porteOuvre.mp3');
        this.load.audio('ville', 'assets/sounds/ville.mp3');
        // pas charger loading.mp3 , plouf_dans_riviere.mp3

        loadCharacterSprites.call(this, 'henri');
        loadCharacterSprites.call(this, 'juliette');
    }

    create() {
        // son
        const loadingSceneSon = this.sound.add('loadingScene');
        loadingSceneSon.play({ loop: true });
        // animations
        // base
        let characters = ['henri', 'juliette'];
        characters.forEach((char) => {
            this.anims.create({
                key:`walking_${char}`,
                frames: this.anims.generateFrameNumbers(`player_walking_${char}`, { start: 0, end: 5 }),
                frameRate: 24,
                repeat: -1
            })
            this.anims.create({
                key:`static_${char}`,
                frames: this.anims.generateFrameNumbers(`player_static_${char}`, { start: 0, end: 1 }),
                frameRate: 3,
                repeat: -1
            })
            this.anims.create({
                key:`jumping_${char}`,
                frames: this.anims.generateFrameNumbers(`player_jumping_${char}`, { start: 0, end: 2 }),
                frameRate: 6,
                repeat: 0
            })

            // pain
            this.anims.create({
                key:`walking_bread_${char}`,
                frames: this.anims.generateFrameNumbers(`player_bread_walking_${char}`, { start: 0, end: 5 }),
                frameRate: 24,
                repeat: -1
            })
            this.anims.create({
                key:`static_bread_${char}`,
                frames: this.anims.generateFrameNumbers(`player_bread_static_${char}`, { start: 0, end: 1 }),
                frameRate: 3,
                repeat: -1
            })
            this.anims.create({
                key:`jumping_bread_${char}`,
                frames: this.anims.generateFrameNumbers(`player_bread_jumping_${char}`, { start: 0, end: 2 }),
                frameRate: 6,
                repeat: 0
            })

            // umbrella
            this.anims.create({
                key:`walking_umbrella_${char}`,
                frames: this.anims.generateFrameNumbers(`player_umbrella_walking_${char}`, { start: 0, end: 5 }),
                frameRate: 24,
                repeat: -1
            })
            this.anims.create({
                key:`static_umbrella_${char}`,
                frames: this.anims.generateFrameNumbers(`player_umbrella_static_${char}`, { start: 0, end: 1 }),
                frameRate: 3,
                repeat: -1
            })
            this.anims.create({
                key:`jumping_umbrella_${char}`,
                frames: this.anims.generateFrameNumbers(`player_umbrella_jumping_${char}`, { start: 0, end: 2 }),
                frameRate: 6,
                repeat: 0
            })

            // brum
            this.anims.create({
                key:`walking_brum_${char}`,
                frames: this.anims.generateFrameNumbers(`player_brum_walking_${char}`, { start: 0, end: 5 }),
                frameRate: 24,
                repeat: -1
            })
            this.anims.create({
                key:`static_brum_${char}`,
                frames: this.anims.generateFrameNumbers(`player_brum_static_${char}`, { start: 0, end: 1 }),
                frameRate: 3,
                repeat: -1
            })
            this.anims.create({
                key:`jumping_brum_${char}`,
                frames: this.anims.generateFrameNumbers(`player_brum_jumping_${char}`, { start: 0, end: 2 }),
                frameRate: 6,
                repeat: 0
            })
            // Supprime d’éventuelles anciennes versions d’animations
            this.anims.remove(`receive_bread_${char}`);
            this.anims.remove(`receive_umbrella_${char}`);

            // Crée les animations à partir des bons spritesheets
            this.anims.create({
                key:`receive_bread_${char}`,
                frames: this.anims.generateFrameNumbers(`player_receiveBread_${char}_sheet`, { start: 0, end: 3 }),
                frameRate: 6,
                repeat: 0
            });

            this.anims.create({
                key:`receive_umbrella_${char}`,
                frames: this.anims.generateFrameNumbers(`player_receiveUmbrella_${char}`, { start: 0, end: 3 }),
                frameRate: 6,
                repeat: 0
            });
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
        this.anims.create({
            key: 'rain_loop',
            frames: this.anims.generateFrameNumbers('rain', { start: 0, end: 4 }),
            frameRate: 24,
            repeat: -1
        })

        this.anims.create({
            key:'bird_fly',
            frames: this.anims.generateFrameNumbers('bird', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key:'arrow',
            frames: this.anims.generateFrameNumbers('arrow', { start: 0, end: 6 }),
            frameRate: 12,
            repeat: -1
        })

        this.anims.create({
            key:'glasses',
            frames: this.anims.generateFrameNumbers('lunettes', { start: 0, end: 10 }),
            frameRate: 12,
            repeat: 0
        })

        this.bg = this.add.tileSprite(0, 0, 1194, 834, 'intro').setOrigin(0, 0);
        this.logo = this.add.tileSprite(597, 150, 873, 105, 'logo').setOrigin(0.5, 0.5);
        perso = this.add.sprite(100, 712, 'player_bread_static_henri');

        const textExplication = this.add.text(597, 340, 'Veuillez utiliser <- et -> pour changer de personnage', {
            fontSize: '28px',
            fill: '#000F05',
            fontFamily: 'Fira Sans Condensed',
            fontStyle: 'bold',
            backgroundColor: "rgba(255,255,255,0.4)",
            padding: { x: 6, y: 3 }
        });

        textExplication.setOrigin(0.5, 0.5);

        const appuyA = this.add.text(597, 600, 'Appuyer sur A pour commencer le jeu avec ' + selectedCharacter, {
            fontSize: '36px',
            fill: '#000F05',
            fontFamily: 'Fira Sans Condensed',
            fontStyle: 'bold',
            backgroundColor: "rgba(255,255,255,0.4)",
            padding: { x: 6, y: 3 }
        });

        appuyA.setOrigin(0.5, 0.5);

        perso.play('static_bread_henri');

    
        let selectedIndex = 0; // 0 = henri, 1 = juliette

        const selectPlayer = this.add.sprite(517, 450, 'henri');
        selectPlayer.name = 'henri';
        const selectPlayer2 = this.add.sprite(677, 450, 'juliette');
        selectPlayer2.name = 'juliette';

        // Tableau des personnages pour simplifier la navigation
        const character = [selectPlayer, selectPlayer2];
        const names = ['henri', 'juliette'];

        // Ajoute le clavier
        const keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // Fonction pour mettre à jour la surbrillance visuelle
        function updateSelection() {
            character.forEach((char, index) => {
                if (index === selectedIndex) {
                    selectedCharacter = char.name;
                    perso.play(`static_bread_${char.name}`);
                    char.setAlpha(1);
                } else {
                    char.setAlpha(0.7);
                }
            });
            perso.play(`static_bread_${selectedCharacter}`);

            appuyA.setText('Appuyer sur A pour commencer le jeu avec ' + selectedCharacter.charAt(0).toUpperCase() + selectedCharacter.slice(1));
        }

        // Initialisation de la surbrillance
        updateSelection();

        // Gestion des entrées clavier dans la méthode update()
        this.input.keyboard.on('keydown-LEFT', () => {
            selectedIndex = (selectedIndex - 1 + character.length) % character.length;
            updateSelection();
        });

        this.input.keyboard.on('keydown-RIGHT', () => {
            selectedIndex = (selectedIndex + 1) % character.length;
            updateSelection();
        });

        cursors = this.input.keyboard.createCursorKeys();

        // Ajout d'une touche A
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        // Attendre que l'utilisateur appuie sur A
        this.input.keyboard.on('keydown-A', () => {
            const charToSend = selectedCharacter || 'henri';
            this.scene.start('Glasses', { character: charToSend });
            loadingSceneSon.stop();
        });
    }
}

class Glasses extends Phaser.Scene {
    constructor() {
        super('Glasses');
    }

    preload(){
    }

   create(data){
        selectedCharacter = (data && data.character) ? data.character : 'henri';
        this.cameras.main.postFX.addBlur(8);

        this.bg = this.add.tileSprite(0, 0, 1194, 834, 'intro').setOrigin(0, 0);
        
        const lunettes = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'lunettes');
        lunettes.anims.play('glasses', true);

        lunettes.on('animationcomplete', () => {
            this.scene.start('MainWorld', { character: selectedCharacter });
        });
    }

    
    update(){
    }
}

class MainWorld extends Phaser.Scene {
    
    constructor() {
        super('MainWorld');
        this.bigPlat;
        this.smallPlat;
        this.bateau;
    }

    stopAmbianceSounds() {
        for (let key in this.zoneSounds) {
            this.zoneSounds[key].stop();
        }
        if (this.pluieSon && this.pluieSon.isPlaying) {
            this.pluieSon.stop();
        }
    }

    preload(data){
        const character = (data && data.character) ? data.character : 'henri';
        this.obstacles = [];
        loadCharacterSprites.call(this, character);
    }

    create(data){
        selectedCharacter = (data && data.character) ? data.character : 'henri';
        gameSpritesLayers = this.add.layer(); // On déclare la variable à l'avance pour éviter une erreur de référence
        this.player = data.player;

        keyObject = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        Phaser.Input.Keyboard.JustDown(keyObject);

        cursors = this.input.keyboard.createCursorKeys();

        // permet fonctionnement des flaques après sortie bakery
        overlayEau = null;
        overlayBoue = null;
        overlayCaca = null;
        glassesRain = null;
        blurRain = null; //pluie blur lunettes
        overlayStack = [];

        // ciel + décors
        this.ciel1 = this.add.tileSprite(-140, -286, 4396, 1940, 'cielVille').setOrigin(0, 0);
        this.ciel2 = this.add.tileSprite(4056, -286, 2048, 1024, 'cielParc').setOrigin(0, 0);
        this.ciel3 = this.add.tileSprite(6090, -286, 880, 1024, 'cielParc_se').setOrigin(0, 0).setFlipX(1);
        this.ciel4 = this.add.tileSprite(6970, -286, 7080, 1024, 'cielVille2').setOrigin(0, 0);

        // exec quand le jeu est chargé une premiere fois
        this.house = this.add.tileSprite(-40, 226, 4096, 512, 'background').setOrigin(0, 0);
        this.parc = this.add.tileSprite(4056, -185, 2048, 924, 'background1').setOrigin(0, 0);
        this.chantier = this.add.tileSprite(7320, -285, 2048, 1024, 'chantier').setOrigin(0, 0); //chantier
        this.parc2 = this.add.tileSprite(6090, -285, 880, 1024, 'parc_se').setOrigin(0, 0).setFlipX(1);
        this.shop = this.add.tileSprite(6970, -286, 2048, 1024, 'shop').setOrigin(0, 0);
        this.house2 = this.add.tileSprite(9400, 226, 2048, 512, 'background').setOrigin(0, 0);
        this.house3 = this.add.tileSprite(11448, 226, 2048, 512, 'background').setOrigin(0, 0);
        this.bakery = this.add.tileSprite(13496, -286, 2048, 1024, 'bakery').setOrigin(0, 0);

        const arrow = this.add.sprite(7140, 630, 'arrow');
        arrow.anims.play('arrow', true);
        arrow.setDepth(1000);

        const arrow2 = this.add.sprite(13758, 630, 'arrow');
        arrow2.anims.play('arrow', true);
        arrow2.setDepth(1000);

        if (playerHasBread) {
            const arrow3 = this.add.sprite(352, 630, 'arrow');
            arrow3.anims.play('arrow', true);
            arrow3.setDepth(1000);
        }

        // sons
        this.insectesSon = this.sound.add('insectes');
        this.marcheBoueSon = this.sound.add('marcheBoue');
        this.marcheEauFlaqueSon = this.sound.add('marcheEauFlaque');
        this.marcheRiviereSon = this.sound.add('marcheRiviere');
        this.merdePigeonSon = this.sound.add('merdePigeon');
        this.moneySon = this.sound.add('money');
        this.pigeonSon = this.sound.add('pigeon', { loop: true });
        this.pigeonSonPlaying = false;

        this.pluieSon = this.sound.add('pluie');
        this.porteOuvreSon = this.sound.add('porteOuvre');
        // Sons d'ambiance
        this.zoneSounds = {
            ville: this.sound.add('ville', { loop: true, volume: 0 }),
            bateau: this.sound.add('bateau', { loop: true, volume: 0 }),
            parc: this.sound.add('parc', { loop: true, volume: 0 }),
            construction: this.sound.add('construction', { loop: true, volume: 0 })
        };

        for (let key in this.zoneSounds) {
            this.zoneSounds[key].play();
        }

        this.currentZone = null;
        this.lastZone = null;

        
        // bateau
        this.bateau = this.physics.add.image(4456, 610, 'bateau');
        this.bateau.setSize(256, 40);
        this.bateau.setOffset(0, 216);
        this.bateau.flipX = true;
        this.bateau.body.setImmovable(true);
        this.bateau.body.allowGravity = false;
        this.bateau.prevX = this.bateau.x;

        // Small Platform
        this.smallPlat = this.physics.add.image(8832, 445, 'smallPlat');
        this.smallPlat.setSize(100, 26);
        this.smallPlat.setOffset(-2, 263)
        this.smallPlat.body.setImmovable(true);
        this.smallPlat.body.allowGravity = false;

        // Big Platform
        this.bigPlat = this.physics.add.image(8392, 365, 'bigPlat');
        this.bigPlat.setSize(100, 26);
        this.bigPlat.setOffset(-2, 470)
        this.bigPlat.body.setImmovable(true);
        this.bigPlat.body.allowGravity = false;

        // bird
        const leftEdge  = -300; //Negatif pour masquer demitour
        const rightEdge = 14050 + 300; //largeur map (plus large pour masquer demitour)
        const baseMs    = 30000; //durée base

        this.bird = this.add.sprite(leftEdge, 210, 'bird');
        this.bird.setDepth(940);
        this.bird.setFlipX(true);
        this.bird.anims.play('bird_fly', true);

        this.tweens.add({
            targets: this.bird,
            x: rightEdge,
            duration: baseMs,
            yoyo: true,
            repeat: -1,
            // inverse direction + random temps
            onYoyo: (tween) => {
                this.bird.setFlipX(!this.bird.flipX);
                tween.timeScale = Phaser.Math.FloatBetween(0.95, 1.10);
            },
            // repetition à chaque boucle
            onRepeat: (tween) => {
                this.bird.setFlipX(!this.bird.flipX);
                tween.timeScale = Phaser.Math.FloatBetween(0.95, 1.10);
            }
        });

        //caca
        this.poops = this.physics.add.group({
            allowGravity: true
        });
        
        const dropPoop = () => {
            const p = this.poops.create(this.bird.x, this.bird.y + 10, "caca");
            p.setDepth(900);
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
        const spawnY = (data && data.playerY !== undefined) ? data.playerY : 738;

        this.player = this.physics.add.sprite(spawnX, spawnY, `player_${selectedCharacter.name}`);
        this.player.setOrigin(0.5, 1);
        this.player.setSize(42, 90);
        this.player.setOffset((144 - 42) / 2, 144 - 90);
        this.player.body.gravity.y = 400;
        this.player.money = money;

        //Overlay caca
        this.physics.add.overlap(this.player, this.poops, (_player, poop) => {
            poop.destroy();

            if (playerHasUmbrella) return;

            if (overlayCaca) {
                overlayCaca.destroy();
                overlayCaca = null;
            }

            overlayCaca = this.add.image(0, 0, "merde").setOrigin(0, 0);
            overlayCaca.setScrollFactor(0);
            overlayCaca.setDepth(2000);
            overlayStack.push(overlayCaca);
        });
    
        this.cone = this.physics.add.staticImage(30, 692, 'cone');

        // sols visuels
        this.ground = this.add.tileSprite(-40, 738, 4096, 100, 'ground').setOrigin(0, 0);
        this.ground2 = this.add.tileSprite(6104, 738, 8192, 100, 'ground').setOrigin(0, 0);
        this.parcGround = this.add.tileSprite(4056, 738, 2048, 100, 'groundParc').setOrigin(0, 0);

        //flaques d'eau à différentes positions x
        const positionsFlaques = [ 
            { x: 1000, y: 735 },
            { x: 2500, y: 735 },
            { x: 3900, y: 735 },
            { x: 6200, y: 735 },
            { x: 11200, y: 735 },
            { x: 13000, y: 735 },
        ];
        this.flaquesEau = [];

        positionsFlaques.forEach(pos => {
            const flaque = this.add.image(pos.x, pos.y, 'flaqueEau').setOrigin(0, 0);
            this.flaquesEau.push(flaque);

            const zoneEau = this.physics.add.staticImage(pos.x + 46, pos.y + 22, null)
                .setSize(92, 48)
                .setVisible(false);

            this.physics.add.overlap(this.player, zoneEau, () => { // gère la zone d'eau rivière avec bateau
                if (!this.marcheEauFlaqueSon.isPlaying) {
                    this.marcheEauFlaqueSon.play({ volume: 1 });
                }
                
                if (!overlayEau) {
                    overlayEau = this.add.image(0, 0, "eau_vue").setOrigin(0, 0);
                    overlayEau.displayWidth  = this.sys.game.config.width;
                    overlayEau.displayHeight = this.sys.game.config.height;
                    overlayEau.setAlpha(0.8);
                    overlayEau.setScrollFactor(0);
                    overlayEau.setDepth(999);
                    overlayStack.push(overlayEau);
                }
            }, null, this);
        });

        //flaques de boue à différentes positions x
        const positionsFlaques2 = [ 
            { x: 1500, y: 735 },
            { x: 3000, y: 735 },
            { x: 3500, y: 735 },
            { x: 6550, y: 735 },
            { x: 10680, y: 735 },
            { x: 12600, y: 735 },
        ];
        this.flaquesBoue = [];

        positionsFlaques2.forEach(pos => {
            const flaque = this.add.image(pos.x, pos.y, 'flaqueBoue').setOrigin(0, 0);
            this.flaquesBoue.push(flaque);

            const zoneBoue = this.physics.add.staticImage(pos.x + 46, pos.y + 22, null)
                .setSize(92, 48)
                .setVisible(false);

            this.physics.add.overlap(this.player, zoneBoue, () => { // gère la zone de boue
                if (!this.marcheBoueSon.isPlaying) {
                    this.marcheBoueSon.play({ volume: 1 });
                }
                
                if (!overlayBoue) {
                    overlayBoue = this.add.image(0, 0, "boue_vue").setOrigin(0, 0);
                    overlayBoue.displayWidth  = this.sys.game.config.width;
                    overlayBoue.displayHeight = this.sys.game.config.height;
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
        let enterBakery = this.physics.add.staticImage(13760, 699, null).setSize(52, 79).setVisible(false); //entrée boulangerie
        let enterShop = this.physics.add.staticImage(7140, 699, null).setSize(51, 79).setVisible(false); //entrée shop
        let enterHouse= this.physics.add.staticImage(353, 699, null).setSize(51, 79).setVisible(false); //entrée maison
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
        this.physics.add.collider(this.player, groundCollider);
        this.physics.add.collider(this.player, this.cone);
        this.physics.add.collider(this.player, waterGroundCollider);//sol riviere
        this.physics.add.collider(this.player, groundCollider2);
        this.physics.add.collider(this.player, groundColliderExtra1);
        this.physics.add.collider(this.player, groundColliderExtra2);
        this.physics.add.collider(this.player, bac); //chantier - bac camion 
        this.physics.add.collider(this.player, truck); //chantier - bac camion 
        this.physics.add.collider(this.player, bar1); //chantier - bar gauche
        this.physics.add.collider(this.player, bar2); //chantier - bar droite
        this.physics.add.collider(this.player, cabh); //chantier - camion cabine haut
        this.physics.add.collider(this.player, cabg); //chantier - camion cabine gauche
        this.physics.add.collider(this.player, camiona); //chantier - camion avant
        this.physics.add.collider(this.player, plot1); //chantier - plot camion
        this.physics.add.collider(this.player, plot2); //chantier - plot gauche container
        this.physics.add.collider(this.player, plot3); //chantier - plot droite container
        this.physics.add.collider(this.player, container); //chantier - container
        this.physics.add.collider(this.player, this.bateau);
        this.physics.add.collider(this.player, this.smallPlat); //Chantier plat petite grue
        this.physics.add.collider(this.player, this.bigPlat); //Chantier plat grande grue

        // entrer dans la boulangerie (message)
        this.physics.add.overlap(this.player, enterBakery, () => {
            if (!bakeryTextShown) {
                bakeryText = this.add.text(10, 50, 'Appuyer sur A pour entrer dans la boulangerie', {
                    fontSize: '28px',
                    fill: '#000F05',
                    fontFamily: 'Fira Sans Condensed',
                    fontStyle: 'bold',
                    backgroundColor: "rgba(255,255,255,0.4)",
                    padding: { x: 6, y: 3 }
                });
                bakeryText.setScrollFactor(0);
                bakeryTextShown = true;
                bakeryText.setDepth(950);
            }
        }, null, this);

        // entrer dans le shop (message)
        this.physics.add.overlap(this.player, enterShop, () => {
            if (!shopTextShown) {
                shopText = this.add.text(10, 50, 'Appuyer sur A pour entrer dans la boutique', {
                    fontSize: '28px',
                    fill: '#000F05',
                    fontFamily: 'Fira Sans Condensed',
                    fontStyle: 'bold',
                    backgroundColor: "rgba(255,255,255,0.4)",
                    padding: { x: 6, y: 3 }
                });
                shopText.setScrollFactor(0);
                shopTextShown = true;
                shopText.setDepth(950);
            }
        }, null, this);

        // entrer dans maison
        this.physics.add.overlap(this.player, enterHouse, () => {
            if (!houseTextShown && playerHasBread) {
                houseText = this.add.text(10, 50, 'Appuyer sur A pour rentrer chez vous', {
                    fontSize: '28px',
                    fill: '#000F05',
                    fontFamily: 'Fira Sans Condensed',
                    fontStyle: 'bold',
                    backgroundColor: "rgba(255,255,255,0.4)",
                    padding: { x: 6, y: 3 }
                });
                houseText.setScrollFactor(0);
                houseTextShown = true;
                houseText.setDepth(950);
            }
        }, null, this);
    
        
        // caméra
        this.cameras.main.setBounds(0, 0, 14050, 0);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1, 0, 245);
    
        // argent (ne génère qu'une pièce à la fois)
        if (this.obstacles.length === 0) { // mise en place zone interdite pour éviter spawn money dans zones inaccessibles
            const zonesInterdites = [
                { min: 4300, max: 5200 }, // zone bateau
                { min: 7800, max: 9300 }, // chantier
                { min: 13700, max: 14000 }, // bakery
                { min: 7100, max: 7300 }, // shop
            ];

            const isInZonesInterdites = (x) => {
                return zonesInterdites.some(zone => x >= zone.min && x <= zone.max);
            };

            for (let i = 0; i < 5; i++) {
                let randomX;
                do {
                    randomX = Phaser.Math.Between(1200, 10000);
                } while (isInZonesInterdites(randomX));

                let obstacle = this.physics.add.staticImage(randomX, 695, 'money');
                this.obstacles.push(obstacle);

                this.physics.add.overlap(this.player, obstacle, () => {
                    obstacle.destroy();
                    money += 1;

                    if (!this.moneySon.isPlaying) {
                        this.moneySon.play({ volume: 1 });
                    }

                    this.scoreText.setText('Argent : ' + money + "$");
                }, null, this);
            }
        }

        // HUD argent
        this.uiLayer = this.add.layer().setDepth(10000);

        this.scoreText = this.add.text(10, 10, 'Argent : ' + money + '$', {
            fontSize: '28px',
            fill: '#000F05',
            fontFamily: 'Fira Sans Condensed',
            fontStyle: 'bold',
            backgroundColor: "rgba(255,255,255,0.4)",
            padding: { x: 6, y: 3 }
        });
        this.scoreText.setScrollFactor(0).setDepth(10001);

        // HUD mouchoirs
        this.mouchoirText = this.add.text(1005, 10, 'Mouchoirs : ' + mouchoirs, {
            fontSize: '28px',
            fill: '#000F05',
            fontFamily: 'Fira Sans Condensed',
            fontStyle: 'bold',
            backgroundColor: "rgba(255,255,255,0.4)",
            padding: { x: 6, y: 3 }
        });
        this.mouchoirText.setScrollFactor(0).setDepth(10001);

        //timer
        runTimerText = this.add.text(540, 10, "00:00.000", {
            fontSize: "21px",
            fontFamily: "Fira Sans Condensed",
            color: "#000F05",
            backgroundColor: "rgba(255,255,255,0.4)",
            padding: { x: 6, y: 3 }
        }).setScrollFactor(0).setDepth(10001);

        if (runTimerActive) {
            runTimerText.setText(formatElapsed(Math.floor(Date.now() - runTimerStart)));
        }

        // pluie
        this.rain = this.add.sprite(0, 0, 'rain', 0).setOrigin(0, 0);
        this.rain.setScrollFactor(0);
        this.rain.setDepth(940);
        this.rain.setVisible(false);
        this.isRaining = false; // pour que isRaining soit en état false dès le début
        this.rain.displayWidth = this.sys.game.config.width;
        this.rain.displayHeight = this.sys.game.config.height;

        glassesRain = this.add.image(0, 0, "glassesRain").setOrigin(0, 0);
        glassesRain.setScrollFactor(0);
        glassesRain.setVisible(false);
        overlayStack.push(glassesRain);

        const startRainFor = (ms) => {
            this.isRaining = true; // pour que quand la pluie commence que isRaining passe en état true
            if (!this.pluieSon.isPlaying) this.pluieSon.play({ volume: 1 });

            this.rain.setVisible(true);
            this.rain.play('rain_loop', true);

            if (playerHasUmbrella) {

                if (blurRain) { 
                this.gameSpritesLayers.postFX.remove(blurRain); 
                blurRain = null; 
                }
                if (glassesRain) glassesRain.setVisible(false);
                } else {

                if (!blurRain) {
                    const blur = this.gameSpritesLayers.postFX.addBlur(4);
                    blurRain = blur;

                    overlayStack.push({
                        destroy: () => {
                        if (blurRain) {
                            this.gameSpritesLayers.postFX.remove(blurRain);
                            blurRain = null;
                        }
                        }
                    });
                }

                if (!glassesRain) {
                    glassesRain = this.add.image(0, 0, "glassesRain").setOrigin(0, 0);
                    glassesRain.setScrollFactor(0);
                    glassesRain.setDepth(950);
                    glassesRain.setAlpha(0.6);
                    overlayStack.push(glassesRain);
                }
                glassesRain.setVisible(true);
            }

            this.time.delayedCall(ms, () => {
                this.rain.stop();
                this.rain.setVisible(false);
                this.isRaining = false; // pour que quand la pluie s'arrête que isRaining passe en état false
                scheduleNextRain();
            });
        };

        const scheduleNextRain = () => {
            const waitMs = Phaser.Math.Between(10000, 20000);
            this.time.delayedCall(waitMs, () => {
                const rainMs = Phaser.Math.Between(6000, 15000);
                startRainFor(rainMs);
            });
            if (this.pluieSon.isPlaying) {
                this.pluieSon.stop();
            }
        };

        scheduleNextRain();
    
        // animation bateau
        this.tweens.add({
            targets: this.bateau,
            x: 5058,
            duration: 3250,
            yoyo: true,
            repeat: -1,
            onYoyo: () => this.bateau.flipX = !this.bateau.flipX,
            onRepeat: () => this.bateau.flipX = !this.bateau.flipX,
        });

        this.physics.add.collider(this.player, this.bateau, () => {
            if (this.player.body.touching.down && this.bateau.body.touching.up) {
                playerOnBoat = true;
            }
        }, null, this);

        // animation small platform
        this.tweens.add({
            targets: this.smallPlat,
            x: 9036,
            duration: 3250,
            yoyo: true,
            repeat: -1,
        });

        this.physics.add.collider(this.player, this.smallPlat, () => {
            if (this.player.body.touching.down && this.smallPlat.body.touching.up) {
                playerOnPlat = true;
            }
        }, null, this);

        // animation big platform
        this.tweens.add({
            targets: this.bigPlat,
            x: 8678,
            duration: 3550,
            yoyo: true,
            repeat: -1,
            delay: 1625, // = duration / 2
        });

        this.physics.add.collider(this.player, this.bigPlat, () => {
            if (this.player.body.touching.down && this.bigPlat.body.touching.up) {
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

        this.physics.add.overlap(this.player, eau, () => { // gère la flaque d'eau
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

        this.physics.add.overlap(this.player, boue, () => { // gère la flaque de boue
            if (!overlayBoue) {
                overlayBoue = this.add.image(0, 0, "boue_vue").setOrigin(0, 0);
                overlayBoue.displayWidth  = this.sys.game.config.width;
                overlayBoue.displayHeight = this.sys.game.config.height;
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

        this.physics.add.overlap(this.player, eauRiviere, () => {
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

            if (!this.marcheRiviereSon.isPlaying) {
                this.marcheRiviereSon.play({ volume: 1 });
            }
        }, null, this);

        this.events.on('update', () => {
        const isTouching = Phaser.Geom.Intersects.RectangleToRectangle(
            this.player.getBounds(),
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
        
        this.physics.add.overlap(this.player, this.poops, (_player, poop) => {
            poop.destroy();
            if (playerHasUmbrella) return;

            const splash = this.add.image(0, 0, "merde").setOrigin(0, 0);
            splash.setScrollFactor(0);
            splash.setDepth(2000);
            splash.setAlpha(0.95);
            overlayStack.push(splash);
        });

        this.input.keyboard.on("keydown-E", () => {
            if (mouchoirs <= 0) return;
            if (overlayStack.length === 0) return;

            // Détruire tout ce qui est dans la pile
            while (overlayStack.length > 0) {
                const overlay = overlayStack.pop();
                if (overlay) overlay.destroy();
            }

            overlayEau = null;
            overlayBoue = null;
            overlayCaca = null;
            glassesRain = null;
            blurRain = null;

            mouchoirs -= 1;
            this.mouchoirText.setText("Mouchoirs : " + mouchoirs);
        }, this);

        this.porteOuvreSon.once("complete", function() {
            this.stopAmbianceSounds();
        }.bind(this));
        
        // this.physics.world.createDebugGraphic();
        this.gameSpritesLayers = this.add.layer([
            this.ciel1,
            this.ciel2,
            this.ciel3,
            this.ciel4,
            this.house,
            this.parc,
            this.chantier,
            this.parc2,
            this.shop,
            this.house2,
            this.house3,
            this.bakery,
            this.smallPlat,
            this.bigPlat,
            this.ground,
            this.ground2,
            this.parcGround,
            ...this.flaquesEau,
            ...this.flaquesBoue,
            ...this.obstacles,
            this.boueLong,
            this.bateau,
            this.bird,
            this.cone,
            this.player
        ]); // les ... sont pour décomposer les tableau pour que Phaser puisse appliquer l'effet sur tous les éléments du tableau
    }
    
    update() {
        this.player.setVelocityX(0);

        if (!runTimerActive && (Phaser.Input.Keyboard.JustDown(cursors.left) || Phaser.Input.Keyboard.JustDown(cursors.right))) {
            runTimerActive = true;
            runTimerStart = Date.now();
        }

        if (runTimerActive && runTimerText) {
            const elapsed = Math.floor(Date.now() - runTimerStart);
            runTimerText.setText(formatElapsed(elapsed));
        }
    
        // Déplacements X (perso ralenti si contact obstacle et que overlay actif)
        const overlayActif = overlayEau || overlayBoue || overlayCaca || blurRain || (glassesRain && glassesRain.visible);

        const speedLeft  = overlayActif ? -200 : -250; // gauche
        const speedRight = overlayActif ?  200 :  800; // droite

        // Saut
        if (Phaser.Input.Keyboard.JustDown(cursors.up) && this.player.body.onFloor()) {
            this.player.setVelocityY(-230);
        }

        if (cursors.left.isDown) {
            this.player.setVelocityX(speedLeft);
            this.player.setFlipX(true);
        } else if (cursors.right.isDown) {
            this.player.setVelocityX(speedRight);
            this.player.setFlipX(false);
        }
        
        const jumpSon = this.sound.add('jump');

        if (playerHasBread && playerHasUmbrella) {
            playerHasBrum = true;
        }

        // Animation
        let prefix = '';

        if (playerHasBread && playerHasUmbrella && this.isRaining) {
            // Pain + parapluie
            prefix = '_brum';
        } else if (playerHasUmbrella && this.isRaining) {
            // Parapluie seulement quand il pleut
            prefix = '_umbrella';
        } else if (playerHasBread) {
            // Pain sans pluie
            prefix = '_bread';
        } else {
            // Rien
            prefix = '';
        }

        if (!this.player.body.onFloor()) {
            this.player.anims.play('jumping' + prefix + '_' + selectedCharacter, true);
            this.player.setFrame(2);
            if (!hasJumped) {
                jumpSon.play();
                hasJumped = true;
            }
        } else if (this.player.body.velocity.x !== 0) {
            this.player.anims.play('walking' + prefix + '_' + selectedCharacter, true);
            hasJumped = false;
        } else {
            this.player.anims.play('static' + prefix + '_' + selectedCharacter, true);
            hasJumped = false;
        }
    
        if (this.player.x < 0) this.player.x = 0;
        if (this.player.x > 14040) this.player.x = 14040;

        // texte "entrer"
        if (bakeryTextShown) {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, 13760, 699);
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
            const distance2 = Phaser.Math.Distance.Between(this.player.x, this.player.y, 13760, 699);

            if (!painPrisShown && distance2 <= 100) {
                painPris = this.add.text(10, 50, 'Vous avez déjà un pain...', {
                    fontSize: '28px',
                    fill: '#000F05',
                    fontFamily: 'Fira Sans Condensed',
                    backgroundColor: "rgba(255,255,255,0.4)"
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
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, 7140, 699);
            if (distance > 100) {
                if (shopText) {
                    shopText.destroy();
                    shopText = null;
                    shopTextShown = false;
                }
            }
        }

        // touche A pour entrer dans boulangerie
        if (keyObject.isDown && bakeryTextShown && !playerHasBread){
            if (!this.porteOuvreSon.isPlaying) {
                this.porteOuvreSon.play({ volume: 1 });
            }

            this.scene.start('BakeryScene', {
                returnX: this.player.x,
                returnY: this.player.y,
                money: money,
                returnMoney : this.objects,
                player: this.player,
                playerHasBread,
                playerHasUmbrella,
                playerHasBrum,
                character: selectedCharacter
            });  
        }

        // touche A pour entrer dans shop
        if (keyObject.isDown && shopTextShown){
            if (!this.porteOuvreSon.isPlaying) {
                this.porteOuvreSon.play({ volume: 1 });
            }

            this.scene.start('ShopScene', {
                returnX: this.player.x,
                returnY: this.player.y,
                player: this.player,
                money: money,
                returnMoney : this.objects,
                playerHasBread,
                playerHasUmbrella,
                playerHasBrum,
                character: selectedCharacter
            });  
        }

        //timer
        if (keyObject.isDown && houseTextShown) {
            if (runTimerActive) {
                runTimerActive = false;
                lastRunTimeMs = Date.now() - runTimerStart;
                if (runTimerText) runTimerText.setText("FIN: " + formatElapsed(lastRunTimeMs));
            }

            this.scene.start('EndScene', {
                money: money,
                playerHasBread,
                player: this.player,
                playerHasUmbrella,
                playerHasBrum,
                character: selectedCharacter,
            });
        }

        // bateau: suivi du mouvement
        playerOnBoat = (
            this.player.body.touching.down &&
            this.bateau.body.touching.up &&
            Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.bateau.getBounds())
        );
        if (playerOnBoat) {
            const deltaX = this.bateau.x - this.bateau.prevX;
            this.player.x += deltaX;
        }
        this.bateau.prevX = this.bateau.x;

        // Small PLatform
        let onSmallPlat =
            this.player.body.touching.down &&
            this.smallPlat.body.touching.up &&
            Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.smallPlat.getBounds());

        if (onSmallPlat) {
            const deltaX = this.smallPlat.x - (this.smallPlat.prevX || this.smallPlat.x);
            this.player.x += deltaX;
        }
        this.smallPlat.prevX = this.smallPlat.x;

        // Big Platform
        let onBigPlat =
            this.player.body.touching.down &&
            this.bigPlat.body.touching.up &&
            Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.bigPlat.getBounds());

        if (onBigPlat) {
            const deltaX = this.bigPlat.x - (this.bigPlat.prevX || this.bigPlat.x);
            this.player.x += deltaX;
        }
        this.bigPlat.prevX = this.bigPlat.x;

        let newZone = null;

        if (this.player.x > -40 && this.player.x <= 4252) newZone = 'ville';
        else if (this.player.x > 4252 && this.player.x <= 5279) newZone = 'bateau';
        else if (this.player.x > 5279 && this.player.x <= 6920) newZone = 'parc';
        else if (this.player.x > 6920 && this.player.x <= 7825) newZone = 'ville';
        else if (this.player.x > 7825 && this.player.x <= 9398) newZone = 'construction';
        else if (this.player.x > 9398 && this.player.x <= 14050) newZone = 'ville';

        // Si on change de zone
        if (newZone && newZone !== this.currentZone) {
            for (let key in this.zoneSounds) {
                const targetVolume = (key === newZone) ? 0.5 : 0;
                this.tweens.add({
                    targets: this.zoneSounds[key],
                    volume: targetVolume,
                    duration: 1000,
                    ease: 'Sine.easeInOut'
                });
            }

            this.currentZone = newZone;
        }

       const birdBounds = this.bird.getBounds();

        const isVisible = Phaser.Geom.Intersects.RectangleToRectangle(birdBounds, this.cameras.main.worldView);

        if (isVisible && !this.pigeonSonPlaying) {
            this.pigeonSon.play();
            this.pigeonSonPlaying = true;
        } else if (!isVisible && this.pigeonSonPlaying) {
            this.pigeonSon.stop();
            this.pigeonSonPlaying = false;
        }
        /*
        // Effet de parallaxe
        this.ciel1.tilePositionX = this.cameras.main.scrollX * 0.06;
        this.ciel4.tilePositionX = this.cameras.main.scrollX * 0.06;*/
    }
}

class BakeryScene extends Phaser.Scene {
    constructor() {
        super('BakeryScene');
    }

    addFog() {
        // Création d’un rectangle semi-transparent couvrant l’écran
        const graphics = this.add.graphics();
        graphics.fillStyle(0xdbdbdbff, 1); // couleur + opacité complète
        graphics.fillRect(0, 0, this.scale.width, this.scale.height);

        // Créer une texture de brouillard à partir du graphic
        const fogTextureKey = 'fogTexture';
        graphics.generateTexture(fogTextureKey, this.scale.width, this.scale.height);
        graphics.destroy();

        // Ajouter le sprite de brouillard
        this.fogSprite = this.add.sprite(0, 0, fogTextureKey).setOrigin(0, 0);
        this.fogSprite.setScrollFactor(0); // reste fixe à la caméra
        this.fogSprite.setAlpha(0.9);

        // Animation d’apparition du brouillard
        this.tweens.add({
            targets: this.fogSprite,
            alpha: 0,
            duration: 4000,
            ease: 'Linear',
            onComplete: () => {
                this.fogSprite.destroy();
            }
        });
    }

    preload(data) {
        const character = (data && data.character) ? data.character : 'henri';
        loadCharacterSprites.call(this, character);
        this.load.audio('obtentionItem', 'assets/sounds/obtentionItem.mp3');
        this.load.audio('checkout', 'assets/sounds/checkout.mp3');
        this.load.audio('porteOuvre', 'assets/sounds/porteOuvre.mp3');
        this.load.audio('jump', 'assets/sounds/jump.mp3');
    }

    create(data) {
        selectedCharacter = (data && data.character) ? data.character : 'henri';
        this.player = data.player;

        this.obtentionItemSon = this.sound.add('obtentionItem');
        this.checkoutSon = this.sound.add('checkout');
        this.porteOuvreSon = this.sound.add('porteOuvre');
        this.jumpSon = this.sound.add('jump');

        cursors = this.input.keyboard.createCursorKeys();
        
        this.returnX = data.returnX;
        this.returnY = data.returnY;
        
        this.bgBakery = this.add.tileSprite(0, -290, 1940, 1024, 'cielVille').setOrigin(0, 0);
        this.interiorBakery = this.add.tileSprite(0, -190, 1194, 1024, 'interieur_bakery').setOrigin(0, 0);

        this.pain = this.physics.add.image(583, 668, 'pain');

        this.player = this.physics.add.sprite(161, 736, "player");
        this.player.setOrigin(0.5, 1);
        this.player.setSize(42, 90);
        this.player.setOffset((144 - 42) / 2, 144 - 90);
        this.player.body.gravity.y = 400;

        // Ajoute le brouillard dès le début de la scène
        this.addFog();

        // HUD argent dans la boulangerie
        this.moneyText = this.add.text(10, 10, 'Argent : ' + money + '$', { 
            fontSize: '28px', fill: '#000F05', 
            fontFamily: 'Fira Sans Condensed', 
            fontStyle: 'bold', 
            backgroundColor: "rgba(255,255,255,0.4)",
            padding: { x: 6, y: 3 }
        });
        this.moneyText.setScrollFactor(0);

        let exitBakery = this.physics.add.staticImage(159, 685, null).setSize(58, 100).setVisible(false);

        let rightWall = this.physics.add.staticImage(775, 600, null).setSize(10, 300).setVisible(false);
        this.physics.add.collider(this.player, rightWall);

        this.physics.add.overlap(this.player, exitBakery, () => {
            if (!bakeryTextShown2) {
                bakeryText2 = this.add.text(10, 50, 'Appuyer sur A pour sortir', {
                    fontSize: '28px',
                    fill: '#000F05',
                    fontFamily: 'Fira Sans Condensed',
                    fontStyle: 'bold',
                    backgroundColor: "rgba(255,255,255,0.4)",
                    padding: { x: 6, y: 3 }
                });
                bakeryText2.setScrollFactor(0);
                bakeryTextShown2 = true;
            }
        }, null, this);

        let groundColliderBakery = this.physics.add.staticImage(600, 784, null).setSize(1200, 100).setVisible(false);
        this.physics.add.collider(this.player, groundColliderBakery);

        this.canExit = false;
        this.time.delayedCall(500, () => { this.canExit = true; });
        
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        // Achat du pain: -5 pièces si possible + MAJ HUD
        this.physics.add.overlap(this.player, this.pain, () => {
            if (!playerHasBread && money >= 5) {
                playerHasBread = true;
                this.pain.disableBody(true, true);
                money -= 5;

                if (!this.obtentionItemSon.isPlaying) {
                    this.obtentionItemSon.play({ volume: 1 });
                    this.obtentionItemSon.once("complete", () => this.checkoutSon.play());
                }

                let prefix = '';

                if (playerHasBrum) {
                    prefix = '_brum';
                } else if (playerHasUmbrella) {
                    prefix = '_umbrella';
                } else if (playerHasBread) {
                    prefix = '_bread';
                } else {
                    prefix = '';
                }


                if (playerHasBread) {
                    this.player.anims.play('receive_bread_' + selectedCharacter, true);
                    this.player.setVelocity(0, 0);
                    this.player.body.moves = false;
                    playerHasBread = false;

                    // Durée réelle de animation (4 frames à 6 fps ≈ 666 ms)
                    this.time.delayedCall(2593, () => {
                        this.player.body.moves = true;
                        playerHasBread = true;
                        this.player.anims.play('static' + prefix + '_' + selectedCharacter, true);
                    });
                }

                // MAJ texte argent
                if (this.moneyText) this.moneyText.setText('Argent : ' + money + '$');

                // Achat -> -5$ +texte pour user
                const txt = this.add.text(10, 50, '-5$', { 
                    fontSize: '28px',
                    fill: '#ff5555',
                    fontFamily: 'Fira Sans Condensed',
                    fontStyle: 'bold',
                    backgroundColor: "rgba(255,255,255,0.4)",
                    padding: { x: 6, y: 3 }
                });
                txt.setScrollFactor(0);
                this.time.delayedCall(1200, () => txt.destroy());
            } else if (money < 5) { //Alerte argent pas suffisant
                const warn = this.add.text(10, 50, 'Pas assez d\'argent !', {
                    fontSize: '28px',
                    fill: '#ff0000',
                    fontFamily: 'Fira Sans Condensed',
                    fontStyle: 'bold',
                    backgroundColor: "rgba(255,255,255,0.4)",
                    padding: { x: 6, y: 3 }
                });
                warn.setScrollFactor(0);
                this.time.delayedCall(1500, () => warn.destroy());
            }
        });
    }

    update() {
        if (this.player.anims.currentAnim && this.player.anims.currentAnim.key === `receive_bread_${selectedCharacter}`) {
            return; // Empêche update d'écraser l'animation pendant qu'elle joue
        }

        // sortie boulangerie
        if (Phaser.Input.Keyboard.JustDown(this.keyA) && bakeryTextShown2) {
            if (!this.porteOuvreSon.isPlaying) {
                this.porteOuvreSon.play({ volume: 1 });
            }

            this.scene.start('MainWorld', {
                playerX: this.returnX,
                playerY: this.returnY,
                player: this.player,
                money: money,
                playerHasBread,
                playerHasUmbrella,
                playerHasBrum,
                character: selectedCharacter
            });
        }

        if (bakeryTextShown2) {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, 159, 685);
            if (distance > 80) {
                if (bakeryText2) bakeryText2.destroy();
                bakeryText2 = null;
                bakeryTextShown2 = false;
            }
        }

        // Mouvement axe X
        this.player.setVelocityX(0);

        // Saut
        if (Phaser.Input.Keyboard.JustDown(cursors.up) && this.player.body.onFloor()) {
            this.player.setVelocityY(-200);
        }

        // Gauche / Droite
        if (cursors.left.isDown) {
            this.player.setVelocityX(-230);
            this.player.setFlipX(true);
        } else if (cursors.right.isDown) {
            this.player.setVelocityX(230);
            this.player.setFlipX(false);
        }

        if (playerHasBread && playerHasUmbrella) {
            playerHasBrum = true;
        }

        // Animation
        let prefix = '';

        if (playerHasBrum) {
            prefix = '_brum';
        } else if (playerHasUmbrella) {
            prefix = '_umbrella';
        } else if (playerHasBread) {
            prefix = '_bread';
        } else {
            prefix = '';
        }

        if (this.player.body.onFloor()) {
            hasJumped = false;
        }

        if (!this.player.body.onFloor()) {
            this.player.anims.play('jumping' + prefix + '_' + selectedCharacter, true);
            this.player.setFrame(2);
            if (!hasJumped) {
                this.jumpSon.play();
                hasJumped = true;
            }
        } else if (this.player.body.velocity.x !== 0) {
            this.player.anims.play('walking' + prefix + '_' + selectedCharacter, true);
        } else {
            this.player.anims.play('static' + prefix + '_' + selectedCharacter, true);
        }

        // Murs gauche et droite
        this.player.x = Phaser.Math.Clamp(this.player.x, 0, 1194);
    }
}

class ShopScene extends Phaser.Scene {
    constructor() {
        super('ShopScene');
    }

    addFog() {
        // Création d’un rectangle semi-transparent couvrant l’écran
        const graphics = this.add.graphics();
        graphics.fillStyle(0xdbdbdbff, 1); // couleur + opacité complète
        graphics.fillRect(0, 0, this.scale.width, this.scale.height);

        // Créer une texture de brouillard à partir du graphic
        const fogTextureKey = 'fogTexture';
        graphics.generateTexture(fogTextureKey, this.scale.width, this.scale.height);
        graphics.destroy();

        // Ajouter le sprite de brouillard
        this.fogSprite = this.add.sprite(0, 0, fogTextureKey).setOrigin(0, 0);
        this.fogSprite.setScrollFactor(0); // reste fixe à la caméra
        this.fogSprite.setAlpha(0.9);

        // Animation d’apparition du brouillard
        this.tweens.add({
            targets: this.fogSprite,
            alpha: 0,
            duration: 4000,
            ease: 'Linear',
            onComplete: () => {
                this.fogSprite.destroy();
            }
        });
    }

    preload(data) {
        const character = (data && data.character) ? data.character : 'henri';
        loadCharacterSprites.call(this, character);
        this.load.audio('checkout', 'assets/sounds/checkout.mp3');
        this.load.audio('porteOuvre', 'assets/sounds/porteOuvre.mp3');
        this.load.audio('jump', 'assets/sounds/jump.mp3');
    }

    create(data) {
        selectedCharacter = (data && data.character) ? data.character : 'henri';
        this.player = data.player;

        this.checkoutSon = this.sound.add('checkout');
        this.porteOuvreSon = this.sound.add('porteOuvre');
        this.jumpSon = this.sound.add('jump');

        cursors = this.input.keyboard.createCursorKeys();

        this.returnX = data.returnX;
        this.returnY = data.returnY;

        this.bgShop = this.add.tileSprite(0, -290, 1940, 1024, 'cielVille').setOrigin(0, 0);
        this.interiorShop = this.add.tileSprite(0, -190, 1194, 1024, 'interieur_shop').setOrigin(0, 0);
        this.player = this.physics.add.sprite(586, 736, "player");
        this.player.setOrigin(0.5, 1);
        this.player.setSize(42, 90);
        this.player.setOffset((144 - 42) / 2, 144 - 90);
        this.player.body.gravity.y = 400;

        let groundColliderShop = this.physics.add.staticImage(600, 784, null).setSize(1200, 100).setVisible(false);
        this.physics.add.collider(this.player, groundColliderShop);

        this.parapluie = this.physics.add.image(382, 662, 'parapluie');

        this.mouchoirs = this.physics.add.image(784, 660, 'mouchoirs');

        // Ajoute le brouillard dès le début de la scène
        this.addFog();

        this.moneyText = this.add.text(10, 10, 'Argent : ' + money + '$', {
            fontSize: '28px',
            fill: '#000F05',
            fontFamily: 'Fira Sans Condensed',
            fontStyle: 'bold',
            backgroundColor: "rgba(255,255,255,0.4)",
            padding: { x: 6, y: 3 }
        });
        this.moneyText.setScrollFactor(0);

        // Achat parapluie: -4 pièces si possible, MAJ HUD
        this.physics.add.overlap(this.player, this.parapluie, () => {
            if (!playerHasUmbrella && money >= 4) {
                playerHasUmbrella = true;
                this.parapluie.disableBody(true, true);
                money -= 4;

                if (!this.checkoutSon.isPlaying) {
                    this.checkoutSon.play({ volume: 1 });
                }

                const prefix = playerHasUmbrella ? '_umbrella': '';
                if (playerHasUmbrella) {
                    this.player.anims.play('receive_umbrella_' + selectedCharacter, true);
                    this.player.setVelocity(0, 0);
                    this.player.body.moves = false;
                    playerHasUmbrella = false;

                    this.time.delayedCall(1000, () => {
                        this.player.body.moves = true;
                        playerHasUmbrella = true;
                        this.player.anims.play('static' + prefix + '_' + selectedCharacter, true);
                    });
                }

                // MAJ texte argent
                if (this.moneyText) this.moneyText.setText('Argent : ' + money + '$');

                // Achat -> -4$ + texte pour user
                const txt = this.add.text(10, 50, '-4$', {
                    fontSize: '28px',
                    fill: '#ff5555',
                    fontFamily: 'Fira Sans Condensed',
                    fontStyle: 'bold',
                    backgroundColor: "rgba(255,255,255,0.4)",
                    padding: { x: 6, y: 3 }
                });
                txt.setScrollFactor(0);
                this.time.delayedCall(1200, () => txt.destroy());
            } else if (money < 4) { //Alerte argent pas suffisant (pas 4$ dispo)
                const warn = this.add.text(10, 50, 'Pas assez d\'argent !', { 
                    fontSize: '28px',
                    fill: '#ff0000',
                    fontFamily: 'Fira Sans Condensed',
                    fontStyle: 'bold',
                    backgroundColor: "rgba(255,255,255,0.4)",
                    padding: { x: 6, y: 3 }
                });
                warn.setScrollFactor(0);
                this.time.delayedCall(1500, () => warn.destroy());
            }
        });

        this.mouchoirText = this.add.text(400, 10, 'Mouchoirs : ' + mouchoirs, {
            fontSize: '28px',
            fill: '#000F05',
            fontFamily: 'Fira Sans Condensed',
            fontStyle: 'bold',
            backgroundColor: "rgba(255,255,255,0.4)",
            padding: { x: 6, y: 3 }
        });
        this.mouchoirText.setScrollFactor(0);

        // Achat de mouchoir: -2 pièces si possible, MAJ HUD
        this.physics.add.overlap(this.player, this.mouchoirs, () => {
            if (!this.checkoutSon.isPlaying) {
                this.checkoutSon.play({ volume: 1 });
            }

            // Condition d'achat
            if (money >= 2) {
                this.mouchoirs.disableBody(true, true); // cache les mouchoirs
                money -= 2;
                mouchoirs += 1;

                // MAJ texte argent et mouchoirs
                if (this.moneyText) this.moneyText.setText('Argent : ' + money + '$');
                this.mouchoirText.setText('Mouchoirs : ' + mouchoirs);

                // Petit feedback visuel
                const txt = this.add.text(10, 50, '-2$', {
                    fontSize: '28px',
                    fill: '#ff5555',
                    fontFamily: 'Fira Sans Condensed',
                    fontStyle: 'bold',
                    backgroundColor: "rgba(255,255,255,0.4)",
                    padding: { x: 6, y: 3 }
                });
                txt.setScrollFactor(0);
                this.time.delayedCall(1200, () => txt.destroy());

                // 💡 Réapparition après 2 secondes
                this.time.delayedCall(1000, () => {
                    this.mouchoirs.enableBody(true, 784, 660, true, true);
                });

            } else { // Pas assez d'argent
                const warn = this.add.text(10, 50, 'Pas assez d\'argent !', {
                    fontSize: '28px',
                    fill: '#ff0000',
                    fontFamily: 'Fira Sans Condensed',
                    fontStyle: 'bold',
                    backgroundColor: "rgba(255,255,255,0.4)",
                    padding: { x: 6, y: 3 }
                });
                warn.setScrollFactor(0);
                this.time.delayedCall(1500, () => warn.destroy());
            }
        });

        let exitShop = this.physics.add.staticImage(585, 685, null).setSize(57, 100).setVisible(false);

        this.physics.add.overlap(this.player, exitShop, () => {
            if (!shopTextShown2) {
                shopText2 = this.add.text(10, 50, 'Appuyer sur A pour sortir', {
                    fontSize: '28px',
                    fill: '#000F05',
                    fontFamily: 'Fira Sans Condensed',
                    fontStyle: 'bold',
                    backgroundColor: "rgba(255,255,255,0.4)",
                    padding: { x: 6, y: 3 }
                });
                shopText2.setScrollFactor(0);
                shopTextShown2 = true;
            }
        }, null, this);

        let rightWall = this.physics.add.staticImage(976, 600, null).setSize(10, 300).setVisible(false);
        this.physics.add.collider(this.player, rightWall);

        let leftWall = this.physics.add.staticImage(196, 600, null).setSize(10, 300).setVisible(false);
        this.physics.add.collider(this.player, leftWall);
        
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        this.canExit = false;
        this.time.delayedCall(500, () => { this.canExit = true; });
    }

    update() {

        if (this.player.anims.currentAnim && this.player.anims.currentAnim.key === `receive_umbrella_${selectedCharacter}`) {
            return; // Empêche update d'écraser l'animation pendant qu'elle joue
        }
        // sortir du shop
        if (Phaser.Input.Keyboard.JustDown(this.keyA) && shopTextShown2) {
            if (!this.porteOuvreSon.isPlaying) {
                this.porteOuvreSon.play({ volume: 1 });
            }

            this.scene.start('MainWorld', {
                playerX: this.returnX,
                playerY: this.returnY,
                player: this.player,
                money: money,
                playerHasBread,
                playerHasUmbrella,
                playerHasBrum,
                character: selectedCharacter
            });
        }

        if (shopTextShown2) {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, 586, 685);
            if (distance > 80) {
                if (shopText2) shopText2.destroy();
                shopText2 = null;
                shopTextShown2 = false;
            }
        }

        // Mouvement
        this.player.setVelocityX(0);

        // Saut
        if (Phaser.Input.Keyboard.JustDown(cursors.up) && this.player.body.onFloor()) {
            this.player.setVelocityY(-200);
        }

        // Gauche / Droite
        if (cursors.left.isDown) {
            this.player.setVelocityX(-230);
            this.player.setFlipX(true);
        } else if (cursors.right.isDown) {
            this.player.setVelocityX(230);
            this.player.setFlipX(false);
        }

        if (playerHasBread && playerHasUmbrella) {
            playerHasBrum = true;
        }

        // Animation
        let prefix = '';

        if (playerHasBrum) {
            prefix = '_brum';
        } else if (playerHasUmbrella) {
            prefix = '_umbrella';
        } else if (playerHasBread) {
            prefix = '_bread';
        } else {
            prefix = '';
        }

        if (this.player.body.onFloor()) {
            hasJumped = false;
        }

        if (!this.player.body.onFloor()) {
            this.player.anims.play('jumping' + prefix + '_' + selectedCharacter, true);
            this.player.setFrame(2);
            if (!hasJumped) {
                this.jumpSon.play();
                hasJumped = true;
            }
        } else if (this.player.body.velocity.x !== 0) {
            this.player.anims.play('walking' + prefix + '_' + selectedCharacter, true);
        } else {
            this.player.anims.play('static' + prefix + '_' + selectedCharacter, true);
        }

        // Murs gauche et droite
        this.player.x = Phaser.Math.Clamp(this.player.x, 0, 1194);
    }
}

class EndScene extends Phaser.Scene {
    constructor() {
        super('EndScene');
    }

    preload(data) {
        const character = (data && data.character) ? data.character : 'henri';
        loadCharacterSprites.call(this, character);
    }

    create(data) {
        if (typeof lastRunTimeMs === "number" && lastRunTimeMs > 0) {
            this.add.text(400, 300, "Votre temps : " + formatElapsed(lastRunTimeMs), {
                fontSize: "28px",
                color: "#000F05",
                fontFamily: 'Fira Sans Condensed',
                fontStyle: 'bold',
                backgroundColor: "rgba(255,255,255,0.4)",
                padding: { x: 6, y: 3 }
            });
        }
    // son
        const loadingSceneSon = this.sound.add('loadingScene');
        loadingSceneSon.play({ loop: true });

        this.bg = this.add.tileSprite(0, 0, 1194, 834, 'intro').setOrigin(0, 0);
        this.logo = this.add.tileSprite(597, 150, 873, 105, 'logo').setOrigin(0.5, 0.5);
        perso = this.add.sprite(100, 712, 'player_brum_static_henri');

        const appuyA = this.add.text(597, 600, 'Appuyer sur A pour commencer le jeu avec ' + selectedCharacter, {
            fontSize: '36px',
            fill: '#000F05',
            fontFamily: 'Fira Sans Condensed',
            fontStyle: 'bold',
            backgroundColor: "rgba(255,255,255,0.4)",
            padding: { x: 6, y: 3 }
        });

        appuyA.setOrigin(0.5, 0.5);

        perso.play('static_brum_henri');

        appuyA.setText('Appuyer sur A pour redémarrer le jeu');

        cursors = this.input.keyboard.createCursorKeys();

        // Ajout d'une touche A
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        // Attendre que l'utilisateur appuie sur A
        this.input.keyboard.on('keydown-A', () => {
            this.game.destroy(true);
            window.location.reload();
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 1194,
    height: 834,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: false }
    },
    audio: {
        disableWebAudio: true,
    },
    render: { pixelArt: true, antialias: false }, // ajout pour une image nette (eau)
    scene: [LoadingScene, Glasses, MainWorld, BakeryScene, ShopScene, EndScene]
};

const game = new Phaser.Game(config);