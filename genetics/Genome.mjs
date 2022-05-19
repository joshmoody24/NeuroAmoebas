export default class Genome {
    constructor(inputNodeGenes, outputNodeGenes, initialConnections, traitGenes){
        this.nodeGenes = [...inputNodeGenes, ...outputNodeGenes];
        this.connectionGenes = initialConnections;
        this.traitGenes = traitGenes;
    }
}