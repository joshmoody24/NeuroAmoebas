import Genome from "../genetics/Genome.mjs";
import Animal from "./Animal.mjs";
import NodeGene from '../genetics/NodeGene.mjs';
import NodeType from '../genetics/NodeType.mjs';
import Activations from "../neural/Activations.mjs";
import ConnectionGene from '../genetics/ConnectionGene.mjs';

export default class Amoeba extends Animal {
    constructor(position, manager) {

        const senseNames = ["random", "energy", "food_distance", "up_pressed", "left_pressed", "right_pressed"];
        const amoebaSenses = senseNames.map(sense => new NodeGene(manager.nextInnovationNumber(), NodeType.INPUT, Activations.Identity, sense));

        const actionNames = [
            {name: "move_forward", activation: Activations.Sigmoid},
            {name: "rotate", activation: Activations.SigmoidScaled},
        ]
        const amoebaActions = actionNames.map(action => new NodeGene(manager.nextInnovationNumber(), NodeType.OUTPUT, action.activation, action.name));


        const upNodeId = amoebaSenses.find(n => n.name === "up_pressed").innovationNumber;
        const moveNodeId = amoebaActions.find(n => n.name === "move_forward").innovationNumber;
        const amoebaConnections = [
            // temp
            new ConnectionGene(manager.nextInnovationNumber(), upNodeId, moveNodeId, 1),
        ];

        const amoebaTraits = {
            color: 0x33ffcc,
            radius: 10
        };

        const amoebaActionMap = {
            "move_forward": (val) => console.log("moving forward by " + val),
            "rotate": (val) => console.log("rotating " + val),
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
        inputValues[upNodeId] = this.manager.getKey("ArrowUp") ? 1 : 0;

        const nnResults = this.brain.evaluate(inputValues);

        Object.keys(this.actionMap).forEach(action => {
            const outputValue = nnResults[this.brain.nodes.find(n => n.name === action).id];
            this.actionMap[action](outputValue);
        });
    }
}