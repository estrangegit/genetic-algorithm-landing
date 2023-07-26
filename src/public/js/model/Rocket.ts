import { gameData } from "../data.js";
import { Color } from "./Color.js";
import { Command } from "./Command.js";
import { Point } from "./Point.js";
import { Speed } from "./Speed.js";

/* eslint-disable  @typescript-eslint/no-unused-vars */
export class Rocket {
  positions: Point[];
  speeds: Speed[];
  commands: Command[];
  isFlying: boolean;
  initPosition: Point;
  initSpeed: Speed;
  initCommand: Command;
  initFuel: number;
  position: Point;
  speed: Speed;
  command: Command;
  fuel: number;
  endOutOfLand: boolean;
  endOutOfLandingZone: boolean;
  endOnLandingZone: boolean;
  score: number;

  constructor() {
    this.positions = [];
    this.speeds = [];
    this.commands = [];
    this.isFlying = true;
    this.initPosition = new Point(0, 0);
    this.initSpeed = new Speed(0, 0);
    this.initCommand = new Command(0, 0);
    this.initFuel = 0;
    this.position = new Point(0, 0);
    this.speed = new Speed(0, 0);
    this.command = new Command(0, 0);
    this.fuel = 0;
    this.endOutOfLand = false;
    this.endOutOfLandingZone = false;
    this.endOnLandingZone = false;
    this.score = -1;
  }

  initRocket(selectedLand: string): void {
    this.positions = [];
    this.speeds = [];
    this.commands = [];
    this.initPosition = new Point(+gameData[selectedLand]['rocket-config'].split(' ')[0], +gameData[selectedLand]['rocket-config'].split(' ')[1]);
    this.position = new Point(this.initPosition.x, this.initPosition.y);
    this.initSpeed = new Speed(+gameData[selectedLand]['rocket-config'].split(' ')[2], +gameData[selectedLand]['rocket-config'].split(' ')[3]);
    this.speed = new Speed(this.initSpeed.xSpeed, this.initSpeed.ySpeed);
    this.initFuel =  +gameData[selectedLand]['rocket-config'].split(' ')[4];
    this.fuel = this.initFuel;
    this.initCommand = new Command(+gameData[selectedLand]['rocket-config'].split(' ')[5], +gameData[selectedLand]['rocket-config'].split(' ')[6]);
    this.command = new Command(this.initCommand.angle, this.initCommand.power);
  }

  resetRocketTrajectory(): void {
    this.positions = [];
    this.speeds = [];
    this.isFlying = true;
    this.position = new Point(this.initPosition.x, this.initPosition.y);
    this.speed = new Speed(this.initSpeed.xSpeed, this.initSpeed.ySpeed);
    this.command = new Command(this.initCommand.angle, this.initCommand.power);
    this.fuel = this.initFuel;
    this.endOutOfLand = false;
    this.endOutOfLandingZone = false;
    this.endOnLandingZone = false;
    this.score = -1;
  }

  applyCommand(j): void {
   let nextAngle = this.commands[j].angle;
   let nextPower = this.commands[j].power;

   nextAngle = Math.round(nextAngle);
   nextAngle = Math.max(-90, nextAngle, this.commands[j - 1].angle - 15);
   nextAngle = Math.min(90, nextAngle, this.commands[j - 1].angle + 15);

   nextPower = Math.round(nextPower);
   nextPower = Math.max(0, nextPower, this.commands[j - 1].power - 1);
   nextPower = Math.min(4, nextPower, this.commands[j - 1].power + 1);

   this.commands[j] = new Command(nextAngle, nextPower);
   this.command = new Command(nextAngle, nextPower);
  }

  getRocketColor(): Color {
    return new Color((255 * (100 - this.score))/100, (255 * this.score)/100, 0);
  }

  draw(ctx: CanvasRenderingContext2D | null, canvasHeight: number): void {
    if(ctx != null) {
        ctx.lineWidth = 10;
        const color: Color = this.getRocketColor();
        ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        ctx.beginPath();
        ctx.moveTo(this.positions[0].x, canvasHeight - this.positions[0].y);
        for(let i = 1; i < this.positions.length; i++) {
            ctx.lineTo(this.positions[i].x, canvasHeight - this.positions[i].y);
        }
        ctx.stroke();
    }
  }
}
/* eslint-enable  @typescript-eslint/no-unused-vars */
