import { Land } from "../public/js/model/Land";
import { Point } from "../public/js/model/Point";
import { SegmentIntersection } from "../public/js/model/SegmentIntersection";

describe('test series for Land functionalities', () => {
    it('verify a point have been added', async () => {
        const land = new Land();
        expect(land.points.length).toEqual(0);
        land.addPoint(0, 0);
        expect(land.points.length).toEqual(1);
    });

    it('check segment intersection with intersection on 500-500 and intersection on both segments', async () => {
        const land = new Land();
        const point11: Point = new Point(500, 0);
        const point12: Point = new Point(500, 1000);
        const point21: Point = new Point(750, 375);
        const point22: Point = new Point(0, 750);

        const segmentIntersection: SegmentIntersection = land.checkLineIntersection(point11, point12, point21, point22);
        expect(segmentIntersection.intersection.x).toEqual(500);
        expect(segmentIntersection.intersection.y).toEqual(500);
        expect(segmentIntersection.onSegment1).toEqual(true);
        expect(segmentIntersection.onSegment2).toEqual(true);
    })

    it('check segment intersection with intersection on 500-500 and intersection only on one segment', async () => {
        const land = new Land();
        const point11: Point = new Point(500, 0);
        const point12: Point = new Point(500, 1000);
        const point21: Point = new Point(1000, 250);
        const point22: Point = new Point(750, 375);

        const segmentIntersection: SegmentIntersection = land.checkLineIntersection(point11, point12, point21, point22);
        expect(segmentIntersection.intersection.x).toEqual(500);
        expect(segmentIntersection.intersection.y).toEqual(500);
        expect(segmentIntersection.onSegment1).toEqual(true);
        expect(segmentIntersection.onSegment2).toEqual(false);
    })
});
