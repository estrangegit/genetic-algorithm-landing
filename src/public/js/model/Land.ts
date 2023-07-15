import { gameData } from "../data.js";
import { Command } from "./Command.js";
import { Point } from "./Point.js";
import { Rocket } from "./Rocket.js";
import { SegmentIntersection } from "./SegmentIntersection.js";

/* eslint-disable  @typescript-eslint/no-unused-vars */
export class Land {
  points: Point[];
  rockets: Rocket[];

  constructor() {
    this.points = [];
    this.rockets = [];
  }

  reset(): void {
    this.points = [];
    this.rockets = [];
  }

  initLand(selectedLand: string, rocketNb: number, timeStepNb: number): void {
    this.reset();
    const points = gameData[selectedLand].points;
    for(let i = 0; i < points.length; i++) {
      this.addPoint(points[i].split(' ')[0], points[i].split(' ')[1]);
    }
    for(let i = 0; i < rocketNb; i++) {
      const rocket = new Rocket();
      rocket.initRocket(selectedLand);
      /* eslint-disable  @typescript-eslint/no-non-null-assertion */
      const commands: Command[] = this.getRandomCommands(rocket.initCommand!, timeStepNb);
      /* eslint-enable  @typescript-eslint/no-non-null-assertion */
      rocket.commands = commands;
      this.rockets.push(rocket);
    }
  }

  addPoint(x: number, y: number): void {
    this.points.push(new Point(x, y));
  }

  draw(ctx: CanvasRenderingContext2D | null, canvasWidth: number, canvasHeight: number): void {
    if(ctx != null) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for(let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, canvasHeight - this.points[i].y);
        }
        ctx.stroke();
    }
  }

  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomCommands(initCommand: Command, commandNb: number): Command[] {
    const commands: Command[] = [];
    commands.push(initCommand);

    let angle = initCommand.angle;
    let power = initCommand.power;
    for(let i = 0; i < commandNb - 1; i++) {
      angle += this.getRandomInt(-15, 15);
      angle = Math.min(Math.max(angle, -90), 90);

      power += this.getRandomInt(-1, 1);
      power = Math.min(Math.max(power, 0), 4);

      const command = new Command(angle, power);
      commands.push(command);
    }
    return commands;
  }

  checkLineIntersection(point11: Point, point12: Point, point21: Point, point22: Point): SegmentIntersection {
    // line intersection algorithm: https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
    const denominateur = (point11.x - point12.x) * (point21.y - point22.y) - (point11.y - point12.y) * (point21.x - point22.x);
    const t = ((point11.x - point21.x) * (point21.y - point22.y) - (point11.y - point21.y) * (point21.x - point22.x)) / denominateur;
    const u = ((point11.x - point21.x) * (point11.y - point12.y) - (point11.y - point21.y) * (point11.x - point12.x)) / denominateur;

    const x = point11.x + t * (point12.x - point11.x);
    const y = point11.y + t * (point12.y - point11.y);

    const onSegment1 = t >= 0 && t <= 1;
    const onSegment2 = u >= 0 && u <= 1;

    return new SegmentIntersection(x, y, onSegment1, onSegment2);
  }
}
/* eslint-enable  @typescript-eslint/no-unused-vars */
