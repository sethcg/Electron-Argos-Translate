import { WindowBar } from '~components/global/Windowbar.tsx'
import { Sidebar } from '~components/global/Sidebar.tsx'
import { TranslatePage } from '~components/pages/TranslatePage'
import { ReactElement, useCallback, useEffect, useState } from 'react'

function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true)

  useEffect(() => {
    async function getDarkMode() {
      localStorage.removeItem('darkMode')
      const isDarkMode: boolean = (await window.main.store.get('dark_mode')) as boolean
      setIsDarkMode(isDarkMode)
      localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false')
    }
    getDarkMode()

    // SET DARK MODE TOGGLE LISTENER
    window.main.removeListeners('colorScheme:changed')
    window.main.setMaxListeners(1)
    window.main.colorSchemeChanged(async (isDarkMode: boolean) => {
      setIsDarkMode(isDarkMode)
      window.main.store.set('dark_mode', isDarkMode)
    })
  }, [])

  const [pageState, setPageState] = useState<ReactElement>(<TranslatePage />)
  const changePage = useCallback((content: ReactElement) => setPageState(content), [])

  return (
    <>
      <div className={`${isDarkMode ? 'dark' : ''} flex flex-col w-full min-h-screen text-charcoal-950 dark:text-charcoal-50`}>
        <WindowBar />
        <div className="grow flex flex-row dark:bg-charcoal-600 bg-charcoal-100 transition-[background-color] duration-700">
          <Sidebar callback={changePage} />
          <div className="grow flex flex-col max-h-(--content-max-height)">{pageState}</div>
        </div>
      </div>
    </>
  )
}

export default App
