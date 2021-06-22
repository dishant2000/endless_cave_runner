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
    }
    //setters
    setDepth(d){
        this.spr.setDepth(d);
    }
    //

    startMoving(){
        this.setStates('walk');
        this.startAnim('walk');
    }
    stopMoving(){
        this.setStates('idle');
        this.startAnim('idle');
        

    }
    update(is_holding){
        if(this.states.dead) return;

       
        this.setCurrentDirection(is_holding);
        if(this.states.walk){
            this.movePlayer();
        }
        if(this.direction.last !== this.direction.current)
            this.updatePlayerAnim();
        
        
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
        // downward moving of the player

        
        if(this.direction.current === 'down')
        // this.setSpritePos(this.x,this.y + this.playerSpeed.current);
        this.spr.setVelocityX(0);
        this.spr.setVelocityY(this.playerSpeed.current);
        
        //move the player left to left

        if(this.direction.current === 'left'){
            // this.setSpritePos(this.x - this.playerSpeed.current, this.y);
            this.spr.setVelocityY(0);
            this.spr.setVelocityX(-this.playerSpeed.current);

        }

        if(this.direction.current === 'right'){
            // this.setSpritePos(this.x + this.playerSpeed.current, this.y);
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