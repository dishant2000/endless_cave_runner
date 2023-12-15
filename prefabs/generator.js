import Helper from './helper';
import Monster from './Monster';
export default class Generator{
    constructor(ctx){
        this.CONFIG = ctx.CONFIG;
        this.DEPTH = ctx.DEPTH;
        this.ctx = ctx;
        this.cols = 11;
        this.rows = 20;

        this.layers = {
            floor : [],
            walls : [],
            monsters : [],
            pickups : [],
            turrets : [],
            overlay : false
        }
        this.helper = new Helper();
        this.ty_offset = 0;
        this.px_offset = 0;
        this.height = 0;
        this.currHightFactor = 0;
    }
    setup(){
        this.createFloor();
        this.createRoom();
        this.drawSpikes();
    }
    update(){
        this.scrollFloor();
        this.checkNewRoom();
    }

    //Floor layer
    createFloor(){

        let x;
        let y;
        let spr;
        let cols = this.cols;
        //one row more as to show concurrent design if there is any lag
        let rows = this.rows  + 1;
        let floor = [];
        for(let i = 0 ; i < rows ; i++){
            floor[i] = [];
            for(let j = 0 ; j < cols; j++)
            {
                x = j * this.CONFIG.tile + this.CONFIG.map_offset;
                y = i * this.CONFIG.tile;

                spr = this.ctx.add.sprite(x,y,'floortile');
                spr.setOrigin(0);
                spr.setDepth(this.DEPTH.floor)
                floor[i].push(spr);
            }
        }
        this.layers.floor = floor;
        // console.log("initfloor = ",this.layers.floor)
    }
    scrollFloor(){
        let offset = this.ctx.cameras.main.scrollY - this.layers.floor[0][0].y;
        if(offset >= this.CONFIG.tile){
            this.appendFloorRow();
            this.destroyFloorRow();
        }
    }
    destroyFloorRow(){
        for(let i = 0 ; i < this.layers.floor[0].length;i++){
            this.layers.floor[0][i].destroy();
        }
        this.layers.floor.splice(0,1);

    }
    appendFloorRow(){
        let spr;
        let oneRow = [];
        let i = this.layers.floor.length;
        for(let j = 0 ; j < this.cols; j++)
            {
                let x = j * this.CONFIG.tile + this.CONFIG.map_offset;
                let y = (i - 1) * this.CONFIG.tile + this.ctx.cameras.main.scrollY;

                spr = this.ctx.add.sprite(x,y,'floortile');
                spr.setOrigin(0);
                spr.setDepth(this.DEPTH.floor);
                oneRow.push(spr);
            }
        this.layers.floor.push(oneRow);
    }


    //wall layer
    createRoom(){
        //current scroll
        let curr_scroll = this.ctx.cameras.main.scrollY;
        //generate wall
        let walls = this.generateWalls();
        // paste it on the canvas
        walls = this.createWalls(walls);
        //update the layers object 
        this.layers.walls = this.layers.walls.concat(walls);

        // Add monsters
        // ... generate
        let monsters = this.generateMonsters();
        // ... draw 
        monsters = this.createMonsters(monsters);
        // ... append
        this.layers.walls = this.layers.monsters.concat(monsters);

        this.saveHeight();
        this.currHightFactor = curr_scroll + this.height;
        
    }

    generateWalls(){
        let walls = [];
        for(let ty = 0 ; ty < 1.5 * this.rows ; ty++){
            //leave first 4 rows and then make walls every 3rd row
            if(this.layers.walls.length + ty >= 5 && (ty +  1) % 3 === 0 ){
                walls.push(this.generateWallRow());
            }
            else{
                walls.push(this.generateEmptyWallRow());
            }
        }
        return walls;
    }

    generateEmptyWallRow(){
        let wallRow = [];
        for(let i = 0 ; i < this.cols; i++){
            wallRow.push({
                tx : i,
                is_wall : false
            })
        }
        return wallRow;
    }

    generateWallRow(){
        // here we have to find how many gaps should be there and how many wide they are and where to place them

        let gaps = [];
        for(let i = 0 ; i < this.helper.genrateRangeRand(1,3); i++){
            gaps.push({
                idx : i,
                width : 2
            })
        }

        let tx = this.helper.genrateRangeRand(1,this.cols - gaps[0].width - 1);
        gaps[0] = this.buildGap(tx,gaps[0].width);
        
        if(gaps[1]){
            let tx = this.helper.genrateRangeRand(1,this.cols - gaps[1].width - 1);
            gaps[1] = this.buildGap(tx,gaps[1].width);
        }

        let wallRow = this.buildRow(gaps);

        return wallRow;
    }

