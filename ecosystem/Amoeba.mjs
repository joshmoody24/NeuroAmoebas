import Genome from "../genetics/Genome.mjs";
import Animal from "./Animal.mjs";
import NodeGene from '../genetics/NodeGene.mjs';
import NodeType from '../genetics/NodeType.mjs';
import Activations from "../neural/Activations.mjs";
import ConnectionGene from '../genetics/ConnectionGene.mjs';
import Vec2 from "../geometry/Vec2.mjs";

export default class Amoeba extends Animal {
    constructor(position, genome, manager) {

        super(position, genome);

        const amoebaActionMap = {
            "move_forward": (val, delta) => {
                const x = Math.cos(this.rotation) * val * this.genome.traitGenes.moveSpeed;
                const y = Math.sin(this.rotation) * val * this.genome.traitGenes.moveSpeed;
                this.velocity = new Vec2(x,y);
            },
            "rotate": (val, delta) => this.rotation += val * delta * this.genome.traitGenes.rotateSpeed,
        }

        this.senses = genome.nodeGenes.filter(ng => ng.nodeType == NodeType.INPUT).map(ng => ng.name);
        this.actions = genome.nodeGenes.filter(ng => ng.nodeType == NodeType.OUTPUT).map(ng => ng.name);
        this.actionMap = amoebaActionMap;
        this.manager = manager;
    }

    static InitialGenome(manager){
        const senseNames = ["random", "energy", "food_distance", "up_pressed", "left_pressed", "right_pressed"];
        const amoebaSenses = senseNames.map(sense => new NodeGene(manager.nextInnovationNumber(), NodeType.INPUT, Activations.Identity, sense, 0));

        const actionNames = [
            {name: "move_forward", activation: Activations.Clamp},
            {name: "rotate", activation: Activations.SigmoidScaled},
        ]
        const amoebaActions = actionNames.map(action => new NodeGene(manager.nextInnovationNumber(), NodeType.OUTPUT, action.activation, action.name, 0));


        const upNodeId = amoebaSenses.find(n => n.name === "up_pressed").innovationNumber;
        const leftNodeId = amoebaSenses.find(n => n.name === "left_pressed").innovationNumber;
        const rightNodeId = amoebaSenses.find(n => n.name === "right_pressed").innovationNumber;

        const moveNodeId = amoebaActions.find(n => n.name === "move_forward").innovationNumber;
        const rotateNodeId = amoebaActions.find(n => n.name === "rotate").innovationNumber;

        const amoebaConnections = [
            // temp
            new ConnectionGene(manager.nextInnovationNumber(), upNodeId, moveNodeId, 1),
            new ConnectionGene(manager.nextInnovationNumber(), leftNodeId, rotateNodeId, -1),
            new ConnectionGene(manager.nextInnovationNumber(), rightNodeId, rotateNodeId, 1),

        ];

        const amoebaTraits = {
            color: 0x33ffcc,
            radius: 10,
            moveSpeed: 2,
            rotateSpeed: .2,
        };

        const amoebaGenome = new Genome(amoebaSenses, amoebaActions, amoebaConnections, amoebaTraits);
        return amoebaGenome;
    }

    update(delta){
        // get the inputs
        const inputValues = {};
        this.senses.forEach(s => {
            const relatedNode = this.brain.nodes.find(n => n.name === s);
            relatedNode.evaluated = true;
            relatedNode.value = Math.random();
        });

        const upNode = this.brain.nodes.find(n => n.name === "up_pressed");
        const leftNode = this.brain.nodes.find(n => n.name === "left_pressed");
        const rightNode = this.brain.nodes.find(n => n.name === "right_pressed");

        upNode.value = this.manager.getKey("ArrowUp") ? 1 : 0;
        leftNode.value = this.manager.getKey("ArrowLeft") ? 1 : 0;
        rightNode.value = this.manager.getKey("ArrowRight") ? 1 : 0;

        const nnResults = this.brain.evaluate();

        Object.keys(this.actionMap).forEach(action => {
            const outputValue = nnResults[this.brain.nodes.find(n => n.name === action).id];
            this.actionMap[action](outputValue, delta);
        });

        this.x += this.velocity.x * delta;
		this.y += this.velocity.y * delta;
    }

    duplicate(){
        console.log(this);
        return new Amoeba(this.position, this.genome, this.manager);
    }
}