import path from 'node:path'
import { app, net } from 'electron'
import { createWriteStream, existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs'
import { LanguagePackage } from '~shared/types'

export class PackageHandler {
  isDevelopment: boolean
  fileLocation: string

  constructor(isDevelopment: boolean) {
    this.isDevelopment = isDevelopment
    this.fileLocation = this.getFileLocation()
  }

  private getFileLocation = (): string => {
    const location = path.join(app.getPath('userData'), '/languages')
    if (!existsSync(location)) mkdirSync(location)
    return location
  }

  private getInstalledPackages = async (availablePackages: LanguagePackage[]): Promise<LanguagePackage[]> => {
    const files: string[] = readdirSync(this.fileLocation)
    return availablePackages.filter((lang: LanguagePackage) => files.includes(lang.filename))
  }

  public getAvailablePackages = (): LanguagePackage[] => {
    const filePath: string = this.isDevelopment
      ? path.join(__dirname, './resources/packages.json')
      : path.join(process.resourcesPath, 'packages.json')

    return JSON.parse(readFileSync(filePath, 'utf8'))
  }

  public downloadPackages = async (downloadAll: boolean = false, install_only: string[] | undefined = undefined) => {
    let packagesToInstall: LanguagePackage[] = []
    const availablePackages: LanguagePackage[] = this.getAvailablePackages()
    const installedPackageIds: number[] = await this.getInstalledPackages(availablePackages).then(
      (langs: LanguagePackage[]) => {
        return langs.map((lang: LanguagePackage) => lang.id)
      }
    )

    // FILTER OUT ALREADY INSTALLED PACKAGES
    console.log(`PACKAGES INSTALLED: ${installedPackageIds.length}`)
    packagesToInstall = availablePackages.filter((lang: LanguagePackage) => !installedPackageIds.includes(lang.id))

    // DOWNLOAD ALL LANGUAGE PACKAGES
    if (downloadAll) {
      for (let index = 0; index < availablePackages.length; index++) {
        const languagePackage = availablePackages[index]
        await this.downloadPackage(languagePackage)
      }
      return
    }

    // FILTER BY SELECTED ISO LANGUAGE CODES
    packagesToInstall = availablePackages.filter((lang: LanguagePackage) => {
      if (install_only?.includes(lang.target_code) || install_only?.includes(lang.source_code)) return lang
    })

    // DOWNLOAD SELECTED LANGUAGE PACKAGES
    for (let index = 0; index < packagesToInstall.length; index++) {
      const languagePackage = packagesToInstall[index]
      await this.downloadPackage(languagePackage)
    }
  }

  private downloadPackage = async (languagePackage: LanguagePackage): Promise<void> => {
    if (!net.isOnline()) return

    const downloadLink: string = languagePackage.link
    const filename: string = languagePackage.filename

    const response = await fetch(downloadLink)
    // let received_bytes: number = 0;
    // const total_bytes : number = parseInt(response.headers.get('content-length') ?? '0');
    const reader = response.body?.getReader()
    const writeStream = createWriteStream(`${this.fileLocation}/${filename}`)
    writeStream.on('open', async () => {
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          writeStream.write(value)
          // received_bytes += value.byteLength;
          // console.log(`${Math.round(received_bytes / total_bytes * 100)}%`)
        }
      }
    })
  }
}
