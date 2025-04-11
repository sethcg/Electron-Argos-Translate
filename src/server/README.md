# Description

Flask server translation service, runs as a local server for offline translation using argos translate models.

The models can be found here at the [argospm index](https://www.argosopentech.com/argospm/index/).

</br>

## Developer Notes:

```bash

# Download PyInstaller
pip install pyinstaller

# PyInstaller command that creates the binary (.EXE on windows)
pyinstaller ./src/server/server.py
    --onefile
    --workpath ./src/server/build
    --specpath ./src/server
    --clean
    --windowed
    --name translate_server

```

</br>

## Citation Notes:
- [Argos Translate](https://github.com/argosopentech/argos-translate) - Open-source offline translation library written in Python.
- [Spacy](https://github.com/explosion/spaCy) - SpaCy is a library for advanced Natural Language Processing in Python.
- [LibreTranslate](https://github.com/LibreTranslate) - Free and Open-source Machine Translation API, entirely self-hosted.
