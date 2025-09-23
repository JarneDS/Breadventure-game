import { Scene } from 'phaser';

function preload() {
    this.load.image('background1', '../assets/'); //img en png
    this.load.image('background2', '../assets/'); //img en png
    this.load.image('background3', '../assets/'); //img en png
    this.load.spritesheet('dude', 
        'assets/',
        { frameWidth: 32, frameHeight: 48 }
    ); // spridesheet
    this.load.spritesheet('girl', 
        'assets/',
        { frameWidth: 32, frameHeight: 48 }
    ); // spridesheet
}

export class Game extends Scene
{
    
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x00ff00); //0x nécessaire si code hexa

        this.add.image(0, 0, 'background1').setOrigin(0, 0);

        this.add.image(512, 384, 'background').setAlpha(0.5);

        this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('GameOver');

        });
    }
}
