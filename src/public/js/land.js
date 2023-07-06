$(function(){

  let CANVAS_WIDTH = 1000;
  let CANVAS_HEIGHT = 500;

  let $landCanvas = $('.land');
  let $startButton = $('.start');
  let $stopButton = $('.stop');

  var ctx = $landCanvas[0].getContext("2d");

  $startButton.on('click', () => {
    ctx.moveTo(0, 400);
    ctx.lineTo(1000, 400);
    ctx.stroke();
  })

  $stopButton.on('click', () => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  })
})
