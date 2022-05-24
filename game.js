import Vec2 from './geometry/Vec2.mjs';
// import {instance as gameManager} from './utility/GameManager.mjs';
import Config from './config.json' assert {type: 'json'};
import Amoeba from './ecosystem/Amoeba.mjs';
import Food from './ecosystem/Food.mjs';
import Manager from './ecosystem/Manager.mjs';
import BrainViewer from './ui/BrainViewer.mjs';
import Genome from './genetics/Genome.mjs';
import FoodSpawner from './ecosystem/FoodSpawner.mjs';
import Raycast from './geometry/Raycast.mjs';

// raycast testing
const circle = {};
circle.x = 49;
circle.y = 50;
circle.radius = 10;
let origin = new Vec2(0,0);
let dir = new Vec2(1,1);
console.log(Raycast(origin, dir, [circle], 100));

window.gameConfig = Config;
let width = window.gameConfig.width;
let height = window.gameConfig.height;


let app = new PIXI.Application(width, height, {antialias:true});
let hud = new PIXI.Application(width, height, {antialias:true});

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

window.gameManager.randomScreenPos = RandomScreenPos;

const animals = [];
for(let i = 0; i < window.gameConfig.startingAnimals; i++){
	// mutate the genome
	let genome = Amoeba.InitialGenome(manager);
	for(let j = 0; j < window.gameConfig.startingMutations; j++){
		genome = Genome.GetMutatedGenome(genome);
	}
	const spawnPos = RandomScreenPos(genome.traitGenes.size);
	animals.push(
		new Amoeba(spawnPos, genome, manager)
	);
}

const foodSpawner = new FoodSpawner();
foodSpawner.spawnFoods(window.gameConfig.startingFood);

let gameObjects = [...animals];
let objects = [foodSpawner];

gameObjects.forEach(o => app.stage.addChild(o));

app.renderer.backgroundColor = 0x456268;
document.querySelector("div#canvas").appendChild(app.view);

const lifetimeCounter = document.querySelector("span#max-lifetime");
const generationCounter = document.querySelector("span#generation");
const avgMoveSpeedCounter = document.querySelector("span#avg-move-speed");

app.ticker.add((delta) => {

	const deltaMS = app.ticker.elapsedMS * window.gameConfig.timeScale/1000;

	// temp, add this to class later
	// find longest-living amoeba
	const amoebas = window.gameManager.app.stage.children.filter(a => a instanceof Amoeba);
	if(amoebas.length > 0){
		const longestLife = amoebas.reduce((max, amoeba) => amoeba.lifetime > max ? amoeba.lifetime : max, 0);
		const generation = amoebas.find(a => a.lifetime === longestLife).generation;
		generationCounter.innerHTML = generation;
		lifetimeCounter.innerHTML = Math.round(longestLife*100)/100;
	}

	// temp
	const avgMoveSpeed = amoebas.reduce((max, amoeba) => max + amoeba.genome.traitGenes.moveSpeed, 0) / amoebas.length;
	avgMoveSpeedCounter.innerHTML = Math.round(avgMoveSpeed*100)/100;

	app.stage.children.forEach(o => {
		o.update(deltaMS);
	});

	objects.forEach(o => o.update(deltaMS));
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

const fpsCounter = document.querySelector("span#fps-display");
window.setInterval(() => fpsCounter.innerHTML = Math.round(app.ticker.FPS));
