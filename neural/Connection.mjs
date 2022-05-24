export default class Connection {
    constructor(connectionGene){
        this.inputId = connectionGene.inputInnovationNumber;
        this.outputId = connectionGene.outputInnovationNumber;
        this.weight = connectionGene.weight;
        this.gene = connectionGene;
        Object.freeze(this);
    }
}