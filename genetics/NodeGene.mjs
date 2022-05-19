import Gene from './Gene.mjs';

export default class NodeGene extends Gene{
    constructor(innovationNumber, nodeType, activation, name="", bias=null){
        super(innovationNumber);
        this.innovationNumber = innovationNumber;

        // randomly initialize weight between min and max
        const maxBias = 4;
        const minBias = -4;
        const biasRange = maxBias - minBias;
        this.bias = bias ?? (Math.random() * biasRange + minBias);
        
        this.activation = activation;
        this.nodeType = nodeType;

        this.name = name ?? "default name";
        Object.freeze(this);
    }
}