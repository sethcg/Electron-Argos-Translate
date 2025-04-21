import { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { LanguageListItem } from './LanguageListItem'
import { Language } from '~shared/types'

export const LanguageList: FunctionComponent = () => {
  const [languageList, setLanguageList] = useState<Language[]>([])

  useEffect(() => {
    const getLanguages = async () => {
      let languages: Language[] = (await window.main.store.get('languages')) as Language[]

      // SET MAX LISTENERS TO AVOID NODE WARNING MESSAGES
      window.main.package.setMaxPackageListeners(languages.length * 2)

      // ON COMPONENT MOUNT REMOVE OLD PACKAGE LISTENERS
      window.main.package.removePackageListeners('package:deleteComplete')
      window.main.package.removePackageListeners('package:downloadComplete')

      // SORT FAVORITE LANGUAGES BY LANGUAGE NAME
      const favoriteLanguages: Language[] = languages.filter((langauge: Language) => langauge.favorited)
      favoriteLanguages.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))

      // SORT REMAINING LANGUAGES BY LANGUAGE NAME
      languages = languages.filter((langauge: Language) => !langauge.favorited)
      languages.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))

      setLanguageList([...favoriteLanguages, ...languages])
    }
    getLanguages()
  }, [])

  const favoriteCallback = useCallback(
    async (code: string, favorite: boolean, callback: (favorite: boolean) => void) => {
      window.main.package.removePackageListeners('package:deleteComplete')
      window.main.package.removePackageListeners('package:downloadComplete')

      // UPDATE THE CONFIG
      const configLanguages: Language[] = (await window.main.store.get('languages')) as Language[]
      const configIndex: number = configLanguages.findIndex((lang: Language) => lang.code == code)
      configLanguages[configIndex].favorited = favorite
      window.main.store.set('languages', configLanguages)

      // UPDATE THE LANGUAGE-LIST
      let languages: Language[] = [...languageList]
      const index: number = languages.findIndex((lang: Language) => lang.code == code)
      languages[index].favorited = favorite

      const favoriteLanguages: Language[] = languageList.filter((lang: Language) => lang.favorited)
      favoriteLanguages.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))

      languages = languages.filter((lang: Language) => !lang.favorited)
      languages.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))

      // COMBINE THE FAVORITED AND NON-FAVORITED LISTS
      languages = [...favoriteLanguages, ...languages]
      setLanguageList(languages)
      callback(favorite)
    },
    [languageList]
  )

  const enableCallback = async (code: string, enabled: boolean, callback: (enabled: boolean) => void) => {
    const languages: Language[] = (await window.main.store.get('languages')) as Language[]
    const index: number = languages.findIndex((lang: Language) => lang.code == code)
    languages[index].enabled = enabled
    window.main.store.set('languages', languages)
    callback(enabled)
  }

  return (
    <ul className="grow flex flex-col max-w-3xl my-6 gap-2 overflow-y-auto rounded-md">
      {languageList.map((item: Language) => (
        <LanguageListItem
          key={item.code}
          code={item.code}
          name={item.name}
          isEnabled={item.enabled}
          isInstalled={item.installed}
          isFavorited={item.favorited}
          enableCallback={enableCallback}
          favoriteCallback={favoriteCallback}
        />
      ))}
    </ul>
  )
}
