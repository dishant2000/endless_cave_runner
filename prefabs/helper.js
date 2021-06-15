export default class Helper{
    constructor(){

    }
    genrateRangeRand(min,max){
        return Math.floor(Math.random() * (max - min) + min); 
    }
}