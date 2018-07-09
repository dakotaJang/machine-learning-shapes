import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import "jszip/dist/jszip";
// import "jszip/vendor/FileSaver";

export class DjTfDataCanvas extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
          text-align: -webkit-center;
        }
        canvas {
          display: block;
          border: black 1px solid;
        }
        button{
          display: block;
        }
      </style>
      <canvas id="canvas" width="[[size]]" height="[[size]]"></canvas>
      <label>[[name]]</label>
      <input id="number-of-samples-input" placeholder="Enter number of samples to generate" value="[[numberOfSamples]]"/>
      <button on-click="downloadRandomizedData">Generate Randomized Data</button>
    `;
  }
  static get properties() {
    return {
      name: String,
      numberOfSamples: {
        type: Number,
        value: 5
      },
      size: {
        type: Number,
        value: 100
      }
    };
  }

  ready() {
    super.ready();
    this.$['number-of-samples-input'].addEventListener('change',this.handleInputChange.bind(this));

    const LINE_WIDTH = 5;
    let canvas = this.$.canvas;
    let ctx = canvas.getContext('2d');
    this.initCanvasContext(ctx, LINE_WIDTH);
  }

  handleInputChange(){
    this.numberOfSamples = Number.parseInt(this.$['number-of-samples-input'].value);
  }

  initCanvasContext(ctx, LINE_WIDTH){
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = LINE_WIDTH;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }

  generateBlob(draw,name,zip,i){
    return new Promise((resolve, reject)=>{
      let canvas = this.$.canvas;
      let ctx = canvas.getContext('2d');
      let params = draw(ctx);
      this.csvData = this.csvData+'\n'+params.join(',');
      canvas.toBlob((blob)=>{
        zip.file(`${name}-${i}-${params.join('-')}.jpg`, blob);
        resolve(++i);
      });
    });
  }

  async generateBlobs(draw,n,name,zip){
    let i = 0;
    let generatingBlobs = Array(n).fill(this.generateBlob.bind(this));
    for (const it of generatingBlobs) {
      await it(draw,name,zip,i++);
    }
    return Promise.resolve();
  }

  generateRandomizedData(draw,name,csvHeader){
    let zip = new JSZip();
    let n = this.numberOfSamples;
    this.csvData = '';
    this.generateBlobs(draw,n,name,zip).then(()=>{
      if(csvHeader){
        zip.file("data.csv", csvHeader+this.csvData);
      }
      zip.generateAsync({type:"blob"})
      .then(function(content) {
          // see FileSaver.js
          saveAs(content, `${name}.zip`);
      });
    });
  }
}

window.customElements.define('dj-tf-data-canvas', DjTfDataCanvas);
