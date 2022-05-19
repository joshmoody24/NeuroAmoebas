import Circle from '../geometry/Circle.mjs';
import Brain from './Brain.mjs';

export default class Animal extends Circle {
	constructor(pos, genome){
		const radius = 10;
		super(pos, genome.traitGenes.color, genome.traitGenes.radius);
		this.movementSpeed = 1;
		this.brain = Brain.FromGenome(genome);
	}

	update(delta) {
		this.sprite.x += this.velocity.x * delta;
		this.sprite.y += this.velocity.y * delta;
	}
}