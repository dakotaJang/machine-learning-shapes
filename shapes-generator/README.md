# <dj-tf-image-data\>

```
> src
  > dj-tf-data-canvas
      dj-tf-data-canvas-circle.js
      dj-tf-data-canvas-ellipse.js
      dj-tf-data-canvas-multi-circle.js
      dj-tf-data-canvas-polygon.js
      dj-tf-data-canvas-rectangle.js
      dj-tf-data-canvas-triangle.js
      dj-tf-data-canvas.js
  > dj-tf-image-data-app
      dj-tf-image-data-app.js
```

## src > dj-tf-data-canvas > dj-tf-data-canvas.js
Have the basic definitions for the canvas, generating blobs, and creating a .zip archive for download.
User can enter number of data to generate and click the Generate button to start the process.

## src > dj-tf-data-canvas > *
All other web-components are extended from ```<dj-tf-data-canvas>``` and they are customized to generate different shapes.