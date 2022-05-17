import {Vec2, Line, LineRenderer} from './geometry.js';

class Circle {
	constructor(pos, color, radius) {
		this.radius = radius;
		this.velocity = new Vec2(0,0);
		let sprite = new PIXI.Graphics();
		sprite.beginFill(color);
		sprite.drawCircle(0, 0, radius);
		sprite.endFill();
		sprite.x = pos.x;
		sprite.y = pos.y;
		app.stage.addChild(sprite);
		this.sprite = sprite;
	}

	remove() {
		app.stage.removeChild(this.circle);
	}

	collide(other) {
		let dx = other.circle.x - this.circle.x;
		let dy = other.circle.y - this.circle.y;
		let dist = Math.sqrt(dx*dx + dy*dy);

		return dist < (this.radius + other.radius);
	}
}

class Animal extends Circle {
	constructor(pos, color, radius){
		super(pos,color,radius);
		this.movementSpeed = 1;
	}

	update(delta) {
		this.sprite.x += this.velocity.x * delta;
		this.sprite.y += this.velocity.y * delta;
	}
}

class Food extends Circle {
	random() {
		this.sprite.x = this.radius + Math.random()*(w - 2*this.radius);
		this.sprite.y = this.radius + Math.random()*(h - 2*this.radius);
	}

	update(delta) {
		let s = 1 + Math.sin(new Date() * 0.01) * 0.2;
		this.sprite.scale.set(s, s);
	}
}

// resize
window.onresize = () => {
	let d = document.querySelector("div#canvas");
	w = d.clientWidth;
	h = w;
	app.renderer.resize(w, h);
}

let w = 512, h=512;
let app = new PIXI.Application({width: w, height: h, antialias:true});
let animals = [new Animal(new Vec2(w/2,h/2), 0xff0000, 10)];
let foods = [new Food(new Vec2(20,20), 0xfcf8ec, 10)];

let lines = [new LineRenderer(animals[0], foods[0], 3, 0x00ff00)];
lines.forEach(lr => app.stage.addChild(lr.line));


let objects = [...animals, ...foods, ...lines];

app.renderer.backgroundColor = 0x456268;
document.querySelector("div#canvas").appendChild(app.view);
app.ticker.add((delta) => {
	objects.forEach(a => {
		a.update(delta);
	});
});

let hud = new PIXI.Application({width: 100, height: 100, antialias:true});
hud.renderer.backgroundColor = 0x666666;
document.querySelector("div#hud").appendChild(hud.view);
window.onresize();
