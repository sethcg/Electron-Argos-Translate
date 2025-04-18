/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const AdmZip = require("adm-zip");

(async () => {
    const packageIndex = './src/assets/package-index.json'
    const packages = JSON.parse(fs.readFileSync(packageIndex, 'utf8'))

    // THIS PARAMETER IS TO INCLUDE ONLY SELECTED LANGUAGE MODELS TO BE DOWNLOADED BY THE SCRIPT,
    // FOR EXAMPLE: ['es', 'en', 'ru'] WOULD ONLY DOWNLOAD SPANISH, ENGLISH, AND RUSSIAN LANGUAGE MODELS
    // LEAVING THIS BLANK WILL RESULT IN THE SCRIPT DOWNLOADING ALL LANGUAGES EXCEPT THOSE EXCLUDED
    const included_languages = ['en', 'es']

    // THIS PARAMETER IS TO EXCLUDE SELECTED LANGUAGE MODELS FROM GETTING DOWNLOADED BY THE SCRIPT,
    // FOR EXAMPLE: ['zt', 'ca', 'pb'] WOULD EXCLUDE "Chinese (traditional)", "Catalan", and "Portuguese (Brazil)"
    const excluded_languages = ['zt', 'ca', 'pb']

    // ONLY DOWNLOAD INCLUDED/EXCLUDED LANGUAGES, OTHERWISE TRY NEXT LANGUAGE
    let languagePackages = []
    if(included_languages.length > 0) {
        languagePackages = packages.filter(x => included_languages.includes(x.source_code) && included_languages.includes(x.target_code))
        languagePackages = languagePackages.filter(x => !excluded_languages.includes(x.source_code) && !excluded_languages.includes(x.target_code))
    } else {
        languagePackages = packages.filter(x => !excluded_languages.includes(x.source_code) && !excluded_languages.includes(x.target_code))
    }

    console.log(`DOWNLOADING ${languagePackages.length} PACKAGES THIS MAY TAKE SOME TIME`)

    for (let index = 0; index < languagePackages.length; index++) {
        const languagePackage = languagePackages[index];
        const downloadLink = languagePackage.link

        const response = await fetch(downloadLink)
        const buffer = await response.arrayBuffer()
        const zip = new AdmZip(Buffer.from(buffer))
        const folderName = zip.getEntries()[0].entryName.replace(/(\\)|(\/)/g, '')
        const fileLocation = './src/assets/models'
        
        // CREATE MODELS FOLDER, IF IT DOES NOT ALREADY EXIST
        if (!fs.existsSync(fileLocation)) fs.mkdirSync(fileLocation)

        zip.extractAllTo(fileLocation, true)

        // RENAME THE FOLDER, BECAUSE IT IS NOT ALWAYS MATCHING THE PACKAGE JSON
        if (folderName != languagePackage.filename) {
            fs.renameSync(`${fileLocation}/${folderName}`, `${fileLocation}/${languagePackage.filename}`)
        }
    }
})();