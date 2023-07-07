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
  const land = new Land();

  for(let i = 0; i < points.length; i++) {
    land.addPoint(points[i].split(' ')[0], points[i].split(' ')[1]);
  }
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
