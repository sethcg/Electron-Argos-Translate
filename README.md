# Electron Argos-Translate Application

## Description:

This is an electron application that can download various Argos-Translate models for offline translation.
- Choose source and target language, and translation will occur as you type or copy/paste in text. 
- Languages can be downloaded, favorited, and deleted through the language list interface.

----
## Features
- Electron-Forge, React, Vite, Typescript
- Flask-Python Translate Server
- C2Translate
  
----
## Translation Demo:
<details open>
  <img src="https://github.com/user-attachments/assets/b4f5ea9e-be1f-465e-b96c-f9bf8c9bb892" width="540" height="431">
  <br>
</details>

----
## Language Selection Demo:
<details close>
  <img src="https://github.com/user-attachments/assets/fdb0bc71-0d50-4e31-b80d-1df1117d50a4" width="540" height="431">
  <br>
</details>

---
## Developer Notes:

```bash

# Clone repository
git clone https://github.com/sethcg/electron-argos-translate.git

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

<br>

> How much better to get wisdom than gold, to get insight rather than silver!
