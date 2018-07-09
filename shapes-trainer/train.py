import tensorflow as tf
tf.enable_eager_execution()
import tensorflowjs as tfjs

import os
import numpy as np
import time

import training_shapes_module as tm

image_data_dir = "shapes-data/"
image_data = "convex_polygon_inscribed_in_ellipse"
image_dir = image_data_dir + image_data

IMAGE_FORMAT = {'height':100,'width':100}

NUM_OF_SHAPES = tm.prepare_data(image_dir)
BATCH_SIZE = 16
SHUFFLE_SIZE = 1000

EPOCHS=50

def simple():
  # Create the dataset
  train_dataset, test_dataset = tm.load_data(image_dir, number_of_outputs=NUM_OF_SHAPES, flatten=True, batch_size=BATCH_SIZE, shuffle_size=SHUFFLE_SIZE)
  # Create model
  model = tm.simple_model(IMAGE_FORMAT['height'],IMAGE_FORMAT['width'],NUM_OF_SHAPES)
  # train and test model
  tm.train_and_test(model,EPOCHS,train_dataset,test_dataset)
  return model

def conv():
  # Create the dataset
  train_dataset, test_dataset = tm.load_data(image_dir, number_of_outputs=NUM_OF_SHAPES, batch_size=BATCH_SIZE, shuffle_size=SHUFFLE_SIZE)
  # Create model
  model = tm.cnn_model(IMAGE_FORMAT['height'],IMAGE_FORMAT['width'],NUM_OF_SHAPES)
  # train and test model
  tm.train_and_test(model,EPOCHS,train_dataset,test_dataset)
  return model

def main():
  print('Start training simple network')
  simple_model = simple()
  print('Finished training simple network')
  print('Saving simple network')
  simple_model.save('shapes-model/simple_model_'+image_data+time.strftime('%Y%m%d_%H%M')+'.h5')
  tfjs.converters.save_keras_model(simple_model, 'shapes-model/simple_model_'+image_data+time.strftime('%Y%m%d_%H%M'))
  print('Saved simple network')

  print('Start training Convoluted network:')
  conv_model = conv()
  print('Finished training convoluted network')
  print('Saving convoluted network')
  conv_model.save('shapes-model/conv_model_'+image_data+time.strftime('%Y%m%d_%H%M')+'.h5')
  tfjs.converters.save_keras_model(conv_model, 'shapes-model/conv_model_'+image_data+time.strftime('%Y%m%d_%H%M'))
  print('Saved convoluted network')

if __name__ == "__main__":
  start = time.time()
  main()
  end = time.time()
  print('script ran for', end - start, 'seconds')
