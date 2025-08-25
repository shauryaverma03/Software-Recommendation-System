from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

API_KEY = "AIzaSyAqJXj39JAabzqLXsPykvwe6q6u4KYWPb4"
if not API_KEY:
    raise ValueError("API key not found! Set GOOGLE_API_KEY as an environment variable.")

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-1.5-pro-latest')

@app.route('/answer_prompt', methods=['POST'])
def answer_prompt():
    data = request.json
    prompt = data.get("prompt", "")
    
    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400
    
    try:
        response = model.generate_content(prompt)
        return jsonify({
            "response": response.text,
            "status": "success"
        })
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)