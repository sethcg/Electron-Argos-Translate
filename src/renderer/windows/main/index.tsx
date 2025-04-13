import { WindowBar } from '~components/global/Windowbar.tsx'
import { Sidebar } from '~components/global/Sidebar.tsx'
import { TranslatePage } from '~components/pages/TranslatePage'
import { ReactElement, useEffect, useState } from 'react'

function App() {
  const [pageState, setPageState] = useState<ReactElement>(<TranslatePage />)
  const handlePageChange = (content: ReactElement) => setPageState(content)
  useEffect(() => {}, [pageState])

  return (
    <>
      <div className="flex flex-col w-full min-h-[inherit]">
        <WindowBar />
        <div className="grow flex flex-row">
          <Sidebar pageChange={handlePageChange} />
          <div className="grow flex flex-col">{pageState}</div>
        </div>
      </div>
    </>
  )
}

export default App
