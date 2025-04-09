from html import unescape
from typing import List
from flask import jsonify
from functions import helpers
from functions import package
from functions.languages import *

class InstalledTranslate:
    package_key: str
    cached_translation: CachedTranslation

def get_installed_languages(str_package_path: str, str_sentencizer_path: str) -> list[Language]:
    # GET LOCALLY INSTALLED LANGUAGE PACKAGES
    packages: list[package.Package] = package.get_installed_packages(str_package_path)
    installed_translates: list[InstalledTranslate] = []

    # GET LOCALLY INSTALLED SPACY SENTENCIZER
    sentencizer_path = Path(str_sentencizer_path)
    sentencizer: ISentenceBoundaryDetectionModel = SpacySentencizerSmall(sentencizer_path)

    # Load languages and translations from packages
    language_of_code = dict()
    for pkg in packages:
        if pkg.from_code not in language_of_code:
            language_of_code[pkg.from_code] = Language(pkg.from_code, pkg.from_name)
        if pkg.to_code not in language_of_code:
            language_of_code[pkg.to_code] = Language(pkg.to_code, pkg.to_name)
        from_lang = language_of_code[pkg.from_code]
        to_lang = language_of_code[pkg.to_code]

        package_key = f"{pkg.from_code}-{pkg.to_code}"
        contain = list(filter(lambda x: x.package_key == package_key, installed_translates))
        translation_to_add: CachedTranslation
        if len(contain) == 0:
            translation_to_add = CachedTranslation(PackageTranslation(from_lang, to_lang, pkg, sentencizer))
            saved_cache = InstalledTranslate()
            saved_cache.package_key = package_key
            saved_cache.cached_translation = translation_to_add
            installed_translates.append(saved_cache)
        else:
            translation_to_add = contain[0].cached_translation

        from_lang.translations_from.append(translation_to_add)
        to_lang.translations_to.append(translation_to_add)

    languages = list(language_of_code.values())

    # Add translations so everything can translate to itself
    for language in languages:
        identity_translation = IdentityTranslation(language)
        language.translations_from.append(identity_translation)
        language.translations_to.append(identity_translation)

    # Pivot through intermediate languages to add translations that don't already exist
    for language in languages:
        keep_adding_translations = True
        while keep_adding_translations:
            keep_adding_translations = False
            for translation in language.translations_from:
                for translation_2 in translation.to_lang.translations_from:
                    if language.get_translation(translation_2.to_lang) is None:
                        # The language currently doesn't have a way to translate to this language
                        keep_adding_translations = True
                        composite_translation = CompositeTranslation(translation, translation_2)
                        language.translations_from.append(composite_translation)
                        translation_2.to_lang.translations_to.append(composite_translation)
    return languages

def setup_cached_languages(str_package_path: str, str_sentencizer_path: str):
    # GET THE INSTALLED PACKAGES, SETTING THE CACHE FOR FASTER TRANSLATE TIMES
    str_sentencizer_path = str_sentencizer_path
    str_package_path = str_package_path
    global installed_languages 
    installed_languages = get_installed_languages(str_package_path, str_sentencizer_path)

def translate(q: str, source: str, target: str, num_alternatives: int):
    try:
        # GET THE TARGET AND SOURCE LANGUAGE
        source_language = list(filter(lambda lang: lang.code == source, installed_languages))[0]
        target_language = list(filter(lambda lang: lang.code == target, installed_languages))[0]

        translator = source_language.get_translation(target_language)
        hypotheses = helpers.avoid_returning_original(q, translator.hypotheses(q, num_alternatives + 1)) 
        translated_text = unescape(helpers.improve_translation_formatting(q, hypotheses[0].value))
        alternatives = helpers.filter_unique([unescape(helpers.improve_translation_formatting(q, hypotheses[i].value)) for i in range(1, len(hypotheses))], translated_text)

        return jsonify({"text": translated_text, "alternatives": alternatives})
    except:
        return jsonify({"error": "Error during the translation process"})