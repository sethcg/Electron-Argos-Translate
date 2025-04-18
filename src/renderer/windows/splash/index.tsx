import { useEffect, useState } from 'react'

function App() {
  const [darkMode, setDarkMode] = useState<string>('')
  useEffect(() => {
    async function getDarkMode() {
      const isDarkMode: boolean = (await window.main.store.get('dark_mode')) as boolean
      setDarkMode(isDarkMode ? 'dark' : '')
    }
    getDarkMode()
  }, [darkMode])

  return (
    <>
      <div
        className={`${darkMode} flex flex-col gap-6 min-h-screen items-center justify-center rounded-lg bg-charcoal-200 dark:bg-charcoal-800`}>
        <div className="flex flex-row gap-2">
          <div className="w-4 h-4 rounded-full bg-charcoal-700 dark:bg-charcoal-50 animate-bounce"></div>
          <div className="w-4 h-4 rounded-full bg-charcoal-700 dark:bg-charcoal-50 animate-bounce [animation-delay:-.2s]"></div>
          <div className="w-4 h-4 rounded-full bg-charcoal-700 dark:bg-charcoal-50 animate-bounce [animation-delay:-.4s]"></div>
        </div>
      </div>
    </>
  )
}

export default App
