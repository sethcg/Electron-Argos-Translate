## Description

Flask translation server, to serve as the backend.

</br>

## Getting Argos Translate Models

The models can be found here at the [argospm index](https://www.argosopentech.com/argospm/index/).

Direct download for relevant models:
- [Spanish => English](https://argos-net.com/v1/translate-es_en-1_9.argosmodel).
- [English => Spanish](https://argos-net.com/v1/translate-en_es-1_0.argosmodel).

Models should be placed in the *./src/server/argosmodels* folder

</br>

## Running PyInstaller

```bash
pip install pyinstaller

pyinstaller ./src/server/server.py --onefile --workpath ./src/server/build --specpath ./src/server --clean --windowed --name translate_server

```

</br>

## Citations:

- [Argos Translate](https://github.com/argosopentech/argos-translate)
- [LibreTranslate](https://github.com/LibreTranslate)
