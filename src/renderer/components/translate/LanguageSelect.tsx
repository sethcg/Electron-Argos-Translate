import { FunctionComponent, useState, useEffect } from 'react'
import { Language } from '~shared/types'
import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded'
import clsx from 'clsx'

interface Props {
  isSource: boolean
  title: string
  callback: () => void
}

export const LanguageSelect: FunctionComponent<Props> = ({ isSource, title, callback }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>({ code: '', name: 'None', enabled: false })
  const [languageOptions, setlanguageOptions] = useState<Language[]>([selectedLanguage])
  const [expanded, setExpanded] = useState<boolean>(false)

  const setLanguage = (language: Language) => {
    const storeKey = isSource ? 'source_language' : 'target_language'
    window.main.store.set(storeKey, language)
    setSelectedLanguage(language)
    callback()
  }

  useEffect(() => {
    async function getLanguages() {
      // GET ENABLED LANGUAGES
      let languagesItems = (await window.main.store.get('languages')) as Language[]
      languagesItems = languagesItems.filter((lang: Language) => lang.enabled)

      if (isSource) {
        const source: Language | undefined = (await window.main.store.get('source_language')) as Language | undefined
        if (source) {
          if (languagesItems.some((lang: Language) => lang.code == source.code)) {
            setSelectedLanguage(source)
          } else {
            setSelectedLanguage({ code: '', name: 'None', enabled: false })
          }
          languagesItems = languagesItems.filter((lang: Language) => lang.code != source?.code)
          setlanguageOptions([selectedLanguage, ...languagesItems])
          return
        }
      } else {
        const target: Language | undefined = (await window.main.store.get('target_language')) as Language | undefined
        if (target) {
          if (languagesItems.some((lang: Language) => lang.code == target.code)) {
            setSelectedLanguage(target)
          } else {
            setSelectedLanguage({ code: '', name: 'None', enabled: false })
          }
          languagesItems = languagesItems.filter((lang: Language) => lang.code != target?.code)
          setlanguageOptions([selectedLanguage, ...languagesItems])
          return
        }
      }

      // IF NO LANGUAGES ENABLED, DEFAULT TO NONE
      setlanguageOptions([{ code: '', name: 'None', enabled: true }])
    }
    getLanguages()
  }, [selectedLanguage])

  return (
    <div className={`grow flex flex-row gap-4 justify-start items-center text-lg font-semibold`}>
      <span className="mb-2">{title}</span>
      <div className="relative grow max-w-56 w-56">
        <button
          onDoubleClick={() => setExpanded(false)}
          onAuxClick={() => setExpanded(false)}
          onClick={() => setExpanded(true)}
          className={`${clsx(
            'block w-full mb-2 cursor-default rounded-md text-left ps-4 py-[1px]',
            'bg-primary-500 focus:outline-primary-600 dar:focus:outline-primary-400/40 focus:outline-2 focus:-outline-offset-2'
          )}`}
        >
          <div className="flex flex-row justify-between items-center">
            <span className="">{selectedLanguage.name}</span>
            <UnfoldMoreRoundedIcon sx={{ fontSize: 24 }} />
          </div>
        </button>
        <ul
          onMouseLeave={() => setExpanded(false)}
          onBlur={() => setExpanded(false)}
          className={`${clsx(
            `${expanded ? '' : 'hidden'}`,
            'z-100 max-h-56 absolute w-full overflow-auto rounded-md py-1 focus:outline-hidden',
            'bg-primary-500/60'
          )}`}
          role="listbox"
        >
          {languageOptions.map((item: Language, index: number) => (
            <li
              onClick={() => {
                setLanguage(item)
                setExpanded(false)
              }}
              className={`${clsx(
                `${expanded && selectedLanguage.code == item.code ? 'hidden' : ''}`, // HIDE SELECTED LANGUAGE
                'relative cursor-default py-[1px] px-2 select-none border-2',
                'hover:bg-primary-400 hover:border-charcoal-800 dark:hover:bg-primary-600/50 dark:hover:border-charcoal-100 border-transparent'
              )}`}
              key={index}
            >
              <span className="ml-2 font-normal">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
