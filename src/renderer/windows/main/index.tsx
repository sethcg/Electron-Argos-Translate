import { WindowBar } from '~components/global/Windowbar.tsx'
import { Sidebar } from '~components/global/Sidebar.tsx'
import { TranslatePage } from '~components/pages/TranslatePage'
import { ReactElement, useEffect, useState } from 'react'

function App() {
  const [darkMode, setDarkMode] = useState<string>('')
  useEffect(() => {
    async function getDarkMode() {
      const isDarkMode: boolean = (await window.main.store.get('dark_mode')) as boolean
      setDarkMode(isDarkMode ? 'dark' : '')
    }
    getDarkMode()
  }, [])

  const [pageState, setPageState] = useState<ReactElement>(<TranslatePage />)
  const handlePageChange = (content: ReactElement) => setPageState(content)
  useEffect(() => {}, [pageState])

  return (
    <>
      <div className={`${darkMode} flex flex-col w-full min-h-screen text-charcoal-950 dark:text-charcoal-50`}>
        <WindowBar />
        <div className="grow flex flex-row dark:bg-charcoal-600 bg-charcoal-100">
          <Sidebar pageChange={handlePageChange} />
          <div className="grow flex flex-col">{pageState}</div>
        </div>
      </div>
    </>
  )
}

export default App
