import { FunctionComponent, useEffect, useState } from 'react'
import { LanguageListItem } from './LanguageListItem'
import { Language } from '~shared/types'

export const LanguageList: FunctionComponent = () => {
  const [languageList, setLanguageList] = useState<Language[]>([])

  useEffect(() => {
    const getLanguages = async () => {
      const languages: Language[] = (await window.main.store.get('languages')) as Language[]
      setLanguageList(languages)
    }
    getLanguages()
  }, [])

  const enableCallback = (code: string, enabled: boolean, callback: (enabled: boolean) => void) => {
    const index: number = languageList.findIndex((lang: Language) => lang.code == code)
    languageList[index].enabled = enabled
    setLanguageList(languageList)
    window.main.store.set('languages', languageList)
    callback(enabled)
  }

  const installCallback = async (code: string, installed: boolean, callback: (installed: boolean) => void) => {
    const isRemove: boolean = installed
    const index: number = languageList.findIndex((lang: Language) => lang.code == code)

    if (isRemove) {
      await window.main.package.deletePackage(code)
      languageList[index].enabled = false
      languageList[index].installed = false
    } else {
      await window.main.package.downloadPackage(code)
      languageList[index].enabled = false
      languageList[index].installed = true
    }

    setLanguageList(languageList)
    window.main.store.set('languages', languageList)
    callback(!installed)
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
          installCallback={installCallback}
        />
      ))}
    </ul>
  )
}
