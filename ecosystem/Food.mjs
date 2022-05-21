import Circle from "../geometry/Circle.mjs";

export default class Food extends Circle {

	constructor(pos, color, radius){
		super(pos,color,radius);
		this.energy = window.gameConfig.foodEnergy;
	}

	update(delta) {
		let s = 1 + Math.sin(new Date() * 0.01) * 0.2;
		this.scale.set(s, s);
	}
}
