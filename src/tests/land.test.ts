import { Command } from "../public/js/model/Command";
import { Land } from "../public/js/model/Land";
import { Point } from "../public/js/model/Point";
import { Rocket } from "../public/js/model/Rocket";
import { SegmentIntersection } from "../public/js/model/SegmentIntersection";

describe('test series for Land functionalities', () => {
    it('verify a point have been added', async () => {
        const land = new Land();
        expect(land.points.length).toEqual(0);
        land.addPoint(new Point(0, 0));
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

    it('check selection method to verify graded an non graded criteria', async () => {
      const land = new Land();
      for(let i = 1; i <= 50; i++) {
        const rocket = new Rocket();
        rocket.score = i;
        land.rockets.push(rocket);
      }
      land.rocketSelection(0.3, 0.2);
      const selectedScores = land.rockets.map(r => r.score);
      for(let i = 0; i < selectedScores.length; i++) {
        if(i < 15) {
          expect(selectedScores[i]).toEqual(50 - i);
        } else {
          expect(selectedScores[i]).toBeLessThanOrEqual(35);
          expect(selectedScores[i]).toBeGreaterThanOrEqual(1);
        }
      }
    })

    it('check crossover function', async () => {
      const land = new Land();
      const parent1: Rocket = new Rocket();
      const parent2: Rocket = new Rocket();

      parent1.commands = land.getRandomCommands(new Command(0, 0), 50);
      parent2.commands = land.getRandomCommands(new Command(0, 0), 50);

      const [child1, child2] = land.parentCrossover(parent1, parent2);

      for(let i = 0; i < child1.commands.length; i++) {
        expect(Math.round((child1.commands[i].angle + child2.commands[i].angle) * 100) / 100).toEqual(Math.round((parent1.commands[i].angle + parent2.commands[i].angle) * 100) / 100);
        expect(Math.round((child1.commands[i].power + child2.commands[i].power) * 100) / 100).toEqual(Math.round((parent1.commands[i].power + parent2.commands[i].power) * 100) / 100);
      }
    })
});
