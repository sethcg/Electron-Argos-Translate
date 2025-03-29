import re
import os
import argparse

from flask import Flask
from flask import request
from flask import jsonify

import argostranslate.package
import argostranslate.translate

from helpers import improve_translation_formatting
from helpers import filter_unique

from html import unescape

app = Flask(__name__)

# EXAMPLE ROUTE: "/api/install?path="C:/Users/[USER]/src/server/argosmodels/""
@app.route('/api/install')
def install():
    try:
        # PATH TO GET '.argosmodel' FILES,
        # EXAMPLE: "C:/Users/[USER]/src/server/argosmodels/"
        path = request.args.get('path', default = '', type = str)
        path = re.sub('\"|\'', '', path)

        # GET INSTALLED LANGUAGES
        languages = argostranslate.translate.get_installed_languages()

        # CHECK WHICH LANGUAGES ARE MISSING, AND INSTALL THEM
        if(languages is not None and len(languages) > 0):
            for i in range(len(languages)):
                if(("en" in languages[i].from_code ) is False):
                    argostranslate.package.install_from_path(path + "translate-en_es-1_0.argosmodel")
                if(("es" in languages[i].from_code ) is False):
                    argostranslate.package.install_from_path(path + "translate-es_en-1_9.argosmodel")
        else:
            # NO PACKAGES, INSTALL THE SPANISH AND ENGLISH MODELS, DEFAULT LOCATION IS "C:\Users\[USER]\.local"
            argostranslate.package.install_from_path(path + "translate-es_en-1_9.argosmodel")
            argostranslate.package.install_from_path(path + "translate-en_es-1_0.argosmodel")

        return "Success"
    except:
        return "Error"

# EXAMPLE ROUTE: "/api/translate?source="en"&target="es"&q="Hello, my name is Cinnamon!"
@app.route('/api/translate')
def translate():
    try:
        # GET INSTALLED LANGUAGES
        languages = argostranslate.translate.get_installed_languages()
        if languages is None or len(languages) == 0:
            return "Error: No languages are installed, try running \"/api/install before calling\" \"/api/translate\""

        q = request.args.get('q', default = None, type = str)
        target = request.args.get('target', default = None, type = str)
        source = request.args.get('source', default = None, type = str)
        num_alternatives = request.args.get('num_alternatives', default = 3, type = int)

        if(q is None or len(q) == 0):
            return "Error: No word or phrase was provided."
        
        target = re.sub('\"|\'', '', target)
        if(target is None or len(target) == 0):
            return "Error: No target language ISO code was provided."

        source = re.sub('\"|\'', '', source)
        if(source is None or len(source) == 0):
            return "Error: No source language ISO code was provided."

        try:
            target_language = list(filter(lambda lang: lang.code == target, languages))[0]
            source_language = list(filter(lambda lang: lang.code == source, languages))[0]
        except:
            return "Error: Check the source and target language to make sure they are valid ISO codes."

        try:
            translator = source_language.get_translation(target_language)
            hypotheses = translator.hypotheses(q, num_alternatives + 1)
            translated_text = unescape(improve_translation_formatting(q, hypotheses[0].value))
            alternatives = filter_unique([unescape(improve_translation_formatting(q, hypotheses[i].value)) for i in range(1, len(hypotheses))], translated_text)

            # RETURN JSON RESULTS
            result = jsonify({"translatedText": translated_text, "alternatives": alternatives})
            return result
        except:
            return "Error: Error during the translation process."
    except:
        return "Error"


def main():
    parser = argparse.ArgumentParser(description="Python Flask Server")
    parser.add_argument("--host", type = str, default = "127.0.0.1")
    parser.add_argument("--port", type = int, default = 5000)
    args = parser.parse_args()
    
    # USE DEBUG FOR DEVELOPMENT:
    # app.run(host="127.0.0.1", port = args.port)

    # USE WAITRESS FOR PRODUCTION:
    from waitress import serve
    serve(app, host = args.host, port = args.port, threads = 1)

if __name__ == "__main__":
    main()