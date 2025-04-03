import re
import argparse
from os import getpid
from flask import Flask, request, jsonify
from functions.translate import initialize_language_translator, translate

app = Flask(__name__)

# FOR PROFILING THE SERVER:
# from werkzeug.middleware.profiler import ProfilerMiddleware
# app.wsgi_app = ProfilerMiddleware(app.wsgi_app, restrictions=('server/server.py', 20), sort_by=("time", "calls"))
# app.wsgi_app = ProfilerMiddleware(app.wsgi_app, sort_by=("time", "calls"), restrictions=[20])

@app.route('/api/pid', methods=['GET'])
def getProcessID():
    # OUTPUT THE PROCESS ID (TO MANUALLY CLOSE WHEN ELECTRON CLOSES)
    # return jsonify(success = True, pid = str(getpid()))
    return str(getpid())

# SETUP THE TRANSLATOR, SO THE FIRST CALL IS NOT SUPER SLOW
@app.route('/api/setup', methods=['GET'])
def setupDefaultTranslator():
    args = request.args

    path = args.get('path', default = None, type = str)
    if(path is None or len(path) == 0):
        return jsonify({"error": "No package path provided"})

    target = re.sub('\"|\'', '', args.get('target', default = None, type = str))
    if(target is None or len(target) == 0):
        return jsonify({"error": "No target language ISO code was provided"})

    source = re.sub('\"|\'', '', args.get('source', default = None, type = str))
    if(source is None or len(source) == 0):
        return jsonify({"error": "No source language ISO code was provided"})

    initialize_language_translator(path, source, target)
    return jsonify({"success": True})

# TRANSLATE THE WORD OR PHRASE FROM SOURCE LANGUAGE TO TARGET LANGUAGE
@app.route('/api/translate', methods=['GET'])
def translateText():
    args = request.args

    path = args.get('path', default = None, type = str)
    if(path is None or len(path) == 0):
        return jsonify({"error": "No package path provided"})

    q = args.get('q', default = None, type = str)
    if(q is None or len(q) == 0):
        return jsonify({"error": "No word or phrase was provided"})

    target = re.sub('\"|\'', '', args.get('target', default = None, type = str))
    if(target is None or len(target) == 0):
        return jsonify({"error": "No target language ISO code was provided"})

    source = re.sub('\"|\'', '', args.get('source', default = None, type = str))
    if(source is None or len(source) == 0):
        return jsonify({"error": "No source language ISO code was provided"})

    num_alternatives = args.get('num_alternatives', default = 3, type = int)

    return translate(path, q, source, target, num_alternatives)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", type = str, default = "127.0.0.1")
    parser.add_argument("--port", type = int, default = 8080)
    args = parser.parse_args()

    # RUN THE FLASK SERVER:
    from waitress import serve
    serve(app, host = args.host, port = args.port, threads = 1)

if __name__ == "__main__":
    main()