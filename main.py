from flask import Flask, request, jsonify, send_from_directory
import time
import functions_framework

app = Flask(__name__, static_url_path='')

@functions_framework.http
def root(request):
    if request.method == 'POST':
        internal_ctx = app.test_request_context(path=request.full_path,
                                            method=request.method,
                                            json=request.json)
    else:
        internal_ctx = app.test_request_context(path=request.full_path,
                                            method=request.method)

    internal_ctx.request.data = request.data
    internal_ctx.request.headers = request.headers
    
    internal_ctx.push()
    return_value = app.full_dispatch_request()
    internal_ctx.pop()

    return return_value


@app.route('/showFurniture')
def serve_index():
    print("done")
    return send_from_directory('static', 'index.html')
