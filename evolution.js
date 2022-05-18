class Gene {
    constructor(innovationNumber){
        this.innovation_number = innovation_number;
    }
}

class TraitGene extends Gene {
    constructor(innovationNumber, trait, value){
        super(innovationNumber);
        this.trait = trait;
        this.value = value;
    }
}

class NeuronGene extends Gene {
    constructor(innovationNumber, activation, bias){
        super(innovationNumber);
        this.activation = activation;
        this.bias = bias;
    }
}

class ConnectionGene extends Gene {
    constructor(innovationNumber, input_node, output_node, weight){
        super(innovationNumber);
        this.input_node = input_node;
        this.output_node = output_node;
        this.weight = weight;
    }
}