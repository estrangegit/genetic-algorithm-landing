import { Point } from "./Point";

/* eslint-disable  @typescript-eslint/no-unused-vars */
export class SegmentIntersection {
    intersection: Point;
    onSegment1: boolean;
    onSegment2: boolean;
    constructor(intersection: Point, onSegment1: boolean, onSegment2: boolean) {
        this.intersection = intersection;
        this.onSegment1 = onSegment1;
        this.onSegment2 = onSegment2;
    }
}
/* eslint-enable  @typescript-eslint/no-unused-vars */
