import Node from './Node.mjs';
import Connection from './Connection.mjs';
import NodeType from '../genetics/NodeType.mjs';

export default class RecurrentNeuralNetwork {
    constructor(genome){
        this.nodes = genome.nodeGenes.map(ng => new Node(ng));

        this.connections = genome.connectionGenes.map(ng => new Connection(ng));
    }

    // returns dict with each node's value
    evaluate(inputValues){
        // a dictionary of id's to activations
        const finishedNodes = {...inputValues};

        while(Object.keys(finishedNodes).length !== this.nodes.length){
            this.nodes.filter(n => n.type !== NodeType.INPUT).forEach(node => {
                // get this node's inputs and see if they're finished
                const connectionsToNode = this.connections.filter(c => c.outputId === node.id);
                const inputsToNode = connectionsToNode.map(c => this.nodes.find(n => n.id === c.inputId));
                if(inputsToNode.every(n => n.id in finishedNodes)){
                    const sum = inputsToNode.reduce((sum, inputNode) => sum + finishedNodes[inputNode.id] * connectionsToNode.find(c => c.inputId === inputNode.id).weight, 0);
                    finishedNodes[node.id] = node.activation(sum + node.bias);
                }
            });
        }

        return finishedNodes;
    }

}