    buildGap(tx,width){
        let gap = {
            tx : tx,
            width : width
        }

        gap.empty = [];
        for(let i = 0 ; i < gap.width; i++){
            gap.empty.push(tx + i);
        }
        gap.reserve = [];
        for(let i = -2; i < gap.width + 2 ; i++){
            gap.reserve.push(tx + i);
        }
        return gap;
    }
    buildRow(gaps){
        let row = [];

        for(let  i = 0 ; i < this.cols; i++){
            row.push({
                tx : i,
                is_wall : true
            })
        }

        gaps.forEach(el => {
            for(let j = el.tx; j < el.tx + el.width ; j ++){
                if(row[j]){
                    row[j].is_wall = false;
                }
            }
        })
        return row;
    }
    createWalls(walls){
        let x,y,spr;  
        for(let ty = 0 ; ty  < walls.length; ty++){
            y = ty*this.CONFIG.tile + this.height;
            for(let tx = 0 ; tx < walls[ty].length; tx++){
                x = (tx * this.CONFIG.tile)  + this.CONFIG.map_offset + Math.round(this.CONFIG.tile/2);
                if(walls[ty][tx].is_wall){
                    spr = this.ctx.matter.add.sprite(x,y,'wall',null,{label : 'wall'});
                    spr.setStatic(true);
                    spr.setOrigin(0.5);
                    spr.setDepth(this.DEPTH.wall);
                    walls[ty][tx].spr = spr;
                }
            }
        }
        
        return walls;
    }

    checkNewRoom(){
        if(this.ctx.cameras.main.scrollY + this.ctx.cameras.main.height < this.height){
            return;
        }
        this.px_offset = this.ctx.cameras.main.scrollY;
        this.destroyPassedRows();
        this.createRoom();
        
    }
    saveHeight(){
        this.height += 30 * this.CONFIG.tile  ;
    }
    destroyPassedRows(){
        let row_r_num = 0;
        for(let i = 0; i < this.layers.walls.length;i++){
            if(this.layers.walls[i][0] && this.layers.walls[i][0].spr){
                if(this.layers.walls[i][0].spr.y < this.px_offset){
                    row_r_num ++;
                }
                else{
                    break;
                }
            }
        }
        // finding the real row num
        for(let i = 0 ; i < row_r_num; i++){
            for(let j = 0 ; j < this.cols; j++){
                if(this.layers.walls[i][j].spr){
                    this.layers.walls[i][j].spr.destroy();
                }
            }         
        }
        for(let i = 0 ; i < row_r_num; i++){
            this.layers.walls.splice(0,1);
        }

        // monsters
        for(let i = this.layers.monsters.length - 1; i >=0; i--){
            if(this.layers.monsters.y <= this.ctx.cameras.main.scrollY){
                // destroy sprite
                this.layers.monsters[i].destroy();
                // remove from layers
                this.layers.monsters.splice(i,1);
            }
        }
    }


    // monsters layer
    generateMonsters(){
        // generate a random pos
        let pos = this.getRandPosInRoom();
        //check if its not a wall
        while(this.layers.walls[pos.row] && this.layers.walls[pos.row][pos.col] && this.layers.walls[pos.row][pos.col].is_wall){
            pos = this.getRandPosInRoom();
        }
        // spawn position in px
        let spawn = {
            tx : pos.col,
            ty : pos.row,
            x : this.CONFIG.map_offset + ((pos.col + 0.5) * this.CONFIG.tile),
            y : ((pos.row + 0.5) * this.CONFIG.tile)
        }
        // return one new monster for each room
        return [{
            spawn : spawn,
            key : this.getMonstersKey()
        }]
    }
    getMonstersKey(){
        let keys = ['spr-slime'];
        let id = this.helper.genrateRangeRand(0, keys.length - 1);
        return keys[id];
    }
    createMonsters(monsters){
        for(let i = 0 ; i < monsters.length; i++){
            monsters[i] = new Monster(
                this.ctx,monsters[i].spawn.x, monsters[i].spawn.y, monsters[i].key
            );
            monsters[i].createSprite();
            monsters[i].setDepth(this.DEPTH.monster);
        }
        return monsters;
    }
    // overlay spikes

    drawSpikes(){
        let x,y,spr;
        let ty = 0;
        let overlay = []
        for(let tx = 0 ; tx < this.cols; tx++){
            x = tx*this.CONFIG.tile + this.CONFIG.map_offset;
            y = ty*this.CONFIG.tile+16;
            let spr = this.ctx.add.sprite(x,y,'spike');
            spr.setOrigin(0);
            spr.setDepth(this.DEPTH.overlay);
            spr.setScrollFactor(0);
            overlay.push(spr);
        }

        this.layers.overlay = overlay;
    }

    // helpers

    getRandPosInRoom(){
        let min = {
            col : 0,
            row : Math.floor((this.px_offset + this.ctx.cameras.main.height)/this.CONFIG.tile)
        }

        let max = {
            col : this.cols - 1,
            row : Math.floor((this.px_offset + this.CONFIG.height)/ this.CONFIG.tile)
        }

        let col = this.helper.genrateRangeRand(min.col,max.col);
        let row = this.helper.genrateRangeRand(min.row, max.row);

        return {
            row : row,
            col : col
        }
    }
}