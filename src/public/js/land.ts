import { GameConfig } from "./config/GameConfig.js";
import { gameData } from "./data.js";
import { Land } from "./model/Land.js";
import { Rocket } from "./model/Rocket.js";


function runAlgorithm(maxTimeStep: number, land: Land, gameConfig: GameConfig, ctx: CanvasRenderingContext2D, rocketNb: number, mutationProbabilityAfterIndex: number, randomMutationProbability: number, retainedGradedRocketRatio: number, retainedNonGradedRocketRatio: number): NodeJS.Timeout {
  let drawStep = 0;
  let highestScore = 0;
  let successfullLandingRocket: Rocket = new Rocket();
  const timeoutId = setInterval((maxTimeStep, land, gameConfig, ctx, rocketNb, mutationProbabilityAfterIndex, randomMutationProbability, retainedGradedRocketRatio, retainedNonGradedRocketRatio) => {
    drawStep++;
    land.computeRocketsPosition(gameConfig, maxTimeStep);
    land.computeRocketScores(gameConfig);
    if(drawStep % 100 == 0) {
      console.log('highest score: ' + highestScore);
      console.log(JSON.parse(JSON.stringify(land)));
      land.drawLandscape(ctx, gameConfig.width, gameConfig.height);
      land.drawRockets(ctx, gameConfig.height);
    }
    highestScore = land.rocketSelection(retainedGradedRocketRatio, retainedNonGradedRocketRatio);
    if(highestScore > 80) {
      successfullLandingRocket = land.rockets[0];
      land.drawLandscape(ctx, gameConfig.width, gameConfig.height);
      successfullLandingRocket.draw(ctx, gameConfig.height);
      clearTimeout(timeoutId);
    }
    land.rocketsCrossover(rocketNb, mutationProbabilityAfterIndex, maxTimeStep);
    land.randomRocketsMutation(randomMutationProbability, maxTimeStep);
    land.resetRocketTrajectories();
  }, 10, maxTimeStep, land, gameConfig, ctx, rocketNb, mutationProbabilityAfterIndex, randomMutationProbability, retainedGradedRocketRatio, retainedNonGradedRocketRatio);
  return timeoutId;
}

$(function(){
  const ROCKET_NB = 50;
  const MAX_TIMESTEP = 500;
  const MUTATION_PROBABILITY_AFTER_INDEX = 0.5;
  const RANDOM_MUTATION_PROBABILITY = 0.01;
  const RETAINED_GRADED_ROCKET_RATIO = 0.05;
  const RETAINED_NON_GRADED_ROCKET_RATIO = 0.03;

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
    clearTimeout(timeoutId);
    selectedLand = ($(this).val() as string);
    land.initLandscape(selectedLand);
    land.drawLandscape(ctx, gameConfig.width, gameConfig.height);
  })

  if(ctx != null) {
    $startButton.on('click', () => {
      land.drawLandscape(ctx, gameConfig.width, gameConfig.height);
      land.initRocketRandomCommands(selectedLand, ROCKET_NB, MAX_TIMESTEP);
      timeoutId = runAlgorithm(MAX_TIMESTEP, land, gameConfig, ctx, ROCKET_NB, MUTATION_PROBABILITY_AFTER_INDEX, RANDOM_MUTATION_PROBABILITY, RETAINED_GRADED_ROCKET_RATIO, RETAINED_NON_GRADED_ROCKET_RATIO);
    })

    $stopButton.on('click', () => {
      clearTimeout(timeoutId);
    })
  }
})
