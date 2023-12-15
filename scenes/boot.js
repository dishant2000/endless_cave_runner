import Phaser from 'phaser';
import click_0 from '../assets/fonts/click_0.png';
import click_0x from '../assets/fonts/click_0.xml';
export default class Boot extends Phaser.Scene{
    constructor(){
        super({key : 'Boot', active : true});
    }

    init(){
        this.URL = this.sys.game.URL;
        this.CONFIG = this.sys.game.CONFIG;
        
    }
    preload(){
        //this.load.setPath(this.URL + "assets/fonts");
        this.load.bitmapFont('ClickPixel',click_0,click_0x);
    
    }
    create(){
        //console.log("boot running ")
        this.scene.start('Preload');
    }
}