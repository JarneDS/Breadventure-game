import { Scene } from 'phaser';

function preload() {
    this.load.image('background1', 'assets/'); //img en png
    this.load.image('background2', 'assets/'); //img en png
    this.load.image('background3', 'assets/'); //img en png
    this.load.spritesheet('dude', 
        'assets/',
        { frameWidth: 32, frameHeight: 48 }
    ); // spridesheet
    this.load.spritesheet('girl', 
        'assets/',
        { frameWidth: 32, frameHeight: 48 }
    ); // spridesheet
}

var screenBlur = 0


export class Game extends Scene
{
    
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        window.addEventListener("keydown", (event) => {
        if (event.defaultPrevented) {
            return; // Do nothing if the event was already processed
        }

        switch (event.key) {
            case "ArrowDown":
                // Do something for "down arrow" key press.
                break;
            case "ArrowUp":
                // Do something for "up arrow" key press.
                break;
            case "ArrowLeft":
                // Do something for "left arrow" key press.
                break;
            case "ArrowRight":
                // Do something for "right arrow" key press.
                break;
            case "Enter":
                // Do something for "enter" or "return" key press.
                break;
            default:
                return; // Quit when this doesn't handle the key event.
        }

        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
        });

        var camera = this.cameras.main;

        if (screenBlur = 1) {
            var effect = camera.postFX.addBlur(1, 0, 0, 2, 0xF0F0F2, 2);
        } else {
            // pour éteindre le blur après avoir lavé les lunettes
            effect.setActive(false);
        }

        this.cameras.main.setBackgroundColor(0x00ff00); //0x nécessaire si code hexa

        this.add.image(0, 0, 'background1').setOrigin(0, 0);


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
