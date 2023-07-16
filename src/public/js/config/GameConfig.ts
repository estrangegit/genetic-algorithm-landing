import { gameData } from "../data.js";

/* eslint-disable  @typescript-eslint/no-unused-vars */
export class GameConfig {
  width: number;
  height: number;
  g: number;
  maxLandingVSpeed: number;
  maxLandingHSpeed: number;
  thrustStep: number;
  angleStep: number;
  minThrust: number;
  maxThrust: number;
  minAngle: number;
  maxAngle: number;

  constructor() {
    this.width = 0;
    this.height = 0;
    this.g = 0;
    this.maxLandingVSpeed = 0;
    this.maxLandingHSpeed = 0;
    this.thrustStep = 0;
    this.angleStep = 0;
    this.minThrust = 0;
    this.maxThrust = 0;
    this.minAngle = 0;
    this.maxAngle = 0
  }

  initGameConfig(selectedLand: string): void {
    this.width = +gameData[selectedLand]['game-config'].split(' ')[0];
    this.height = +gameData[selectedLand]['game-config'].split(' ')[1];
    this.g = +gameData[selectedLand]['game-config'].split(' ')[2];
    this.maxLandingHSpeed = +gameData[selectedLand]['game-config'].split(' ')[3];
    this.maxLandingVSpeed = +gameData[selectedLand]['game-config'].split(' ')[4];
    this.thrustStep = +gameData[selectedLand]['game-config'].split(' ')[5];
    this.angleStep = +gameData[selectedLand]['game-config'].split(' ')[6];
    this.minThrust = +gameData[selectedLand]['game-config'].split(' ')[7];
    this.maxThrust = +gameData[selectedLand]['game-config'].split(' ')[8];
    this.minAngle = +gameData[selectedLand]['game-config'].split(' ')[9];
    this.maxAngle = +gameData[selectedLand]['game-config'].split(' ')[10];
  }
}
/* eslint-enable  @typescript-eslint/no-unused-vars */
