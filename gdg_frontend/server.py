from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import json

# ***changes***

import os
import warnings

# Suppress TensorFlow warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# Suppress general warnings
warnings.filterwarnings("ignore")

#***changes***

 
app = Flask(__name__)
CORS(app)

model = tf.keras.models.load_model("prediction_json.keras")

with open("ingredient_mappings.json", "r") as f:
    ingredient_mappings = json.load(f)

scaler_mean = np.load("scaler.npy")
scaler_std = np.load("scale_std.npy")

volume_conversion = {
    "1 cup": 1.0, "1/2 cup": 0.5, "1/4 cup": 0.25, "2 cups": 2.0,
    "1 teaspoon": 1/48, "1/2 teaspoon": 1/96,
    "2 tablespoons": 2/16, "1 tablespoon": 1/16
}

def preprocess_input(ingredient,volume):
    
    try:

        ingredient_encoded = ingredient_mappings.get(ingredient.lower().strip(), -1)
        if ingredient_encoded == -1:
            # Log unknown ingredient
            print(f"Unknown ingredient: {ingredient}") 
            # Log unknown ingredient 
            return None, {"error": f"Unknown ingredient: {ingredient}"}

        if volume not in volume_conversion:
             # Log unsupported volume
            print(f"Unsupported volume unit: {volume}") 
             # Log unsupported volume
            return None, {"error": f"Unsupported volume unit: {volume}"}
        volume_mL = np.array([[volume_conversion[volume]]])

        ingredient_array = np.zeros((1, len(ingredient_mappings)))
        ingredient_array[0, ingredient_encoded] = 1

        X_sample = np.hstack((ingredient_array, volume_mL))

        X_sample_scaled = (X_sample - scaler_mean) / scaler_std

        return X_sample_scaled, None

    except Exception as e:
        #  # Log any exceptions
        #  print(f"Error in preprocess_input: {str(e)}")  
        #  # Log any exceptions
        return None, {"error": f"Invalid input format: {str(e)}"}

@app.route("/predict", methods=["POST"])
def predict():
    """
    API endpoint to predict mass using the AI model.
    Expects JSON: { "ingredient": "Coconut flour", "volume": "1 cup" }
    """
    data = request.get_json()
     # Log the incoming request
    print("Received data:", data)
     # Log the incoming request 

    ingredient = data.get("ingredient", "").strip()
    volume = data.get("volume", "").strip()

    if not ingredient or not volume:
        return jsonify({"error": "Missing ingredient or volume"}), 400

    model_input, error = preprocess_input(ingredient, volume)
    if error:
        return jsonify(error), 400

    predicted_mass = model.predict(model_input)[0][0]  

    response = {
        "ingredient": ingredient,
        "volume": volume,
        "predicted_mass": f"{predicted_mass:.2f}g"
    }
    # Log the outgoing response
    print("Sending response:", response)  
    return jsonify(response)
    # Log the outgoing response

if __name__ == "__main__":
    app.run(debug=True)
