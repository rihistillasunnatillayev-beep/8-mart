import http.server
import socketserver
import json
import os
from urllib.parse import parse_qs
from datetime import datetime

PORT = 8000
GREETINGS_FILE = 'greetings.json'

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()
    
    def do_GET(self):
        if self.path == '/api/greetings':
            try:
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                
                if os.path.exists(GREETINGS_FILE):
                    with open(GREETINGS_FILE, 'r', encoding='utf-8') as f:
                        greetings = f.read()
                    self.wfile.write(greetings.encode())
                else:
                    self.wfile.write('[]'.encode())
            except Exception as e:
                print(f"GET error: {e}")
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                error_response = json.dumps({'error': str(e)})
                self.wfile.write(error_response.encode())
        else:
            super().do_GET()
    
    def do_POST(self):
        if self.path == '/api/greetings':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                
                print(f"Received POST data: {post_data}")
                
                data = json.loads(post_data.decode('utf-8'))
                name = data.get('name', '').strip()
                message = data.get('message', '').strip()
                
                print(f"Parsed data: name='{name}', message='{message}'")
                
                if not name or not message:
                    print("Missing name or message")
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(b'{"error": "Name and message required"}')
                    return
                
                # Load existing greetings
                greetings = []
                if os.path.exists(GREETINGS_FILE):
                    try:
                        with open(GREETINGS_FILE, 'r', encoding='utf-8') as f:
                            greetings = json.load(f)
                    except json.JSONDecodeError as e:
                        print(f"JSON decode error: {e}")
                        greetings = []
                
                # Add new greeting
                new_greeting = {
                    'id': int(datetime.now().timestamp()),
                    'name': name,
                    'message': message,
                    'timestamp': datetime.now().isoformat()
                }
                
                greetings.insert(0, new_greeting)
                
                # Keep only last 50
                if len(greetings) > 50:
                    greetings = greetings[:50]
                
                # Save to file
                with open(GREETINGS_FILE, 'w', encoding='utf-8') as f:
                    json.dump(greetings, f, ensure_ascii=False, indent=2)
                
                print(f"Saved greetings: {len(greetings)} total")
                
                # Send response
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = json.dumps({'success': True, 'greeting': new_greeting})
                self.wfile.write(response.encode())
                
            except Exception as e:
                print(f"POST error: {e}")
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                error_response = json.dumps({'error': str(e)})
                self.wfile.write(error_response.encode())
        else:
            super().do_POST()

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"Server running at http://localhost:{PORT}")
    print(f"Greetings saved to: {GREETINGS_FILE}")
    httpd.serve_forever()
