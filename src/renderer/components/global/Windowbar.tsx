import { FunctionComponent } from 'react'
import * as Icon from 'react-feather'

export const WindowBar: FunctionComponent = () => {
  return (
    <div className="flex h-[24px] bg-neutral-800 border-b-2 border-neutral-900 shadow-sm">
      <div className="grow window-drag" /> {/* Draggable Bar */}
      <div className="grid grid-cols-3 h-full w-[72px]">
        <button className="flex justify-center items-center outline-none hover:bg-neutral-700" onClick={window.main.minimizeWindow}>
          <Icon.Minus size="20" />
        </button>

        <button className="flex justify-center items-center outline-none hover:bg-neutral-700" onClick={window.main.maximizeWindow}>
          <Icon.Square size="16" className="justify-center" />
        </button>

        <button className="flex justify-center items-center outline-none hover:bg-red-500" onClick={window.main.closeWindow}>
          <Icon.X size="20" className="justify-center" />
        </button>
      </div>
    </div>
  )
}
