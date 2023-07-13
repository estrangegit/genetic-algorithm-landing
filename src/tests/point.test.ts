import { Point } from "../public/js/model/Point";

describe('test series for Point functionalities', () => {
    it('Calculate distance between two points', async () => {
        const point: Point = new Point(0, 1000);
        const distance: number = point.getDistance(new Point(1000, 1000));
        expect(distance).toEqual(1000);
    });
});