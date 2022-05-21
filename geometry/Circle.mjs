import Vec2 from './Vec2.mjs';

export default class Circle extends PIXI.Graphics {
	constructor(pos, color, radius) {
		super();
		const sizeScale = 10;
		this.radius = radius * sizeScale;
		this.velocity = new Vec2(0,0);
		this.beginFill(color);
		this.drawCircle(0, 0, radius * sizeScale);
		this.endFill();
		this.x = pos.x;
		this.y = pos.y;
		this.isFood = true;
	}

	collide(other) {
		let dx = other.x - this.x;
		let dy = other.y - this.y;
		let dist = Math.sqrt(dx*dx + dy*dy);

		return dist < (this.radius + other.radius);
	}
}