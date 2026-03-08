import http.server
import socketserver
import json
import os
from urllib.parse import parse_qs
from datetime import datetime

PORT = 8000
GREETINGS_FILE = 'greetings.json'

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    
    def do_GET(self):
        if self.path == '/api/greetings':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            if os.path.exists(GREETINGS_FILE):
                with open(GREETINGS_FILE, 'r', encoding='utf-8') as f:
                    greetings = f.read()
                self.wfile.write(greetings.encode())
            else:
                self.wfile.write('[]'.encode())
        else:
            super().do_GET()
    
    def do_POST(self):
        if self.path == '/api/greetings':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                name = data.get('name', '').strip()
                message = data.get('message', '').strip()
                
                if not name or not message:
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(b'{"error": "Name and message required"}')
                    return
                
                # Load existing greetings
                greetings = []
                if os.path.exists(GREETINGS_FILE):
                    with open(GREETINGS_FILE, 'r', encoding='utf-8') as f:
                        greetings = json.load(f)
                
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
                
                # Send response
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                response = json.dumps({'success': True, 'greeting': new_greeting})
                self.wfile.write(response.encode())
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                error_response = json.dumps({'error': str(e)})
                self.wfile.write(error_response.encode())
        else:
            super().do_POST()

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"Server running at http://localhost:{PORT}")
    print(f"Greetings saved to: {GREETINGS_FILE}")
    httpd.serve_forever()
