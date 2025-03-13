import tensorflow as tf
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import numpy as np
from PIL import Image
from tensorflow.keras.applications.mobilenet_v3 import preprocess_input
# Load your trained Keras model
model = tf.keras.models.load_model(r"A:\PROJECTS\DiseaseDetection\TryReact\plant-app1\backend\model\Potato_model_v2.keras")  # Replace with your model path

disease_dict = {
    'Potato___Early_blight': {
        'name': 'Potato Early Blight',
        'cause': 'Fungal disease caused by Alternaria solani.',
        'prevention': 'Use resistant varieties, remove infected plants, and apply fungicides.',
        'medicines': 'Chlorothalonil, Mancozeb.'
    },
    'Potato___Healthy': {
        'name': 'Healthy Potato',
        'cause': 'No disease.',
        'prevention': 'N/A',
        'medicines': 'N/A'
    },
    'Potato___Late_blight': {
        'name': 'Potato Late Blight',
        'cause': 'Fungal disease caused by Phytophthora infestans.',
        'prevention': 'Use resistant varieties, manage moisture, and apply fungicides.',
        'medicines': 'Metalaxyl, Mancozeb.'
    }
}


image_path = r"A:\PROJECTS\DiseaseDetection\DSPotato\Potato___Late_blight\0c2628d4-8d64-48a9-a157-19a9c902e304___RS_LB 4590.JPG"  # Replace with the path to your image
image = Image.open(image_path).resize((224, 224))
image_array = np.array(image)
image_array = preprocess_input(image_array)
image_array = np.expand_dims(image_array, axis=0)
            
predictions = model.predict(image_array)
print(f"Predictions: {predictions}")
class_index = np.argmax(predictions)
print(f"Index: {class_index}")
class_names = list(disease_dict.keys())
print(f"class_names: {class_names}")
class_name = class_names[class_index]
confidence = np.max(predictions[0]) * 100

print(f"Predicted class: {class_name}")
print(f"Confidence Score: {confidence}")

disease_info = disease_dict.get(class_name, {
                'name': 'Unknown',
                'cause': 'Unknown cause.',
                'prevention': 'No prevention available.',
                'medicines': 'No medicines available.'})
print(disease_info)