export default class Vec2 {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    static add(vec1, vec2){
	return new Vec2(vec1.x + vec2.x, vec1.y + vec2.y);
    }

    static subtract(vec1, vec2){
    	return new Vec2(vec1.x - vec2.x, vec1.y - vec2.y);
    }

    static multiply(vec, amount){
        return new Vec2(vec.x * amount, vec.y * amount);
    }

    static distance(vec1, vec2){
        const result = Math.sqrt(Math.pow(vec1.x-vec2.x, 2) + Math.pow(vec1.y-vec2.y, 2));
        return result;
    }

    normalized(){
        return new Vec2(this.x / this.magnitude(), this.y / this.magnitude());
    }

    magnitude(){
	return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}
