import * as tf from '@tensorflow/tfjs';
import './dj-canvas.js';

declare global {
  interface Window {
    model: tf.Model;
    loadModel: any;
    makePrediction: any;
    toggleLivePrediction: any;
    labels: Array<string>;
  }
}

const CONV_MODEL_NUMBER_OF_LAYERS = 8;
window.labels = [];
let livePrediction = false;

function loadModel() {
  const path = (document.getElementById("model-path") as HTMLInputElement).value;
  tf.loadModel(`http://localhost:8085/shapes-model/${path}/model.json`).then(
  model => {
    window.model = model;
    (document.getElementById('loaded-model') as HTMLSpanElement).textContent = `Success: Loaded ${path}`;
    console.log('model have been loaded');
    if(!livePrediction){
      toggleLivePrediction();
    }
  }).catch(
    err => {
      (document.getElementById('loaded-model') as HTMLSpanElement).textContent = "Failed";
      console.log(err);
  });

  loadLabels();
}

function loadLabels(){
  const path = (document.getElementById("model-path") as HTMLInputElement).value;
  let xhr = new XMLHttpRequest();
  xhr.overrideMimeType("application/json");
  xhr.open("GET", `http://localhost:8085/shapes-model/${path}/labels.json`, true);
  xhr.onload = data => {
      if (xhr.status >= 200 && xhr.status < 300) {
        window.labels = JSON.parse(xhr.responseText).labels;
      }
  };
  xhr.onerror = err => {console.log(err)};
  xhr.send();
}

async function predict(model:tf.Model,example:tf.Tensor){
  const predictionTensor = model.predict(example) as tf.Tensor1D;
  const predictionIndex = (await predictionTensor.as1D().argMax().data())[0];
  const prediction = window.labels[predictionIndex];
  return prediction;
}

async function makePrediction(){
  if (!window.model){
    (document.getElementById('prediction-status') as HTMLSpanElement).textContent = "Load model first";
    return;
  }
  const canvasElement = (document.getElementById('canvas') as any).$.canvas as HTMLCanvasElement;
  /*
   * tf.fromPixels(imageElement,1) => returns shape [100,100,1] where i assume [height,width,numChannels] Rank=3
   * .expandDims(0) => returns shape [1,100,100,1] kind of like reshape
   * .toFloat().div(tf.scalar(255)) => change the values to from 0-255 range to 0-1 range
   */
  const example = window.model.layers.length === CONV_MODEL_NUMBER_OF_LAYERS ?
      tf.fromPixels(canvasElement,1).expandDims(0).toFloat().div(tf.scalar(255)) as tf.Tensor<tf.Rank.R4> // conv model
    : tf.fromPixels(canvasElement,1).reshape([1,10000]).toFloat().div(tf.scalar(255)); // simple model

  const prediction = await predict(window.model,example);
  (document.getElementById('prediction-status') as HTMLSpanElement).textContent = prediction;
  return prediction;
}

function toggleLivePrediction(){
  livePrediction = !livePrediction;
  document.getElementById("toggle-live-prediction").textContent = `${livePrediction ? 'Dis' : 'En'}able Live Prediction`;
}

function addEventListeners(){
  const canvas = document.getElementById('canvas') as HTMLElement;
  canvas.addEventListener('canvas-updated', _=>{
    if(livePrediction)
      makePrediction()
  });
  canvas.addEventListener('canvas-paused', _=>{
    if(livePrediction)
      makePrediction()
  });
  canvas.addEventListener('canvas-cleared', _=>{
    (document.getElementById('prediction-status') as HTMLSpanElement).textContent = '...';
  });
}

window.onload = ()=>{
  addEventListeners();
  document.getElementById("toggle-live-prediction").textContent = `${livePrediction ? 'Dis' : 'En'}able Live Prediction`;
}

window.loadModel = loadModel;
window.makePrediction = makePrediction;
window.toggleLivePrediction = toggleLivePrediction;