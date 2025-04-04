import { FunctionComponent, RefObject } from 'react'
import { Button } from '@headlessui/react'
import { TranslateResponse } from '~shared/types'

interface Props {
  className: string,
  inputTextRef: RefObject<HTMLInputElement | null>,
  outputTextRef: RefObject<HTMLInputElement | null>, 
}

export const TranslateButton: FunctionComponent<Props> = ({ className, inputTextRef, outputTextRef }) => {

  async function translate(): Promise<void> {
    const source: string = (await window.main.store.get('language.source_code')) as string
    const target: string = (await window.main.store.get('language.target_code')) as string

    console.log(`SOURCE: ${source}\tTARGET: ${target}`)

    if (inputTextRef.current) {
      const translation: TranslateResponse | undefined = await window.api.translate(source, target, inputTextRef.current.value)
      if (translation) {
        if(outputTextRef.current) {
          outputTextRef.current.value = translation.text
        }
        console.log(translation)
      }
    }
  }
    return (
      <>
      <Button className={`${className} bg-white text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group`} onClick={ translate }>
          <div className="bg-green-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
              <svg className="w-6 h-6 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"/>
              </svg>
          </div>
          <p className="translate-x-2">Translate</p>
      </Button>
      </>
    )
}

