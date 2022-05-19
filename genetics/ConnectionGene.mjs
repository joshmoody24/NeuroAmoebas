import Gene from "./Gene.mjs";

export default class ConnectionGene extends Gene {
    constructor(innovationNumber, inputNodeNumber, outputNodeNumber){
        super(innovationNumber);
        this.inputNodeNumber = inputNodeNumber;
        this.outputNodeNumber = outputNodeNumber;

        // randomly initialize weight between min and max
        const maxWeight = 2;
        const minWeight = -2;
        const weightRange = maxWeight - minWeight;
        this.weight = Math.random() * weightRange + minWeight;
        Object.freeze(this);
    }

    constructor(innovationNumber, inputNodeNumber, outputNodeNumber, weight){
        super(innovationNumber);
        this.inputNodeNumber = inputNodeNumber;
        this.outputNodeNumber = outputNodeNumber;

        // randomly initialize weight between min and max
        this.weight = weight;
        Object.freeze(this);
    }
}