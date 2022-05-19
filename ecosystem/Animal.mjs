import Circle from '../geometry/Circle.mjs';

export default class Animal extends Circle {
	constructor(pos, color){
		const radius = 10;
		super(pos,color, radius);
		this.movementSpeed = 1;
	}

	update(delta) {
		this.sprite.x += this.velocity.x * delta;
		this.sprite.y += this.velocity.y * delta;
	}

	static FromGenome(genome, pos){
		return new Animal(pos, 0x33ffcc);
	}
}