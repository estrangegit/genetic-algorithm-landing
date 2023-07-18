import { GameConfig } from "../config/GameConfig.js";
import { gameData } from "../data.js";
import { Command } from "./Command.js";
import { Point } from "./Point.js";
import { Rocket } from "./Rocket.js";
import { SegmentIntersection } from "./SegmentIntersection.js";
import { Speed } from "./Speed.js";

/* eslint-disable  @typescript-eslint/no-unused-vars */
export class Land {
  points: Point[];
  rockets: Rocket[];
  landingZonePoint1: Point;
  landingZonePoint2: Point;

  constructor() {
    this.points = [];
    this.rockets = [];
    this.landingZonePoint1 = new Point(-1, -1);
    this.landingZonePoint2 = new Point(-1, -1);
  }

  initLandscape(selectedLand: string): void {
    this.points = [];
    this.rockets = [];
    const points = gameData[selectedLand].points;

    let currentPoint: Point = new Point(-1, -1);
    let lastPoint: Point = new Point(-1, -1);

    let currentIndex = -1;
    let lastIndex = -1;

    let landingZonePoint1Index = -1;
    let landingZonePoint2Index = -1;

    for(let i = 0; i < points.length; i++) {
      const point: Point = new Point(points[i].split(' ')[0], points[i].split(' ')[1])
      currentPoint = point;
      currentIndex = i;
      if (currentPoint.y == lastPoint.y) {
        this.landingZonePoint1 = lastPoint;
        landingZonePoint1Index = lastIndex;
        this.landingZonePoint2 = currentPoint;
        landingZonePoint2Index = currentIndex;
        this.landingZonePoint1.distanceToLandingZone = 0;
        this.landingZonePoint2.distanceToLandingZone = 0;
      }
      lastPoint = point;
      lastIndex = i;
      this.addPoint(point);
    }

    for (let i = landingZonePoint2Index + 1; i < this.points.length; i++) {
      const point = this.points[i-1]
      this.points[i].distanceToLandingZone = point.distanceToLandingZone;
      this.points[i].distanceToLandingZone += this.points[i].getDistance(point);
    }
    for (let i = landingZonePoint1Index - 1; i >= 0; i--) {
      const point = this.points[i+1]
      this.points[i].distanceToLandingZone = point.distanceToLandingZone;
      this.points[i].distanceToLandingZone += this.points[i].getDistance(point);
    }
  }

  initRocketRandomCommands(selectedLand: string, rocketNb: number, timeStepNb: number): void {
    this.rockets = [];
    for(let i = 0; i < rocketNb; i++) {
      const rocket = new Rocket();
      rocket.initRocket(selectedLand);
      const commands: Command[] = this.getRandomCommands(rocket.initCommand, timeStepNb);
      rocket.commands = commands;
      this.rockets.push(rocket);
    }
  }

  goToNextStep(rocket: Rocket, gameConfig: GameConfig): void {
    if(!rocket.isFlying) {
      return;
    }

    rocket.timeStep = rocket.timeStep + 1;
    rocket.positions.push(new Point(rocket.position.x, rocket.position.y));
    rocket.speeds.push(new Speed(rocket.speed.xSpeed, rocket.speed.ySpeed));

    if (rocket.fuel < rocket.command.power) {
      rocket.command.power = rocket.fuel;
    }
    rocket.fuel -= rocket.command.power;

    const arcAngle = -rocket.command.angle * Math.PI / 180;
    const xacc = Math.sin(arcAngle) * rocket.command.power;
    const yacc = Math.cos(arcAngle) * rocket.command.power - gameConfig.g;
    rocket.speed.xSpeed += xacc;
    rocket.speed.ySpeed += yacc;
    rocket.position.x += rocket.speed.xSpeed - (xacc * 0.5);
    rocket.position.y += rocket.speed.ySpeed - (yacc * 0.5);

    const lastPosition = rocket.positions[rocket.positions.length-1];

    for (let i = 1; i < this.points.length; i++) {
      const p1 = this.points[i-1];
      const p2 = this.points[i];
      const segmentIntersection: SegmentIntersection = this.checkLineIntersection(lastPosition, rocket.position, p1, p2)
      if (segmentIntersection.onSegment1 && segmentIntersection.onSegment2) {
        rocket.isFlying = false;
        if(p1.y == p2.y) {
          rocket.endOnLandingZone = true;
          segmentIntersection.intersection.distanceToLandingZone = 0;
        } else {
          rocket.endOutOfLandingZone = true;
          const nearestLandPointToLandingZone = p1.distanceToLandingZone < p2.distanceToLandingZone ? p1: p2;
          segmentIntersection.intersection.distanceToLandingZone = segmentIntersection.intersection.getDistance(nearestLandPointToLandingZone) + nearestLandPointToLandingZone.distanceToLandingZone;
        }
        rocket.positions.push(segmentIntersection.intersection);
        return;
      }
    }

    if (rocket.position.x < 0 || gameConfig.width <= rocket.position.x || rocket.position.y < 0 || gameConfig.height <= rocket.position.y) {
      rocket.endOutOfLand = true;
      rocket.isFlying = false;
      return;
    }
  }

