import Phaser,{Button} from 'phaser'
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
        //ui elements like topbar and the buttons and all
        this.createUI();

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
        if(this.player.states.dead){
            this.triggerGameOver();
            return;
        }
        
    }
    triggerGameOver(){
        if(this.is_gameover) return;
        this.is_gameover = true;
        this.time.addEvent({
            delay : 1000,
            callback:this.goMenu,
            callbackScope : this
        })
    }
    goMenu(){
        this.scene.start('Menu')
    }
    stopCamera(){
        this.cameras.main.setScroll(0,0);
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
            this.CONFIG.tile*2.5,
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

    createUI(){
        //topheath bar
        this.topBar = this.createBar(this.CONFIG.map_offset,0,this.CONFIG.width - this.CONFIG.map_offset*2,16);
        //bottom bar
        this.bottomBar = this.createBar(this.CONFIG.map_offset,this.CONFIG.height-this.CONFIG.tile,this.CONFIG.width - this.CONFIG.map_offset*2,this.CONFIG.tile);
        //pauseBtn
        this.btn_pause = this.add.sprite(-4,0,'pause').setScrollFactor(0).setDepth(this.DEPTH.ui).setOrigin(0);
        //rendering health bar
        this.createHealthBar(this.CONFIG.width - this.CONFIG.tile*3,4)

    }
    createBar(x,y,width,height){
        let topBar;
        topBar = this.add.graphics({x : x, y : y});
        topBar.fillRect(0,0,width,height);
        topBar.fillStyle("0x3B0E2E",1);
        topBar.setDepth(this.DEPTH.ui);
        topBar.setScrollFactor(0);
        topBar.setDataEnabled();
        topBar.setData("centerX",x + 0.5*width);
        topBar.setData("centerY",y + 0.5*height);
        return topBar;
    }
    createHealthBar(x,y){
        this.heartArr = [];
        let step = this.CONFIG.tile;
        for(let i = 0 ; i < this.player.health.current;i++){
            let icn = this.add.sprite(x + i*step,y,'heart').setDepth(this.DEPTH.ui).setOrigin(0).setScrollFactor(0).setScale(0.65).setFrame(0);
            this.heartArr.push(icn);
        }
    }
}