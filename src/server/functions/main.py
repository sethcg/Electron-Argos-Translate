from html import unescape
from flask import jsonify
from argostranslate.translate import get_installed_languages

from functions.helpers import filter_unique, improve_translation_formatting

def translate(q: str, source: str, target: str, num_alternatives: int):
    installed_languages = get_installed_languages()
    
    try:
        # GET THE TARGET AND SOURCE LANGUAGE
        source_language = list(filter(lambda lang: lang.code == source, installed_languages))[0]
        target_language = list(filter(lambda lang: lang.code == target, installed_languages))[0]

        translator = source_language.get_translation(target_language)
        hypotheses = translator.hypotheses(q, num_alternatives + 1)
        translated_text = unescape(improve_translation_formatting(q, hypotheses[0].value))
        alternatives = filter_unique([unescape(improve_translation_formatting(q, hypotheses[i].value)) for i in range(1, len(hypotheses))], translated_text)

        return jsonify({"text": translated_text, "alternatives": alternatives})
    except:
        return jsonify({"error": "Error during the translation process"})