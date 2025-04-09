import { FunctionComponent, RefObject } from 'react'
import { Button } from '@headlessui/react'
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline'
import { SimpleLanguage } from './LanguageSelect'

interface Props {
  className?: string
  inputSelectState: SimpleLanguage
  outputSelectState: SimpleLanguage
  setInputSelectState: React.Dispatch<React.SetStateAction<SimpleLanguage>>
  setOutputSelectState: React.Dispatch<React.SetStateAction<SimpleLanguage>>
  inputTextRef: RefObject<HTMLInputElement | null>
  outputTextRef: RefObject<HTMLInputElement | null>
  translateCallback: () => void
}

export const LanguageSwapButton: FunctionComponent<Props> = ({
  className = '',
  inputSelectState,
  outputSelectState,
  setInputSelectState,
  setOutputSelectState,
  inputTextRef,
  outputTextRef,
  translateCallback,
}) => {
  async function swapLanguages(): Promise<void> {
    if (inputSelectState && outputSelectState && inputTextRef.current && outputTextRef.current) {
      // CHECK IF ANY VALUES ARE EMPTY OR DEFAULT (SHOULD NOT SWAP IN THESE CASES)
      const anyDefaultOrEmpty: boolean = [
        inputSelectState.code,
        outputSelectState.code,
        inputTextRef.current.value,
        outputTextRef.current.value,
      ].some((value: string) => value.length <= 0)
      if (anyDefaultOrEmpty) return

      const source: string = (await window.main.store.get('language.source_code')) as string
      const target: string = (await window.main.store.get('language.target_code')) as string

      // SWAP LANGUAGES IN THE CONFIG
      window.main.store.set('language.source_code', target)
      window.main.store.set('language.target_code', source)

      // SWAP LANGUAGES ON THE SELECT BUTTONS
      const tempSelect: SimpleLanguage = inputSelectState
      setInputSelectState(outputSelectState)
      setOutputSelectState(tempSelect)

      // SWAP TEXT ON THE LANGUAGE TEXT AREAS
      const tempText: string = inputTextRef.current.value
      inputTextRef.current.value = outputTextRef.current.value
      outputTextRef.current.value = tempText

      // CALL TRANSLATE, TO UPDATE OUTPUT AFTER SWAP
      translateCallback()
    }
  }
  return (
    <>
      <Button
        className={`${className} flex justify-center items-center size-8 px-1 rounded-full text-white hover:bg-gray-500 hover:text-neutral-950`}
        onClick={swapLanguages}
      >
        <ArrowsRightLeftIcon strokeWidth={2} className={'size-6'} />
      </Button>
    </>
  )
}
