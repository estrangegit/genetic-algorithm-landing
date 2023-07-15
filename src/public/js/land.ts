import { GameConfig } from "./config/GameConfig.js";
import { gameData } from "./data.js";
import { Land } from "./model/Land.js";

$(function(){

  const CANVAS_WIDTH = 7000;
  const CANVAS_HEIGHT = 2500;
  const ROCKET_NB = 200;
  const MAX_TIMESTEP = 300;

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
  land.initLand(selectedLand, ROCKET_NB, MAX_TIMESTEP);
  land.draw(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);

  $landSelector.on('change', function() {
    selectedLand = ($(this).val() as string);
    land.initLand(selectedLand, ROCKET_NB, MAX_TIMESTEP);
    land.draw(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
    console.log(land);
  })

  if(ctx != null) {
    $startButton.on('click', () => {
      console.log('start button have been hit');
    })

    $stopButton.on('click', () => {
      console.log('stop button have been hit');
    })
  }
})
