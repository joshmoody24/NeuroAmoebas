import Vec2 from './Vec2.mjs';
import Color from './Color.mjs';
import { colorToInt } from './Color.mjs';

export default class Circle extends PIXI.Graphics {
	constructor(pos, color, radius) {
		super();
		if(color.r)	color = colorToInt(color);
		const sizeScale = 10;
		this.radius = radius * sizeScale;
		this.velocity = new Vec2(0,0);
		this.drawColoredCircle(color, this.radius);
		this.x = pos.x;
		this.y = pos.y;
	}

	drawColoredCircle(color, radius){
		this.beginFill(color);
		this.drawCircle(0, 0, radius);
		this.endFill();
	}

	changeColor(color){
		this.clear();
		this.drawColoredCircle(color, this.radius);
	}

	getPosition(){
		return new Vec2(this.x, this.y);
	}

	collide(other) {
		let dx = other.x - this.x;
		let dy = other.y - this.y;
		let dist = Math.sqrt(dx*dx + dy*dy);

		return dist < (this.radius + other.radius);
	}
}