import Vec2 from './Vec2.mjs';

export default function Raycast(origin, direction, circles, distance=Infinity){
    const hits = circles.filter(c => {
        const circlePos = new Vec2(c.x, c.y)
        // get the distance between the caster and circle
        const dist = Vec2.distance(origin, circlePos);
        if(dist > distance) return false;
        // now cast that distance away from caster in direction of ray
        const endpoint = Vec2.add(origin, Vec2.multiply(direction.normalized(), dist));
        // now get the distance between endpoint and circle
        const dist2 = Vec2.distance(endpoint, circlePos);
        return dist2 < c.radius;
    });
    return hits.sort(c => -Vec2.distance(origin, new Vec2(c.x, c.y)));
}