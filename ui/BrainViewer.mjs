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
        this.NodeUIs = [];
        
        // generate a table of nodes to layers
        // the closer to an input, the lower the layer
        // stranded nodes automatically get layer 1
        const layerTable = {}
        const inputs = animal.brain.nodes.filter(n => n.type === NodeType.INPUT);
        inputs.forEach(n => {
            layerTable[n.id] = 0
        });

        const outputIds = animal.brain.nodes.filter(n => n.type === NodeType.OUTPUT).map(n => n.id);

        // repeat until all non-nodes connected to input have been added
        while(true){
            const highestLayer = Math.max(...Object.values(layerTable));
            const lastNodeIds = Object.keys(layerTable).map(key => [Number(key), Number(layerTable[key])]).filter(kv => kv[1] === highestLayer).map(kv => kv[0]);
            // get all non-output connections from previous layer to nodes not yet assigned a layer
            const connections = animal.brain.connections.filter(c => (lastNodeIds.indexOf(c.inputId) !== -1) && (outputIds.indexOf(c.outputId) === -1) && (Object.keys(layerTable).map(k => Number(k)).indexOf(c.outputId) === -1));
            if(connections.length === 0) break;
            connections.map(c => c.outputId).forEach(id => layerTable[id] = highestLayer + 1);
        }

        const strandedNodes = animal.brain.nodes.filter(n => n.type === NodeType.HIDDEN && (Object.keys(layerTable).map(k => Number(k)).indexOf(n.id) === -1));
        strandedNodes.forEach(sn => layerTable[sn.id] = 1);

        // the output nodes need to be readjusted to their proper place
        const highestLayer = Math.max(...Object.values(layerTable));
        outputIds.forEach(id => layerTable[id] = highestLayer + 1);

        // compute distance between layers
        const numLayers = highestLayer + 1;
        const screenPadding = 50;
        const layerWidth = (window.gameManager.app.screen.width - (screenPadding * 2)) / numLayers;

        const radius = .6;
        const yGap = 50;
        const activeColor = 0xffffff;

        for(let layer = 0; layer <= numLayers; layer++){
            let yPos = screenPadding;
            const xPos = (layer * layerWidth) + screenPadding;
            const layerIds = Object.keys(layerTable).filter(key => layerTable[key] === layer).map(k => Number(k));
            const layerNodes = animal.brain.nodes.filter(n => layerIds.indexOf(n.id) !== -1);
            layerNodes.forEach(node => {
                // so you can more easily see nodes with connections to the same layer
                const jitter = 25;

                const jitteredXPos = xPos + ((Math.random() * 2 - 1) * jitter);
                const nodeIcon = new NodeIcon(node, new Vec2(node.type === NodeType.HIDDEN ? jitteredXPos : xPos,yPos), activeColor, radius);
                this.NodeUIs.push(nodeIcon);
                this.hud.stage.addChild(nodeIcon);

                // set up text
                const textOffsetY = 15;
                const fontSize = 12;
                const text = new PIXI.Text(nodeIcon.node.name, {fontFamily : 'Arial', fontSize, fill : 0xff1010, align : 'center'});
                text.x = nodeIcon.x;
                text.y = nodeIcon.y + textOffsetY;
                text.anchor.set(0.5);
                this.hud.stage.addChild(text);

                yPos += yGap;
            })
        }

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