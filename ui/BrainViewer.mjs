import Circle from '../geometry/Circle.mjs';
import Vec2 from '../geometry/Vec2.mjs';
import NodeType from '../genetics/NodeType.mjs';
import NodeIcon from './NodeIcon.mjs';
import LineRenderer from '../geometry/LineRenderer.mjs';
import ConnectionIcon from './ConnectionIcon.mjs';

export default class BrainViewer {
    constructor(hud){
        this.hud = hud;
        this.NodeUIs = [];
        this.ConnectionUIs = [];
    }

    update(){
        this.NodeUIs.forEach(n => n.update());
    }

    loadBrain(animal){
        // purge stage
        this.hud.stage.removeChildren();
        
        // draw the nodes

        const inputX = 20;
        const hiddenX = 50;
        const outputX = 80;

        const startY = 20;
        const yGap = 30;
        let inputY = startY;
        let hiddenY = startY;
        let outputY = startY;

        animal.brain.nodes.forEach(node => {
            let x;
            let y;
            if(node.type === NodeType.INPUT){
                y = inputY;
                inputY += yGap;
                x = inputX;
            }
            if(node.type === NodeType.HIDDEN){
                y = hiddenY;
                hiddenY += yGap;
                x = hiddenX;
            }
            if(node.type === NodeType.OUTPUT){
                y = outputY;
                outputY += yGap;
                x = outputX;
            }

            const radius = 10;
            const activeColor = 0xffffff;

            const nodeIcon = new NodeIcon(node, new Vec2(x,y), activeColor, radius);
            
            this.NodeUIs.push(nodeIcon);
            this.hud.stage.addChild(nodeIcon);

        });

        // render connections
        animal.brain.connections.forEach(c => {
            const connectionIcon = new ConnectionIcon(c);

            const lineRenderer = new LineRenderer(
                this.NodeUIs.find(nui => nui.node.id === connectionIcon.connection.inputId),
                this.NodeUIs.find(nui => nui.node.id === connectionIcon.connection.outputId),
                3,
                0xff0000,
            );

            this.hud.stage.addChild(lineRenderer.line);
            this.ConnectionUIs.push(connectionIcon)
        })
    }
}