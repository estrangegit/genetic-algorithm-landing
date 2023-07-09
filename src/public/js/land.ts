$(function(){

  const CANVAS_WIDTH = 6999;
  const CANVAS_HEIGHT = 2500;

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
  let points = gameData[selectedLand].points;
  const gameConfig = new GameConfig();
  const land = new Land();

  gameConfig.width = +gameData[selectedLand]['game-config'].split(' ')[0];
  gameConfig.height = +gameData[selectedLand]['game-config'].split(' ')[1];
  gameConfig.g = +gameData[selectedLand]['game-config'].split(' ')[2];
  gameConfig.maxLandingHSpeed = +gameData[selectedLand]['game-config'].split(' ')[3];
  gameConfig.maxLandingVSpeed = +gameData[selectedLand]['game-config'].split(' ')[4];
  gameConfig.thrustStep = +gameData[selectedLand]['game-config'].split(' ')[5];
  gameConfig.angleStep = +gameData[selectedLand]['game-config'].split(' ')[6];
  gameConfig.minThrust = +gameData[selectedLand]['game-config'].split(' ')[7];
  gameConfig.maxThrust = +gameData[selectedLand]['game-config'].split(' ')[8];
  gameConfig.minAngle = +gameData[selectedLand]['game-config'].split(' ')[9];
  gameConfig.maxAngle = +gameData[selectedLand]['game-config'].split(' ')[10];
  for(let i = 0; i < points.length; i++) {
    land.addPoint(+points[i].split(' ')[0], +points[i].split(' ')[1]);
  }
  console.log(gameConfig);
  land.draw(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);

  $landSelector.on('change', function() {
    selectedLand = ($(this).val() as string);
    points = gameData[selectedLand].points;
    land.reset();

    for(let i = 0; i < points.length; i++) {
      land.addPoint(points[i].split(' ')[0], points[i].split(' ')[1]);
    }

    land.draw(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
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
