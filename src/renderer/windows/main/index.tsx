import { useRef } from 'react'
import { Button, Description, Field, Input, Label } from '@headlessui/react'

function App() {
  // const minimizeWindow = window.minimizeWindow;
  // const maximizeWindow = window.maximizeWindow;
  // const restoreWindow = window.restoreWindow;
  // const closeWindow = window.main.closeWindow

  const inputRef = useRef<HTMLInputElement>(null)

  async function handleClick(): Promise<void> {
    let translation: string | undefined = undefined
    if (inputRef.current) {
      translation = await window.api.translate('en', 'es', inputRef.current.value)
      if (translation) {
        console.log(translation)
      }
    } else {
      console.log('NOT TRANSLATED')
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
