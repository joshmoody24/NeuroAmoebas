export class LineRenderer {
	constructor(obj1, obj2, lineSize, lineColor){
		this.obj1 = obj1;
		this.obj2 = obj2;
		let begin = new Vec2(this.obj1.x, this.obj1.y);
		let end = new Vec2(this.obj2.x, this.obj2.y);
		this.line = new Line([begin, end], lineSize, lineColor);
	}

	update(delta) {
		let begin = new Vec2(this.obj1.x, this.obj1.y);
		let end = new Vec2(this.obj2.x, this.obj2.y);
		this.line.updatePoints([begin, end]);
	}
}