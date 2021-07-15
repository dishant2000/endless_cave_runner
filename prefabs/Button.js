import Text from '../prefabs/Text'
export default class Button{
    constructor(ctx,x,y,key,callback,str){
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.key = key;
        this.callback = callback;
        this.text = str;
        this.height;
        this.width;
        this.frames = {
            out : 0, 
            over : 1,
            down : 2,
        }

        this.origin = this.initOrigin();
        this.obj = this.initObj();
    }

    //Init

    initOrigin(origin){
        if(typeof origin === 'number'){
            return {
                x : origin,y : origin
            }
        }
        else if(typeof origin === 'object'){
            return origin
        }
        else{
            return {
                x : 0.5,  y:0.5
            }
        }
    }

    initObj(){
        let btn = this.createSprite();
        this.width = btn.displayWidth;
        this.height = btn.displayHeight;
        let lbl = false;
        if(typeof this.text === 'string'){
            lbt = new Text(this.ctx,this.width*0.5,this.height*0.5,this.text,'standard');
        }
        return{
            btn:btn,
            lbl:lbl
        }
    }

    createSprite(){
        let spr = this.ctx.add.sprite(this.x,this.y,this.key);
        spr.setOrigin(this.origin.x,this.origin.y);

        //we can make it interactive

        spr.setInteractive();

        spr.on('pointerout',this.handleOut,this);
        spr.on('pointerover',this.handleOver,this);
        spr.on('pointerdown',this.handleDown,this);
        spr.on('pointerup',this.handleUp,this);
        return spr;
    }

    handleOut(){
        this.obj.btn.setFrame(this.frames.out);
    }
    handleDown(){
        this.obj.btn.setFrame(this.frames.down);
    }
    handleOver(){
        this.obj.btn.setFrame(this.frames.over);
    }
    handleUp(){
        this.obj.btn.setFrame(this.frames.out);
        this.callback(this.ctx);
    }

    //destroy 

    destory(){
        if(this.obj.btn)this.obj.btn.destory();
        if(this.obj.lbl)this.obj.lbl.destory();
        this.obj = {};
    }


    //setters

    setDepth(d){
        this.obj.btn.setDepth(d);
        if(this.obj.lbl){
            this.obj.lbl.setDepth(d);
        }
    }
    setScrollFactor(sx,sy){
        this.obj.btn.setScrollFactor(sx,sy);
        if(this.obj.lbl){
            this.obj.lbl.setScrollFactor(sx,sy);
        }
    }
    setScale(s){
        this.obj.btn.setScale(s);
        if(this.obj.lbl){
            this.obj.lbl.setScale(s);
        }
        this.width = this.obj.btn.displayWidth;
        this.height = this.obj.btn.displayHeight;

    }
    setOrigin(x,y){
        this.obj.btn.setOrigin(x,y);
    }
    setVisible(s){
        this.obj.btn.setVisible(s);
    }

    
}