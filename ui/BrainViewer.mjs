import Circle from '../geometry/Circle.mjs';
import Vec2 from '../geometry/Vec2.mjs';
import NodeType from '../genetics/NodeType.mjs';
import NodeIcon from './NodeIcon.mjs';
import LineRenderer from '../geometry/LineRenderer.mjs';
import ConnectionIcon from './ConnectionIcon.mjs';
import Amoeba from '../ecosystem/Amoeba.mjs';

export default class BrainViewer {
    constructor(hud){
        this.hud = hud;
        this.NodeUIs = [];
        this.ConnectionUIs = [];
    }

    update(){
        this.NodeUIs.forEach(n => n.update());

        // find longest-living amoeba
        const amoebas = window.gameManager.app.stage.children.filter(a => a instanceof Amoeba);
        if(amoebas.length > 0){
            const longestLife = amoebas.reduce((max, amoeba) => amoeba.lifetime > max ? amoeba.lifetime : max, 0);
            const oldest = amoebas.find(a => a.lifetime === longestLife);
            if(oldest && oldest != this.animal){
                this.loadBrain(oldest);
            }
        }
    }

    loadBrain(animal){
        this.animal = animal;
        animal.changeColor(0xffff00);
        // purge stage
        this.hud.stage.removeChildren();
        
        // draw the nodes

        const inputX = 20;
        const hiddenX = 256;
        const outputX = 492;

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

            const radius = .7;
            const activeColor = 0xffffff;

            const nodeIcon = new NodeIcon(node, new Vec2(x,y), activeColor, radius);
            
            this.NodeUIs.push(nodeIcon);
            this.hud.stage.addChild(nodeIcon);

        });

        // render connections
        animal.brain.connections.forEach(c => {
            const connectionIcon = new ConnectionIcon(c);

            const lineWidth = 2;
            const lineColor = c.weight > 0 ? 0xff0000 : 0x0055ff;
            const alpha = Math.abs(c.weight) / window.gameConfig.maxWeight;

            const lineRenderer = new LineRenderer(
                this.NodeUIs.find(nui => nui.node.id === connectionIcon.connection.inputId),
                this.NodeUIs.find(nui => nui.node.id === connectionIcon.connection.outputId),
                lineWidth,
                lineColor,
                alpha
            );

            this.hud.stage.addChild(lineRenderer.line);
            this.ConnectionUIs.push(connectionIcon)
        })
    }
}