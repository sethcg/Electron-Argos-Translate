import { useRef } from 'react'
import { TranslateButton } from '~components/translate/TranslateButton.tsx'
import { WindowBar } from '~components/global/Windowbar.tsx'
import { Sidebar } from '~components/global/Sidebar.tsx'
import { TextArea } from '~components/translate/TextArea.tsx'

function App() {
  const inputTextRef = useRef<HTMLInputElement>(null)
  const outputTextRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <div className="flex flex-col w-full min-h-[inherit]">
        <WindowBar />
        <div className="grow flex flex-row overflow-hidden">
          <Sidebar />
          <div className="grow p-2 overflow-auto">
            {/* CONTENT AREA */}
            <div className="grow flex flex-col gap-6 px-4 pt-2">
              <div className="flex flex-row w-full h-64 gap-4">
                <TextArea title={'Translate from'} isSource={true} storeKey={'language.source_code'} textRef={inputTextRef} />
                <TextArea title={'Translate to'} isSource={false} storeKey={'language.target_code'} textRef={outputTextRef} />
              </div>
              <TranslateButton className={'self-start'} inputTextRef={inputTextRef} outputTextRef={outputTextRef} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
