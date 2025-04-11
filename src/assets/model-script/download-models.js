const fs = require('node:fs');
const AdmZip = require("adm-zip");

(async () => {
    const packageIndex = './src/assets/package-index.json'
    const packages = JSON.parse(fs.readFileSync(packageIndex, 'utf8'))

    // THIS PARAMETER IS TO FILTER WHICH LANGUAGE MODELS GET DOWNLOADED BY THE SCRIPT,
    // FOR EXAMPLE: ['es', 'en', 'ru'] WOULD ONLY DOWNLOAD SPANISH, ENGLISH, AND RUSSIAN LANGUAGE MODELS
    const select_languages_only = ['es', 'en']

    for (let index = 0; index < packages.length; index++) {
        const languagePackage = packages[index];
        const downloadLink = languagePackage.link
        const filename = downloadLink.replace('.argosmodel', '').split('/').pop()

        // ONLY DOWNLOAD SELECTED LANGUAGES, OR ALL IF THE ARRAY IS EMPTY
        if(select_languages_only.length <= 0 || (select_languages_only.includes(languagePackage.source_code) && select_languages_only.includes(languagePackage.target_code))) 
        {
            const response = await fetch(downloadLink)
            const buffer = await response.arrayBuffer()
            const zip = new AdmZip(Buffer.from(buffer))
            const folderName = zip.getEntries()[0].entryName.replace(/(\\)|(\/)/g, '')
            const fileLocation = './src/assets/models'
            zip.extractAllTo(fileLocation, true)
            // RENAME THE FOLDER, BECAUSE IT IS NOT ALWAYS MATCHING THE PACKAGE JSON
            if (folderName != languagePackage.filename) {
                fs.renameSync(`${fileLocation}/${folderName}`, `${fileLocation}/${languagePackage.filename}`)
            }
        }
    }
})();