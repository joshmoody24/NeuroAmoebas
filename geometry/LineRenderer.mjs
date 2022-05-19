export class LineRenderer {
	constructor(obj1, obj2, lineSize, lineColor){
		this.obj1 = obj1;
		this.obj2 = obj2;
		let begin = new Vec2(this.obj1.sprite.x, this.obj1.sprite.y);
		let end = new Vec2(this.obj2.sprite.x, this.obj2.sprite.y);
		this.line = new Line([begin, end], lineSize, lineColor);
	}

	update(delta) {
		let begin = new Vec2(this.obj1.sprite.x, this.obj1.sprite.y);
		let end = new Vec2(this.obj2.sprite.x, this.obj2.sprite.y);
		this.line.updatePoints([begin, end]);
	}
}