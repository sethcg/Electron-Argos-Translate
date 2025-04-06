import { FunctionComponent, RefObject } from 'react'
import { Button } from '@headlessui/react'
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline'

interface Props {
  className: string
  defaultTargetValue: string
  inputSelectRef: RefObject<HTMLInputElement | null>
  outputSelectRef: RefObject<HTMLInputElement | null>
  inputTextRef: RefObject<HTMLInputElement | null>
  outputTextRef: RefObject<HTMLInputElement | null>
}

export const LanguageSwapButton: FunctionComponent<Props> = ({
  defaultTargetValue,
  className,
  inputSelectRef,
  outputSelectRef,
  inputTextRef,
  outputTextRef,
}) => {
  async function swapLanguages(): Promise<void> {
    if (inputSelectRef.current && outputSelectRef.current && inputTextRef.current && outputTextRef.current) {
      // CHECK IF ANY VALUES ARE EMPTY OR DEFAULT (SHOULD NOT SWAP IN THESE CASES)
      const anyDefaultOrEmpty: boolean = [
        inputSelectRef.current.value,
        outputSelectRef.current.value,
        inputTextRef.current.value,
        outputTextRef.current.value,
      ].some((value: string) => value.length <= 0 || value == defaultTargetValue)
      if (anyDefaultOrEmpty) return

      const source: string = (await window.main.store.get('language.source_code')) as string
      const target: string = (await window.main.store.get('language.target_code')) as string

      // SWAP LANGUAGES IN THE CONFIG
      window.main.store.set('language.source_code', target)
      window.main.store.set('language.target_code', source)

      // SWAP LANGUAGES ON THE SELECT BUTTONS
      const tempSelect: string = inputSelectRef.current.value
      inputSelectRef.current.value = outputSelectRef.current.value
      outputSelectRef.current.value = tempSelect

      // SWAP TEXT ON THE LANGUAGE TEXT AREAS
      const tempText: string = inputTextRef.current.value
      inputTextRef.current.value = outputTextRef.current.value
      outputTextRef.current.value = tempText

      // SOURCE OR TARGET CHANGED, SETUP TRANSLATOR
      window.api.setup()
    }
  }
  return (
    <>
      <Button
        className={`${className} flex justify-center items-center size-8 px-1 rounded-full text-white hover:bg-gray-500 hover:text-neutral-900`}
        onClick={swapLanguages}
      >
        <ArrowsRightLeftIcon strokeWidth={2} className={'size-6'} />
      </Button>
    </>
  )
}
