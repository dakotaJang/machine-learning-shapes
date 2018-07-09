import { DjTfDataCanvas } from "./dj-tf-data-canvas";

export class DjTfDataCanvasRectangle extends DjTfDataCanvas {
  drawRectangle(ctx, x, y, r, theta,phi){
    const cos = Math.cos;
    const sin = Math.sin;
    const pi = Math.PI;

    ctx.beginPath();
    ctx.moveTo(r*cos(theta+phi)+x, r*sin(theta+phi)+y);

    ctx.lineTo(r*cos(pi-theta+phi)+x, r*sin(pi-theta+phi)+y);
    ctx.stroke();

    ctx.lineTo(r*cos(pi+theta+phi)+x, r*sin(pi+theta+phi)+y);
    ctx.stroke();

    ctx.lineTo(r*cos(-theta+phi)+x, r*sin(-theta+phi)+y);
    ctx.stroke();

    ctx.lineTo(r*cos(theta+phi)+x, r*sin(theta+phi)+y);
    ctx.stroke();
  }

  drawRandomRectangle(ctx){
    const LINE_WIDTH = 5;
    const R_MIN = 15;
    // const R_MIN = (this.size/2)-LINE_WIDTH;
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

    const THETA_MIN = Math.PI/8;
    const THETA_MAX = Math.PI/2 - THETA_MIN;
    let theta = THETA_MIN + (Math.random()*(THETA_MAX-THETA_MIN));
    // let theta = Math.PI/4; // always square

    const PHI_MIN = 0;
    const PHI_MAX = 2 * Math.PI;
    let phi = Math.random()*(PHI_MAX-PHI_MIN);

    this.initCanvasContext(ctx, LINE_WIDTH);
    this.drawRectangle(ctx, x, y, r, theta, phi);
    return [x,y,r].map((value)=>{return value.toFixed(3)});
  }

  downloadRandomizedData(){
    // draw function will have ctx variable defined by extension
    let draw = this.drawRandomRectangle.bind(this);
    this.generateRandomizedData(draw,'rectangle');
  }
}

window.customElements.define('dj-tf-data-canvas-rectangle', DjTfDataCanvasRectangle);
