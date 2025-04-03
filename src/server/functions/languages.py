from argostranslate import settings, translate
from functions import package

def get_installed_languages(str_path: str) -> list[translate.Language]:
    # GET LOCALLY INSTALLED LANGUAGE PACKAGES
    packages = package.get_installed_packages(str_path)

    # If stanza not available filter for sbd available
    if not settings.stanza_available:
        sbd_packages = list(filter(lambda x: x.type == "sbd", packages))
        sbd_available_codes = set()
        for sbd_package in sbd_packages:
            sbd_available_codes = sbd_available_codes.union(sbd_package.from_codes)
        packages = list(filter(lambda x: x.from_code in sbd_available_codes, packages))

    # Filter for translate packages
    packages = list(filter(lambda x: x.type == "translate", packages))

    # Load languages and translations from packages
    language_of_code = dict()
    for pkg in packages:
        if pkg.from_code not in language_of_code:
            language_of_code[pkg.from_code] = translate.Language(pkg.from_code, pkg.from_name)
        if pkg.to_code not in language_of_code:
            language_of_code[pkg.to_code] = translate.Language(pkg.to_code, pkg.to_name)
        from_lang = language_of_code[pkg.from_code]
        to_lang = language_of_code[pkg.to_code]

        package_key = f"{pkg.from_code}-{pkg.to_code}"
        contain = list(
            filter(lambda x: x.package_key == package_key, translate.installed_translates)
        )
        translation_to_add: translate.CachedTranslation
        if len(contain) == 0:
            translation_to_add = translate.CachedTranslation(
                translate.PackageTranslation(from_lang, to_lang, pkg)
            )
            saved_cache = translate.InstalledTranslate()
            saved_cache.package_key = package_key
            saved_cache.cached_translation = translation_to_add
            translate.installed_translates.append(saved_cache)
        else:
            translation_to_add = contain[0].cached_translation

        from_lang.translations_from.append(translation_to_add)
        to_lang.translations_to.append(translation_to_add)

    languages = list(language_of_code.values())

    # Add translations so everything can translate to itself
    for language in languages:
        identity_translation = translate.IdentityTranslation(language)
        language.translations_from.append(identity_translation)
        language.translations_to.append(identity_translation)

    # Pivot through intermediate languages to add translations
    # that don't already exist
    for language in languages:
        keep_adding_translations = True
        while keep_adding_translations:
            keep_adding_translations = False
            for translation in language.translations_from:
                for translation_2 in translation.to_lang.translations_from:
                    if language.get_translation(translation_2.to_lang) is None:
                        # The language currently doesn't have a way to translate
                        # to this language
                        keep_adding_translations = True
                        composite_translation = translate.CompositeTranslation(
                            translation, translation_2
                        )
                        language.translations_from.append(composite_translation)
                        translation_2.to_lang.translations_to.append(
                            composite_translation
                        )

    # Put English first if available so it shows up as the from language in the gui
    en_index = None
    for i, language in enumerate(languages):
        if language.code == "en":
            en_index = i
            break
    english = None
    if en_index is not None:
        english = languages.pop(en_index)
    languages.sort(key=lambda x: x.name)
    if english is not None:
        languages = [english] + languages

    return languages