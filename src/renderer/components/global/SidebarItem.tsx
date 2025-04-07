import { FunctionComponent, ReactElement, useEffect, useMemo } from 'react'

interface Props {
  id: number
  icon: ReactElement
  text: string
  expanded: boolean
  active: boolean
  handleUpdate: (id: number, active: boolean) => void
}

export const SidebarItem: FunctionComponent<Props> = ({ id, icon, text, handleUpdate, active, expanded = false }) => {
  useEffect(() => {}, [expanded])

  return (
    <li className={`font-roboto font-extrabold text-xl ${expanded ? 'mx-2' : ''}`}>
      {useMemo(() => {
        return (
          <button
            className={`relative flex flex-row cursor-pointer items-center rounded-md p-2 
          ${
            active
              ? 'text-neutral-950 bg-gradient-to-tr from-0% from-gray-700 to-gray-600'
              : 'text-white hover:bg-gray-500 hover:text-neutral-900'
          }
          `}
            onClick={() => {
              handleUpdate(id, true)
            }}
          >
            <span className="flex size-8 justify-center">{icon}</span>
            <span className={`overflow-hidden text-start transition-all ${expanded ? 'pl-4 w-32' : 'w-0'}`}>{text}</span>
          </button>
        )
      }, [active, expanded, handleUpdate, icon, id, text])}
    </li>
  )
}
