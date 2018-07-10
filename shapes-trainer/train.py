import tensorflow as tf
tf.enable_eager_execution()
import tensorflowjs as tfjs

import os
import numpy as np
import time
import json
import sys

import training_shapes_module as tm

# If user wants to specify sub-directory for their data they can specify as an argument
# else use root directory of shapes-data
if len(sys.argv) == 2:
  image_data_dir = sys.argv[1]
else:
  image_data_dir = ""

image_data_service_dir = "shapes-data/"
image_dir = image_data_service_dir + image_data_dir
BATCH_SIZE = 16
SHUFFLE_SIZE = 1000
EPOCHS=50

IMAGE_FORMAT = {'height':100,'width':100}

LABELS = tm.prepare_data(image_dir)
NUM_OF_LABELS = len(LABELS)

def add_labels_json(path):
  with open(path+"/labels.json", 'w') as f:
    json.dump({'labels': LABELS}, f)

def simple():
  # Create the dataset
  train_dataset, test_dataset = tm.load_data(image_dir, number_of_outputs=NUM_OF_LABELS, flatten=True, batch_size=BATCH_SIZE, shuffle_size=SHUFFLE_SIZE)
  # Create model
  model = tm.simple_model(IMAGE_FORMAT['height'],IMAGE_FORMAT['width'],NUM_OF_LABELS)
  # train and test model
  tm.train_and_test(model,EPOCHS,train_dataset,test_dataset)
  return model

def conv():
  # Create the dataset
  train_dataset, test_dataset = tm.load_data(image_dir, number_of_outputs=NUM_OF_LABELS, batch_size=BATCH_SIZE, shuffle_size=SHUFFLE_SIZE)
  # Create model
  model = tm.cnn_model(IMAGE_FORMAT['height'],IMAGE_FORMAT['width'],NUM_OF_LABELS)
  # train and test model
  tm.train_and_test(model,EPOCHS,train_dataset,test_dataset)
  return model

def main():
  print('Start training simple network')
  simple_model = simple()
  print('Finished training simple network')
  print('Saving simple network')
  model_path = 'shapes-model/simple_model_'+image_data_dir+time.strftime('%Y%m%d_%H%M')
  simple_model.save(model_path+'.h5')
  tfjs.converters.save_keras_model(simple_model, model_path)
  add_labels_json(model_path)
  print('Saved simple network')

  print('Start training Convoluted network:')
  conv_model = conv()
  print('Finished training convoluted network')
  print('Saving convoluted network')
  model_path = 'shapes-model/conv_model_'+image_data_dir+time.strftime('%Y%m%d_%H%M')
  conv_model.save(model_path+'.h5')
  tfjs.converters.save_keras_model(conv_model, model_path)
  add_labels_json(model_path)
  print('Saved convoluted network')

if __name__ == "__main__":
  start = time.time()
  main()
  end = time.time()
  print('script ran for', end - start, 'seconds')
