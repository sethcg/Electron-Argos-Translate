import { useRef } from 'react'
import { TranslateButton } from '../../components/translate/translate-button.tsx'
import { TextArea } from '../../components/translate/text-area.tsx'

function App() {
  const inputTextRef = useRef<HTMLInputElement>(null)
  const outputTextRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <div className='flex flex-col justify-items-center items-center min-h-screen gap-6 px-4 pt-2'>
        <div className='flex flex-row w-full h-64 gap-4'>
          <TextArea title={'Translate from'} isSource={true} storeKey={'language.source_code'} textRef={inputTextRef} />
          <TextArea title={'Translate to'} isSource={false}  storeKey={'language.target_code'} textRef={outputTextRef} />
        </div>
        <TranslateButton className={'self-start'} inputTextRef={inputTextRef} outputTextRef={outputTextRef} />
      </div>
    </>
  )
}

export default App
