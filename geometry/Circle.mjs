import Vec2 from './Vec2.mjs';

export default class Circle {
	constructor(pos, color, radius, app) {
		this.radius = radius;
		this.velocity = new Vec2(0,0);
		let sprite = new PIXI.Graphics();
		sprite.beginFill(color);
		sprite.drawCircle(0, 0, radius);
		sprite.endFill();
		sprite.x = pos.x;
		sprite.y = pos.y;
		this.sprite = sprite;
	}

	collide(other) {
		let dx = other.circle.x - this.circle.x;
		let dy = other.circle.y - this.circle.y;
		let dist = Math.sqrt(dx*dx + dy*dy);

		return dist < (this.radius + other.radius);
	}
}