export class Vec2 {
	constructor(x,y){
		this.x = x;
		this.y = y;
	}
	static Random(){
		return new Vec2(Math.random(), Math.random());
	}
	static RandomInUnitCircle(){
		let r = sqrt(Math.random());
		theta = Math.random() * 2 * Math.PI;
		x = r * Math.cos(theta);
		y = r * Math.sin(theta);
		return new Vec2(Math.random(), Math.random());
	}
}

export class Line extends PIXI.Graphics {
	constructor(points, lineSize, lineColor){
		super();

		let s = this.lineWidth = lineSize || 5;
		let c = this.lineColor = lineColor || 0xffcc00;
		
		this.updatePoints(points);
	}

	updatePoints(p) {
		let points = this.points = p;
		let s = this.lineWidth, c = this.lineColor;
		this.clear();
		this.lineStyle(s,c);
		this.moveTo(points[0].x, points[0].y);
		this.lineTo(points[1].x, points[1].y);
	}
}

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
