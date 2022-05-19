export default class Vec2 {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    static add(vec1, vec2){
	return new Vec2(vec1.x + vec2.x, vec1.y + vec2.y);
    }

    static substract(vec1, vec2){
    	return new Vec2(vec1.x - vec2.x, vec1.y - vec2.y);
    }

    magnitude(){
	return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}
