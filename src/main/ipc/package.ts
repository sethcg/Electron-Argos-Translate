import path from 'node:path'
import { app } from 'electron'
import { readFileSync, readdirSync } from 'node:fs'
import { Language, LanguagePackage } from '~shared/types'
import Store from './store/store'

const isDevelopment = process.env.NODE_ENV === 'development'

export default class PackageHandler {
  store: Store
  languageFileLocation: string

  constructor(store: Store) {
    this.store = store
    this.languageFileLocation = this.getLanguageFileLocation()
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

    this.store.reset('packages')
    this.store.set('packages', installedPackages)

    console.log(`PACKAGES INSTALLED: ${installedPackages.length}`)

    // INSTALL THE LANGUAGES TO THE CONFIG, IF NOT ALREADY PRESENT (OR PACKAGES DOESN'T MATCH LANGUAGES)
    const languages: Language[] = (await this.store.get('languages')) as Language[]
    if (languages.length <= 0 || languages.length != installedPackages.length / 2) {
      let packageLanguages: Language[] = installedPackages.map((lang: LanguagePackage) => {
        return { code: lang.target_code, name: lang.target_name, enabled: true }
      })

      // REMOVE DUPLICATES, AND SORT BY NAME
      packageLanguages = packageLanguages.filter((a, index, array) => array.findIndex((b: Language) => b.code === a.code) === index)
      packageLanguages = packageLanguages.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))

      this.store.reset('languages')
      this.store.set('languages', packageLanguages)
    }
  }
}
