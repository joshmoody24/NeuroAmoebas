import ActivationFunctions from "./Activations.mjs";

export default class Node {
    constructor(nodeGene){
        this.id = nodeGene.innovationNumber;
        this.type = nodeGene.nodeType;
        this.activation = ActivationFunctions[nodeGene.activation];
        this.bias = nodeGene.bias;
        this.name = nodeGene.name;
        this.gene = nodeGene;

        this.evaluated = false;
        this.sum = 0;
        this.value = 0;
    }
}
