from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import util
import os

app = Flask(__name__, static_folder='.')
CORS(app)

@app.route('/')
def home():
    return send_from_directory(app.static_folder, 'app.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)

@app.route('/get_location_names')
def get_location_names():
    try:
        locations = util.get_location_names()
        return jsonify({'location': locations})
    except Exception as e:
        print(f"Error in get_location_names: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/predict_home_price', methods=['POST'])
def predict_home_price():
    try:
        data = request.form
        total_sqft = float(data.get('total_sqft', 0))
        location = data.get('location', '')
        bhk = int(data.get('bhk', 0))
        bath = int(data.get('bath', 0))

        print(f"Received request - sqft: {total_sqft}, location: {location}, bhk: {bhk}, bath: {bath}")
        
        if not all([total_sqft, location, bhk, bath]):
            return jsonify({'error': 'Missing required fields'}), 400

        estimated_price = util.get_estimated_price(location, total_sqft, bhk, bath)
        if estimated_price is not None:
            return jsonify({'estimated_price': estimated_price})
        else:
            return jsonify({'error': 'Could not estimate price'}), 400

    except Exception as e:
        print(f"Error in predict_home_price: {str(e)}")
        return jsonify({'error': str(e)}), 400

if __name__ == "__main__":
    print("Loading saved artifacts...")
    util.load_saved()
    print("Starting Flask server...")
    app.run(port=5000, debug=True)