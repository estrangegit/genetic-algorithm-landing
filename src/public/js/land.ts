$(function(){
  const CANVAS_WIDTH = 1000;
  const CANVAS_HEIGHT = 500;

  const $landCanvas = $('.land');
  const $startButton = $('.start');
  const $stopButton = $('.stop');

  const ctx: CanvasRenderingContext2D | null = ($landCanvas[0] as HTMLCanvasElement).getContext("2d");

  if(ctx != null) {
    $startButton.on('click', () => {
      ctx.moveTo(0, 400);
      ctx.lineTo(1000, 400);
      ctx.stroke();
    })
  
    $stopButton.on('click', () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    })
  }
})
