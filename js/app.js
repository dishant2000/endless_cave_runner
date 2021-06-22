import Phaser from 'phaser';
import Boot from '../scenes/boot.js'
import Preload from '../scenes/preload.js'
import Menu from '../scenes/menu.js'
import Play from '../scenes/play'
export default class App{
    constructor(){
        this.VERSION = '0.0.1';
        this.IS_DEV = true;
    }

    start(){
        //scenes
        let scenes = [];
        scenes.push(Boot);
        scenes.push(Preload);
        scenes.push(Menu);
        scenes.push(Play)
        //game config

        const config = {
            type : Phaser.AUTO,
            parent : 'phaser-app',
            title : "endless cave",
            width : 360 ,
            height : 640,
            scene : scenes,
            backgroundColor : 0x000,
            physics: {
                default: "matter",
                matter: {
                    debug: true,
                    gravity:{
                        x:0,
                        y:0
                    }
                }
            },
        }

        //game init

        let game  = new Phaser.Game(config);
        game.URL = "";
        //globals
        game.CONFIG = {
            width : config.width,
            height : config.height,
            centerX : parseInt(0.5 * config.width),
            centerY : parseInt(0.5 * config.height),
            tile  :32,
            map_offset : 4
        }
        //sounds
    }
}