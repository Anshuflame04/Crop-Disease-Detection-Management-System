from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from PIL import Image
import numpy as np
import tensorflow as tf
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'  # Directory to save uploaded images

# Define your crop models and disease details here
crop_models = {
    'crop1': r'A:\PROJECTS\DiseaseDetection\TryReact\potato_model.keras',
    'crop2': r'A:\PROJECTS\DiseaseDetection\TryReact\potato_model.keras',
    # Add other crops and their respective model paths
}

disease_details = {
    'disease1': {
        'name': 'Disease 1',
        'cause': 'Cause of disease 1',
        'prevention': 'Prevention for disease 1',
        'medicines': 'Medicines for disease 1',
    },
    # Add other diseases
}

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify(message='This is a test response from Flask!')

@app.route('/api/upload', methods=['POST'])
def upload_image():
    selected_crop = request.form.get('crop')
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Load the model for the selected crop
        model_path = crop_models.get(selected_crop)
        if model_path:
            model = tf.keras.models.load_model(model_path)
        else:
            return jsonify({"error": "Model for the selected crop not found."}), 404

        # Preprocess the image before making predictions
        image = Image.open(file_path).resize((224, 224))
        image_array = np.array(image)
        image_array = preprocess_input(image_array)  # Ensure this function is defined
        image_array = np.expand_dims(image_array, axis=0)

        predictions = model.predict(image_array)
        class_index = np.argmax(predictions)
        class_names = list(disease_details.keys())
        class_name = class_names[class_index]
        confidence = np.max(predictions[0]) * 100

        # Fetch disease details
        disease_info = disease_details.get(class_name, {
            'name': 'Unknown',
            'cause': 'Unknown cause.',
            'prevention': 'No prevention available.',
            'medicines': 'No medicines available.'
        })

        return jsonify({
            "prediction": class_name,
            "confidence": confidence,
            "disease_info": disease_info,
            "image_file": filename
        })

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    app.run(debug=True)
