from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Greetings file path
GREETINGS_FILE = 'greetings.json'

# Initialize greetings file if it doesn't exist
if not os.path.exists(GREETINGS_FILE):
    with open(GREETINGS_FILE, 'w', encoding='utf-8') as f:
        json.dump([], f, ensure_ascii=False, indent=2)

@app.route('/api/greetings', methods=['GET'])
def get_greetings():
    try:
        with open(GREETINGS_FILE, 'r', encoding='utf-8') as f:
            greetings = json.load(f)
        return jsonify(greetings)
    except Exception as e:
        return jsonify({'error': 'Failed to read greetings'}), 500

@app.route('/api/greetings', methods=['POST'])
def save_greeting():
    try:
        data = request.get_json()
        name = data.get('name', '').strip()
        message = data.get('message', '').strip()
        
        if not name or not message:
            return jsonify({'error': 'Name and message are required'}), 400

        # Read existing greetings
        with open(GREETINGS_FILE, 'r', encoding='utf-8') as f:
            greetings = json.load(f)
        
        # Create new greeting
        new_greeting = {
            'id': int(datetime.now().timestamp()),
            'name': name,
            'message': message,
            'timestamp': datetime.now().isoformat()
        }

        # Add to beginning
        greetings.insert(0, new_greeting)
        
        # Keep only last 50 greetings
        if len(greetings) > 50:
            greetings = greetings[:50]

        # Save to file
        with open(GREETINGS_FILE, 'w', encoding='utf-8') as f:
            json.dump(greetings, f, ensure_ascii=False, indent=2)
        
        return jsonify({'success': True, 'greeting': new_greeting})
    except Exception as e:
        print(f'Error saving greeting: {e}')
        return jsonify({'error': 'Failed to save greeting'}), 500

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

if __name__ == '__main__':
    print(f"Server running at http://localhost:5000")
    print(f"Greetings will be saved to: {GREETINGS_FILE}")
    app.run(host='0.0.0.0', port=5000, debug=True)
