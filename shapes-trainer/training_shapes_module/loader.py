from __future__ import absolute_import, division, print_function

import tensorflow as tf
import numpy as np
import os
import zipfile

def _parse_flat(filename, label):
  image_string = tf.read_file(filename)
  image_decoded = tf.image.decode_jpeg(image_string, channels=1) # the image gets decoded in the shape of height,width,channels
  image_reshaped = tf.reshape(image_decoded, (-1,)) # flatten the tensor
  image_casted = tf.cast(image_reshaped, tf.float32) # Convert the array to float32 as opposed to uint8
  image_casted /= 255 # Convert the pixel values from integers between 0 and 255 to floats between 0 and 1
  return image_casted, label

def _parse(filename, label):
  image_string = tf.read_file(filename)
  image_decoded = tf.image.decode_jpeg(image_string, channels=1) # the image gets decoded in the shape of height,width,channels
  image_casted = tf.cast(image_decoded, tf.float32) # Convert the array to float32 as opposed to uint8
  image_casted /= 255 # Convert the pixel values from integers between 0 and 255 to floats between 0 and 1
  return image_casted, label

def load_data(image_dir, number_of_outputs=None, flatten=None, batch_size=None, shuffle_size=None, percent_of_test_examples=None):
  subdirs = [x[1] for x in os.walk(image_dir)][0]
  label_enums = []
  trainFileList = []
  trainLabelList = []
  testFileList = []
  testLabelList = []
  if(percent_of_test_examples is None):
    percent_of_test_examples = 0.1

  for subdir in subdirs:
    files = os.listdir(image_dir+"/"+subdir)
    files = [image_dir+"/"+subdir+'/'+f for f in files]
    if(subdir not in label_enums):
      label_enums.append(subdir)

    number_of_test_examples = int(percent_of_test_examples * len(files))

    trainFiles = files[number_of_test_examples:]
    trainFileList.extend(trainFiles)
    trainLabelList.extend([label_enums.index(subdir)]*len(trainFiles))

    testFiles = files[:number_of_test_examples]
    testFileList.extend(testFiles)
    testLabelList.extend([label_enums.index(subdir)]*len(testFiles))

  trainFileList = tf.constant(trainFileList)
  trainLabelList = tf.keras.utils.to_categorical(trainLabelList, number_of_outputs) # The format of the labels
  trainLabelList = trainLabelList.astype(np.float32) # Cast the labels to floats
  train_dataset = tf.data.Dataset.from_tensor_slices((trainFileList, trainLabelList))
  
  testFileList = tf.constant(testFileList)
  testLabelList = tf.keras.utils.to_categorical(testLabelList, number_of_outputs) # The format of the labels
  testLabelList = testLabelList.astype(np.float32) # Cast the labels to floats
  test_dataset = tf.data.Dataset.from_tensor_slices((testFileList, testLabelList))

  if(flatten is None):
    train_dataset = train_dataset.map(_parse)
    test_dataset = test_dataset.map(_parse)
  elif(flatten):
    train_dataset = train_dataset.map(_parse_flat)
    test_dataset = test_dataset.map(_parse_flat)
  else:
    train_dataset = train_dataset.map(_parse)
    test_dataset = test_dataset.map(_parse)

  # shuffle
  if(shuffle_size is not None):
    train_dataset = train_dataset.shuffle(shuffle_size)
  # create batch
  if(batch_size is not None):
    train_dataset = train_dataset.batch(batch_size)
  else:
    train_dataset = train_dataset.batch()
  test_dataset = test_dataset.batch(len(testLabelList))
  return train_dataset, test_dataset

def load_one_data(image_dir, number_of_outputs=None, flatten=None):
  image_set_dir = image_dir[:image_dir.rindex('/')]
  image_set_dir = image_set_dir[:image_set_dir.rindex('/')]
  subdirs = [x[1] for x in os.walk(image_set_dir)][0]
  label_enums = []
  testFileList = []
  testLabelList = []
  for subdir in subdirs:
    if(subdir not in label_enums):
      label_enums.append(subdir)
  label = os.path.split(os.path.dirname(image_dir))[-1]
  testFileList = tf.constant([image_dir])
  testLabelList = tf.keras.utils.to_categorical([label_enums.index(label)], number_of_outputs) # The format of the labels
  testLabelList = testLabelList.astype(np.float32) # Cast the labels to floats
  test_dataset = tf.data.Dataset.from_tensor_slices((testFileList, testLabelList))
  test_dataset = test_dataset.map(_parse)
  test_dataset = test_dataset.batch(1)

  return test_dataset

def prepare_data(image_dir):
  # look for .zip files and unzip them
  # returns number labels (folders) in the image_dir
  subdirs = [x[1] for x in os.walk(image_dir)][0]
  files = [x[2] for x in os.walk(image_dir)][0]
  zip_files = list(filter(lambda file: file.endswith('.zip'), files))

  dirs = set(subdirs)
  for zip_file in zip_files:
    if not zip_file[:-4] in dirs:
      _unzip(zip_file,image_dir)
    else:
      print('found ' + zip_file + ' already unzipped')

  labels = [x[1] for x in os.walk(image_dir)][0]
  print('labels:', labels)
  return labels

def _unzip(source,image_dir):
  print('unzipping ' + source)
  with zipfile.ZipFile(image_dir+"/"+source,"r") as zip_ref:
    zip_ref.extractall(image_dir+"/"+source[:-4])
  return True
