import { FunctionComponent } from 'react'
import { LanguageList } from '~components/languages/LanguageList'

export const LanguagePage: FunctionComponent = () => {
  return (
    <div className="grow flex flex-col max-h-(--content-max-height) py-2 px-4">
      <div className="font-extrabold text-3xl pb-4 self-center">LANGUAGE LIST</div>
      <LanguageList />
    </div>
  )
}
