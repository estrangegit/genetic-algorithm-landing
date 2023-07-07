$(function(){
  const CANVAS_WIDTH = 6999;
  const CANVAS_HEIGHT = 5000;

  const $landCanvas = $('.land');
  const $startButton = $('.start');
  const $stopButton = $('.stop');

  const ctx: CanvasRenderingContext2D | null = ($landCanvas[0] as HTMLCanvasElement).getContext("2d");

  if(ctx != null) {
    $startButton.on('click', () => {
      ctx.lineWidth = 10;
      ctx.moveTo(0, 4000);
      ctx.lineTo(6999, 4000);
      ctx.stroke();
    })
  
    $stopButton.on('click', () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    })
  }

})
