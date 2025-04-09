import path from 'node:path'
import { app, net } from 'electron'
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync } from 'node:fs'
import { LanguagePackage } from '~shared/types'
import AdmZip from 'adm-zip'
import Store from './store/store'

export default class PackageHandler {
  isDevelopment: boolean
  languageFileLocation: string
  store: Store

  constructor(store: Store, isDevelopment: boolean) {
    this.store = store
    this.isDevelopment = isDevelopment

    this.languageFileLocation = this.getLanguageFileLocation()

    // CHECK FOR MISSING FILES, AND UPDATE SETTINGS CONFIG
    this.updateConfig()
  }

  public getLanguageFileLocation = (): string => {
    const location = path.join(app.getPath('userData'), '/languages/')
    if (!existsSync(location)) mkdirSync(location)
    return location
  }

  public getInstalledPackages = (availablePackages: LanguagePackage[]): LanguagePackage[] => {
    const files: string[] = readdirSync(this.languageFileLocation)
    return availablePackages.filter((lang: LanguagePackage) => files.includes(lang.filename))
  }

  public getAvailablePackages = (): LanguagePackage[] => {
    const filePath: string = this.isDevelopment
      ? path.join(__dirname, './resources/argos-packages.json')
      : path.join(process.resourcesPath, '/argos-packages.json')

    return JSON.parse(readFileSync(filePath, 'utf8'))
  }

  public updateConfig = (): void => {
    const availablePackages: LanguagePackage[] = this.getAvailablePackages()
    const installedPackages: LanguagePackage[] = this.getInstalledPackages(availablePackages)

    this.store.reset('packages')
    this.store.set('packages', installedPackages)
  }

  public installPackages = async (downloadAll: boolean = false, install_only: string[] = ['en', 'es']): Promise<void> => {
    let packagesToInstall: LanguagePackage[] = []
    const availablePackages: LanguagePackage[] = this.getAvailablePackages()
    const installedPackages: LanguagePackage[] = this.getInstalledPackages(availablePackages)
    console.log(`PACKAGES PRE-INSTALLED: ${installedPackages.length}`)
    const installedPackageIds: number[] = installedPackages.map((lang: LanguagePackage) => lang.id)

    // FILTER OUT ALREADY INSTALLED PACKAGES
    packagesToInstall = availablePackages.filter((lang: LanguagePackage) => !installedPackageIds.includes(lang.id))

    // DOWNLOAD & INSTALL ALL LANGUAGE PACKAGES
    if (downloadAll) {
      for (let index = 0; index < availablePackages.length; index++) {
        const languagePackage = availablePackages[index]
        await this.installPackage(languagePackage)
      }
      return
    }

    // FILTER BY SELECTED ISO LANGUAGE CODES
    packagesToInstall = packagesToInstall.filter((lang: LanguagePackage) => {
      if (install_only.includes(lang.target_code) && install_only.includes(lang.source_code)) return lang
    })

    // DOWNLOAD & INSTALL SELECTED LANGUAGE PACKAGES
    for (let index = 0; index < packagesToInstall.length; index++) {
      const languagePackage = packagesToInstall[index]
      await this.installPackage(languagePackage)
    }
  }

  private installPackage = async (languagePackage: LanguagePackage): Promise<void> => {
    const start = performance.now()
    if (!net.isOnline()) return

    const downloadLink: string = languagePackage.link
    const response = await fetch(downloadLink)
    const buffer = await response.arrayBuffer()
    const zip = new AdmZip(Buffer.from(buffer))
    const folderName = zip.getEntries()[0].entryName.replace(/(\\)|(\/)/g, '')
    zip.extractAllTo(this.languageFileLocation, true)
    // RENAME THE FOLDER, BECAUSE IT IS NOT ALWAYS MATCHING THE PACKAGE JSON
    if (folderName != languagePackage.filename) {
      renameSync(`${this.languageFileLocation}/${folderName}`, `${this.languageFileLocation}/${languagePackage.filename}`)
    }
    console.log(`DOWNLOADED AND DECOMPRESSED ${languagePackage.filename} IN: ${performance.now() - start} ms`)

    // UPDATE SETTINGS CONFIG TO INCLUDE THE ADDED LANGUAGE PACKAGES
    const currentPackages: LanguagePackage[] = this.store.get('packages') as LanguagePackage[]
    const currentPackageIds: number[] = currentPackages.map(lang => lang.id)
    if (!currentPackageIds.includes(languagePackage.id)) {
      currentPackages.push(languagePackage)
      this.store.reset('packages')
      this.store.set('packages', currentPackages)
    }
  }
}
