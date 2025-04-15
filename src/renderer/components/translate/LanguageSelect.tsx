import { FunctionComponent, useState, useEffect } from 'react'
import { LanguagePackage } from '~shared/types'
import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded'
import clsx from 'clsx'

interface Props {
  className?: string
  isSource: boolean
  storeKey: string
  title: string
  selectState: SimpleLanguage
  setSelectState: React.Dispatch<React.SetStateAction<SimpleLanguage>>
  translateCallback: () => void
}

export type SimpleLanguage = {
  code: string
  name: string
}

export const LanguageSelect: FunctionComponent<Props> = ({
  className = '',
  isSource,
  storeKey,
  title,
  selectState,
  setSelectState,
  translateCallback,
}) => {
  const [expanded, setExpanded] = useState<boolean>(false)
  const [languages, setLanguages] = useState<SimpleLanguage[]>([{ code: '', name: 'None' }])

  useEffect(() => {}, [languages])
  const sortLanguages = (array: SimpleLanguage[]): SimpleLanguage[] => {
    return array.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
  }

  const selectChange = (language: SimpleLanguage) => {
    setSelectState(language)
    setLanguages(sortLanguages(languages))

    // SOURCE OR TARGET CHANGED
    window.main.store.set(storeKey, language.code)

    // CALL TRANSLATE, TO UPDATE AFTER LANGUAGE CHANGE
    translateCallback()
  }

  useEffect(() => {
    async function getPackages() {
      const selectedCode: string = (await window.main.store.get(storeKey)) as string

      const packages: LanguagePackage[] = (await window.main.store.get('packages')) as LanguagePackage[]
      let packageLanguages: SimpleLanguage[] = packages.map((lang: LanguagePackage) => {
        const code = isSource ? lang.source_code : lang.target_code
        const name = isSource ? lang.source_name : lang.target_name
        return { code, name }
      })
      // REMOVE DUPLICATES, AND SORT BY NAME
      packageLanguages = packageLanguages.filter((a, index, array) => array.findIndex((b: SimpleLanguage) => b.code === a.code) === index)
      packageLanguages = sortLanguages(packageLanguages)

      const selectedIndex: number = packageLanguages.findIndex((lang: SimpleLanguage) => lang.code == selectedCode)
      let selected: SimpleLanguage = packageLanguages[0]
      if (selectedIndex > 0) {
        selected = packageLanguages.splice(selectedIndex, 1)[0]
        setSelectState(selected)
      }

      // SET THE SELECTED LANGUAGE AND LANGUAGE LIST
      const temp = [selected, ...packageLanguages]
      if (temp.length > 0) {
        setLanguages([selected, ...packageLanguages])
      }
    }
    getPackages()
  }, [isSource, setSelectState, storeKey])

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
          {languages.map((item: SimpleLanguage, index: number) => (
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
