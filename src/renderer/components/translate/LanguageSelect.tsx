import { FunctionComponent, useState, useEffect } from 'react'
import { ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { LanguagePackage } from '~shared/types'

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
    <div className={`ps-4 flex flex-row gap-4 justify-start items-center text-neutral-950 text-lg font-roboto font-semibold ${className}`}>
      <span className=" text-white mb-2 z-10">{title}</span>
      <div className="relative w-50">
        <button
          onDoubleClick={() => {
            setExpanded(false)
          }}
          onAuxClick={() => {
            setExpanded(false)
          }}
          type="button"
          onClick={() => {
            setExpanded(true)
          }}
          className={`w-full mb-2 cursor-default rounded-md bg-neutral-600 py-[2px] px-2 text-left focus:outline-2 focus:-outline-offset-2 focus:outline-slate-500`}
        >
          <div className="flex flex-row justify-between items-center">
            <span className="block truncate text-white ">{selectState.name}</span>
            <ChevronUpDownIcon className="size-5 text-neutral-950" strokeWidth={2.5} />
          </div>
        </button>
        <ul
          onMouseLeave={() => {
            setExpanded(false)
          }}
          onBlur={() => {
            setExpanded(false)
          }}
          className={`${expanded ? '' : 'hidden'} absolute z-100 max-h-56 w-full overflow-auto rounded-md bg-neutral-600 py-1 focus:outline-hidden`}
          role="listbox"
        >
          {languages.map((item: SimpleLanguage, index: number) => (
            <li
              onClick={() => {
                selectChange(item)
                setExpanded(false)
              }}
              className={`${expanded && selectState.code == item.code ? 'hidden' : ''} relative cursor-default py-[2px] px-2 text-neutral-950 hover:bg-slate-500 select-none`}
              key={index}
            >
              <span className={`ml-2 block truncate text-md font-normal text-neutral-950`}>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
