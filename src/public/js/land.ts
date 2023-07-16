import { GameConfig } from "./config/GameConfig.js";
import { gameData } from "./data.js";
import { Land } from "./model/Land.js";

function runAlgorithm(maxTimeStep: number, land: Land, gameConfig: GameConfig): void {
  for (let i = 0; i < land.rockets.length; i++) {
    for (let j = 0; j < maxTimeStep; j++) {
        land.rockets[i].applyCommand();
        land.goToNextStep(land.rockets[i], gameConfig);
    }
  }
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

  gameConfig.initGameConfig(selectedLand);
  land.initLandscape(selectedLand, ROCKET_NB, gameConfig.height);
  land.drawLandscape(ctx, gameConfig.width, gameConfig.height);

  $landSelector.on('change', function() {
    selectedLand = ($(this).val() as string);
    land.initLandscape(selectedLand, ROCKET_NB, MAX_TIMESTEP);
    land.drawLandscape(ctx, gameConfig.width, gameConfig.height);
  })

  if(ctx != null) {
    $startButton.on('click', () => {
      land.drawLandscape(ctx, gameConfig.width, gameConfig.height);
      land.initRocketRandomCommands(selectedLand, ROCKET_NB, MAX_TIMESTEP);
      runAlgorithm(MAX_TIMESTEP, land, gameConfig);
      land.drawRockets(ctx, gameConfig.height);
      console.log(land);
    })

    $stopButton.on('click', () => {
      land.drawLandscape(ctx, gameConfig.width, gameConfig.height);
    })
  }
})
