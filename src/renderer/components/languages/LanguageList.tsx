import { FunctionComponent, useEffect, useState } from 'react'
import { LanguageListItem } from './LanguageListItem'
import { Language } from '~shared/types'

export const LanguageList: FunctionComponent = () => {
  const [languageList, setLanguageList] = useState<Language[]>([])

  useEffect(() => {
    const getLanguages = async () => {
      const languages: Language[] = (await window.main.store.get('languages')) as Language[]

      // SET MAX LISTENERS TO AVOID NODE WARNING MESSAGES
      window.main.package.setMaxPackageListeners(languages.length * 2)

      // ON COMPONENT MOUNT REMOVE OLD PACKAGE LISTENERS
      window.main.package.removePackageListeners('package:deleteComplete')
      window.main.package.removePackageListeners('package:downloadComplete')

      setLanguageList(languages)
    }
    getLanguages()
  }, [])

  const enableCallback = async (code: string, enabled: boolean, callback: (enabled: boolean) => void) => {
    const languages: Language[] = (await window.main.store.get('languages')) as Language[]
    const index: number = languages.findIndex((lang: Language) => lang.code == code)
    languages[index].enabled = enabled
    setLanguageList(languages)
    window.main.store.set('languages', languages)
    callback(enabled)
  }

  return (
    <ul className="grow flex flex-col max-w-3xl my-6 gap-2 overflow-y-auto rounded-md">
      {languageList.map((item: Language, index: number) => (
        <LanguageListItem
          key={index}
          code={item.code}
          name={item.name}
          isEnabled={item.enabled}
          enableCallback={enableCallback}
          isInstalled={item.installed}
        />
      ))}
    </ul>
  )
}
