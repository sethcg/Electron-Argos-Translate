import { FunctionComponent } from 'react'
import { LanguageList } from '~components/languages/LanguageList'

export const LanguagePage: FunctionComponent = () => {
  return (
    <div className="grow flex flex-col max-h-(--content-max-height) py-2 px-4 items-center">
      <div className="font-extrabold text-3xl transition-[color] duration-700">LANGUAGE LIST</div>
      <div className="justify-center flex w-full max-h-(--content-max-height) overflow-auto">
        <LanguageList />
      </div>
    </div>
  )
}
