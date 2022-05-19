import Vec2 from './geometry/Vec2.mjs';
// import {instance as gameManager} from './utility/GameManager.mjs';
import Config from './config.json' assert {type: 'json'};
import NodeGene from './genetics/NodeGene.mjs';
import NodeType from './genetics/NodeType.mjs';
import Genome from './genetics/Genome.mjs';
import Animal from './ecosystem/Animal.mjs';
import Food from './ecosystem/Food.mjs';

let width = 512;
let height = 512;

let app = new PIXI.Application({width, height, antialias:true});


const InitialGenome = new Genome(
	// initial nodes
	[
		new NodeGene("random", NodeType.INPUT),
		new NodeGene("energy", NodeType.INPUT),
		new NodeGene("food_distance", NodeType.INPUT),
		new NodeGene("t_pressed", NodeType.INPUT),
		new NodeGene("move_forward", NodeType.OUTPUT),
		new NodeGene("rotate", NodeType.OUTPUT),
	],
	[],
	{color: 0x33ffcc, radius: 10},
);


const animals = [];
for(let i = 0; i < Config.starting_animals; i++){
	const spawnPos = new Vec2(Math.random() * width, Math.random() * height);
	animals.push(
		new Animal(spawnPos, InitialGenome)
	);
}

const foods = [new Food(new Vec2(20,20), 0xfcf8ec, 10)];


let objects = [...animals, ...foods, ]//...lines];

console.log(objects);

objects.forEach(o => app.stage.addChild(o.sprite));

app.renderer.backgroundColor = 0x456268;
document.querySelector("div#canvas").appendChild(app.view);
app.ticker.add((delta) => {
	objects.forEach(o => {
		o.update(delta);
	});
});

// resize
window.onresize = () => {
	let d = document.querySelector("div#canvas");
	width = d.clientWidth;
	height = width;
	app.renderer.resize(width, height);
}

window.onresize();