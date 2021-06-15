import Helper from './helper';
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
        this.heper = new Helper();
        this.ty_offset = 0;
        this.px_offset = 0;
        this.height = 0;
    }
    setup(){
        this.createFloor();
        this.createRoom();
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
    }
    scrollFloor(){
        let offset = this.ctx.cameras.main.scrollY - this.layers.floor[0][0].y;
        if(offset >= this.CONFIG.tile){
            this.destroyFloorRow();
            this.appendFloorRow();
        }
    }
    destroyFloorRow(){
        for(let i = 0 ; i < this.layers.floor[0].length;i++){
            this.layers.floor[0][i].destroy();
        }
        this.layers.floor.splice(1,0);
    }
    appendFloorRow(){
        let spr;
        let oneRow = [];
        let i = this.layers.floor.length;
        for(let j = 0 ; j < this.cols; j++)
            {
                let x = j * this.CONFIG.tile + this.CONFIG.map_offset;
                let y = i * this.CONFIG.tile;

                spr = this.ctx.add.sprite(x,y,'floortile');
                spr.setOrigin(0);
                spr.setDepth(this.DEPTH.floor);
                oneRow.push(spr);
            }
        this.layers.floor.push(oneRow);
    }


    //wall layer
    createRoom(){
        //generate wall
        let walls = this.generateWalls();
        // paste it on the canvas
        walls = this.createWalls(walls);
        //update the layers object 
        this.layers.walls = this.layers.walls.concat(walls);
        // console.log(this.layers.walls);
        this.saveHeight();
        
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

        for(let i = 0 ; i < this.heper.genrateRangeRand(1,2); i++){
            gaps.push({
                idx : i,
                width : 2
            })
        }

        let tx = this.heper.genrateRangeRand(1,this.cols - gaps[0].width - 1);
        gaps[0] = this.buildGap(tx,gaps[0].width);
        
        if(gaps[1]){
            let tx = this.heper.genrateRangeRand(1,this.cols - gaps[1].width - 1);
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
        // console.log(walls.length);   
        for(let ty = 0 ; ty  < walls.length; ty++){
            for(let tx = 0 ; tx < walls[ty].length; tx++){
                x = (tx * this.CONFIG.tile)  + this.CONFIG.map_offset;
                y = (ty + this.layers.walls.length)*this.CONFIG.tile;

                if(walls[ty][tx].is_wall){
                    // console.log("yae chala tha")
                    spr = this.ctx.add.sprite(x,y,'wall');
                    spr.setOrigin(0);
                    spr.setDepth(this.DEPTH.wall);
                    walls[ty][tx].spr = spr;
                    // console.log(walls[ty][tx].spr);
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
        this.height = this.layers.walls.length * this.CONFIG.tile;
    }
    destroyPassedRows(){
        let row_num = Math.floor(this.px_offset/this.CONFIG.tile);
        for(let i = 0 ; i < row_num; i++){
            for(let j = 0 ; j < this.cols; j++){
                if(this.layers.walls[i][j].spr){
                    this.layers.walls[i][j].spr.destroy();
                }

            }

            // this.layers.walls = this.layers.walls.shift();
        }
        // this.layers.walls = this.layers.walls.shift();
        // console.log(this.layers.walls);
    }
}