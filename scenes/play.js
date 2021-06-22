import Phaser from 'phaser'
import Generator from '../prefabs/generator'
import Player from '../prefabs/player'
export default class Play extends Phaser.Scene{
    constructor(){
        super({key : "Play",active : false});
    }

    init(){
        this.CONFIG = this.sys.game.CONFIG;
        this.DEPTH = {
            floor : 0,
            wall  :1,
            pickup : 2,
            monster : 3,
            player : 4,

            overlay : 5,
            ui : 6,
            menu : 7,
        }

        //some flags
        this.allow_input = true;
        this.is_gamepause = false;
        this.is_gameover = false;
        this.generator = new Generator(this);
        this.camSpeed = {
            base : 0,
            current : 0,
            max : 3
        }
        this.is_holding = {
            left : false,
            right : false ,
            direction : false
        }
    }
    create(){
        //this.createBkg();
        
        //create the floor
        this.generator.setup();
        this.createPlayer();
        this.player.setDepth(this.DEPTH.player);
        this.player.startMoving();
        this.player.handleMatterCollision();
        this.createZones();

        // testing purpose codes
        // console.log("boitton and left and right , ",this.player.getBottomLeftTile(),this.player.getBottomRightTile());
        
    }
    update(){
        //move camera donwn
        // console.log(this.cameras.main.height);
       
        
        this.updateCamera();
        this.setCamSpeed(1)
        //fill with new tiles 
        //delete passed tiles
        this.generator.update();

        //moving the player
        this.player.update(this.is_holding)
        
        
    }
    updateCamera(){
        this.cameras.main.setScroll(
            0,
            this.cameras.main.scrollY + this.camSpeed.current
        )

        let centerY = this.cameras.main.scrollY + 0.5*this.cameras.main.height;
        if(this.player.spr.y >= centerY){
            this.cameras.main.setScroll(0,this.player.spr.y - 0.5 * this.cameras.main.height);
        }

    }
    setCamSpeed(speed){
        this.camSpeed.base = speed;
        this.camSpeed.current = speed;
        this.camSpeed.current = Math.min(
            this.camSpeed.current,
            this.camSpeed.max
        )
    }
    createPlayer(){
        this.player = new Player(this,
            this.CONFIG.centerX,
            16,
            'spr-hero');
        this.player.createPhysicsSprite('player');

    }
    createZones(){
        let w = 0.45 * this.CONFIG.width;
        let h = this.CONFIG.height;
        //left zone
        this.zone_left = this.add.zone(0,0,w,h);
        this.zone_left.setOrigin(0,0);
        this.zone_left.setDepth(this.DEPTH.ui);
        this.zone_left.setScrollFactor(0);

        //right zone
        this.zone_right = this.add.zone(this.CONFIG.width - w,0,w,h);
        this.zone_right.setOrigin(0,0);
        this.zone_right.setDepth(this.DEPTH.ui);
        this.zone_right.setScrollFactor(0);

        this.zone_left.setInteractive();

        this.zone_left.on('pointerdown',this.holdLeft,this);
        this.zone_left.on('pointerup',this.releaseLeft,this);
        this.zone_left.on('pointerout',this.releaseLeft,this);
        
        this.zone_right.setInteractive();
        this.zone_right.on('pointerdown',this.holdRight,this);
        this.zone_right.on('pointerup',this.releaseRight,this);
        this.zone_right.on('pointerout',this.releaseRight,this);
    }

    holdLeft(){
        if(!this.allow_input) return;
        if(this.is_gamepause || this.is_gameover) return;
        this.is_holding.left = true;
        this.is_holding.direction = 'left';
    }
    holdRight(){
        if(!this.allow_input) return;
        if(this.is_gamepause || this.is_gameover) return;
        this.is_holding.right = true;
        this.is_holding.direction = 'right';
    }

    releaseLeft(){
        if(this.is_holding.left) this.is_holding.left = false;
        if(this.is_holding.right){
            this.is_holding.direction = 'right';
        }
        else{
            this.is_holding.direction = false;
        }
    }
    releaseRight(){
        if(this.is_holding.right) this.is_holding.right = false;
        if(this.is_holding.left){
            this.is_holding.direction = 'left';
        }
        else{
            this.is_holding.direction = false;
        }
    }
}