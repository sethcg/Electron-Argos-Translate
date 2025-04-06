import { Select } from '@headlessui/react'
import { FunctionComponent, ReactElement, Ref, useEffect, useState } from 'react'
import { LanguagePackage } from '~shared/types'

interface Props {
  className: string
  isSource: boolean
  storeKey: string
  title: string
  selectRef: Ref<HTMLElement>
}

type SimpleLanguage = {
  code: string
  name: string
}

export const LanguageSelect: FunctionComponent<Props> = ({ className, isSource, storeKey, title, selectRef }) => {
  const [selectOptions, setSelectOptions] = useState<ReactElement[]>()
  const [selectedOption, setSelectedOption] = useState<string>('')

  const selectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    // SOURCE OR TARGET CHANGED, SETUP TRANSLATOR
    console.log(`selectedOption: ${selectedOption} value: ${value}`)
    if (selectedOption !== value) {
      window.main.store.set(storeKey, value)
      window.api.setup()
    }
    setSelectedOption(value)
  }

  useEffect(() => {
    getPackages()
    async function getPackages() {
      const selectedCode: string = (await window.main.store.get(storeKey)) as string
      console.log(`storeKey: ${storeKey} \t selectedCode: ${selectedCode}`)

      const packages: LanguagePackage[] = (await window.main.store.get('packages')) as LanguagePackage[]
      let languages: SimpleLanguage[] = packages.map((lang: LanguagePackage) => {
        const code = isSource ? lang.source_code : lang.target_code
        const name = isSource ? lang.source_name : lang.target_name
        return { code, name }
      })
      // REMOVE DUPLICATES
      languages = languages.filter(
        (a: SimpleLanguage, index: number, array: SimpleLanguage[]) => array.findIndex((b: SimpleLanguage) => b.code === a.code) === index
      )
      // SORT BY NAME
      languages.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))

      const selectedIndex: number = languages.findIndex((lang: SimpleLanguage) => lang.code == selectedCode)
      let selected: SimpleLanguage[] = [languages[0]]

      const selectList: ReactElement[] = []
      if (selectedIndex > 0) {
        selected = languages.splice(selectedIndex, 1)
        selectList.push(
          <option key={0} value={selected[0].code}>
            {selected[0].name}
          </option>
        )
      }
      for (let index = 0; index < languages.length; index++) {
        const code = languages[index].code
        const name = languages[index].name
        selectList.push(
          <option key={index + 1} value={code}>
            {name}
          </option>
        )
      }
      setSelectOptions(selectList)
    }
  }, [isSource, storeKey])

  return (
    <div className={`${className} flex flex-row gap-2`}>
      <span className="text-sm/6 font-medium text-white">{title}</span>
      <Select ref={selectRef} className={`bg-white`} onChange={selectChange}>
        {selectOptions}
      </Select>
    </div>
  )
}
