# Starting Tensorflow with high-level api using docker

### Table of Contents
**[Brief Introduction](#brief-introduction)**<br>
**[Prerequisite](#prerequisite)**<br>
**[Starting the project](#starting-the-project)**<br>
**[Getting the data](#getting-the-data)**<br>
**[Training](#training)**<br>
**[Predicting](#predicting)**<br>
**[More Details](#more-details)**<br>
**[Development with docker on Windows](#development-with-docker-on-windows)**<br>
**[Troubleshoot](#troubleshoot)**<br>

## Brief Introduction
This sample project will look into:
- generating images of certain shapes with labels
- create and train a simple/convoluted neural network model using tensorflow
- predicting a shape drawn by a user using the trained model.

## Prerequisite
- Docker <!--18.03.1-ce-win65 (17513)-->

If you don't want to use Docker containers:
- Node / NPM
- Python 3
- Tensorflow

But the instructions here will be using Docker. Additional code changes or configuration may be required if you are not using Docker.

If you are using Windows 10, check <a href="#windows10">below</a> for additional set up.

## Starting the project
First, clone the project.
```
git clone https://github.com/dakotaJang/shapes.git
```

Then run docker-compose in project directory:
```
cd shapes
docker-compose up
```

This will start 5 services.
- shapes-generator
- shapes-trainer
- shapes-predictor
- shapes-model

## Getting the data
1. Open web browser (Chrome) and go to http://localhost:8081

    Here we can simulate and download shapes using 100px by 100px canvas.
    Each canvas generates different shapes and you can specify how many simulations you would like to download.

    You go to ```shapes-generator``` to view the polymer based components and modify to create shapes that you desire.

2. Click "Download" button(s) to simulate and generate images to download.

3. After you download, place the zip files in the ```shapes-data``` folder.

## Training
### Using the Jupyter notebook
1. Open a new tab on web browser and go to http://localhost:8082

    Here we will see the contents of ```/shapes-trainer```.

2. Open the ```train.ipynb``` notebook file.

    Follow the instructions in the notebook.

    You can run the commands by clicking the code block and clicking the ```Run``` button near the top of the page.

### Using the Docker Container command line
1. Enter following command to get in to container's terminal
    ```
    docker exec -it shapes-trainer /bin/bash
    ```

2. Follow the instruction found in the <a href="http://localhost:8082/notebooks/train.ipynb">note book</a>

    By the end of the notebook, you should have the trained model(s) created in the ```shapes-model``` folder.

## Predicting
1. Open a new tab on web browser and go to http://localhost:8084

2. Load model by entering the first input with folder name that contains the model.json in the shapes-model folder.

3. Click ```Load Model``` button to load the model.

4. Once the model have been loaded successfully, you can start drawing on canvas to see if the model can predict accurately.

## More Details
### Docker Images
- Polymer CLI
    - Installed polymer-cli on node:slim to keep the image size to a minimum.
    - Links: <a href="https://hub.docker.com/r/dakotajang/polymer-cli/">Docker Hub</a>,
        <a href="https://github.com/dakotaJang/polymer-cli-docker">GitHub</a>
- Tensorflow
    - Installed TensorflowJS on top of Tensorflow image for web compatibility
    - Links: <a href="https://hub.docker.com/r/dakotajang/tensorflow/">Docker Hub</a>,
      <a href="https://github.com/dakotaJang/tensorflow-docker">GitHub</a>


## Development with docker on Windows
Docker is more suited to work with linux environment. So using Docker on windows can be troublesome.

- had problem using the bind mount for development on WINDOWS 10.
  - fixed it by one of two things:
    1. Open Docker Settings > Shared Drives > Reset credentials...
        - seems like changing my password caused the problem
        - probably need to reset credentials again if I changed the password in the future
    2. May need to set environment variable
      ```powershell
      SETX COMPOSE_CONVERT_WINDOWS_PATHS 1
      ```

- To do some development with docker on windows we need to start ```docker-volume-watcher```
  First install the tool
  ```powershell
  pip install docker-windows-volume-watcher
  ```

  Run the command with target container
  ```powershell
  docker-volume-watcher shapes-generator
  ```
  ```powershell
  docker-volume-watcher shapes-predictor
  ```

## Troubleshoot
- If the docker fails to run
  1. Open Hyper-V Manager
  2. Select your virtual machine (if not selected)
  3. Click "Stop Service" under Actions tab
  4. Click "Turn Off" on the prompt window
  5. Click "Start Service" under Actions tab
  6. Start Docker
  7. If this doesn't work, try restarting the your machine

- No model created
  - If there are no folder(s) with ```model.json``` in ```shapes-model``` folder, but there is a ```.h5``` file in ```shapes-model``` folder then training was successful but couldn't create a web friendly version of the model. Probably due to not enough memory. We need to convert the keras model manually.
  ```terminal
  tensorflowjs_converter \
      --input_format=keras \
      /shapes-model/my_keras_model.h5 \
      /shapes-model/my_tfjs_model
  ```
  - If there are nothing created in ```shapes-model``` folder then training probably failed.
    - check if training had error
    - if process was ```Killed```
      - improve memory management
      - increase memory
      - train model on the host machine

- If you get a error similar to:
    ```
    shapes-predictor | npm ERR! enoent ENOENT: no such file or directory, open '/shapes-predictor/package.json'
    ```
    - This is probably because the Volume is not setup correctly. Maybe due to changed password. Rest credentials in Docker > Settings > Shared Drives

### References
Docker Windows Volume Watcher: https://github.com/merofeev/docker-windows-volume-watcher
