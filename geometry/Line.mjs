export default class Line extends PIXI.Graphics {
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