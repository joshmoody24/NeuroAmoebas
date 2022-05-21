import Genome from '../genetics/Genome.mjs';
import Circle from '../geometry/Circle.mjs';
import RecurrentNeuralNetwork from '../neural/RecurrentNeuralNetwork.mjs';

export default class Animal extends Circle {
	constructor(position, genome){

		super(position, genome.traitGenes.color, genome.traitGenes.size);

		this.genome = genome;
		this.brain = new RecurrentNeuralNetwork(genome);
		this.energy = genome.traitGenes.startingEnergy;
	}

	update(delta) {
		const area = Math.pow(this.genome.traitGenes.size, 2) * Math.PI;
		const metabolism = this.genome.traitGenes.moveSpeed * area * window.gameConfig.eneryBurnRatio;
		this.spendEnergy(metabolism * delta);
	}

	// the basic traits that all animals have
	static baseTraits(){
		const baseTraitGenes = {
			maxEnergy: 3,
			startingEnergy: 1,
			size: 1,
			moveSpeed: 1,
			rotateSpeed: 1,
			color: 0x33ffcc,
		}

		return baseTraitGenes;
	}

	move(vec){
		if(this.energy <= 0) return;
		this.x += vec.x;
		this.y += vec.y;
	
		
		// collision with borders
		if(this.x < 0 || this.x > window.gameManager.app.width){
			this.x = Math.min(Math.max(this.x, 0), window.gameManager.app.width);
		}
		if(this.y < 0 || this.y > window.gameManager.app.height){
			this.y = Math.min(Math.max(this.y, 0), window.gameManager.app.height);
		}
		this.spendEnergy(vec.magnitude() * this.genome.traitGenes.moveCost);
	}
	

	die(){
		this.parent.removeChild(this);
		this.destroy();
		console.log("dead");
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
		if(this.energy > this.traitGenes.maxEnergy){
			this.energy = this.traitGenes.maxEnergy;
		}
	}

}
