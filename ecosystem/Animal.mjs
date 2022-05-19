import Circle from '../geometry/Circle.mjs';
import RecurrentNeuralNetwork from '../neural/RecurrentNeuralNetwork.mjs';

export default class Animal extends Circle {
	constructor(position, genome){
		super(position, genome.traitGenes.color, genome.traitGenes.radius);
		this.genome = genome;
		this.brain = new RecurrentNeuralNetwork(genome);
	}

	update(delta) {
		this.sprite.x += this.velocity.x * delta;
		this.sprite.y += this.velocity.y * delta;
	}
}