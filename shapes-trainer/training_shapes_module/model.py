import tensorflow as tf

def simple_model(height,width,number_of_outputs):
  optimizer = tf.train.RMSPropOptimizer(learning_rate=0.001)
  model = tf.keras.Sequential([
    tf.keras.layers.Dense(512, activation=tf.nn.relu, input_shape=(height*width,), name="Dense"),
    tf.keras.layers.Dense(number_of_outputs, activation=tf.nn.softmax, name="Logit")
  ])
  model.compile(loss='categorical_crossentropy',
                optimizer=optimizer,
                metrics=['accuracy'])
  model.summary()
  return model

def cnn_model(height,width,number_of_outputs):
  optimizer = tf.train.RMSPropOptimizer(learning_rate=0.001)
  model = tf.keras.Sequential([
    tf.keras.layers.Conv2D(filters=32, kernel_size=(3, 3), activation=tf.nn.relu, input_shape=(height, width, 1), name="Conv2D_1"),
    tf.keras.layers.MaxPooling2D(pool_size=(2, 2), strides=2, name="Pool2D_1"),
    tf.keras.layers.Conv2D(filters=64, kernel_size=(3, 3), activation=tf.nn.relu, name="Conv2D_2"),
    tf.keras.layers.MaxPooling2D(pool_size=(2, 2), strides=2, name="Pool2D_2"),
    tf.keras.layers.Conv2D(filters=64, kernel_size=(3, 3), activation=tf.nn.relu, name="Conv2D_3"),
    tf.keras.layers.Flatten(name="Flat"),
    tf.keras.layers.Dense(64, activation=tf.nn.relu, name="Dense_1"),
    tf.keras.layers.Dense(number_of_outputs, activation=tf.nn.softmax, name="Logit_1")
  ])
  model.compile(loss='categorical_crossentropy',
                optimizer=optimizer,
                metrics=['accuracy'])
  model.summary()
  return model