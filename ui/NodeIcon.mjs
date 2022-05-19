import Circle from "../geometry/Circle.mjs";
import { Multiply } from "../geometry/Color.mjs";

export default class NodeIcon extends Circle {
    constructor(node, pos, color, radius) {
        super(pos, color, radius);
        this.color = color;
        this.node = node;
    }

    update(delta){
        this
		.clear()
		.beginFill(Multiply(this.color,this.node.value))
		.drawCircle(0, 0, this.radius)
		.endFill()
    }
}
