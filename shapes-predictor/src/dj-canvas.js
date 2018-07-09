import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

export class DjDrawCanvas extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          text-align: -webkit-center;
        }
        canvas {
          display: block;
          border: black 1px solid;
          width: 200px;
        }
        button{
          display: block;
        }
      </style>
      <canvas id="canvas" width="[[size]]" height="[[size]]"></canvas>
      <button on-click="onDrawLines">Line</button>
      <button on-click="onDrawFree">Freestyle</button>
      <button on-click="onClearCanvas">Clear</button>
      <button on-click="onStop">Stop</button>
      `;
  }
  static get properties() {
    return {
      size: {
        type: Number,
        value: 100
      },
      pinnedPoints:{
        type: Array,
        value: []
      },
      drawStyle: {
        type: String,
        value: 'line'
      },
      drawing: Boolean
    };
  }

  ready() {
    super.ready();
    let canvas = this.$.canvas;
    let ctx = canvas.getContext('2d');
    this.initCanvasContext(ctx,5);
    this.addListeners(canvas,ctx);
  }

  clearCanvas(ctx){
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  initCanvasContext(ctx, LINE_WIDTH){
    this.clearCanvas(ctx);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = LINE_WIDTH;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }

  onClearCanvas(){
    this.stop = false;
    let canvas = this.$.canvas;
    let ctx = canvas.getContext('2d');
    this.clearCanvas(ctx);
    this.pinnedPoints = [];
    this.dispatchEvent(new CustomEvent('canvas-cleared'));
  }

  onDrawFree(){
    this.stop = false;
    this.drawStyle = "free";
  }

  onDrawLines(){
    this.stop = false;
    this.drawStyle = "line";
  }

  onStop(){
    this.stop = true;
    let canvas = this.$.canvas;
    let ctx = canvas.getContext('2d');
    this.updateCanvasContext(ctx);
  }

  addListeners(canvas,ctx){
    canvas.addEventListener("mousedown", this.mousedown.bind(this));
    canvas.addEventListener("mousemove", this.mousemove.bind(this));
    canvas.addEventListener("mouseup", this.pauseDrawing.bind(this));
    canvas.addEventListener("mouseout", this.pauseDrawing.bind(this));
  }
  mousedown(e){
    let canvas = this.$.canvas;
    let ctx = canvas.getContext('2d');

    this.drawing = this.drawStyle==="free";
    const pos = this.getMousePos(canvas, e);
    if(!this.stop){
      this.pinnedPoints.push(pos);
    }

    this.updateCanvasContext(ctx, pos)
  }
  mousemove(e){
    let canvas = this.$.canvas;
    let ctx = canvas.getContext('2d');

    const pos = this.getMousePos(canvas, e);
    if(this.drawStyle==="free" && this.drawing){
      this.pinnedPoints.push(pos);
    }
    this.updateCanvasContext(ctx, pos)
  }
  pauseDrawing(){
    let canvas = this.$.canvas;
    let ctx = canvas.getContext('2d');

    this.drawing = false;
    this.updateCanvasContext(ctx)
    this.dispatchEvent(new CustomEvent('canvas-paused'));
  }

  getMousePos(canvasDom, mouseEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
      x: (mouseEvent.clientX - rect.left)*(canvasDom.width/rect.width),
      y: (mouseEvent.clientY - rect.top)*(canvasDom.height/rect.height)
    };
  }

  updateCanvasContext(ctx,pos){
    this.clearCanvas(ctx);
    this.connectPinnedPoints(ctx);

    if(this.stop || !pos)
      return;

    ctx.beginPath();
    if(this.drawStyle==="line" && this.pinnedPoints.length>0){
      ctx.moveTo(this.pinnedPoints[this.pinnedPoints.length-1].x, this.pinnedPoints[this.pinnedPoints.length-1].y)
    }else{
      ctx.moveTo(pos.x, pos.y);
    }

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    this.dispatchEvent(new CustomEvent('canvas-updated'));
  }

  connectPinnedPoints(ctx){
    if(!this.pinnedPoints.length)
      return;
    ctx.beginPath();
    ctx.moveTo(this.pinnedPoints[0].x, this.pinnedPoints[0].y);
    this.pinnedPoints.forEach(pos => {
      ctx.lineTo(pos.x, pos.y);
    });
    ctx.stroke();
  }
}

window.customElements.define('dj-draw-canvas', DjDrawCanvas);