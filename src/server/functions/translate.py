from html import unescape
from flask import jsonify
from functions.helpers import avoid_returning_original, filter_unique, improve_translation_formatting
from functions.languages import get_installed_languages

def translate(str_path: str, q: str, source: str, target: str, num_alternatives: int):
    # GET THE INSTALLED PACKAGES, USING THE PROVIDED PATH
    if(str_path is None or len(str_path) < 0):
        return jsonify({"error": "No language packages installed"})
    
    installed_languages = get_installed_languages(str_path)
    try:
        # GET THE TARGET AND SOURCE LANGUAGE
        source_language = list(filter(lambda lang: lang.code == source, installed_languages))[0]
        target_language = list(filter(lambda lang: lang.code == target, installed_languages))[0]

        translator = source_language.get_translation(target_language)
        hypotheses = avoid_returning_original(q, translator.hypotheses(q, num_alternatives + 1)) 
        translated_text = unescape(improve_translation_formatting(q, hypotheses[0].value))
        alternatives = filter_unique([unescape(improve_translation_formatting(q, hypotheses[i].value)) for i in range(1, len(hypotheses))], translated_text)

        return jsonify({"text": translated_text, "alternatives": alternatives})
    except:
        return jsonify({"error": "Error during the translation process"})
    
def initialize_language_translator(str_path: str, source_code: str, target_code: str):
    if(str_path is not None and len(str_path) > 0):
        # GET THE INSTALLED PACKAGES, USING THE PROVIDED PATH
        installed_languages = get_installed_languages(str_path)

        # AFTER INSTALLING, INITIALIZE THE DEFAULT TRANSLATOR (ENGLISH AND SPANISH);
        # OTHERWISE THE FIRST CALL TO TRANSLATE IS 1 SECOND LONG
        source_language = list(filter(lambda lang: lang.code == source_code, installed_languages))[0]
        target_language = list(filter(lambda lang: lang.code == target_code, installed_languages))[0]
        translator = source_language.get_translation(target_language)
        translator.hypotheses('.', 1)