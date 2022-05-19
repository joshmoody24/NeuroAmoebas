import Circle from "../geometry/Circle.mjs";

export default class Food extends Circle {
	random() {
		this.sprite.x = this.radius + Math.random()*(w - 2*this.radius);
		this.sprite.y = this.radius + Math.random()*(h - 2*this.radius);
	}

	update(delta) {
		let s = 1 + Math.sin(new Date() * 0.01) * 0.2;
		this.sprite.scale.set(s, s);
	}
}