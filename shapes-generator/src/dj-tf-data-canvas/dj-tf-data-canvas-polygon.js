import { DjTfDataCanvas } from "./dj-tf-data-canvas";

const cos = Math.cos;
const sin = Math.sin;

export class DjTfDataCanvasPolygon extends DjTfDataCanvas {
  static get properties() {
    return {
      n: {
        type: Number,
        value: 4,
        notify: true,
        reflectToAttribute: true
      }
    };
  }
  drawPolygon(ctx, x, y, r, theta, phi, N){
    ctx.beginPath();
    ctx.moveTo(r*cos(phi)+x, r*sin(phi)+y);

    for (let i = 1; i <= N; i++) {
      this.drawEdge(ctx, x, y, r, theta, phi, i);
    }
  }

  drawEdge(ctx, x, y, r, theta, phi, n){
    ctx.lineTo(r*cos((n*theta)+phi)+x, r*sin((n*theta)+phi)+y);
    ctx.stroke();
  }

  drawRandomPolygon(ctx){
    const LINE_WIDTH = 5;
    const N = this.n;

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

    let theta = 2*Math.PI/N;

    const PHI_MIN = 0;
    const PHI_MAX = 2 * Math.PI;
    let phi = Math.random()*(PHI_MAX-PHI_MIN);

    this.initCanvasContext(ctx, LINE_WIDTH);
    this.drawPolygon(ctx, x, y, r, theta, phi, N);
    return [x,y,r].map((value)=>{return value.toFixed(3)});
  }

  downloadRandomizedData(){
    // draw function will have ctx variable defined by extension
    let draw = this.drawRandomPolygon.bind(this);
    this.generateRandomizedData(draw,'polygon');
  }
}

window.customElements.define('dj-tf-data-canvas-polygon', DjTfDataCanvasPolygon);
