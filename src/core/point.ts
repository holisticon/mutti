export interface Point {
	x: number;
	y: number;
}

export const zero: Point = { x: 0, y: 0 };

export function point(x: number, y: number) {
	return { x, y };
}

export function fromEvent(e: PointerEvent): Point {
	return point(e.pageX, e.pageY);
}

export function delta(p1: Point, p2: Point): Point {
	return point(p2.x - p1.x, p2.y - p1.y);
}

export function equal(p1: Point, p2: Point): boolean {
	return p1.x === p2.x && p1.y === p2.y;
}