  addPoint(point: Point): void {
    this.points.push(point);
  }

  drawLandscape(ctx: CanvasRenderingContext2D | null, canvasWidth: number, canvasHeight: number): void {
    if(ctx != null) {
      ctx.strokeStyle = "black";
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(this.points[0].x, canvasHeight - this.points[0].y);
      for(let i = 1; i < this.points.length; i++) {
        ctx.lineTo(this.points[i].x, canvasHeight - this.points[i].y);
      }
      ctx.stroke();
    }
  }

  getMaxDistance(gameConfig: GameConfig): number {
    return Math.sqrt(Math.pow(gameConfig.width, 2) + Math.pow(gameConfig.height, 2));
  }

  computeRocketScore(rocket: Rocket, gameConfig: GameConfig): void {
    const rocketSpeed = Math.sqrt(Math.pow(rocket.speed.xSpeed, 2) + Math.pow(rocket.speed.ySpeed, 2));
    const maxSpeed = Math.sqrt(Math.pow(gameConfig.maxLandingHSpeed, 2) + Math.pow(gameConfig.maxLandingVSpeed, 2));
    if(rocket.endOutOfLandingZone) {
      const score = 50 - (50 * rocket.positions[rocket.positions.length - 1].distanceToLandingZone / this.getMaxDistance(gameConfig))
      const speedPenalty = 0.05 * Math.max(rocketSpeed - maxSpeed, 0);
      rocket.score = score - speedPenalty;
    } else if(rocket.endOnLandingZone && (rocket.speed.ySpeed < -gameConfig.maxLandingVSpeed || Math.abs(rocket.speed.xSpeed) > gameConfig.maxLandingHSpeed || rocket.command.angle  != 0)) {
      let xSpeedPenalty = 0;
      let ySpeedPenalty = 0;
      if (Math.abs(rocket.speed.xSpeed) > gameConfig.maxLandingHSpeed) {
        xSpeedPenalty = (Math.abs(rocket.speed.xSpeed) - gameConfig.maxLandingHSpeed) / 6;
      }
      if (rocket.speed.ySpeed < -gameConfig.maxLandingVSpeed) {
        ySpeedPenalty = (-gameConfig.maxLandingVSpeed - rocket.speed.ySpeed) / 6;
      }
      rocket.score = 80 - xSpeedPenalty - ySpeedPenalty;
    } else if(rocket.endOnLandingZone && rocket.speed.ySpeed >= -gameConfig.maxLandingVSpeed && Math.abs(rocket.speed.xSpeed) <= gameConfig.maxLandingHSpeed && rocket.command.angle  == 0) {
      rocket.score = 80 + (20 * rocket.fuel / rocket.initFuel)
    } else {
      rocket.score = 0;
    }
  }

  computeRocketScores(gameConfig: GameConfig): void {
    for(let i = 0; i < this.rockets.length; i++) {
      this.computeRocketScore(this.rockets[i], gameConfig);
    }
  }

  drawRockets(ctx: CanvasRenderingContext2D | null, canvasHeight: number): void {
    for(let i = 0; i < this.rockets.length; i++){
      this.rockets[i].draw(ctx, canvasHeight);
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

    return new SegmentIntersection(new Point(x, y), onSegment1, onSegment2);
  }
}
/* eslint-enable  @typescript-eslint/no-unused-vars */
