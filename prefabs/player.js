import Entity from './entity'
import Helper from './helper';

export default class Player extends Entity{
    constructor(ctx,x,y,key){
        super(ctx,x,y,key);
        this.playerSpeed = {
            base : 1,
            current : 2,
            max : 6
        }
        this.helper = new Helper()
        this.setHealth(3,3);
        this.pauseScroll = 0;
    }
    //setters
    setDepth(d){
        this.spr.setDepth(d);
    }
    //
    setPauseScroll(y){
        this.pauseScroll = y;
    }
    startMoving(){
        this.setStates('walk');
        this.startAnim('walk');
    }
    stopMoving(){
        this.setStates('idle');
        this.startAnim('idle');
        

    }
    update(is_holding){
        if(this.states.dead){
            this.handleDeadState();
        }  
        if(this.states.idle){
            this.handlePauseState();
        }
        this.setCurrentDirection(is_holding);
        if(this.states.walk){
            this.movePlayer();
        }
        if(this.direction.last !== this.direction.current)
            this.updatePlayerAnim();
        this.checkScrollDeath();
        
    }
    handleDeadState(){
        this.spr.setVelocityX(0);
        this.spr.setVelocityY(0);
        let scroll = this.ctx.cameras.main.scrollY;
        this.ctx.cameras.main.setScroll(0,this.spr.y - this.CONFIG.tile*1.7);
    }
    handlePauseState(){
        this.spr.setVelocityX(0);
        this.spr.setVelocityY(0);
        this.ctx.cameras.main.setScroll(0,this.pauseScroll);
    }
    checkScrollDeath(){
        if(this.states.dead) return;
        if(this.getTopY() <= Math.round(this.ctx.cameras.main.scrollY + this.CONFIG.tile*1.5)){
            this.die();
        }
    }
    die(){
        if(this.states.dead) return;
        this.health.current = 0;
        this.setStates('dead');
        this.startDeadAnim();
    }
    updatePlayerAnim(){
        this.stopAnim();
        switch(this.direction.current){
            case 'left':
                this.startLeftAnim();
                break;
            case 'right':
                this.startRightAnim()
                break;
            case 'up':
                this.startUpAnim();
                break;
            default : 
                this.startDownAnim();
                break;
        }
    }
    movePlayer(){
        if(!this.states.walk) return;
        // downward moving of the player
        if(this.direction.current === 'down')
        this.spr.setVelocityX(0);
        this.spr.setVelocityY(this.playerSpeed.current);
        //move the player left to left
        if(this.direction.current === 'left'){
            this.spr.setVelocityY(0);
            this.spr.setVelocityX(-this.playerSpeed.current);
        }
        if(this.direction.current === 'right'){
            this.spr.setVelocityY(0);
            this.spr.setVelocityX(this.playerSpeed.current);
        }
    }
    handleMatterCollision(){
        this.ctx.matter.world.on("collisionstart",(e,b1,b2)=>{
            if((b1.label === 'wall'&&b2.label === 'player')||(b1.label === 'player'&&b2.label === 'wall')){
                this.spr.setVelocityX(0);
                this.spr.setVelocityY(0);
            }
        })
    }

}