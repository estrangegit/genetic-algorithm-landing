import { GameConfig } from "./config/GameConfig.js";
import { gameData } from "./data.js";
import { Land } from "./model/Land.js";


function runAlgorithm(maxTimeStep: number, land: Land, gameConfig: GameConfig, ctx: CanvasRenderingContext2D, rocketNb: number): NodeJS.Timeout {
  const timeoutId = setInterval(() => {
    land.computeRocketsPosition(gameConfig, maxTimeStep);
    land.computeRocketScores(gameConfig);
    console.log(land);
    land.drawLandscape(ctx, gameConfig.width, gameConfig.height);
    land.drawRockets(ctx, gameConfig.height);
    land.rocketSelection();
    land.rocketsCrossover(rocketNb)
  }, 500);
  return timeoutId;
}

$(function(){
  const ROCKET_NB = 50;
  const MAX_TIMESTEP = 100;

  const landNames = Object.keys(gameData);

  const $landCanvas = $('.land');
  const $startButton = $('.start');
  const $stopButton = $('.stop');
  const $landSelector = $('#commands .custom-select');

  let selectorContent = "";
  for(let i = 0; i < landNames.length; i++) {
    if(i == 0) {
      selectorContent += "<option selected value='" + landNames[i] + "'>" + landNames[i] + "</option>";
    } else {
      selectorContent += "<option value='" + landNames[i] + "'>" + landNames[i] + "</option>";
    }
  }

  $landSelector.html(selectorContent);

  const ctx: CanvasRenderingContext2D | null = ($landCanvas[0] as HTMLCanvasElement).getContext('2d');

  let selectedLand: string = ($landSelector.val() as string);
  const gameConfig = new GameConfig();
  const land = new Land();
  let timeoutId: NodeJS.Timeout;

  gameConfig.initGameConfig(selectedLand);
  land.initLandscape(selectedLand);
  land.drawLandscape(ctx, gameConfig.width, gameConfig.height);

  $landSelector.on('change', function() {
    selectedLand = ($(this).val() as string);
    land.initLandscape(selectedLand);
    land.drawLandscape(ctx, gameConfig.width, gameConfig.height);
  })

  if(ctx != null) {
    $startButton.on('click', () => {
      land.drawLandscape(ctx, gameConfig.width, gameConfig.height);
      land.initRocketRandomCommands(selectedLand, ROCKET_NB, MAX_TIMESTEP);
      timeoutId = runAlgorithm(MAX_TIMESTEP, land, gameConfig, ctx, ROCKET_NB);
    })

    $stopButton.on('click', () => {
      clearTimeout(timeoutId);
    })
  }
})
