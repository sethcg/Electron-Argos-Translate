import re
import argparse
from os import getpid
from flask import Flask, request, jsonify
from functions.translate import setup_cached_languages, translate

app = Flask(__name__)

# FOR PROFILING THE SERVER:
# from werkzeug.middleware.profiler import ProfilerMiddleware
# app.wsgi_app = ProfilerMiddleware(app.wsgi_app, restrictions=('server/server.py', 20), sort_by=("time", "calls"))
# app.wsgi_app = ProfilerMiddleware(app.wsgi_app, sort_by=("time", "calls"), restrictions=[20])

@app.route('/api/pid', methods=['GET'])
def getProcessID():
    # OUTPUT THE PROCESS ID (TO MANUALLY CLOSE WHEN ELECTRON CLOSES)
    return str(getpid())

# SETUP THE TRANSLATOR, SO THE FIRST CALL IS NOT SUPER SLOW
@app.route('/api/setup', methods=['GET'])
def setupDefaultTranslator():
    args = request.args

    str_package_path = args.get('languagePath', default = None, type = str)
    if(str_package_path is None or len(str_package_path) == 0):
        return jsonify({"error": "No package path provided"})
    
    str_sentencizer_path = args.get('sentencizerPath', default = None, type = str)
    if(str_sentencizer_path is None or len(str_sentencizer_path) == 0):
        return jsonify({"error": "No sentencizer path provided"})

    setup_cached_languages(str_package_path, str_sentencizer_path)
    return jsonify({"success": True})

# TRANSLATE THE WORD OR PHRASE FROM SOURCE LANGUAGE TO TARGET LANGUAGE
@app.route('/api/translate', methods=['GET'])
def translateText():
    args = request.args

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

    return translate(q, source, target, num_alternatives)

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