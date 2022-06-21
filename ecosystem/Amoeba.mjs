import Genome from "../genetics/Genome.mjs";
import Animal from "./Animal.mjs";
import NodeGene from '../genetics/NodeGene.mjs';
import NodeType from '../genetics/NodeType.mjs';
import Activations from "../neural/Activations.mjs";
import ConnectionGene from '../genetics/ConnectionGene.mjs';
import Vec2 from "../geometry/Vec2.mjs";
import Food from './Food.mjs';
import Raycast from "../geometry/Raycast.mjs";
import Connection from "../neural/Connection.mjs";
import Color from '../geometry/Color.mjs';
import Circle from "../geometry/Circle.mjs";
import TraitGene from "../genetics/TraitGene.mjs";

export default class Amoeba extends Animal {
	constructor(position, genome) {

		super(position, genome);

		const amoebaActionMap = {
			"move_forward": (val, delta) => {
				if(isNaN(val)) throw "Rotate node val must be a number";
				if(isNaN(delta)) throw "delta must be a number";
				const x = Math.cos(this.rotation) * val * this.genome.traitGenes.moveSpeed.value * delta;
				const y = Math.sin(this.rotation) * val * this.genome.traitGenes.moveSpeed.value * delta;
				this.move(new Vec2(x,y));
			},
			"rotate": (val, delta) => {
				if(isNaN(val)) throw "Rotate node val must be a number";
				if(isNaN(delta)) throw "delta must be a number";
				this.rotate(val * delta * this.genome.traitGenes.rotateSpeed.value);
			},
		}

		this.senses = genome.nodeGenes.filter(ng => ng.nodeType == NodeType.INPUT).map(ng => ng.name);
		this.actions = genome.nodeGenes.filter(ng => ng.nodeType == NodeType.OUTPUT).map(ng => ng.name);
		this.actionMap = amoebaActionMap;
		this.timeSinceReproduction = 0;
	}

	static InitialGenome(){
		const baseTraits = Animal.baseTraits();

		const senseNames = ["energy", "food_distance_center", "food_distance_left", "food_distance_right", "enemy_distance", "enemy_size", "pulse"];
		const amoebaSenses = senseNames.map(sense => new NodeGene(window.gameManager.nextInnovationNumber(), NodeType.INPUT, "Identity", sense, 0));

		const actionNames = [
			{name: "move_forward", activation: "Clamp"},
			{name: "rotate", activation: "Identity"},
		]
		const amoebaActions = actionNames.map(action => new NodeGene(window.gameManager.nextInnovationNumber(), NodeType.OUTPUT, action.activation, action.name, 0));
		
		const amoebaConnections = [/* */
			// temp
			//new ConnectionGene(window.gameManager.nextInnovationNumber(), upNodeId, moveNodeId, 1),
			//new ConnectionGene(window.gameManager.nextInnovationNumber(), leftNodeId, rotateNodeId, -1),
			//new ConnectionGene(window.gameManager.nextInnovationNumber(), rightNodeId, rotateNodeId, 1),
			//new ConnectionGene(window.gameManager.nextInnovationNumber(), foodNodeId, rotateNodeId, 1),
			//new ConnectionGene(window.gameManager.nextInnovationNumber(), pulseNodeId, moveNodeId, 1),
		];

		const amoebaTraits = {
			color: new TraitGene(new Color(1,1,1), true, "color", 0, 1),
			moveSpeed: new TraitGene(8, true),
			rotateSpeed: new TraitGene(2, true),
			moveCost: new TraitGene(.3, false),
			rotateCost: new TraitGene(0.1, false),
			reproductionCooldown: new TraitGene(12, true, "default", 5, 100),
			sightRange: new TraitGene(100, true, "default", 1, 500),
			mutationRate: new TraitGene(0.5, true),
			size: new TraitGene(0.6, true, "default", 0.5, 50),
			startingEnergy: new TraitGene(100, true, "default", 5, 400),
			eyeAngle: new TraitGene(10, true, "default", 0.1, 179),
		};

		const traitGenes = {...baseTraits, ...amoebaTraits}

		const amoebaGenome = new Genome(amoebaSenses, amoebaActions, amoebaConnections, traitGenes);
		// start facing up, just for fun
		this.rotation += Math.PI / 2;
		return amoebaGenome;
	}

