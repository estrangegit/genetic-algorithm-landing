/* eslint-disable  @typescript-eslint/no-unused-vars */
export class SegmentIntersection {
    x: number;
    y: number;
    onSegment1: boolean;
    onSegment2: boolean;
    constructor(x: number, y: number, onSegment1: boolean, onSegment2: boolean) {
        this.x = x;
        this.y = y;
        this.onSegment1 = onSegment1;
        this.onSegment2 = onSegment2;
    }
}
/* eslint-enable  @typescript-eslint/no-unused-vars */