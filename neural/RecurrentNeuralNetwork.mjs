import Node from './Node.mjs';
import Connection from './Connection.mjs';
import NodeType from '../genetics/NodeType.mjs';

export default class RecurrentNeuralNetwork {
    constructor(genome){
        this.nodes = genome.nodeGenes.map(ng => new Node(ng));

        this.connections = genome.connectionGenes.map(ng => new Connection(ng));
    }

    evaluate(){


        this.nodes.filter(n => n.type !== NodeType.INPUT).forEach(n => {
            n.evaluated = false;
            n.value = 0;
        });

        do{
                this.nodes
                    .filter(n => n.type !== NodeType.INPUT)
                    .forEach(node => {
                        const connectionsToNode = this.connections.filter(c => c.outputId === node.id);
                        const inputsToNode = connectionsToNode.map(c => this.nodes.find(n => n.id === c.inputId));

                        node.sum = inputsToNode.reduce((sum, inputNode) => sum + inputNode.value * connectionsToNode.find(c => c.inputId === inputNode.id).weight, 0);
                        node.evaluated = true;
                    });
        } while (this.nodes.filter(n => n.type !== NodeType.INPUT).some(n => !n.evaluated))
            
            
        this.nodes.filter(n => n.type !== NodeType.INPUT).forEach(n => {
            n.value = n.activation(n.sum) + n.bias;
        });

        const result = {}
        this.nodes.forEach(n => result[n.id] = n.value);
        return result;
    }

}
