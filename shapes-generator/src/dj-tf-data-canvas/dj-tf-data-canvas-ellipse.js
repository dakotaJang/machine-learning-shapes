import { DjTfDataCanvas } from "./dj-tf-data-canvas";

const cos = Math.cos;
const sin = Math.sin;

export class DjTfDataCanvasEllipse extends DjTfDataCanvas {
  ready(){
    super.ready();
    this.name = 'ellipse';
  }

  drawEllipse(ctx, x, y, rX, rY, phi){
    ctx.beginPath();
    ctx.ellipse(x, y, rX, rY, phi, 0, 2 * Math.PI);
    ctx.stroke();
  }

  drawRandomEllipse(ctx){
    const LINE_WIDTH = 5;

    const R_MIN = 10;
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

    let rX = R_MIN + Math.random()*(R_MAX-R_MIN);
    let rY = R_MIN + Math.random()*(R_MAX-R_MIN);

    const PHI_MIN = 0;
    const PHI_MAX = 2 * Math.PI;
    let phi = Math.random()*(PHI_MAX-PHI_MIN);

    this.initCanvasContext(ctx, LINE_WIDTH);
    this.drawEllipse(ctx, x, y, rX, rY, phi);
    return [x,y,rX,rY,phi].map((value)=>{return value.toFixed(3)});
  }

  downloadRandomizedData(){
    // draw function will have ctx variable defined by extension
    let draw = this.drawRandomEllipse.bind(this);
    this.generateRandomizedData(draw,this.name,'x,y,rX,rY,phi');
  }
}

window.customElements.define('dj-tf-data-canvas-ellipse', DjTfDataCanvasEllipse);
