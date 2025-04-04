import { FunctionComponent, useEffect } from 'react'

interface Props {
  active?: boolean
  icon: React.ReactNode
  text: string
  expanded: boolean
}

export const SidebarItem: FunctionComponent<Props> = ({ icon, text, active = false, expanded = false }) => {
  useEffect(() => {}, [expanded])

  return (
    <li className={`${expanded ? 'mx-2' : ''}`}>
      <button
        className={`relative my-1 flex cursor-pointer
        items-center rounded-md p-3 font-medium transition-colors
        ${
          active
            ? 'text-black bg-gradient-to-tr from-10% from-emerald-400 to-emerald-100'
            : 'text-white hover:bg-emerald-200 hover:text-black'
        }
    `}
        onClick={() => {}}
      >
        <span className="h-6 w-6">{icon}</span>
        <span className={`overflow-hidden text-start transition-all ${expanded ? 'ml-3 w-44' : 'w-0'}`}>{text}</span>
      </button>
    </li>
  )
}
