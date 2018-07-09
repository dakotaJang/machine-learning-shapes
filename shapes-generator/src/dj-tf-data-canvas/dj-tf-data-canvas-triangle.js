import { DjTfDataCanvas } from "./dj-tf-data-canvas";

export class DjTfDataCanvasTriangle extends DjTfDataCanvas {
  drawTriangle(ctx, p0, p1, p2){
    ctx.fillStyle = 'black';
    ctx.lineCap = 'round';
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.closePath();
    ctx.stroke();
  }

  drawRandomTriangle(ctx){
    const LINE_WIDTH = 5;
    
    const OFFSET = 5;
    const X_MIN = OFFSET;
    const Y_MIN = OFFSET;
    const X_MAX = this.size - OFFSET;
    const Y_MAX = this.size - OFFSET;
    let p0 = this.initPoint(X_MIN,Y_MIN,X_MAX,Y_MAX);
    let p1 = this.initPoint(X_MIN,Y_MIN,X_MAX,Y_MAX);
    let p2 = this.initPoint(X_MIN,Y_MIN,X_MAX,Y_MAX);
    let lowestHeight = this.calculateLowestHeight(p0,p1,p2);

    const MIN_HEIGHT = 10;
    while(lowestHeight<MIN_HEIGHT){
      p0 = this.initPoint(X_MIN,Y_MIN,X_MAX,Y_MAX);
      p1 = this.initPoint(X_MIN,Y_MIN,X_MAX,Y_MAX);
      p2 = this.initPoint(X_MIN,Y_MIN,X_MAX,Y_MAX);
      lowestHeight = this.calculateLowestHeight(p0,p1,p2);
    }
    this.initCanvasContext(ctx, LINE_WIDTH);
    this.drawTriangle(ctx, p0, p1, p2);
    return [p0, p1, p2].map((p)=>{return `${p.x.toFixed(3)},${p.y.toFixed(3)}`});
  }

  initPoint(X_MIN,Y_MIN,X_MAX,Y_MAX,points){
    const MINIMUM_RADIUS_TO_OTHER_POINT = 5;
    let newPoint = {
      x: X_MIN + Math.random()*(X_MAX - X_MIN),
      y: Y_MIN + Math.random()*(Y_MAX - Y_MIN)
    };
    if(points){
      while (this.checkCloseness(newPoint,points)) {
        newPoint = {
          x: X_MIN + Math.random()*(X_MAX - X_MIN),
          y: Y_MIN + Math.random()*(Y_MAX - Y_MIN)
        };
      }
    }
    return newPoint;
  }

  checkCloseness(newPoint,points){
    for (let i = 0; i < points.length; i++) {
      let dx = points[i].x - newPoint.x;
      let dy = points[i].y - newPoint.y;
      let r = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
      if(r<MINIMUM_RADIUS_TO_OTHER_POINT){return true}
    }
    return false;
  }

  calculateLowestHeight(p0,p1,p2){
    let area = Math.abs(((p0.x*(p1.y-p2.y))+(p1.x*(p2.y-p0.y))+(p2.x*(p0.y-p1.y)))/2);
    let b = Math.max(...[
      Math.sqrt(Math.pow(p0.x-p1.x,2)+Math.pow(p0.y-p1.y,2)),
      Math.sqrt(Math.pow(p0.x-p2.x,2)+Math.pow(p0.y-p2.y,2)),
      Math.sqrt(Math.pow(p1.x-p2.x,2)+Math.pow(p1.y-p2.y,2))
    ]);
    let h = 2*area/b
    return h;
  }
  downloadRandomizedData(){
    // draw function will have ctx variable defined by extension
    let draw = this.drawRandomTriangle.bind(this);
    this.generateRandomizedData(draw,'triangle');
  }
}

window.customElements.define('dj-tf-data-canvas-triangle', DjTfDataCanvasTriangle);
