export default class Node {
    constructor(nodeGene){
        this.id = nodeGene.innovationNumber;
        this.type = nodeGene.nodeType;
        this.activation = nodeGene.activation;
        this.bias = nodeGene.bias;
        this.name = nodeGene.name;
        this.gene = nodeGene;

        // number of times this node has been evaluated
        this.evaluated = false;
        this.sum = 0;
        this.value = 0;
    }
}