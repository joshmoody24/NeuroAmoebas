import Genome from "../genetics/Genome.mjs";
import Animal from "./Animal.mjs";
import NodeGene from '../genetics/NodeGene.mjs';
import NodeType from '../genetics/NodeType.mjs';
import Activations from "../neural/Activations.mjs";
import ConnectionGene from '../genetics/ConnectionGene.mjs';
import Vec2 from "../geometry/Vec2.mjs";

export default class Amoeba extends Animal {
    constructor(position, manager) {

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

        const amoebaActionMap = {
            "move_forward": (val, delta) => {
                const x = Math.cos(this.sprite.rotation) * val * this.genome.traitGenes.moveSpeed;
                const y = Math.sin(this.sprite.rotation) * val * this.genome.traitGenes.moveSpeed;
                this.velocity = new Vec2(x,y);
            },
            "rotate": (val, delta) => this.sprite.rotation += val * delta * this.genome.traitGenes.rotateSpeed,
        }

        const amoebaGenome = new Genome(amoebaSenses, amoebaActions, amoebaConnections, amoebaTraits);

        super(position, amoebaGenome);

        this.senses = senseNames;
        this.actions = actionNames;
        this.actionMap = amoebaActionMap;
        this.manager = manager;
    }

    update(delta){
        // get the inputs
        const inputValues = {};
        this.senses.forEach(s => {
            const relatedNode = this.brain.nodes.find(n => n.name === s);
            inputValues[relatedNode.id] = Math.random();
        });

        const upNodeId = this.brain.nodes.find(n => n.name === "up_pressed").id;
        const leftNodeId = this.brain.nodes.find(n => n.name === "left_pressed").id;
        const rightNodeId = this.brain.nodes.find(n => n.name === "right_pressed").id;

        inputValues[upNodeId] = this.manager.getKey("ArrowUp") ? 1 : 0;
        inputValues[leftNodeId] = this.manager.getKey("ArrowLeft") ? 1 : 0;
        inputValues[rightNodeId] = this.manager.getKey("ArrowRight") ? 1 : 0;

        const nnResults = this.brain.evaluate(inputValues);

        Object.keys(this.actionMap).forEach(action => {
            const outputValue = nnResults[this.brain.nodes.find(n => n.name === action).id];
            this.actionMap[action](outputValue, delta);
        });

        this.sprite.x += this.velocity.x * delta;
		this.sprite.y += this.velocity.y * delta;
    }
}