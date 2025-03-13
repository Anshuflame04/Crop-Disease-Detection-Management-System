import tensorflow as tf
import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from tensorflow.keras.applications.mobilenet_v3 import preprocess_input
import uvicorn
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load models and disease details
models = {
    'tomato': tf.keras.models.load_model(r"A:\PROJECTS\DiseaseDetection\TryReact\plant-app1\backend\model\Tomato_model_v4.keras"),
    'potato': tf.keras.models.load_model(r"A:\PROJECTS\DiseaseDetection\TryReact\plant-app1\backend\model\Potato_model_v2.keras"),
    'rice': tf.keras.models.load_model(r"A:\PROJECTS\DiseaseDetection\TryReact\plant-app1\backend\model\Rice_model_v3.keras"),
    'wheat': tf.keras.models.load_model(r"A:\PROJECTS\DiseaseDetection\TryReact\plant-app1\backend\model\Tomato_model_v4.keras"),
    'apple': tf.keras.models.load_model(r"A:\PROJECTS\DiseaseDetection\TryReact\plant-app1\backend\model\Tomato_model_v4.keras")
}

disease_details = {
    'tomato': json.load(open(r'A:\PROJECTS\DiseaseDetection\TryReact\plant-app1\backend\data\TomatoDetails.json')),
    'potato': json.load(open(r'A:\PROJECTS\DiseaseDetection\TryReact\plant-app1\backend\data\PotatoDetails.json')),
    'rice': json.load(open(r'A:\PROJECTS\DiseaseDetection\TryReact\plant-app1\backend\data\RiceDetails.json')),
    'wheat': json.load(open(r'A:\PROJECTS\DiseaseDetection\TryReact\plant-app1\backend\data\TomatoDetails.json')),
    'apple': json.load(open(r'A:\PROJECTS\DiseaseDetection\TryReact\plant-app1\backend\data\TomatoDetails.json'))
}

# Create the FastAPI application
app = FastAPI()

# Enable CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the image preprocessing function
def preprocess_image(image: Image.Image):
    if image.mode != "RGB":
        image = image.convert("RGB")
    image = image.resize((224, 224))
    image_array = np.array(image)
    image_array = preprocess_input(image_array)
    image_array = np.expand_dims(image_array, axis=0)
    return image_array

# Predict endpoint
@app.post("/predict/{crop_name}")
async def predict(crop_name: str, file: UploadFile = File(...)):
    if crop_name not in models:
        logger.warning("Invalid crop name: %s", crop_name)
        return JSONResponse(content={"error": "Invalid crop name."}, status_code=400)

    try:
        logger.info("Received request for crop: %s", crop_name)
        model = models[crop_name]
        disease_dict = disease_details[crop_name]

        image = Image.open(file.file)
        preprocessed_image = preprocess_image(image)

        predictions = model.predict(preprocessed_image)
        logger.info("Model predictions: %s", predictions)

        class_index = np.argmax(predictions)
        confidence = np.max(predictions[0]) * 100

        class_names = list(disease_dict.keys())
        class_name = class_names[class_index]

        disease_info = disease_dict.get(class_name, {
            'name': 'Unknown',
            'cause': 'Unknown cause.',
            'prevention': 'No prevention available.',
            'medicines': 'No medicines available.',
            "organic_pesticides": 'No Pesticides available.',
            "natural_fertilizers": 'No Fertilizers available.',
        })

        return JSONResponse(content={
            "predicted_disease": disease_info.get('name'),
            "confidence_score": confidence,
            "cause": disease_info.get('cause'),
            "prevention": disease_info.get('prevention'),
            "medicines": disease_info.get('medicines'),
            "organic_pesticides": disease_info.get('organic_pesticides'),
            "natural_fertilizers": disease_info.get('natural_fertilizers'),
        }, status_code=200)

    except Exception as e:
        logger.error("An error occurred during prediction: %s", str(e))
        return JSONResponse(content={
            "error": f"An error occurred during prediction: {str(e)}"
        }, status_code=500)

# Run the application
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
