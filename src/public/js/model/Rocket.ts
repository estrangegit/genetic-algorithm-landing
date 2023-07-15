import { gameData } from "../data.js";
import { Command } from "./Command.js";
import { Point } from "./Point.js";

/* eslint-disable  @typescript-eslint/no-unused-vars */
export class Rocket {
  points?: Point[];
  speeds?: number[];
  commands?: Command[];
  initX?: number;
  initY?: number;
  initXSpeed?: number;
  initYSpeed?: number;
  initCommand?: Command;
  initFuel?: number;
  x?: number;
  y?: number;
  xSpeed?: number;
  ySpeed?: number;
  command?: Command;
  fuel?: number;

  initRocket(selectedLand: string): void {
    this.points = [];
    this.speeds = [];
    this.commands = [];
    this.initX = +gameData[selectedLand]['rocket-config'].split(' ')[0];
    this.initY = +gameData[selectedLand]['rocket-config'].split(' ')[1];
    this.initXSpeed = +gameData[selectedLand]['rocket-config'].split(' ')[2];
    this.initYSpeed = +gameData[selectedLand]['rocket-config'].split(' ')[3];
    this.initFuel =  +gameData[selectedLand]['rocket-config'].split(' ')[4];
    this.initCommand = new Command(+gameData[selectedLand]['rocket-config'].split(' ')[5], +gameData[selectedLand]['rocket-config'].split(' ')[6]);
  }
}
/* eslint-enable  @typescript-eslint/no-unused-vars */
