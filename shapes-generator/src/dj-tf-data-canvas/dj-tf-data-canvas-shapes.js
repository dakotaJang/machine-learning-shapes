import { DjTfDataCanvas } from "./dj-tf-data-canvas";

const cos = Math.cos;
const sin = Math.sin;

export class DjTfDataCanvasShapes extends DjTfDataCanvas {
  static get properties() {
    return {
      type:{
        type: String,
        value: "regular",
        reflectToAttribute: true
      },
      n: {
        type: Number,
        value: 4,
        reflectToAttribute: true
      }
    };
  }

  ready(){
    super.ready();
    this.name = `${this.n}-gon`;
  }
  drawShape(ctx, points){
    ctx.beginPath();
    ctx.moveTo(points[0].x,points[0].y);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x,points[i].y);
    }

    ctx.closePath();
    ctx.stroke();
  }
  drawEllipse(ctx, x, y, rX, rY){
    ctx.beginPath();
    ctx.ellipse(x, y, rX, rY, 0, 0, 2 * Math.PI);
    ctx.stroke();
  }

  drawRandomPolygon(ctx){
    const LINE_WIDTH = 5;

    const R_MIN = 15;
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

    // const PHI_MIN = 0;
    // const PHI_MAX = 2 * Math.PI;
    // let phi = Math.random()*(PHI_MAX-PHI_MIN);

    const points = this.randomPointsOnRandomEllipse(this.n,x,y,rX,rY);


    this.initCanvasContext(ctx, LINE_WIDTH);
    this.drawShape(ctx, points);
    // this.drawEllipse(ctx, x, y, rX, rY)
    return points.map((p)=>{return `${p.x.toFixed(3)}-${p.x.toFixed(3)}`});
  }

  randomizeAngles(n){
    const DELTA_MIN = 1/10;
    let angles = [];
    while(angles.length < n){
      angles.push(Math.random())
      if(angles.length === n){
        angles.sort((a, b) => a - b);
        let tooCloseToLowerNeighbor = angles.map((x,i,array)=>{
          const diff = i === 0 ? 1-array[n-1]+x : x - array[i-1];
          return diff < DELTA_MIN;
        });
        const tooCloseIndex = tooCloseToLowerNeighbor.indexOf(true);
        if(tooCloseIndex !== -1){
          angles.splice(tooCloseIndex,1);
        }
      }
    }
    return angles.map(t=>t*2*Math.PI);
  }

  randomPointsOnRandomEllipse(n,x,y,a,b){
    const thetas = this.randomizeAngles(n);
    let points = [];
    thetas.forEach(theta => {
      points.push({
        x:a*cos(theta)+x,
        y:b*sin(theta)+y
      });
    });
    return points;
  }


  downloadRandomizedData(){
    // draw function will have ctx variable defined by extension
    let draw = this.drawRandomPolygon.bind(this);
    this.generateRandomizedData(draw,this.name);
  }
}

window.customElements.define('dj-tf-data-canvas-shape', DjTfDataCanvasShapes);
