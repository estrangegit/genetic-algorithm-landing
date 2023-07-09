/* eslint-disable  @typescript-eslint/no-unused-vars */
class Land {
    points: Point[];

    constructor() {
      this.points = [];
    }

    reset(): void {
        this.points = [];
    }

    addPoint(x: number, y: number): void {
        this.points.push(new Point(x, y));
    }

    draw(ctx: CanvasRenderingContext2D | null, canvasWidth: number, canvasHeight: number): void {
        if(ctx != null) {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.moveTo(this.points[0].x, this.points[0].y);
            for(let i = 1; i < this.points.length; i++) {
                ctx.lineTo(this.points[i].x, canvasHeight - this.points[i].y);
            }
            ctx.stroke();
        }
    }
}
/* eslint-enable  @typescript-eslint/no-unused-vars */
