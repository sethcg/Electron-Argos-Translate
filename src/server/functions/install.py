from argostranslate.settings import local_package_index
from argostranslate.package import get_installed_packages, get_available_packages, update_package_index
from argostranslate.translate import get_installed_languages

def initialize_default_language_translator(source_code: str, target_code: str):
    installed_languages = get_installed_languages()

    # AFTER INSTALLING, INITIALIZE THE DEFAULT TRANSLATOR (ENGLISH AND SPANISH);
    # OTHERWISE THE FIRST CALL TO TRANSLATE IS 1 SECOND LONG
    source_language = list(filter(lambda lang: lang.code == source_code, installed_languages))[0]
    target_language = list(filter(lambda lang: lang.code == target_code, installed_languages))[0]
    translator = source_language.get_translation(target_language)
    translator.hypotheses('.', 1)

def check_and_install_language_models(load_only_lang_codes: list[str] = None, force: bool = False):
    installed_packages = get_installed_packages()
    
    if len(installed_packages) < 2 or force:
        # GET PACKAGE INDEX, IF NOT ALREADY AVAILABLE
        if(local_package_index.exists is False):
            update_package_index()

        available_packages = get_available_packages()

        # DOWNLOAD AND INSTALL EVERY PACKAGE
        if(force):
            for available_package in available_packages:
                available_package.install()
            return

        if load_only_lang_codes is not None:
            # FILTER OUT LANGUAGES CODES NOT INCLUDED IN THE LOAD ONLY PARAMETER
            available_packages = list(filter(lambda x: x.from_code in load_only_lang_codes and x.to_code in load_only_lang_codes, available_packages))
        
        # DOWNLOAD AND INSTALL ALL SELECTED PACKAGES
        for available_package in available_packages:
            available_package.install()