# Description

Flask server translation service.

</br>

## Getting Argos Translate Models

The models can be found here at the [argospm index](https://www.argosopentech.com/argospm/index/).

</br>

## Running PyInstaller

```bash

pip install pyinstaller

# Command to create binary (.EXE on windows)
pyinstaller ./src/server/server.py
    --onefile
    --workpath ./src/server/build
    --specpath ./src/server
    --clean
    --windowed
    --name translate_server

```

</br>

## Citations:
- [Argos Translate](https://github.com/argosopentech/argos-translate) - Open-source offline translation library written in Python.
- [Spacy](https://github.com/explosion/spaCy) - SpaCy is a library for advanced Natural Language Processing in Python.
- [LibreTranslate](https://github.com/LibreTranslate) - Free and Open-source Machine Translation API, entirely self-hosted.
