import Genome from '../genetics/Genome.mjs';
import Circle from '../geometry/Circle.mjs';
import Color from '../geometry/Color.mjs';
import RecurrentNeuralNetwork from '../neural/RecurrentNeuralNetwork.mjs';

export default class Animal extends Circle {
	constructor(position, genome){

		super(position, genome.traitGenes.color, genome.traitGenes.size);

		this.genome = genome;
		this.brain = new RecurrentNeuralNetwork(genome);
		this.energy = genome.traitGenes.startingEnergy;
		this.lifetime = 0;
		this.generation = 0;
	}

	update(delta) {
		this.lifetime += delta;
		const area = Math.pow(this.genome.traitGenes.size, 2) * Math.PI;
		const metabolism = this.genome.traitGenes.moveSpeed * area * window.gameConfig.energyBurnRatio;
		// big brains are energy intensive
		const numNeurons = this.brain.nodes.length;
		const neuronCost = numNeurons * this.genome.traitGenes.neuronCost;
		this.spendEnergy((metabolism + neuronCost) * delta);
		if(this.killAtEndofFrame) this.die();
	}

	// the basic traits that all animals have
	static baseTraits(){
		const baseTraitGenes = {
			maxEnergy: 6,
			startingEnergy: 2,
			size: 1,
			moveSpeed: 1,
			rotateSpeed: 1,
			color: new Color(),
			neuronCost: 0.0003,
		}

		return baseTraitGenes;
	}

	move(vec){
		if(this.energy <= 0) return;
		this.x += vec.x;
		this.y += vec.y;
	
		
		// collision with borders
		if(this.x < 0 || this.x > window.gameManager.app.screen.width){
			this.x = Math.min(Math.max(this.x, 0), window.gameManager.app.screen.width);
		}
		if(this.y < 0 || this.y > window.gameManager.app.screen.height){
			this.y = Math.min(Math.max(this.y, 0), window.gameManager.app.screen.height);
		}
		this.spendEnergy(vec.magnitude() * this.genome.traitGenes.moveCost);
	}
	

	// only die at the end of the update function
	// to prevent weird bugs
	die(){
		window.gameManager.app.stage.removeChild(this);
		this.destroy(true);
	}
	
	prepareToDie(){
		this.killAtEndofFrame = true;
	}


	spendEnergy(amount){
		this.energy -= amount;
		if(this.energy < 0){
			this.energy = 0;
			this.prepareToDie();
		}
	}

	gainEnergy(amount){
		this.energy += amount;
		if(this.energy > this.genome.traitGenes.maxEnergy){
			this.energy = this.genome.traitGenes.maxEnergy;
		}
	}

}
