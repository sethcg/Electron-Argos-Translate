import { ChevronRightIcon, ChevronLeftIcon, LanguageIcon, Cog8ToothIcon, ListBulletIcon } from '@heroicons/react/24/outline'
import { useState, useLayoutEffect, ReactElement, FunctionComponent } from 'react'
import { SidebarItem } from './SidebarItem'

type NavBarItem = {
  icon: ReactElement
  text: string
  active: boolean
}

export const Sidebar: FunctionComponent = () => {
  const [expanded, setExpanded] = useState(false)

  const navBarItems: NavBarItem[] = [
    {
      icon: <LanguageIcon strokeWidth={1.75} />,
      text: 'Translate',
      active: true,
    },
    {
      icon: <ListBulletIcon strokeWidth={1.75} />,
      text: 'Languages',
      active: false,
    },
    {
      icon: <Cog8ToothIcon strokeWidth={1.75} />,
      text: 'Settings',
      active: false,
    },
  ]

  // WHEN THE WINDOW GETS TOO SMALL, HIDE EXPANDED SIDEBAR
  useLayoutEffect(() => {
    function updateSize() {
      if (window.innerWidth < 800) {
        setExpanded(false)
      }
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [setExpanded])

  return (
    <div className={`w-1/3 w-min-[64px] min-w-[] flex-shrink flex-grow-0 transition-all ${expanded ? 'w-1/3' : 'w-[64px]'}`}>
      <nav className="flex h-full flex-col items-center justify-between bg-neutral-800 border-r-2 border-neutral-900 shadow-sm">
        <ul className="flex flex-col py-2 overflow-hidden items-center justify-between">
          {navBarItems.map((item: NavBarItem, index: number) => (
            <SidebarItem key={index} expanded={expanded} {...item} />
          ))}
        </ul>
        <div className={`hidden md:flex w-full py-2 ${expanded ? 'px-2 justify-end' : 'justify-center'}`}>
          <button
            className="w-[36px] rounded-lg bg-white p-1.5 hover:bg-gray-200"
            onClick={() => setExpanded((current: boolean) => !current)}
          >
            <span className="h-6 w-6">
              {expanded ? (
                <ChevronRightIcon className="h-6 w-6" strokeWidth={2} />
              ) : (
                <ChevronLeftIcon className="h-6 w-6" strokeWidth={2} />
              )}
            </span>
            <span className={`overflow-hidden text-start transition-all`} />
          </button>
        </div>
      </nav>
    </div>
  )
}
