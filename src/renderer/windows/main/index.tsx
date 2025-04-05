import { WindowBar } from '~components/global/Windowbar.tsx'
import { Sidebar, NavBarItem } from '~components/global/Sidebar.tsx'
import { TranslatePage } from '~components/pages/TranslatePage'

function App() {
  // const handleClick = (_event, navItems: NavBarItem[]) => {
  const handleClick = (navItems: NavBarItem[]) => {
    console.log(navItems)
  }

  return (
    <>
      <div className="flex flex-col w-full min-h-[inherit]">
        <WindowBar />
        <div className="grow flex flex-row overflow-hidden">
          <Sidebar pageChange={handleClick} />
          <div className="grow p-2 overflow-auto">
            {/* CONTENT AREA */}
            <TranslatePage />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
