import phaser from 'phaser';
import helper from '../prefabs/helper';
import Text from '../prefabs/Text';
export default class GameOver extends Phaser.Scene{
    constructor(){
        super({key : "GameOver",active : false});
    }
     
    // here the data in the init function corresponds to the score which is sent from the play scene.
    init(data){
        this.score = data.score;
        this.CONFIG = this.sys.game.CONFIG;
    }

    create(){
        // create the graphic background

        let x = this.CONFIG.tile;
        let w = this.CONFIG.width - 2*x;

        let h = 296;
        let y = 148;

        this.background = this.add.graphics({x :x,y:y});
        this.background.fillStyle('0x302C2E',1);
        this.background.fillRoundedRect(0,0,w,h,15); // here x and y are relative to the background x and y

        // title

        this.title = new Text(
            this,
            x + 0.5*w,
            207,
            'Game Over',
            'title',
        )
        this.score_text = new Text(
            this,
            x + 0.5*w,
            y + 0.5*h,
            `Total Score : ${this.score}`,
            'standard',
        )

        // all the buttons.
        this.createAllButtons(x,y,w,h);
    }

    createAllButtons(x,y,w,h){
        // Menu btn.
        this.menuBtn = this.createButton(x+ 0.25*w, y + 0.85*h,this.clickMenuBtn);   
        this.lbl_menu = new Text(
            this,
            this.menuBtn.getData('centerX'),
            this.menuBtn.getData('centerY'),
            'Menu', 
            'standard'
        )

        // try again btn.
        this.againBtn = this.createButton(x+ 0.75*w, y + 0.85*h,this.clickTryAgainBtn);
        this.lbl_tryagain = new Text(
            this,
            this.againBtn.getData('centerX'),
            this.againBtn.getData('centerY'),
            'Try Again', 
            'standard'
        )
    }

    createButton(centerX,centerY,callback){
        let w = 4.5*this.CONFIG.tile;
        let h = 2*this.CONFIG.tile;
        let r = 10;
        let x = centerX - 0.5*w;
        let y = centerY - 0.5*h;
        let btn = this.add.graphics({x :x,y:y});
        btn.fillStyle('0x393148',1);
        btn.fillRoundedRect(0,0,w,h,r);

        btn.setDataEnabled();
        btn.setData('centerX',centerX);
        btn.setData('centerY',centerY);

        //create a hit area

        let hit_area = new Phaser.Geom.Rectangle(0,0,w,h);
        btn.setInteractive(hit_area,Phaser.Geom.Rectangle.Contains);

        btn.myDownCllbck = ()=>{
            btn.clear();
            btn.fillStyle('0x827094',1);
            btn.fillRoundedRect(0,0,w,h,r);
        }
        btn.myOutCllbck = ()=>{
            btn.clear();
            btn.fillStyle('0x393148',1);
            btn.fillRoundedRect(0,0,w,h,r);
        }
        btn.on('pointerup',callback,this);
        btn.on('pointerdown',btn.myDownCllbck,this);
        btn.on('pointerout',btn.myOutCllbck,this);
        return btn;
    }
    clickMenuBtn(){
        this.events.emit('clickMenu');
    }
    clickTryAgainBtn(){
        this.events.emit('clickTryAgain');
    }
}