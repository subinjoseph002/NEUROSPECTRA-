"""
NEUROSPECTRA - Multi-Device Local Network Web Server
Serves static frontend assets & API endpoints on 0.0.0.0:3000
Allows PC, Mobile Phones, and Tablets on the same Wi-Fi network to connect.
"""

import http.server
import socketserver
import os
import sys
import json
import urllib.request
import urllib.error

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class NeurospectraHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS for all devices on local network
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        # If requesting root or empty, serve index.html
        if self.path == '/' or self.path == '':
            self.path = '/index.html'

        # Proxy /api/ to Django if running on port 8000, else fallback to db.json
        if self.path.startswith('/api/'):
            self.handle_api_proxy('GET')
            return

        super().do_GET()

    def do_POST(self):
        if self.path.startswith('/api/'):
            self.handle_api_proxy('POST')
            return
        self.send_error(404, "Not Found")

    def do_PUT(self):
        if self.path.startswith('/api/'):
            self.handle_api_proxy('PUT')
            return
        self.send_error(404, "Not Found")

    def do_PATCH(self):
        if self.path.startswith('/api/'):
            self.handle_api_proxy('PATCH')
            return
        self.send_error(404, "Not Found")

    def do_DELETE(self):
        if self.path.startswith('/api/'):
            self.handle_api_proxy('DELETE')
            return
        self.send_error(404, "Not Found")

    def handle_api_proxy(self, method):
        # Attempt to proxy to Django on 8000
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length) if content_length > 0 else None

        django_url = f"http://127.0.0.1:8000{self.path}"
        req = urllib.request.Request(django_url, data=body, method=method)
        for h, v in self.headers.items():
            if h.lower() not in ['host', 'content-length']:
                req.add_header(h, v)

        try:
            with urllib.request.urlopen(req, timeout=3) as resp:
                data = resp.read()
                self.send_response(resp.status)
                for h, v in resp.headers.items():
                    if h.lower() not in ['transfer-encoding', 'content-length']:
                        self.send_header(h, v)
                self.send_header('Content-Length', str(len(data)))
                self.end_headers()
                self.wfile.write(data)
                return
        except Exception:
            # Fallback to local db.json if Django endpoint not matched or unavailable
            self.handle_db_json_fallback(method, body)

    def handle_db_json_fallback(self, method, body):
        db_path = os.path.join(DIRECTORY, 'db.json')
        if not os.path.exists(db_path):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"status": "ok"}')
            return

        with open(db_path, 'r', encoding='utf-8') as f:
            db = json.load(f)

        if '/api/auth/users' in self.path and method == 'GET':
            data = json.dumps(db.get('users', [])).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return

        if '/api/children' in self.path and method == 'GET':
            data = json.dumps(db.get('children', [])).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return

        # Default response
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(b'{"status": "ok"}')

class ThreadingHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True

if __name__ == '__main__':
    # Bind to 0.0.0.0 so all LAN devices (phones, tablets, PCs) can connect
    server_address = ('0.0.0.0', PORT)
    httpd = ThreadingHTTPServer(server_address, NeurospectraHandler)
    print(f"========================================================")
    print(f"NEUROSPECTRA Multi-Device Server running!")
    print(f"Local PC:    http://localhost:{PORT}/")
    print(f"Mobile/LAN:  http://192.168.20.4:{PORT}/")
    print(f"========================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
