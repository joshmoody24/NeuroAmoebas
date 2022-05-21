import Genome from "../genetics/Genome.mjs";
import Animal from "./Animal.mjs";
import NodeGene from '../genetics/NodeGene.mjs';
import NodeType from '../genetics/NodeType.mjs';
import Activations from "../neural/Activations.mjs";
import ConnectionGene from '../genetics/ConnectionGene.mjs';
import Vec2 from "../geometry/Vec2.mjs";

export default class Amoeba extends Animal {
	constructor(position, genome) {

		super(position, genome);

		const amoebaActionMap = {
			"move_forward": (val, delta) => {
				const x = Math.cos(this.rotation) * val * this.genome.traitGenes.moveSpeed * delta;
				const y = Math.sin(this.rotation) * val * this.genome.traitGenes.moveSpeed * delta;
				this.move(new Vec2(x,y));
			},
			"rotate": (val, delta) => {
				this.rotate(val * delta * this.genome.traitGenes.rotateSpeed);
			},
		}

		this.senses = genome.nodeGenes.filter(ng => ng.nodeType == NodeType.INPUT).map(ng => ng.name);
		this.actions = genome.nodeGenes.filter(ng => ng.nodeType == NodeType.OUTPUT).map(ng => ng.name);
		this.actionMap = amoebaActionMap;
	}

	static InitialGenome(){
		const baseTraits = Animal.baseTraits();

		const senseNames = ["random", "energy", "food_distance", "up_pressed", "left_pressed", "right_pressed"];
		const amoebaSenses = senseNames.map(sense => new NodeGene(window.gameManager.nextInnovationNumber(), NodeType.INPUT, "Identity", sense, 0));

		const actionNames = [
			{name: "move_forward", activation: "Clamp"},
			{name: "rotate", activation: "Identity"},
		]
		const amoebaActions = actionNames.map(action => new NodeGene(window.gameManager.nextInnovationNumber(), NodeType.OUTPUT, action.activation, action.name, 0));


		const upNodeId = amoebaSenses.find(n => n.name === "up_pressed").innovationNumber;
		const leftNodeId = amoebaSenses.find(n => n.name === "left_pressed").innovationNumber;
		const rightNodeId = amoebaSenses.find(n => n.name === "right_pressed").innovationNumber;

		const moveNodeId = amoebaActions.find(n => n.name === "move_forward").innovationNumber;
		const rotateNodeId = amoebaActions.find(n => n.name === "rotate").innovationNumber;

		const amoebaConnections = [
			// temp
			new ConnectionGene(window.gameManager.nextInnovationNumber(), upNodeId, moveNodeId, 1),
			new ConnectionGene(window.gameManager.nextInnovationNumber(), leftNodeId, rotateNodeId, -1),
			new ConnectionGene(window.gameManager.nextInnovationNumber(), rightNodeId, rotateNodeId, 1),

		];

		const amoebaTraits = {
			color: 0x33ffcc,
			moveSpeed: 2,
			rotateSpeed: .1,
			moveCost: .001,
			rotateCost: 0.0005,
			restingCost: 0.001,
		};

		const traitGenes = {...baseTraits, ...amoebaTraits}

		const amoebaGenome = new Genome(amoebaSenses, amoebaActions, amoebaConnections, traitGenes);
		// start facing up, just for fun
		this.rotation += Math.PI / 2;
		return amoebaGenome;
	}

	update(delta){
		Animal.prototype.update.call(this, delta);

		// get the inputs
		const inputValues = {};
	
		const foodDistanceNode = this.brain.nodes.find(n => n.name === "food_distance");
		const randomNode = this.brain.nodes.find(n => n.name === "random");
		const energyNode = this.brain.nodes.find(n => n.name === "energy");
		const upNode = this.brain.nodes.find(n => n.name === "up_pressed");
		const leftNode = this.brain.nodes.find(n => n.name === "left_pressed");
		const rightNode = this.brain.nodes.find(n => n.name === "right_pressed");

		foodDistanceNode.value = 0;
		randomNode.value = Math.random();
		energyNode.value = this.energy / this.genome.traitGenes.maxEnergy;
		upNode.value = window.gameManager.getKey("ArrowUp") ? 1 : 0;
		leftNode.value = window.gameManager.getKey("ArrowLeft") ? 1 : 0;
		rightNode.value = window.gameManager.getKey("ArrowRight") ? 1 : 0;

		const nnResults = this.brain.evaluate();

		Object.keys(this.actionMap).forEach(action => {
			const outputValue = nnResults[this.brain.nodes.find(n => n.name === action).id];
			this.actionMap[action](outputValue, delta);
		});
	}

	rotate(amount){
		this.rotation += amount;
		this.spendEnergy(Math.abs(amount) * this.genome.traitGenes.rotateCost);
	}

	layEgg(){
		const spawnPos = new Vec2(this.position.x, this.position.y);
		// let egg = new Egg(genome);
		window.gameManager.app.addChild(new Amoeba(spawnPos, this.genome));
	}
}
