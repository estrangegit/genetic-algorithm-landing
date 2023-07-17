/* eslint-disable  @typescript-eslint/no-unused-vars */
export class Point {
    x: number;
    y: number;
    distanceToLandingZone: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.distanceToLandingZone = -1;
    }

    getDistance(point: Point): number {
        return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2));
    }
}
/* eslint-enable  @typescript-eslint/no-unused-vars */
