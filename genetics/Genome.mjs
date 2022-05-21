import ConnectionGene from './ConnectionGene.mjs';
import NodeGene from './NodeGene.mjs';
import NodeType from './NodeType.mjs';
import { RandomActivation } from '../neural/Activations.mjs';

export default class Genome {
	constructor(inputNodeGenes, outputNodeGenes, initialConnections, traitGenes, hiddenNodeGenes = []){
		this.nodeGenes = [...inputNodeGenes, ...outputNodeGenes, ...hiddenNodeGenes];
		this.connectionGenes = initialConnections;
		this.traitGenes = traitGenes;
	}

	static GetMutatedGenome(genome){
		const manager = window.gameManager;
		// trait genes do not currently mutate
		// TODO: make these chances part of the genome itself
		// TODO: make this part of the config file
		// currently only allows one mutation max
		// TODO: allow multiple mutations as option
		const addNodeChance = 2;
		const deleteNodeChance = 2;
		const addConnectionChance = 3;
		const deleteConnectionChance = 3;
		const editBiasChance = 2;
		const editWeightChance = 2;

		const combined = addNodeChance + deleteNodeChance + addConnectionChance + deleteConnectionChance + editBiasChance + editWeightChance;
		const totalChance = Math.max(1, combined);
		const r = Math.random();
		
		// make a copy of the genome, then mutate it
		let newGenome = JSON.parse(JSON.stringify(genome));

		if (r < addNodeChance / totalChance) {
			return Genome.Mutate_AddNode(newGenome, manager);
		}
		else if(r < (addNodeChance + deleteNodeChance) / totalChance){
			return Genome.Mutate_DeleteNode(newGenome);
		}
		else if(r < (addNodeChance + deleteNodeChance + addConnectionChance) / totalChance){
			return Genome.Mutate_AddConnection(newGenome, manager);
		}
		else if(r < (addNodeChance + deleteNodeChance + addConnectionChance + deleteConnectionChance) / totalChance){
			return Genome.Mutate_DeleteConnection(newGenome);
		}
		else if(r < (addNodeChance + deleteNodeChance + addConnectionChance + deleteConnectionChance + editBiasChance) / totalChance){
			return Genome.Mutate_EditBias(newGenome);
		}
		else if(r < (addNodeChance + deleteNodeChance + addConnectionChance + deleteConnectionChance + editBiasChance + editWeightChance) / totalChance){
			return Genome.Mutate_EditWeight(newGenome);
		}
		else return newGenome;
	}

	static Mutate_AddNode(genome, manager){
		// choose a connection to split
		let conn = randomElement(genome.connectionGenes);
		// if no connections, return
		if(!conn) return genome;
		let newNode = new NodeGene(manager.nextInnovationNumber(), NodeType.HIDDEN, RandomActivation());
		// conn.enabled = false;
		// TODO ^
		const newConn1 = new ConnectionGene(
			manager.nextInnovationNumber(),
			conn.inputInnovationNumber,
			newNode.innovationNumber,
			1.0
		);
		const newConn2 = new ConnectionGene(
			manager.nextInnovationNumber(),
			newNode.innovationNumber,
			conn.outputInnovationNumber,
			conn.weight
		);
		genome.connectionGenes.push(newConn1);
		genome.connectionGenes.push(newConn2);
		genome.nodeGenes.push(newNode);
		genome.connectionGenes = genome.connectionGenes.filter(cg => cg !== conn);
		return genome;
	}

	static Mutate_DeleteNode(genome){
		let node = randomElement(genome.nodeGenes);
		// delete associated connections
		let connsToDelete = genome.connectionGenes.filter(cg => cg.inputInnovationNumber === node.innovationNumber || cg.outputInnovationNumber === node.innovationNumber);
		
		genome.connectionGenes = genome.connectionGenes.filter(cg => !(cg in connsToDelete));

		return genome;
	}

	static Mutate_AddConnection(genome, manager){
		// try to form a new connection (can't output to input node)
		const potentialOutputs = genome.nodeGenes.filter(cg => cg.nodeType !== NodeType.INPUT);
		const potentialInputs = genome.nodeGenes.filter(cg => cg.nodeType !== NodeType.OUTPUT);
		const inputId = randomElement(potentialInputs).innovationNumber;
		const outputId = randomElement(potentialOutputs).innovationNumber;

		// make sure the connection doesn't already exist
		if(genome.connectionGenes.find(c => c.inputInnovationNumber === inputId && c.outputInnovationNumber === outputId)) return genome;

		genome.connectionGenes.push(new ConnectionGene(manager.nextInnovationNumber(), inputId, outputId));
		return genome;
	}

	static Mutate_DeleteConnection(genome){
		const toRemove = randomElement(genome.connectionGenes);
		genome.connectionGenes = genome.connectionGenes.filter(cg => cg !== toRemove);
		return genome;
	}

	static Mutate_EditWeight(genome){
		// TODO: add to some config somewhere
		const weightMutationPercentage = 0.1;

		let connection = randomElement(genome.connectionGenes);
		if(connection === undefined) return genome;

		// the max change is proportional to how big the weight currently is
		// (so it's always a change that will make the same relative impact)
		const maxChange = Math.abs (connection.weight * weightMutationPercentage);
		const change = randomBetween(-maxChange, maxChange);

		connection.weight += change;
		connection.weight = clamp(connection.weight, -window.gameConfig.maxWeight, window.gameConfig.maxWeight);
		return genome;
	}

	static Mutate_EditBias(genome){
		// TODO: add to some config somewhere
		const weightMutationPercentage = 0.1;

		let node = randomElement(genome.nodeGenes);
		if(node === undefined) return genome;

		const maxChange = Math.abs (node.bias * weightMutationPercentage);
		const change = randomBetween(-maxChange, maxChange);

		node.bias += change;
		node.bias = clamp(node.bias, -window.gameConfig.maxBias, window.gameConfig.maxBias)
		return genome;
	}
}

function randomElement(arr){
	return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min, max){
	const range = max - min;
	return Math.random() * range + min;
}

function clamp(val, min, max){
	return Math.min(Math.max(val, min), max)
}