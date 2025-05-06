# Electron Argos-Translate Application

## Description:

This is an Electron application that can download various Argos-Translate models for offline translation. Choose a source language and target language, then translation will occur as you type or copy/paste into the text area. On the language list tab, languages can be downloaded, favorited, and deleted as needed to save disk space since each language model can be around 100-300mb on average.

----
## Features

Front End Electron App:
- Electron-Forge
- React
- Vite 
- Typescript
- Prettier
- ESLint

Backend Local Translation Server:
- Python
- Flask
- C2Translate
- PyInstaller 

----
## Translation Demo:
<details open>
  <img src="https://github.com/user-attachments/assets/fdb0bc71-0d50-4e31-b80d-1df1117d50a4" width="540" height="431">
  <br>
</details>

----
## Language Selection Demo:
<details close>
  <img src="https://github.com/user-attachments/assets/b4f5ea9e-be1f-465e-b96c-f9bf8c9bb892" width="540" height="431">
  <br>
</details>

---
## Developer Notes:

```bash

# Clone repository
git clone https://github.com/sethcg/Electron-Argos-Translate.git

# Install dependencies
npm install

# Create flask server, using instructions in ./src/server/README.md

# Download argo-translate language packages
# Or, change of pre-installed language packages using instructions in ./src/assets/model-script/README.md
npm run download

# Run application
npm run start

# Package application
npm run package

```

---

> [!WARNING]  
> This project was fun to make, but I will not be able to respond to issues or pull requests often.
> Please if you run into an issue or would like a new feature, clone the repository and improve it yourself.

---

<br>

> How much better to get wisdom than gold, to get insight rather than silver!
