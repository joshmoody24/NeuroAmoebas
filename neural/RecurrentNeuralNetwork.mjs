import Node from './Node.mjs';
import Connection from './Connection.mjs';
import NodeType from '../genetics/NodeType.mjs';

export default class RecurrentNeuralNetwork {
    constructor(genome){
        this.nodes = genome.nodeGenes.map(ng => new Node(ng));

        this.connections = genome.connectionGenes.map(ng => new Connection(ng));
    }

    evaluate(){

        do{
            this.nodes
                .filter(n => n.type !== NodeType.INPUT)
                .forEach(node => {
                    node.evaluated = false;
                    const connectionsToNode = this.connections.filter(c => c.outputId === node.id);
                    const inputsToNode = connectionsToNode.map(c => this.nodes.find(n => n.id === c.inputId));
                    const evaluatedInputs = inputsToNode.filter(n => n.evaluated == true || n.type == NodeType.INPUT);
                    node.sum = evaluatedInputs.reduce((sum, inputNode) => sum + inputNode.value * connectionsToNode.find(c => c.inputId === inputNode.id).weight, 0);
                    if(evaluatedInputs.length > 0) node.evaluated = true;
                });
        } while (this.nodes.filter(n => n.type == NodeType.OUTPUT).some(n => !n.evaluated))

        this.nodes.filter(n => n.type !== NodeType.INPUT && n.evaluated).forEach(n => {
            n.value = n.activation(n.sum);
        });

        const result = {}
        this.nodes.forEach(n => result[n.id] = n.value);
        return result;
    }

}