import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(512, 384, 'mainMenuBG').setOrigin(0.5).setScale(1.62);

        this.add.text(512, 300, 'Breadventure', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        //this.add.image(512, 300, 'logo');

        this.add.text(512, 660, 'PRESS ANY KEY TO START THE GAME', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        /*this.input.keyboard.once('keydown', () => {
            this.scene.start('Game');
        });

        this.input.once('pointerdown', () => {
            this.scene.start('Game');
        });*/
    }

}
