import { DjTfDataCanvas } from "./dj-tf-data-canvas";

export class DjTfDataCanvasCircle extends DjTfDataCanvas {
  drawCircle(ctx, x, y, r){
    const FULL_CIRCLE = [0,2*Math.PI];
    ctx.beginPath();
    ctx.arc(x,y,r,...FULL_CIRCLE);
    ctx.stroke();
  }

  drawRandomCircle(ctx){
    const LINE_WIDTH = 5;
    // const R_MIN = 10;
    const R_MIN = (this.size/2)-LINE_WIDTH;
    const X_MIN = R_MIN;
    const Y_MIN = R_MIN;
    const X_MAX = this.size-X_MIN;
    const Y_MAX = this.size-Y_MIN;
    let x = X_MIN + Math.random()*(X_MAX - X_MIN);
    let y = Y_MIN + Math.random()*(Y_MAX - Y_MIN);

    // Find length to closest boundary
    let r_x = this.size/2 - Math.abs(x - this.size/2);
    let r_y = this.size/2 - Math.abs(y - this.size/2);
    // Maximum radius is shortest calculated above
    const R_MAX = (r_x < r_y ? r_x : r_y) - LINE_WIDTH;

    let r = R_MIN + Math.random()*(R_MAX-R_MIN);

    this.initCanvasContext(ctx, LINE_WIDTH);
    this.drawCircle(ctx, x, y, r);
    return [x,y,r].map((value)=>{return value.toFixed(3)});
  }

  downloadRandomizedData(){
    // draw function will have ctx variable defined by extension
    let draw = this.drawRandomCircle.bind(this);
    this.generateRandomizedData(draw,'circle');
  }
}

window.customElements.define('dj-tf-data-canvas-circle', DjTfDataCanvasCircle);
