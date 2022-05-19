import Gene from "./Gene.mjs";

export default class ConnectionGene extends Gene {
    constructor(innovationNumber, inputInnovationNumber, outputInnovationNumber, weight=null){
        super(innovationNumber);
        this.inputInnovationNumber = inputInnovationNumber;
        this.outputInnovationNumber = outputInnovationNumber;
	this.enabled = true;
        // randomly initialize weight between min and max
        const maxWeight = 2;
        const minWeight = -2;
        const weightRange = maxWeight - minWeight;
        this.weight = weight ?? Math.random() * weightRange + minWeight;

        Object.freeze(this);
    }
}
