import re
import argparse
from os import getpid
from flask import Flask, request, jsonify
from argostranslate.translate import get_installed_languages

from functions.install import check_and_install_language_models, initialize_default_language_translator
from functions.main import translate

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

@app.route('/api/setup', methods=['GET'])
def setupDefaultTranslator():
    args = request.args

    source = re.sub('\"|\'', '', args.get('source', default = 'en', type = str))
    target = re.sub('\"|\'', '', args.get('target', default = 'es', type = str))

    # GET AVAILABLE LANGUAGES, AND INSTALL IF NECESSARY
    check_and_install_language_models(['en', 'es'])
    initialize_default_language_translator(source, target)
    return jsonify({"success": True})

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