import tensorflow as tf
tf.enable_eager_execution()
import training_shapes_module as tm

model_location = '/shapes-model/conv_model_convex_polygon_inscribed_in_ellipse20180626_1549.h5'
model = tf.keras.models.load_model(model_location)

image_path='/shapes-data/convex_polygon_inscribed_in_ellipse/3-gon/3-gon-0-13.736-13.736-8.936-8.936-17.408-17.408.jpg'

test_dataset = tm.load_one_data(image_path, number_of_outputs=7, flatten=False)

for images, labels in test_dataset:
  prediction = model.predict_on_batch(images)
  print(prediction,labels)
