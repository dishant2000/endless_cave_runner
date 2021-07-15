import Phaser from 'phaser'
import Generator from '../prefabs/generator'
import Player from '../prefabs/player'
import Text from '../prefabs/Text';
import Button from '../prefabs/Button'
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
        this.is_pause = false;
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
        this.createPauseScreen();       
    }
    update(){
        //move camera donwn

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
        //updating the ui
        this.updateUI();
    }


    updateUI(){
        if(this.player.health.current < this.player.health.total){
            this.heartArr.forEach((heart,i)=>{
                if(i+1 <= this.player.health.current){
                    heart.setFrame(0);
                }
                else{
                    heart.setFrame(1);
                }
            })
        }

        //updating the score
        let currscore = Math.floor(this.player.getTopY()/this.CONFIG.tile);
        this.score = currscore;
        this.curr_score.setText(`Distance : ${currscore}`);
    }
    triggerGameOver(){
        if(this.is_gameover) return;
        this.is_gameover = true;
        this.time.addEvent({
            delay : 1000,
            callback:this.showGameOver,
            callbackScope : this
        })
    }
    goMenu(){
        this.scene.start('Menu')
    }
    showGameOver(){
        // hide all things 
        this.btn_pause.setVisible(false);
        this.curr_score.setVisible(false);
        this.heartArr.forEach(heart => {
            heart.setVisible(false);
        })

        // show gameover scene
        // launch runs the scene in parallel of the current scene.
        this.scene.launch('GameOver',{score : this.score});
        let panel = this.scene.get('GameOver');

        panel.events.on('clickMenu',this.handleGoMenu,this);
        panel.events.on('clickTryAgain',this.handleTryAgain,this);
        
        
    }

    stopGameOver(){
        this.scene.stop('GameOver');
    }
    handleGoMenu(){
        this.stopGameOver();
        this.goMenu();
    }
    handleTryAgain(){
        this.stopGameOver();
        this.scene.restart();
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
        this.topBar = this.createBar(this.CONFIG.map_offset,0,this.CONFIG.width - this.CONFIG.map_offset*2,16,"0x3B0E2E");
        //bottom bar
        this.bottomBar = this.createBar(this.CONFIG.map_offset,this.CONFIG.height-this.CONFIG.tile*1.5,(this.CONFIG.width - this.CONFIG.map_offset*2),this.CONFIG.tile*1.5,"0x211708");
        //pauseBtn
        // this.btn_pause = this.add.sprite(-4,0,'pause').setScrollFactor(0).setDepth(this.DEPTH.ui).setOrigin(0);
        this.btn_pause = new Button(this,-4,0,'pause',this.handlePause);
        this.btn_pause.setOrigin(0,0)
        this.btn_pause.setDepth(this.DEPTH.ui);
        this.btn_pause.setScrollFactor(0,0);
        //rendering health bar
        this.createHealthBar(this.CONFIG.width - this.CONFIG.tile*3,4)
        // score text
        
        this.curr_score = new Text(this,this.bottomBar.getData("centerX"),this.bottomBar.getData("centerY"),"Distance : 0",'score',0.5);
        this.curr_score.setDepth(this.DEPTH.ui);
        this.curr_score.setScrollFactor(0);

    }
    createBar(x,y,width,height,color){
        let bar;
        bar = this.add.graphics({x : x, y : y});
        bar.fillStyle(color,1);
        bar.fillRect(0,0,width,height);
        bar.setDepth(this.DEPTH.ui);
        bar.setScrollFactor(0);
        bar.setDataEnabled();
        bar.setData("centerX",x + 0.5*width);
        bar.setData("centerY",y + 0.5*height);
        return bar;
    }
    createHealthBar(x,y){
        this.heartArr = [];
        let step = this.CONFIG.tile;
        for(let i = 0 ; i < this.player.health.total;i++){
            let icn = this.add.sprite(x + i*step,y,'heart').setDepth(this.DEPTH.ui).setOrigin(0).setScrollFactor(0).setScale(0.65).setFrame(0);
            this.heartArr.push(icn);
        }
    }
    //pause logic
    createPauseScreen(){
        this.veil = this.add.graphics({x:0,y:0});
        this.veil.fillStyle("0x000000",0.3);
        this.veil.fillRect(0,0,this.CONFIG.width,this.CONFIG.height);
        this.veil.setDepth(this.DEPTH.ui);

        this.txt_pause = new Text(
            this,this.CONFIG.centerX,this.CONFIG.centerY,'Pause','title'
        );
        this.txt_pause.setDepth(this.DEPTH.ui);
        this.txt_pause.setScrollFactor(0);

        this.tooglePauseScreen(false);
    }
    tooglePauseScreen(is_visible){
        this.veil.setVisible(is_visible);
        this.txt_pause.setVisible(is_visible);
    }
    handlePause(that){
        // console.log("hadling the pause")
        if(!that.allow_input)return;
        if(that.is_gameover) return;
        that.is_pause = !that.is_pause;
        that.tooglePauseScreen(that.is_pause);

        if(that.is_pause){
            that.startPause();
        }
        else{
            that.endPause();
        }
    }
    startPause(){
        if(this.player.states.walk){
            if(this.player.pauseScroll === 0){
                this.player.setPauseScroll(this.cameras.main.scrollY);
            }
            this.player.stopMoving();
        }
    }
    endPause(){
        if(this.player.states.idle){
            if(this.player.pauseScroll !== 0){
                this.player.setPauseScroll(0);
            }
            this.player.startMoving();   
        }
    }
}
