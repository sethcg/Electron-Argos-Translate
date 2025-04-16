import { FunctionComponent, useEffect, useState } from 'react'
import { LanguageListItem } from './LanguageListItem'
import { Language } from '~shared/types'

export const LanguageList: FunctionComponent = () => {
  const [languages, setLanguages] = useState<Language[]>([])

  useEffect(() => {
    const getLanguages = async () => {
      const languagesItems: Language[] = (await window.main.store.get('languages')) as Language[]
      setLanguages(languagesItems)
    }
    getLanguages()
  }, [])

  const updateLanguages = (code: string, enabled: boolean, callback: (enabled: boolean) => void) => {
    // ONLY UPDATE WHEN THERE ARE AT LEAST TWO LANGUAGES TO TRANSLATE
    if (languages.filter((lang: Language) => lang.enabled).length >= 2) {
      const index: number = languages.findIndex((lang: Language) => lang.code == code)
      languages[index].enabled = enabled
      setLanguages(languages)
      window.main.store.set('languages', languages)
      callback(enabled)
    }
  }

  return (
    <ul className="p-4 flex flex-col gap-2  overflow-y-auto grow rounded-md">
      {languages.map((item: Language, index: number) => (
        <LanguageListItem key={index} code={item.code} name={item.name} isEnabled={item.enabled} updateCallback={updateLanguages} />
      ))}
    </ul>
  )
}