	update(delta){
		this.checkCollisions();
		this.timeSinceReproduction += delta;

		// get the inputs
		const inputValues = {};
	
		const foodDistanceCenterNode = this.brain.nodes.find(n => n.name === "food_distance_center");
		const foodDistanceLeftNode = this.brain.nodes.find(n => n.name === "food_distance_left");
		const foodDistanceRightNode = this.brain.nodes.find(n => n.name === "food_distance_right");

		//const randomNode = this.brain.nodes.find(n => n.name === "random");
		const energyNode = this.brain.nodes.find(n => n.name === "energy");
		const pulseNode = this.brain.nodes.find(n => n.name === "pulse");
		const enemyDistNode = this.brain.nodes.find(n => n.name === "enemy_distance");
		const enemySizeNode = this.brain.nodes.find(n => n.name === "enemy_size");

		const foodData = this.distanceToFood();
		foodDistanceLeftNode.value = foodData[0];
		foodDistanceCenterNode.value = foodData[1];
		foodDistanceRightNode.value = foodData[2];

		const enemyInfo = this.enemyInfo();
		enemyDistNode.value = enemyInfo.distance;
		enemySizeNode.value = enemyInfo.size;
		//randomNode.value = Math.random();
		energyNode.value = this.energy / (this.genome.traitGenes.size.value * window.gameConfig.maxEnergyPerArea);
		pulseNode.value = Math.abs(Math.sin(window.gameManager.gameTime));

		const nnResults = this.brain.evaluate();

		Object.keys(this.actionMap).forEach(action => {
			const outputValue = nnResults[this.brain.nodes.find(n => n.name === action).id];
			this.actionMap[action](outputValue, delta);
		});
		if(this.timeSinceReproduction > this.genome.traitGenes.reproductionCooldown.value && this.energy > this.genome.traitGenes.startingEnergy.value * 2) this.layEgg();

		Animal.prototype.update.call(this, delta);
	}

	checkCollisions(){
		const thingsBeingTouched = window.gameManager.app.stage.children.filter(t => t instanceof Circle && this.collide(t));
		const foodTouching = thingsBeingTouched.filter(f => f instanceof Food);
		const amoebasTouching = thingsBeingTouched.filter(a => a instanceof Amoeba);
		const weakAmoebasTouching = amoebasTouching.filter(a => a.genome.traitGenes.size.value < this.genome.traitGenes.size.value * window.gameConfig.maxEatableSize);

		this.eatFood(weakAmoebasTouching);
		this.eatFood(foodTouching);
	}

	eatFood(foodBeingTouched){
		const touchingEnergy = foodBeingTouched.reduce((sum, f) => sum += f.energy, 0);
		this.gainEnergy(touchingEnergy * window.gameConfig.digestionEfficiency);
		foodBeingTouched.forEach(f => {
			window.gameManager.app.stage.removeChild(f);
			f.destroy(true);
		});
	}

	distanceToFood(){
		// cast in front
		const sightRange = this.genome.traitGenes.sightRange.value;
		const sightAngle = this.genome.traitGenes.eyeAngle.value;
		// results looks like [leftDist, centerDist, rightDist]
		const results = []
		for(let i = -sightAngle; i <= sightAngle; i += sightAngle){
			const lookDir = new Vec2(Math.cos(this.rotation + i), Math.sin(this.rotation + i)).normalized();
			const foods = window.gameManager.app.stage.children.filter(o => o instanceof Food);
			if(foods.length === 0) return [1,1,1];
			const visibleFoods = Raycast(this.getPosition(), lookDir, foods, sightRange);
			if(visibleFoods.length === 0){
				results.push(1);
				continue;
			}
			const dist = Vec2.distance(this.getPosition(), visibleFoods[0].getPosition());
			const distScaled = dist / sightRange;
			results.push(distScaled);
		}
		if(results.length < 3) throw "invalid food distance list";
		return results;
	}

	enemyInfo(){
		// cast in front
		const sightRange = this.genome.traitGenes.sightRange.value;
		const lookDir = new Vec2(Math.cos(this.rotation), Math.sin(this.rotation)).normalized();
		const enemies = window.gameManager.app.stage.children.filter(o => o instanceof Amoeba && o !== this);
		if(enemies.length === 0) return {distance: 1, size: 0};
		const visibleEnemies = Raycast(this.getPosition(), lookDir, enemies, sightRange);
		if(visibleEnemies.length === 0) return {distance: 1, size: 0};
		const dist = Vec2.distance(this.getPosition(), visibleEnemies[0].getPosition());
		const distScaled = dist / sightRange;
		const size = visibleEnemies[0].genome.traitGenes.size.value * 1;
		const relativeSize = (size - this.genome.traitGenes.size.value) / this.genome.traitGenes.size.value;
		return {distance: distScaled, size: relativeSize};
	}

	layEgg(){
		//console.log("laying egg");
		if(this.energy < this.genome.traitGenes.startingEnergy.value * 2) return;
		const spawnPos = new Vec2(this.position.x, this.position.y);
		this.timeSinceReproduction = 0;
		// let egg = new Egg(genome);
		let genome = this.genome;
		if(Math.random() < genome.traitGenes.mutationRate.value) genome = Genome.GetMutatedGenome(genome);
		const baby = new Amoeba(spawnPos, genome);
		baby.generation = this.generation + 1;
		window.gameManager.app.stage.addChild(baby);
		this.spendEnergy(this.genome.traitGenes.startingEnergy.value);
	}
}
