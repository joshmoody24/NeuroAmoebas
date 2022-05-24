import Gene from './Gene.mjs';

export default class NodeGene extends Gene{
    constructor(innovationNumber, nodeType, activationStr, name="", bias=null){
        super(innovationNumber);
        this.innovationNumber = innovationNumber;

        // randomly initialize weight between min and max
        const maxBias = window.gameConfig.maxBias;
        const minBias = -maxBias;
        const biasRange = maxBias - minBias;
        this.bias = bias ?? (Math.random() * biasRange + minBias);
        
        this.activation = activationStr;
        this.nodeType = nodeType;

        this.name = name ?? "default name";
        Object.freeze(this);
    }
}
