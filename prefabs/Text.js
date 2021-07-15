export default class Text {

    constructor(ctx, x, y, str, style , origin){
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.text = str;
        this.style = this.initStyle(style);
        this.origin = this.initOrigin(origin);
        this.obj = this.createText();
    }
    initStyle(key){
        let style = {
            fontFamily : "ClickPixel",
            fontSize : 32,
            color : '0xFFFFFF',
            align : 'center'
        }
        switch(key.toLowerCase()){
            case 'title':
                style.fontSize = 48;
                break;
            case 'preload':
                style.fontSize = 38;
                break;
            case 'score':
                style.fontSize = 32;
                break;
            case 'standard':
                style.fontSize = 32;
                
        }
        return style;
    }
    initOrigin(origin){
        if(typeof(origin) === 'number'){
            return {
                x : origin,
                y : origin
            }
        }
        else if(typeof(origin) === 'object'){
            return origin
        }
        else {
            return {
                x : 0.5,
                y : 0.5
            }
        }
    }
    createText(){
        let obj = this.ctx.add.bitmapText(
            this.x,
            this.y,
            this.style.fontFamily,
            this.text,
            this.style.fontSize,
            this.style.align
        );

        obj.setOrigin(this.origin.x,this.origin.y);
        return obj;
    }
    destroy(){
        this.obj.destroy();
        this.obj = false;
    }

    setText(str){
        this.text = str;
        this.obj.setText(str) ;
    }
    setDepth(d){
        this.obj.setDepth(d);
    }
    setScrollFactor(d){
        this.obj.setScrollFactor(d);
    }
    setVisible(is_visible){
        this.obj.setVisible(is_visible);
    }
} 