import tensorflow as tf
import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from tensorflow.keras.applications.mobilenet_v3 import preprocess_input
import uvicorn
import json

# Load your trained Keras model
model = tf.keras.models.load_model(r"A:\PROJECTS\DiseaseDetection\TryReact\plant-app1\backend\model\Tomato_model_v4.keras")

# Load disease details from JSON file
with open(r'A:\PROJECTS\DiseaseDetection\TryReact\plant-app1\backend\data\TomatoDetails.json', 'r') as f:
    disease_dict = json.load(f)

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
    """Preprocess the image to fit the model input."""
    # Convert image to RGB if it isn't already
    if image.mode != "RGB":
        image = image.convert("RGB")
    
    # Resize the image to the model's input shape
    image = image.resize((224, 224))

    # Convert the image to a NumPy array and normalize it
    image_array = np.array(image)
    image_array = preprocess_input(image_array)

    # Add batch dimension
    image_array = np.expand_dims(image_array, axis=0)

    return image_array

# Predict endpoint
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Load the image using PIL
        image = Image.open(file.file)
        
        # Preprocess the image
        preprocessed_image = preprocess_image(image)
        
        # Perform prediction
        predictions = model.predict(preprocessed_image)

        # Find the class index with the highest probability
        class_index = np.argmax(predictions)
        confidence = np.max(predictions[0]) * 100

        # Ensure the class index is valid
        class_names = list(disease_dict.keys())
        class_name = class_names[class_index]

        # Fetch disease details
        disease_info = disease_dict.get(class_name, {
            'name': 'Unknown',
            'cause': 'Unknown cause.',
            'prevention': 'No prevention available.',
            'medicines': 'No medicines available.'
        })

        # Return the prediction result
        return JSONResponse(content={
            "predicted_disease": disease_info.get('name'),
            "confidence_score": confidence,
            "cause": disease_info.get('cause'),
            "prevention": disease_info.get('prevention'),
            "medicines": disease_info.get('medicines'),
        }, status_code=200)

    except Exception as e:
        # Handle errors and return appropriate response
        return JSONResponse(content={
            "error": f"An error occurred during prediction: {str(e)}"
        }, status_code=500)

# Run the application
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)