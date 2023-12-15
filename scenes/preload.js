import Phaser from 'phaser';
import Text from '../prefabs/Text'
import spr_hero from '../assets/img/herotiledemo.png'
import floortile from '../assets/img/dirt.png'
import spr_heroleft from '../assets/img/herolefttiledemo.png'
import spr_heroright from '../assets/img/herorighttiledemo.png'
import wall32 from '../assets/img/wall32.png';
import spikes from '../assets/img/spikes.png';
import pauseButton from '../assets/img/btn_pause.png';
import heart from '../assets/img/heart.png';
import spr_slime from '../assets/img/slime.png';
export default class Preload extends Phaser.Scene{
    constructor(){
        super({key : 'Preload', active : false});
    }

    init(){
        //globals
        this.URL = this.sys.game.URL;
        this.CONFIG = this.sys.game.CONFIG;
    }
    preload(){
        // create a loading bar
        this.createBkg();
        this.createLoadingBar();
        //load spritesheets 
        this.load.spritesheet('spr-hero' , spr_hero, {frameWidth : 32, frameHeight : 32,spacing :10});
        this.load.spritesheet('floortile',floortile,{frameWidth: 32,frameHeight : 32});
        this.load.spritesheet('spr-heroleft',spr_heroleft,{frameWidth : 32, frameHeight : 32,spacing :10});
        this.load.spritesheet('spr-heroright',spr_heroright,{frameWidth : 32, frameHeight : 32,spacing :10});
        this.load.spritesheet('wall',wall32,{frameWidth : 32, frameHeight : 32});
        this.load.spritesheet('spike',spikes,{frameWidth:32,frameHeight:32,spacing:10});
        this.load.spritesheet('pause',pauseButton,{frameWidth:64,frameHeight:64});
        this.load.spritesheet('heart',heart,{frameWidth:32,frameHeight:32,spacing:10});
        this.load.spritesheet('spr-slime',spr_slime,{frameWidth:25,frameHeight:25,spacing:10});
    }
    create(){
        //console.log("preload running ")
        //goto menu
        this.createAllAnims();
        setTimeout(() => { 
            this.scene.start('Menu');
        }, 1000);
        //this.add.image(100,100,'spr_hero')
    }

    createLoadingBar(){
        //title
        this.title =  new Text(
            this,
            this.CONFIG.centerX,
            75,
            'Loading game',
            'title',
            0.5
        )
        // //text
        this.loading_text =  new Text(
            this,
            this.CONFIG.centerX,
            this.CONFIG.centerY - 5,
            'Loading...',
            'preload',
            {x : 0.5,  y : 1}
        )
        //actual loading bar
        let x = 10;
        let y = this.CONFIG.centerY + 15;
        let w = this.CONFIG.width - 2*10;
        let h = 36
        this.progress = this.add.graphics({x:x,y:y});
        this.border = this.add.graphics({x:x,y:y});
        
        this.load.on('progress',this.onProgress,this);
    }

   onProgress(val){
        let perc = (val * 100) + '%';
        let w = this.CONFIG.width - 2*10;
        let h = 36
        this.loading_text.setText(perc);
        this.border.clear();
        this.border.strokeRect(0,0,w,h);
        this.border.lineStyle(2,"0xe84545",1);
        this.progress.clear();
        this.progress.fillStyle("0xfed049", 1)
        this.progress.fillRect(0,0,w*val,h);
        
        
    }
    createBkg(){
        this.background = this.add.graphics({x : 0 , y : 0});
        this.background.fillStyle('0xfbe6c2',1);
        this.background.fillRect(0,0,this.CONFIG.width,this.CONFIG.height);
    }
    createAllAnims(){
        this.anims.create(
            {
            key : 'spr-hero-walk',
            frames : this.anims.generateFrameNames('spr-hero',{frames : [0,1,2,3]}),
            repeat : -1,
            frameRate : 12,
            }
        )
        
        this.anims.create({
            key : 'spr-hero-leftwalk',
            frames : this.anims.generateFrameNames('spr-heroleft',{frames : [0,1,2,3]}),
            repeat : -1,
            frameRate : 12
        })

        this.anims.create({
            key : 'spr-hero-rightwalk',
            frames : this.anims.generateFrameNames('spr-heroright',{frames : [3,2,1,0]}),
            repeat : -1,
            frameRate : 12
        })

        this.anims.create({
            key:'spr-hero-dead',
            frames : this.anims.generateFrameNames('spr-hero',{frames:[4]}),
            repeat:-1
        })
    }

}