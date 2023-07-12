import { Land } from "../public/js/model/Land";

describe('test series for Land functionalities', () => {
    it('verify a point have been added', async () => {
        const land = new Land();
        expect(land.points.length).toEqual(0);
        land.addPoint(0, 0);
        expect(land.points.length).toEqual(1);
    });
});