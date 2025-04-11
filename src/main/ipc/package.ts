import path from 'node:path'
import { app } from 'electron'
import { readFileSync, readdirSync } from 'node:fs'
import { LanguagePackage } from '~shared/types'
import Store from './store/store'

export default class PackageHandler {
  store: Store
  isDevelopment: boolean
  languageFileLocation: string

  constructor(store: Store, isDevelopment: boolean) {
    this.store = store
    this.isDevelopment = isDevelopment

    this.languageFileLocation = this.getLanguageFileLocation()
  }

  private getLanguageFileLocation = (): string => {
    const languageFileLocation: string = this.isDevelopment
      ? path.join(app.getAppPath(), 'src/assets/models')
      : path.join(process.resourcesPath, '/')
    return languageFileLocation
  }

  private getAvailablePackages = (): LanguagePackage[] => {
    const filePath: string = this.isDevelopment
      ? path.join(__dirname, './resources/package-index.json')
      : path.join(process.resourcesPath, '/package-index.json')

    return JSON.parse(readFileSync(filePath, 'utf8'))
  }

  private getInstalledPackages = (availablePackages: LanguagePackage[]): LanguagePackage[] => {
    const files: string[] = readdirSync(this.languageFileLocation)
    return availablePackages.filter((lang: LanguagePackage) => files.includes(lang.filename))
  }

  public initializeConfig = (): void => {
    const availablePackages: LanguagePackage[] = this.getAvailablePackages()
    const installedPackages: LanguagePackage[] = this.getInstalledPackages(availablePackages)

    console.log(`PACKAGES INSTALLED: ${installedPackages.length}`)

    this.store.reset('packages')
    this.store.set('packages', installedPackages)
  }
}
