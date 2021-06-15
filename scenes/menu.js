import Phaser from 'phaser';
import Text from '../prefabs/Text'
export default class Menu extends Phaser.Scene{
    constructor(){
        super({key : 'Menu', active : false});
    }

    init(){
        this.CONFIG = this.sys.game.CONFIG;
    }
    create(){
        //background for camera effect
        //game title
        this.createBkg();
        this.title = new Text(
            this,
            this.CONFIG.centerX,
            75,
            'ENDLESS CAVE',
            'title',
            0.5
        )
        //button to click for start
        this.play_text = new Text(
            this,
            this.CONFIG.centerX,
            this.CONFIG.centerY,
            'Click to play',
            'standard',
            0.5
        );
        //creating mouse and keyboard handler
        this.mouseEventHandler();
        this.keyboardEventHandler();
    }
    createBkg(){
        this.background = this.add.graphics({x : 0 , y : 0});
        this.background.fillStyle('0xfbe6c2',1);
        this.background.fillRect(0,0,this.CONFIG.width,this.CONFIG.height);
    }
    mouseEventHandler(){
        this.input.on('pointerup',this.goPlay,this);
    }
    keyboardEventHandler(){
        function handleKeyUp(e){
            switch(e.code){
                case 'Enter':
                    this.goPlay();
                    break;
            }
        }

        this.input.keyboard.on('keyup',handleKeyUp,this)
    }
    goPlay(){
        this.scene.start('Play');
    }

}