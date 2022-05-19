import Vec2 from './Vec2.mjs';

export default class Circle extends PIXI.Graphics {
	constructor(pos, color, radius) {
		super()
		this.radius = radius;
		this.velocity = new Vec2(0,0);
		this.beginFill(color);
		this.drawCircle(0, 0, radius);
		this.endFill();
		this.x = pos.x;
		this.y = pos.y;
	}

	collide(other) {
		let dx = other.circle.x - this.circle.x;
		let dy = other.circle.y - this.circle.y;
		let dist = Math.sqrt(dx*dx + dy*dy);

		return dist < (this.radius + other.radius);
	}
}