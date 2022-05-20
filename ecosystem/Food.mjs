import Circle from "../geometry/Circle.mjs";

export default class Food extends Circle {
	random() {
	}

	update(delta) {
		let s = 1 + Math.sin(new Date() * 0.01) * 0.2;
		this.scale.set(s, s);
	}
}
