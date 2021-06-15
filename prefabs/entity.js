export default class Entity{
    constructor(ctx,x,y,key){
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.key = key;
        this.height = 32;
        this.width = 32;
        this.frames = {
            idle : 0,
            dead : 3
        }
        this.states = {
            idle : true,
            walk : false,
            hurt : false,
            dead  : false,
            last : false
        }
        this.direction = {
            last : false,
            current : 'down'
        }
        this.health = {
            total : 1,
            current : 1
        }
        this.speed = {
            base : 1,
            current : 2,
            max : 6
        }


    }

    createSprite(){
        if(this.spr){
            this.spr.destroy();
        }
        this.spr = this.ctx.add.sprite(this.x,this.y,this.key);
        this.spr.setOrigin(0.5);
    }

    startAnim(name){
        this.stopAnim();
        switch(name){
            case 'walk':
                this.startWalkAnim();
                break;
            case 'idle':
                this.startIdleAnim();
                break;
            case 'hurt':
                break;
            case 'dead':
                this.startDeadAnim();
                break;
            default : console.log("invalid animation!!");
        }
    }

    startWalkAnim(){
        if(this.direction.current === 'down'){
            this.startDownAnim();
            
        }
        if(this.direction.current === 'left'){
            this.startLeftAnim();
            
        }
        if(this.direction.current === 'right'){
            this.startRightAnim();
            
        }
    }

    startIdleAnim(){
        this.stopAnim();
    }
    startLeftAnim(){
        this.spr.play(this.key + '-leftwalk');
    }

    startRightAnim(){
        this.spr.play(this.key + '-rightwalk');
    }
    startDownAnim(){
        this.spr.play(this.key + '-walk');
    }
    stopAnim(){
        this.spr.anims.stop();
    }
    
    setSpritePos(x,y){
        if(typeof(x) === 'number'){
            this.x = x;
        }
        if(typeof(y) === 'number'){
            this.y = y;
        }
        this.spr.setX(this.x);
        this.spr.setY(this.y);
    }
    updateSpriteDirection(){
        //this.stopAnim();
        switch(this.direction.current){
            case 'left':
                this.spr.setAngle(90);
                // this.startLeftAnim();
                break;
            case 'right':
                this.spr.setAngle(-90);
                // this.startRightAnim()
                break;
            case 'up':
                this.spr.setAngle(180);
                // this.startUpAnim();
                break;
            default : 
                this.spr.setAngle(0);
                // this.startDownAnim();

        }
        // this.startWalkAnim();
    }
    
    setCurrentDirection(is_holding){
        if(is_holding.direction){
            let last = this.direction.current;
            this.direction.current = is_holding.direction;
            this.direction.last = last;
        }
        else{
            this.direction.last = this.direction.current;
            this.direction.current = 'down';
        }

    }
    setStates(curr){
        if(!this.states.hasOwnProperty(curr)) {
            console.log("Invalid key : " + curr);
            return;
        }
        this.resetStates();
        this.states[curr] = true;
        this.states.last = curr;

    }
    resetStates(){
        for(const i in this.states){
            if(this.states.hasOwnProperty(i)){
                this.states[i] = false;
            }
        }
    }
}