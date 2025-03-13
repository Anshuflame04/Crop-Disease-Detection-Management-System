import tensorflow as tf

# Load your .keras model
model = tf.keras.models.load_model(r"A:\PROJECTS\DiseaseDetection\TryReact\plant-app1\backend\model\Potato_model_v2.keras")

# Create a TFLiteConverter object from the Keras model
converter = tf.lite.TFLiteConverter.from_keras_model(model)

# Convert the model to TensorFlow Lite format
tflite_model = converter.convert()

# Save the TensorFlow Lite model to a .tflite file
with open("potato_model.tflite", "wb") as f:
    f.write(tflite_model)

print("Model converted to TensorFlow Lite format and saved as 'potato_model.tflite'.")
