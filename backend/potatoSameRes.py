import numpy as np
import tensorflow as tf
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import uvicorn

# Load the pre-trained model
model = tf.keras.models.load_model(r"A:\PROJECTS\DiseaseDetection\TryReact\plant-app1\backend\model\Potato_model_v2.keras")

# Define the class names
class_names = ["Potato___Early_blight", "Potato___Healthy", "Potato___Late_blight"]

# Define the disease details
disease_details = {
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
    allow_origins=origins,
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
    image_array = np.array(image) / 255.0

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
        class_index = np.argmax(predictions, axis=1)[0]
        confidence = np.max(predictions[0]) * 100

        # Ensure the class index is valid
        class_name = class_names[class_index] if class_index < len(class_names) else "Unknown"

        # Fetch disease details
        disease_data = disease_details.get(class_name, {})

        # Return the prediction result
        return JSONResponse(content={
            "predicted_disease": disease_data.get('name', 'Unknown'),
            "confidence_score": confidence,
            "cause": disease_data.get('cause', 'Unknown cause.'),
            "prevention": disease_data.get('prevention', 'No prevention available.'),
            "medicines": disease_data.get('medicines', 'No medicines available.'),
        }, status_code=200)

    except Exception as e:
        # Handle errors and return appropriate response
        return JSONResponse(content={
            "error": f"An error occurred during prediction: {str(e)}"
        }, status_code=500)

# Run the application
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
