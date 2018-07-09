import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import { DjTfDataCanvasCircle } from "../dj-tf-data-canvas/dj-tf-data-canvas-circle";
import { DjTfDataCanvasTriangle } from "../dj-tf-data-canvas/dj-tf-data-canvas-triangle";
import { DjTfDataCanvasRectangle } from "../dj-tf-data-canvas/dj-tf-data-canvas-rectangle";
import { DjTfDataCanvasPolygon } from "../dj-tf-data-canvas/dj-tf-data-canvas-polygon";
import { DjTfDataCanvasEllipse } from "../dj-tf-data-canvas/dj-tf-data-canvas-ellipse";
import { DjTfDataCanvasShapes } from "../dj-tf-data-canvas/dj-tf-data-canvas-shapes";

class DjTfImageData extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <div>
        <h1>Centered-Regular</h1>
        <p>Contains very little jitter</p>
        <dj-tf-data-canvas-circle></dj-tf-data-canvas-circle>
        <dj-tf-data-canvas-polygon n="3"></dj-tf-data-canvas-polygon>
        <dj-tf-data-canvas-polygon n="4"></dj-tf-data-canvas-polygon>
        <dj-tf-data-canvas-polygon n="5"></dj-tf-data-canvas-polygon>
      </div>
      <!--
      <div>
        <h1>Uncentered</h1>
        <dj-tf-data-canvas-rectangle></dj-tf-data-canvas-rectangle>
        <dj-tf-data-canvas-triangle></dj-tf-data-canvas-triangle>
      </div>
      -->
      <div>
        <h1>Convex Polygon Inscribed in Ellipse</h1>
        <dj-tf-data-canvas-ellipse></dj-tf-data-canvas-ellipse>
        <dj-tf-data-canvas-shape n="3"></dj-tf-data-canvas-shape>
        <dj-tf-data-canvas-shape n="4"></dj-tf-data-canvas-shape>
        <dj-tf-data-canvas-shape n="5"></dj-tf-data-canvas-shape>
        <dj-tf-data-canvas-shape n="6"></dj-tf-data-canvas-shape>
        <dj-tf-data-canvas-shape n="7"></dj-tf-data-canvas-shape>
        <dj-tf-data-canvas-shape n="8"></dj-tf-data-canvas-shape>
      </div>
      <div>
        <h1>Uncentered-Irregular</h1>
        <dj-tf-data-canvas-ellipse></dj-tf-data-canvas-ellipse>
        <dj-tf-data-canvas-rectangle></dj-tf-data-canvas-rectangle>
        <dj-tf-data-canvas-triangle></dj-tf-data-canvas-triangle>
      </div>
    `;
  }
}

window.customElements.define('dj-tf-image-data-app', DjTfImageData);
