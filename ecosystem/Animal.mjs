import Genome from '../genetics/Genome.mjs';
import TraitGene from '../genetics/TraitGene.mjs';
import Circle from '../geometry/Circle.mjs';
import Color from '../geometry/Color.mjs';
import RecurrentNeuralNetwork from '../neural/RecurrentNeuralNetwork.mjs';
import Vec2 from '../geometry/Vec2.mjs';

export default class Animal extends Circle {
	constructor(position, genome){
		super(position, genome.traitGenes.color.value, genome.traitGenes.size.value);

		this.genome = genome;
		this.brain = new RecurrentNeuralNetwork(genome);
		this.energy = genome.traitGenes.startingEnergy.value;
		this.lifetime = 0;
		this.generation = 0;
	}

	update(delta) {
		this.lifetime += delta;
		const area = Math.pow(this.genome.traitGenes.size.value, 2) * Math.PI;
		const metabolism = (this.genome.traitGenes.moveSpeed.value * area) * window.gameConfig.energyBurnRatio;
		// big brains are energy intensive
		const numNeurons = this.brain.nodes.length;
		const neuronCost = numNeurons * this.genome.traitGenes.neuronCost.value;
		this.spendEnergy((metabolism + neuronCost) * delta);

		// photosynthesis is proportional to circumference, not area (2d world rules)
		this.gainEnergy(
			this.genome.traitGenes.photosynthesis.value *
			window.gameConfig.illuminationPercent *
			window.gameConfig.photosynthesisEfficiency *
			this.genome.traitGenes.size.value *
			Math.PI * 2 *
			delta);
		if(this.killAtEndofFrame) this.die();
	}

	// the basic traits that all animals have
	static baseTraits(){
		const baseTraitGenes = {
			startingEnergy: new TraitGene(1, false),
			size: new TraitGene(1, false),
			moveSpeed: new TraitGene(1, true),
			rotateSpeed: new TraitGene(1, true),
			color: new TraitGene(new Color(), true, "color"),
			neuronCost: new TraitGene(0.0001, false),
			photosynthesis: new TraitGene(.8, true, "default", 0, 1),
		}

		return baseTraitGenes;
	}

	move(vec){
		if(this.energy <= 0) return;
		const photosynthesisPenalty = 1 - this.genome.traitGenes.photosynthesis.value;
		vec = Vec2.multiply(vec, photosynthesisPenalty);
		this.x += vec.x;
		this.y += vec.y;
	
		
		// collision with borders
		if(this.x < 0 || this.x > window.gameManager.app.screen.width){
			this.x = Math.min(Math.max(this.x, 0), window.gameManager.app.screen.width);
		}
		if(this.y < 0 || this.y > window.gameManager.app.screen.height){
			this.y = Math.min(Math.max(this.y, 0), window.gameManager.app.screen.height);
		}
		this.spendEnergy(vec.magnitude() * this.genome.traitGenes.moveCost.value * Math.pow(this.genome.traitGenes.size.value ,2));
	}

	rotate(amount){
		this.rotation += amount;
		this.spendEnergy(Math.abs(amount) * this.genome.traitGenes.rotateCost.value * Math.pow(this.genome.traitGenes.size.value ,2));
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
		const maxEnergy = this.genome.traitGenes.size.value * window.gameConfig.maxEnergyPerArea;
		if(this.energy > maxEnergy){
			this.energy = maxEnergy;
		}
	}

}
