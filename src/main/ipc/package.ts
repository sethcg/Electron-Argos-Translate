import path from 'node:path'
import { app, ipcMain } from 'electron'
import { mkdir, access, readFile, rm, constants } from 'node:fs/promises'
import { Language, LanguagePackage } from '~shared/types'
import AdmZip from 'adm-zip'
import Store from './store/store'
import MainWindow from './window'
import TranslateServer from './translate'

const isDevelopment: boolean = process.env.NODE_ENV === 'development'

export default class PackageHandler {
  store: Store
  mainWindow: MainWindow
  translateServer: TranslateServer
  languageFileLocation: string
  availablePackages: LanguagePackage[] = []

  constructor(store: Store, mainWindow: MainWindow, translateServer: TranslateServer) {
    this.store = store
    this.mainWindow = mainWindow
    this.translateServer = translateServer
    this.languageFileLocation = this.getLanguageFileLocation()

    // SETUP LANGUAGE PACKAGE RELATED IPC EVENTS
    this.deleteLanguagePackageEvent()
    this.downloadLanguagePackageEvent()
  }

  public setConfig = async (): Promise<void> => {
    this.availablePackages = await this.getAvailablePackages()

    let requireConfigChange: boolean = false
    let languages: Language[] = (await this.store.get('languages')) as Language[]
    const availablePackagesLength: number = this.availablePackages.length
    for (let index = 0; index < availablePackagesLength; index++) {
      const availablePackage: LanguagePackage = this.availablePackages[index]

      const languageFoundInConfig: boolean = languages.some((language: Language) => availablePackage.target_code === language.code)
      if (!languageFoundInConfig) {
        requireConfigChange = true
        let installed: boolean = false
        await access(path.join(this.languageFileLocation, availablePackage.filename), constants.F_OK)
          .then(() => (installed = true))
          .catch(() => (installed = false))
        languages.push({ code: availablePackage.target_code, name: availablePackage.target_name, enabled: installed, installed: installed })
      }
    }
    if (requireConfigChange) {
      // SORT BY LANGUAGE NAME
      languages = languages.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
      this.store.resetThenSet('languages', languages)
    }
  }

  private getLanguageFileLocation = (): string => {
    return isDevelopment ? path.join(app.getAppPath(), 'src/assets/models') : path.join(process.resourcesPath, '/models')
  }

  private getAvailablePackages = async (): Promise<LanguagePackage[]> => {
    const filePath: string = isDevelopment
      ? path.join(app.getAppPath(), 'src/assets/package-index.json')
      : path.join(process.resourcesPath, 'package-index.json')

    return readFile(filePath, 'utf8').then((text: string) => JSON.parse(text))
  }

  private downloadLanguagePackageEvent = (): void => {
    ipcMain.handle('package:download', async (_, code: string): Promise<void> => {
      const start: number = performance.now()
      const packages: LanguagePackage[] = this.availablePackages.filter(
        (languagePackage: LanguagePackage) => languagePackage.source_code == code || languagePackage.target_code == code
      )

      // CHECK IF THERE IS ALREADY A PACKAGE WITH THE SAME NAME, REMOVE IT
      for (let index = 0; index < packages.length; index++) {
        const filePath: string = path.join(this.languageFileLocation, packages[index].filename)
        await access(filePath, constants.F_OK)
          .then(() => rm(filePath, { recursive: true }))
          .catch(() => {
            /* NO FOLDER FOUND TO DELETE */
          })
      }

      for (let index = 0; index < packages.length; index++) {
        const languagePackage: LanguagePackage = packages[index]
        const downloadLink: string = languagePackage.link

        const response: Response = await fetch(downloadLink)
        const buffer: ArrayBuffer = await response.arrayBuffer()

        const zip: AdmZip = new AdmZip(Buffer.from(buffer))
        const zipEntries: AdmZip.IZipEntry[] = zip.getEntries()
        const folderName: string = zipEntries[0].entryName.replace(/(\\)|(\/)/g, '')

        for (let index = 0; index < zipEntries.length; index++) {
          const zipEntry: AdmZip.IZipEntry = zipEntries[index]

          // GET THE FOLDER NAMES, AND CHECK IF THEY EXIST ADDING THOSE THAT DO NOT
          const folders: string[] = zipEntry.entryName
            .replace(folderName, languagePackage.filename)
            .replace(/(.+)(\/)(.*)/, '$1')
            .split('/')
          let currentFolder: string = ''
          for (let index = 0; index < folders.length; index++) {
            currentFolder += `/${folders[index]}`
            await access(`${this.languageFileLocation}/${currentFolder}`).catch(() =>
              mkdir(`${this.languageFileLocation}/${currentFolder}`)
            )
          }

          // CHECK FOR FILE, IF PRESENT ADD TO TARGET PATH
          if (!zipEntry.entryName.match(/(?=[^/]+$)(.*)/)) continue
          const targetPath: string = path.join(this.languageFileLocation.replace(/(\\)/, '/'), folders.join('/'))
          zip.extractEntryTo(zipEntry, targetPath, false, true)
        }
      }

      // SET THE CONFIG
      const languages: Language[] = (await this.store.get('languages')) as Language[]
      const index: number = languages.findIndex((lang: Language) => lang.code == code)
      languages[index].enabled = true
      languages[index].installed = true
      this.store.set('languages', languages)

      // SEND OUT THE IPC RENDERER EVENT
      await this.translateServer.setCache()
      this.mainWindow.webContents.send('package:downloadComplete', code)
      console.log(`LANGUAGE DOWNLOAD TOOK: ${Math.round(performance.now() - start)} ms`)
    })
  }

  private deleteLanguagePackageEvent = (): void => {
    ipcMain.handle('package:delete', async (_, code: string): Promise<void> => {
      const packages: LanguagePackage[] = this.availablePackages.filter(
        (languagePackage: LanguagePackage) => languagePackage.source_code == code || languagePackage.target_code == code
      )
      for (let index = 0; index < packages.length; index++) {
        const filePath: string = path.join(this.languageFileLocation, packages[index].filename)
        await access(filePath, constants.F_OK)
          .then(() => rm(filePath, { recursive: true }))
          .catch(() => {
            /* NO FOLDER FOUND TO DELETE */
          })
      }

      // SET THE CONFIG
      const languages: Language[] = (await this.store.get('languages')) as Language[]
      const index: number = languages.findIndex((lang: Language) => lang.code == code)
      languages[index].enabled = false
      languages[index].installed = false
      this.store.set('languages', languages)

      // SEND OUT THE IPC RENDERER EVENT
      this.mainWindow.webContents.send('package:deleteComplete', code)
    })
  }
}
