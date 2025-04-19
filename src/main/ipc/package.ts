import path from 'node:path'
import { app, ipcMain } from 'electron'
import { readFileSync, readdirSync, rmSync, existsSync, mkdirSync } from 'node:fs'
import { Language, LanguagePackage } from '~shared/types'
import AdmZip from 'adm-zip'
import Store from './store/store'
import MainWindow from './window'
import TranslateServer from './translate'

const isDevelopment = process.env.NODE_ENV === 'development'

export default class PackageHandler {
  store: Store
  mainWindow: MainWindow
  translateServer: TranslateServer
  languageFileLocation: string

  constructor(store: Store, mainWindow: MainWindow, translateServer: TranslateServer) {
    this.store = store
    this.mainWindow = mainWindow
    this.translateServer = translateServer
    this.languageFileLocation = this.getLanguageFileLocation()

    // SETUP LANGUAGE PACKAGE RELATED IPC EVENTS
    this.deleteLanguagePackageEvent()
    this.downloadLanguagePackageEvent()
  }

  private getLanguageFileLocation = (): string => {
    const languageFileLocation: string = isDevelopment
      ? path.join(app.getAppPath(), 'src/assets/models')
      : path.join(process.resourcesPath, '/models')
    return languageFileLocation
  }

  private getAvailablePackages = (): LanguagePackage[] => {
    const filePath: string = isDevelopment
      ? path.join(app.getAppPath(), 'src/assets/package-index.json')
      : path.join(process.resourcesPath, 'package-index.json')

    return JSON.parse(readFileSync(filePath, 'utf8'))
  }

  private getInstalledPackages = (availablePackages: LanguagePackage[]): LanguagePackage[] => {
    const files: string[] = readdirSync(this.languageFileLocation)
    return availablePackages.filter((lang: LanguagePackage) => files.includes(lang.filename))
  }

  public initializeConfig = async (): Promise<void> => {
    const availablePackages: LanguagePackage[] = this.getAvailablePackages()
    const installedPackages: LanguagePackage[] = this.getInstalledPackages(availablePackages)

    this.store.resetThenSet('packages', availablePackages)

    let languages = availablePackages.map((language: LanguagePackage) => {
      if (installedPackages.map((languagePackage: LanguagePackage) => languagePackage.target_code).includes(language.target_code)) {
        return { code: language.target_code, name: language.target_name, enabled: true, installed: true }
      } else {
        return { code: language.target_code, name: language.target_name, enabled: false, installed: false }
      }
    })

    // REMOVE DUPLICATES, AND SORT BY NAME
    languages = languages.filter((a, index, array) => array.findIndex((b: Language) => b.code === a.code) === index)
    languages = languages.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))

    this.store.resetThenSet('languages', languages)
  }

  private downloadLanguagePackageEvent = (): void => {
    ipcMain.handle('package:download', async (_, code: string): Promise<void> => {
      const start = performance.now()
      const availablePackages: LanguagePackage[] = this.store.get('packages') as LanguagePackage[]
      const sourcePackage: LanguagePackage = availablePackages.filter((language: LanguagePackage) => language.source_code == code)[0]
      const targetPackage: LanguagePackage = availablePackages.filter((language: LanguagePackage) => language.target_code == code)[0]

      const packages: LanguagePackage[] = [sourcePackage, targetPackage]
      for (let index = 0; index < packages.length; index++) {
        const languagePackage = packages[index]
        const downloadLink = languagePackage.link

        const response = await fetch(downloadLink)
        const buffer = await response.arrayBuffer()

        const zip = new AdmZip(Buffer.from(buffer))
        const zipEntries = zip.getEntries()
        const folderName = zipEntries[0].entryName.replace(/(\\)|(\/)/g, '')
        for (let index = 0; index < zipEntries.length; index++) {
          const zipEntry: AdmZip.IZipEntry = zipEntries[index]

          // GET THE FOLDER NAMES, AND CHECK IF THEY EXIST ADDING THOSE THAT DO NOT
          const folders = zipEntry.entryName
            .replace(folderName, languagePackage.filename)
            .replace(/(.+)(\/)(.*)/, '$1')
            .split('/')
          let currentFolder = ''
          for (let index = 0; index < folders.length; index++) {
            currentFolder += `/${folders[index]}`
            if (!existsSync(`${this.languageFileLocation}/${currentFolder}`)) {
              mkdirSync(`${this.languageFileLocation}/${currentFolder}`)
            }
          }

          // CHECK FOR FILE, IF PRESENT ADD TO TARGET PATH
          if (!zipEntry.entryName.match(/(?=[^/]+$)(.*)/)) continue
          const targetPath = `${this.languageFileLocation.replace(/(\\)/, '/')}/${folders.join('/')}/`
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
      const availablePackages: LanguagePackage[] = this.store.get('packages') as LanguagePackage[]
      const sourcePackage: LanguagePackage = availablePackages.filter((language: LanguagePackage) => language.source_code == code)[0]
      const targetPackage: LanguagePackage = availablePackages.filter((language: LanguagePackage) => language.target_code == code)[0]

      const packages: LanguagePackage[] = [sourcePackage, targetPackage]
      for (let index = 0; index < packages.length; index++) {
        const filePath = path.join(this.languageFileLocation, packages[index].filename)
        rmSync(filePath, { recursive: true })
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
