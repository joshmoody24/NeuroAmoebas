import Gene from './Gene.mjs';

export default class NodeGene extends Gene{
    constructor(innovationNumber, nodeType){
        super(innovationNumber);
        this.innovationNumber = innovationNumber,
        this.nodeType = nodeType;
        Object.freeze(this);
    }
}