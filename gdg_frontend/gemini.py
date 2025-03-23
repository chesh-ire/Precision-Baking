from flask import Flask, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv
import os
from flask_cors import CORS
import logging
# Load environment variables from .env file
load_dotenv("gemini.env")

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Configure Gemini API
gemini_api_key = os.getenv("GEMINI_API_KEY")

# # List available models
# for model in genai.list_models():
#     print(model.name)
# #List available models

# Test the API
try:
    model = genai.GenerativeModel('gemini-1.5-pro-latest')
    response = model.generate_content("Hello, Gemini!")
    print(response.text)
except Exception as e:
    print(f"Error: {e}")
#test the API

if not gemini_api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file")

genai.configure(api_key=gemini_api_key)

# Initialize the Gemini model
gemini_model = genai.GenerativeModel('gemini-1.5-pro-latest')

@app.route("/generate-recipe", methods=["POST"])
def generate_recipe():
    """
    API endpoint to generate a recipe using Gemini API.
    Expects JSON: { "dish": "Pasta" }
    """
    data = request.get_json()
    dish = data.get("dish", "").strip()

    if not dish:
        return jsonify({"error": "Missing dish name"}), 400

    try:
        # Generate recipe using Gemini API
        # Generate recipe using Gemini API with a structured prompt
        prompt = (
            f"Generate a detailed recipe for {dish}. "
            "Format the response as follows:\n\n"
            "## Recipe Title\n"
            "### Ingredients\n"
            "- Ingredient 1\n"
            "- Ingredient 2\n"
            "...\n"
            "### Instructions\n"
            "1. Step 1\n"
            "2. Step 2\n"
            "..."
        )
        
        # response = gemini_model.generate_content(f"Generate a detailed recipe for {dish}")
        # return jsonify({"recipe": response.text})
        response = gemini_model.generate_content(prompt)
        recipe_text = response.text
    # # **to fetch the image
    # # Fetch a related image for the dish using Gemini API
    #     image_prompt = f"Generate an image URL for {dish} dish"
    #     image_response = gemini_model.generate_content(image_prompt)
    #     image_url = image_response.text  
       
        # print("Generated Image URL:", image_url)
        return jsonify({
            "recipe": recipe_text
            
        })
    #** to fecth the image
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)