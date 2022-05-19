export default class Genome {
    constructor(initialNodes, initialConnections, traitGenes){
        this.nodeGenes = initialNodes;
        this.connectionGenes = initialConnections;
        this.traitGenes = traitGenes;
    }
}