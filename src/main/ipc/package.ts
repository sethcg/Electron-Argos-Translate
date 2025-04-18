import path from 'node:path'
import { app, ipcMain } from 'electron'
import { readFileSync, readdirSync, renameSync, rmdirSync } from 'node:fs'
import { Language, LanguagePackage } from '~shared/types'
import AdmZip from 'adm-zip'
import Store from './store/store'

const isDevelopment = process.env.NODE_ENV === 'development'

export default class PackageHandler {
  store: Store
  languageFileLocation: string

  constructor(store: Store) {
    this.store = store
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

    console.log(`LANGUAGES AVAILABLE: ${availablePackages.length / 2}`)
    console.log(`LANGUAGES INSTALLED: ${installedPackages.length / 2}`)
  }

  private downloadLanguagePackageEvent = (): void => {
    ipcMain.handle('package:download', async (_, code: string): Promise<boolean> => {
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
        const folderName = zip.getEntries()[0].entryName.replace(/(\\)|(\/)/g, '')
        zip.extractAllTo(this.languageFileLocation, true)

        // RENAME THE FOLDER, BECAUSE IT IS NOT ALWAYS MATCHING THE PACKAGE INDEX JSON
        if (folderName != languagePackage.filename) {
          renameSync(`${this.languageFileLocation}/${folderName}`, `${this.languageFileLocation}/${languagePackage.filename}`)
        }
      }
      return true
    })
  }

  private deleteLanguagePackageEvent = (): void => {
    ipcMain.handle('package:delete', async (_, code: string): Promise<boolean> => {
      const availablePackages: LanguagePackage[] = this.store.get('packages') as LanguagePackage[]
      const sourcePackage: LanguagePackage = availablePackages.filter((language: LanguagePackage) => language.source_code == code)[0]
      const targetPackage: LanguagePackage = availablePackages.filter((language: LanguagePackage) => language.target_code == code)[0]

      const packages: LanguagePackage[] = [sourcePackage, targetPackage]
      for (let index = 0; index < packages.length; index++) {
        const filePath = path.join(this.languageFileLocation, packages[index].filename)
        rmdirSync(filePath, { recursive: true })
      }
      return true
    })
  }
}
