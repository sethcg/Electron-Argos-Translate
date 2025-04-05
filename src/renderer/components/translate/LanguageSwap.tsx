import { FunctionComponent, RefObject } from 'react'
import { Button } from '@headlessui/react'
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline'


interface Props {
  className: string
  inputSelectRef: RefObject<HTMLInputElement | null>
  outputSelectRef: RefObject<HTMLInputElement | null>
  inputTextRef: RefObject<HTMLInputElement | null>
  outputTextRef: RefObject<HTMLInputElement | null>
}

export const LanguageSwapButton: FunctionComponent<Props> = ({ className, inputSelectRef, outputSelectRef , inputTextRef, outputTextRef }) => {
  
async function swapLanguages(): Promise<void> {
    const source: string = (await window.main.store.get('language.source_code')) as string
    const target: string = (await window.main.store.get('language.target_code')) as string

    // SWAP LANGUAGES IN THE CONFIG
    window.main.store.set('language.source_code', target)
    window.main.store.set('language.target_code', source)

    console.log(`SOURCE: ${source}\tTARGET: ${target}`)

    // SWAP LANGUAGES ON THE SELECT BUTTONS
    if(inputSelectRef.current && outputSelectRef.current) {
        const temp: string = inputSelectRef.current.value
        inputSelectRef.current.value = outputSelectRef.current.value
        outputSelectRef.current.value = temp
    }

    // SWAP TEXT ON THE LANGUAGE TEXT AREAS
    if(inputTextRef.current && outputTextRef.current) {
        const temp: string = inputTextRef.current.value
        inputTextRef.current.value = outputTextRef.current.value
        outputTextRef.current.value = temp
    }

  }
  return (
    <>
      <Button className={`${className} flex justify-center items-center size-8 px-1 rounded-full text-white hover:bg-gray-500 hover:text-neutral-900`} onClick={swapLanguages}>
        <ArrowsRightLeftIcon strokeWidth={2} className={'size-6'} />
      </Button>
    </>
  )
}
