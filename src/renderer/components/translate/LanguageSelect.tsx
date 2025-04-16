import { FunctionComponent, useState, useEffect } from 'react'
import { Language } from '~shared/types'
import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded'
import clsx from 'clsx'

interface Props {
  className?: string
  isSource: boolean
  title: string
  selectState: Language
  setSelectState: React.Dispatch<React.SetStateAction<Language>>
  translateCallback: () => void
}

export const LanguageSelect: FunctionComponent<Props> = ({
  className = '',
  isSource,
  title,
  selectState,
  setSelectState,
  translateCallback,
}) => {
  const storeKey = isSource ? 'language.source_code' : 'language.target_code'
  const [expanded, setExpanded] = useState<boolean>(false)
  const [languages, setLanguages] = useState<Language[]>([])

  // useEffect(() => {}, [languages])
  const selectChange = (language: Language) => {
    setSelectState(language)

    // SOURCE OR TARGET CHANGED
    window.main.store.set(storeKey, language.code)

    // CALL TRANSLATE, TO UPDATE AFTER LANGUAGE CHANGE
    translateCallback()
  }

  useEffect(() => {
    async function getLanguages() {
      const selectedSourceCode: string = (await window.main.store.get('language.source_code')) as string
      const selectedTargetCode: string = (await window.main.store.get('language.target_code')) as string

      let languagesItems: Language[] = (await window.main.store.get('languages')) as Language[]

      // ERROR NOT ENOUGH LANGUAGES ENABLED
      if (languagesItems.length < 1) return

      // FILTER OUT DISABLED LANGUAGES
      languagesItems = languagesItems.filter((lang: Language) => lang.enabled)

      // FILTER OUT SELECTED SOURCE OR TARGET
      const selectedCode = isSource ? selectedSourceCode : selectedTargetCode
      const selected: Language = languagesItems.filter((lang: Language) => lang.code == selectedCode)[0]
      languagesItems = languagesItems.filter((lang: Language) => lang.code != selectedCode)

      console.log(selected)

      // SET THE SELECTED LANGUAGE AND LANGUAGE LIST
      if (selected) {
        setSelectState(selected)
        setLanguages([selected, ...languagesItems])
      } else if (languagesItems.length > 0) {
        console.log(languagesItems[0])
        setSelectState(languagesItems[0])
        setLanguages([selected, ...languagesItems])
      }
    }
    getLanguages()
  }, [isSource])

  return (
    <div className={`ps-2 pe-8 flex flex-row gap-4 justify-start items-center text-lg font-semibold ${className}`}>
      <span className="mb-2 z-10">{title}</span>
      <div className="relative grow">
        <button
          onDoubleClick={() => setExpanded(false)}
          onAuxClick={() => setExpanded(false)}
          onClick={() => setExpanded(true)}
          className={`${className} ${clsx(
            'block w-full max-w-72 mb-2 cursor-default rounded-md text-left ps-4 py-[1px]',
            'bg-primary-500 focus:outline-primary-600 dar:focus:outline-primary-400/40 focus:outline-2 focus:-outline-offset-2'
          )}`}
        >
          <div className="flex flex-row justify-between items-center">
            <span className="block truncate">{selectState.name}</span>
            <UnfoldMoreRoundedIcon sx={{ fontSize: 24 }} />
          </div>
        </button>
        <ul
          onMouseLeave={() => setExpanded(false)}
          onBlur={() => setExpanded(false)}
          className={`${className} ${clsx(
            `${expanded ? '' : 'hidden'}`,
            'absolute z-100 max-h-56 w-full max-w-72 overflow-auto rounded-md py-1 focus:outline-hidden',
            'bg-primary-500/60'
          )}`}
          role="listbox"
        >
          {languages.map((item: Language, index: number) => (
            <li
              onClick={() => {
                selectChange(item)
                setExpanded(false)
              }}
              className={`${clsx(
                `${expanded && selectState.code == item.code ? 'hidden' : ''}`,
                'relative cursor-default py-[1px] px-2 select-none border-2',
                'hover:bg-primary-400 hover:border-charcoal-800 dark:hover:bg-primary-600/50 dark:hover:border-charcoal-100 border-transparent'
              )}`}
              key={index}
            >
              <span className={`ml-2 block truncate font-normal `}>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
