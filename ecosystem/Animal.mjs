import Circle from '../geometry/Circle.mjs';
import RecurrentNeuralNetwork from '../neural/RecurrentNeuralNetwork.mjs';

export default class Animal extends Circle {
	constructor(position, genome){
		super(position, genome.traitGenes.color, genome.traitGenes.radius);
		this.genome = genome;
		this.brain = new RecurrentNeuralNetwork(genome);

		// TODO: make the implementation better
		this.maxEnergy = 3;
		this.startingEnergy = 1;
		this.energy = this.startingEnergy;
	}

	update(delta) {
		this.x += this.velocity.x * delta;
		this.y += this.velocity.y * delta;
	}
	

	die(){
		this.parent.removeChild(this);
		this.destroy();
	}


	spendEnergy(amount){
		this.energy -= amount;
		if(this.energy < 0){
			this.energy = 0;
			this.die();
		}
	}

	gainEnergy(amount){
		this.energy += amount;
		if(this.energy > this.maxEnergy){
			this.energy = this.maxEnergy;
		}
	}

}
