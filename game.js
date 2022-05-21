import Vec2 from './geometry/Vec2.mjs';
// import {instance as gameManager} from './utility/GameManager.mjs';
import Config from './config.json' assert {type: 'json'};
import Amoeba from './ecosystem/Amoeba.mjs';
import Food from './ecosystem/Food.mjs';
import Manager from './ecosystem/Manager.mjs';
import BrainViewer from './ui/BrainViewer.mjs';
import Genome from './genetics/Genome.mjs';

window.gameConfig = Config;
let width = window.gameConfig.width;
let height = window.gameConfig.height;


let app = new PIXI.Application({width, height, antialias:true});
let hud = new PIXI.Application({width, height, antialias:true});

let manager = new Manager();
window.onkeydown = (e) => manager.setKey(e.key, true);
window.onkeyup = (e) => manager.setKey(e.key, false);
manager.app = app;
manager.hud = hud;
window.gameManager = manager;

function RandomScreenPos(padding){
	const x = padding + Math.random()*(width - 2*padding);
	const y = padding + Math.random()*(height - 2*padding);
	return new Vec2(x,y);
}

const animals = [];
for(let i = 0; i < window.gameConfig.startingAnimals; i++){
	const genome = Amoeba.InitialGenome(manager);
	const spawnPos = RandomScreenPos(genome.traitGenes.size);
	animals.push(
		new Amoeba(spawnPos, genome, manager)
	);
}

const foods = [new Food(new Vec2(20,20), 0xfcf8ec, 1)];


let objects = [...animals, ...foods, ]//...lines];

objects.forEach(o => app.stage.addChild(o));
console.log("Objects:", objects);

app.renderer.backgroundColor = 0x456268;
document.querySelector("div#canvas").appendChild(app.view);
app.ticker.add((delta) => {
	app.stage.children.forEach(o => {
		o.update(delta);
	});
});

hud.renderer.backgroundColor = 0x333333;
document.querySelector("div#hud").appendChild(hud.view);

const brainViewer = new BrainViewer(hud);
brainViewer.loadBrain(animals[0]);
hud.ticker.add((delta) => {
	brainViewer.update();
})


// resize
window.onresize = () => {
	let d = document.querySelector("div#canvas");
	width = d.clientWidth;
	height = width;
	app.renderer.resize(width, height);
	hud.renderer.resize(width, height);
}

window.onresize();

function SpawnFood(){
	let foodToSpawn = new Food(RandomScreenPos(10), 0xfcf8ec, 1);
	app.stage.addChild(foodToSpawn);
}

window.setInterval(SpawnFood, 1000);

const fpsCounter = document.querySelector("span#fps-display");
window.setInterval(() => fpsCounter.innerHTML = Math.round(app.ticker.FPS));
