import tensorflow as tf

def train(model,train_dataset,EPOCHS):
  # setup log file for tensorboard
  logdir = '/tmp/tflog'
  writer = tf.contrib.summary.create_file_writer(logdir)
  global_step=tf.train.get_or_create_global_step()  # return global step var
  writer.set_as_default()
  # train model
  for epoch in range(EPOCHS):
    for images, labels in train_dataset:
      global_step.assign_add(1)
      with tf.contrib.summary.record_summaries_every_n_global_steps(10):
        train_loss, train_accuracy = model.train_on_batch(images, labels)
        tf.contrib.summary.scalar('loss', train_loss)
        tf.contrib.summary.scalar('train_accuracy', train_accuracy)

    # Here you can gather any metrics or adjust your training parameters
    print('Epoch #%d\t Loss: %.6f\tAccuracy: %.6f' % (epoch + 1, train_loss, train_accuracy))

    if(train_loss<0.00001):
      # enough training, early stop
      break

def test(model,test_dataset):
  # test model
  for images, labels in test_dataset:
    loss, accuracy = model.test_on_batch(images, labels)
    print('Test Loss: %.6f\tTest Accuracy: %.6f' % (loss, accuracy))

def train_and_test(model,EPOCHS,train_dataset,test_dataset):
  train(model,train_dataset,EPOCHS)
  test(model,test_dataset)