import { useRef } from 'react'
import { Button, Description, Field, Input, Label } from '@headlessui/react'
import { TranslateResponse } from '~shared/types'

function App() {
  // const minimizeWindow = window.minimizeWindow;
  // const maximizeWindow = window.maximizeWindow;
  // const restoreWindow = window.restoreWindow;
  // const closeWindow = window.main.closeWindow

  const inputRef = useRef<HTMLInputElement>(null)

  async function handleClick(): Promise<void> {
    window.main.store.set('language.source_code', 'en')
    window.main.store.set('language.target_code', 'es')
    const source: string = (await window.main.store.get('language.source_code')) as string
    const target: string = (await window.main.store.get('language.target_code')) as string

    console.log(`SOURCE: ${source}`)
    console.log(`TARGET: ${target}`)

    if (inputRef.current) {
      const translation: TranslateResponse | undefined = await window.api.translate(
        source,
        target,
        inputRef.current.value
      )
      if (translation) console.log(translation)
    }
  }

  return (
    <>
      <div>
        <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleClick}>
          Press To Translate
        </Button>
        <Field className="mt-4 font-semibold">
          <Label>Test</Label>
          <Description>Translate a word or phrase from english to spanish.</Description>
          <Input
            ref={inputRef}
            type="text"
            placeholder="Type here..."
            className="bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded"
          />
        </Field>
      </div>
    </>
  )
}

export default App
