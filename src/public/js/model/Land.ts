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

  computeRocketPosition(rocket: Rocket, gameConfig: GameConfig): void {
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

  computeRocketsPosition(gameConfig: GameConfig, maxTimeStep: number): void {
    for (let i = 0; i < this.rockets.length; i++) {
      for (let j = 0; j < maxTimeStep; j++) {
          this.rockets[i].applyCommand();
          this.computeRocketPosition(this.rockets[i], gameConfig);
      }
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
    if(rocket.endOutOfLandingZone) {
      const score = 50 - (50 * rocket.positions[rocket.positions.length - 1].distanceToLandingZone / this.getMaxDistance(gameConfig));
      const speedPenalty = 0.5 * Math.min(Math.max(rocketSpeed - 100, 0), score) + 0.3 * Math.min(Math.max(rocketSpeed - 50, 0), score) + 0.2 * Math.min(Math.max(rocketSpeed - 30, 0), score);
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
      if(this.rockets[i].score == -1) {
        this.computeRocketScore(this.rockets[i], gameConfig);
      }
    }
  }

  rocketSelection(retainedGradedRocketRatio: number, retainedNonGradedRocketRatio: number): number {
    const retainedGradedRocketNb = this.rockets.length * retainedGradedRocketRatio;
    const retainedNonGradedRocketNb = this.rockets.length * retainedNonGradedRocketRatio;
    this.rockets.sort((r1, r2) => r2.score - r1.score);

    const retainedGradedRockets = this.rockets.slice(0, retainedGradedRocketNb);
    const nonGradedRockets = this.rockets.slice(retainedGradedRocketNb).sort((r1, r2) => 0.5 - Math.random());
    const retainedNonGradedRockets = nonGradedRockets.slice(0, retainedNonGradedRocketNb);

    this.rockets = [...retainedGradedRockets, ...retainedNonGradedRockets];
    return this.rockets[0].score;
  }

  parentCrossover(parent1: Rocket, parent2: Rocket): Rocket[] {
    const child1: Rocket = new Rocket();
    child1.initPosition = new Point(parent1.initPosition.x, parent1.initPosition.y);
    child1.position = new Point(child1.initPosition.x, child1.initPosition.y);
    child1.initSpeed = new Speed(parent1.initSpeed.xSpeed, parent1.initSpeed.ySpeed);
    child1.speed = new Speed(child1.initSpeed.xSpeed, child1.initSpeed.ySpeed);
    child1.initFuel = parent1.initFuel;
    child1.fuel = child1.initFuel;
    child1.initCommand = new Command(parent1.initCommand.angle, parent1.command.power);
    child1.command = new Command(child1.initCommand.angle, child1.initCommand.power);

    const child2: Rocket = new Rocket();
    child2.initPosition = new Point(parent1.initPosition.x, parent1.initPosition.y);
    child2.position = new Point(child2.initPosition.x, child2.initPosition.y);
    child2.initSpeed = new Speed(parent1.initSpeed.xSpeed, parent1.initSpeed.ySpeed);
    child2.speed = new Speed(child2.initSpeed.xSpeed, child2.initSpeed.ySpeed);
    child2.initFuel = parent1.initFuel;
    child2.fuel = child2.initFuel;
    child2.initCommand = new Command(parent1.initCommand.angle, parent1.command.power);
    child2.command = new Command(child2.initCommand.angle, child2.initCommand.power);

    const randomFactor = Math.random();
    for(let i = 0; i < parent1.commands.length; i++) {
      const parent1Angle = parent1.commands[i].angle;
      const parent2Angle = parent2.commands[i].angle;

      const parent1Power = parent1.commands[i].power;
      const parent2Power = parent2.commands[i].power;

      const child1Angle = randomFactor * parent1Angle + (1 - randomFactor) * parent2Angle;
      const child2Angle = (1 - randomFactor) * parent1Angle + randomFactor * parent2Angle;

      const child1Power = randomFactor * parent1Power + (1 - randomFactor) * parent2Power;
      const child2Power = (1 - randomFactor) * parent1Power + randomFactor * parent2Power;

      child1.commands.push(new Command(child1Angle, child1Power));
      child2.commands.push(new Command(child2Angle, child2Power));
    }

    return [child1, child2];
  }

  rocketsCrossover(rocketNb: number): void {
    const parents = this.rockets;
    this.rockets = [];
    while(this.rockets.length < rocketNb) {
      const randomIndexParent1 = this.getRandomInt(0, parents.length - 1);
      const randomIndexParent2 = this.getRandomInt(0, parents.length - 1);
      const [child1, child2] = this.parentCrossover(parents[randomIndexParent1], parents[randomIndexParent2]);
      this.rockets.push(child1, child2);
    }
  }

  rocketMutation(rocket: Rocket, mutationProbability: number): void {
    for(let i = 1; i < rocket.commands.length; i++) {
      if(Math.random()< mutationProbability) {
        rocket.commands[i] = this.getRandomCommand(rocket.commands[i-1]);
      }
    }
  }

  rocketsMutation(mutationProbability: number): void {
    for(let i = 0; i < this.rockets.length; i++) {
      this.rocketMutation(this.rockets[i], mutationProbability);
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
    let previousCommand = initCommand;
    for(let i = 0; i < commandNb - 1; i++) {
      const command = this.getRandomCommand(previousCommand);
      commands.push(command);
      previousCommand = command;
    }
    return commands;
  }

  getRandomCommand(initCommand: Command): Command {
    let angle = initCommand.angle;
    let power = initCommand.power;

    angle += this.getRandomInt(-15, 15);
    angle = Math.min(Math.max(angle, -90), 90);

    power += this.getRandomInt(-1, 1);
    power = Math.min(Math.max(power, 0), 4);

    return new Command(angle, power);
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
